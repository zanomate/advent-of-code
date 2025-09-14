export function memoized<In, Out>(fn: (input: In) => Out) {
  const map = new Map<In, Out>()
  return (input: In) => {
    if (map.has(input)) return map.get(input)!
    const out = fn(input)!
    map.set(input, out)
    return out
  }
}
