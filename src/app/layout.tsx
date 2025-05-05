'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import LaunchDarklyProvider from "../../providers/LaunchDarkly"
import theme from '../../theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LaunchDarklyProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </LaunchDarklyProvider>
        
      </body>
    </html>
  );
}
