import React from 'react'

export type ScrollOverProps = React.PropsWithChildren<{
  onMouseWheel: React.HTMLProps<HTMLSpanElement>['onWheel']
}>

export function ScrollOver(props) {
  return <>{props.children}</>
}
