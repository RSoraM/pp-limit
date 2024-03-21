# pp-limit

[![npm version][npm-version-src]][npm-version-href]
[![bundle size][bundle-src]][bundle-href]
[![MIT License][license-src]][license-href]

Parallel Promise Limiter (pp-limit) 是一个 Promise 并发控制器，可以控制同时进行的任务数量。

## 安装

```sh
pnpm i @rsoram/pp-limit
```

## 使用

### 初始化

允许同时运行 5 个任务的并行控制器

```ts
import { PPLimiter } from "@rsoram/pp-limit";
const ppl = new PPLimiter(5);
```

### add

`add` 函数接收一个普通函数，该函数须返回一个 Promise，以此防止 Promise 被立即执行

`add` 函数返回的 Promise 可视作输入的 Promise

#### Example: 添加任务

```ts
ppl
  .add(() => new Promise((resolve) => resolve(1)))
  .then((result) => console.log(`${result} == 1`)); // 1 == 1
```

#### Example: 并发控制

```ts
const tasks = Array.from(
  { length: 20 },
  (_, i) => () => new Promise((resolve) => resolve(i)),
);

await Promise.all(tasks.map((t) => ppl.add(t)));
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@rsoram/pp-limit?style=flat-square
[npm-version-href]: https://npmjs.com/package/@rsoram/pp-limit
[npm-downloads-src]: https://img.shields.io/npm/dm/@rsoram/pp-limit?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@rsoram/pp-limit
[bundle-src]: https://flat.badgen.net/bundlephobia/minzip/@rsoram/pp-limit
[bundle-href]: https://bundlephobia.com/package/@rsoram/pp-limit
[license-src]: https://img.shields.io/badge/License-MIT-green.svg
[license-href]: https://choosealicense.com/licenses/mit/
