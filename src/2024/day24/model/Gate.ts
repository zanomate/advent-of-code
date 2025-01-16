import { Wire } from './Wire'

export type Operation = 'AND' | 'XOR' | 'OR'

export class Gate {
  A: Wire
  B: Wire
  op: Operation
  out: Wire

  constructor(A: string, B: string, operation: Operation, out: string) {
    this.A = A
    this.B = B
    this.op = operation
    this.out = out
  }

  get inputs() {
    return [this.A, this.B]
  }
}
