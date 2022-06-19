import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Divider from '@mui/material/Divider';
import { useHistory } from 'react-router';
import isLogin from '../utils/user';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    maxHeight: '6vh',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '10vh',
    },
    ...theme.mixins.toolbar,
  },
  textStyle: {
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
      opacity: '0.8',
    }
  }
}));

// modified template Code from Material Ui Documentation https://mui.com/components/app-bar/
export default function PrimarySearchAppBar () {
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // redirect user to login page
  const handleLoginClick = () => {
    handleMenuClose();
    history.push('/login');
  };

  // redirect user to register page
  const handleRegisterClick = () => {
    handleMenuClose();
    history.push('/register');
  }

  // log the user out
  const handleLogOutClick = () => {
    handleMenuClose();
    console.log('got here');
    console.log(localStorage.getItem('user_token'));
    localStorage.removeItem('user_token');
    localStorage.removeItem('email');

    history.push('/');
  }

  // redirect to create listing page
  const handleNewHost = () => {
    handleMenuClose();
    history.push('/host');
  }

  // redirect to hosted listings page
  const handleHostedList = () => {
    handleMenuClose();
    history.push('/myListings')
  }

  // redirect to allListings page
  const handleAllLists = () => {
    handleMenuClose();
    history.push('/allListings')
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isLogin()
        ? (
        <div>
          <MenuItem onClick={handleLogOutClick} fontWeight="bold" >
            <ExitToAppIcon />
            <Typography fontWeight="bold" >
              Log Out
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNewHost}>Host Your Home</MenuItem>
          <MenuItem onClick={handleHostedList}>Hosted Listings</MenuItem>
        </div>
          )
        : (
        <div>
          <MenuItem onClick={handleRegisterClick} fontWeight="bold" >
            <Typography fontWeight="bold" >
              Sign Up
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLoginClick}>Login</MenuItem>
          <Divider />
          <MenuItem onClick={handleRegisterClick}>Host Your Home</MenuItem>

        </div>
          )}

    </Menu>
  );

  const classes = useStyles();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={classes.navBar}>
        <Toolbar>
          <MeetingRoomIcon style={{ color: '#FEFFFF' }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            fontWeight="bold"
            color="#17252A"
            className={classes.textStyle}
            onClick={() => { history.push('/') }}
          >
            AirBrB
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <Button variant="text" onClick={handleAllLists}>
                <Typography
                variant="h7"
                noWrap
                component="div"
                fontWeight="bold"
                color="#17252A"
                className={classes.textStyle}
              >
                All Listings
              </Typography>
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
