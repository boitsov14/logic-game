import { snakeCase } from 'change-case'
import { Component } from 'solid-js'
import { Tactic } from 'wasm'
import logic from './LogicProps'

const TacticButton: Component<{ tactic: Tactic }> = (props) => {
  return (
    <button
      class='w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 py-2 focus:from-neutral-950 focus:to-neutral-800 active:from-neutral-950 active:to-neutral-800 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500'
      disabled={!logic.availableTactics().includes(props.tactic)}
      onClick={() => logic.setTactic(props.tactic)}
    >
      {snakeCase(Tactic[props.tactic])}
    </button>
  )
}

export default TacticButton
