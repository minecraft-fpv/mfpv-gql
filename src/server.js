// @flow

import { makeExecutableSchema, transformSchema } from 'graphql-tools'
import { applyConnectionTransform } from 'graphql-directive-connection'
import { PrivateDirective, privateTransform } from 'graphql-directive-private'
import ComputedDirective from 'graphql-directive-computed-property'
import { ApolloServer, gql } from 'apollo-server-lambda'
import GraphQLJSON from 'graphql-type-json'

import * as Query from './schema/Query'
import * as Viewer from './schema/Viewer'
import * as RaceTrack from './schema/RaceTrack'
import * as RaceTrackUser from './schema/RaceTrackUser'
import * as User from './schema/User'
import * as RaceLap from './schema/RaceLap'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar JSON
  
  directive @connection on FIELD_DEFINITION
  directive @private on OBJECT | FIELD_DEFINITION
  directive @computed(value: String) on FIELD_DEFINITION
  ${User.typeDefs}
  ${RaceTrackUser.typeDefs}
  ${RaceLap.typeDefs}
  ${RaceTrack.typeDefs}
  ${Viewer.typeDefs}
  ${Query.typeDefs}
`;

// Provide resolver functions for your schema fields
const resolvers = {
  ...Query.resolvers,
  ...Viewer.resolvers,
  ...RaceTrack.resolvers,
  ...RaceLap.resolvers,
  ...RaceTrackUser.resolvers,
  ...User.resolvers,
  JSON: GraphQLJSON,
};

const connectedTypeDefs = applyConnectionTransform({
  typeDefs,
})

const publicSchema = makeExecutableSchema({
  typeDefs: connectedTypeDefs,
  resolvers,
  resolverValidationOptions: {
    // requireResolversForArgs: true,
    // requireResolversForNonScalar: true,
  },
  schemaDirectives: {
    computed: ComputedDirective,
    private: PrivateDirective,
  },
})

const privateSchema = transformSchema(publicSchema, [privateTransform(publicSchema)])

const server = new ApolloServer({ schema: privateSchema, introspection: true, playground: true });

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});