// @flow

import type { RaceTrackUser } from '../RaceTrackUser'
import {gql} from 'apollo-server-lambda'
import owner from './resolvers/owner'
import raceTrackUser from './resolvers/raceTrackUser'
import raceTrackUsers from "./resolvers/raceTrackUsers";
import type { User } from '../User'

export type RaceTrack = {|
  raceTrackId: string,
  ownerUserId: string,
  name: string,
  dimension: string,
  startPosX: number,
  startPosZ: number,
  startPosY: number,
  deleted: boolean,
  dateUpdated: string,
  dateCreated: string,

  id: string,
  nLaps: number,
  owner: User,
  raceTrackUsers: Array<RaceTrackUser>
|}

export const typeDefs = gql`
  type RaceTrack {
    raceTrackId: String!
    ownerUserId: String!
    name: String!
    dimension: String!
    startPosX: Int!
    startPosZ: Int!
    startPosY: Int!
    deleted: Boolean!
    dateUpdated: String!
    dateCreated: String!

    id: String @computed(value: "RaceTrack:$raceTrackId")
    nLaps: Int
    owner: User
    raceTrackUsers(sortField: String, sortDirection: String): [RaceTrackUser] @connection
    raceTrackUser(userId: String): RaceTrackUser
  }
`

export const resolvers = {
  RaceTrack: {
    owner,
    raceTrackUser,
    raceTrackUsers
  }
}