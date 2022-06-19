import React from 'react';
import {
  Link,
  useHistory,
} from 'react-router-dom';
import {
  makeStyles,
  Grid,
  TextField,
  Button,
  Snackbar,
  Typography,
  Paper,
  Avatar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import backgroundImage from '../assets/background1.jpg'
import { alpha } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(() => ({
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  },
}));

const LoginPage = () => {
  const [userEmail, setEmail] = React.useState('');
  const [userPassword, setPassword] = React.useState('');
  const [badLogin, setBadLogin] = React.useState(false);

  const history = useHistory();

  async function fetchLogin () {
    if (userEmail && userPassword) {
      const url = 'http://localhost:5005/user/auth/login';
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      }
      fetch(url, requestOptions).then((res) => {
        if (res.ok) {
          res.json().then(data => {
            localStorage.setItem('email', userEmail);
            localStorage.setItem('user_token', data.token);
            history.push('/');
          });
        } else {
          setBadLogin(true);
        }
      }).catch(() => {
        setBadLogin(true);
      });
    }
  }

  const handleClose = () => {
    setBadLogin(false);
  };

  const classes = useStyles();
  return (
    <main>
      <Grid
        className={classes.pageContainer}
        container
        width="50vw"
        spacing={0}
      >
        <Paper elevation={3} style={{ padding: '5%', borderRadius: '5%', backgroundColor: alpha('#FEFFFF', 0.9) }}>
          <Grid container direction="column" align="center" spacing={3}>
            <Grid item>
              <Avatar><LockOutlinedIcon /></Avatar>
              <Typography variant="h2" color="primary" >Sign In</Typography>
            </Grid>
            <Grid item>
              <TextField fullWidth label="Email" variant="outlined" name="email" id="email" onChange={(event) => setEmail(event.target.value)} />
            </Grid>
            <Grid item>
              <TextField fullWidth label="Password" variant="outlined" type="password" name="password" id="password" onChange={(event) => setPassword(event.target.value)} />
            </Grid>
            <Grid item>
              <Button fullWidth id="submit" onClick={() => { fetchLogin(); }} variant="contained">Sign In</Button>
            </Grid>
            <Grid container>
              <Button
                component={Link}
                color="primary"
                fullWidth
                id="register"
                to="/register"
                variant="text"
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Snackbar open={badLogin} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Bad Login attempt. Please try again.
        </Alert>
      </Snackbar>
    </main>
  );
}

export default LoginPage;
