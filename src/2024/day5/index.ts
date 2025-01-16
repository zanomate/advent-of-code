import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Rule } from './model/Rule'
import { Update } from './model/Update'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [rulesInput, updatesInput] = input.trim().split('\n\n')
  const rules = rulesInput.split('\n').map((str) => new Rule(str))
  const updates = updatesInput.split('\n').map((str) => new Update(str.split(',').map((num) => parseInt(num))))

  const t0 = performance.now()

  const part1 = updates.filter((update) => update.isCorrect(rules)).reduce((acc, update) => acc + update.middle, 0)
  const part2 = updates
    .filter((update) => !update.isCorrect(rules))
    .map((update) => update.fix(rules))
    .reduce((acc, update) => acc + update.middle, 0)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
