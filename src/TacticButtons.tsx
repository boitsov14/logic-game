import { For, Show } from 'solid-js'
import { Tactic } from 'wasm'
import { $enum } from 'ts-enum-util'
import TacticButton from './TacticButton'
import LockedTacticButton from './LockedTacticButton'
import logic from './LogicProps'

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
