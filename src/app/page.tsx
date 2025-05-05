'use client';

import { Container, Typography, Button } from '@mui/material';
import LDAdmin from '../../components/LDAdmin';

export default function HomePage() {
  return (
    <>
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Your LaunchDarkly Kill Panel
      </Typography>
      <Typography variant="body1" gutterBottom>
        This single-page app is styled with MUI and ready for feature flagging.
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Container>
    <LDAdmin />
    </>
  );
}
