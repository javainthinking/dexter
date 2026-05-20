import { existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { SkillMetadata, Skill, SkillSource } from './types.js';
import { extractSkillMetadata, loadSkillFromPath } from './loader.js';
import { dexterPath } from '../utils/paths.js';

// Get the directory of this file to locate builtin skills
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Find the first existing directory among `candidates`. Used to resolve
 * skill directories that may live at different absolute paths in
 * different runtimes (source-tree CLI vs Vercel function bundle).
 *
 * Why this matters: in a Next.js webpack server bundle, `__dirname`
 * is the compiled chunk's path inside `.next/server/chunks/`, NOT the
 * source file's directory. Walking relative paths from there will not
 * find `src/skills/` or `apps/web/bin/upstream-skills/`. We have to
 * also probe `process.cwd()`-rooted candidates (cwd on Vercel is the
 * function root, typically `/var/task/apps/web/`).
 */
function firstExisting(label: string, candidates: string[]): string | null {
  for (const c of candidates) {
    if (existsSync(c)) {
      console.log(`[skills] ${label} resolved → ${c}`);
      return c;
    }
  }
  console.log(`[skills] ${label} NOT FOUND. Probed: ${candidates.join(' | ')}`);
  return null;
}

/**
 * Locate the directory holding builtin SKILL.md files (src/skills/
 * in the repo). On Vercel these are pulled into the function bundle
 * via outputFileTracingIncludes (`../src/skills/**\/SKILL.md`) and
 * land at `<deploy>/src/skills/`; `process.cwd()` is the function
 * root, so going up one level catches the bundled tree.
 */
function builtinSkillsDir(): string | null {
  const cwd = process.cwd();
  return firstExisting('builtin', [
    // Vercel + apps/web local: install script mirrored src/skills/ here.
    join(cwd, 'bin', 'builtin-skills'),
    join(cwd, 'apps', 'web', 'bin', 'builtin-skills'),
    // CLI / source-tree fallbacks — read directly from src/skills.
    join(cwd, 'src', 'skills'),
    __dirname,
  ]);
}

/**
 * Locate the upstream-skills directory installed by
 * scripts/install-officecli.ts. Bundled at `apps/web/bin/upstream-skills/`.
 */
function upstreamSkillsDir(): string | null {
  const cwd = process.cwd();
  return firstExisting('upstream', [
    join(cwd, 'bin', 'upstream-skills'),                              // cwd=apps/web (Vercel)
    join(cwd, 'apps', 'web', 'bin', 'upstream-skills'),               // cwd=workspace root
    resolve(__dirname, '..', '..', 'apps', 'web', 'bin', 'upstream-skills'), // source-tree
  ]);
}

/**
 * Skill directories in order of precedence (later overrides earlier).
 * Resolved at module load — null entries (missing dirs) are filtered.
 */
const SKILL_DIRECTORIES: { path: string; source: SkillSource }[] = [
  { path: builtinSkillsDir(), source: 'builtin' },
  { path: upstreamSkillsDir(), source: 'upstream' },
  { path: join(process.cwd(), dexterPath('skills')), source: 'project' },
].filter((d): d is { path: string; source: SkillSource } => d.path !== null);

// Cache for discovered skills (metadata only)
let skillMetadataCache: Map<string, SkillMetadata> | null = null;

/**
 * Scan a directory for SKILL.md files and return their metadata.
 * Looks for directories containing SKILL.md files.
 *
 * @param dirPath - Directory to scan
 * @param source - Source type for discovered skills
 * @returns Array of skill metadata
 */
function scanSkillDirectory(dirPath: string, source: SkillSource): SkillMetadata[] {
  if (!existsSync(dirPath)) {
    return [];
  }

  const skills: SkillMetadata[] = [];
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillFilePath = join(dirPath, entry.name, 'SKILL.md');
      if (existsSync(skillFilePath)) {
        try {
          const metadata = extractSkillMetadata(skillFilePath, source);
          skills.push(metadata);
        } catch {
          // Skip invalid skill files silently
        }
      }
    }
  }

  return skills;
}

/**
 * Discover all available skills from all skill directories.
 * Later sources (project > user > builtin) override earlier ones.
 *
 * @returns Array of skill metadata, deduplicated by name
 */
export function discoverSkills(): SkillMetadata[] {
  if (skillMetadataCache) {
    return Array.from(skillMetadataCache.values());
  }

  skillMetadataCache = new Map();

  for (const { path, source } of SKILL_DIRECTORIES) {
    const skills = scanSkillDirectory(path, source);
    for (const skill of skills) {
      // Later sources override earlier ones (by name)
      skillMetadataCache.set(skill.name, skill);
    }
  }

  return Array.from(skillMetadataCache.values());
}

/**
 * Get a skill by name, loading full instructions.
 *
 * @param name - Name of the skill to load
 * @returns Full skill definition or undefined if not found
 */
export function getSkill(name: string): Skill | undefined {
  // Ensure cache is populated
  if (!skillMetadataCache) {
    discoverSkills();
  }

  const metadata = skillMetadataCache?.get(name);
  if (!metadata) {
    return undefined;
  }

  // Load full skill with instructions
  return loadSkillFromPath(metadata.path, metadata.source);
}

/**
 * Build the skill metadata section for the system prompt.
 * Only includes name and description (lightweight).
 *
 * @returns Formatted string for system prompt injection
 */
export function buildSkillMetadataSection(): string {
  const skills = discoverSkills();

  if (skills.length === 0) {
    return 'No skills available.';
  }

  return skills
    .map((s) => `- **${s.name}**: ${s.description}`)
    .join('\n');
}

/**
 * Clear the skill cache. Useful for testing or when skills are added/removed.
 */
export function clearSkillCache(): void {
  skillMetadataCache = null;
}
