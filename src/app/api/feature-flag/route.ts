import { NextRequest, NextResponse } from 'next/server';
import LaunchDarkly from 'launchdarkly-node-server-sdk';

const ldClient = LaunchDarkly.init(process.env.LD_SERVER_SDK_KEY!);

// Static user for server evaluation
const user = {
  key: 'server-api-checker',
  anonymous: true,
};

// Helper to evaluate feature flag
async function isApiAllowed() {
  await ldClient.waitForInitialization();
  return ldClient.variation('allowAPI', user, false);
}

// GET handler
export async function GET(_req: NextRequest) {
  const allow = await isApiAllowed();

  return allow
    ? NextResponse.json({ message: 'GET allowed', data: { foo: 'bar' } })
    : NextResponse.json({ error: 'Feature not enabled' }, { status: 403 });
}

// POST handler
export async function POST(_req: NextRequest) {
  const allow = await isApiAllowed();

  return allow
    ? NextResponse.json({ message: 'POST allowed', data: { posted: true } })
    : NextResponse.json({ error: 'Feature not enabled' }, { status: 403 });
}
