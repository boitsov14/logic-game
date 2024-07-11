import { createEffect } from 'solid-js'
import { get_candidates, Tactic } from 'wasm'
import Premises from './Premises'
import TacticButtons from './TacticButtons'
import Conclusion from './Conclusion'
import logic from './LogicProps'
import GoalTab from './GoalTab'

const App = () => {
  createEffect(() => {
    logic.setCandidates(get_candidates(logic.seq()))
  })

  createEffect(() => {
    logic.setAvailableTactics(logic.candidates().map((c) => c.tactic))
  })

  createEffect(() => {
    const tactic = logic.tactic()
    // eslint-disable-next-line no-console
    console.log('The tactic is now', tactic !== null ? Tactic[tactic] : null)
  })

  createEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'The available tactics are now',
      logic.availableTactics().map((t) => Tactic[t]),
    )
  })

  return (
    <>
      <div class='sticky top-0 z-10 bg-neutral-900 p-2'>
        <h1 class='text-3xl font-bold'>Logic Game</h1>
        <div class='container mx-auto px-4'>
          <GoalTab />
        </div>
      </div>
      <div class='container mx-auto px-4'>
        <h1>Premises</h1>
        <Premises />
        <h1>Conclusion</h1>
        <Conclusion />
      </div>
      <div class='container sticky bottom-0 z-10 mx-auto bg-neutral-900 p-2'>
        <TacticButtons />
      </div>
    </>
  )
}

export default App
