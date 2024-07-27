/* @refresh reload */
import './index.css'
import { Route, Router } from '@solidjs/router'
import { render } from 'solid-js/web'
import Game from './Game'
import Home from './Home'

const root = document.getElementById('root')

render(
  () => (
    <Router>
      <Route path='/' component={Home} />
      <Route path='/game' component={Game} />
    </Router>
  ),
  root!,
)
