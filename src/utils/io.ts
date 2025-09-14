import { promises as fs } from 'fs'

export function readFile(filePath: string): Promise<string> {
  try {
    return fs.readFile(filePath, 'utf8')
  } catch (error) {
    throw new Error('Error reading file')
  }
}

export function readStringParameter(name: string, parameter: string | undefined) {
  if (parameter === undefined) throw new Error(`Missing parameter <${name}>.`)
  return parameter as string
}

export function readNumericParameter(name: string, parameter: string | undefined) {
  const asString = readStringParameter(name, parameter)
  const asNumber = Number(asString)
  if (isNaN(asNumber))
    throw new Error(`Expected parameter <${name}> to be a number. Found "${parameter}".`)
  return asNumber
}

export function readUserInput(text: string = 'input:'): Promise<string> {
  process.stdout.write(text)
  return new Promise((resolve) => {
    const stdin = process.stdin
    stdin.setEncoding('utf8')
    stdin.resume()
    stdin.once('data', (data: string) => {
      resolve(data.trim())
      stdin.pause()
    })
  })
}
