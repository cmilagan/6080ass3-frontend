import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import isLogin from '../utils/user';

const PublicRoute = ({ component: Component, restricted, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      isLogin() && restricted
        ? <Redirect to="/" />
        : <Component {...props} />
    )}
  />
);

PublicRoute.propTypes = {
  component: PropTypes.func.isRequired,
  restricted: PropTypes.bool.isRequired,
};

export default PublicRoute;
