/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as common from "./util";

const _DEBUG =
  typeof globalThis.DEBUG === "undefined" ? false : globalThis.DEBUG;
const _ASSERT =
  typeof globalThis.ASSERT === "undefined" ? false : globalThis.ASSERT;

// TODO: See if making this into a class actually improves perf
const math: Math & {
  readonly EPSILON: number;
  /**
   * This function is used to ensure that a floating point number is not a NaN or
   * infinity.
   */
  isFinite(x: any): boolean;
  assert(x: any): void;
  /**
   * This is a approximate yet fast inverse square-root (todo).
   */
  invSqrt(x: number): number;
  /**
   * Next Largest Power of 2 Given a binary integer value x, the next largest
   * power of 2 can be computed by a SWAR algorithm that recursively "folds" the
   * upper bits into the lower bits. This process yields a bit vector with the
   * same most significant 1 as x, but all 1's below it. Adding 1 to that value
   * yields the next largest power of 2. For a 32-bit value:
   */
  nextPowerOfTwo(x: number): number;
  isPowerOfTwo(x: number): boolean;
  mod(num: number, min?: number, max?: number): number;
  /**
   * Returns a min if num is less than min, and max if more than max, otherwise returns num.
   */
  clamp(num: number, min: number, max: number): number;
  /**
   * Returns a random number between min and max when two arguments are provided.
   * If one arg is provided between 0 to max.
   * If one arg is passed between 0 to 1.
   */
  random(min?: number, max?: number): number;
} = Object.create(Math);

// @ts-ignore
// noinspection JSConstantReassignment
math.EPSILON = 1e-9; // TODO

math.isFinite = function (x: unknown): boolean {
  return typeof x === "number" && isFinite(x) && !isNaN(x);
};

math.assert = function (x: number): void {
  if (!_ASSERT) return;
  if (!math.isFinite(x)) {
    _DEBUG && common.debug(x);
    throw new Error("Invalid Number!");
  }
};

math.invSqrt = function (x: number): number {
  // TODO:
  return 1 / Math.sqrt(x);
};

math.nextPowerOfTwo = function (x: number): number {
  // TODO
  x |= x >> 1;
  x |= x >> 2;
  x |= x >> 4;
  x |= x >> 8;
  x |= x >> 16;
  return x + 1;
};

math.isPowerOfTwo = function (x: number): boolean {
  return x > 0 && (x & (x - 1)) === 0;
};

math.mod = function (num: number, min?: number, max?: number): number {
  if (typeof min === "undefined") {
    max = 1;
    min = 0;
  } else if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  if (max > min) {
    num = (num - min) % (max - min);
    return num + (num < 0 ? max : min);
  } else {
    num = (num - max) % (min - max);
    return num + (num <= 0 ? min : max);
  }
};

math.clamp = function (num: number, min: number, max: number): number {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
};

math.random = function (min?: number, max?: number): number {
  if (typeof min === "undefined") {
    max = 1;
    min = 0;
  } else if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  return min === max ? min : Math.random() * (max - min) + min;
};

