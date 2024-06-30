'use client'
import { Button } from '@t4/ui'
import React from 'react'

export function AnimatedCircle() {
  const [x, setX] = React.useState(1)
  return <Button animation='bouncy' size='$8' scale={x} onPress={() => setX(x * 1.1)} />
}
