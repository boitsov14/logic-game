import { Component, ParentProps, Show } from 'solid-js'
import { Tactic } from 'wasm'
import { snakeCase } from 'change-case'
import TacticButton from './TacticButton'
import { BaseProps } from './App'

const LockedTacticButton: Component<
  ParentProps<{ base: BaseProps; tactic: Tactic; isSelected: boolean }>
> = (props) => {
  return (
    <Show
      when={props.isSelected}
      fallback={
        <TacticButton
          base={props.base}
          tactic={props.tactic}
          applicable={false}
        />
      }
    >
      <button class='w-full rounded-full bg-green-600 py-2' disabled>
        {snakeCase(Tactic[props.tactic])}
      </button>
    </Show>
  )
}

export default LockedTacticButton
