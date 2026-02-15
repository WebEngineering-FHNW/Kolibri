export { loginService }


/**
 * Offers a login attempt service, which check whetehr or not a login was successful
 * @returns {{loginAttempt: function(url, email, password): object}}
 */
const loginService = () => {

  /**
   * Checks whether a login attempt was successful or not.
   * @param {string} url 
   * @param {string} email 
   * @param {string} password 
   * @returns {promise} returns either the returned data or a rejected promise
   */
  const loginAttempt = (url, email, password) => {
    const request = {
      method: 'POST',
      Headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    }
  
    return fetch(url, request)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(res.status);
      })
      .catch(err => err)
  }

  return { 
    loginAttempt
  }
}
