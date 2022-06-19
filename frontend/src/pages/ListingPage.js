import React from 'react'
import NavBar from '../components/NavBar'
import { makeStyles } from '@material-ui/core'
import PropertyCard from '../components/PropertyCard';
import {
  Grid,
  Card,
  CardActions,
  Button,
  Modal,
  Box,
  Stack,
  Typography,
  TextField,
  Rating
} from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { calculateRating } from '../utils/helpers';
import { useHistory } from 'react-router';

const useStyles = makeStyles(() => ({
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  searchFilterSection: {
    alignItems: 'center',
    minHeight: '15vh',
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

const ListingPage = () => {
  const [listings, setListings] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date(Date.now()));
  const [endDate, setEndDate] = React.useState(new Date(Date.now()));
  const [rating, setRating] = React.useState(0);
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(0);
  const [numBeds, setNumBeds] = React.useState(0);
  const [filterString, setFilterString] = React.useState('')

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const history = useHistory();

  async function getDetails () {
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
      data.listings.map(item => (
        // get the meta data
        fetch(`http://localhost:5005/listings/${item.id}`, requestOptions).then((res) => {
          if (res.ok) {
            res.json().then(data => {
              if (data.listing.published === true) {
                setListings(listings => [...listings, data.listing]);
              }
            });
          }
        })
      ));
    });
  }

  React.useEffect(() => {
    getDetails();
  }, []);

  const applyFilters = () => {
  }
  console.log(listings);
  console.log(minPrice);
  console.log(maxPrice);
  console.log(numBeds);
  console.log(filterString);
  const classes = useStyles();
  return (
    <div>
      <NavBar/>
      <Grid
        className={classes.pageContainer}
        justify="center"
        container
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Grid item className={classes.searchFilterSection}>
            <Button variant="contained" onClick={handleOpen}>Filter</Button>
          </Grid>
        </Grid>
        <Grid
          container
          justify="center"
          className={classes.listingSection}
          spacing={4}
        >
          {listings.filter(item => {
            return item.address.city.toLowerCase().includes(filterString.toLowerCase()) || item.title.toLowerCase().includes(filterString.toLowerCase());
          }).filter(item => {
            return item.metadata.beds.reduce((a, b) => a + b, 0) >= numBeds
          }).filter(item => {
            return calculateRating(item.reviews) >= rating
          }).filter(item => {
            return item.price >= minPrice
          }).filter(item => {
            // hide own listings in main listing page
            return item.owner !== localStorage.getItem('email')
          }).map((item, key) => {
            return <Grid item xs={12} sm={6} md={3} key={key}>
                      <Card>
                        <PropertyCard listing={item} />
                        <CardActions>
                          <Button size="small" onClick={() => { history.push(`/viewListing/${item.metadata.listing_id}`) }}>View Listing</Button>
                        </CardActions>
                      </Card>
                    </Grid>
          })}
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
            <Typography variant="h6" fontWeight="bold">Filter Searches</Typography>
            <TextField fullWidth label="Search title(s)/City.." variant="outlined" onChange={(event) => { setFilterString(event.target.value) }}/>
            <TextField type="number" fullWidth label="Filter beds" variant="outlined" onChange={(event) => { setNumBeds(event.target.value) }}/>
            <Typography variant="body1">SET DATE RANGE</Typography>
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
            <Typography variant="body1">SET PRICE RANGE</Typography>
            <Grid
              container
            >
              <Grid item xs={12} sm={6}>
                <TextField type="number" fullWidth label="Min cost ($)" variant="outlined" onChange={(event) => { setMinPrice(event.target.value) }}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField type="number" fullWidth label="Max cost ($)" variant="outlined" onChange={(event) => { setMaxPrice(event.target.value) }}/>
              </Grid>
            </Grid>
            <Typography variant="body1">SET DESIRED RATING</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <Button variant="outlined" onClick={() => { applyFilters(); }}>SUBMIT</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  )
}

export default ListingPage
