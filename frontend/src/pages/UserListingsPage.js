import {
  Grid,
  Typography,
  Button,
  Fab,
  Modal,
  Box,
  TextField,
  Stack,
  Card,
} from '@mui/material';
import {
  React,
  useState,
  useEffect,
} from 'react';
import { useHistory } from 'react-router';
import CardActions from '@mui/material/CardActions';
import NavBar from '../components/NavBar';
import { makeStyles } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import PropertyCard from '../components/PropertyCard';

const useStyles = makeStyles(() => ({
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  listingSection: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35vw',
    backgroundColor: 'white',
    boxShadow: 24,
    padding: '20px',
  }
}));

const UserListingPage = () => {
  const [listings, setListings] = useState([]);
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [listingId, setListingId] = useState(0);
  const history = useHistory();

  // modal hooks
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [confirmUnpublishOpen, setConfirmUnpublishOpen] = useState(false);
  const handleUnpublishOpen = () => setConfirmUnpublishOpen(true);
  const handleUnpublishClose = () => setConfirmUnpublishOpen(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const handleRemoveOpen = () => setConfirmRemoveOpen(true);
  const handleRemoveClose = () => setConfirmRemoveOpen(false);

  // Get all the listings
  async function getListings () {
    const url = 'http://localhost:5005/listings';
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch(url, requestOptions).then((res) => {
      if (res.ok) {
        return res.json();
      }
    }).then(data => {
      data.listings.filter(listing => {
        return listing.owner === localStorage.getItem('email');
      }).map(item => (
        // get the meta data
        fetch(`http://localhost:5005/listings/${item.id}`, requestOptions).then((res) => {
          if (res.ok) {
            res.json().then(data => {
              console.log(data);
              setListings(listings => [...listings, data.listing]);
            });
          }
        })
      ));
    });
  }

  useEffect(() => {
    getListings();
  }, [])
  // publishes the listing for the specified dates
  async function publishListing (listingId) {
    console.log(localStorage.getItem('user_token'));
    const url = `http://localhost:5005/listings/publish/${listingId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('user_token'),
      },
      body: JSON.stringify({
        availability: [
          {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          }
        ]
      }),
    }
    fetch(url, requestOptions).then(res => {
      if (res.ok) {
        handleClose();
        window.location.reload();
      }
    })
  }

  // unpublishes the listing
  async function hideListing (listingId) {
    console.log(localStorage.getItem('user_token'));
    const url = `http://localhost:5005/listings/unpublish/${listingId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('user_token'),
      },
    }
    fetch(url, requestOptions).then(res => {
      if (res.ok) {
        handleUnpublishClose();
        window.location.reload();
      }
    })
  }

  async function removeListing (listingId) {
    const url = `http://localhost:5005/listings/${listingId}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('user_token'),
      },
    }
    fetch(url, requestOptions).then(res => {
      if (res.ok) {
        handleRemoveClose();
        window.location.reload();
      }
    })
  }

  const handleAddListingClick = () => {
    history.push('/host');
  }
  const classes = useStyles();
  return (
    <main>
      <NavBar />
      <Grid
        className={classes.pageContainer}
        container
        justify="center"
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="secondary"
          >
            My Listings
          </Typography>
        </Grid>
        <Grid
          container
          justify="center"
          spacing={4}
          className={classes.listingSection}
          >
          {/* Filter listings created by authorised user */}
          {listings.filter(item => {
            return item.owner === localStorage.getItem('email');
          }).map(item => (
            // responsive
            // xs = extra small screens
            // sm = small screens
            // md = medium screens
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card>
                <PropertyCard listing={item} />
                <CardActions>
                  <Button size="small" onClick={() => { history.push(`/editListing/${item.metadata.listing_id}`) }}>Edit Listing</Button>
                  {item.published === true
                    ? (
                      <Button size="small" variant="contained" onClick={() => { handleUnpublishOpen(); setListingId(item.metadata.listing_id); }}>Hide Listing</Button>
                      )
                    : (
                      <Button size="small" variant="outlined" onClick={() => { handleOpen(); setListingId(item.metadata.listing_id); }}>Show Listing</Button>
                      )
                  }
                </CardActions>
                <CardActions>
                  <Button size="small" color="error" onClick={() => { handleRemoveOpen(); setListingId(item.metadata.listing_id); }}>Remove Listing</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          justifyContent="center"
        >
          <Fab
            color="primary"
            size="medium"
            aria-label="add"
            sx={{ position: 'fixed', bottom: '5%', color: '#FEFFFF' }}
            onClick={handleAddListingClick}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalStyle}>
          <Stack spacing={2} alignItems="center" width="100%">
            <Typography variant="h6">
              Set Listing Period
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Start Date"
                inputFormat="dd/MM/yyyy"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <MobileDatePicker
                label="End Date"
                inputFormat="dd/MM/yyyy"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Button size="medium" variant="contained" onClick={() => { publishListing(listingId); }}>Go Live!</Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={confirmUnpublishOpen}
        onClose={handleUnpublishClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalStyle}>
          <Stack spacing={2} alignItems="center" width="100%">
            <Typography>Confirm listing unpublish</Typography>
            <Button size="medium" variant="contained" onClick={() => { hideListing(listingId); }}>Hide Listing</Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={confirmRemoveOpen}
        onClose={handleRemoveClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalStyle}>
          <Stack spacing={2} alignItems="center" width="100%">
            <Typography>Confirm Deletion of Listing</Typography>
            <Button size="medium" variant="contained" onClick={() => { removeListing(listingId); }}>Delete Listing</Button>
          </Stack>
        </Box>
      </Modal>
    </main>
  )
}

export default UserListingPage
