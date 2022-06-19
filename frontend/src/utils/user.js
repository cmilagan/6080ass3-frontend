const isLogin = () => {
  if (localStorage.getItem('user_token')) {
    return true;
  }

  return false;
}

export default isLogin
