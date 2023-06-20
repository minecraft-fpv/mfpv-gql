// @flow

import {gql} from 'apollo-server-lambda'
import raceLaps from './resolvers/raceLaps'
import user from "./resolvers/user";
import type { User } from '../User'
import type { RaceLapSQL } from '../RaceLap'

export type RaceTrackUser = {|
  raceTrackId: string,
  userId: string,

  id?: string,
  nLaps?: number,
  bestTime?: number,
  dateBestTime?: string,

  user?: User,
  raceLaps?: Array<RaceLapSQL>
|}

export const typeDefs = gql`
  type RaceTrackUser {
    raceTrackId: String!
    userId: String!

    # Computed:
    id: String @computed(value: "RaceTrackUser:$raceTrackId:$userId")
    nLaps: Int
    bestTime: Int
    dateBestTime: String
    
    # N+1:
    user: User
    raceLaps: [RaceLap]
  }
`

export const resolvers = {
  RaceTrackUser: {
    raceLaps,
    user
  }
}