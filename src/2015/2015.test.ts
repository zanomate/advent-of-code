import { testDay } from '../utils/tests'

describe('2015', () => {
  it(`Day 1`, async () => {
    await testDay(2015, 1, 'input', 280, 1797)
  })
  it(`Day 2`, async () => {
    await testDay(2015, 2, 'input', 1586300, 3737498)
  })
  it(`Day 3`, async () => {
    await testDay(2015, 3, 'input', 2081, 2341)
  })
  it(`Day 4`, async () => {
    await testDay(2015, 4, 'input', 254575, 1038736)
  })
  it(`Day 5`, async () => {
    await testDay(2015, 5, 'input', 255, 55)
  })
  it(`Day 6`, async () => {
    await testDay(2015, 6, 'input', 569999, 17836115)
  })
  it(`Day 7`, async () => {
    await testDay(2015, 7, 'input', 956, 40149)
  })
  it(`Day 8`, async () => {
    await testDay(2015, 8, 'sample', 12, 19)
    await testDay(2015, 8, 'input', 1350, 2085)
  })
  it(`Day 9`, async () => {
    await testDay(2015, 9, 'sample', 605, 982)
    await testDay(2015, 9, 'input', 251, 898)
  })
  it(`Day 10`, async () => {
    await testDay(2015, 10, 'input', 252594, 3579328)
  })
  it(`Day 11`, async () => {
    await testDay(2015, 11, 'input', 'hepxxyzz', 'heqaabcc')
  })
  it(`Day 12`, async () => {
    await testDay(2015, 12, 'input', 156366, 96852)
  })
  it(`Day 13`, async () => {
    await testDay(2015, 13, 'sample', 330, null)
    await testDay(2015, 13, 'input', 733, 725)
  })
  it(`Day 14`, async () => {
    await testDay(2015, 14, 'input', 2696, 1084)
  })
  it(`Day 15`, async () => {
    await testDay(2015, 15, 'sample', 62842880, 57600000)
    await testDay(2015, 15, 'input', 21367368, 1766400)
  })
  it(`Day 16`, async () => {
    await testDay(2015, 16, 'input', 213, 323)
  })
  it(`Day 17`, async () => {
    await testDay(2015, 17, 'input', 1638, 17)
  })
  it(`Day 18`, async () => {
    await testDay(2015, 18, 'input', 1061, 1006)
  })
  it(`Day 19`, async () => {
    await testDay(2015, 19, 'input', 535, 212)
  })
  it(`Day 20`, async () => {
    await testDay(2015, 20, 'input', 831600, 884520)
  })
  it(`Day 21`, async () => {
    await testDay(2015, 21, 'input', 78, 148)
  })
  it(`Day 22`, async () => {
    await testDay(2015, 22, 'input', 900, 1216)
  })
  it(`Day 23`, async () => {
    await testDay(2015, 23, 'input', 170, 247)
  })
  it(`Day 24`, async () => {
    await testDay(2015, 24, 'input', 10723906903, 74850409)
  })
  it(`Day 25`, async () => {
    await testDay(2015, 25, 'input', 19980801, null)
  })
})
