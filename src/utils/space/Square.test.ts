import { p } from './Pos'
import { Square } from './Square'

const expectSize = (square: Square<string>, size: number) => {
  expect(square.width).toEqual(size)
  expect(square.height).toEqual(size)
  expect(square.size).toEqual(size)
}

const expectContent = (square: Square<string>, values: string[][]) => {
  const size = values.length
  expectSize(square, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pos = p(x, y)
      expect(square.getCell(pos)).toEqual(values[y][x])
    }
  }
}

describe('Square', () => {
  it('constructor', () => {
    const emptySquare = new Square<string>(0, '#')
    expectSize(emptySquare, 0)
    expectContent(emptySquare, [])
    const square = new Square<string>(3, '#')
    expectSize(square, 3)
    expectContent(square, [
      ['#', '#', '#'],
      ['#', '#', '#'],
      ['#', '#', '#'],
    ])
    const squareFn = new Square<string>(3, (pos) => pos.toString())
    expectSize(squareFn, 3)
    expectContent(squareFn, [
      ['0,0', '1,0', '2,0'],
      ['0,1', '1,1', '2,1'],
      ['0,2', '1,2', '2,2'],
    ])
  })

  it('fromValues', () => {
    const emptySquare = Square.fromValues<string>([])
    expectSize(emptySquare, 0)
    expectContent(emptySquare, [])
    const square = Square.fromValues<string>([
      ['#', '#', '#'],
      ['#', '#', '#'],
      ['#', '#', '#'],
    ])
    expectSize(square, 3)
    expectContent(square, [
      ['#', '#', '#'],
      ['#', '#', '#'],
      ['#', '#', '#'],
    ])
  })

  it('rotate', () => {
    const square = new Square<string>(3, (pos) => pos.toString())
    expectContent(square, [
      ['0,0', '1,0', '2,0'],
      ['0,1', '1,1', '2,1'],
      ['0,2', '1,2', '2,2'],
    ])
    const rotated = square.rotate()
    expectContent(rotated, [
      ['2,0', '2,1', '2,2'],
      ['1,0', '1,1', '1,2'],
      ['0,0', '0,1', '0,2'],
    ])
  })

  it('split', () => {
    const square = Square.fromValues<string>([
      ['A', 'A', 'B', 'B'],
      ['A', 'A', 'B', 'B'],
      ['C', 'C', 'D', 'D'],
      ['C', 'C', 'D', 'D'],
    ])
    expect(() => square.split(3)).toThrow('invalid unit size')
    const units = square.split(2)
    expect(units.length).toEqual(2)
    expect(units[0].length).toEqual(2)
    expect(units[1].length).toEqual(2)
    expectContent(units[0][0], [
      ['A', 'A'],
      ['A', 'A'],
    ])
    expectContent(units[0][1], [
      ['B', 'B'],
      ['B', 'B'],
    ])
    expectContent(units[1][0], [
      ['C', 'C'],
      ['C', 'C'],
    ])
    expectContent(units[1][1], [
      ['D', 'D'],
      ['D', 'D'],
    ])
  })

  it('compose', () => {
    const squareA = new Square(2, 'A')
    const squareB = new Square(2, 'B')
    const squareC = new Square(2, 'C')
    const squareD = new Square(2, 'D')

    const square = Square.compose([
      [squareA, squareB],
      [squareC, squareD],
    ])

    expectContent(square, [
      ['A', 'A', 'B', 'B'],
      ['A', 'A', 'B', 'B'],
      ['C', 'C', 'D', 'D'],
      ['C', 'C', 'D', 'D'],
    ])
  })
})
