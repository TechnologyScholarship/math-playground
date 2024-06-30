import { createAnimations } from '@tamagui/animations-react-native'
// import { Easing } from 'react-native'

export const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  // easeIn: {
  //   type: 'timing',
  //   easing: Easing.in(Easing.ease),
  //   duration: 3,
  // },
})
