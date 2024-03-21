/**
 * Promise 并行限制器
 */
export class PPLimiter {
  private parallel: number;
  private active = 0;
  private queue: Task[] = [];

  /**
   * 构造函数
   * @param parallel 并行数
   */
  constructor(parallel: number) {
    /**
     * 并行数检查
     * 并行数必须大于 1，否则自动设置为 1。
     * 并行数为 1 时，相当于串行执行
     */
    if (parallel < 1) {
      console.warn("PPLimiter: 并行数必须大于 1, 已自动设置为 1");
      parallel = 1;
    }
    this.parallel = parallel;
  }

  /**
   * 添加任务
   * @param task 匿名函数包装的 Promise 任务，防止 Promise 立即执行
   * @returns Promise
   */
  add<T = any>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
      });
      this.run();
    });
  }

  /**
   * 执行调度函数
   * - 如果队列中有任务且当前并行数未达到上限，则从队列中取出任务执行，直到并行数达到上限或队列为空
   * - 当队列中的任务执行完毕，递归执行调度函数
   */
  private run(): void {
    while (this.active < this.parallel && this.queue.length > 0) {
      const taskObject = this.queue.shift();
      if (!taskObject) {
        return this.run();
      }
      const { task, resolve, reject } = taskObject;
      this.active++;
      task()
        .then(resolve, reject)
        .finally(() => {
          this.active--;
          this.run();
        });
    }
  }
}

/**
 * Promise 任务结构
 */
type Task<T = any> = {
  task: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};
