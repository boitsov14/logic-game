import { Component, For, Show } from 'solid-js'
import { Formula, to_latex_fml } from 'wasm'
import Latex from './Latex'
import logic from './Logic'

const PremiseTable = () => {
  return (
    <table class='w-full border border-gray-700'>
      <tbody>
        <For each={logic.seq().ants}>
          {(ant) => (
            <tr class='border-b border-gray-700'>
              <td class='p-2'>
                <Latex tex={to_latex_fml(ant)} />
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}

const PremiseButtonAvailable: Component<{ ant: Formula }> = (props) => {
  return (
    <button
      class='w-full bg-gradient-to-b from-neutral-800 to-neutral-950 p-2 text-start active:from-neutral-950 active:to-neutral-800'
      onClick={() => logic.setFml1(props.ant)}
    >
      <Latex tex={to_latex_fml(props.ant)} />
    </button>
  )
}

const PremiseButtonDisabled: Component<{ ant: Formula }> = (props) => {
  return (
    <button
      class='w-full bg-neutral-800 p-2 text-start text-neutral-500'
      disabled
    >
      <Latex tex={to_latex_fml(props.ant)} />
    </button>
  )
}

const PremiseButton: Component<{ ant: Formula }> = (props) => {
  return (
    <Show
      when={logic
        .fml1s()
        .some((c) => JSON.stringify(c) === JSON.stringify(props.ant))}
      fallback={<PremiseButtonDisabled ant={props.ant} />}
    >
      <PremiseButtonAvailable ant={props.ant} />
    </Show>
  )
}

const PremiseButtons = () => {
  return (
    <table class='w-full'>
      <tbody>
        <For each={logic.seq().ants}>
          {(ant) => (
            <tr>
              <td>
                <PremiseButton ant={ant} />
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}

const Premises = () => {
  return (
    <Show when={logic.fml1s().length === 0} fallback={<PremiseButtons />}>
      <PremiseTable />
    </Show>
  )
}

export default Premises
