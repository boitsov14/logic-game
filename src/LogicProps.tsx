import { parse_sequent, Tactic, Sequent, Candidate } from 'wasm'
import { Accessor, createSignal, Setter } from 'solid-js'

export interface LogicProps {
  tactic: Accessor<Tactic | null>
  setTactic: Setter<Tactic | null>
  seq: Accessor<Sequent>
  setSeq: Setter<Sequent>
  candidates: Accessor<Candidate[]>
  setCandidates: Setter<Candidate[]>
  availableTactics: Accessor<Tactic[]>
  setAvailableTactics: Setter<Tactic[]>
}

const s = 'A, B, not C, not D |- false'
const s1 = s.normalize('NFKC').trim().replace(/\s+/g, ' ')
const seq0 = parse_sequent(s1)

const [tactic, setTactic] = createSignal<Tactic | null>(null)
const [seq, setSeq] = createSignal(seq0)
const [candidates, setCandidates] = createSignal<Candidate[]>([])
const [availableTactics, setAvailableTactics] = createSignal<Tactic[]>([])

const logic: LogicProps = {
  tactic,
  setTactic,
  seq,
  setSeq,
  candidates,
  setCandidates,
  availableTactics,
  setAvailableTactics,
}

export default logic
