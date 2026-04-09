// Mock useConvertCoord for REPL sandbox
export function useConvertCoord() {
  const convert = (x, y) => ({ x, y })
  return { convert }
}
