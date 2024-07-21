import Conclusion from './Conclusion'
import GoalTabs from './GoalTabs'
import { consoleLogState, createEffectLogic } from './Logic'
import Premises from './Premises'
import TacticButtons from './TacticButtons'

const App = () => {
  createEffectLogic()
  consoleLogState()

  return (
    <div class='flex min-h-screen flex-col'>
      <header class='sticky top-0 z-10 bg-neutral-900 p-2'>
        <h1 class='pb-2 text-3xl font-bold'>Logic Game</h1>
        <div class='container mx-auto px-2'>
          <GoalTabs />
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
