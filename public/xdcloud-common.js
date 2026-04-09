var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@xdcloud/common-client/dist/src/constants/auth.js
var AUTH_DOMAIN, AUTH_CLIENT_ID, AUTH_REDIRECT_URI, AUTH_PATHS, AUTH_COOKIES, AUTH_ENDPOINTS;
var init_auth = __esm({
  "node_modules/@xdcloud/common-client/dist/src/constants/auth.js"() {
    AUTH_DOMAIN = "https://auth.xdcloud.kr";
    AUTH_CLIENT_ID = "egis-client";
    AUTH_REDIRECT_URI = `${typeof window !== "undefined" ? window.location.origin : ""}/callback`;
    AUTH_PATHS = {
      DUPLICATE_LOGIN: `${AUTH_DOMAIN}/auth/duplicate_login`,
      SESSION_EXPIRED: `${AUTH_DOMAIN}/auth/session_expired`,
      LOGIN: `${AUTH_DOMAIN}/oauth2/authorize`
    };
    AUTH_COOKIES = {
      ACCESS_TOKEN: "accessToken",
      REFRESH_TOKEN: "refreshToken",
      ID_TOKEN: "idToken",
      EXPIRES_AT: "tokenExpiresAt",
      ACCESS_TOKEN_DATA: ""
    };
    AUTH_ENDPOINTS = {
      TOKEN: `${AUTH_DOMAIN}/oauth2/token`,
      USERINFO: `${AUTH_DOMAIN}/userinfo`,
      REVOKE: `${AUTH_DOMAIN}/api/v1/auth/oauth2/revoke`,
      LOGOUT: `${AUTH_DOMAIN}/api/v1/auth/connect/logout`
    };
  }
});

// node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map2 = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map2[key] = 1;
  return (val) => val in map2;
}
var EMPTY_OBJ, EMPTY_ARR, NOOP, NO, extend, remove, hasOwnProperty, hasOwn, isArray, isMap, isSet, isFunction, isString, isSymbol, isObject, isPromise, objectToString, toTypeString, toRawType, isPlainObject, isIntegerKey, cacheStringFunction, camelizeRE, camelize, hyphenateRE, hyphenate, capitalize, toHandlerKey, hasChanged, def, _globalThis, getGlobalThis, specialBooleanAttrs, isBooleanAttr;
var init_shared_esm_bundler = __esm({
  "node_modules/@vue/shared/dist/shared.esm-bundler.js"() {
    EMPTY_OBJ = true ? Object.freeze({}) : {};
    EMPTY_ARR = true ? Object.freeze([]) : [];
    NOOP = () => {
    };
    NO = () => false;
    extend = Object.assign;
    remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
        arr.splice(i, 1);
      }
    };
    hasOwnProperty = Object.prototype.hasOwnProperty;
    hasOwn = (val, key) => hasOwnProperty.call(val, key);
    isArray = Array.isArray;
    isMap = (val) => toTypeString(val) === "[object Map]";
    isSet = (val) => toTypeString(val) === "[object Set]";
    isFunction = (val) => typeof val === "function";
    isString = (val) => typeof val === "string";
    isSymbol = (val) => typeof val === "symbol";
    isObject = (val) => val !== null && typeof val === "object";
    isPromise = (val) => {
      return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
    };
    objectToString = Object.prototype.toString;
    toTypeString = (value) => objectToString.call(value);
    toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
    };
    isPlainObject = (val) => toTypeString(val) === "[object Object]";
    isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
    cacheStringFunction = (fn) => {
      const cache = /* @__PURE__ */ Object.create(null);
      return ((str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
      });
    };
    camelizeRE = /-\w/g;
    camelize = cacheStringFunction(
      (str) => {
        return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
      }
    );
    hyphenateRE = /\B([A-Z])/g;
    hyphenate = cacheStringFunction(
      (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
    );
    capitalize = cacheStringFunction((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });
    toHandlerKey = cacheStringFunction(
      (str) => {
        const s = str ? `on${capitalize(str)}` : ``;
        return s;
      }
    );
    hasChanged = (value, oldValue) => !Object.is(value, oldValue);
    def = (obj, key, value, writable = false) => {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        writable,
        value
      });
    };
    getGlobalThis = () => {
      return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    };
    specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
    isBooleanAttr = /* @__PURE__ */ makeMap(
      specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
    );
  }
});

