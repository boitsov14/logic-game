import { snakeCase } from 'change-case'
import { createEffect } from 'solid-js'
import { get_candidates, Tactic, to_latex_fml } from 'wasm'
import Conclusion from './Conclusion'
import GoalTab from './GoalTab'
import logic from './LogicProps'
import Premises from './Premises'
import TacticButtons from './TacticButtons'

const App = () => {
  createEffect(() => {
    logic.setCandidates(get_candidates(logic.seq()))
  })

  createEffect(() => {
    const tactic = logic.tactic()
    // eslint-disable-next-line no-console
    console.log('Tactic: ', tactic !== null ? Tactic[tactic] : null)
  })
  createEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'Tactics: ',
      logic
        .tactics()
        .map((t) => snakeCase(Tactic[t]))
        .join(', '),
    )
  })
  createEffect(() => {
    const fml1 = logic.fml1()
    // eslint-disable-next-line no-console
    console.log('Fml1: ', fml1 !== null ? to_latex_fml(fml1) : null)
  })
  createEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'Fml1s: ',
      logic
        .fml1s()
        .map((f) => to_latex_fml(f))
        .join(', '),
    )
  })

  return (
    <div class='flex min-h-screen flex-col'>
      <header class='sticky top-0 z-10 bg-neutral-900 p-2'>
        <h1 class='text-3xl font-bold'>Logic Game</h1>
        <div class='container mx-auto px-2'>
          <GoalTab />
        </div>
      </header>
      <main class='container mx-auto grow px-4'>
        <h2 class='pb-2 text-2xl font-bold'>Premises</h2>
        <Premises />
        <h2 class='py-2 text-2xl font-bold'>Conclusion</h2>
        <Conclusion />
      </main>
      <footer class='container sticky bottom-0 z-10 mx-auto bg-neutral-900 p-2'>
        <TacticButtons />
      </footer>
    </div>
  )
}

export default App
