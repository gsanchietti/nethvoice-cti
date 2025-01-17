// Copyright (C) 2022 Nethesis S.r.l.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Models } from '@rematch/core'
import { authentication } from './authentication'
import { user } from './user'
import { sideDrawer } from './sideDrawer'
import { phonebook } from './phonebook'
import { speedDial } from './speedDial'
import { darkTheme } from './darkTheme'

export interface RootModel extends Models<RootModel> {
  authentication: typeof authentication
  user: typeof user
  sideDrawer: typeof sideDrawer
  phonebook: typeof phonebook
  speedDial: typeof speedDial
  darkTheme: typeof darkTheme
}

export const models: RootModel = {
  authentication,
  user,
  sideDrawer,
  phonebook,
  speedDial,
  darkTheme,
}
