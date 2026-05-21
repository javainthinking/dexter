'use client';

import * as React from 'react';
import { Bug, ImagePlus, Lightbulb, Loader2, MessageSquare, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useDictionary, format } from '../../../components/i18n/dictionary-provider';
import { cn } from '../../../lib/utils';

/** Max bytes per file — must match the server's MAX_FILE_BYTES. */
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_COUNT = 3;

type FeedbackType = 'bug' | 'feature' | 'general';

interface PendingFile {
  /** Stable per-attachment id for React keys + progress tracking. */
  id: string;
  /** The original File from the input/dropzone. */
  file: File;
  /** ObjectURL for the preview thumbnail; revoked on remove. */
  previewUrl: string;
  /** 0–100 during PUT; null when not yet uploading. */
  progress: number | null;
  /** Set when the PUT completes successfully — final R2 key. */
  uploadedKey: string | null;
  /** Set when validation fails or PUT errors. */
  error: string | null;
}

interface UploadUrlResponse {
  uploads: Array<{ uploadUrl: string; key: string; expiresAt: string }>;
}

/**
 * Client-side upload flow:
 *   1. User picks files; we validate size/count locally for instant feedback
 *   2. On submit, we POST file metadata to /api/feedback/upload-url and get
 *      one presigned PUT URL per file
 *   3. We PUT each file directly to R2 in parallel (XHR for progress events)
 *   4. We POST the feedback form + the resulting object keys to /api/feedback
 *
 * The server never sees the binary — it just signs URLs and saves the keys.
 * This keeps Vercel functions cheap and the upload as fast as the user's
 * connection to R2 allows.
 */
