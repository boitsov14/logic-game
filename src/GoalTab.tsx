import { Component, Index, Show } from 'solid-js'
import logic from './LogicProps'

const GoalTabSelected: Component<{ i: number }> = (props) => {
  return (
    <button class='flex-none text-nowrap bg-blue-800 p-2' disabled>
      Goal {props.i + 1}
    </button>
  )
}

const GoalTabAvailable: Component<{ i: number }> = (props) => {
  return (
    <button
      class='flex-none select-none text-nowrap bg-gradient-to-b from-neutral-800 to-neutral-950 p-2 active:from-neutral-950 active:to-neutral-800'
      onClick={() => logic.setIdx(props.i)}
    >
      Goal {props.i + 1}
    </button>
  )
}

const GoalTab: Component<{ i: number }> = (props) => {
  return (
    <Show
      when={props.i === logic.idx()}
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
