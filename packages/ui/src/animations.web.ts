import { createAnimations } from '@tamagui/animations-css'
import type { AnimationDriver } from '@tamagui/web'
export const animations: AnimationDriver = createAnimations({
  bouncy: 'cubic-bezier(.45,1.93,.57,.9) 300ms',
  lazy: 'cubic-bezier(.45,1.93,.57,.9) 450ms',
  quick: 'cubic-bezier(.45,1.93,.57,.9) 150ms',
  easeIn: 'ease-in 300ms',
})
