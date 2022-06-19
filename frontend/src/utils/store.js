import React from 'react';

export const StoreContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
export function StoreProvider ({ children }) {
  // global useStates
  const [errorPopUp, setErrorPopUp] = React.useState({ error: false, message: '' });
  const [allListings, setAllListings] = React.useState([]);
  const store = {
    errorPopUp: [errorPopUp, setErrorPopUp],
    allListings: [allListings, setAllListings],
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider
