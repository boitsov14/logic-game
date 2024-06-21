import { parse_sequent, to_latex_fml, to_latex_seq } from 'wasm'
import Latex from './Latex'

const App = () => {
  const sequent = 'A, B, C |- D'
  const parsed = parse_sequent(sequent)
  const str = to_latex_seq(parsed)
  console.log(str) // eslint-disable-line no-console
  const ant = parsed.ant.map((x) => to_latex_fml(x))
  ant.forEach((p) => console.log(p)) // eslint-disable-line no-console

  return (
    <>
      <div class='container mx-auto px-4'>
        <div class='flex h-screen flex-col'>
          <div class='sticky top-0'>header</div>
          <div class='grow'>
            {/* sequent */}
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Latex tex={'P \\land Q \\to P \\and'} />
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
          <div class='sticky bottom-0 grid grid-cols-3 p-2'>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 px-4 py-2 text-white focus:from-green-600 focus:to-green-600 active:from-neutral-900 active:to-neutral-700'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 px-4 py-2 text-white'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 px-4 py-2 text-white'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 px-4 py-2 text-white'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 px-4 py-2 text-white'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 px-4 py-2 text-white'>
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
