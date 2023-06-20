// @flow

import {gql} from 'apollo-server-lambda'
import gameName from "./resolvers/gameName";

export type User = {
  userId: string,

  id?: string,
  gameName?: String
}

export const typeDefs = gql`
  type User {
    userId: String

    id: String @computed(value: "User:$userId")
    gameName: String
  }
`

export const resolvers = {
  User: {
    gameName
  }
}