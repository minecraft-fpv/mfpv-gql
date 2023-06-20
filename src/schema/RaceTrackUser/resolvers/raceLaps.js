// @flow

import type { RaceLapSQL } from '../../RaceLap'
import type { RaceTrackUser } from '../index'
import sqltag from 'sql-template-tag'
import query from '../../../mysql/query'

export default async function raceLaps(raceTrackUser: RaceTrackUser): Promise<Array<RaceLapSQL>> {
  const sql = sqltag`
    SELECT * FROM RaceLap 
    WHERE raceTrackId = UNHEX(${raceTrackUser.raceTrackId})
    AND userId = UNHEX(${raceTrackUser.userId})
    ORDER BY millis;
  `
  const rows = await query(sql)
  return rows
}