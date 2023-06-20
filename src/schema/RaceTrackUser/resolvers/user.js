// @flow

import type {User} from "../../User";
import type {RaceTrackUser} from "../index";

export default function user(raceTrackUser: RaceTrackUser): User {
  return {
    userId: raceTrackUser.userId
  }
}