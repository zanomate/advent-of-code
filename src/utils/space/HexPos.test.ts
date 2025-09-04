import { HexDir } from './Dir'
import { HexPos } from './HexPos'

const expectXYZ = (pos: HexPos, x: number, y: number, z: number) => {
  expect(pos.x).toEqual(x)
  expect(pos.y).toEqual(y)
  expect(pos.z).toEqual(z)
}

describe('HexPos', () => {
  it('constructor', () => {
    const pos = new HexPos(123, 456, 789)
    expectXYZ(pos, 123, 456, 789)
  })

  it('equals', () => {
    const pos1 = new HexPos(123, 456, 789)
    const pos2 = new HexPos(123, 456, 999)
    const pos3 = new HexPos(789, 456, 123)
    const pos4 = new HexPos(777, 888, 999)
    expect(pos1.equals(pos1)).toBe(true)
    expect(pos1.equals(pos2)).toBe(false)
    expect(pos1.equals(pos3)).toBe(false)
    expect(pos1.equals(pos4)).toBe(false)
  })

  it('shift', () => {
    const pos = new HexPos(5, 5, 5)
    expectXYZ(pos.shift(HexDir.UP), 5, 4, 6)
    expectXYZ(pos.shift(HexDir.DOWN), 5, 6, 4)
    expectXYZ(pos.shift(HexDir.LEFT_UP), 4, 5, 6)
    expectXYZ(pos.shift(HexDir.LEFT_DOWN), 4, 6, 5)
    expectXYZ(pos.shift(HexDir.RIGHT_UP), 6, 4, 5)
    expectXYZ(pos.shift(HexDir.RIGHT_DOWN), 6, 5, 4)
    expectXYZ(pos.shift(HexDir.UP, 3), 5, 2, 8)
    expectXYZ(pos.shift(HexDir.DOWN, 3), 5, 8, 2)
    expectXYZ(pos.shift(HexDir.LEFT_UP, 3), 2, 5, 8)
    expectXYZ(pos.shift(HexDir.LEFT_DOWN, 3), 2, 8, 5)
    expectXYZ(pos.shift(HexDir.RIGHT_UP, 3), 8, 2, 5)
    expectXYZ(pos.shift(HexDir.RIGHT_DOWN, 3), 8, 5, 2)
  })

  it('distance', () => {
    const pos = new HexPos(1, 1, 1)
    const pos1 = new HexPos(2, 4, 6)
    const pos2 = new HexPos(8, -5, 0)
    const pos3 = new HexPos(-1, -1, -1)
    expect(pos.distance(pos)).toEqual(0)
    expect(pos.distance(pos1)).toEqual(4.5)
    expect(pos.distance(pos2)).toEqual(7)
    expect(pos.distance(pos3)).toEqual(3)
  })

  it('toString', () => {
    const pos1 = new HexPos(123, 456, 789)
    const pos2 = new HexPos(-123, 456, 789)
    const pos3 = new HexPos(123, -456, 789)
    const pos4 = new HexPos(-123, -456, -789)
    expect(pos1.toString()).toEqual('123,456,789')
    expect(pos2.toString()).toEqual('-123,456,789')
    expect(pos3.toString()).toEqual('123,-456,789')
    expect(pos4.toString()).toEqual('-123,-456,-789')
  })
})
