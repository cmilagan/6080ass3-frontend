import { shallow } from 'enzyme';
import React from 'react';
import RegisterPage from './pages/RegisterPage'

describe('RegisterPage', () => {
  const wrapper = shallow(<RegisterPage />);

  it('Verify title of form', () => {
    const title = wrapper.find('#title');
    expect(title.text()).toEqual('Register');
  })

  it('verify route on button', () => {
    const button = wrapper.find('#login');
    expect(button.props().to).toEqual('/login');
  });

  it('verify button type', () => {
    const button = wrapper.find('#login');
    expect(button.props().variant).toEqual('text');
  });


})
