import { parse_sequent, to_latex_fml, to_latex_seq } from 'wasm'

const App = () => {
  const sequent = 'A, B, C |- D'
  const parsed = parse_sequent(sequent)
  const str = to_latex_seq(parsed)
  console.log(str)
  const ant = parsed.ant.map((x) => to_latex_fml(x))
  for (let p of ant) {
    console.log(p)
  }

  return (
    <p class='text-4xl text-green-700 text-center py-20'>Hello tailwind!</p>
  )
}

export default App
