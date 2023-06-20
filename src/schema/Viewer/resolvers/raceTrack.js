// @flow

import type { ContextDefault } from '../../common-types'
import type {Viewer} from '../index'
import type { RaceTrack } from '../../RaceTrack'
import sqltag from 'sql-template-tag'
import query, { flattenSqlTag } from '../../../mysql/query'

type Args = {|
  raceTrackId: string
|}

export default async (viewer: Viewer, args: Args, ctx: ContextDefault): Promise<?RaceTrack> => {
  const sql = sqltag`
    SELECT track.*, 
    COUNT(*) AS nLaps
    FROM RaceTrack track
    LEFT JOIN RaceLap lap
    USING (raceTrackId)
    WHERE !track.deleted AND track.raceTrackId = UNHEX(${args.raceTrackId})
    GROUP BY raceTrackId
    ORDER BY nLaps DESC;
  `
  const rows = await query(sql)
  return rows?.[0]
}
