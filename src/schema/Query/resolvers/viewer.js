// @flow

import type {ContextDefault} from '../../common-types'
import UserLoader from '../../../loaders/UserLoader'

type Args = {
  gameNameCache?: ?string
}

export default async function(_: any, args: Args, ctx: ContextDefault): Promise<any> {
  let parsedGameNameCache
  try {
    parsedGameNameCache = JSON.parse(args.gameNameCache || '{}')
  } catch (err) {
    console.error(err)
  }
  
  ctx.loaders = {
    user: new UserLoader(parsedGameNameCache)
  }

  return {
  }
}