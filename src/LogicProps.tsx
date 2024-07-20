import { createSignal } from 'solid-js'
import { parse_sequent, Tactic, Sequent, Candidate, Formula } from 'wasm'

const parse = (s: string) => {
  return parse_sequent(s.normalize('NFKC').trim().replace(/\s+/g, ' '))
}

const seqs0: Sequent[] = []
seqs0.push(parse('A → B, A ⊢ B'))
seqs0.push(parse('A ∧ B ⊢ B ∧ A'))
seqs0.push(parse('A ∨ B ⊢ B ∨ A'))
seqs0.push(
  parse(
    'A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A ⊢ A',
  ),
)
seqs0.push(parse('P ⊢ P'))
seqs0.push(parse('P ⊢ P'))
seqs0.push(parse('P ⊢ P'))
seqs0.push(parse('P ⊢ P'))
seqs0.push(parse('P ⊢ P'))

const [seqs, setSeqs] = createSignal(seqs0)
const [idx, setIdx] = createSignal(0)
const [candidates, setCandidates] = createSignal<Candidate[]>([])
const [tactic, setTactic] = createSignal<Tactic | null>(null)
const [fml1, setFml1] = createSignal<Formula | null>(null)
const [fml2, setFml2] = createSignal<Formula | null>(null)

const seq = () => {
  return seqs()[idx()]! // eslint-disable-line @typescript-eslint/no-non-null-assertion
}
const tactics = () => {
  return candidates().map((c) => c.tactic)
}
const fml1s = () => {
  return candidates()
    .filter((c) => c.tactic === tactic() && fml1() === null)
    .map((c) => c.fml1)
    .filter((fml) => fml !== undefined)
}
const fml2s = () => {
  return candidates()
    .filter((c) => c.tactic === tactic() && c.fml1 === fml1())
    .map((c) => c.fml2)
    .filter((fml) => fml !== undefined)
}

const logic = {
  seqs,
  setSeqs,
  idx,
  setIdx,
  seq,
  candidates,
  setCandidates,
  tactics,
  tactic,
  setTactic,
  fml1s,
  fml1,
  setFml1,
  fml2s,
  fml2,
  setFml2,
}

export default logic
