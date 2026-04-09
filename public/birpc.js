// Mock birpc for REPL sandbox
export function createBirpc(fns, options) {
  return new Proxy(fns, {
    get(target, prop) {
      if (prop in target) return target[prop]
      return (...args) => Promise.resolve()
    }
  })
}
export default createBirpc
