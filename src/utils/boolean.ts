export const stringToBits = (str: string): boolean[] => {
  return str.split('').map((c) => c === '1')
}

export const bitsToString = (bits: boolean[]): string => {
  return bits.map((b) => (b ? '1' : '0')).join('')
}
