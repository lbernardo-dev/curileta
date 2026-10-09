export type MotionProfile = 'full' | 'adaptive' | 'reduced';

export interface SceneConfig {
  id: string;
  start: number | string;
  end: number | string;
  pin?: boolean;
  scrub?: boolean | number;
  profile?: MotionProfile[];
  preload?: string[];
  onEnter?: () => void;
  onLeave?: () => void;
  onUpdate?: (progress: number) => void;
}

export interface MotionEngineOptions {
  profile?: MotionProfile;
  debug?: boolean;
}
