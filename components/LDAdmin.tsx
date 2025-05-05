'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import theme from '../theme';
import { getLDEnv } from '../lib/ldEnv';

import { ThemeProvider } from '@mui/material/styles';
import { useLDClient } from 'launchdarkly-react-client-sdk';

const LDAdmin = () => {
  const router = useRouter();
  const ldClient = useLDClient();
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ldClient) return;

    const fetchAndSetFlags = async () => {
      const allFlags = await ldClient.allFlags();
      console.log('🔁 Updated flags:', allFlags);
      setFlags(allFlags);
      setIsLoading(false);
    };

    // Initial fetch
    fetchAndSetFlags();

    // Subscribe to any flag changes (after context reidentification)
    ldClient.on('change', () => {
      console.log('🔄 Flag change detected');
      fetchAndSetFlags();
    });

    // Cleanup on unmount
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
        [flagKey]: newState,
      }));
    } catch (error) {
      console.error('Error updating flag:', error);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

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
          Object.entries(flags).map(([flagKey, isFlagOn]) => (
            <Card key={flagKey} sx={{ mb: 2, p: 2 }}>
              <CardContent>
                <Typography variant="h6">{flagKey}</Typography>
                <Box sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isFlagOn}
                        onChange={() => toggleFlag(flagKey, isFlagOn)}
                      />
                    }
                    label={`Status: ${isFlagOn ? 'Enabled' : 'Disabled'}`}
                  />
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
