/**
 * Can be used to monitor JS thread performance
 * Use startTracking() and stopAndGetData() to start and stop tracking
 * Based on FlashList's benchmark implementation
 */
export class JSFPSMonitor {
  private startTime = 0;
  private frameCount = 0;
  private timeWindow = {
    frameCount: 0,
    startTime: 0,
  };

  private minFPS = Number.MAX_SAFE_INTEGER;
  private maxFPS = 0;
  private averageFPS = 0;

  private clearAnimationNumber = 0;

  private measureLoop() {
    // This looks weird but I'm avoiding a new closure
    this.clearAnimationNumber = requestAnimationFrame(this.updateLoopCompute);
  }

  private updateLoopCompute = () => {
    this.frameCount++;
    const elapsedTime = (Date.now() - this.startTime) / 1000;
    this.averageFPS = elapsedTime > 0 ? this.frameCount / elapsedTime : 0;

    this.timeWindow.frameCount++;
    const timeWindowElapsedTime =
      (Date.now() - this.timeWindow.startTime) / 1000;
    if (timeWindowElapsedTime >= 1) {
      const timeWindowAverageFPS =
        this.timeWindow.frameCount / timeWindowElapsedTime;
      this.minFPS = Math.min(this.minFPS, timeWindowAverageFPS);
      this.maxFPS = Math.max(this.maxFPS, timeWindowAverageFPS);
      this.timeWindow.frameCount = 0;
      this.timeWindow.startTime = Date.now();
    }
    this.measureLoop();
  };

  public startTracking() {
    if (this.startTime !== 0) {
      throw new Error("FPS Monitor is already running");
    }
    this.startTime = Date.now();
    this.timeWindow.startTime = Date.now();
    this.measureLoop();
  }

  public stopAndGetData(): JSFPSResult {
    cancelAnimationFrame(this.clearAnimationNumber);
    
    // If we never got a full window, use the average
    if (this.minFPS === Number.MAX_SAFE_INTEGER) {
      this.minFPS = this.averageFPS;
      this.maxFPS = this.averageFPS;
    }
    
    const result = {
      minFPS: Math.round(this.minFPS * 10) / 10,
      maxFPS: Math.round(this.maxFPS * 10) / 10,
      averageFPS: Math.round(this.averageFPS * 10) / 10,
    };

    // Reset for next use
    this.startTime = 0;
    this.frameCount = 0;
    this.timeWindow.frameCount = 0;
    this.timeWindow.startTime = 0;
    this.minFPS = Number.MAX_SAFE_INTEGER;
    this.maxFPS = 0;
    this.averageFPS = 0;
    this.clearAnimationNumber = 0;

    return result;
  }

  /**
   * Get current FPS without stopping the monitor
   * Useful for live updates during benchmarking
   */
  public getCurrentFPS(): number {
    return Math.round(this.averageFPS * 10) / 10;
  }
}

export interface JSFPSResult {
  minFPS: number;
  maxFPS: number;
  averageFPS: number;
  standardDeviation?: number;
}