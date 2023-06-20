// @flow

import {gql} from 'apollo-server-lambda'

export type RaceLapSQL = {|
  raceLapId: string,
  raceTrackId: string,
  userId: string,
  millis: number,
  version: string,
  data: string,
  dateCreated: string
|}

export const typeDefs = gql`
  type RaceLap {
    raceLapId: String
    raceTrackId: String
    userId: String
    millis: Int
    version: String
    data: JSON
    dateCreated: String

    id: String @computed(value: "RaceLap:$raceLapId")
  }
`

export const resolvers = {
  RaceLap: {

  }
}