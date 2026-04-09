// Mock hookable for REPL sandbox
export class Hookable {
  constructor() { this._hooks = {} }
  hook(name, fn) { (this._hooks[name] = this._hooks[name] || []).push(fn) }
  async callHook(name, ...args) {
    for (const fn of (this._hooks[name] || [])) await fn(...args)
  }
  removeHook(name, fn) {
    if (this._hooks[name]) this._hooks[name] = this._hooks[name].filter(f => f !== fn)
  }
}
export function createHooks() { return new Hookable() }
export default Hookable
