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
  Result,
} from 'wasm'

const parse = (s: string) => {
  return parse_sequent(s.normalize('NFKC').trim().replace(/\s+/g, ' '))
}

const seqs0: Sequent[] = []
seqs0.push(parse('A → B, A ⊢ B'))
seqs0.push(parse('A ∧ B ⊢ B ∧ A'))
// seqs0.push(parse('A ∨ B ⊢ B ∨ A'))
seqs0.push(
  parse(
    'A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A ⊢ A',
  ),
)
seqs0.push(parse('⊢ P → P'))
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
    .filter(
      (c) =>
        c.tactic === tactic() && fml1() === undefined && fml2() === undefined,
    )
    .map((c) => c.fml1)
    .filter((fml) => fml !== undefined)
}
const fml2s = () => {
  return candidates()
    .filter(
      (c) =>
        c.tactic === tactic() &&
        JSON.stringify(c.fml1) === JSON.stringify(fml1()) &&
        fml2() === undefined,
    )
    .map((c) => c.fml2)
    .filter((fml) => fml !== undefined)
}

const setNewSeqs = (result: Result) => {
  if (result === 'Done') {
    setSeqs(seqs().filter((_, i) => i !== idx()))
    setIdx(0)
  } else if ('Subgoal' in result) {
    const newSeqs = [...seqs()]
    newSeqs[idx()] = result.Subgoal
    setSeqs(newSeqs)
    console.log('seq:', seqs()[idx()])
  } else if ('Subgoals' in result) {
    const newSeqs = [...seqs()]
    const [subgoal1, subgoal2] = result.Subgoals
    newSeqs.splice(idx(), 1, subgoal1, subgoal2)
    setSeqs(newSeqs)
  }
}

export const createEffectLogic = () => {
  createEffect(() => {
    setCandidates(get_candidates(seq()))
  })
  createEffect(() => {
    seqs()
    idx()
    setTactic(undefined)
    setFml1(undefined)
    setFml2(undefined)
  })
  createEffect(() => {
    if (
      tactic() !== undefined &&
      fml1() === undefined &&
      fml2() === undefined
    ) {
      const result = candidates().filter(
        (c) =>
          c.tactic === tactic() && c.fml1 === undefined && c.fml2 === undefined,
      )[0]?.result
      if (result !== undefined) {
        setNewSeqs(result)
      }
    }
  })
  createEffect(() => {
    if (
      tactic() !== undefined &&
      fml1() !== undefined &&
      fml2() === undefined
    ) {
      const result = candidates().filter(
        (c) =>
          c.tactic === tactic() &&
          JSON.stringify(c.fml1) === JSON.stringify(fml1()) &&
          c.fml2 === undefined,
      )[0]?.result
      if (result !== undefined) {
        setNewSeqs(result)
      }
    }
  })
  createEffect(() => {
    if (
      tactic() !== undefined &&
      fml1() !== undefined &&
      fml2() !== undefined
    ) {
      const result = candidates().filter(
        (c) =>
          c.tactic === tactic() &&
          JSON.stringify(c.fml1) === JSON.stringify(fml1()) &&
          JSON.stringify(c.fml2) === JSON.stringify(fml2()),
      )[0]?.result
      if (result !== undefined) {
        setNewSeqs(result)
      }
    }
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
  createEffect(() => {
    const fml2State = fml2()
    console.log('fml2:', fml2State !== undefined ? to_latex_fml(fml2State) : '')
  })
  createEffect(() => {
    console.log(
      'fml2s:',
      fml2s()
        .map((f) => to_latex_fml(f))
        .join(', '),
    )
  })
}

const logic = {
  seqs,
  idx,
  setIdx,
  seq,
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
