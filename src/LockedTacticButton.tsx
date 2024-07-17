import { snakeCase } from 'change-case'
import { Component, Show } from 'solid-js'
import { Tactic } from 'wasm'
import logic from './LogicProps'

const LockedTacticButton: Component<{ tactic: Tactic }> = (props) => {
  return (
    <Show
      when={props.tactic === logic.tactic()}
      fallback={
        <button
          class='w-full rounded-full bg-neutral-800 py-2 text-neutral-500'
          disabled
        >
          {snakeCase(Tactic[props.tactic])}
        </button>
      }
    >
      <button class='w-full rounded-full bg-green-700 py-2' disabled>
        {snakeCase(Tactic[props.tactic])}
      </button>
    </Show>
  )
}

export default LockedTacticButton
