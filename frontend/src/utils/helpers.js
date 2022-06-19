/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export const amenitiesOptions = [
  'Swimming pool',
  'Gym',
  'Parking',
  'Internet',
]

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250
    }
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center'
  },
  variant: 'menu'
};

/**
 * Gets the details of specified listing
 * @param {*} id
 * @returns
 */
export async function getListing (id) {
  const url = `http://localhost:5005/listings/${id}`;
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    path: id,
  }
  return await fetch(url, requestOptions);
}

// TODO
export const calculateRating = (reviews) => {
  if (reviews.length === 0) return 0;
  const scores = []
  for (let i = 0; i < reviews.length; i++) {
    scores.push(parseInt(reviews[i].split(' ')[0]))
  }
  return (scores.reduce((a, b) => a + b, 0) / reviews.length)
}

/**
 * Gets basic data of all listings
 *
 */
export async function getListings () {
  const url = 'http://localhost:5005/listings';
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  return await fetch(url, requestOptions);
}

/**
 * Helper function to get all the data of all listings
 */
export async function getLiveListings () {
  const res = await (await getListings()).json();
  const liveListings = [];
  res.listings.forEach(item => {
    (async () => {
      (await getListing(item.id)).json().then(res => {
        if (res.listing.published === true) {
          liveListings.push(res);
        }
      })
    })();
  });
  console.log(liveListings);
  return liveListings;
}
