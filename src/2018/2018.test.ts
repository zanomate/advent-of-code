import { testDay } from '../utils/tests'

describe('2018', () => {
  it(`Day 1`, async () => {
    await testDay(2018, 1, 'sample', [], 3, 2)
    await testDay(2018, 1, 'input', [], 599, 81204)
  })
  it(`Day 2`, async () => {
    await testDay(2018, 2, 'sample', [], 12, null)
    await testDay(2018, 2, 'sample2', [], null, 'fgij')
    await testDay(2018, 2, 'input', [], 7533, 'mphcuasvrnjzzkbgdtqeoylva')
  })
  it(`Day 3`, async () => {
    await testDay(2018, 3, 'sample', [], 4, 3)
    await testDay(2018, 3, 'input', [], 118223, 412)
  })
  it(`Day 4`, async () => {
    await testDay(2018, 4, 'sample', [], 240, 4455)
    await testDay(2018, 4, 'input', [], 19874, 22687)
  })
  it(`Day 5`, async () => {
    await testDay(2018, 5, 'sample', [], 10, 4)
    await testDay(2018, 5, 'input', [], 10878, 6874)
  })
  it(`Day 6`, async () => {
    await testDay(2018, 6, 'sample', [32], 17, 16)
    await testDay(2018, 6, 'input', [10000], 4166, 42250)
  })
})
