'use client';

import { Container, Typography, Box } from '@mui/material';

import { useLDContextBridge } from '../../providers/LaunchDarkly';
import LDContextBuilder from '../../components/LDContextBuilder';
import LDAdmin from '../../components/LDAdmin';
import LDEnvironment from '../../components/LDEnvironment';


export default function HomePage() {
  const { context } = useLDContextBridge();
  const isUserSet = context?.key !== 'fallback-guest';

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
        LaunchDarkly Kill Panel
      </Typography>
      <Typography variant="body1" gutterBottom>
        Set your LD Environment and Context to access the admin console.
      </Typography>

      <LDEnvironment /> 

      <LDContextBuilder /> 

      <Box mt={4}>
        {isUserSet && <LDAdmin />}
      </Box>
    </Container>
  );
}
