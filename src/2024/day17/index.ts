import { Big } from 'big.js'
import isEqual from 'lodash/isEqual'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const bits = (num: number): string => {
  if (num === 0) return '000'
  const bits = Math.ceil(Math.log2(num + 1))
  const padding = Math.ceil(bits / 3) * 3
  return Number(num).toString(2).padStart(padding, '0')
}

export class Memory {
  program: number[]

  regA: number
  regB: number
  regC: number

  pointer: number = 0
  outs: number[] = []

  constructor(program: number[], regA: number, regB: number, regC: number) {
    this.program = program
    this.regA = regA
    this.regB = regB
    this.regC = regC
  }

  combo(operand: number): number {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand
      case 4:
        return this.regA
      case 5:
        return this.regB
      case 6:
        return this.regC
      case 7:
      default:
        throw new Error('Invalid operand')
    }
  }

  adv(operand: number) {
    const numerator = this.regA
    const denominator = new Big(2).pow(this.combo(operand)).toNumber()
    this.regA = Math.floor(new Big(numerator).div(denominator).toNumber())
    this.pointer += 2
  }

  bxl(operand: number) {
    this.regB = (this.regB ^ operand) >>> 0
    this.pointer += 2
  }

  bst(operand: number) {
    this.regB = this.combo(operand) % 8
    this.pointer += 2
  }

  jnz(operand: number) {
    if (this.regA === 0) {
      this.pointer += 2
      return
    }
    this.pointer = operand
  }

  bxc(operand: number) {
    this.regB = (this.regB ^ this.regC) >>> 0
    this.pointer += 2
  }

  out(operand: number) {
    this.outs.push(this.combo(operand) % 8)
    this.pointer += 2
  }

  bdv(operand: number) {
    const numerator = this.regA
    const denominator = new Big(2).pow(this.combo(operand)).toNumber()
    this.regB = Math.floor(new Big(numerator).div(denominator).toNumber())
    this.pointer += 2
  }

  cdv(operand: number) {
    const numerator = this.regA
    const denominator = new Big(2).pow(this.combo(operand)).toNumber()
    this.regC = Math.floor(new Big(numerator).div(denominator).toNumber())
    this.pointer += 2
  }

  exec() {
    while (this.pointer < this.program.length) {
      const opcode = this.program[this.pointer]
      const operand = this.program[this.pointer + 1]

      switch (opcode) {
        case 0:
          this.adv(operand)
          break
        case 1:
          this.bxl(operand)
          break
        case 2:
          this.bst(operand)
          break
        case 3:
          this.jnz(operand)
          break
        case 4:
          this.bxc(operand)
          break
        case 5:
          this.out(operand)
          break
        case 6:
          this.bdv(operand)
          break
        case 7:
          this.cdv(operand)
          break
        default:
          throw new Error('Invalid opcode')
      }
    }
  }

  // print() {
  //   let i = 0
  //
  //   const printCombo = (operand: number): string => {
  //     switch (operand) {
  //       case 0:
  //       case 1:
  //       case 2:
  //       case 3:
  //         return String(operand)
  //       case 4:
  //         return 'A'
  //       case 5:
  //         return 'B'
  //       case 6:
  //         return 'C'
  //       case 7:
  //       default:
  //         throw new Error('Invalid operand')
  //     }
  //   }
  //
  //   while (i < this.program.length) {
  //     const opcode = this.program[i]
  //     const operand = this.program[i + 1]
  //     switch (opcode) {
  //       case 0:
  //         console.log(`A = A / 2^${printCombo(operand)}`)
  //         break
  //       case 1:
  //         console.log('B = B XOR', operand)
  //         break
  //       case 2:
  //         console.log('B =', printCombo(operand), '% 8')
  //         break
  //       case 3:
  //         console.log('IF A != 0 JUMP to', printCombo(operand))
  //         break
  //       case 4:
  //         console.log('B = B XOR C')
  //         break
  //       case 5:
  //         console.log('PRINT', printCombo(operand), '% 8')
  //         break
  //       case 6:
  //         console.log('B = A / 2^', printCombo(operand))
  //         break
  //       case 7:
  //         console.log('C = A / 2^', printCombo(operand))
  //         break
  //       default:
  //         throw new Error('Invalid opcode')
  //     }
  //     i += 2
  //   }
  // }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [registersInput, programInput] = input.split('\n\n')
  const registers = registersInput.split('\n')
  const matchA = registers[0].match(/Register A: (\d+)/)
  const matchB = registers[1].match(/Register B: (\d+)/)
  const matchC = registers[2].match(/Register C: (\d+)/)
  const matchProg = programInput.match(/Program: ([\d,]*\d)/)
  if (!matchA || !matchB || !matchC || !matchProg) {
    throw new Error('Invalid input')
  }
  const program: number[] = matchProg[1].split(',').map((str) => parseInt(str, 10))
  const A = parseInt(matchA[1], 10)
  const B = parseInt(matchB[1], 10)
  const C = parseInt(matchC[1], 10)

  const t0 = performance.now()

  const memory = new Memory(program, A, B, C)
  memory.exec()
  const part1 = memory.outs.join(',')

  const queue: string[] = [''] // items of [solution, index]

  let part2: number | null = null
  while (queue.length) {
    const solution = queue.shift()!
    const index = solution.length / 3
    if (index === program.length) {
      part2 = parseInt(solution, 2)
      break
    }
    for (let n = 0; n < 8; n++) {
      const nextSolution = `${solution}${bits(n)}`
      const A = parseInt(nextSolution, 2)
      const memory = new Memory(program, A, B, C)
      memory.exec()
      if (isEqual(memory.outs, program.slice(-(index + 1)))) {
        queue.push(nextSolution)
      }
    }
  }

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
