import { createEffect } from 'solid-js'
import { get_candidates, Tactic } from 'wasm'
import Premises from './Premises'
import TacticButtons from './TacticButtons'
import Conclusion from './Conclusion'
import logic from './LogicProps'

const App = () => {
  createEffect(() => {
    logic.setCandidates(get_candidates(logic.seq()))
  })

  createEffect(() => {
    logic.setAvailableTactics(logic.candidates().map((c) => c.tactic))
  })

  createEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'The tactic is now',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      logic.tactic() !== null ? Tactic[logic.tactic()!] : null,
    )
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
