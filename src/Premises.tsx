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
      class='w-full select-none rounded-full bg-gradient-to-b from-neutral-700 to-black px-4 py-2 text-start active:from-black active:to-neutral-700'
      onClick={() => {
        if (logic.fml1() === undefined) {
          logic.setFml1(props.ant)
        } else if (logic.fml2() === undefined) {
          logic.setFml2(props.ant)
        }
      }}
    >
      <Latex tex={to_latex_fml(props.ant)} />
    </button>
  )
}

const PremiseButtonSelected: Component<{ ant: Formula }> = (props) => {
  return (
    <button
      class='w-full select-none rounded-full bg-green-700 px-4 py-2 text-start'
      disabled
    >
      <Latex tex={to_latex_fml(props.ant)} />
    </button>
  )
}

const PremiseButtonDisabled: Component<{ ant: Formula }> = (props) => {
  return (
    <button
      class='w-full select-none rounded-full bg-neutral-800 px-4 py-2 text-start text-neutral-500'
      disabled
    >
      <Latex tex={to_latex_fml(props.ant)} />
    </button>
  )
}

const PremiseButton: Component<{ ant: Formula }> = (props) => {
  return (
    <Show
      when={JSON.stringify(props.ant) === JSON.stringify(logic.fml1())}
      fallback={
        <Show
          when={
            logic.fml1() === undefined
              ? logic
                  .fml1s()
                  .some((c) => JSON.stringify(c) === JSON.stringify(props.ant))
              : logic
                  .fml2s()
                  .some((c) => JSON.stringify(c) === JSON.stringify(props.ant))
          }
          fallback={<PremiseButtonDisabled ant={props.ant} />}
        >
          <PremiseButtonAvailable ant={props.ant} />
        </Show>
      }
    >
      <PremiseButtonSelected ant={props.ant} />
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
    <Show
      when={logic.fml1s().length === 0 && logic.fml2s().length === 0}
      fallback={<PremiseButtons />}
    >
      <PremiseTable />
    </Show>
  )
}

export default Premises
