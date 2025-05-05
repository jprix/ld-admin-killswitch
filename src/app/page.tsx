'use client';

import { Container, Typography, Box } from '@mui/material';

import { useLDContextBridge } from '../../providers/LaunchDarkly';
import LDContextBuilder from '../../components/LDContextBuilder';
import LDAdmin from '../../components/LDAdmin';

export default function HomePage() {
  const { context } = useLDContextBridge();
  const isUserSet = context?.key !== 'fallback-guest';

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Your LaunchDarkly Kill Panel
      </Typography>
      <Typography variant="body1" gutterBottom>
        Set your LD context and access the admin console.
      </Typography>

      <LDContextBuilder />

      <Box mt={4}>
        {isUserSet && <LDAdmin />}
      </Box>
    </Container>
  );
}
