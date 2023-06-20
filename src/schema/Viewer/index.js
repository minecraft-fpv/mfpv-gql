// @flow

import {gql} from 'apollo-server-lambda'
import raceTracks from './resolvers/raceTracks'
import raceTrack from "./resolvers/raceTrack";

export type Viewer = {}

export const typeDefs = gql`
  type Viewer {
    raceTracks(sortField: String, sortDirection: String): [RaceTrack] @connection
    raceTrack(raceTrackId: String): RaceTrack

    id: String @computed(value: "Viewer:anon")
  }
`

export const resolvers = {
  Viewer: {
    raceTracks,
    raceTrack
  }
}