// node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
function warn(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
function getCurrentScope() {
  return activeEffectScope;
}
function batch(sub, isComputed = false) {
  sub.flags |= 8;
  if (isComputed) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error) error = err;
        }
      }
      e = next;
    }
  }
  if (error) throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link = tail;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail) tail = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
    return;
  }
  computed2.flags |= 2;
  const dep = computed2.dep;
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2.flags |= 128;
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subsHead === link) {
    dep.subsHead = nextSub;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link;
    }
    if (link.dep.subsHead === void 0) {
      link.dep.subsHead = link;
    }
    link.dep.subs = link;
  }
}
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    if (true) {
      dep.track({
        target,
        type,
        key
      });
    } else {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      if (true) {
        dep.trigger({
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        });
      } else {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function reactiveReadArray(array) {
  const raw = toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (!result.done) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toReactive(item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  let wrappedFn = fn;
  if (arr !== self2) {
    if (!isShallow(self2)) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, toReactive(item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  return arr[method](wrappedFn, ...args);
}
function searchProxy(self2, method, args) {
  const arr = toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && isProxy(args[0])) {
    args[0] = toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = toRaw(self2)[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
function hasOwnProperty2(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (true) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
      return target.size;
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const proto = getProto(target);
        const hadKey = proto.has.call(target, value);
        if (!hadKey) {
          target.add(value);
          trigger(target, "add", value, value);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        } else if (true) {
          checkIdentityKeys(target, has, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
        return this;
      },
      delete(key) {
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        } else if (true) {
          checkIdentityKeys(target, has, key);
        }
        const oldValue = get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0, oldValue);
        }
        return result;
      },
      clear() {
        const target = toRaw(this);
        const hadItems = target.size !== 0;
        const oldTarget = true ? isMap(target) ? new Map(target) : new Set(target) : void 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0,
            oldTarget
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
function checkIdentityKeys(target, has, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has.call(target, rawKey)) {
    const type = toRawType(target);
    warn(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    if (true) {
      warn(
        `value cannot be made ${isReadonly2 ? "readonly" : "reactive"}: ${String(
          target
        )}`
      );
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  } else if (!failSilently) {
    warn(
      `onWatcherCleanup() was called when there was no active watcher to associate with.`
    );
  }
}
function watch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const warnInvalidSource = (s) => {
    (options.onWarn || warn)(
      `Invalid watch source: `,
      s,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else {
        warnInvalidSource(s);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          oldValue = newValue;
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (true) {
    effect2.onTrack = options.onTrack;
    effect2.onTrigger = options.onTrigger;
  }
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Map();
  if ((seen.get(value) || 0) >= depth) {
    return value;
  }
  seen.set(value, depth);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
var activeEffectScope, activeSub, pausedQueueEffects, ReactiveEffect, batchDepth, batchedSub, batchedComputed, shouldTrack, trackStack, globalVersion, Link, Dep, targetMap, ITERATE_KEY, MAP_KEY_ITERATE_KEY, ARRAY_ITERATE_KEY, arrayInstrumentations, arrayProto, isNonTrackableKeys, builtInSymbols, BaseReactiveHandler, MutableReactiveHandler, ReadonlyReactiveHandler, mutableHandlers, readonlyHandlers, shallowReadonlyHandlers, toShallow, getProto, mutableCollectionHandlers, readonlyCollectionHandlers, shallowReadonlyCollectionHandlers, reactiveMap, shallowReactiveMap, readonlyMap, shallowReadonlyMap, toReactive, toReadonly, shallowUnwrapHandlers, INITIAL_WATCHER_VALUE, cleanupMap, activeWatcher;
var init_reactivity_esm_bundler = __esm({
  "node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js"() {
    init_shared_esm_bundler();
    pausedQueueEffects = /* @__PURE__ */ new WeakSet();
    ReactiveEffect = class {
      constructor(fn) {
        this.fn = fn;
        this.deps = void 0;
        this.depsTail = void 0;
        this.flags = 1 | 4;
        this.next = void 0;
        this.cleanup = void 0;
        this.scheduler = void 0;
        if (activeEffectScope && activeEffectScope.active) {
          activeEffectScope.effects.push(this);
        }
      }
      pause() {
        this.flags |= 64;
      }
      resume() {
        if (this.flags & 64) {
          this.flags &= -65;
          if (pausedQueueEffects.has(this)) {
            pausedQueueEffects.delete(this);
            this.trigger();
          }
        }
      }
      /**
       * @internal
       */
      notify() {
        if (this.flags & 2 && !(this.flags & 32)) {
          return;
        }
        if (!(this.flags & 8)) {
          batch(this);
        }
      }
      run() {
        if (!(this.flags & 1)) {
          return this.fn();
        }
        this.flags |= 2;
        cleanupEffect(this);
        prepareDeps(this);
        const prevEffect = activeSub;
        const prevShouldTrack = shouldTrack;
        activeSub = this;
        shouldTrack = true;
        try {
          return this.fn();
        } finally {
          if (activeSub !== this) {
            warn(
              "Active effect was not restored correctly - this is likely a Vue internal bug."
            );
          }
          cleanupDeps(this);
          activeSub = prevEffect;
          shouldTrack = prevShouldTrack;
          this.flags &= -3;
        }
      }
      stop() {
        if (this.flags & 1) {
          for (let link = this.deps; link; link = link.nextDep) {
            removeSub(link);
          }
          this.deps = this.depsTail = void 0;
          cleanupEffect(this);
          this.onStop && this.onStop();
          this.flags &= -2;
        }
      }
      trigger() {
        if (this.flags & 64) {
          pausedQueueEffects.add(this);
        } else if (this.scheduler) {
          this.scheduler();
        } else {
          this.runIfDirty();
        }
      }
      /**
       * @internal
       */
      runIfDirty() {
        if (isDirty(this)) {
          this.run();
        }
      }
      get dirty() {
        return isDirty(this);
      }
    };
    batchDepth = 0;
    shouldTrack = true;
    trackStack = [];
    globalVersion = 0;
    Link = class {
      constructor(sub, dep) {
        this.sub = sub;
        this.dep = dep;
        this.version = dep.version;
        this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
      }
    };
    Dep = class {
      // TODO isolatedDeclarations "__v_skip"
      constructor(computed2) {
        this.computed = computed2;
        this.version = 0;
        this.activeLink = void 0;
        this.subs = void 0;
        this.map = void 0;
        this.key = void 0;
        this.sc = 0;
        this.__v_skip = true;
        if (true) {
          this.subsHead = void 0;
        }
      }
      track(debugInfo) {
        if (!activeSub || !shouldTrack || activeSub === this.computed) {
          return;
        }
        let link = this.activeLink;
        if (link === void 0 || link.sub !== activeSub) {
          link = this.activeLink = new Link(activeSub, this);
          if (!activeSub.deps) {
            activeSub.deps = activeSub.depsTail = link;
          } else {
            link.prevDep = activeSub.depsTail;
            activeSub.depsTail.nextDep = link;
            activeSub.depsTail = link;
          }
          addSub(link);
        } else if (link.version === -1) {
          link.version = this.version;
          if (link.nextDep) {
            const next = link.nextDep;
            next.prevDep = link.prevDep;
            if (link.prevDep) {
              link.prevDep.nextDep = next;
            }
            link.prevDep = activeSub.depsTail;
            link.nextDep = void 0;
            activeSub.depsTail.nextDep = link;
            activeSub.depsTail = link;
            if (activeSub.deps === link) {
              activeSub.deps = next;
            }
          }
        }
        if (activeSub.onTrack) {
          activeSub.onTrack(
            extend(
              {
                effect: activeSub
              },
              debugInfo
            )
          );
        }
        return link;
      }
      trigger(debugInfo) {
        this.version++;
        globalVersion++;
        this.notify(debugInfo);
      }
      notify(debugInfo) {
        startBatch();
        try {
          if (true) {
            for (let head = this.subsHead; head; head = head.nextSub) {
              if (head.sub.onTrigger && !(head.sub.flags & 8)) {
                head.sub.onTrigger(
                  extend(
                    {
                      effect: head.sub
                    },
                    debugInfo
                  )
                );
              }
            }
          }
          for (let link = this.subs; link; link = link.prevSub) {
            if (link.sub.notify()) {
              ;
              link.sub.dep.notify();
            }
          }
        } finally {
          endBatch();
        }
      }
    };
    targetMap = /* @__PURE__ */ new WeakMap();
    ITERATE_KEY = Symbol(
      true ? "Object iterate" : ""
    );
    MAP_KEY_ITERATE_KEY = Symbol(
      true ? "Map keys iterate" : ""
    );
    ARRAY_ITERATE_KEY = Symbol(
      true ? "Array iterate" : ""
    );
    arrayInstrumentations = {
      __proto__: null,
      [Symbol.iterator]() {
        return iterator(this, Symbol.iterator, toReactive);
      },
      concat(...args) {
        return reactiveReadArray(this).concat(
          ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
        );
      },
      entries() {
        return iterator(this, "entries", (value) => {
          value[1] = toReactive(value[1]);
          return value;
        });
      },
      every(fn, thisArg) {
        return apply(this, "every", fn, thisArg, void 0, arguments);
      },
      filter(fn, thisArg) {
        return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
      },
      find(fn, thisArg) {
        return apply(this, "find", fn, thisArg, toReactive, arguments);
      },
      findIndex(fn, thisArg) {
        return apply(this, "findIndex", fn, thisArg, void 0, arguments);
      },
      findLast(fn, thisArg) {
        return apply(this, "findLast", fn, thisArg, toReactive, arguments);
      },
      findLastIndex(fn, thisArg) {
        return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
      },
      // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
      forEach(fn, thisArg) {
        return apply(this, "forEach", fn, thisArg, void 0, arguments);
      },
      includes(...args) {
        return searchProxy(this, "includes", args);
      },
      indexOf(...args) {
        return searchProxy(this, "indexOf", args);
      },
      join(separator) {
        return reactiveReadArray(this).join(separator);
      },
      // keys() iterator only reads `length`, no optimization required
      lastIndexOf(...args) {
        return searchProxy(this, "lastIndexOf", args);
      },
      map(fn, thisArg) {
        return apply(this, "map", fn, thisArg, void 0, arguments);
      },
      pop() {
        return noTracking(this, "pop");
      },
      push(...args) {
        return noTracking(this, "push", args);
      },
      reduce(fn, ...args) {
        return reduce(this, "reduce", fn, args);
      },
      reduceRight(fn, ...args) {
        return reduce(this, "reduceRight", fn, args);
      },
      shift() {
        return noTracking(this, "shift");
      },
      // slice could use ARRAY_ITERATE but also seems to beg for range tracking
      some(fn, thisArg) {
        return apply(this, "some", fn, thisArg, void 0, arguments);
      },
      splice(...args) {
        return noTracking(this, "splice", args);
      },
      toReversed() {
        return reactiveReadArray(this).toReversed();
      },
      toSorted(comparer) {
        return reactiveReadArray(this).toSorted(comparer);
      },
      toSpliced(...args) {
        return reactiveReadArray(this).toSpliced(...args);
      },
      unshift(...args) {
        return noTracking(this, "unshift", args);
      },
      values() {
        return iterator(this, "values", toReactive);
      }
    };
    arrayProto = Array.prototype;
    isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
    builtInSymbols = new Set(
      /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
    );
    BaseReactiveHandler = class {
      constructor(_isReadonly = false, _isShallow = false) {
        this._isReadonly = _isReadonly;
        this._isShallow = _isShallow;
      }
      get(target, key, receiver) {
        if (key === "__v_skip") return target["__v_skip"];
        const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_isShallow") {
          return isShallow2;
        } else if (key === "__v_raw") {
          if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
          // this means the receiver is a user proxy of the reactive proxy
          Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
            return target;
          }
          return;
        }
        const targetIsArray = isArray(target);
        if (!isReadonly2) {
          let fn;
          if (targetIsArray && (fn = arrayInstrumentations[key])) {
            return fn;
          }
          if (key === "hasOwnProperty") {
            return hasOwnProperty2;
          }
        }
        const res = Reflect.get(
          target,
          key,
          // if this is a proxy wrapping a ref, return methods using the raw ref
          // as receiver so that we don't have to call `toRaw` on the ref in all
          // its class methods
          isRef(target) ? target : receiver
        );
        if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
          return res;
        }
        if (!isReadonly2) {
          track(target, "get", key);
        }
        if (isShallow2) {
          return res;
        }
        if (isRef(res)) {
          const value = targetIsArray && isIntegerKey(key) ? res : res.value;
          return isReadonly2 && isObject(value) ? readonly(value) : value;
        }
        if (isObject(res)) {
          return isReadonly2 ? readonly(res) : reactive(res);
        }
        return res;
      }
    };
    MutableReactiveHandler = class extends BaseReactiveHandler {
      constructor(isShallow2 = false) {
        super(false, isShallow2);
      }
      set(target, key, value, receiver) {
        let oldValue = target[key];
        if (!this._isShallow) {
          const isOldValueReadonly = isReadonly(oldValue);
          if (!isShallow(value) && !isReadonly(value)) {
            oldValue = toRaw(oldValue);
            value = toRaw(value);
          }
          if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
            if (isOldValueReadonly) {
              if (true) {
                warn(
                  `Set operation on key "${String(key)}" failed: target is readonly.`,
                  target[key]
                );
              }
              return true;
            } else {
              oldValue.value = value;
              return true;
            }
          }
        }
        const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        const result = Reflect.set(
          target,
          key,
          value,
          isRef(target) ? target : receiver
        );
        if (target === toRaw(receiver)) {
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value, oldValue);
          }
        }
        return result;
      }
      deleteProperty(target, key) {
        const hadKey = hasOwn(target, key);
        const oldValue = target[key];
        const result = Reflect.deleteProperty(target, key);
        if (result && hadKey) {
          trigger(target, "delete", key, void 0, oldValue);
        }
        return result;
      }
      has(target, key) {
        const result = Reflect.has(target, key);
        if (!isSymbol(key) || !builtInSymbols.has(key)) {
          track(target, "has", key);
        }
        return result;
      }
      ownKeys(target) {
        track(
          target,
          "iterate",
          isArray(target) ? "length" : ITERATE_KEY
        );
        return Reflect.ownKeys(target);
      }
    };
    ReadonlyReactiveHandler = class extends BaseReactiveHandler {
      constructor(isShallow2 = false) {
        super(true, isShallow2);
      }
      set(target, key) {
        if (true) {
          warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target
          );
        }
        return true;
      }
      deleteProperty(target, key) {
        if (true) {
          warn(
            `Delete operation on key "${String(key)}" failed: target is readonly.`,
            target
          );
        }
        return true;
      }
    };
    mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
    readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
    shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
    toShallow = (value) => value;
    getProto = (v) => Reflect.getPrototypeOf(v);
    mutableCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, false)
    };
    readonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, false)
    };
    shallowReadonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, true)
    };
    reactiveMap = /* @__PURE__ */ new WeakMap();
    shallowReactiveMap = /* @__PURE__ */ new WeakMap();
    readonlyMap = /* @__PURE__ */ new WeakMap();
    shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
    toReactive = (value) => isObject(value) ? reactive(value) : value;
    toReadonly = (value) => isObject(value) ? readonly(value) : value;
    shallowUnwrapHandlers = {
      get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
      set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, receiver);
        }
      }
    };
    INITIAL_WATCHER_VALUE = {};
    cleanupMap = /* @__PURE__ */ new WeakMap();
    activeWatcher = void 0;
  }
});

// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  } else if (true) {
    warn$1(
      `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof fn}`
    );
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = true ? ErrorTypeStrings$1[type] : `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (true) {
    const info = ErrorTypeStrings$1[type];
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      throw err;
    } else {
      console.error(err);
    }
  } else if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    if (true) {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
function flushJobs(seen) {
  if (true) {
    seen = seen || /* @__PURE__ */ new Map();
  }
  const check = true ? (job) => checkRecursiveUpdates(seen, job) : NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (check(job)) {
          continue;
        }
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs(seen);
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  const count = seen.get(fn) || 0;
  if (count > RECURSION_LIMIT) {
    const instance = fn.i;
    const componentName = instance && getComponentName(instance.type);
    handleError(
      `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
      null,
      10
    );
    return true;
  }
  seen.set(fn, count + 1);
  return false;
}
function createRecord(id, initialDef) {
  if (map.has(id)) {
    return false;
  }
  map.set(id, {
    initialDef: normalizeClassComponent(initialDef),
    instances: /* @__PURE__ */ new Set()
  });
  return true;
}
function normalizeClassComponent(component) {
  return isClassComponent(component) ? component.__vccOpts : component;
}
function rerender(id, newRender) {
  const record = map.get(id);
  if (!record) {
    return;
  }
  record.initialDef.render = newRender;
  [...record.instances].forEach((instance) => {
    if (newRender) {
      instance.render = newRender;
      normalizeClassComponent(instance.type).render = newRender;
    }
    instance.renderCache = [];
    isHmrUpdating = true;
    if (!(instance.job.flags & 8)) {
      instance.update();
    }
    isHmrUpdating = false;
  });
}
function reload(id, newComp) {
  const record = map.get(id);
  if (!record) return;
  newComp = normalizeClassComponent(newComp);
  updateComponentDef(record.initialDef, newComp);
  const instances = [...record.instances];
  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i];
    const oldComp = normalizeClassComponent(instance.type);
    let dirtyInstances = hmrDirtyComponents.get(oldComp);
    if (!dirtyInstances) {
      if (oldComp !== record.initialDef) {
        updateComponentDef(oldComp, newComp);
      }
      hmrDirtyComponents.set(oldComp, dirtyInstances = /* @__PURE__ */ new Set());
    }
    dirtyInstances.add(instance);
    instance.appContext.propsCache.delete(instance.type);
    instance.appContext.emitsCache.delete(instance.type);
    instance.appContext.optionsCache.delete(instance.type);
    if (instance.ceReload) {
      dirtyInstances.add(instance);
      instance.ceReload(newComp.styles);
      dirtyInstances.delete(instance);
    } else if (instance.parent) {
      queueJob(() => {
        if (!(instance.job.flags & 8)) {
          isHmrUpdating = true;
          instance.parent.update();
          isHmrUpdating = false;
          dirtyInstances.delete(instance);
        }
      });
    } else if (instance.appContext.reload) {
      instance.appContext.reload();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      console.warn(
        "[HMR] Root or manually mounted instance modified. Full reload required."
      );
    }
    if (instance.root.ce && instance !== instance.root) {
      instance.root.ce._removeChildStyle(oldComp);
    }
  }
  queuePostFlushCb(() => {
    hmrDirtyComponents.clear();
  });
}
function updateComponentDef(oldComp, newComp) {
  extend(oldComp, newComp);
  for (const key in oldComp) {
    if (key !== "__file" && !(key in newComp)) {
      delete oldComp[key];
    }
  }
}
function tryWrap(fn) {
  return (id, arg) => {
    try {
      return fn(id, arg);
    } catch (e) {
      console.error(e);
      console.warn(
        `[HMR] Something went wrong during Vue component hot-reload. Full reload required.`
      );
    }
  };
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else if (true) {
    const apiName = toHandlerKey(ErrorTypeStrings$1[type].replace(/ hook$/, ""));
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p) => (normalized[p] = null, normalized),
    {}
  ) : props;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = getCurrentInstance();
  if (instance || currentApp) {
    let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else if (true) {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else if (true) {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const baseWatchOptions = extend({}, options);
  if (true) baseWatchOptions.onWarn = warn$1;
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function markAttrsAccessed() {
  accessedAttrs = true;
}
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
function initCustomFormatter() {
  if (typeof window === "undefined") {
    return;
  }
  const vueStyle = { style: "color:#3ba776" };
  const numberStyle = { style: "color:#1677ff" };
  const stringStyle = { style: "color:#f5222d" };
  const keywordStyle = { style: "color:#eb2f96" };
  const formatter = {
    __vue_custom_formatter: true,
    header(obj) {
      if (!isObject(obj)) {
        return null;
      }
      if (obj.__isVue) {
        return ["div", vueStyle, `VueInstance`];
      } else if (isRef(obj)) {
        pauseTracking();
        const value = obj.value;
        resetTracking();
        return [
          "div",
          {},
          ["span", vueStyle, genRefFlag(obj)],
          "<",
          formatValue(value),
          `>`
        ];
      } else if (isReactive(obj)) {
        return [
          "div",
          {},
          ["span", vueStyle, isShallow(obj) ? "ShallowReactive" : "Reactive"],
          "<",
          formatValue(obj),
          `>${isReadonly(obj) ? ` (readonly)` : ``}`
        ];
      } else if (isReadonly(obj)) {
        return [
          "div",
          {},
          ["span", vueStyle, isShallow(obj) ? "ShallowReadonly" : "Readonly"],
          "<",
          formatValue(obj),
          ">"
        ];
      }
      return null;
    },
    hasBody(obj) {
      return obj && obj.__isVue;
    },
    body(obj) {
      if (obj && obj.__isVue) {
        return [
          "div",
          {},
          ...formatInstance(obj.$)
        ];
      }
    }
  };
  function formatInstance(instance) {
    const blocks = [];
    if (instance.type.props && instance.props) {
      blocks.push(createInstanceBlock("props", toRaw(instance.props)));
    }
    if (instance.setupState !== EMPTY_OBJ) {
      blocks.push(createInstanceBlock("setup", instance.setupState));
    }
    if (instance.data !== EMPTY_OBJ) {
      blocks.push(createInstanceBlock("data", toRaw(instance.data)));
    }
    const computed2 = extractKeys(instance, "computed");
    if (computed2) {
      blocks.push(createInstanceBlock("computed", computed2));
    }
    const injected = extractKeys(instance, "inject");
    if (injected) {
      blocks.push(createInstanceBlock("injected", injected));
    }
    blocks.push([
      "div",
      {},
      [
        "span",
        {
          style: keywordStyle.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: instance }]
    ]);
    return blocks;
  }
  function createInstanceBlock(type, target) {
    target = extend({}, target);
    if (!Object.keys(target).length) {
      return ["span", {}];
    }
    return [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        type
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(target).map((key) => {
          return [
            "div",
            {},
            ["span", keywordStyle, key + ": "],
            formatValue(target[key], false)
          ];
        })
      ]
    ];
  }
  function formatValue(v, asRaw = true) {
    if (typeof v === "number") {
      return ["span", numberStyle, v];
    } else if (typeof v === "string") {
      return ["span", stringStyle, JSON.stringify(v)];
    } else if (typeof v === "boolean") {
      return ["span", keywordStyle, v];
    } else if (isObject(v)) {
      return ["object", { object: asRaw ? toRaw(v) : v }];
    } else {
      return ["span", stringStyle, String(v)];
    }
  }
  function extractKeys(instance, type) {
    const Comp = instance.type;
    if (isFunction(Comp)) {
      return;
    }
    const extracted = {};
    for (const key in instance.ctx) {
      if (isKeyOfType(Comp, key, type)) {
        extracted[key] = instance.ctx[key];
      }
    }
    return extracted;
  }
  function isKeyOfType(Comp, key, type) {
    const opts = Comp[type];
    if (isArray(opts) && opts.includes(key) || isObject(opts) && key in opts) {
      return true;
    }
    if (Comp.extends && isKeyOfType(Comp.extends, key, type)) {
      return true;
    }
    if (Comp.mixins && Comp.mixins.some((m) => isKeyOfType(m, key, type))) {
      return true;
    }
  }
  function genRefFlag(v) {
    if (isShallow(v)) {
      return `ShallowRef`;
    }
    if (v.effect) {
      return `ComputedRef`;
    }
    return `Ref`;
  }
  if (window.devtoolsFormatters) {
    window.devtoolsFormatters.push(formatter);
  } else {
    window.devtoolsFormatters = [formatter];
  }
}
var stack, isWarning, ErrorTypeStrings$1, queue, flushIndex, pendingPostFlushCbs, activePostFlushCbs, postFlushIndex, resolvedPromise, currentFlushPromise, RECURSION_LIMIT, getId, isHmrUpdating, hmrDirtyComponents, map, currentRenderingInstance, TeleportEndKey, leaveCbKey, enterCbKey, requestIdleCallback, cancelIdleCallback, createHook, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onServerPrefetch, onRenderTriggered, onRenderTracked, NULL_DYNAMIC_COMPONENT, getPublicInstance, publicPropertiesMap, isReservedPrefix, hasSetupBinding, PublicInstanceProxyHandlers, shouldCacheAccess, internalOptionMergeStrats, currentApp, queuePostRenderEffect, ssrContextKey, useSSRContext, accessedAttrs, Fragment, Text, Comment, Static, emptyAppContext, currentInstance, getCurrentInstance, internalSetCurrentInstance, setInSSRSetupState, setCurrentInstance, isInSSRComponentSetup, classifyRE, classify, warn2;
var init_runtime_core_esm_bundler = __esm({
  "node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js"() {
    init_reactivity_esm_bundler();
    init_reactivity_esm_bundler();
    init_shared_esm_bundler();
    stack = [];
    isWarning = false;
    ErrorTypeStrings$1 = {
      ["sp"]: "serverPrefetch hook",
      ["bc"]: "beforeCreate hook",
      ["c"]: "created hook",
      ["bm"]: "beforeMount hook",
      ["m"]: "mounted hook",
      ["bu"]: "beforeUpdate hook",
      ["u"]: "updated",
      ["bum"]: "beforeUnmount hook",
      ["um"]: "unmounted hook",
      ["a"]: "activated hook",
      ["da"]: "deactivated hook",
      ["ec"]: "errorCaptured hook",
      ["rtc"]: "renderTracked hook",
      ["rtg"]: "renderTriggered hook",
      [0]: "setup function",
      [1]: "render function",
      [2]: "watcher getter",
      [3]: "watcher callback",
      [4]: "watcher cleanup function",
      [5]: "native event handler",
      [6]: "component event handler",
      [7]: "vnode hook",
      [8]: "directive hook",
      [9]: "transition hook",
      [10]: "app errorHandler",
      [11]: "app warnHandler",
      [12]: "ref function",
      [13]: "async component loader",
      [14]: "scheduler flush",
      [15]: "component update",
      [16]: "app unmount cleanup function"
    };
    queue = [];
    flushIndex = -1;
    pendingPostFlushCbs = [];
    activePostFlushCbs = null;
    postFlushIndex = 0;
    resolvedPromise = /* @__PURE__ */ Promise.resolve();
    currentFlushPromise = null;
    RECURSION_LIMIT = 100;
    getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
    isHmrUpdating = false;
    hmrDirtyComponents = /* @__PURE__ */ new Map();
    if (true) {
      getGlobalThis().__VUE_HMR_RUNTIME__ = {
        createRecord: tryWrap(createRecord),
        rerender: tryWrap(rerender),
        reload: tryWrap(reload)
      };
    }
    map = /* @__PURE__ */ new Map();
    currentRenderingInstance = null;
    TeleportEndKey = Symbol("_vte");
    leaveCbKey = Symbol("_leaveCb");
    enterCbKey = Symbol("_enterCb");
    requestIdleCallback = getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
    cancelIdleCallback = getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
    createHook = (lifecycle) => (hook, target = currentInstance) => {
      if (!isInSSRComponentSetup || lifecycle === "sp") {
        injectHook(lifecycle, (...args) => hook(...args), target);
      }
    };
    onBeforeMount = createHook("bm");
    onMounted = createHook("m");
    onBeforeUpdate = createHook(
      "bu"
    );
    onUpdated = createHook("u");
    onBeforeUnmount = createHook(
      "bum"
    );
    onUnmounted = createHook("um");
    onServerPrefetch = createHook(
      "sp"
    );
    onRenderTriggered = createHook("rtg");
    onRenderTracked = createHook("rtc");
    NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
    getPublicInstance = (i) => {
      if (!i) return null;
      if (isStatefulComponent(i)) return getComponentPublicInstance(i);
      return getPublicInstance(i.parent);
    };
    publicPropertiesMap = // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => true ? shallowReadonly(i.props) : i.props,
      $attrs: (i) => true ? shallowReadonly(i.attrs) : i.attrs,
      $slots: (i) => true ? shallowReadonly(i.slots) : i.slots,
      $refs: (i) => true ? shallowReadonly(i.refs) : i.refs,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $host: (i) => i.ce,
      $emit: (i) => i.emit,
      $options: (i) => __VUE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type,
      $forceUpdate: (i) => i.f || (i.f = () => {
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => __VUE_OPTIONS_API__ ? instanceWatch.bind(i) : NOOP
    });
    isReservedPrefix = (key) => key === "_" || key === "$";
    hasSetupBinding = (state2, key) => state2 !== EMPTY_OBJ && !state2.__isScriptSetup && hasOwn(state2, key);
    PublicInstanceProxyHandlers = {
      get({ _: instance }, key) {
        if (key === "__v_skip") {
          return true;
        }
        const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
        if (key === "__isVue") {
          return true;
        }
        let normalizedProps;
        if (key[0] !== "$") {
          const n = accessCache[key];
          if (n !== void 0) {
            switch (n) {
              case 1:
                return setupState[key];
              case 2:
                return data[key];
              case 4:
                return ctx[key];
              case 3:
                return props[key];
            }
          } else if (hasSetupBinding(setupState, key)) {
            accessCache[key] = 1;
            return setupState[key];
          } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
            accessCache[key] = 2;
            return data[key];
          } else if (
            // only cache other properties when instance has declared (thus stable)
            // props
            (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
          ) {
            accessCache[key] = 3;
            return props[key];
          } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
            accessCache[key] = 4;
            return ctx[key];
          } else if (!__VUE_OPTIONS_API__ || shouldCacheAccess) {
            accessCache[key] = 0;
          }
        }
        const publicGetter = publicPropertiesMap[key];
        let cssModule, globalProperties;
        if (publicGetter) {
          if (key === "$attrs") {
            track(instance.attrs, "get", "");
            markAttrsAccessed();
          } else if (key === "$slots") {
            track(instance, "get", key);
          }
          return publicGetter(instance);
        } else if (
          // css module (injected by vue-loader)
          (cssModule = type.__cssModules) && (cssModule = cssModule[key])
        ) {
          return cssModule;
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (
          // global properties
          globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
        ) {
          {
            return globalProperties[key];
          }
        } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
        // to infinite warning loop
        key.indexOf("__v") !== 0)) {
          if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
            warn$1(
              `Property ${JSON.stringify(
                key
              )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
            );
          } else if (instance === currentRenderingInstance) {
            warn$1(
              `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
            );
          }
        }
      },
      set({ _: instance }, key, value) {
        const { data, setupState, ctx } = instance;
        if (hasSetupBinding(setupState, key)) {
          setupState[key] = value;
          return true;
        } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
          warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
          return false;
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          data[key] = value;
          return true;
        } else if (hasOwn(instance.props, key)) {
          warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
          return false;
        }
        if (key[0] === "$" && key.slice(1) in instance) {
          warn$1(
            `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
          );
          return false;
        } else {
          if (key in instance.appContext.config.globalProperties) {
            Object.defineProperty(ctx, key, {
              enumerable: true,
              configurable: true,
              value
            });
          } else {
            ctx[key] = value;
          }
        }
        return true;
      },
      has({
        _: { data, setupState, accessCache, ctx, appContext, propsOptions, type }
      }, key) {
        let normalizedProps, cssModules;
        return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
      },
      defineProperty(target, key, descriptor) {
        if (descriptor.get != null) {
          target._.accessCache[key] = 0;
        } else if (hasOwn(descriptor, "value")) {
          this.set(target, key, descriptor.value, null);
        }
        return Reflect.defineProperty(target, key, descriptor);
      }
    };
    if (true) {
      PublicInstanceProxyHandlers.ownKeys = (target) => {
        warn$1(
          `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
        );
        return Reflect.ownKeys(target);
      };
    }
    shouldCacheAccess = true;
    internalOptionMergeStrats = {
      data: mergeDataFn,
      props: mergeEmitsOrPropsOptions,
      emits: mergeEmitsOrPropsOptions,
      // objects
      methods: mergeObjectOptions,
      computed: mergeObjectOptions,
      // lifecycle
      beforeCreate: mergeAsArray,
      created: mergeAsArray,
      beforeMount: mergeAsArray,
      mounted: mergeAsArray,
      beforeUpdate: mergeAsArray,
      updated: mergeAsArray,
      beforeDestroy: mergeAsArray,
      beforeUnmount: mergeAsArray,
      destroyed: mergeAsArray,
      unmounted: mergeAsArray,
      activated: mergeAsArray,
      deactivated: mergeAsArray,
      errorCaptured: mergeAsArray,
      serverPrefetch: mergeAsArray,
      // assets
      components: mergeObjectOptions,
      directives: mergeObjectOptions,
      // watch
      watch: mergeWatchOptions,
      // provide / inject
      provide: mergeDataFn,
      inject: mergeInject
    };
    currentApp = null;
    queuePostRenderEffect = queueEffectWithSuspense;
    ssrContextKey = Symbol.for("v-scx");
    useSSRContext = () => {
      {
        const ctx = inject(ssrContextKey);
        if (!ctx) {
          warn$1(
            `Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.`
          );
        }
        return ctx;
      }
    };
    accessedAttrs = false;
    Fragment = Symbol.for("v-fgt");
    Text = Symbol.for("v-txt");
    Comment = Symbol.for("v-cmt");
    Static = Symbol.for("v-stc");
    emptyAppContext = createAppContext();
    currentInstance = null;
    getCurrentInstance = () => currentInstance || currentRenderingInstance;
    {
      const g = getGlobalThis();
      const registerGlobalSetter = (key, setter) => {
        let setters;
        if (!(setters = g[key])) setters = g[key] = [];
        setters.push(setter);
        return (v) => {
          if (setters.length > 1) setters.forEach((set) => set(v));
          else setters[0](v);
        };
      };
      internalSetCurrentInstance = registerGlobalSetter(
        `__VUE_INSTANCE_SETTERS__`,
        (v) => currentInstance = v
      );
      setInSSRSetupState = registerGlobalSetter(
        `__VUE_SSR_SETTERS__`,
        (v) => isInSSRComponentSetup = v
      );
    }
    setCurrentInstance = (instance) => {
      const prev = currentInstance;
      internalSetCurrentInstance(instance);
      instance.scope.on();
      return () => {
        instance.scope.off();
        internalSetCurrentInstance(prev);
      };
    };
    isInSSRComponentSetup = false;
    classifyRE = /(?:^|[-_])\w/g;
    classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
    warn2 = true ? warn$1 : NOOP;
  }
});

