'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import Editor from '@monaco-editor/react';
import { useLDContextBridge } from '../providers/LaunchDarkly';
import { getLDEnv } from '../lib/ldEnv';

export default function LDContextBuilder() {
  const { setContext } = useLDContextBridge();
  const [open, setOpen] = useState(false);
  const [editorValue, setEditorValue] = useState(`{
  "kind": "business",
  "key": "user-1234",
  "email": "admin@example.com",
  "custom": {
    "featureAccess": "admin"
  }
}`);
  const [error, setError] = useState<string | null>(null);
  const [envReady, setEnvReady] = useState(false);

  useEffect(() => {
    const env = getLDEnv();
    const valid = !!env.clientId && !!env.projectKey && !!env.environmentKey;
    setEnvReady(valid);
  }, []);

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(editorValue);
      setContext(parsed);
      setError(null);
      setOpen(false);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        disabled={!envReady}
      >
        Configure LD Context
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit LaunchDarkly Context (JSON)</DialogTitle>
        <DialogContent dividers>
          <Editor
            height="300px"
            defaultLanguage="json"
            value={editorValue}
            onChange={(value) => setEditorValue(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Run
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
