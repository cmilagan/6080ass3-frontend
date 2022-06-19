import {
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { makeStyles, Snackbar } from '@material-ui/core';
import React from 'react'
import NavBar from '../components/NavBar'
import CardMedia from '@mui/material/CardMedia';
import { fileToDataUrl, amenitiesOptions, MenuProps } from '../utils/helpers';
import { useHistory } from 'react-router';
import { Alert } from '@material-ui/lab';

// https://www.youtube.com/watch?v=XoK1a4bYgVw

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  listingSection: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  addListing: {
    borderRadius: '50%',
    position: 'absolute',
    bottom: '0',
  },
  bedsContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  formContainer: {
    padding: '2%',
    borderRadius: '5%',
    width: '45vw',
    [theme.breakpoints.down('sm')]: {
      width: '60vw',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
    }
  }
}));

const NewListingPage = () => {
  const [propertyType, setPropertyType] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [bedRooms, setBedRooms] = React.useState(0);
  const [baths, setBaths] = React.useState(0);
  const [image, setImage] = React.useState('');
  const [beds, setBeds] = React.useState([0, 0, 0, 0, 0]);
  const [amenities, setAmenities] = React.useState([]);
  const [state, setState] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [city, setCity] = React.useState('');
  const [complete, setComplete] = React.useState(false);
  // update the number of beds on change
  const updateFieldChanged = index => e => {
    const newArr = [...beds]; // copy old beds array
    newArr[index] = parseInt(e.target.value);
    setBeds(newArr);
  }

  const history = useHistory();

  const components = [];
  for (let i = 1; i <= bedRooms; i++) {
    components.push(
      <Grid key={`beds_${i}`} item xs={12} sm={6} md={3}>
        <TextField fullWidth type="number" label={`Beds in room ${i}`} variant="outlined" name="beds" id={`no_beds_${i}`} onChange={updateFieldChanged(i - 1)}/>
      </Grid>
    )
  }

  /**
   * Default image
   */
  if (image === '') {
    setImage('https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg');
  }

  async function createListing () {
    if (title && price && bedRooms && baths && city && postcode && state && street && propertyType) {
      console.log('hello');
      console.log(beds);
      console.log(amenities);
      console.log(street);
      console.log(postcode);
      console.log(city);

      const jsonString = JSON.stringify({
        title,
        address: { street, city, postcode, state },
        price,
        thumbnail: image,
        metadata: {
          number_rooms: bedRooms,
          beds,
          amenities,
          baths,
          images: [image],
          property_type: propertyType,
        },
      });
      const url = 'http://localhost:5005/listings/new';
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('user_token'),
        },
        body: jsonString,
      }
      fetch(url, requestOptions).then((res) => {
        if (res.ok) {
          // Add listing id to metadata (ensure uniqueness)
          res.json().then(data => {
            console.log(data);
            const updateString = JSON.stringify({
              title,
              address: { street, city, postcode, state },
              price,
              thumbnail: image,
              metadata: {
                number_rooms: bedRooms,
                beds,
                amenities,
                baths,
                property_type: propertyType,
                images: [image],
                listing_id: data.listingId,
              },
            });
            const updateOptions = {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('user_token'),
              },
              body: updateString,
            }
            fetch(`http://localhost:5005/listings/${data.listingId}`, updateOptions).then(res => {
              if (res.ok) {
                history.push('/myListings');
                setComplete(false);
              } else {
                res.json().then(data => {
                  console.log(data);
                })
              }
            });
          })
        } else {
          res.json().then(data => {
            console.log(data);
          })
        }
      });
    } else {
      console.log('hello');
      setComplete(true);
    }
  }

  const handleClose = () => {
    setComplete(false);
  }

  async function handleSelectedFile (event) {
    const dataUrl = await fileToDataUrl(event.target.files[0]);
    console.log(dataUrl);
    setImage(dataUrl);
  }

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
        justify="center"
        className={classes.pageContainer}
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
          >
            Create New Listing
          </Typography>
        </Grid>
        <Paper elevation={3} className={classes.formContainer}>
          <Grid container direction="column" align="center" spacing={3}>
            <Grid item>
              <CardMedia
                component="img"
                height="300"
                src={image}
                alt="listing image"
              />
            </Grid>
            <Grid item>
              <Button
                size="medium"
                variant="outlined"
                component="label"
              >
                Upload Image
                <input
                  accept="image/*"
                  type="file"
                  id="image-upload"
                  hidden
                  onChange={handleSelectedFile}
                />
              </Button>
            </Grid>
            <Grid item>
              <TextField fullWidth label="Listing Title" variant="outlined" name="title" id="title" onChange={(event) => setTitle(event.target.value)}/>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel id="property-select-label">Type</InputLabel>
                <Select
                  labelId="property-select-label"
                  id="type-select"
                  value={propertyType}
                  label="type"
                  onChange={(event) => setPropertyType(event.target.value)}
                >
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Typography variant="h6">Address</Typography>
              <TextField fullWidth label="Street" variant="outlined" name="street" id="street" onChange={(event) => setStreet(event.target.value)}/>
            </Grid>
            <Grid item>
              <TextField fullWidth label="City" variant="outlined" name="city" id="city" onChange={(event) => setCity(event.target.value)}/>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel id="property-select-label">State</InputLabel>
                <Select
                  labelId="property-select-label"
                  id="type-select"
                  value={state}
                  label="State"
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
            <Grid item>
              <TextField fullWidth type="number" label="Postcode" variant="outlined" name="postcode" id="postcode" onChange={(event) => setPostcode(event.target.value)}/>
            </Grid>
            <Grid item>
              <Typography variant="h6">Cost</Typography>
              <TextField fullWidth type="number" label="Price $ (per night)" variant="outlined" name="price" id="price" onChange={(event) => setPrice(event.target.value)}/>
            </Grid>
            <Grid item>
              <Typography variant="h6">Bedding</Typography>
              <FormControl fullWidth>
                <InputLabel id="bedroom-select-label">Bed Rooms</InputLabel>
                <Select
                  labelId="bedroom-select-label"
                  id="type-select"
                  value={bedRooms}
                  label="Bed Rooms"
                  onChange={(event) => {
                    setBedRooms(event.target.value);
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
              <TextField width="50%" type="number" label="Bathrooms" variant="outlined" name="bathrooms" id="bathrooms" onChange={(event) => setBaths(event.target.value)}/>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="mutiple-select-label">Amenities</InputLabel>
                <Select
                  labelId="mutiple-select-label"
                  multiple
                  value={amenities}
                  onChange={handleAmenitiesChange}
                  renderValue={(amenities) => amenities.join(', ')}
                  MenuProps={MenuProps}
                >
                  {amenitiesOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      <ListItemIcon>
                        <Checkbox checked={amenities.indexOf(option) > -1} />
                      </ListItemIcon>
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button size="medium" variant="contained" onClick={() => { createListing(); }}>Submit</Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Snackbar open={complete} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Please complete all fields.
        </Alert>
      </Snackbar>
    </main>
  )
}

export default NewListingPage
