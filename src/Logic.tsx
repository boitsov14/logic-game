import { useNavigate, useParams } from '@solidjs/router'
import { snakeCase } from 'change-case'
import { batch, createEffect, createSignal } from 'solid-js'
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

interface State {
  seqs: Sequent[]
  goalIdx: number
  tactic: Tactic | undefined
  fml1: Formula | undefined
  fml2: Formula | undefined
}

const [parseErr, setParseErr] = createSignal('')
const [seqs, setSeqs] = createSignal<Sequent[]>([])
const [goalIdx, setGoalIdx] = createSignal(0)
const [candidates, setCandidates] = createSignal<Candidate[]>([])
const [tactic, setTactic] = createSignal<Tactic>()
const [fml1, setFml1] = createSignal<Formula>()
const [fml2, setFml2] = createSignal<Formula>()
const [history, setHistory] = createSignal<State[]>([])
const [historyIdx, setHistoryIdx] = createSignal(0)

const seq = () => {
  return seqs()[goalIdx()]!
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

export const initSeq = () => {
  const navigate = useNavigate()
  const params = useParams()
  const str = decodeURIComponent(params['seq']!)
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim()
  try {
    setSeqs([parse_sequent(str)])
    setParseErr('')
    setHistory([
      {
        seqs: seqs(),
        goalIdx: 0,
        tactic: undefined,
        fml1: undefined,
        fml2: undefined,
      },
    ])
  } catch (e) {
    setParseErr(e as string)
    navigate('/')
  }
}

export const cleanUpState = () => {
  batch(() => {
    setSeqs([])
    setGoalIdx(0)
    setTactic(undefined)
    setFml1(undefined)
    setFml2(undefined)
    setHistory([])
    setHistoryIdx(0)
  })
}

export const canUndo = () => {
  return historyIdx() > 0
}

export const undo = () => {
  if (historyIdx() > 0) {
    setHistoryIdx((pre) => pre - 1)
    const state = history()[historyIdx()]!
    batch(() => {
      setSeqs(state.seqs)
      setGoalIdx(state.goalIdx)
      setTactic(state.tactic)
      setFml1(state.fml1)
      setFml2(state.fml2)
    })
  }
}

export const canRedo = () => {
  return historyIdx() < history().length - 1
}

export const redo = () => {
  if (historyIdx() < history().length - 1) {
    setHistoryIdx((pre) => pre + 1)
    const state = history()[historyIdx()]!
    batch(() => {
      setSeqs(state.seqs)
      setGoalIdx(state.goalIdx)
      setTactic(state.tactic)
      setFml1(state.fml1)
      setFml2(state.fml2)
    })
  }
}

const updateGoalIdx = () => {
  const newHistory = structuredClone(history())
  newHistory[historyIdx()]!.goalIdx = goalIdx()
  setHistory(newHistory)
}

const saveState = () => {
  setHistoryIdx((pre) => pre + 1)
  const preHistory = structuredClone(history()).slice(0, historyIdx())
  setHistory([
    ...preHistory,
    {
      seqs: seqs(),
      goalIdx: goalIdx(),
      tactic: tactic(),
      fml1: fml1(),
      fml2: fml2(),
    },
  ])
}

const setNewSeqs = (result: Result) => {
  if (result === 'Done') {
    setSeqs(seqs().filter((_, i) => i !== goalIdx()))
    setGoalIdx(0)
  } else if ('Subgoal' in result) {
    const newSeqs = structuredClone(seqs())
    newSeqs[goalIdx()] = result.Subgoal
    setSeqs(newSeqs)
    console.log('seq:', seqs()[goalIdx()])
  } else if ('Subgoals' in result) {
    const newSeqs = structuredClone(seqs())
    const [subgoal1, subgoal2] = result.Subgoals
    newSeqs.splice(goalIdx(), 1, subgoal1, subgoal2)
    setSeqs(newSeqs)
  }
}

export const createEffectLogic = () => {
  createEffect(() => {
    if (seqs().length === 0) {
      setCandidates([])
    } else {
      setCandidates(get_candidates(seq()))
    }
  })
  createEffect(() => {
    seqs()
    goalIdx()
    batch(() => {
      setTactic(undefined)
      setFml1(undefined)
      setFml2(undefined)
    })
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
    } else if (
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
    } else if (
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

// eslint-disable-next-line import/no-unused-modules
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

const setTacticAndSaveState = (t: Tactic) => {
  updateGoalIdx()
  setTactic(t)
  saveState()
}
const setFml1AndSaveState = (f1: Formula) => {
  updateGoalIdx()
  setFml1(f1)
  saveState()
}
const setFml2AndSaveState = (f2: Formula) => {
  updateGoalIdx()
  setFml2(f2)
  saveState()
}

const logic = {
  parseErr,
  setParseErr,
  seqs,
  goalIdx,
  setGoalIdx,
  seq,
  tactics,
  tactic,
  setTactic: setTacticAndSaveState,
  fml1s,
  fml1,
  setFml1: setFml1AndSaveState,
  fml2s,
  fml2,
  setFml2: setFml2AndSaveState,
}

export default logic
