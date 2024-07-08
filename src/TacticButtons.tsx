import { Component, ParentProps, For, Show } from 'solid-js'
import { Tactic } from 'wasm'
import { $enum } from 'ts-enum-util'
import TacticButton from './TacticButton'
import { BaseProps } from './App'
import LockedTacticButton from './LockedTacticButton'

const TacticButtons: Component<ParentProps<{ base: BaseProps }>> = (props) => {
  return (
    <div class='grid grid-cols-3'>
      <For each={$enum(Tactic).getValues()}>
        {(tactic) => (
          <div class='p-1'>
            <Show
              when={props.base.tactic() === null}
              fallback={
                <LockedTacticButton
                  base={props.base}
                  tactic={tactic}
                  isSelected={tactic === props.base.tactic()}
                />
              }
            >
              <TacticButton
                base={props.base}
                tactic={tactic}
                applicable={props.base
                  .candidates()
                  .map((c) => c.tactic)
                  .includes(tactic)}
              />
            </Show>
          </div>
        )}
      </For>
    </div>
  )
}

export default TacticButtons
