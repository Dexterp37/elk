interface EngagementDetails {
  [propName: string]: {
    engagement_type: string
    ui_additional_detail?: string
  }
}

export const engagementDetails: EngagementDetails = {
  'settings.interface.colorMode': {
    engagement_type: 'general',
    ui_additional_detail: 'Fired when a user changes their interface color mode',
  },
  'settings.interface.fontSize': {
    engagement_type: 'general',
    ui_additional_detail: 'Fired when a user changes their interface font size',
  },
  'settings.interface.themeColor': {
    engagement_type: 'general',
    ui_additional_detail: 'Fired when a user changes their interface theme color',
  },
}
