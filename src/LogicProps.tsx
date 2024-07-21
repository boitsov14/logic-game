import { snakeCase } from 'change-case'
import { createEffect, createSignal } from 'solid-js'
import {
  parse_sequent,
  Tactic,
  Sequent,
  Candidate,
  Formula,
  to_latex_fml,
  get_candidates,
} from 'wasm'

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
// seqs0.push(parse('P ⊢ P'))
// seqs0.push(parse('P ⊢ P'))
// seqs0.push(parse('P ⊢ P'))
// seqs0.push(parse('P ⊢ P'))
// seqs0.push(parse('P ⊢ P'))

const [seqs, setSeqs] = createSignal(seqs0)
const [idx, setIdx] = createSignal(0)
const [candidates, setCandidates] = createSignal<Candidate[]>([])
const [tactic, setTactic] = createSignal<Tactic>()
const [fml1, setFml1] = createSignal<Formula>()
const [fml2, setFml2] = createSignal<Formula>()

const seq = () => {
  return seqs()[idx()]!
}
const tactics = () => {
  return candidates().map((c) => c.tactic)
}
const fml1s = () => {
  return candidates()
    .filter((c) => c.tactic === tactic() && fml1() === undefined)
    .map((c) => c.fml1)
    .filter((fml) => fml !== undefined)
}
const fml2s = () => {
  return candidates()
    .filter((c) => c.tactic === tactic() && c.fml1 === fml1())
    .map((c) => c.fml2)
    .filter((fml) => fml !== undefined)
}

export const createEffectLogic = () => {
  createEffect(() => {
    setCandidates(get_candidates(seq()))
  })
}

export const consoleLogState = () => {
  createEffect(() => {
    const tacticState = tactic()
    console.log(
      'tactic:',
      tacticState !== undefined ? snakeCase(Tactic[tacticState]) : '',
    )
  })
  createEffect(() => {
    console.log(
      'tactics:',
      tactics()
        .map((t) => snakeCase(Tactic[t]))
        .join(', '),
    )
  })
  createEffect(() => {
    const fml1State = fml1()
    console.log('fml1:', fml1State !== undefined ? to_latex_fml(fml1State) : '')
  })
  createEffect(() => {
    console.log(
      'fml1s:',
      fml1s()
        .map((f) => to_latex_fml(f))
        .join(', '),
    )
  })
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
