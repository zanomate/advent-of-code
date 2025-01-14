import { readFile } from '../../utils/io'

type Pad = 'num' | 'dir'
type NumKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | 'A'
type DirKey = '^' | 'v' | '<' | '>' | 'A'

const NUM_KEYPAD_PATHS = {
  '1': ['', '>', '>>', '^', '^>,>^', '>>^,^>>', '^^', '^^>,>^^', '^^>>,^^>>', '>v', '>>v'],
  '2': ['<', '', '>', '^<,<^', '^', '>^,^>', '^^<,<^^', '^^', '^^>,>^^', 'v', '>v,v>'],
  '3': ['<<', '<', '', '^<<,<<^', '^<,<^', '^', '^^<<,<<^^', '^^<,<^^', '^^', 'v<,<v', 'v'],
  '4': ['v', 'v>,>v', '>>v,v>>', '', '>', '>>', '^', '^>,>^', '^>>,>>^', '>vv', '>>vv'],
  '5': ['<v,v<', 'v', '>v,v>', '<', '', '>', '^<,<^', '^', '^>,>^', 'vv', 'vv>,<vv'],
  '6': ['<<v,v<<', '<v,v<', 'v', '<<', '<', '', '^<<,<<^', '^<,<^', '^', 'vv<,<vv', 'vv'],
  '7': ['vv', 'vv>,>vv', 'vv>>,>>vv', 'v', 'v>,>v', '>>v,v>>', '', '>', '>>', '>vvv', '>>vvv'],
  '8': ['vv<,<vv', 'vv', 'vv>,>vv', 'v<,<v', 'v', '>v,v>', '<', '', '>', 'vvv', '>vvv,vvv>'],
  '9': ['vv<<,<<vv', 'vv<,<vv', 'vv', 'v<<,<<v', '<v,v<', 'v', '<<', '<', '', '<vvv,vvv<', 'vvv'],
  '0': ['^<', '^', '^>,>^', '^^<', '^^', '^^>,>^^', '^^^<', '^^^', '^^^>,>^^^', '', '>'],
  A: ['^<<', '^<,<^', '^', '^^<<', '^^<,<^^', '^^', '^^^<<', '^^^<,<^^^', '^^^', '<', ''],
}

const getNumPaths = (from: NumKey, to: NumKey): string[] => {
  const toIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A'].indexOf(to)
  return NUM_KEYPAD_PATHS[from][toIndex].split(',').map((p) => p + 'A')
}

const DIR_KEYPADS_PATHS = {
  '^': ['', 'v', 'v<', 'v>,>v', '>'],
  v: ['^', '', '<', '>', '>^,^>'],
  '<': ['>^', '>', '', '>>', '>>^'],
  '>': ['<^,^<', '<', '<<', '', '^'],
  A: ['<', '<v,v<', 'v<<', 'v', ''],
}

const getDirPaths = (from: DirKey, to: DirKey): string[] => {
  const toIndex = ['^', 'v', '<', '>', 'A'].indexOf(to)
  return DIR_KEYPADS_PATHS[from][toIndex].split(',').map((p) => p + 'A')
}

const memo = new Map<string, number>()

const getPathLengthBetweenNumKeys = (from: NumKey, to: NumKey, pads: Pad[]): number => {
  const key = `num-${from}-${to}-${pads.length}`
  if (memo.has(key)) return memo.get(key)!

  const currentPaths = getNumPaths(from, to)
  let tot = Math.min(...currentPaths.map((p) => getPathLength(p, pads)))
  memo.set(key, tot)
  return tot
}

const getPathLengthBetweenDirKeys = (from: DirKey, to: DirKey, pads: Pad[]): number => {
  const key = `dir-${from}-${to}-${pads.length}`
  if (memo.has(key)) return memo.get(key)!

  const currentPaths = getDirPaths(from, to)
  let tot = Math.min(...currentPaths.map((p) => getPathLength(p, pads)))
  memo.set(key, tot)
  return tot
}

const getPathLength = (code: string, pads: Pad[]): number => {
  if (!pads.length) return 1

  const [pad, ...otherPads] = pads

  let tot = 0

  if (pad === 'num') {
    let prevKey: NumKey = 'A'
    for (let key of code) {
      tot += getPathLengthBetweenNumKeys(prevKey, key as NumKey, otherPads)
      prevKey = key as NumKey
    }
  } else {
    let prevKey: DirKey = 'A'
    for (let key of code) {
      tot += getPathLengthBetweenDirKeys(prevKey, key as DirKey, otherPads)
      prevKey = key as DirKey
    }
  }

  return tot
}

export default async function () {
  const input = await readFile('./src/2024/day21/input.txt').then((text) => text.trim())
  const codes = input.split('\n')

  const t0 = performance.now()

  const pads1: Pad[] = ['num', 'dir', 'dir']
  const pads2 = ['num', ...Array(25).fill('dir'), 'dir']

  let complexity1 = 0
  let complexity2 = 0

  codes.forEach((code) => {
    let length1 = getPathLength(code, pads1)
    let length2 = getPathLength(code, pads2)
    const value = parseInt(code.match(/(\d+)A/)![1])
    complexity1 += length1 * value
    complexity2 += length2 * value
  })

  const t1 = performance.now()

  console.log('Part 1:', complexity1)
  console.log('Part 2:', complexity2)
  console.log('Time (ms)', t1 - t0)
}
