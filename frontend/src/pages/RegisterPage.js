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
import VpnKeyIcon from '@mui/icons-material/VpnKey';
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

const RegisterPage = () => {
  const [userName, setName] = React.useState('');
  const [userEmail, setEmail] = React.useState('');
  const [userPassword, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [badRegister, setBadRegister] = React.useState(false);
  const [matchingPasswords, setMatchingPasswords] = React.useState(false);

  const history = useHistory();

  async function registerUser () {
    if (userPassword !== confirmPassword) {
      console.log('hello');
      setMatchingPasswords(true);
      return;
    }
    if (userEmail && userPassword && userName) {
      console.log('i got here');

      if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(userEmail)) {
        const url = 'http://localhost:5005/user/auth/register';
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            password: userPassword,
            name: userName,
          }),
        }
        fetch(url, requestOptions).then((res) => {
          if (res.ok) {
            res.json().then(data => {
              console.log(data);
              localStorage.setItem('email', userEmail);
              localStorage.setItem('user_token', data.token);
              history.push('/');
            });
          } else {
            setBadRegister(true);
          }
        }).catch(() => {
          setBadRegister(true);
        });
      } else {
        setBadRegister(true);
      }
    }
  }

  const handleClose = () => {
    setBadRegister(false);
    setMatchingPasswords(false);
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
          <Grid container item direction="column" align="center" spacing={3}>
            <Grid item>
              <Avatar><VpnKeyIcon /></Avatar>
              <Typography variant="h2" color="primary" id="title">Register</Typography>
            </Grid>
            <Grid item>
              <TextField fullWidth label="User name" variant="outlined" name="user_name" id="user_name" onChange={(event) => setName(event.target.value)} />
            </Grid>
            <Grid item>
              <TextField fullWidth label="Email" variant="outlined" name="email" id="email" onChange={(event) => setEmail(event.target.value)} />
            </Grid>
            <Grid item>
              <TextField fullWidth label="Password" variant="outlined" type="password" name="password" id="password" onChange={(event) => setPassword(event.target.value)} />
            </Grid>
            <Grid item>
              <TextField fullWidth label="Confirm Password" variant="outlined" type="password" name="password" id="confirm_password" onChange={(event) => setConfirmPassword(event.target.value)} />
            </Grid>
            <Grid item>
              <Button fullWidth id="submit" onClick={() => { registerUser(); }} variant="contained">Submit</Button>
            </Grid>
            <Grid container>
              <Button
                component={Link}
                color="primary"
                fullWidth
                id="login"
                to="/login"
                variant="text"
              >
                Back to Login
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Snackbar open={badRegister} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Invalid Registration details, email is already registered, or email is invalid.
        </Alert>
      </Snackbar>
      <Snackbar open={matchingPasswords} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Please make sure passwords match.
        </Alert>
      </Snackbar>
    </main>
  );
}

export default RegisterPage;