export function FeedbackClient() {
  const dict = useDictionary();
  const [type, setType] = React.useState<FeedbackType>('general');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [files, setFiles] = React.useState<PendingFile[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [successId, setSuccessId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Revoke preview ObjectURLs on unmount / when files change to avoid
  // leaking blob memory.
  React.useEffect(() => {
    return () => {
      for (const f of files) URL.revokeObjectURL(f.previewUrl);
    };
    // We intentionally don't depend on `files` — the revoke happens
    // in `removeFile` and on unmount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(picked: FileList | File[]) {
    const arr = Array.from(picked);
    const remaining = MAX_FILE_COUNT - files.length;
    if (remaining <= 0) {
      setSubmitError(format(dict.feedback.errors.tooMany, { max: MAX_FILE_COUNT }));
      return;
    }
    const accepted: PendingFile[] = [];
    for (const file of arr.slice(0, remaining)) {
      if (!file.type.startsWith('image/')) {
        setSubmitError(format(dict.feedback.errors.unsupportedType, { name: file.name }));
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setSubmitError(
          format(dict.feedback.errors.tooLarge, {
            name: file.name,
            max: '10 MB',
          }),
        );
        continue;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: null,
        uploadedKey: null,
        error: null,
      });
    }
    if (accepted.length > 0) {
      setSubmitError(null);
      setFiles((prev) => [...prev, ...accepted]);
    }
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  async function putWithProgress(
    uploadUrl: string,
    file: File,
    onProgress: (pct: number) => void,
  ): Promise<void> {
    // XHR (not fetch) because fetch lacks an `onprogress` event for
    // request bodies in browsers. The presigned URL was signed with
    // the file's content-type, so we have to send the same header here.
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) onProgress(Math.round((ev.loaded / ev.total) * 100));
      };
      xhr.onload = () => {
        // R2 returns 200 (or 204) on success.
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`upload_failed_${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error('upload_network_error'));
      xhr.onabort = () => reject(new Error('upload_aborted'));
      xhr.send(file);
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const trimmed = message.trim();
    if (!trimmed) {
      setSubmitError(dict.feedback.errors.messageRequired);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1 + 2: request presigned URLs, then PUT each file
      let attachments: Array<{
        key: string;
        contentType: string;
        byteLength: number;
        originalName: string;
      }> = [];
      if (files.length > 0) {
        const res = await fetch('/api/feedback/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: files.map((f) => ({
              name: f.file.name,
              contentType: f.file.type,
              size: f.file.size,
            })),
          }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? 'upload_url_failed');
        }
        const { uploads } = (await res.json()) as UploadUrlResponse;
        if (uploads.length !== files.length) {
          throw new Error('upload_url_count_mismatch');
        }

        await Promise.all(
          files.map(async (f, i) => {
            const { uploadUrl, key } = uploads[i];
            setFiles((prev) =>
              prev.map((p) => (p.id === f.id ? { ...p, progress: 0 } : p)),
            );
            try {
              await putWithProgress(uploadUrl, f.file, (pct) => {
                setFiles((prev) =>
                  prev.map((p) => (p.id === f.id ? { ...p, progress: pct } : p)),
                );
              });
              setFiles((prev) =>
                prev.map((p) =>
                  p.id === f.id ? { ...p, uploadedKey: key, progress: 100 } : p,
                ),
              );
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              setFiles((prev) =>
                prev.map((p) => (p.id === f.id ? { ...p, error: msg } : p)),
              );
              throw err;
            }
          }),
        );

        attachments = files.map((f, i) => ({
          key: uploads[i].key,
          contentType: f.file.type,
          byteLength: f.file.size,
          originalName: f.file.name,
        }));
      }

      // Step 3: POST the feedback row
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          subject: subject.trim() || null,
          message: trimmed,
          attachments,
          pageUrl: typeof window !== 'undefined' ? window.location.href : null,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? 'feedback_failed');
      }
      const j = (await res.json()) as { id: string };
      setSuccessId(j.id);
      // Reset form so the user can submit another without a page reload.
      setType('general');
      setSubject('');
      setMessage('');
      for (const f of files) URL.revokeObjectURL(f.previewUrl);
      setFiles([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError(mapErrorMessage(msg, dict));
    } finally {
      setSubmitting(false);
    }
  }

  const typeOptions: Array<{ value: FeedbackType; label: string; icon: React.ReactNode }> = [
    { value: 'bug', label: dict.feedback.types.bug, icon: <Bug className="size-4" /> },
    { value: 'feature', label: dict.feedback.types.feature, icon: <Lightbulb className="size-4" /> },
    { value: 'general', label: dict.feedback.types.general, icon: <MessageSquare className="size-4" /> },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight">
          {dict.feedback.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{dict.feedback.subtitle}</p>
      </header>

      {successId ? (
        <div className="rounded-lg border border-[color:var(--positive)]/40 bg-[color:var(--positive)]/10 p-4 text-sm">
          <p className="font-medium text-foreground">{dict.feedback.success.title}</p>
          <p className="mt-1 text-muted-foreground">
            {format(dict.feedback.success.body, { id: successId })}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSuccessId(null)}
            className="mt-3"
          >
            {dict.feedback.success.again}
          </Button>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-subtle">
            {dict.feedback.fields.type}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors',
                  type === opt.value
                    ? 'border-foreground bg-muted text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-border-strong',
                )}
                aria-pressed={type === opt.value}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="feedback-subject"
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-subtle"
          >
            {dict.feedback.fields.subject}
          </label>
          <input
            id="feedback-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
            placeholder={dict.feedback.fields.subjectPlaceholder}
            className="block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-subtle focus:border-border-strong focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="feedback-message"
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-subtle"
          >
            {dict.feedback.fields.message} <span className="text-[color:var(--negative)]">*</span>
          </label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            maxLength={8000}
            placeholder={dict.feedback.fields.messagePlaceholder}
            className="block w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-subtle focus:border-border-strong focus:outline-none"
            required
          />
          <p className="mt-1 text-right font-mono text-[10px] text-subtle">
            {message.length} / 8000
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-subtle">
              {dict.feedback.attachments.label}
            </label>
            <span className="font-mono text-[10px] text-subtle">
              {format(dict.feedback.attachments.help, {
                count: files.length,
                max: MAX_FILE_COUNT,
              })}
            </span>
          </div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={onDrop}
            className={cn(
              'rounded-lg border-2 border-dashed border-border bg-card p-4',
              files.length === 0 && 'flex flex-col items-center justify-center py-8 text-center',
            )}
          >
            {files.length === 0 ? (
              <>
                <ImagePlus className="size-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {dict.feedback.attachments.dropzone}
                </p>
                <p className="mt-1 text-xs text-subtle">{dict.feedback.attachments.constraints}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4"
                >
                  {dict.feedback.attachments.choose}
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <ul className="grid grid-cols-3 gap-2">
                  {files.map((f) => (
                    <li
                      key={f.id}
                      className="group relative aspect-square overflow-hidden rounded-md border border-border bg-background"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.previewUrl}
                        alt={f.file.name}
                        className="size-full object-cover"
                      />
                      {f.progress !== null && f.progress < 100 && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-background/50">
                          <div
                            className="h-full bg-[color:var(--info)] transition-[width]"
                            style={{ width: `${f.progress}%` }}
                          />
                        </div>
                      )}
                      {f.error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--negative)]/80 p-2 text-center text-[10px] text-white">
                          {dict.feedback.errors.uploadFailed}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        disabled={submitting}
                        aria-label={dict.feedback.attachments.remove}
                        className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
                {files.length < MAX_FILE_COUNT && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                  >
                    <ImagePlus className="size-3.5" />
                    {dict.feedback.attachments.addMore}
                  </Button>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              // Reset so picking the same file twice still triggers onChange.
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>

        {submitError && (
          <div className="rounded-md border border-[color:var(--negative)]/40 bg-[color:var(--negative)]/10 p-3 text-sm text-foreground">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button type="submit" disabled={submitting || message.trim().length === 0}>
            {submitting && <Loader2 className="size-3.5 animate-spin" />}
            {submitting ? dict.feedback.submitting : dict.feedback.submit}
          </Button>
        </div>
      </form>
    </div>
  );
}

/**
 * Map raw error strings from the server (`upload_url_failed`,
 * `file_too_large`, etc.) into localized user-facing messages.
 * Falls back to the generic copy if we don't have a mapping.
 */
function mapErrorMessage(raw: string, dict: ReturnType<typeof useDictionary>): string {
  switch (raw) {
    case 'unauthenticated':
      return dict.feedback.errors.unauthenticated;
    case 'storage_not_configured':
      return dict.feedback.errors.storageNotConfigured;
    case 'too_many_files':
    case 'too_many_attachments':
      return format(dict.feedback.errors.tooMany, { max: MAX_FILE_COUNT });
    case 'file_too_large':
    case 'invalid_attachment_size':
      return format(dict.feedback.errors.tooLarge, { name: '', max: '10 MB' });
    case 'unsupported_content_type':
    case 'invalid_attachment_content_type':
      return format(dict.feedback.errors.unsupportedType, { name: '' });
    case 'missing_message':
      return dict.feedback.errors.messageRequired;
    case 'message_too_long':
      return dict.feedback.errors.messageTooLong;
    case 'upload_failed_403':
      return dict.feedback.errors.uploadForbidden;
    case 'upload_network_error':
      return dict.feedback.errors.networkError;
    default:
      return dict.feedback.errors.generic;
  }
}
