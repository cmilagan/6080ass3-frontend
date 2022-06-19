import React from 'react'
import NavBar from '../components/NavBar'
import { makeStyles } from '@material-ui/core';
import backgroundImage from '../assets/background7.jpg'
import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardActions,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PropertyCard from '../components/PropertyCard';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  heroSection: {
    minHeight: '94vh',
    backgroundColor: '#17252A',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paperSection: {
    width: '70vw',
    height: '50vh',
    border: 25,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingBox: {
    padding: '20px',
    opacity: '0.9',
  },
  displaySection: {
    minHeight: '100vh',
    backgroundColor: '#DEF2F1',
    display: 'flex',
    alignItems: 'center',
  },
  paperHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90vw',
    height: '20vh',
    margin: '5%',
  },
  listingSection: {
    padding: '2.5%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

}));

const LandingPage = () => {
  const bottom = React.createRef();
  const classes = useStyles();
  const [listings, setListings] = React.useState([]);

  const history = useHistory();

  React.useEffect(() => {
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
    getDetails();
  }, []);
  console.log(listings);
  return (
    <main>
      <NavBar />
      <Grid
        container
        direction="column"
        className={classes.heroSection}
      >
        <Grid item xs={12}>
          <Paper elevation={10} className={classes.paperSection}>
            <Paper elevation={4} className={classes.brandingBox}>
              <Typography
                variant="h4"
                color="secondary"
                fontWeight="bold"
                fontFamily="fantasy"
              >
                A i r B r B
              </Typography>
            </Paper>
          </Paper>
        </Grid>
        <Grid item sx={{ marginTop: '5%' }}>
          <Typography
            variant="h4"
            color="#DEF2F1"
            fontFamily="fantasy"
          >
            Plan your next trip with us!
          </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '5%' }}>
          <Button size="large" variant="text" onClick={() => { bottom.current.scrollIntoView({ behavior: 'smooth' }) }}><KeyboardArrowDownIcon style={{ fontSize: '64px' }}/></Button>
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        className={classes.displaySection}
        ref={bottom}

      >
        <Grid item xs={12}>
          <Paper elevation={12} className={classes.paperHeader}>
            <Typography
              variant="h4"
              color="secondary"
              fontFamily="fantasy"
            >
              Some of what we have
            </Typography>
          </Paper>
        </Grid>
        <Grid
          container
          className={classes.listingSection}
          spacing={4}
        >
          {listings.map((item, key) => {
            if (listings.indexOf(item) < 3) {
              return <Grid item xs={12} sm={6} md={4} key={key}>
                        <Card>
                          <PropertyCard listing={item} />
                          <CardActions>
                            <Button size="small" onClick={() => { history.push(`/viewListing/${item.metadata.listing_id}`) }}>View Listing</Button>
                          </CardActions>
                        </Card>
                      </Grid>
            }
            return <h1 key={key} />
          })}
        </Grid>
      </Grid>
    </main>
  )
}

export default LandingPage
