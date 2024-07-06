import {
  parse_sequent,
  to_latex_fml,
  to_latex_seq,
  Tactic,
  display,
  apply,
} from 'wasm'
import Premises from './Premises'

const App = () => {
  const s = 'A, B, not C, not D |- false'
  console.log(s) // eslint-disable-line no-console
  const s1 = s.normalize('NFKC').trim().replace(/\s+/g, ' ')
  console.log(s1) // eslint-disable-line no-console
  const seq = parse_sequent(s1)
  const s2 = to_latex_seq(seq)
  console.log(s2) // eslint-disable-line no-console
  const fml = seq.suc
  console.log(to_latex_fml(fml)) // eslint-disable-line no-console
  const ant = seq.ant.map((x) => to_latex_fml(x))
  ant.forEach((p) => console.log(p)) // eslint-disable-line no-console
  const byContra = Tactic.ByContra
  const s3 = display(byContra)
  console.log(s3) // eslint-disable-line no-console
  const result = apply(Tactic.Apply, seq)

  if (result === 'Done') {
    console.log('Processing Done result') // eslint-disable-line no-console
  } else if ('Subgoal' in result) {
    const sequent = result.Subgoal
    console.log(to_latex_seq(sequent)) // eslint-disable-line no-console
  } else if ('Subgoals' in result) {
    const [sequent1, sequent2] = result.Subgoals
    console.log(to_latex_seq(sequent1)) // eslint-disable-line no-console
    console.log(to_latex_seq(sequent2)) // eslint-disable-line no-console
  } else if ('Candidates' in result) {
    const formulas = result.Candidates
    console.log(formulas.map((fml1) => to_latex_fml(fml1))) // eslint-disable-line no-console
  }
  console.log(to_latex_seq(seq)) // eslint-disable-line no-console

  return (
    <>
      <div class='container mx-auto px-4'>
        <div class='flex h-screen flex-col'>
          <div class='sticky top-0'>header</div>
          <div class='grow'>
            <Premises seq={seq} />
          </div>
          <div class='sticky bottom-0 grid grid-cols-3 py-2'>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 px-4 py-2 text-sm focus:from-green-600 focus:to-green-600 active:from-neutral-900 active:to-neutral-700'>
                assumption
              </button>
            </div>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 px-4 py-2 text-xs'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button
                class='w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 px-4 py-2 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500'
                disabled
              >
                button
              </button>
            </div>
            <div class='p-1'>
              <button
                class='w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 px-4 py-2 disabled:from-neutral-950 disabled:to-neutral-950 disabled:text-neutral-500'
                disabled
              >
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-700 to-black px-4 py-2'>
                button
              </button>
            </div>
            <div class='p-1'>
              <button class='w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 px-4 py-2'>
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
