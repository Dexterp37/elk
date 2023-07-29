import Glean from '@mozilla/glean/web'
import { page } from '../../../telemetry/generated/pings'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => {
    // TODO: add in client id, logging on dev, upload off on dev, page path params to the ping/metric
    Glean.initialize('mozilla-social.elk', true, {})
    page.submit()
  })
})
