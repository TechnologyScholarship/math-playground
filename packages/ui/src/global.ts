import { config } from './tamagui.config'

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
  interface TypeOverride {
    groupNames(): 'embeddedmath' | 'action' | 'hover' | 'dragging'
  }
}

export default config
