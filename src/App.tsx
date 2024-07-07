import {
  parse_sequent,
  to_latex_fml,
  to_latex_seq,
  Tactic,
  candidates,
} from 'wasm'
import { snakeCase } from 'change-case'
import { Accessor, createEffect, createSignal, Setter } from 'solid-js'
import Premises from './Premises'
import TacticButtons from './TacticButtons'

export interface BaseProps {
  tactic: Accessor<Tactic | null>
  setTactic: Setter<Tactic | null>
}

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
  const ants = seq.ants.map((x) => to_latex_fml(x))
  ants.forEach((p) => console.log(p)) // eslint-disable-line no-console
  const byContra = Tactic.ByContra
  const s3 = Tactic[byContra]
  console.log(s3) // eslint-disable-line no-console
  const s4 = snakeCase(s3)
  console.log(s4) // eslint-disable-line no-console
  const cs = candidates(seq)
  const applicableTactics = cs.map((c) => c.tactic)
  applicableTactics.forEach((t) => console.log(Tactic[t])) // eslint-disable-line no-console
  console.log(applicableTactics.includes(Tactic.Assumption)) // eslint-disable-line no-console

  const [tactic, setTactic] = createSignal<Tactic | null>(null)
  const base = { tactic, setTactic }

  createEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'The tactic is now',
      tactic() !== null ? Tactic[tactic()!] : null, // eslint-disable-line @typescript-eslint/no-non-null-assertion
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
            <Premises seq={seq} />
          </div>
          <div class='sticky bottom-0 py-2'>
            <TacticButtons base={base} applicableTactics={applicableTactics} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
