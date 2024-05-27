import { EventBus } from '@tuval/core'
import { StartBios } from '@tuval/forms'

import { MainController } from './client/controllers/MainController'
import './client/css/global.scss'
;(function (history: any) {
  var pushState = history.pushState
  history.pushState = function (state) {
    const result = pushState.apply(history, arguments)

    if (typeof history.onpushstate == 'function') {
      history.onpushstate({ state: state })
    }

    return result
  }
})(window.history)

window.onpopstate = (history as any).onpushstate = function (e) {
  EventBus.Default.fire('history.changed', { url: window.location.href })
}

window.addEventListener('load', (event) => {
  StartBios(MainController)
})
