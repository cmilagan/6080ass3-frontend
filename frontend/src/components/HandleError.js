import React from 'react';

import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { StoreContext } from '../utils/store';

const HandleError = () => {
  const context = React.useContext(StoreContext);
  const { errorPopUp: [errorPopUp, setErrorPopUp] } = context;

  const handleClose = () => {
    setErrorPopUp(false, ' ');
  };

  return (
    <Snackbar open={errorPopUp.error} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {errorPopUp.message}
      </Alert>
    </Snackbar>
  );
};

export default HandleError;
