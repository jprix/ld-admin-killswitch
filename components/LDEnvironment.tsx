'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
} from '@mui/material';

export default function LDEnvironment() {
  const [open, setOpen] = useState(false);
  const [env, setEnv] = useState({
    NEXT_PUBLIC_LD_CLIENT_ID: '',
    NEXT_PUBLIC_LD_API_KEY: '',
    NEXT_PUBLIC_LD_PROJECT_KEY: '',
    NEXT_PUBLIC_LD_ENVIRONMENT_KEY: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEnv({
      NEXT_PUBLIC_LD_CLIENT_ID: localStorage.getItem('NEXT_PUBLIC_LD_CLIENT_ID') || '',
      NEXT_PUBLIC_LD_API_KEY: localStorage.getItem('NEXT_PUBLIC_LD_API_KEY') || '',
      NEXT_PUBLIC_LD_PROJECT_KEY: localStorage.getItem('NEXT_PUBLIC_LD_PROJECT_KEY') || '',
      NEXT_PUBLIC_LD_ENVIRONMENT_KEY: localStorage.getItem('NEXT_PUBLIC_LD_ENVIRONMENT_KEY') || '',
    });
  }, []);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnv((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = () => {
    try {
      Object.entries(env).forEach(([key, value]) => {
        if (!value) throw new Error(`Missing value for ${key}`);
        localStorage.setItem(key, value);
      });
      setError(null);
      setOpen(false);
      location.reload(); // refresh app to reinitialize LD
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  

  return (
    <>
      <Box mb={2}>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Configure LD Environment
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Set LaunchDarkly Environment</DialogTitle>
        <DialogContent>
          {Object.entries(env).map(([key, value]) => (
            <TextField
              key={key}
              fullWidth
              margin="dense"
              label={key}
              value={value}
              onChange={handleChange(key)}
            />
          ))}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save & Reload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
