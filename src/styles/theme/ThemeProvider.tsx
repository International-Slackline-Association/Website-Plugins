import * as React from 'react';
import { ThemeProvider as OriginalThemeProvider } from 'styled-components';
import { theme } from './theme';

export const ThemeProvider = (props: { children: React.ReactChild }) => {
  return (
    <OriginalThemeProvider theme={theme}>
      {React.Children.only(props.children)}
    </OriginalThemeProvider>
  );
};
