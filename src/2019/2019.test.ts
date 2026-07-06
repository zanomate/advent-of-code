import { testDay } from '../utils/tests'

describe('2019', () => {
  it(`Day 1`, async () => {
    await testDay(2019, 1, 'sample', [], 34241, 51316)
    await testDay(2019, 1, 'input', [], 3224048, 4833211)
  })
  it(`Day 2`, async () => {
    // No sample: the solution hard-codes the 1202 noun/verb and target.
    await testDay(2019, 2, 'input', [], 4576384, 5398)
  })
  it(`Day 3`, async () => {
    await testDay(2019, 3, 'sample', [], 6, 30)
    await testDay(2019, 3, 'input', [], 557, 56410)
  })
  it(`Day 4`, async () => {
    // No sample: the puzzle gives only a range, no example count.
    await testDay(2019, 4, 'input', [], 1686, 1145)
  })
  it(`Day 5`, async () => {
    // Sample echoes the diagnostic input (1 then 5).
    await testDay(2019, 5, 'sample', [], 1, 5)
    await testDay(2019, 5, 'input', [], 8332629, 8805067)
  })
  it(`Day 6`, async () => {
    await testDay(2019, 6, 'sample', [], 42, null)
    await testDay(2019, 6, 'sample2', [], null, 4)
    await testDay(2019, 6, 'input', [], 151345, 391)
  })
  it(`Day 7`, async () => {
    await testDay(2019, 7, 'sample', [], 43210, null)
    await testDay(2019, 7, 'sample2', [], null, 139629729)
    await testDay(2019, 7, 'input', [], 75228, 79846026)
  })
  it(`Day 8`, async () => {
    // No sample: the solution assumes the 25x6 puzzle dimensions.
    // Part 2 renders letters (ASCII art), not asserted. KFABY
    await testDay(2019, 8, 'input', [], 1716, null)
  })
  it(`Day 9`, async () => {
    await testDay(2019, 9, 'sample', [], 1219070632396864, 1219070632396864)
    await testDay(2019, 9, 'input', [], 3598076521, 90722)
  })
  it(`Day 10`, async () => {
    await testDay(2019, 10, 'sample', [], 210, 802)
    await testDay(2019, 10, 'input', [], 292, 317)
  })
  it(`Day 11`, async () => {
    // No sample: the puzzle provides no example program.
    // Part 2 renders the registration identifier (ASCII art), not asserted. AKERJFHK
    await testDay(2019, 11, 'input', [], 2594, null)
  })
  it(`Day 12`, async () => {
    // Part 1 runs a fixed 1000 steps; the sample energy is documented at 10/100 steps, so skip it.
    await testDay(2019, 12, 'sample', [], null, 2772)
    await testDay(2019, 12, 'sample2', [], null, 4686774924)
    await testDay(2019, 12, 'input', [], 8287, 528250271633772)
  })
  it(`Day 13`, async () => {
    // No sample: the puzzle is the arcade program itself.
    await testDay(2019, 13, 'input', [], 306, 15328)
  })
  it(`Day 14`, async () => {
    await testDay(2019, 14, 'sample', [], 31, null)
    await testDay(2019, 14, 'input', [], 751038, 2074843)
  })
  it(`Day 15`, async () => {
    // No sample: the puzzle is the droid program itself.
    await testDay(2019, 15, 'input', [], 216, 326)
  })
  it(`Day 16`, async () => {
    await testDay(2019, 16, 'sample', [], '24176176', null)
    await testDay(2019, 16, 'sample2', [], null, '84462026')
    await testDay(2019, 16, 'input', [], '90744714', '82994322')
  })
  it(`Day 17`, async () => {
    // No sample: the solution derives the scaffold from its own program.
    await testDay(2019, 17, 'input', [], 6520, 1071369)
  })
  it(`Day 18`, async () => {
    await testDay(2019, 18, 'sample', [], 8, null)
    await testDay(2019, 18, 'sample2', [], null, 8)
    await testDay(2019, 18, 'input', [], 5068, 1966)
  })
  it(`Day 19`, async () => {
    // No sample: the puzzle is the beam program itself.
    await testDay(2019, 19, 'input', [], 126, 11351625)
  })
  it(`Day 20`, async () => {
    await testDay(2019, 20, 'sample', [], 23, 26)
    await testDay(2019, 20, 'input', [], 628, 7506)
  })
  it(`Day 21`, async () => {
    // No sample: the puzzle is the springdroid program itself.
    await testDay(2019, 21, 'input', [], 19357180, 1139793906)
  })
  it(`Day 22`, async () => {
    // No sample: the solution hard-codes the 10007 deck and the huge part 2 deck.
    await testDay(2019, 22, 'input', [], 4485, '91967327971097')
  })
  it(`Day 23`, async () => {
    // No sample: the puzzle is the network program itself.
    await testDay(2019, 23, 'input', [], 23886, 18333)
  })
  it(`Day 24`, async () => {
    // Part 2 runs a fixed 200 minutes; the documented sample value is at 10 minutes, so skip it.
    await testDay(2019, 24, 'sample', [], 2129920, null)
    await testDay(2019, 24, 'input', [], 19516944, 2006)
  })
  it(`Day 25`, async () => {
    // No sample: the puzzle is the text-adventure program itself.
    // Part 2 is granted for free once every other star is collected.
    await testDay(2019, 25, 'input', [], '134807554', null)
  })
})
