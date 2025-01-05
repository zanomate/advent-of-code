export const color = (text: string, colorCode: string) => {
  return `${colorCode}${text}\x1b[0m`
}

export const red = (text: string) => color(text, '\x1b[31m')
export const blue = (text: string) => color(text, '\x1b[34m')
export const green = (text: string) => color(text, '\x1b[32m')
