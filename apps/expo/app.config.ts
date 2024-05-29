import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || '1a4e7d5d-1838-4473-bdb0-40c75508641b',
    },
  },
  owner: process.env.EXPO_PUBLIC_EAS_OWNER || 'wntivc',
  plugins: ['expo-router'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  platforms: ['ios', 'android'],
  name: 'Math Playground',
  slug: 'math-playground',
  updates: {
    url: 'https://u.expo.dev/1a4e7d5d-1838-4473-bdb0-40c75508641b',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
})
