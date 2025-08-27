import { testDay } from '../utils/tests'

describe('2017', () => {
  it(`Day 1`, async () => {
    await testDay(2017, 1, 'input', 1251, 1244)
  })
  it(`Day 2`, async () => {
    await testDay(2017, 2, 'sample', 18, 7)
    await testDay(2017, 2, 'input', 45972, 326)
  })
  it(`Day 3`, async () => {
    await testDay(2017, 3, 'sample', 31, null)
    await testDay(2017, 3, 'input', 419, 295229)
  })
  it(`Day 4`, async () => {
    await testDay(2017, 4, 'input', 383, 265)
  })
  it(`Day 5`, async () => {
    await testDay(2017, 5, 'sample', 5, 10)
    await testDay(2017, 5, 'input', 372139, 29629538)
  })
  it(`Day 6`, async () => {
    await testDay(2017, 6, 'sample', 5, 4)
    await testDay(2017, 6, 'input', 12841, 8038)
  })
  it(`Day 7`, async () => {
    await testDay(2017, 7, 'sample', 'tknk', 60)
    await testDay(2017, 7, 'input', 'vtzay', 910)
  })
  it(`Day 8`, async () => {
    await testDay(2017, 8, 'sample', 1, 10)
    await testDay(2017, 8, 'input', 4902, 7037)
  })
  it(`Day 9`, async () => {
    await testDay(2017, 9, 'sample', 3, 17)
    await testDay(2017, 9, 'input', 12897, 7031)
  })
  it(`Day 10`, async () => {
    await testDay(2017, 10, 'input', 3770, 'a9d0e68649d0174c8756a59ba21d4dc6')
  })
})
