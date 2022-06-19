import React from 'react';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import ListingPage from './pages/ListingPage';
import NewListingPage from './pages/NewListingPage';
import UserListingPage from './pages/UserListingsPage';
import EditListingPage from './pages/EditListingPage';
import PropertyPage from './pages/PropertyPage';

const routes = [
  // User auth routes
  <PublicRoute key="route-login" restricted={true} component={LoginPage} path='/login' exact />,
  <PublicRoute key="route-register" restricted={true} component={RegisterPage} path='/register' exact />,

  // Route for landing page
  <PublicRoute key="route-landing" restricted={false} component={LandingPage} path='/' exact />,
  <PrivateRoute key="route-listing" component={ListingPage} restricted path='/allListings' exact />,
  <PrivateRoute key="route-userlisting" component={UserListingPage} restricted path='/myListings' exact />,
  <PrivateRoute key="route-host" component={NewListingPage} restricted path='/host' exact />,
  <PrivateRoute key="route-editlisting" component={EditListingPage} restricted path='/editListing/:lid' exact />,
  <PrivateRoute key="route-viewListing" component={PropertyPage} restricted path='/viewListing/:lid' exact />,

];

export default routes;
