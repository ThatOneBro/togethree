const _DEBUG =
  typeof globalThis.DEBUG === "undefined" ? false : globalThis.DEBUG;
const _ASSERT =
  typeof globalThis.ASSERT === "undefined" ? false : globalThis.ASSERT;

// @ts-ignore
export const debug = function (...rest: any[]): void {
  if (!_DEBUG) return;
  // @ts-ignore
  console.log.apply(console, arguments);
};

export const assert = function (
  statement: boolean,
  err?: string,
  log?: any,
): void {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};
