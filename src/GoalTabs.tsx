import { Component, Index, Show } from 'solid-js'
import logic from './Logic'

const GoalTabSelected: Component<{ i: number }> = (props) => {
  return (
    <button
      class='flex-none select-none text-nowrap rounded-full bg-blue-800 px-3 py-2'
      disabled
    >
      Goal {props.i + 1}
    </button>
  )
}

const GoalTabAvailable: Component<{ i: number }> = (props) => {
  return (
    <button
      class='flex-none select-none text-nowrap rounded-full bg-gradient-to-b from-neutral-700 to-black px-3 py-2 active:from-black active:to-neutral-700'
      onClick={() => logic.setGoalIdx(props.i)}
    >
      Goal {props.i + 1}
    </button>
  )
}

const GoalTab: Component<{ i: number }> = (props) => {
  return (
    <Show
      when={props.i === logic.goalIdx()}
      fallback={<GoalTabAvailable i={props.i} />}
    >
      <GoalTabSelected i={props.i} />
    </Show>
  )
}

const GoalTabs = () => {
  return (
    <Show when={logic.seqs().length > 1}>
      <div class='flex overflow-x-auto'>
        <Index each={logic.seqs()}>{(_, i) => <GoalTab i={i} />}</Index>
      </div>
    </Show>
  )
}

export default GoalTabs
