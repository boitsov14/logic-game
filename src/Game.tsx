import { onMount, Show } from 'solid-js'
import Conclusion from './Conclusion'
import GoalTabs from './GoalTabs'
import logic, { consoleLogState, createEffectLogic, initSeq } from './Logic'
import Premises from './Premises'
import TacticButtons from './TacticButtons'

const Game = () => {
  onMount(() => {
    initSeq()
  })
  createEffectLogic()
  consoleLogState()

  return (
    <div class='flex min-h-screen flex-col'>
      <header class='sticky top-0 z-10 bg-neutral-900 p-2'>
        <div class='mb-2 flex justify-between'>
          <h1 class='text-3xl font-bold'>Logic Game</h1>
          <a
            href='/'
            class='rounded-full bg-gradient-to-b from-neutral-700 to-black px-4 py-2 active:from-black active:to-neutral-700'
          >
            Home
          </a>
        </div>
        <div class='container mx-auto px-2'>
          <GoalTabs />
        </div>
      </header>
      <main class='container mx-auto grow px-4'>
        <Show
          when={logic.seqs().length > 0}
          fallback={
            <div class='mt-2 flex justify-center bg-green-900 py-1 text-2xl font-bold'>
              Success! 🎉
            </div>
          }
        >
          <Show when={logic.seq().ants.length > 0}>
            <h2 class='pb-2 text-2xl font-bold'>Premises</h2>
            <Premises />
          </Show>
          <h2 class='pb-2 text-2xl font-bold'>Conclusion</h2>
          <Conclusion />
        </Show>
      </main>
      <footer class='container sticky bottom-0 z-10 mx-auto bg-neutral-900 p-2'>
        <TacticButtons />
      </footer>
    </div>
  )
}

export default Game
