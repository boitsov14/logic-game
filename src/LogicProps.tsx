import { parse_sequent, Tactic, Sequent, Candidate } from 'wasm'
import { Accessor, createSignal, Setter } from 'solid-js'

export interface LogicProps {
  seqs: Accessor<Sequent[]>
  setSeqs: Setter<Sequent[]>
  idx: Accessor<number>
  setIdx: Setter<number>
  seq: () => Sequent
  candidates: Accessor<Candidate[]>
  setCandidates: Setter<Candidate[]>
  tactic: Accessor<Tactic | null>
  setTactic: Setter<Tactic | null>
  tactics: Accessor<Tactic[]>
  setTactics: Setter<Tactic[]>
}

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
const [tactics, setTactics] = createSignal<Tactic[]>([])

const seq = (): Sequent => {
  return seqs()[idx()]! // eslint-disable-line @typescript-eslint/no-non-null-assertion
}

const logic: LogicProps = {
  seqs,
  setSeqs,
  idx,
  setIdx,
  seq,
  candidates,
  setCandidates,
  tactic,
  setTactic,
  tactics,
  setTactics,
}

export default logic
