// @flow

import type {RaceTrack} from "../index";
import type { ContextDefault } from '../../common-types'
import query from "../../../mysql/query";
import type {RaceTrackUser} from "../../RaceTrackUser";
import sqltag from 'sql-template-tag'

type Args = {|
  userId: string
|}

export default async function raceTrackUser(raceTrack: RaceTrack, args: Args, ctx: ContextDefault): Promise<?RaceTrackUser> {
  const sql = sqltag`
    SELECT temp.*,
    lap.dateCreated AS dateBestTime
    FROM (
      SELECT
      raceTrackId, 
      userId,
      COUNT(*) AS nLaps,
      MIN(millis) AS bestTime
      FROM RaceLap
      WHERE raceTrackId = UNHEX(${raceTrack.raceTrackId})
      AND userId = UNHEX(${args.userId})
      GROUP BY userId
    ) temp
    JOIN RaceLap lap
    ON temp.raceTrackId = lap.raceTrackId AND temp.userId = lap.userId AND temp.bestTime = lap.millis;
  `

  const rows = await query(sql)
  return rows[0]
}