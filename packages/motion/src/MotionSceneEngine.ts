import { SceneConfig, MotionProfile, MotionEngineOptions } from './types';

/**
 * MotionSceneEngine: Capa de orquestación de escenas, perfiles de movimiento y optimización de recursos.
 * Desacopla la lógica de scroll y animación de los componentes de presentación.
 */
export class MotionSceneEngine {
  private scenes: Map<string, SceneConfig> = new Map();
  private currentProfile: MotionProfile = 'full';
  private debug: boolean = false;
  private isSuspended: boolean = false;

  constructor(options?: MotionEngineOptions) {
    if (options?.profile) {
      this.currentProfile = options.profile;
    } else {
      this.detectOptimalProfile();
    }
    this.debug = options?.debug ?? false;
  }

  public detectOptimalProfile(): MotionProfile {
    if (typeof window === 'undefined') {
      return 'adaptive';
    }

    // 1. Detectar preferencia de usuario para reducción de movimiento (a11y)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.currentProfile = 'reduced';
      return 'reduced';
    }

    // 2. Detectar dispositivos móviles/baja potencia o conexiones restringidas
    const isMobile = window.innerWidth < 768;
    const isSaveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

    if (isMobile || isSaveData) {
      this.currentProfile = 'adaptive';
      return 'adaptive';
    }

    // 3. Hardware estándar o de alta capacidad
    this.currentProfile = 'full';
    return 'full';
  }

  public getProfile(): MotionProfile {
    return this.currentProfile;
  }

  public registerScene(scene: SceneConfig): void {
    this.scenes.set(scene.id, scene);
    if (this.debug) {
      console.log(`[MotionSceneEngine] Registered scene: ${scene.id} for profiles:`, scene.profile ?? 'all');
    }
  }

  public unregisterScene(id: string): void {
    this.scenes.delete(id);
  }

  public suspend(): void {
    this.isSuspended = true;
    if (this.debug) {
      console.log('[MotionSceneEngine] Suspended all animation loops');
    }
  }

  public resume(): void {
    this.isSuspended = false;
    if (this.debug) {
      console.log('[MotionSceneEngine] Resumed animation loops');
    }
  }

  public canRun(sceneId: string): boolean {
    if (this.isSuspended) return false;
    const scene = this.scenes.get(sceneId);
    if (!scene) return true;
    if (!scene.profile || scene.profile.length === 0) return true;
    return scene.profile.includes(this.currentProfile);
  }

  public destroy(): void {
    this.scenes.clear();
  }
}
