/* @refresh reload */
import './index.css'
import { HashRouter, Route } from '@solidjs/router'
import { render } from 'solid-js/web'
import Game from './Game'
import Home from './Home'

const root = document.getElementById('root')

render(
  () => (
    <HashRouter>
      <Route path='/' component={Home} />
      <Route path='/:seq' component={Game} />
    </HashRouter>
  ),
  root!,
)
