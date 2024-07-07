import { snakeCase } from 'change-case'
import { Component, ParentProps } from 'solid-js'
import { Tactic } from 'wasm'

const TacticButton: Component<
  ParentProps<{ tactic: Tactic; applicable: boolean }>
> = (props) => {
  return (
    <button
      class='w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 py-2 focus:from-neutral-950 focus:to-neutral-800 active:from-neutral-950 active:to-neutral-800 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500'
      disabled={!props.applicable}
    >
      {snakeCase(Tactic[props.tactic])}
    </button>
  )
}

export default TacticButton
