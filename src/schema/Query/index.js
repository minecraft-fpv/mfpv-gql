// @flow

import {gql} from 'apollo-server-lambda'
import viewer from './resolvers/viewer'

export const typeDefs = gql`
  type Query {
    viewer(gameNameCache: String): Viewer
  }
`

export const resolvers = {
  Query: {
    viewer
  }
}