// @flow

import DataLoader from 'dataloader'
import fetch from 'node-fetch'

export default class UserLoader {
  getGameName: DataLoader<string, string>

  constructor(gameNameCache: ?{[userId: string]: string}) {
    this.getGameName = new DataLoader<string, string>(async userIds => {
      return Promise.all(userIds.map(userId => (gameNameCache?.[userId] || gameNameFromUserId(userId))))
    })
  }
}

function gameNameFromUserId(userId: string): Promise<string> {
  const url = "https://api.mojang.com/user/profiles/" + userId + "/names"
  console.log('url', url)
  return fetch(url).then(res => res.json()).then(body => {
    if (!body || !Array.isArray(body)) return 'Missing No.'
    return body[body.length - 1]?.name ?? 'Missing No.'
  }).catch(err => {
    console.error(err)
  })
}