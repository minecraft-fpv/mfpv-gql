// @flow

import type {User} from "../../User";
import type { RaceTrack } from '../index'

export default function owner(raceTrack: RaceTrack): User {
  return {
    userId: raceTrack.ownerUserId
  }
}