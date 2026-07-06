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
  it(`Day 7`, async () => {
    await testDay(2018, 7, 'sample', [0, 2], 'CABDFE', 15)
    await testDay(2018, 7, 'input', [60, 5], 'LFMNJRTQVZCHIABKPXYEUGWDSO', 1180)
  })
  it(`Day 9`, async () => {
    await testDay(2018, 9, 'sample', [], 32, 22563)
    await testDay(2018, 9, 'sample2', [], 146373, 1406506154)
    await testDay(2018, 9, 'input', [], 424639, 3516007333)
  })
  it(`Day 10`, async () => {
    await testDay(2018, 10, 'sample', [], null, 3)
    await testDay(2018, 10, 'input', [], null, 10813)
  })
  it(`Day 11`, async () => {
    await testDay(2018, 11, 'sample', [], '33,45', '90,269,16')
    await testDay(2018, 11, 'sample', [], '235,87', '234,272,18')
  })
  it(`Day 12`, async () => {
    await testDay(2018, 12, 'sample', [], 325, 999999999374)
    await testDay(2018, 12, 'input', [], 2571, 3100000000655)
  })
  it(`Day 13`, async () => {
    await testDay(2018, 13, 'sample', [], '7,3', null)
    await testDay(2018, 13, 'sample2', [], null, '6,4')
    await testDay(2018, 13, 'input', [], '118,112', '50,21')
  })
  it(`Day 14`, async () => {
    await testDay(2018, 14, 'sample', [], '5941429882', null)
    await testDay(2018, 14, 'sample2', [], null, 2018)
    await testDay(2018, 14, 'input', [], 3811491411, 20408083)
  })
  it(`Day 15`, async () => {
    await testDay(2018, 15, 'sample', [], 27730, 4988)
    await testDay(2018, 15, 'sample2', [], 39514, 31284)
    await testDay(2018, 15, 'sample3', [], 27755, 3478)
    await testDay(2018, 15, 'sample4', [], 28944, 6474)
    await testDay(2018, 15, 'sample5', [], 18740, 1140)
    await testDay(2018, 15, 'input', [], 217890, 43645)
  })
})
