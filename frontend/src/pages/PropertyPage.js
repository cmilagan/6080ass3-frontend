import React, { useEffect } from 'react'
import {
  Grid,
  Typography,
  Divider,
  CardMedia,
  Card,
  Rating,
  Stack,
  Paper,
  TextField,
  Button,
  Modal,
  Box,
  Snackbar,
  Alert
} from '@mui/material'
import { makeStyles } from '@material-ui/core'
import { calculateRating, getListing } from '../utils/helpers';
import { PropTypes } from 'prop-types';
import NavBar from '../components/NavBar';
import HotelIcon from '@mui/icons-material/Hotel';
import BathtubIcon from '@mui/icons-material/Bathtub';
import HouseIcon from '@mui/icons-material/House';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    minHeight: '100vh',
    paddingBottom: '8vh',
  },
  bookingStyle: {
    padding: '5% 20%',
    backgroundColor: '#17252A',
    color: 'white',
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
  },
  bookingSection: {
    position: 'fixed',
    right: '10vw',
    [theme.breakpoints.down('sm')]: {
      right: '5vw',
    },
    [theme.breakpoints.down('xs')]: {
      right: '1vw'
    },
  },
  reviewStyling: {
    minWidth: '30vw',
    padding: '20px',
  }
}));

const PropertyPage = (props) => {
  const { match: { params } } = props;
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');

  // meta data
  const [amenities, setAmenities] = React.useState([]);
  const [bedRooms, setBedrooms] = React.useState(0);
  const [beds, setBeds] = React.useState([]);
  const [bathrooms, setBathrooms] = React.useState(0);
  const [type, setType] = React.useState('');
  const [images, setImages] = React.useState([]);

  // address data
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [state, setState] = React.useState('');
  const [reviews, setReviews] = React.useState([]);

  const [startDate, setStartDate] = React.useState(new Date(Date.now()));
  const [endDate, setEndDate] = React.useState(new Date(Date.now()));

  // modal handler
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // confirmation
  const [bookingSuccess, setBookingSuccess] = React.useState(false);
  const [isBooked, setIsBooked] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [bookingId, setBookingId] = React.useState(0);
  const [comment, setComment] = React.useState('')

  useEffect(() => {
    async function getDetails () {
      const res = await (await getListing(params.lid)).json();
      if (!res.error) {
        setTitle(res.listing.title);
        setImages(res.listing.metadata.images);
        setPrice(res.listing.price);
        setType(res.listing.metadata.property_type);
        setAmenities(res.listing.metadata.amenities);
        setBedrooms(res.listing.metadata.number_rooms);
        setBeds(res.listing.metadata.beds);
        setBathrooms(res.listing.metadata.baths);
        console.log(res.listing.reviews)
        setReviews(res.listing.reviews);
        console.log(reviews)

        setStreet(res.listing.address.street);
        setCity(res.listing.address.city);
        setPostcode(res.listing.address.postcode);
        setState(res.listing.address.state);
      }
    }
    async function checkUserBooked () {
      const url = 'http://localhost:5005/bookings'
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('user_token')
        }
      }
      fetch(url, requestOptions).then(res => {
        if (res.ok) {
          return res.json()
        }
      }).then(res => {
        console.log(res)
        res.bookings.filter(item => {
          return (item.owner === localStorage.getItem('email') && item.listingId === params.lid)
        }).map(item => {
          setBookingId(item.id)
          return setIsBooked(true)
        })
      })
    }
    checkUserBooked();
    getDetails();
  }, []);

  async function postReview () {
    const url = `http://localhost:5005/listings/${params.lid}/review/${bookingId}`
    const jsonString = JSON.stringify({
      review: rating + ' ' + comment,
    })
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('user_token')
      },
      body: jsonString
    }
    fetch(url, requestOptions).then(res => {
      if (res.ok) {
        setReviews(reviews => [...reviews, rating + ' ' + comment])
      }
    })
  }

  const createBooking = () => {
    const jsonString = JSON.stringify({
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      totalPrice: Math.ceil((Math.abs(startDate - endDate)) / (1000 * 60 * 60 * 24)) * price,
    })
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('user_token')
      },
      body: jsonString,
    }
    const url = `http://localhost:5005/bookings/new/${params.lid}`
    fetch(url, requestOptions).then(res => {
      if (res.ok) {
        res.json().then(data => {
          setBookingSuccess(true);
          setIsBooked(true);
          setBookingId(data.bookingId)
        })
      } else {
        setBookingSuccess(false);
      }
    })
  }

  const classes = useStyles();
  return (
    <main>
      <NavBar />
      <Grid container spacing={2} direction="column">
        <Grid item xs={12} container className={classes.pageContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}
            container
            direction="row"
            alignItems="center"
          >
            <Grid item xs={8} container direction="column" alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <Grid item container>
                  {images.map((image, key) => {
                    return <Grid item key={key} xs={12} sm={6}>
                            <Card sx={{ maxWidth: '100%' }} key={key}>
                              <CardMedia
                                component="img"
                                height="200"
                                image={image}
                                alt="listing image"
                              />
                            </Card>
                          </Grid>
                  })}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold">
                  {title}
                </Typography>
                <Divider/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold">
                  <HouseIcon />{type}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold">
                  Location: {street}, {city} {state} {postcode}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">
                  Cost per night ($): {price}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">
                  Amenities:
                </Typography>
              </Grid>
              {amenities.map((item, key) => {
                return <Grid item xs={12} key={key}>
                  <Typography>
                    {item}
                  </Typography>
                </Grid>
              })}
              <Grid item xs={12}>
                <Typography variant="body1">
                  Rooms: {bedRooms}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <HotelIcon /> {beds.reduce((a, b) => a + b, 0)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <BathtubIcon /> {bathrooms}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <Rating
                    precision={0.5}
                    value={calculateRating(reviews)}
                    max={5}
                    readOnly
                  />
                  ({reviews.length})
                </Typography>
              </Grid>
              {isBooked === true
                ? (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          Leave a review:
                        </Typography>
                      </Grid>
                      <Rating
                        precision={1}
                        value={rating}
                        max={5}
                        onChange={(event, newValue) => {
                          setRating(newValue)
                        }}
                      />
                      <Grid item xs={12}>
                        <TextField fullWidth label="Comment on your stay" variant="outlined" onChange={(event) => setComment(event.target.value)}/>
                        <Button size="medium" variant="outlined" onClick={() => { postReview(); }} >Submit</Button>
                      </Grid>
                    </>
                  )
                : (
                    <>
                    </>
                  )
              }
              <Grid item xs={12}>
                <Typography>
                  Reviews:
                </Typography>
              </Grid>
              {reviews.map((review, key) => {
                return <Grid item xs={12} key={key}>
                  <Paper className={classes.reviewStyling} elevation={3}>
                    Score ({review.split(' ')[0]}) Comment: {review.substring(2)}
                  </Paper>
                </Grid>
              })}
            </Grid>
            <Grid item xs={4} container className={classes.bookingSection}>
              <Grid item xs={12}>
                <Stack spacing={3} alignItems="center" width="100%">
                  <Paper className={classes.bookingStyle}>
                    <Typography variant="h6" fontWeight="bold">
                      Make a booking!
                    </Typography>
                  </Paper>
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
                  <Button size="medium" variant="outlined" onClick={handleOpen}>Submit</Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} />
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
            <Typography>Confirm Booking</Typography>
            <Button size="medium" variant="contained" onClick={() => { createBooking(); handleClose(); }}>Confirm Booking</Button>
          </Stack>
        </Box>
      </Modal>
      <Snackbar open={bookingSuccess} autoHideDuration={5000} onClose={() => { setBookingSuccess(false); }}>
        <Alert onClose={() => { setBookingSuccess(false); }} severity="success">
          Booking has been made.
        </Alert>
      </Snackbar>
    </main>
  )
}

PropertyPage.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default PropertyPage