export class Vec2 {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number);
  constructor(obj: { x: number; y: number });
  constructor();
  // tslint:disable-next-line:typedef
  constructor(x?: any, y?: any) {
    if (!(this instanceof Vec2)) {
      return new Vec2(x, y);
    }
    if (typeof x === "undefined") {
      this.x = 0;
      this.y = 0;
    } else if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
    _ASSERT && Vec2.assert(this);
  }

  /** @internal */
  _serialize(): object {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /** @internal */
  static _deserialize(data: any): Vec2 {
    const obj = Object.create(Vec2.prototype);
    obj.x = data.x;
    obj.y = data.y;
    return obj;
  }

  static zero(): Vec2 {
    const obj = Object.create(Vec2.prototype);
    obj.x = 0;
    obj.y = 0;
    return obj;
  }

  /** @internal */
  static neo(x: number, y: number): Vec2 {
    const obj = Object.create(Vec2.prototype);
    obj.x = x;
    obj.y = y;
    return obj;
  }

  static clone(v: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(v.x, v.y);
  }

  /** @internal */
  toString(): string {
    return JSON.stringify(this);
  }

  /**
   * Does this vector contain finite coordinates?
   */
  static isValid(obj: { x: number; y: number }): boolean {
    if (obj === null || typeof obj === "undefined") {
      return false;
    }
    return math.isFinite(obj.x) && math.isFinite(obj.y);
  }

  static assert(o: any): void {
    if (!_ASSERT) return;
    if (!Vec2.isValid(o)) {
      _DEBUG && common.debug(o);
      throw new Error("Invalid Vec2!");
    }
  }

  clone(): Vec2 {
    return Vec2.clone(this);
  }

  /**
   * Set this vector to all zeros.
   *
   * @returns this
   */
  setZero(): Vec2 {
    this.x = 0.0;
    this.y = 0.0;
    return this;
  }

  set(x: number, y: number): Vec2;
  set(value: Vec2): Vec2;
  /**
   * Set this vector to some specified coordinates.
   *
   * @returns this
   */
  // tslint:disable-next-line:typedef
  set(x: any, y?: any) {
    if (typeof x === "object") {
      _ASSERT && Vec2.assert(x);
      this.x = x.x;
      this.y = x.y;
    } else {
      _ASSERT && math.assert(x);
      _ASSERT && math.assert(y);
      this.x = x;
      this.y = y;
    }
    return this;
  }

  /**
   * Set this vector to some specified coordinates.
   *
   * @returns this
   */
  setNum(x: number, y: number) {
    _ASSERT && math.assert(x);
    _ASSERT && math.assert(y);
    this.x = x;
    this.y = y;

    return this;
  }

  /**
   * Set this vector to some specified coordinates.
   *
   * @returns this
   */
  setVec2(value: Vec2) {
    _ASSERT && Vec2.assert(value);
    this.x = value.x;
    this.y = value.y;

    return this;
  }

  /**
   * Set linear combination of v and w: `a * v + b * w`
   */
  setCombine(a: number, v: Vec2, b: number, w: Vec2): Vec2 {
    _ASSERT && math.assert(a);
    _ASSERT && Vec2.assert(v);
    _ASSERT && math.assert(b);
    _ASSERT && Vec2.assert(w);
    const x = a * v.x + b * w.x;
    const y = a * v.y + b * w.y;

    // `this` may be `w`
    this.x = x;
    this.y = y;
    return this;
  }

  setMul(a: number, v: Vec2): Vec2 {
    _ASSERT && math.assert(a);
    _ASSERT && Vec2.assert(v);
    const x = a * v.x;
    const y = a * v.y;

    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Add a vector to this vector.
   *
   * @returns this
   */
  add(w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(w);
    this.x += w.x;
    this.y += w.y;
    return this;
  }

  /**
   * Add linear combination of v and w: `a * v + b * w`
   */
  addCombine(a: number, v: Vec2, b: number, w: Vec2): Vec2 {
    _ASSERT && math.assert(a);
    _ASSERT && Vec2.assert(v);
    _ASSERT && math.assert(b);
    _ASSERT && Vec2.assert(w);

    const x = a * v.x + b * w.x;
    const y = a * v.y + b * w.y;

    // `this` may be `w`
    this.x += x;
    this.y += y;
    return this;
  }

  addMul(a: number, v: Vec2): Vec2 {
    _ASSERT && math.assert(a);
    _ASSERT && Vec2.assert(v);
    const x = a * v.x;
    const y = a * v.y;

    this.x += x;
    this.y += y;
    return this;
  }

  /**
   * Subtract linear combination of v and w: `a * v + b * w`
   */
  subCombine(a: number, v: Vec2, b: number, w: Vec2): Vec2 {
    _ASSERT && math.assert(a);
    _ASSERT && Vec2.assert(v);
    _ASSERT && math.assert(b);
    _ASSERT && Vec2.assert(w);
    const x = a * v.x + b * w.x;
    const y = a * v.y + b * w.y;

    // `this` may be `w`
    this.x -= x;
    this.y -= y;
    return this;
  }

  subMul(a: number, v: Vec2): Vec2 {
    _ASSERT && math.assert(a);
    _ASSERT && Vec2.assert(v);
    const x = a * v.x;
    const y = a * v.y;

    this.x -= x;
    this.y -= y;
    return this;
  }

  /**
   * Subtract a vector from this vector
   *
   * @returns this
   */
  sub(w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(w);
    this.x -= w.x;
    this.y -= w.y;
    return this;
  }

  /**
   * Multiply this vector by a scalar.
   *
   * @returns this
   */
  mul(m: number): Vec2 {
    _ASSERT && math.assert(m);
    this.x *= m;
    this.y *= m;
    return this;
  }

  /**
   * Get the length of this vector (the norm).
   *
   * For performance, use this instead of lengthSquared (if possible).
   */
  length(): number {
    return Vec2.lengthOf(this);
  }

  /**
   * Get the length squared.
   */
  lengthSquared(): number {
    return Vec2.lengthSquared(this);
  }

  /**
   * Convert this vector into a unit vector.
   *
   * @returns old length
   */
  normalize(): number {
    const length = this.length();
    if (length < math.EPSILON) {
      return 0.0;
    }
    const invLength = 1.0 / length;
    this.x *= invLength;
    this.y *= invLength;
    return length;
  }

  /**
   * Get the length of this vector (the norm).
   *
   * For performance, use this instead of lengthSquared (if possible).
   */
  static lengthOf(v: Vec2): number {
    _ASSERT && Vec2.assert(v);
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  /**
   * Get the length squared.
   */
  static lengthSquared(v: Vec2): number {
    _ASSERT && Vec2.assert(v);
    return v.x * v.x + v.y * v.y;
  }

  static distance(v: Vec2, w: Vec2): number {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    const dx = v.x - w.x;
    const dy = v.y - w.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceSquared(v: Vec2, w: Vec2): number {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    const dx = v.x - w.x;
    const dy = v.y - w.y;
    return dx * dx + dy * dy;
  }

  static areEqual(v: Vec2, w: Vec2): boolean {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return (
      v === w ||
      (typeof w === "object" && w !== null && v.x === w.x && v.y === w.y)
    );
  }

  /**
   * Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
   */
  static skew(v: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(-v.y, v.x);
  }

  /**
   * Perform the dot product on two vectors.
   */
  static dot(v: Vec2, w: Vec2): number {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return v.x * w.x + v.y * w.y;
  }

  static cross(v: Vec2, w: Vec2): number;
  static cross(v: Vec2, w: number): Vec2;
  static cross(v: number, w: Vec2): Vec2;
  /**
   * Perform the cross product on two vectors. In 2D this produces a scalar.
   *
   * Perform the cross product on a vector and a scalar. In 2D this produces a
   * vector.
   */
  // tslint:disable-next-line:typedef
  static cross(v: any, w: any) {
    if (typeof w === "number") {
      _ASSERT && Vec2.assert(v);
      _ASSERT && math.assert(w);
      return Vec2.neo(w * v.y, -w * v.x);
    } else if (typeof v === "number") {
      _ASSERT && math.assert(v);
      _ASSERT && Vec2.assert(w);
      return Vec2.neo(-v * w.y, v * w.x);
    } else {
      _ASSERT && Vec2.assert(v);
      _ASSERT && Vec2.assert(w);
      return v.x * w.y - v.y * w.x;
    }
  }

  /**
   * Perform the cross product on two vectors. In 2D this produces a scalar.
   */
  static crossVec2Vec2(v: Vec2, w: Vec2): number {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return v.x * w.y - v.y * w.x;
  }

  /**
   * Perform the cross product on a vector and a scalar. In 2D this produces a
   * vector.
   */
  static crossVec2Num(v: Vec2, w: number): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && math.assert(w);
    return Vec2.neo(w * v.y, -w * v.x);
  }

  /**
   * Perform the cross product on a vector and a scalar. In 2D this produces a
   * vector.
   */
  static crossNumVec2(v: number, w: Vec2): Vec2 {
    _ASSERT && math.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(-v * w.y, v * w.x);
  }

  static addCross(a: Vec2, v: Vec2, w: number): Vec2;
  static addCross(a: Vec2, v: number, w: Vec2): Vec2;
  /**
   * Returns `a + (v x w)`
   */
  // tslint:disable-next-line:typedef
  static addCross(a: any, v: any, w: any) {
    if (typeof w === "number") {
      _ASSERT && Vec2.assert(v);
      _ASSERT && math.assert(w);
      return Vec2.neo(w * v.y + a.x, -w * v.x + a.y);
    } else if (typeof v === "number") {
      _ASSERT && math.assert(v);
      _ASSERT && Vec2.assert(w);
      return Vec2.neo(-v * w.y + a.x, v * w.x + a.y);
    }

    _ASSERT && common.assert(false);
  }

  /**
   * Returns `a + (v x w)`
   */
  static addCrossVec2Num(a: Vec2, v: Vec2, w: number): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && math.assert(w);
    return Vec2.neo(w * v.y + a.x, -w * v.x + a.y);
  }

  /**
   * Returns `a + (v x w)`
   */
  static addCrossNumVec2(a: Vec2, v: number, w: Vec2): Vec2 {
    _ASSERT && math.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(-v * w.y + a.x, v * w.x + a.y);
  }

  static add(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(v.x + w.x, v.y + w.y);
  }

  /** @internal @deprecated */
  static wAdd(a: number, v: Vec2, b: number, w: Vec2): Vec2 {
    if (typeof b !== "undefined" || typeof w !== "undefined") {
      return Vec2.combine(a, v, b, w);
    } else {
      return Vec2.mulNumVec2(a, v);
    }
  }

  static combine(a: number, v: Vec2, b: number, w: Vec2): Vec2 {
    return Vec2.zero().setCombine(a, v, b, w);
  }

  static sub(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(v.x - w.x, v.y - w.y);
  }

  static mul(a: Vec2, b: number): Vec2;
  static mul(a: number, b: Vec2): Vec2;
  // tslint:disable-next-line:typedef
  static mul(a: any, b: any) {
    if (typeof a === "object") {
      _ASSERT && Vec2.assert(a);
      _ASSERT && math.assert(b);
      return Vec2.neo(a.x * b, a.y * b);
    } else if (typeof b === "object") {
      _ASSERT && math.assert(a);
      _ASSERT && Vec2.assert(b);
      return Vec2.neo(a * b.x, a * b.y);
    }
  }

  static mulVec2Num(a: Vec2, b: number): Vec2 {
    _ASSERT && Vec2.assert(a);
    _ASSERT && math.assert(b);
    return Vec2.neo(a.x * b, a.y * b);
  }

  static mulNumVec2(a: number, b: Vec2): Vec2 {
    _ASSERT && math.assert(a);
    _ASSERT && Vec2.assert(b);
    return Vec2.neo(a * b.x, a * b.y);
  }

  neg(): Vec2 {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  static neg(v: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(-v.x, -v.y);
  }

  static abs(v: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(Math.abs(v.x), Math.abs(v.y));
  }

  static mid(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo((v.x + w.x) * 0.5, (v.y + w.y) * 0.5);
  }

  static upper(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(Math.max(v.x, w.x), Math.max(v.y, w.y));
  }

  static lower(v: Vec2, w: Vec2): Vec2 {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(Math.min(v.x, w.x), Math.min(v.y, w.y));
  }

  clamp(max: number): Vec2 {
    const lengthSqr = this.x * this.x + this.y * this.y;
    if (lengthSqr > max * max) {
      const invLength = math.invSqrt(lengthSqr);
      this.x *= invLength * max;
      this.y *= invLength * max;
    }
    return this;
  }

  static clamp(v: Vec2, max: number): Vec2 {
    v = Vec2.neo(v.x, v.y);
    v.clamp(max);
    return v;
  }
}
