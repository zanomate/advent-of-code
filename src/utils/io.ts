import { promises as fs } from 'fs';

export function readFile(filePath: string): Promise<string> {
  try {
    return fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error('Error reading file');
  }
}

export function readUserInput(text: string = 'input:'): Promise<string> {
  console.log(text)
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
