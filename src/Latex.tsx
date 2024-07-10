import katex from 'katex'
import { Component } from 'solid-js'
import 'katex/dist/katex.min.css'

const Latex: Component<{ tex: string }> = (props) => {
  return (
    <div
      // eslint-disable-next-line solid/no-innerhtml
      innerHTML={katex.renderToString(props.tex, {
        throwOnError: false,
      })}
    />
  )
}

export default Latex
