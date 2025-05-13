// lib/launchDarklyServer.ts

import LaunchDarkly from 'launchdarkly-node-server-sdk';
import { getLDEnv } from './ldEnv';

const sdkKey = getLDEnv().serverSdkKey;

const ldClient = LaunchDarkly.init(sdkKey, {
  // Optional config (timeouts, caching, etc.)
});

export async function getLDVariation(
  key: string,
  user: LaunchDarkly.LDUser,
  defaultValue: boolean
) {
  await ldClient.waitForInitialization();
  return ldClient.variation(key, user, defaultValue);
}
