// @flow

import type {RaceTrack} from "../index";
import type { ConnectionArgs, ContextDefault } from '../../common-types'
import query from "../../../mysql/query";
import type {RaceTrackUser} from "../../RaceTrackUser";
import mysql from 'mysql'
import { connectionFromArray } from 'graphql-relay'
import type { Connection } from 'graphql-relay/lib/connection/connectiontypes'

type Args = {|
  sortField?: ?$Keys<RaceTrackUser>,
  sortDirection?: 'DESC' | 'ASC',
  ...ConnectionArgs
|}

export default async function raceTrackUsers(raceTrack: RaceTrack, args: Args, ctx: ContextDefault): Promise<Connection<RaceTrackUser>> {
  const sortField = args.sortField || 'minTime'
  const sortDirection = args.sortDirection === 'DESC' ? 'DESC' : 'ASC'

  const sql = mysql.format(
    `
      SELECT temp.*,
      lap.dateCreated AS dateBestTime
      FROM (
        SELECT
        raceTrackId, 
        userId,
        COUNT(*) AS nLaps,
        MIN(millis) AS bestTime
        FROM RaceLap
        WHERE raceTrackId = UNHEX(?)
        GROUP BY userId
      ) temp
      JOIN RaceLap lap
      ON temp.raceTrackId = lap.raceTrackId AND temp.userId = lap.userId AND temp.bestTime = lap.millis
      ORDER BY ?? ${sortDirection};
    `,
    [raceTrack.raceTrackId, sortField]
  )

  const rows = await query(sql)
  const connection = connectionFromArray<RaceTrackUser>(rows, args)
  // $FlowFixMe
  connection.totalCount = rows.length
  return connection
}