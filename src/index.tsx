/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'
import App from './App'

const root = document.getElementById('root')

render(() => <App />, root!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
