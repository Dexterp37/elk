interface EngagementDetails {
  [propName: string]: {
    engagement_type: string
    ui_additional_detail?: string
  }
}

export const engagementDetails: EngagementDetails = {
  'settings.interface.colorMode': {
    engagement_type: 'general',
  },
  'settings.interface.fontSize': {
    engagement_type: 'general',
  },
  'settings.interface.themeColor': {
    engagement_type: 'general',
  },

  'profile.follow.unblock': {
    engagement_type: 'general',
  },
  'profile.follow.unmute': {
    engagement_type: 'general',
  },
  'profile.follow.unfollow': {
    engagement_type: 'general',
  },
  'profile.follow.follow': {
    engagement_type: 'general',
  },
  'profile.follow.withdraw-follow-request': {
    engagement_type: 'general',
  },
  'profile.follow.follow-request': {
    engagement_type: 'general',
  },
}
