import isEqual from 'lodash/isEqual'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Gate, Operation } from './model/Gate'
import { Wire, x, z } from './model/Wire'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [wiresInput, gatesInput] = input.split('\n\n')

  const wireValues = new Map<Wire, boolean>()
  wiresInput.split('\n').forEach((line) => {
    const [name, value] = line.split(': ')
    wireValues.set(name, parseInt(value) === 1)
  })

  const gates: Gate[] = gatesInput.split('\n').map((line) => {
    const match = line.match(/(\w{3}) (AND|XOR|OR) (\w{3}) -> (\w{3})/)
    if (!match) throw new Error('Invalid gate')
    return new Gate(match[1], match[3], match[2] as Operation, match[4])
  })

  const t0 = performance.now()

  const queue = [...gates]
  while (queue.length) {
    const gate = queue.shift()!
    if (!wireValues.has(gate.A) || !wireValues.has(gate.B)) {
      queue.push(gate)
      continue
    }
    switch (gate.op) {
      case 'AND':
        wireValues.set(gate.out, wireValues.get(gate.A)! && wireValues.get(gate.B)!)
        break
      case 'XOR':
        wireValues.set(gate.out, wireValues.get(gate.A)! !== wireValues.get(gate.B)!)
        break
      case 'OR':
        wireValues.set(gate.out, wireValues.get(gate.A)! || wireValues.get(gate.B)!)
        break
    }
  }

  const zValues = Array.from(wireValues.keys())
    .filter((name) => name.startsWith('z'))
    .sort((a, b) => a.localeCompare(b))

  const part1 = parseInt(
    zValues
      .reverse()
      .map((name) => (wireValues.get(name)! ? '1' : '0'))
      .join(''),
    2,
  )

  const lastBit = zValues.length - 1

  const isInput = (wire: Wire): boolean => /[xy]\d{2}/.test(wire)
  const isOutput = (wire: Wire): boolean => /z\d{2}/.test(wire)

  const usages = new Map<Wire, Gate[]>()
  for (let gate of gates) {
    if (!usages.has(gate.A)) usages.set(gate.A, [])
    usages.get(gate.A)?.push(gate)
    if (!usages.has(gate.B)) usages.set(gate.B, [])
    usages.get(gate.B)?.push(gate)
  }

  const swapped = new Set<Wire>()
  for (let gate of gates) {
    if (gate.inputs.includes(x(0)) || gate.out === z(lastBit)) continue
    if (gate.op === 'XOR') {
      if (isInput(gate.A)) {
        if (!isInput(gate.B)) swapped.add(gate.out)
        if (isOutput(gate.out) && gate.out !== 'z00') swapped.add(gate.out)
        const gatesUsedByOut = usages.get(gate.out)
        const operations = gatesUsedByOut?.map((g) => g.op).sort()
        if (gate.out !== 'z00' && !isEqual(operations, ['AND', 'XOR'])) swapped.add(gate.out)
      } else if (!isOutput(gate.out)) swapped.add(gate.out)
    } else if (gate.op === 'AND') {
      if (isInput(gate.A)) {
        if (!isInput(gate.B)) swapped.add(gate.out)
      }
      const gatesUsedByOut = usages.get(gate.out)
      const operations = gatesUsedByOut?.map((g) => g.op).sort()
      if (!isEqual(operations, ['OR'])) swapped.add(gate.out)
    } else if (gate.op === 'OR') {
      if (isInput(gate.A) || isInput(gate.B)) swapped.add(gate.out)
      const gatesUsedByOut = usages.get(gate.out)
      const operations = gatesUsedByOut?.map((g) => g.op).sort()
      if (!isEqual(operations, ['AND', 'XOR'])) swapped.add(gate.out)
    }
  }

  const part2 = Array.from(swapped.values()).sort().join(',')

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
