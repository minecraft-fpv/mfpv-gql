// @flow

import type { ConnectionArgs, ContextDefault } from '../../common-types'
import type {Viewer} from '../index'
import type { RaceTrack } from '../../RaceTrack'
import type { Connection } from 'graphql-relay/lib/connection/connectiontypes'
import { connectionFromArray } from 'graphql-relay'
import query  from '../../../mysql/query'
import mysql from 'mysql'

type Args = {|
  sortField?: ?$Keys<RaceTrack>,
  sortDirection?: 'DESC' | 'ASC',
  ...ConnectionArgs
|}

export default async (viewer: Viewer, args: Args, ctx: ContextDefault): Promise<Connection<RaceTrack>> => {
  const sortField = args.sortField || 'nLaps'
  const sortDirection = args.sortDirection === 'ASC' ? 'ASC' : 'DESC'

  const sql = mysql.format(
    `
      SELECT track.*, 
      COUNT(*) AS nLaps
      FROM RaceTrack track
      LEFT JOIN RaceLap lap
      USING (raceTrackId)
      WHERE !track.deleted
      GROUP BY raceTrackId
      ORDER BY ?? ${sortDirection};
    `,
    [sortField]
  )

  const rows = await query(sql)
  const connection = connectionFromArray<RaceTrack>(rows, args)
  // $FlowFixMe
  connection.totalCount = rows.length
  return connection
}
