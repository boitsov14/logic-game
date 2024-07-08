import { Component, ParentProps } from 'solid-js'
import { Sequent, to_latex_fml } from 'wasm'
import Latex from './Latex'

const Conclusion: Component<ParentProps<{ seq: Sequent }>> = (props) => {
  return (
    <div class='border border-gray-700 p-2'>
      <Latex tex={to_latex_fml(props.seq.suc)} />
    </div>
  )
}

export default Conclusion
