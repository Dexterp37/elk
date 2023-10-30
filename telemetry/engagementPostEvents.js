export const postEvents = {
  // Standalone post
  'post.reply': {
    engagement_type: 'reply',
  },
  'post.reblog': {
    engagement_type: 'boost',
  },
  'post.favorite': {
    engagement_type: 'favorite',
  },
  'post.bookmark': {
    engagement_type: 'bookmark',
  },
  // Home feed
  'home.feed.post.reply': {
    engagement_type: 'reply',
  },
  'home.feed.post.reblog': {
    engagement_type: 'boost',
  },
  'home.feed.post.favorite': {
    engagement_type: 'favorite',
  },
  'home.feed.post.bookmark': {
    engagement_type: 'bookmark',
  },
}
