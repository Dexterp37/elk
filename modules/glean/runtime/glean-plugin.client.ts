import Glean from '@mozilla/glean/web'
import * as log from 'tauri-plugin-log-api'
import { page } from '../../../telemetry/generated/pings'

// MDN Code for reference https://github.com/mdn/yari/blob/d11b0a8ba59d6c68e763eb8922ed7ce12fef2cae/client/src/telemetry/glean-context.tsx#L100
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    log.info('Glean: App Mounted, start initing glean')

    // TODO: add in client id, logging on dev, upload off on dev, page path params to the ping/metric
    Glean.initialize('mozilla-social.elk', true, {})
    Glean.setLogPings(true)
  })

  nuxtApp.hook('page:finish', () => {
    log.info('Glean: Page finished, sending page event')

    // TODO: add in client id, logging on dev, upload off on dev, page path params to the ping/metric
    page.submit()
  })
})
