import { to_latex_fml } from 'wasm'
import Latex from './Latex'
import logic from './Logic'

const Conclusion = () => {
  return (
    <div class='border border-gray-700 p-2'>
      <Latex tex={to_latex_fml(logic.seq().suc)} />
    </div>
  )
}

export default Conclusion
