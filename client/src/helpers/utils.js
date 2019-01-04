  function isLoggedIn() {
    if (localStorage.token) {
      return true;
    } else {
      return false;
    }
  }

export default {
  isLoggedIn
};
