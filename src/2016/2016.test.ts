import { testDay } from '../utils/tests'

describe('2016', () => {
  it(`Day 1`, async () => {
    await testDay(2016, 1, 'input', 299, 181)
  })
  it(`Day 2`, async () => {
    await testDay(2016, 2, 'sample', '1985', '5DB3')
    await testDay(2016, 2, 'input', '24862', '46C91')
  })
  it(`Day 3`, async () => {
    await testDay(2016, 3, 'input', 1050, 1921)
  })
  it(`Day 4`, async () => {
    await testDay(2016, 4, 'sample', 1514, null)
    await testDay(2016, 4, 'input', 137896, 501)
  })
  xit(`Day 5`, async () => {
    await testDay(2016, 5, 'sample', '18f47a30', '05ace8e3')
    await testDay(2016, 5, 'input', 'd4cd2ee1', 'f2c730e5')
  })
  it(`Day 6`, async () => {
    await testDay(2016, 6, 'sample', 'easter', 'advent')
    await testDay(2016, 6, 'input', 'zcreqgiv', 'pljvorrk')
  })
  it(`Day 7`, async () => {
    await testDay(2016, 7, 'sample', 2, null)
    await testDay(2016, 7, 'sample2', null, 3)
    await testDay(2016, 7, 'input', 118, 260)
  })
  it(`Day 8`, async () => {
    await testDay(2016, 8, 'input', 110, 'ZJHRKCPLYJ')
  })
  it(`Day 9`, async () => {
    await testDay(2016, 9, 'input', 183269, 11317278863)
  })
  it(`Day 10`, async () => {
    await testDay(2016, 10, 'input', 47, 2666)
  })
  xit(`Day 11`, async () => {
    await testDay(2016, 11, 'sample', 11, null)
    await testDay(2016, 11, 'input', 31, 55)
  })
  xit(`Day 12`, async () => {
    await testDay(2016, 12, 'sample', 42, null)
    await testDay(2016, 12, 'input', 318020, 9227674)
  })
  it(`Day 13`, async () => {
    await testDay(2016, 13, 'sample', 11, 151)
    await testDay(2016, 13, 'input', 82, 138)
  })
  xit(`Day 14`, async () => {
    await testDay(2016, 14, 'sample', 22728, 22551)
    await testDay(2016, 14, 'input', 16106, 22423)
  })
  it(`Day 15`, async () => {
    await testDay(2016, 15, 'sample', 5, null)
    await testDay(2016, 15, 'input', 400589, 3045959)
  })
  xit(`Day 16`, async () => {
    // await testDay(2016, 16, 'sample', '01100', null) // need to change size in index.ts
    await testDay(2016, 16, 'input', '10100011010101011', '01010001101011001')
  })
  it(`Day 17`, async () => {
    await testDay(2016, 17, 'input', 'RRRLDRDUDD', 706)
  })
  it(`Day 18`, async () => {
    await testDay(2016, 18, 'input', 1951, 20002936)
  })
  it(`Day 19`, async () => {
    await testDay(2016, 19, 'sample', 3, 2)
    await testDay(2016, 19, 'input', 1420280, 3014603)
  })
  it(`Day 20`, async () => {
    await testDay(2016, 20, 'sample', 3, 4294967288)
    await testDay(2016, 20, 'input', 22887907, 109)
  })
  it(`Day 21`, async () => {
    // await testDay(2016, 21, 'sample', 'decab', null) // need to change psw1 in index.ts
    await testDay(2016, 21, 'input', 'baecdfgh', 'cegdahbf')
  })
  it(`Day 22`, async () => {
    await testDay(2016, 22, 'input', 1038, null) // solution of part 2 was made by hand
  })
  it(`Day 23`, async () => {
    await testDay(2016, 23, 'sample', 3, null)
    await testDay(2016, 23, 'input', 11610, 479008170)
  })
  it(`Day 24`, async () => {
    await testDay(2016, 24, 'sample', 14, null)
    await testDay(2016, 24, 'input', 464, 652)
  })
  it(`Day 25`, async () => {
    await testDay(2016, 25, 'input', 198, null)
  })
})
