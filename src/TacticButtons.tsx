import { snakeCase } from 'change-case'
import { Component, For, Show } from 'solid-js'
import { $enum } from 'ts-enum-util'
import { Tactic } from 'wasm'
import logic from './Logic'

const TacticButtonAvailable: Component<{ tactic: Tactic }> = (props) => {
  return (
    <button
      class='w-full select-none rounded-full bg-gradient-to-b from-neutral-700 to-black py-2 active:from-black active:to-neutral-700'
      onClick={() => logic.setTactic(props.tactic)}
    >
      {snakeCase(Tactic[props.tactic])}
    </button>
  )
}

const TacticButtonSelected: Component<{ tactic: Tactic }> = (props) => {
  return (
    <button class='w-full select-none rounded-full bg-green-700 py-2' disabled>
      {snakeCase(Tactic[props.tactic])}
    </button>
  )
}

const TacticButtonDisabled: Component<{ tactic: Tactic }> = (props) => {
  return (
    <button
      class='w-full select-none rounded-full bg-neutral-800 py-2 text-neutral-500'
      disabled
    >
      {snakeCase(Tactic[props.tactic])}
    </button>
  )
}

const TacticButtonNoneSelected: Component<{ tactic: Tactic }> = (props) => {
  return (
    <Show
      when={logic.tactics().includes(props.tactic)}
      fallback={<TacticButtonDisabled tactic={props.tactic} />}
    >
      <TacticButtonAvailable tactic={props.tactic} />
    </Show>
  )
}

const TacticButtonSomeSelected: Component<{ tactic: Tactic }> = (props) => {
  return (
    <Show
      when={props.tactic === logic.tactic()}
      fallback={<TacticButtonDisabled tactic={props.tactic} />}
    >
      <TacticButtonSelected tactic={props.tactic} />
    </Show>
  )
}

const TacticButton: Component<{ tactic: Tactic }> = (props) => {
  return (
    <Show
      when={logic.tactic() === undefined}
      fallback={<TacticButtonSomeSelected tactic={props.tactic} />}
    >
      <TacticButtonNoneSelected tactic={props.tactic} />
    </Show>
  )
}

const TacticButtons = () => {
  return (
    <div class='grid grid-cols-3'>
      <For each={$enum(Tactic).getValues()}>
        {(tactic) => (
          <div class='p-1'>
            <TacticButton tactic={tactic} />
          </div>
        )}
      </For>
    </div>
  )
}

export default TacticButtons
