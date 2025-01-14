export class Rule {
  before: number
  after: number

  constructor(input: string) {
    const [before, after] = input.split('|').map(num => parseInt(num))
    this.before = before
    this.after = after
  }
}
