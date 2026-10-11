import type { PickSkillBridge } from '../../shared/ipc';

declare global {
  interface Window {
    pickskill: PickSkillBridge;
  }
}
