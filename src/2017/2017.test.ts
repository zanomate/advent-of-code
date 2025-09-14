import { testDay } from '../utils/tests'

describe('2017', () => {
  it(`Day 1`, async () => {
    await testDay(2017, 1, 'input', [], 1251, 1244)
  })
  it(`Day 2`, async () => {
    await testDay(2017, 2, 'sample', [], 18, 7)
    await testDay(2017, 2, 'input', [], 45972, 326)
  })
  it(`Day 3`, async () => {
    await testDay(2017, 3, 'sample', [], 31, null)
    await testDay(2017, 3, 'input', [], 419, 295229)
  })
  it(`Day 4`, async () => {
    await testDay(2017, 4, 'input', [], 383, 265)
  })
  it(`Day 5`, async () => {
    await testDay(2017, 5, 'sample', [], 5, 10)
    await testDay(2017, 5, 'input', [], 372139, 29629538)
  })
  it(`Day 6`, async () => {
    await testDay(2017, 6, 'sample', [], 5, 4)
    await testDay(2017, 6, 'input', [], 12841, 8038)
  })
  it(`Day 7`, async () => {
    await testDay(2017, 7, 'sample', [], 'tknk', 60)
    await testDay(2017, 7, 'input', [], 'vtzay', 910)
  })
  it(`Day 8`, async () => {
    await testDay(2017, 8, 'sample', [], 1, 10)
    await testDay(2017, 8, 'input', [], 4902, 7037)
  })
  it(`Day 9`, async () => {
    await testDay(2017, 9, 'sample', [], 3, 17)
    await testDay(2017, 9, 'input', [], 12897, 7031)
  })
  it(`Day 10`, async () => {
    await testDay(2017, 10, 'input', [], 3770, 'a9d0e68649d0174c8756a59ba21d4dc6')
  })
  it(`Day 11`, async () => {
    await testDay(2017, 11, 'input', [], 682, 1406)
  })
  it(`Day 12`, async () => {
    await testDay(2017, 12, 'sample', [], 6, 2)
    await testDay(2017, 12, 'input', [], 169, 179)
  })
  it(`Day 13`, async () => {
    await testDay(2017, 13, 'sample', [], 24, 10)
    await testDay(2017, 13, 'input', [], 748, 3873662)
  })
  it(`Day 14`, async () => {
    await testDay(2017, 14, 'sample', [], 8108, 1242)
    await testDay(2017, 14, 'input', [], 8074, 1212)
  })
  it(`Day 15`, async () => {
    await testDay(2017, 15, 'sample', [], 588, 309)
    await testDay(2017, 15, 'input', [], 600, 313)
  })
  it(`Day 16`, async () => {
    // await testDay(2017, 16, 'sample', [], 'baedc', null) // need to change DANCERS_COUNT to 5 in index.ts
    await testDay(2017, 16, 'input', [], 'ionlbkfeajgdmphc', 'fdnphiegakolcmjb')
  })
  it(`Day 17`, async () => {
    await testDay(2017, 16, 'sample', [], 638, null)
    await testDay(2017, 16, 'input', [], 1306, 20430489)
  })
  it(`Day 18`, async () => {
    await testDay(2017, 18, 'sample', [], 4, null)
    await testDay(2017, 18, 'sample2', [], null, 3)
    await testDay(2017, 18, 'input', [], 3423, 7493)
  })
  it(`Day 19`, async () => {
    await testDay(2017, 19, 'sample', [], 'ABCDEF', 38)
    await testDay(2017, 19, 'input', [], 'GSXDIPWTU', 16100)
  })
  it(`Day 20`, async () => {
    await testDay(2017, 20, 'sample', [], 0, null)
    await testDay(2017, 20, 'sample2', [], null, 1)
    await testDay(2017, 20, 'input', [], 125, 461)
  })
  it(`Day 21`, async () => {
    await testDay(2017, 21, 'sample', [2, 2], 12, 12)
    // await testDay(2017, 21, 'input', [5, 18], 12, 2758764) // it takes 5+ seconds
  })
  it(`Day 22`, async () => {
    // await testDay(2017, 22, 'sample', [10000, 10000000], 5587, 2511944)
    // await testDay(2017, 22, 'input', [10000, 10000000], 5223, 2511456) // it takes 3+ seconds
  })
  it(`Day 23`, async () => {
    await testDay(2017, 23, 'input', [], 8281, 911)
  })
  it(`Day 24`, async () => {
    await testDay(2017, 24, 'sample', [], 31, 19)
    await testDay(2017, 24, 'input', [], 1940, 1928)
  })
  it(`Day 25`, async () => {
    await testDay(2017, 25, 'sample', [], 3, null)
    await testDay(2017, 25, 'input', [], 2526, null)
  })
})
