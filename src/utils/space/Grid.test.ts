import { Grid } from './Grid'
import { p } from './Pos'

const expectSize = (grid: Grid<string>, w: number, h: number) => {
  expect(grid.width).toEqual(w)
  expect(grid.height).toEqual(h)
}

const expectContent = (grid: Grid<string>, values: string[][]) => {
  const rowCount = values.length
  const colCount = values.length ? values[0].length : 0
  expectSize(grid, colCount, rowCount)
  for (let y = 0; y < rowCount; y++) {
    for (let x = 0; x < colCount; x++) {
      const pos = p(x, y)
      expect(grid.getCell(pos)).toEqual(values[y][x])
    }
  }
}

describe('Grid', () => {
  it('constructor', () => {
    const emptyGrid = new Grid<string>(0, 0, '#')
    expectSize(emptyGrid, 0, 0)
    expectContent(emptyGrid, [])
    const grid = new Grid<string>(2, 3, '#')
    expectSize(grid, 2, 3)
    expectContent(grid, [
      ['#', '#'],
      ['#', '#'],
      ['#', '#'],
    ])
    const gridFn = new Grid<string>(2, 3, (pos) => pos.toString())
    expectSize(gridFn, 2, 3)
    expectContent(gridFn, [
      ['0,0', '1,0'],
      ['0,1', '1,1'],
      ['0,2', '1,2'],
    ])
  })

  it('fromValues', () => {
    const emptyGrid = Grid.fromValues<string>([])
    expectSize(emptyGrid, 0, 0)
    expectContent(emptyGrid, [])
    const grid = Grid.fromValues<string>([
      ['#', '#'],
      ['#', '#'],
      ['#', '#'],
    ])
    expectSize(grid, 2, 3)
    expectContent(grid, [
      ['#', '#'],
      ['#', '#'],
      ['#', '#'],
    ])
  })

  it('hasCell', () => {
    const grid = new Grid<string>(2, 3, '#')
    expect(grid.hasCell(p(0, 0))).toBe(true)
    expect(grid.hasCell(p(1, 2))).toBe(true)
    expect(grid.hasCell(p(2, 1))).toBe(false)
    expect(grid.hasCell(p(-1, -1))).toBe(false)
    expect(grid.hasCell(p(3, 3))).toBe(false)
  })

  it('getCell', () => {
    const grid = new Grid<string>(2, 3, (pos) => pos.toString())
    expect(grid.getCell(p(0, 0))).toBe('0,0')
    expect(grid.getCell(p(1, 2))).toBe('1,2')
    expect(grid.getCell(p(2, 1))).toBe(null)
    expect(grid.getCell(p(-1, -1))).toBe(null)
    expect(grid.getCell(p(3, 3))).toBe(null)
  })

  it('setCell', () => {
    const grid = new Grid<string>(2, 3, '#')
    expect(grid.getCell(p(0, 0))).toBe('#')
    grid.setCell(p(0, 0), '*')
    expect(grid.getCell(p(0, 0))).toBe('*')
    expect(grid.getCell(p(1, 2))).toBe('#')
    grid.setCell(p(1, 2), (prev) => `${prev}${prev}`)
    expect(grid.getCell(p(1, 2))).toBe('##')
  })

  it('getRow', () => {
    const grid = new Grid<string>(2, 3, (pos) => pos.toString())
    expect(() => grid.getRow(-1)).toThrow('invalid row')
    expect(() => grid.getRow(3)).toThrow('invalid row')
    const row0 = grid.getRow(0)
    expect(row0.length).toBe(2)
    expect(row0).toEqual(['0,0', '1,0'])
    const row2 = grid.getRow(2)
    expect(row2.length).toBe(2)
    expect(row2).toEqual(['0,2', '1,2'])
  })

  it('getColumn', () => {
    const grid = new Grid<string>(2, 3, (pos) => pos.toString())
    expect(() => grid.getCol(-1)).toThrow('invalid column')
    expect(() => grid.getCol(2)).toThrow('invalid column')
    const col0 = grid.getCol(0)
    expect(col0.length).toBe(3)
    expect(col0).toEqual(['0,0', '0,1', '0,2'])
    const col1 = grid.getCol(1)
    expect(col1.length).toBe(3)
    expect(col1).toEqual(['1,0', '1,1', '1,2'])
  })

  it('getPortion', () => {
    const grid = new Grid<string>(2, 3, (pos) => pos.toString())
    expect(() => grid.getPortion(p(1, 1), p(0, 0))).toThrow('invalid portion')
    expect(() => grid.getPortion(p(1, 1), p(1, 1))).toThrow('invalid portion')
    expect(() => grid.getPortion(p(-1, -1), p(1, 1))).toThrow('invalid portion')
    expect(grid.getPortion(p(0, 0), p(1, 1))).toEqual([['0,0']])
    expect(grid.getPortion(p(0, 0), p(2, 1))).toEqual([['0,0', '1,0']])
    expect(grid.getPortion(p(0, 0), p(1, 2))).toEqual([['0,0'], ['0,1']])
    expect(grid.getPortion(p(0, 0), p(2, 2))).toEqual([
      ['0,0', '1,0'],
      ['0,1', '1,1'],
    ])
  })

  it('setPortion', () => {
    const grid = new Grid<string>(2, 3, '.')
    expect(() => grid.setPortion(p(1, 1), p(0, 0), '#')).toThrow('invalid portion')
    expect(() => grid.setPortion(p(1, 1), p(1, 1), '#')).toThrow('invalid portion')
    expect(() => grid.setPortion(p(-1, -1), p(1, 1), '#')).toThrow('invalid portion')
    expect(grid.cells).toEqual([
      ['.', '.'],
      ['.', '.'],
      ['.', '.'],
    ])
    grid.setPortion(p(0, 0), p(1, 1), '#')
    expect(grid.cells).toEqual([
      ['#', '.'],
      ['.', '.'],
      ['.', '.'],
    ])
    grid.setPortion(p(1, 0), p(2, 3), '#')
    expect(grid.cells).toEqual([
      ['#', '#'],
      ['.', '#'],
      ['.', '#'],
    ])
  })

  it('setRow', () => {
    const grid = new Grid<string>(2, 3, '.')
    expect(grid.cells).toEqual([
      ['.', '.'],
      ['.', '.'],
      ['.', '.'],
    ])
    grid.setRow(1, '#')
    expect(grid.cells).toEqual([
      ['.', '.'],
      ['#', '#'],
      ['.', '.'],
    ])
    grid.setRow(1, (i) => String(i))
    expect(grid.cells).toEqual([
      ['.', '.'],
      ['0', '1'],
      ['.', '.'],
    ])
    grid.setRow(1, (_, prev) => `${prev}${prev}`)
    expect(grid.cells).toEqual([
      ['.', '.'],
      ['00', '11'],
      ['.', '.'],
    ])
  })

  it('setCol', () => {
    const grid = new Grid<string>(2, 3, '.')
    expect(grid.cells).toEqual([
      ['.', '.'],
      ['.', '.'],
      ['.', '.'],
    ])
    grid.setCol(1, '#')
    expect(grid.cells).toEqual([
      ['.', '#'],
      ['.', '#'],
      ['.', '#'],
    ])
    grid.setCol(1, (i) => String(i))
    expect(grid.cells).toEqual([
      ['.', '0'],
      ['.', '1'],
      ['.', '2'],
    ])
    grid.setCol(1, (_, prev) => `${prev}${prev}`)
    expect(grid.cells).toEqual([
      ['.', '00'],
      ['.', '11'],
      ['.', '22'],
    ])
  })

  it('findPos', () => {
    const grid = new Grid<string>(2, 3, '.')
    const pos = p(1, 2)
    grid.setCell(pos, '#')
    expect(grid.findPos((c) => c === '?')).toEqual(null)
    expect(grid.findPos((c) => c === '#')?.equals(pos)).toBe(true)
  })

  it('positions', () => {
    const grid = new Grid<string>(2, 3, (pos) => pos.toString())
    const positions = grid.positions
    expect(positions.length).toEqual(6)
    expect(positions[0].equals(p(0, 0))).toBe(true)
    expect(positions[1].equals(p(1, 0))).toBe(true)
    expect(positions[2].equals(p(0, 1))).toBe(true)
    expect(positions[3].equals(p(1, 1))).toBe(true)
    expect(positions[4].equals(p(0, 2))).toBe(true)
    expect(positions[5].equals(p(1, 2))).toBe(true)
  })

  it('values', () => {
    const grid = new Grid<string>(2, 3, (pos) => pos.toString())
    expect(grid.values).toEqual(['0,0', '1,0', '0,1', '1,1', '0,2', '1,2'])
  })

  it('clone', () => {
    const grid = new Grid<string>(2, 3, (pos) => pos.toString())
    const clone = grid.clone()
    expect(clone.width).toEqual(grid.width)
    expect(clone.height).toEqual(grid.height)
    expect(clone.cells).toEqual(grid.cells)
  })
})
