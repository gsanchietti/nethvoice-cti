// Copyright (C) 2022 Nethesis S.r.l.
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/phonebook')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default Home
