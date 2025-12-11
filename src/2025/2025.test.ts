import { testDay } from '../utils/tests'

describe('2025', () => {
  it(`Day 1`, async () => {
    await testDay(2025, 1, 'sample', [], 3, 6)
    await testDay(2025, 1, 'input', [], 1172, 6932)
  })
  it(`Day 2`, async () => {
    await testDay(2025, 2, 'sample', [], 1227775554, 4174379265)
    await testDay(2025, 2, 'input', [], 30608905813, 31898925685)
  })
  it(`Day 3`, async () => {
    await testDay(2025, 3, 'sample', [], 357, 3121910778619)
    await testDay(2025, 3, 'input', [], 17142, 169935154100102)
  })
  it(`Day 4`, async () => {
    await testDay(2025, 4, 'sample', [], 13, 43)
    await testDay(2025, 4, 'input', [], 1540, 8972)
  })
  it(`Day 5`, async () => {
    await testDay(2025, 5, 'sample', [], 3, 782)
    await testDay(2025, 5, 'input', [], 14, 353863745078671)
  })
  it(`Day 6`, async () => {
    await testDay(2025, 6, 'sample', [], 4277556, 3263827)
    await testDay(2025, 6, 'input', [], 5595593539811, 10153315705125)
  })
  it(`Day 7`, async () => {
    await testDay(2025, 7, 'sample', [], 21, 40)
    await testDay(2025, 7, 'input', [], 1649, 16937871060075)
  })
  it(`Day 8`, async () => {
    await testDay(2025, 8, 'sample', [10], 40, 25272)
    await testDay(2025, 8, 'input', [1000], 115885, 274150525)
  })
  it(`Day 9`, async () => {
    await testDay(2025, 9, 'sample', [], 50, 24)
    await testDay(2025, 9, 'input', [], 4777816465, 1410501884)
  })
  it(`Day 10`, async () => {
    await testDay(2025, 10, 'sample', [], 7, 33)
    // await testDay(2025, 10, 'input', [], 524, 21696) It takes 7+ minutes
  })
  it(`Day 11`, async () => {
    await testDay(2025, 11, 'sample', [], 5, 0)
    await testDay(2025, 11, 'sample2', [], 0, 2)
    await testDay(2025, 11, 'input', [], 428, 331468292364745)
  })
  // it(`Day 12`, async () => {
  //   await testDay(2025, 12, 'sample', [], null, null)
  //   await testDay(2025, 12, 'input', [], null, null)
  // })
})
