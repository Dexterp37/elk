import Glean from '@mozilla/glean/web'
import * as log from 'tauri-plugin-log-api'

import { linkClick, pageUrl, pageView, referrerUrl } from '../../../telemetry/generated/web'
import { userAgent } from '../../../telemetry/generated/identifiers'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    log.info('Glean: App mounted, start initing glean')

    const GLEAN_APP_ID = 'mozilla-social-web'
    const devMode = useAppConfig().env === ('dev' || 'canary' || 'preview')
    const uploadEnabled = devMode // this will eventually be a setting that the user can toggle

    Glean.initialize(GLEAN_APP_ID, uploadEnabled, {})
    userAgent.set(navigator.userAgent)

    // Debugging
    if (devMode) {
      Glean.setLogPings(true) // logs to the console
      Glean.setDebugViewTag('moso-elk-dev') // logs to https://debug-ping-preview.firebaseapp.com
    }

    const eventListener = (event) => {
      if (event.type === 'click') {
        handleButtonClick(event)
        handleLinkClick(event)
      }
    }

    function handleButtonClick(ev: MouseEvent) {
      const eventTarget = ev?.target as Element
      const closestButton = eventTarget.closest('button')
      // does the button have an href? if so, fire linkClick
      // else fire engagement event?
      if (closestButton)
        linkClick.record()
    }

    function handleLinkClick(ev: MouseEvent) {
      const eventTarget = ev?.target as Element
      const closestLink = eventTarget.closest('a')
      if (closestLink)
        linkClick.record({ target_url: closestLink.getAttribute('href') || '' })
    }

    window.addEventListener('click', eventListener)
  })

  nuxtApp.hook('page:finish', () => {
    pageUrl.set(window.location.href)

    if (document.referrer !== '')
      referrerUrl.set(window.location.href)
    else
      referrerUrl.set('')

    pageView.record()
  })
})
