import { Rule } from './Rule'

export class Update {
  readonly nums: number[]

  constructor(nums: number[]) {
    this.nums = nums
  }

  get middle() {
    return this.nums[Math.floor(this.nums.length / 2)]
  }

  isCorrect(rules: Rule[]): boolean {
    return rules.every((rule) => {
      if (!this.nums.includes(rule.before)) return true
      if (!this.nums.includes(rule.after)) return true
      return this.nums.indexOf(rule.before) < this.nums.indexOf(rule.after)
    })
  }

  fix(rules: Rule[]): Update {
    let solution: number[] = []

    // for each number of the update
    for (let i = 0; i < this.nums.length; i++) {
      const num = this.nums[i]
      // for each position in the current solution
      for (let j = 0; j <= solution.length; j++) {
        // try to insert the number at that position
        const candidateMidSolution = solution.toSpliced(j, 0, num)
        // and check if the solution violates any rule
        const isMidSolutionCorrect = new Update(candidateMidSolution).isCorrect(rules)
        if (isMidSolutionCorrect) {
          solution = candidateMidSolution
          break
        } else if (j === solution.length) {
          throw new Error('No solution found')
        }
      }
    }

    return new Update(solution)
  }
}
