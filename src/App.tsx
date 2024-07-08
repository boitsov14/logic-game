import {
  parse_sequent,
  to_latex_fml,
  to_latex_seq,
  Tactic,
  candidates,
  Sequent,
} from 'wasm'
import { snakeCase } from 'change-case'
import { Accessor, createEffect, createSignal, Setter } from 'solid-js'
import Premises from './Premises'
import TacticButtons from './TacticButtons'
import Conclusion from './Conclusion'

export interface BaseProps {
  tactic: Accessor<Tactic | null>
  setTactic: Setter<Tactic | null>
  seq: Accessor<Sequent>
  setSeq: Setter<Sequent>
}

const App = () => {
  const s = 'A, B, not C, not D |- false'
  console.log(s) // eslint-disable-line no-console
  const s1 = s.normalize('NFKC').trim().replace(/\s+/g, ' ')
  console.log(s1) // eslint-disable-line no-console
  const seq0 = parse_sequent(s1)
  const s2 = to_latex_seq(seq0)
  console.log(s2) // eslint-disable-line no-console
  const fml = seq0.suc
  console.log(to_latex_fml(fml)) // eslint-disable-line no-console
  const ants = seq0.ants.map((x) => to_latex_fml(x))
  ants.forEach((p) => console.log(p)) // eslint-disable-line no-console
  const byContra = Tactic.ByContra
  const s3 = Tactic[byContra]
  console.log(s3) // eslint-disable-line no-console
  const s4 = snakeCase(s3)
  console.log(s4) // eslint-disable-line no-console
  const cs = candidates(seq0)
  const applicableTactics = cs.map((c) => c.tactic)
  applicableTactics.forEach((t) => console.log(Tactic[t])) // eslint-disable-line no-console
  console.log(applicableTactics.includes(Tactic.Assumption)) // eslint-disable-line no-console

  const [tactic, setTactic] = createSignal<Tactic | null>(null)
  const [seq, setSeq] = createSignal(seq0)
  const base = { tactic, setTactic, seq, setSeq }

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
            <h1>Premises</h1>
            <Premises base={base} />
            <h1>Conclusion</h1>
            <Conclusion base={base} />
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
