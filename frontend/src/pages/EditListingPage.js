import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import { PropTypes } from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Divider,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Modal,
  Box,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Fab,
} from '@mui/material';
import { makeStyles } from '@material-ui/core';
// import EditIcon from '@mui/icons-material/Edit';
import {
  amenitiesOptions,
  fileToDataUrl,
  getListing,
  MenuProps,
} from '../utils/helpers';
import { StoreContext } from '../utils/store';
import HandleError from '../components/HandleError';
import EditIcon from '@mui/icons-material/Edit';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    minHeight: '100vh',
  },
  listingContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  formContainer: {
    paddingBottom: '15vh',
    minHeight: '90vh',
    maxWidth: '65vw',
    [theme.breakpoints.down('sm')]: {
      width: '75vw',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
    }
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

const EditListingPage = (props) => {
  const { match: { params } } = props;
  const context = React.useContext(StoreContext);
  const [, setErrorPopUp] = context.errorPopUp;
  const [title, setTitle] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
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

  // amenities modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const history = useHistory();
  // display the current listing details
  useEffect(() => {
    async function getDetails () {
      const res = await (await getListing(params.lid)).json();
      if (res.error) {
        setErrorPopUp({ error: true, message: res.error });
      } else {
        setTitle(res.listing.title);
        setImages(res.listing.metadata.images);
        setThumbnail(res.listing.thumbnail);
        setPrice(res.listing.price);
        setType(res.listing.metadata.property_type);
        setAmenities(res.listing.metadata.amenities);
        setBedrooms(res.listing.metadata.number_rooms);
        setBeds(res.listing.metadata.beds);
        setBathrooms(res.listing.metadata.baths);

        setStreet(res.listing.address.street);
        setCity(res.listing.address.city);
        setPostcode(res.listing.address.postcode);
        setState(res.listing.address.state);
      }
    }
    getDetails();
  }, []);

  // handle uploaded images, store them into images array
  async function handleSelectedFile (event) {
    const dataUrl = await fileToDataUrl(event.target.files[0]);
    setImages(images => [...images, dataUrl]);
  }

  async function updateListing () {
    const jsonString = JSON.stringify({
      title,
      address: { street, city, postcode, state },
      price,
      thumbnail: thumbnail,
      metadata: {
        number_rooms: bedRooms,
        beds,
        amenities,
        baths: bathrooms,
        property_type: type,
        images,
        listing_id: params.lid,
      },
    });
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('user_token'),
      },
      body: jsonString,
    }
    const url = `http://localhost:5005/listings/${params.lid}`;
    fetch(url, requestOptions).then((res) => {
      if (res.ok) {
        res.json().then(data => {
          console.log(data);
          history.push('/myListings');
        })
      }
    })
  }

  // removes images from images array
  function handleRemoveImage (remove) {
    setImages(images.filter(image => image !== remove));
    console.log(images);
  }

  const updateFieldChanged = index => e => {
    const newArr = [...beds]; // copy old beds array
    newArr[index] = parseInt(e.target.value);
    setBeds(newArr);
  }

  const components = [];
  for (let i = 1; i <= bedRooms; i++) {
    const currBeds = [...beds];
    components.push(
      <Grid key={`beds_${i}`} item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          type="number"
          label={`Beds in room ${i}`}
          InputLabelProps={{ shrink: true }}
          value={currBeds[i - 1]}
          variant="outlined"
          name="beds"
          id={`no_beds_${i}`}
          onChange={updateFieldChanged(i - 1)}
        />
      </Grid>
    )
  }

  const renderAmenities = [];
  for (let i = 0; i < amenities.length; i++) {
    renderAmenities.push(
      <Grid key={`amenity_${i + 1}`} item>
        <Chip label={amenities[i]} onDelete={() => { setAmenities(amenities.filter(amenity => amenity !== amenities[i])) }} />
      </Grid>
    )
  }

  // get a list of all amenities that are currently not added
  const addAmenities = amenitiesOptions.filter(item => !amenities.includes(item));

  const handleAmenitiesChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === 'all') {
      setAmenities(amenities.length === amenitiesOptions.length ? [] : amenitiesOptions);
      return;
    }
    setAmenities(value);
  }

  const classes = useStyles();
  return (
    <main>
      <NavBar />
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.pageContainer}
      >
        <Grid item sx={{ padding: '2.5%' }}>
          <Typography variant="h5" fontWeight="bold">
            Update Listing ({title})
          </Typography>
          <Divider />
        </Grid>
        <Grid
          container
          className={classes.formContainer}
          direction="column"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Typography variant="h6">
              IMAGES
            </Typography>
          </Grid>

          <Grid
            container
            spacing={3}
            direction="row"
          >
            {images.map((image, key) => (
              <Grid item key={key} xs={12} sm={6} md={4}>
                <Card sx={{ width: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image}
                    alt="listing image"
                  />
                  <CardActions>
                    <Button size="small" variant="outlined" onClick={() => { handleRemoveImage(image) }}>Remove Image</Button>
                    { image === thumbnail
                      ? (
                        <Button size="small" variant="contained">Selected</Button>
                        )
                      : (
                        <Button size="small" variant="outlined" onClick={() => { setThumbnail(image) }}>Make Thumbnail</Button>
                        )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid item>
            <Button
              size="medium"
              variant="contained"
              component="label"
            >
              Add Image
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                hidden
                onChange={handleSelectedFile}
              />
            </Button>
          </Grid>

          <Grid
            container
            direction="column"
            spacing={3}
            autoComplete="off"
          >
            <Grid item xs={12}>
              Edit Listing Title
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                value={title}
                label="Edit Title"
                InputLabelProps={{ shrink: true }}
                variant="outlined" name="editTitle"
                id="editTitle"
                onChange={(event) => setTitle(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              Edit Listing Price
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                value={price}
                label="Edit price ($)"
                InputLabelProps={{ shrink: true }}
                variant="outlined" name="editTitle"
                id="editPrice"
                onChange={(event) => setPrice(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              Edit Address
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                value={street}
                label="Change street"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                name="street"
                id="street"
                onChange={(event) => setStreet(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Change city"
                value={city}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                name="city"
                id="city"
                onChange={(event) => setCity(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="property-select-label">Change state</InputLabel>
                <Select
                  labelId="property-select-label"
                  id="type-select"
                  value={state}
                  label="Change state"
                  onChange={(event) => setState(event.target.value)}
                >
                  <MenuItem value="NSW">NSW</MenuItem>
                  <MenuItem value="QLD">QLD</MenuItem>
                  <MenuItem value="WA">WA</MenuItem>
                  <MenuItem value="TAS">TAS</MenuItem>
                  <MenuItem value="SA">SA</MenuItem>
                  <MenuItem value="VIC">VIC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Change postcode"
                value={postcode}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                name="postcode"
                id="postcode"
                onChange={(event) => setPostcode(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="property-select-label">Type</InputLabel>
                <Select
                  labelId="property-select-label"
                  id="type-select"
                  value={type}
                  label="type"
                  onChange={(event) => setType(event.target.value)}
                >
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              Edit bed rooms
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="bedroom-select-label">Bed Rooms</InputLabel>
                <Select
                  labelId="bedroom-select-label"
                  id="type-select"
                  value={bedRooms}
                  label="Bed Rooms"
                  onChange={(event) => {
                    setBedrooms(event.target.value);
                    const currBeds = [...beds];
                    if (currBeds[event.target.value] !== 0) {
                      for (let i = event.target.value; i < currBeds.length; i++) {
                        currBeds[i] = 0;
                      }
                    }
                    setBeds(currBeds);
                  }}
                >
                  {/* Can add more Bedrooms, but set to 5 just for this example */}
                  <MenuItem value={0}>{0}</MenuItem>
                  <MenuItem value={1}>{1}</MenuItem>
                  <MenuItem value={2}>{2}</MenuItem>
                  <MenuItem value={3}>{3}</MenuItem>
                  <MenuItem value={4}>{4}</MenuItem>
                  <MenuItem value={5}>{5}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                >
                {components}
              </Grid>
            </Grid>
            <Grid item>
              Edit Bathrooms
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                type="number"
                label="Bathrooms"
                value={bathrooms}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                name="bathrooms"
                id="bathrooms"
                onChange={(event) => setBathrooms(event.target.value)}
              />
            </Grid>
            <Grid item>
              Edit Amenities
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                >
                {renderAmenities}
              </Grid>
            </Grid>
            <Grid item>
              <Button size="medium" variant="contained" onClick={handleOpen}>Add Amenities</Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className={classes.modalStyle}>
                  <FormControl fullWidth>
                    <InputLabel id="mutiple-select-label">Add Amenities</InputLabel>
                    <Select
                      labelId="mutiple-select-label"
                      multiple
                      value={amenities}
                      onChange={handleAmenitiesChange}
                      renderValue={(amenities) => amenities.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {addAmenities.map((option) => (
                        <MenuItem key={option} value={option}>
                          <ListItemIcon>
                            <Checkbox checked={amenities.indexOf(option) > -1} />
                          </ListItemIcon>
                          <ListItemText primary={option} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Modal>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="center"
        >
          <Fab
            color="secondary"
            size="medium"
            aria-label="add"
            sx={{ position: 'fixed', bottom: '5%', color: '#FEFFFF' }}
            onClick={updateListing}
          >
            <EditIcon />
          </Fab>
        </Grid>
      </Grid>
      <HandleError />
    </main>
  )
}

EditListingPage.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default EditListingPage