// node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var policy, tt, vtcKey, vShowOriginalDisplay, vShowHidden, CSS_VAR_TEXT, veiKey, moveCbKey, enterCbKey2, assignKey;
var init_runtime_dom_esm_bundler = __esm({
  "node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js"() {
    init_runtime_core_esm_bundler();
    init_runtime_core_esm_bundler();
    policy = void 0;
    tt = typeof window !== "undefined" && window.trustedTypes;
    if (tt) {
      try {
        policy = /* @__PURE__ */ tt.createPolicy("vue", {
          createHTML: (val) => val
        });
      } catch (e) {
        warn2(`Error creating trusted types policy: ${e}`);
      }
    }
    vtcKey = Symbol("_vtc");
    vShowOriginalDisplay = Symbol("_vod");
    vShowHidden = Symbol("_vsh");
    CSS_VAR_TEXT = Symbol(true ? "CSS_VAR_TEXT" : "");
    veiKey = Symbol("_vei");
    moveCbKey = Symbol("_moveCb");
    enterCbKey2 = Symbol("_enterCb");
    assignKey = Symbol("_assign");
  }
});

// node_modules/vue/dist/vue.runtime.esm-bundler.js
function initDev() {
  {
    initCustomFormatter();
  }
}
var init_vue_runtime_esm_bundler = __esm({
  "node_modules/vue/dist/vue.runtime.esm-bundler.js"() {
    init_runtime_dom_esm_bundler();
    init_runtime_dom_esm_bundler();
    if (true) {
      initDev();
    }
  }
});

