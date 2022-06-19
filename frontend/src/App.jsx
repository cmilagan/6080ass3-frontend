import React from 'react';
import {
  BrowserRouter,
  Switch,
} from 'react-router-dom';
import {
  lightGreen,
  red,
  amber,
} from '@material-ui/core/colors'
import { createTheme, ThemeProvider } from '@mui/material';
import StoreProvider from './utils/store.js'
import routes from './routes.js';
import './App.css';

// #FEFFFF White Shade -- Contrast to #17252A (Body / Text)
// #17252A Deep dark blue -- Contrast to #FEFFFF (Text / Buttons)
// #3AAFA9 Cyan (Navigation)
// #DEF2F1 Light cyan (Subtle details)
// #2B7A78 Darker Cyan -- Monochromatic (Subtle details)

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3AAFA9',
    },
    secondary: {
      main: '#17252A',
    },
    error: red,
    success: lightGreen,
    info: {
      main: '#DEF2F1',
    },
    warning: amber,
  },
});

function App () {
  return (
    <>
      <ThemeProvider theme={theme}>
        <StoreProvider >
          <BrowserRouter key="routes">
            <Switch>
              {routes}
            </Switch>
          </BrowserRouter>
        </StoreProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
