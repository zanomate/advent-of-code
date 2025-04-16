import md5 from 'md5'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  let index = 0
  let password1 = ''
  while (password1.length < 8) {
    const hash = md5(input + index)
    if (hash.startsWith('00000')) password1 += hash[5]
    index++
  }

  console.log('Part 1:', password1)

  index = 0
  let password2 = '........'
  let found = 0
  while (found < 8) {
    const hash = md5(input + index)
    if (hash.startsWith('00000')) {
      const pos = parseInt(hash[5], 16)
      if (pos < 8 && password2[pos] === '.') {
        password2 = password2.slice(0, pos) + hash[6] + password2.slice(pos + 1)
        found++
      }
    }
    index++
  }

  const t1 = performance.now()

  return [password1, password2, t1 - t0]
}