// node_modules/@xdcloud/common-client/dist/src/composables/useLogout.js
function useLogout() {
  function deleteBrowserCookie(name) {
    if (typeof document === "undefined")
      return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.xdcloud.kr; secure;`;
  }
  function getCookie2(name) {
    if (typeof document === "undefined")
      return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return parts.pop()?.split(";").shift() || null;
    return null;
  }
  function clearClientState() {
    if (typeof document === "undefined" || typeof window === "undefined")
      return;
    const cookies = [
      AUTH_COOKIES.ACCESS_TOKEN,
      AUTH_COOKIES.REFRESH_TOKEN,
      AUTH_COOKIES.ID_TOKEN,
      AUTH_COOKIES.EXPIRES_AT,
      "XD_AUTH"
    ];
    cookies.forEach((name) => deleteBrowserCookie(name));
    try {
      const { useAuthStore: useAuthStore2 } = (init_authStore(), __toCommonJS(authStore_exports));
      const authStore = useAuthStore2();
      authStore.$reset();
    } catch (e) {
      console.warn("AuthStore \uCD08\uAE30\uD654 \uC911 \uC624\uB958:", e);
    }
  }
  function createLogoutUrl(options) {
    const { redirectUrl = typeof window !== "undefined" ? window.location.origin : "/", returnToUrl, type } = options;
    let finalRedirectUrl;
    switch (type) {
      case "session_expired":
        finalRedirectUrl = AUTH_PATHS.SESSION_EXPIRED;
        break;
      case "duplicate_login":
        finalRedirectUrl = AUTH_PATHS.DUPLICATE_LOGIN;
        break;
      default:
        finalRedirectUrl = redirectUrl;
    }
    const logoutRedirectUrl = new URL(finalRedirectUrl);
    const originalUrl = returnToUrl || (typeof window !== "undefined" ? window.location.href : "/");
    if (!logoutRedirectUrl.searchParams.has("returnTo")) {
      logoutRedirectUrl.searchParams.append("returnTo", encodeURIComponent(originalUrl));
    }
    return logoutRedirectUrl;
  }
  function doDirectLogout(logoutRedirectUrl) {
    if (typeof window === "undefined") {
      return { success: false };
    }
    const idToken = getCookie2(AUTH_COOKIES.ID_TOKEN);
    clearClientState();
    const logoutUrl = new URL(AUTH_ENDPOINTS.LOGOUT);
    if (idToken) {
      logoutUrl.searchParams.append("id_token_hint", idToken);
    }
    logoutUrl.searchParams.append("state", Math.random().toString(36).substring(2, 15));
    window.location.href = logoutUrl.toString();
    return { success: true };
  }
  async function logout(redirectUrlOrOptions, returnToUrl, useDirectLogout) {
    if (typeof window === "undefined") {
      return { success: false, error: "SSR environment detected" };
    }
    let options = { ...DEFAULT_OPTIONS };
    if (typeof redirectUrlOrOptions === "string") {
      options.redirectUrl = redirectUrlOrOptions;
      if (returnToUrl)
        options.returnToUrl = returnToUrl;
      if (useDirectLogout !== void 0)
        options.useDirectLogout = useDirectLogout;
    } else if (redirectUrlOrOptions) {
      options = { ...DEFAULT_OPTIONS, ...redirectUrlOrOptions };
    }
    const logoutRedirectUrl = createLogoutUrl(options);
    try {
      const apiUrl = "/api/auth/logout?redirect_uri=" + encodeURIComponent(logoutRedirectUrl.toString());
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      clearClientState();
      if (!options.silent) {
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          window.location.href = logoutRedirectUrl.toString();
        }
      }
      return { success: true };
    } catch (error) {
      console.error("\uB85C\uADF8\uC544\uC6C3 \uC911 \uC624\uB958:", error);
      clearClientState();
      if (!options.silent) {
        try {
          doDirectLogout(logoutRedirectUrl);
        } catch {
          window.location.href = logoutRedirectUrl.toString();
        }
      }
      return { success: false, error };
    }
  }
  function logoutBySessionExpired(returnToUrl) {
    if (typeof window === "undefined") {
      return Promise.resolve({ success: false, error: "SSR environment detected" });
    }
    return logout({
      redirectUrl: AUTH_PATHS.SESSION_EXPIRED,
      returnToUrl,
      type: "session_expired"
    });
  }
  function logoutByDuplicateLogin(returnToUrl) {
    if (typeof window === "undefined") {
      return Promise.resolve({ success: false, error: "SSR environment detected" });
    }
    return logout({
      redirectUrl: AUTH_PATHS.DUPLICATE_LOGIN,
      returnToUrl,
      type: "duplicate_login"
    });
  }
  function logoutByTimeout(returnToUrl) {
    if (typeof window === "undefined") {
      return Promise.resolve({ success: false, error: "SSR environment detected" });
    }
    return logout({
      redirectUrl: AUTH_PATHS.SESSION_EXPIRED,
      returnToUrl,
      type: "timeout"
    });
  }
  return {
    logout,
    logoutBySessionExpired,
    logoutByDuplicateLogin,
    logoutByTimeout,
    clearClientState
  };
}
var DEFAULT_OPTIONS;
var init_useLogout = __esm({
  "node_modules/@xdcloud/common-client/dist/src/composables/useLogout.js"() {
    init_auth();
    DEFAULT_OPTIONS = {
      redirectUrl: typeof window !== "undefined" ? window.location.origin : "/",
      useDirectLogout: false,
      type: "normal",
      silent: false
    };
  }
});

// node_modules/@xdcloud/common-client/dist/src/stores/authStore.js
var authStore_exports = {};
__export(authStore_exports, {
  useAuthStore: () => useAuthStore
});
var state, useAuthStore;
var init_authStore = __esm({
  "node_modules/@xdcloud/common-client/dist/src/stores/authStore.js"() {
    init_vue_runtime_esm_bundler();
    init_auth();
    init_useLogout();
    state = reactive({
      isLoggedIn: false,
      // 로그인 상태
      userInfo: null,
      // 필요 시 사용자 정보 저장 (예: 이름, 이메일 등)
      // 서버의 세션/로그인 상태를 확인하는 API를 호출하여 상태를 업데이트
      async checkLogin() {
        try {
          const response = await fetch("/api/auth/checkSession", {
            method: "GET",
            credentials: "include"
            // 쿠키를 함께 전송
          });
          const result = await response.json();
          if (response.ok && result.loggedIn) {
            this.isLoggedIn = true;
            this.userInfo = result.user || null;
          } else {
            this.isLoggedIn = false;
            this.userInfo = null;
          }
        } catch (error) {
          console.error("\uB85C\uADF8\uC778 \uC0C1\uD0DC \uD655\uC778 \uC911 \uC624\uB958 \uBC1C\uC0DD:", error);
          this.isLoggedIn = false;
          this.userInfo = null;
        }
      },
      // 서버에 로그아웃 요청을 보내고 상태를 초기화 (useLogout 활용)
      async logout(redirectUri) {
        const { logout } = useLogout();
        try {
          await logout(redirectUri);
          this.isLoggedIn = false;
          this.userInfo = null;
          const host = window.location.hostname;
          const port = window.location.port;
          if (host === "xdcloud.kr" || host === "www.xdcloud.kr" || host === "xdopenlab.xdcloud.kr" || host === "customer.xdcloud.kr" || port === "3000") {
          } else {
            this.redirectToLogin();
          }
        } catch (error) {
          console.error("\uB85C\uADF8\uC544\uC6C3 \uC911 \uC624\uB958 \uBC1C\uC0DD:", error);
          this.isLoggedIn = false;
          this.userInfo = null;
        }
      },
      redirectToLogin() {
        const clientId = AUTH_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/callback`);
        const authServerUrl = AUTH_PATHS.LOGIN;
        const scope = encodeURIComponent("openid profile");
        const state2 = Math.random().toString(36).substring(2, 15);
        const authUrl = `${authServerUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state2}&prompt=login`;
        window.location.href = authUrl;
      }
    });
    useAuthStore = () => state;
  }
});

