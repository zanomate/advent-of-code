import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Target {
  type: 'bot' | 'output'
  id: number
}

interface Bot {
  values: number[]
  low: Target
  high: Target
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n').sort() // this puts "values" at the end

  const t0 = performance.now()

  const bots = new Map<number, Bot>()
  const outputs = new Map<number, number>()

  for (let line of lines) {
    let match
    if ((match = line.match(/value (\d+) goes to bot (\d+)/))) {
      const botId = parseInt(match[2])
      bots.get(botId)!.values.push(parseInt(match[1]))
    } else if (
      (match = line.match(
        /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/,
      ))
    ) {
      const botId = parseInt(match[1])
      const low = { type: match[2] as 'bot' | 'output', id: parseInt(match[3]) }
      const high = { type: match[4] as 'bot' | 'output', id: parseInt(match[5]) }
      bots.set(botId, { values: [], low, high })
    }
  }

  let part1 = null
  let queue = Array.from(bots.keys())
  while (queue.length) {
    const botId = queue.shift()!
    const bot = bots.get(botId)!
    if (bot.values.length === 2) {
      const moveValue = (value: number, target: Target) => {
        if (target.type === 'bot') {
          bots.get(target.id)!.values.push(value)
        } else {
          outputs.set(target.id, value)
        }
      }
      const [low, high] = bot.values.sort((a, b) => a - b)
      if (low === 17 && high === 61) part1 = botId
      moveValue(low, bot.low)
      moveValue(high, bot.high)
    } else {
      queue.push(botId)
    }
  }

  const outValues = Array.from(outputs.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, value]) => value)

  const part2 = outValues[0] * outValues[1] * outValues[2]

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
