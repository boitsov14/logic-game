import { Component, ParentProps, For } from 'solid-js'
import { Tactic } from 'wasm'
import { $enum } from 'ts-enum-util'
import TacticButton from './TacticButton'

const TacticButtons: Component<ParentProps<{ applicableTactics: Tactic[] }>> = (
  props,
) => {
  return (
    <div class='grid grid-cols-3'>
      <For each={$enum(Tactic).getValues()}>
        {(tactic) => (
          <div class='p-1'>
            <TacticButton
              tactic={tactic}
              applicable={props.applicableTactics.includes(tactic)}
            />
          </div>
        )}
      </For>
    </div>
  )
}

export default TacticButtons
