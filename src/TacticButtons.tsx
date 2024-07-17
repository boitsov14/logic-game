import { For, Show } from 'solid-js'
import { $enum } from 'ts-enum-util'
import { Tactic } from 'wasm'
import LockedTacticButton from './LockedTacticButton'
import logic from './LogicProps'
import TacticButton from './TacticButton'

const TacticButtons = () => {
  return (
    <div class='grid grid-cols-3'>
      <For each={$enum(Tactic).getValues()}>
        {(tactic) => (
          <div class='p-1'>
            <Show
              when={logic.tactic() === null}
              fallback={<LockedTacticButton tactic={tactic} />}
            >
              <TacticButton tactic={tactic} />
            </Show>
          </div>
        )}
      </For>
    </div>
  )
}

export default TacticButtons
