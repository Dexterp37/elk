import { postEvents } from './engagementPostEvents'
import { profileEvents } from './engagementProfileEvents'

interface EngagementDetails {
  [propName: string]: {
    engagement_type: string
    ui_additional_detail?: string
  }
}

export const engagementDetails: EngagementDetails = {
  'settings.interface.color-mode': {
    engagement_type: 'general',
  },
  'settings.interface.font-size': {
    engagement_type: 'general',
  },
  'settings.interface.theme-color': {
    engagement_type: 'general',
  },
  'discover.recommendation.open': {
    engagement_type: 'general',
  },
  'discover.recommendation.share': {
    engagement_type: 'share',
  },
  'header.signup': {
    engagement_type: 'general',
  },
  'header.login': {
    engagement_type: 'general',
  },
  'nav.signup': {
    engagement_type: 'general',
  },
  'nav.login': {
    engagement_type: 'general',
  },
  'home.post.create': {
    engagement_type: 'post',
  },
  'post.create': {
    engagement_type: 'post',
  },
  'post.edit': {
    engagement_type: 'post',
  },
  'post.reply': {
    engagement_type: 'post',
  },
  ...postEvents,
  ...profileEvents,
}
