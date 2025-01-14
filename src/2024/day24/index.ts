import { readFile } from '../../utils/io'

const name = (letter: string, i: number) => `${letter}${i.toString().padStart(2, '0')}`

type Operation = 'AND' | 'XOR' | 'OR'

class Wire {
  A: string
  B: string
  operation: Operation
  actual_output: string
  correct_output: string | null = null

  constructor(A: string, B: string, operation: Operation, output: string) {
    this.A = A
    this.B = B
    this.operation = operation
    this.actual_output = output
  }

  get inputs() {
    return [this.A, this.B]
  }

  getOtherInput(input: string) {
    if (this.A === input) return this.B
    if (this.B === input) return this.A
    throw new Error(`Wire ${this.actual_output} does not have input ${input}`)
  }

  get output() {
    return this.correct_output || this.actual_output
  }
}

interface Bit0HalfAdder {
  xor: Wire
  and: Wire
}

interface BitIFullAdder {
  prevOr: Wire
  xor1: Wire
  xor2: Wire
  and1?: Wire
  and2?: Wire
  or?: Wire
}

export default async function () {
  const input = await readFile('./src/2024/day24/input.txt').then((text) => text.trim())
  const [valuesInput, wiresInput] = input.split('\n\n')

  const valueMap = new Map<string, boolean>()
  valuesInput.split('\n').forEach((line) => {
    const [name, value] = line.split(': ')
    valueMap.set(name, parseInt(value) === 1)
  })

  const wires: Wire[] = wiresInput.split('\n').map((line) => {
    const match = line.match(/(\w{3}) (AND|XOR|OR) (\w{3}) -> (\w{3})/)
    if (!match) throw new Error(`Invalid wire definition: ${line}`)
    return new Wire(match[1], match[3], match[2] as Wire['operation'], match[4])
  })

  const queue = [...wires]
  while (queue.length) {
    const wire = queue.shift()!
    if (!valueMap.has(wire.A) || !valueMap.has(wire.B)) {
      queue.push(wire)
    } else {
      switch (wire.operation) {
        case 'AND':
          valueMap.set(wire.output, valueMap.get(wire.A)! && valueMap.get(wire.B)!)
          break
        case 'XOR':
          valueMap.set(wire.output, valueMap.get(wire.A)! !== valueMap.get(wire.B)!)
          break
        case 'OR':
          valueMap.set(wire.output, valueMap.get(wire.A)! || valueMap.get(wire.B)!)
          break
      }
    }
  }

  const xBits: boolean[] = Array.from(valueMap.keys())
    .filter((key) => key.startsWith('x'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map((key) => valueMap.get(key)!)

  const yBits: boolean[] = Array.from(valueMap.keys())
    .filter((key) => key.startsWith('y'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map((key) => valueMap.get(key)!)

  const zNames: string[] = Array.from(valueMap.keys())
    .filter((name) => name.startsWith('z'))
    .sort((a, b) => a.localeCompare(b))
  const zBits: boolean[] = zNames.map((name) => valueMap.get(name)!)

  const part1 = parseInt(
    zBits
      .reverse()
      .map((bit) => (bit ? 1 : 0))
      .join(''),
    2,
  )

  console.log('Part 1:', part1)

  const findByInputs = (operation: Operation, input1: string, input2: string): Wire | null =>
    wires.find(
      (wire) => wire.operation === operation && wire.inputs.includes(input1) && wire.inputs.includes(input2),
    ) || null

  const findByOutput = (output: string): Wire | null => wires.find((wire) => wire.output === output) || null

  const wrongWires: Wire[] = []

  const swap = (wire1: Wire, wire2: Wire) => {
    wire1.correct_output = wire2.actual_output
    wire2.correct_output = wire1.actual_output
    wrongWires.push(wire1)
    wrongWires.push(wire2)
  }

  let bit = 0
  // @ts-ignore
  let carry: Wire = null
  while (true) {
    if (bit === 0) {
      carry = findByInputs('AND', name('x', bit), name('y', bit)) as Wire
    } else {
      const xor1 = findByInputs('XOR', name('x', bit), name('y', bit)) as Wire
      const and2 = findByInputs('AND', name('x', bit), name('y', bit)) as Wire
      const xor2 = findByInputs('XOR', xor1.output, carry.output)

      if (xor2 === null) {
        swap(xor1, and2)
        bit = 0
        continue
      }

      if (xor2.output !== name('z', bit)) {
        swap(xor2, findByOutput(name('z', bit)) as Wire)
        bit = 0
        continue
      }

      const and1 = findByInputs('AND', carry.output, xor1.output) as Wire
      const or = findByInputs('OR', and1.output, and2.output) as Wire
      carry = or
    }

    bit++
    if (bit >= zBits.length - 1) break
  }

  const part2 = wrongWires
    .map((wire) => wire.output)
    .sort()
    .join(',')

  console.log('Part 2:', part2)
}
