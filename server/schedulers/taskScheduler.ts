/**
 * Task Scheduler Architecture for JanSamadhan Phase 1 & Future Expansion
 * 
 * Provides an extensible registry for periodic background maintenance:
 * - SLA escalation for unaddressed citizen grievances (>14 days in 'SUBMITTED' status)
 * - Academic challenge sync with AICTE / SIH portal
 * - Automated weekly digest generation for District Magistrates and Nodal Officers
 */

export interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  intervalMs: number;
  lastRun?: Date;
  handler: () => Promise<void>;
  enabled: boolean;
}

export class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  registerTask(task: ScheduledTask): void {
    this.tasks.set(task.id, task);
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[TaskScheduler] Background task scheduler initialized (Phase 1 standby).');

    for (const [id, task] of this.tasks.entries()) {
      if (task.enabled) {
        const timer = setInterval(async () => {
          try {
            task.lastRun = new Date();
            await task.handler();
          } catch (err) {
            console.error(`[TaskScheduler] Error executing task "${task.name}":`, err);
          }
        }, task.intervalMs);
        this.timers.set(id, timer);
      }
    }
  }

  stop(): void {
    for (const timer of this.timers.values()) {
      clearInterval(timer);
    }
    this.timers.clear();
    this.isRunning = false;
    console.log('[TaskScheduler] Task scheduler stopped.');
  }

  listTasks(): Array<Omit<ScheduledTask, 'handler'>> {
    return Array.from(this.tasks.values()).map(({ handler: _, ...rest }) => rest);
  }
}

export const taskScheduler = new TaskScheduler();
