import { describe, it } from "vitest";
import { PPLimiter } from "../src";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("PPLimiter", () => {
  it.concurrent("2 parallel should cost 1200ms", async () => {
    const ppl = new PPLimiter(2);
    const tasks = Array.from({ length: 6 }, (_, i) => {
      return () => sleep((i + 1) * 100);
    });
    await Promise.all(tasks.map((t) => ppl.add(t)));
  });

  it.concurrent("3 parallel should cost 900ms", async () => {
    const ppl = new PPLimiter(3);
    const tasks = Array.from({ length: 6 }, (_, i) => {
      return () => sleep((i + 1) * 100);
    });
    await Promise.all(tasks.map((t) => ppl.add(t)));
  });

  it.concurrent("4 parallel should cost 800ms", async () => {
    const ppl = new PPLimiter(4);
    const tasks = Array.from({ length: 6 }, (_, i) => {
      return () => sleep((i + 1) * 100);
    });
    await Promise.all(tasks.map((t) => ppl.add(t)));
  });
});
