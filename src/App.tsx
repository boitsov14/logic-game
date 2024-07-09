import { Tactic, Sequent, Candidate } from 'wasm'
import { Accessor, Setter } from 'solid-js'
import Premises from './Premises'
import TacticButtons from './TacticButtons'
import Conclusion from './Conclusion'

export interface BaseProps {
  tactic: Accessor<Tactic | null>
  setTactic: Setter<Tactic | null>
  seq: Accessor<Sequent>
  setSeq: Setter<Sequent>
  candidates: Accessor<Candidate[]>
  setCandidates: Setter<Candidate[]>
}

const App = () => {
  return (
    <>
      <div class='container mx-auto px-4'>
        <div class='flex h-screen flex-col'>
          <div class='sticky top-0'>
            <h1>Logic Game</h1>
          </div>
          <div class='grow'>
            <h1>Premises</h1>
            <Premises />
            <h1>Conclusion</h1>
            <Conclusion />
          </div>
          <div class='sticky bottom-0 py-2'>
            <TacticButtons />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
