import katex from 'katex'
import { Component, ParentProps } from 'solid-js'
import 'katex/dist/katex.min.css'

const Latex: Component<ParentProps<{ tex: string }>> = (props) => {
  const html = katex.renderToString(props.tex, {
    throwOnError: false,
    output: 'html',
  })
  return <div innerHTML={html} />
}

export default Latex
