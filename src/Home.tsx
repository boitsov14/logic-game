import { useNavigate } from '@solidjs/router'
import { createSignal } from 'solid-js'

const Home = () => {
  const [inputValue, setInputValue] = createSignal('')
  const navigate = useNavigate()
  return (
    <div class='flex min-h-screen flex-col'>
      <header class='sticky top-0 z-10 bg-neutral-900 px-4 py-2'>
        <div class='mb-2 flex justify-between'>
          <h1 class='text-3xl font-bold'>Logic Game</h1>
        </div>
      </header>
      <main class='container mx-auto grow px-4'>
        <div class='my-2 flex py-1'>
          <input
            class='w-full rounded border border-neutral-500 bg-neutral-900 px-2 py-1 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
            type='text'
            placeholder='P or not P'
            value={inputValue()}
            onInput={(e) => setInputValue(e.target.value)}
          />
          <button
            class='ml-2 select-none rounded bg-blue-500 px-4 py-2 active:bg-blue-600 disabled:bg-blue-800 disabled:text-neutral-500'
            disabled={inputValue() === ''}
            onClick={() => navigate(`/${inputValue()}`)}
          >
            Start
          </button>
        </div>
      </main>
    </div>
  )
}

export default Home
