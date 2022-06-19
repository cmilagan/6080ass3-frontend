import React from 'react'
import {
  Paper,
} from '@mui/material';
import { makeStyles } from '@material-ui/core';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  itemStyles: {
    width: '10vw',
    height: '200px',
  }
}))

const Item = ({ image }) => {
  const classes = useStyles();
  console.log(image);
  return (
    <div>
      <Paper className={classes.itemStyles}>
        <img
          src={image}
        />
      </Paper>
    </div>
  )
}

Item.propTypes = {
  image: PropTypes.object.isRequired,
}

export default Item
