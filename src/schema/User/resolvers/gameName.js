// @flow

import type {User} from "../index";
import type { ContextDefault } from '../../common-types'

export default function gameName(user: User, args: any, ctx: ContextDefault): Promise<string> {
  return ctx.loaders.user.getGameName.load(user.userId)
}