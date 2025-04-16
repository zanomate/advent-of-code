import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const swapPosition = (psw: string[], i1: number, i2: number): string[] => {
  let res = [...psw]
  const tmp = res[i1]
  res[i1] = res[i2]
  res[i2] = tmp
  return res
}

const swapLetter = (psw: string[], l1: string, l2: string): string[] => {
  const i1 = psw.indexOf(l1)
  const i2 = psw.indexOf(l2)
  let res = [...psw]
  const tmp = res[i1]
  res[i1] = res[i2]
  res[i2] = tmp
  return res
}

const rotateLeft = (psw: string[], s: number): string[] => {
  const steps = s % psw.length
  return [...psw.slice(steps), ...psw.slice(0, steps)]
}

const rotateRight = (psw: string[], s: number): string[] => {
  const steps = s % psw.length
  return [...psw.slice(-steps), ...psw.slice(0, -steps)]
}

const rotateBasedOnLetter = (psw: string[], l: string): string[] => {
  const index = psw.indexOf(l)
  const steps = (index >= 4 ? index + 2 : index + 1) % psw.length
  return rotateRight(psw, steps)
}

const rotateBackBasedOnLetter = (psw: string[], l: string): string[] => {
  const index = psw.indexOf(l)
  const steps = (() => {
    switch (index) {
      case 0:
      case 1:
        return 1
      case 2:
        return 6
      case 3:
        return 2
      case 4:
        return 7
      case 5:
        return 3
      case 6:
        return 0
      case 7:
        return 4
      default:
        throw new Error(`Invalid index: ${index}`)
    }
  })()
  return rotateLeft(psw, steps)
}

const reversePositions = (psw: string[], i1: number, i2: number): string[] => {
  const tmp = psw.slice(i1, i2 + 1).reverse()
  return psw.toSpliced(i1, i2 - i1 + 1, ...tmp)
}

const movePositions = (psw: string[], i1: number, i2: number): string[] => {
  const tmp = psw.splice(i1, 1)[0]
  return psw.toSpliced(i2, 0, tmp)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const instructions = lines.map((line) => line.split(' '))

  const t0 = performance.now()

  let psw1 = 'abcdefgh'.split('')

  instructions.forEach((instruction) => {
    if (instruction[0] === 'swap') {
      if (instruction[1] === 'position') {
        // swap position X with position Y
        psw1 = swapPosition(psw1, Number(instruction[2]), Number(instruction[5]))
      } else {
        // swap letter X with letter Y
        psw1 = swapLetter(psw1, instruction[2], instruction[5])
      }
    } else if (instruction[0] === 'rotate') {
      if (instruction[1] === 'left') {
        // rotate left X steps
        psw1 = rotateLeft(psw1, Number(instruction[2]))
      } else if (instruction[1] === 'right') {
        // rotate right X steps
        psw1 = rotateRight(psw1, Number(instruction[2]))
      } else {
        // rotate based on position of letter X
        psw1 = rotateBasedOnLetter(psw1, instruction[6])
      }
    } else if (instruction[0] === 'reverse') {
      // reverse positions X through Y
      psw1 = reversePositions(psw1, Number(instruction[2]), Number(instruction[4]))
    } else {
      // move position X to position Y
      psw1 = movePositions(psw1, Number(instruction[2]), Number(instruction[5]))
    }
  })

  const part1 = psw1.join('')

  let psw2 = 'fbgdceah'.split('')

  instructions.reverse().forEach((instruction) => {
    if (instruction[0] === 'swap') {
      if (instruction[1] === 'position') {
        // swap position X with position Y
        psw2 = swapPosition(psw2, Number(instruction[2]), Number(instruction[5]))
      } else {
        // swap letter X with letter Y
        psw2 = swapLetter(psw2, instruction[2], instruction[5])
      }
    } else if (instruction[0] === 'rotate') {
      if (instruction[1] === 'left') {
        // rotate left X steps
        psw2 = rotateRight(psw2, Number(instruction[2]))
      } else if (instruction[1] === 'right') {
        // rotate right X steps
        psw2 = rotateLeft(psw2, Number(instruction[2]))
      } else {
        // rotate based on position of letter X
        psw2 = rotateBackBasedOnLetter(psw2, instruction[6])
      }
    } else if (instruction[0] === 'reverse') {
      // reverse positions X through Y
      psw2 = reversePositions(psw2, Number(instruction[2]), Number(instruction[4]))
    } else {
      // move position X to position Y
      psw2 = movePositions(psw2, Number(instruction[5]), Number(instruction[2]))
    }
  })

  const part2 = psw2.join('')

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
