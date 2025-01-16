export type Wire = string

export const wire = (letter: string, i: number): Wire => `${letter}${i.toString().padStart(2, '0')}`
export const x = (i: number): Wire => wire('x', i)
export const y = (i: number): Wire => wire('y', i)
export const z = (i: number): Wire => wire('z', i)
