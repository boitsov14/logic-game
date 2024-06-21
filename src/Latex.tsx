import katex from 'katex'
import { Component, ParentProps } from 'solid-js'
import 'katex/dist/katex.min.css'

const Latex: Component<ParentProps<{ tex: string }>> = (props) => {
  const html = () =>
    katex.renderToString(props.tex, {
      throwOnError: false,
    })
  return <div innerHTML={html()} /> // eslint-disable-line solid/no-innerhtml
}

export default Latex
