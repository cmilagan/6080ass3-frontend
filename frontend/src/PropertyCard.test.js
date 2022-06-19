import { shallow } from 'enzyme';
import React from 'react';
import PropertyCard from './components/PropertyCard';
import background from './assets/background1.jpg'

describe('PropertyCard', () => {
  const listing = {
    title: 'New Listing',
    owner: '123@gmail.com',
    address: {
      street: '',
      city: '',
      postcode: '',
      state: '',
    },
    price: '1',
    thumbnail: background,
    metadata: {
      number_rooms: 2,
      beds: [
        2,
        2,
        0,
        0,
        0
      ],
      amenities: [
        'Gym',
      ],
      baths: '3',
      property_type: 'Villa',
      images: [],
    },
    reviews: [],
  }
  const wrapper = shallow(<PropertyCard listing={listing} />);

  it('check ratings are correct', () => {
    const rating = wrapper.find('#rating');
    expect(rating.props().value).toEqual(0);
  })

  it('check that title is rendered properly', () => {
    const title = wrapper.find('#title');
    expect(title.text()).toEqual('New Listing')
  })

  it('check that number of beds is calculated and show properly', () => {
    const beds = wrapper.find('#beds');
    expect(beds.text()).toEqual('4');
  })

  it('check number of baths is shown properly', () => {
    const baths = wrapper.find('#baths');
    expect(baths.text()).toEqual('3');
  })
})
