import { isWeb, ScrollView, ScrollViewProps, TamaguiElement } from '@t4/ui'
import React from 'react'

enum DeltaMode {
  DOM_DELTA_PIXEL = 0x00,
  DOM_DELTA_LINE = 0x01,
  DOM_DELTA_PAGE = 0x02,
}

export function HorizontalScroller(props: ScrollViewProps) {
  const el = React.useRef<ScrollView | null>(null)
  return (
    <ScrollView
      horizontal
      {...props}
      ref={el}
      {...(isWeb
        ? {
            onWheel: function (e: WheelEvent) {
              if (el.current && !e.deltaX && Math.abs(e.deltaY) > 0) {
                const target = el.current.getScrollableNode() as HTMLElement
                let pageMultiplier: number
                switch (e.deltaMode as DeltaMode) {
                  case DeltaMode.DOM_DELTA_LINE:
                    pageMultiplier = target.scrollWidth / target.children.length
                    break
                  case DeltaMode.DOM_DELTA_PAGE:
                    pageMultiplier = target.scrollWidth
                    break
                  case DeltaMode.DOM_DELTA_PIXEL:
                    pageMultiplier = 1
                    break
                  default:
                    pageMultiplier = 0 // Unsupported
                }
                target.scrollLeft += e.deltaY * pageMultiplier
              }
            },
          }
        : {})}
    />
  )
}
