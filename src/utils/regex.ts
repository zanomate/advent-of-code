export const parseRegex = <Matches extends string[]>(input: string, regex: RegExp) => {
  const match = input.match(regex)
  if (!match) throw new Error(`input ${input} not match`)
  return match.slice(1) as Matches
}
