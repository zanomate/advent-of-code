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
})
