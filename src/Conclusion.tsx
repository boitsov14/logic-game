import { Component, ParentProps } from 'solid-js'
import { to_latex_fml } from 'wasm'
import Latex from './Latex'
import { BaseProps } from './App'

const Conclusion: Component<ParentProps<{ base: BaseProps }>> = (props) => {
  return (
    <div class='border border-gray-700 p-2'>
      <Latex tex={to_latex_fml(props.base.seq().suc)} />
    </div>
  )
}

export default Conclusion
