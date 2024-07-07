import { Component, ParentProps, For } from 'solid-js'
import { Tactic } from 'wasm'
import { $enum } from 'ts-enum-util'
import TacticButton from './TacticButton'
import { BaseProps } from './App'

const TacticButtons: Component<
  ParentProps<{ base: BaseProps; applicableTactics: Tactic[] }>
> = (props) => {
  return (
    <div class='grid grid-cols-3'>
      <For each={$enum(Tactic).getValues()}>
        {(tactic) => (
          <div class='p-1'>
            <TacticButton
              base={props.base}
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
