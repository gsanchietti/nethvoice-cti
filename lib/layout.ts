// Copyright (C) 2022 Nethesis S.r.l.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { SpeedDialType } from '../services/types'

/**
 * This method sorts the speed dials
 *
 * @param speedDials - The list of speed dials
 * @returns The sorted list of speed dials
 *
 */

export const sortSpeedDials = (
  speedDials: SpeedDialType[] = [],
  field: keyof SpeedDialType = 'name',
) => {
  if (speedDials.length > 0) {
    return speedDials.sort((a, b) => {
      // @ts-ignore
      var textA = isNaN(a[field]) ? a[field].toLowerCase() : a[field]
      // @ts-ignore
      var textB = isNaN(b[field]) ? b[field].toLowerCase() : b[field]
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })
  } else {
    return speedDials
  }
}