// node_modules/@xdcloud/common-client/dist/src/index.js
init_auth();
init_authStore();

// node_modules/@xdcloud/common-client/dist/src/composables/useAuthRequests.js
init_useLogout();
init_auth();
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return parts.pop()?.split(";").shift() || null;
  return null;
}
async function refreshTokenIfNeeded() {
  const tokenExpiresAtStr = getCookie(AUTH_COOKIES.EXPIRES_AT);
  const tokenExpiresAt = tokenExpiresAtStr ? parseInt(tokenExpiresAtStr, 10) : null;
  if (!tokenExpiresAt) {
    try {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include"
      });
      if (refreshResponse.ok) {
      } else {
        console.error("[refreshTokenIfNeeded] \uD1A0\uD070 \uAC31\uC2E0 \uC2E4\uD328:", refreshResponse.status);
      }
    } catch (err) {
      console.error("[refreshTokenIfNeeded] \uD1A0\uD070 \uAC31\uC2E0 \uC694\uCCAD \uC911 \uC624\uB958:", err);
    }
  }
}
async function fetchWithAuth(url, options = {}) {
  const { logout } = useLogout();
  const { query = null, headers: customHeaders = {}, body: customBody = null, ...restOptions } = options;
  let updatedUrl = url;
  if (query) {
    const params = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString();
    updatedUrl = url + (url.includes("?") ? "&" : "?") + params;
  }
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders
  };
  const body = customBody && typeof customBody !== "string" ? JSON.stringify(customBody) : customBody;
  try {
    let response = await fetch(updatedUrl, {
      ...restOptions,
      headers,
      body,
      credentials: "include"
    });
    let data = null;
    let error = null;
    try {
      const clonedResponse = response.clone();
      const text = await clonedResponse.text();
      if (!text || text.trim() === "") {
        console.warn("[fetchWithAuth] \uC751\uB2F5 \uBCF8\uBB38\uC774 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
        error = new Error("\uC751\uB2F5 \uBCF8\uBB38\uC774 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4");
      } else {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("[fetchWithAuth] \uC751\uB2F5 JSON \uD30C\uC2F1 \uC624\uB958:", parseError);
          console.log("[fetchWithAuth] \uD30C\uC2F1 \uC2E4\uD328\uD55C \uC6D0\uBCF8 \uD14D\uC2A4\uD2B8:", text);
          error = parseError;
        }
      }
    } catch (responseError) {
      console.error("[fetchWithAuth] \uC751\uB2F5 \uCC98\uB9AC \uC911 \uC624\uB958:", responseError);
      error = responseError;
    }
    if (response.status === 401 && data && data.error === "duplicate_login") {
      console.warn("[fetchWithAuth] \uC911\uBCF5 \uB85C\uADF8\uC778 \uAC10\uC9C0:", data.message);
      logout(AUTH_PATHS.DUPLICATE_LOGIN);
      return { data, error: data };
    }
    if (response.status === 401) {
      try {
        await refreshTokenIfNeeded();
        response = await fetch(updatedUrl, {
          ...restOptions,
          headers,
          body,
          credentials: "include"
        });
        try {
          const retryClonedResponse = response.clone();
          const retryText = await retryClonedResponse.text();
          if (retryText && retryText.trim() !== "") {
            data = JSON.parse(retryText);
          }
        } catch (parseError) {
          console.error("[fetchWithAuth] \uC7AC\uC694\uCCAD \uC751\uB2F5 JSON \uD30C\uC2F1 \uC624\uB958:", parseError);
          error = parseError;
        }
        if (response.status === 401 && data && data.error === "duplicate_login") {
          console.warn("[fetchWithAuth] \uC7AC\uC2DC\uB3C4 \uD6C4 \uC911\uBCF5 \uB85C\uADF8\uC778 \uAC10\uC9C0:", data.message);
          logout(AUTH_PATHS.DUPLICATE_LOGIN);
          return { data, error: data };
        }
        if (response.status === 401) {
          console.warn("[fetchWithAuth] \uC138\uC158 \uB9CC\uB8CC \uAC10\uC9C0 (\uC7AC\uC2DC\uB3C4 \uD6C4)");
          logout(AUTH_PATHS.SESSION_EXPIRED);
          return { data, error: data || "\uC138\uC158\uC774 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4." };
        }
      } catch (retryError) {
        console.error("[fetchWithAuth] \uD1A0\uD070 \uAC31\uC2E0 \uB610\uB294 \uC7AC\uC2DC\uB3C4 \uC694\uCCAD \uC911 \uC624\uB958:", retryError);
        error = retryError;
      }
    }
    return { data, error };
  } catch (fetchError) {
    console.error("[fetchWithAuth] \uC694\uCCAD \uC911 \uC624\uB958 \uBC1C\uC0DD:", fetchError);
    return { data: null, error: fetchError };
  }
}
async function uploadWithAuth(url, files, onProgress) {
  const { logout } = useLogout();
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include"
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log("\u{1F7E2} \uD30C\uC77C \uC5C5\uB85C\uB4DC \uC131\uACF5");
      return { success: true, data: responseData };
    }
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: response.statusText };
    }
    if (response.status === 401) {
      console.log("[uploadWithAuth] 401 \uC624\uB958 \uAC10\uC9C0, \uC694\uCCAD URL:", url);
      if (errorData && errorData.error === "duplicate_login") {
        console.warn("\u26A0\uFE0F \uC911\uBCF5 \uB85C\uADF8\uC778 \uAC10\uC9C0:", errorData.message);
        logout(AUTH_PATHS.DUPLICATE_LOGIN);
        return { success: false, error: errorData };
      }
      console.warn("\u26A0\uFE0F 401 Unauthorized \uBC1C\uC0DD \u2192 \uD1A0\uD070 \uAC31\uC2E0 \uC2DC\uB3C4");
      try {
        await refreshTokenIfNeeded();
        const retryResponse = await fetch(url, {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie(AUTH_COOKIES.ACCESS_TOKEN)}`
          }
        });
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          console.log("\u{1F7E2} \uD30C\uC77C \uC5C5\uB85C\uB4DC \uC7AC\uC2DC\uB3C4 \uC131\uACF5");
          return { success: true, data: retryData };
        }
        let retryErrorData;
        try {
          retryErrorData = await retryResponse.json();
        } catch (e) {
          retryErrorData = { error: retryResponse.statusText };
        }
        if (retryResponse.status === 401) {
          console.log("[uploadWithAuth] \uC7AC\uC2DC\uB3C4 \uC911 401 \uC624\uB958 \uAC10\uC9C0");
          if (retryErrorData && retryErrorData.error === "duplicate_login") {
            console.warn("\u26A0\uFE0F \uC7AC\uC2DC\uB3C4 \uC911 \uC911\uBCF5 \uB85C\uADF8\uC778 \uAC10\uC9C0:", retryErrorData.message);
            logout(AUTH_PATHS.DUPLICATE_LOGIN);
            return { success: false, error: retryErrorData };
          }
          console.warn("\u26A0\uFE0F \uC138\uC158 \uB9CC\uB8CC \uAC10\uC9C0 (\uC7AC\uC2DC\uB3C4 \uD6C4)");
          logout(AUTH_PATHS.SESSION_EXPIRED);
          return { success: false, error: retryErrorData || "\uC138\uC158\uC774 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4." };
        }
        console.error("\u{1F534} \uD30C\uC77C \uC5C5\uB85C\uB4DC \uC7AC\uC2DC\uB3C4 \uC2E4\uD328:", retryErrorData);
        return { success: false, error: retryErrorData };
      } catch (retryError) {
        console.error("\u{1F534} \uD30C\uC77C \uC5C5\uB85C\uB4DC \uC7AC\uC2DC\uB3C4 \uC911 \uC624\uB958:", retryError);
        return { success: false, error: retryError };
      }
    }
    console.error("\u{1F534} \uD30C\uC77C \uC5C5\uB85C\uB4DC \uC2E4\uD328:", errorData);
    return { success: false, error: errorData };
  } catch (error) {
    console.error("\u{1F534} \uD30C\uC77C \uC5C5\uB85C\uB4DC \uC911 \uC624\uB958 \uBC1C\uC0DD:", error);
    return { success: false, error };
  }
}

// node_modules/@xdcloud/common-client/dist/src/index.js
init_useLogout();

// node_modules/@xdcloud/common-client/dist/src/composables/useAlert.js
var useNuxtApp;
if (typeof window !== "undefined") {
  try {
    const nuxt = __require("#app");
    useNuxtApp = nuxt.useNuxtApp;
  } catch (e) {
    try {
      const extWindow = window;
      if (extWindow.__nuxt || extWindow.$nuxt) {
        useNuxtApp = () => {
          const nuxtApp = extWindow.__nuxt || extWindow.$nuxt;
          return {
            $alert: nuxtApp && nuxtApp.$alert
          };
        };
      } else {
        useNuxtApp = () => ({
          $alert: null
        });
        console.warn("useNuxtApp is not available in this environment. Alert functionality may be limited.");
      }
    } catch (innerError) {
      useNuxtApp = () => ({
        $alert: null
      });
      console.warn("Failed to detect Nuxt environment. Using fallback alert.");
    }
  }
} else {
  useNuxtApp = () => ({
    $alert: null
  });
}
function useAlert(externalNuxtApp) {
  const getAlertFunction = () => {
    if (externalNuxtApp && externalNuxtApp.$alert) {
      console.log("Using externally provided nuxtApp");
      return externalNuxtApp.$alert;
    }
    const nuxtApp = useNuxtApp();
    if (nuxtApp && nuxtApp.$alert) {
      console.log("Using internally detected nuxtApp");
      return nuxtApp.$alert;
    }
    console.log("Using fallback alert implementation");
    return (type, title, message, confirmLabel, cancelLabel) => {
      if (typeof window !== "undefined") {
        console.log(`[${type}] ${title}: ${message}`);
        window.alert(`[${type}] ${title}: ${message}`);
        if (type === "confirm") {
          return Promise.resolve(window.confirm(`${title}: ${message}`));
        }
      } else {
        console.warn(`[${type}] ${title}: ${message}`);
      }
      return Promise.resolve(true);
    };
  };
  const showAlert = async (type, title, message, confirmLabel, cancelLabel) => {
    const alertFunction = getAlertFunction();
    return alertFunction(type, title, message, confirmLabel, cancelLabel);
  };
  return {
    showAlert,
    alert: showAlert
  };
}

// node_modules/@xdcloud/common-client/dist/src/composables/useBlockUI.js
function blockUIdiv(id, text = "\uCC98\uB9AC \uC911\uC785\uB2C8\uB2E4...") {
  const target = document.getElementById(id);
  if (!target)
    return;
  const overlayId = `vue-block-ui-${id}`;
  if (document.getElementById(overlayId))
    return;
  const currentPosition = getComputedStyle(target).position;
  if (currentPosition === "static") {
    target.setAttribute("data-original-position", "static");
    target.style.position = "relative";
  }
  const overlay = document.createElement("div");
  overlay.className = "vue-block-ui-overlay";
  overlay.id = overlayId;
  const spinner = document.createElement("div");
  spinner.className = "sk-wave sk-primary";
  for (let i = 0; i < 5; i++) {
    const rect = document.createElement("div");
    rect.className = "sk-wave-rect";
    spinner.appendChild(rect);
  }
  const textSpan = document.createElement("span");
  textSpan.className = "vue-block-ui-text";
  textSpan.innerText = text;
  overlay.appendChild(spinner);
  overlay.appendChild(textSpan);
  target.appendChild(overlay);
}
function unblockUIdiv(id) {
  const overlayId = `vue-block-ui-${id}`;
  const overlay = document.getElementById(overlayId);
  const target = document.getElementById(id);
  if (overlay && target) {
    overlay.remove();
    if (target.getAttribute("data-original-position") === "static") {
      target.style.position = "";
      target.removeAttribute("data-original-position");
    }
  }
}
export {
  AUTH_CLIENT_ID,
  AUTH_COOKIES,
  AUTH_DOMAIN,
  AUTH_ENDPOINTS,
  AUTH_PATHS,
  AUTH_REDIRECT_URI,
  blockUIdiv,
  fetchWithAuth,
  unblockUIdiv,
  uploadWithAuth,
  useAlert,
  useAuthStore,
  useLogout
};
/*! Bundled license information:

@vue/shared/dist/shared.esm-bundler.js:
  (**
  * @vue/shared v3.5.22
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/reactivity/dist/reactivity.esm-bundler.js:
  (**
  * @vue/reactivity v3.5.22
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/runtime-core/dist/runtime-core.esm-bundler.js:
  (**
  * @vue/runtime-core v3.5.22
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/runtime-dom/dist/runtime-dom.esm-bundler.js:
  (**
  * @vue/runtime-dom v3.5.22
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

vue/dist/vue.runtime.esm-bundler.js:
  (**
  * vue v3.5.22
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)
*/
