import {
  parse_sequent,
  to_latex_fml,
  to_latex_seq,
  Tactic,
  display,
} from 'wasm'
import Latex from './Latex'

const App = () => {
  const s = 'A, B, C |- \t\n\rP\t\n\r∧\t\n\rQ０\t\n\r'
  console.log(s) // eslint-disable-line no-console
  const s1 = s.normalize('NFKC').trim().replace(/\s+/g, ' ')
  console.log(s1) // eslint-disable-line no-console
  const seq = parse_sequent(s1)
  const s2 = to_latex_seq(seq)
  console.log(s2) // eslint-disable-line no-console
  const ant = seq.ant.map((x) => to_latex_fml(x))
  ant.forEach((p) => console.log(p)) // eslint-disable-line no-console
  const byContra = Tactic.ByContra
  const s3 = display(byContra)
  console.log(s3) // eslint-disable-line no-console

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
