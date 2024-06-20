import { parse_sequent, to_latex_fml, to_latex_seq } from 'wasm'
import Latex from './Latex'

const App = () => {
  const sequent = 'A, B, C |- D'
  const parsed = parse_sequent(sequent)
  const str = to_latex_seq(parsed)
  console.log(str)
  const ant = parsed.ant.map((x) => to_latex_fml(x))
  for (let p of ant) {
    console.log(p)
  }

  return (
    <>
      <div class='container mx-auto px-4 bg-info'>
        <div class='flex flex-col h-screen'>
          <div class='sticky top-0'>header</div>
          <div class='flex-grow'>
            {/* sequent */}
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Latex tex={'P \\land Q \\to P'} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Latex tex={'P \\land Q \\to P'} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* sequent end */}
          </div>
          <div class='grid grid-cols-3 p-2 sticky bottom-0'>
            <div class='p-1'>
              <button class='text-white w-full rounded-full py-2 px-4 bg-gradient-to-b from-neutral-700 to-neutral-900 active:from-neutral-900 active:to-neutral-700 focus:from-green-600 focus:to-green-600'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='text-white w-full rounded-full py-2 px-4 bg-gradient-to-b from-neutral-700 to-neutral-900'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='text-white w-full rounded-full py-2 px-4 bg-gradient-to-b from-neutral-700 to-neutral-900'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='text-white w-full rounded-full py-2 px-4 bg-gradient-to-b from-neutral-700 to-neutral-900'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='text-white w-full rounded-full py-2 px-4 bg-gradient-to-b from-neutral-700 to-neutral-900'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='text-white w-full rounded-full py-2 px-4 bg-gradient-to-b from-neutral-700 to-neutral-900'>
                button
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
