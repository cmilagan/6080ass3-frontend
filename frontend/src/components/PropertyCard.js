import React from 'react'
import { PropTypes } from 'prop-types';
import { Typography, CardMedia, CardContent } from '@material-ui/core'
import HotelIcon from '@mui/icons-material/Hotel';
import BathtubIcon from '@mui/icons-material/Bathtub';
import HouseIcon from '@mui/icons-material/House';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Rating } from '@mui/material';
import { calculateRating } from '../utils/helpers';

const PropertyCard = ({
  listing
}) => {
  return (
    <div>
      <CardMedia
        id="#thumbnail"
        component="img"
        height="300"
        image={listing.thumbnail}
        alt="listing-thumbnail"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" id="title">
          {listing.title}
        </Typography>
        <Typography gutterBottom variant="h6" component="div" id="property-type">
          <HouseIcon sx={{ marginRight: '10px' }} />
          {listing.metadata.property_type}
        </Typography>
        <Typography gutterBottom variant="h6" component="div" id="beds">
          <HotelIcon sx={{ marginRight: '10px' }}/>
          {listing.metadata.beds.reduce((a, b) => a + b, 0)}
        </Typography>
        <Typography variant="h6" component="div" id="baths">
          <BathtubIcon sx={{ marginRight: '10px' }} />
          {listing.metadata.baths}
        </Typography>
        <Typography variant="h6" component="div" id="price">
          <AttachMoneyIcon sx={{ marginRight: '10px' }} />
          {listing.price} (Per night)
        </Typography>
        <Typography>
          <Rating
            id="rating"
            precision={0.5}
            value={calculateRating(listing.reviews)}
            max={5}
            readOnly
          />
          ({listing.reviews.length})
        </Typography>
      </CardContent>
    </div>
  )
}

PropertyCard.propTypes = {
  listing: PropTypes.object.isRequired,
}

export default PropertyCard;
