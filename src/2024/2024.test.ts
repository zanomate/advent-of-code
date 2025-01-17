import { testDay } from '../utils/tests'

describe('2024', () => {
  it(`Day 1`, async () => {
    await testDay(2024, 1, 'sample', 11, 31)
    await testDay(2024, 1, 'input', 1590491, 22588371)
  })
  it(`Day 2`, async () => {
    await testDay(2024, 2, 'sample', 2, 4)
    await testDay(2024, 2, 'input', 341, 404)
  })
  it(`Day 3`, async () => {
    await testDay(2024, 3, 'sample', 161, 48)
    await testDay(2024, 3, 'input', 170778545, 82868252)
  })
  it(`Day 4`, async () => {
    await testDay(2024, 4, 'sample', 18, 9)
    await testDay(2024, 4, 'input', 2370, 1908)
  })
  it(`Day 5`, async () => {
    await testDay(2024, 5, 'sample', 143, 123)
    await testDay(2024, 5, 'input', 5087, 4971)
  })
  xit(`Day 6`, async () => {
    await testDay(2024, 6, 'sample', 41, 6)
    await testDay(2024, 6, 'input', 4789, 1304)
  })
  xit(`Day 7`, async () => {
    await testDay(2024, 7, 'sample', 3749, 11387)
    await testDay(2024, 7, 'input', 3351424677624, 204976636995111)
  })
  it(`Day 8`, async () => {
    await testDay(2024, 8, 'sample', 14, 34)
    await testDay(2024, 8, 'input', 228, 766)
  })
  it(`Day 9`, async () => {
    await testDay(2024, 9, 'sample', 1928, 2858)
    await testDay(2024, 9, 'input', 6334655979668, 6349492251099)
  })
  it(`Day 10`, async () => {
    await testDay(2024, 10, 'sample', 36, 81)
    await testDay(2024, 10, 'input', 611, 1380)
  })
  it(`Day 11`, async () => {
    await testDay(2024, 11, 'sample', 55312, null)
    await testDay(2024, 11, 'input', 235850, 279903140844645)
  })
  it(`Day 12`, async () => {
    await testDay(2024, 12, 'sample', 1930, 1206)
    await testDay(2024, 12, 'input', 1437300, 849332)
  })
  it(`Day 13`, async () => {
    await testDay(2024, 13, 'sample', 480, null)
    await testDay(2024, 13, 'input', 36870, 78101482023732)
  })
  it(`Day 14`, async () => {
    await testDay(2024, 14, 'sample', 12, null)
    await testDay(2024, 14, 'input', 218619324, 6446)
  })
  it(`Day 15`, async () => {
    await testDay(2024, 15, 'sample', 2028, null)
    await testDay(2024, 15, 'sample2', null, 9021)
    await testDay(2024, 15, 'input', 1552879, 1561175)
  })
  it(`Day 16`, async () => {
    await testDay(2024, 16, 'sample', 7036, 45)
    await testDay(2024, 16, 'sample2', 11048, 64)
    await testDay(2024, 16, 'input', 88468, 616)
  })
  it(`Day 17`, async () => {
    await testDay(2024, 17, 'sample', '4,6,3,5,6,3,5,2,1,0', null)
    await testDay(2024, 17, 'sample2', null, 117440)
    await testDay(2024, 17, 'input', '1,5,0,5,2,0,1,3,5', 236581108670061)
  })
  xit(`Day 18`, async () => {
    await testDay(2024, 18, 'input', 268, '64,11')
  })
  it(`Day 19`, async () => {
    await testDay(2024, 19, 'sample', 6, 16)
    await testDay(2024, 19, 'input', 276, 681226908011510)
  })
  it(`Day 20`, async () => {
    await testDay(2024, 20, 'input', 1358, 1005856)
  })
  it(`Day 21`, async () => {
    await testDay(2024, 21, 'sample', 126384, null)
    await testDay(2024, 21, 'input', 206798, 251508572750680)
  })
  it(`Day 22`, async () => {
    await testDay(2024, 22, 'sample', 37327623, null)
    await testDay(2024, 22, 'sample2', null, 23)
    await testDay(2024, 22, 'input', 18317943467, 2018)
  })
  it(`Day 23`, async () => {
    await testDay(2024, 23, 'sample', 7, 'co,de,ka,ta')
    await testDay(2024, 23, 'input', 893, 'cw,dy,ef,iw,ji,jv,ka,ob,qv,ry,ua,wt,xz')
  })
  it(`Day 24`, async () => {
    await testDay(2024, 24, 'sample', 2024, null)
    await testDay(2024, 24, 'input', 36902370467952, 'cvp,mkk,qbw,wcb,wjb,z10,z14,z34')
  })
  it(`Day 25`, async () => {
    await testDay(2024, 25, 'sample', 3, null)
    await testDay(2024, 25, 'input', 3508, null)
  })
})
