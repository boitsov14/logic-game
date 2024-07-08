import { Component, ParentProps, For } from 'solid-js'
import { to_latex_fml } from 'wasm'
import Latex from './Latex'
import { BaseProps } from './App'

const Premises: Component<ParentProps<{ base: BaseProps }>> = (props) => {
  return (
    <>
      <table class='min-w-full border border-gray-700'>
        <tbody>
          <For each={props.base.seq().ants}>
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
    </>
  )
}

export default Premises
