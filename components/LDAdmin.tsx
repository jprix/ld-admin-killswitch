'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Container,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import type { LDEvaluationDetail } from 'launchdarkly-js-sdk-common';
import { getLDEnv } from '../lib/ldEnv';

type FlagDetail = {
  value: any;
  variation?: number;
  reason?: string;
};

const LDAdmin = () => {
  const ldClient = useLDClient();
  const [flags, setFlags] = useState<Record<string, FlagDetail>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ldClient) return;

    const fetchAndSetFlags = async () => {
      const rawFlags = ldClient.allFlags();
      const enriched: Record<string, FlagDetail> = {};

      for (const key of Object.keys(rawFlags)) {
        const detail: LDEvaluationDetail = ldClient.variationDetail(key, rawFlags[key]);
        enriched[key] = {
          value: detail.value,
          variation: detail.variationIndex,
          reason: detail.reason?.kind ?? '—',
        };
      }

      setFlags(enriched);
      setIsLoading(false);
    };

    fetchAndSetFlags();

    ldClient.on('change', () => {
      console.log('🔄 Flag change detected');
      fetchAndSetFlags();
    });

    return () => {
      ldClient.off('change', fetchAndSetFlags);
    };
  }, [ldClient]);

  const toggleFlag = async (flagKey: string, currentState: boolean) => {
    const newState = !currentState;
    const { apiKey, projectKey, environmentKey } = getLDEnv();

    try {
      const response = await fetch(
        `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${flagKey}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: apiKey || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              op: 'replace',
              path: `/environments/${environmentKey}/on`,
              value: newState,
            },
          ]),
        }
      );

      if (!response.ok) throw new Error('Failed to update flag');

      setFlags((prev) => ({
        ...prev,
        [flagKey]: {
          ...prev[flagKey],
          value: newState,
        },
      }));
    } catch (error) {
      console.error('Error updating flag:', error);
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Head>
          <title>LaunchDarkly Admin</title>
        </Head>

        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          LaunchDarkly Feature Flags
        </Typography>

        {Object.keys(flags).length === 0 ? (
          <Typography>No flags found.</Typography>
        ) : (
          Object.entries(flags).map(([flagKey, flag]) => (
            <Card key={flagKey} sx={{ mb: 2, p: 2 }}>
              <CardContent>
  <Typography variant="h6" gutterBottom>
    {flagKey}
  </Typography>

  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Switch
      checked={flag.value === true}
      onChange={() => toggleFlag(flagKey, flag.value === true)}
      color="primary"
    />
    <Typography variant="body1" sx={{ fontWeight: 500 }}>
      Status: {flag.value === true ? 'Enabled' : 'Disabled'}
    </Typography>
  </Box>

  <Box
    sx={{
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: 1,
      p: 2,
      mt: 1,
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
      Value:
    </Typography>
    {typeof flag.value === 'object' ? (
      <pre style={{ margin: 0 }}>{JSON.stringify(flag.value, null, 2)}</pre>
    ) : (
      <Typography variant="body2">{String(flag.value)}</Typography>
    )}
  </Box>

  <Box sx={{ mt: 2 }}>
    <Typography variant="body2">
      <strong>Variation:</strong> {flag.variation ?? '—'}
    </Typography>
    <Typography variant="body2">
      <strong>Reason:</strong> {flag.reason ?? '—'}
    </Typography>
  </Box>
</CardContent>

            </Card>
          ))
        )}
      </Container>
    </ThemeProvider>
  );
};

export default LDAdmin;
