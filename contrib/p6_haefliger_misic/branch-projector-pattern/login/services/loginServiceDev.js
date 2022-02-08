export { loginService }


/**
 * Offers a login attempt service, which check whetehr or not a login was successful
 * @returns {{loginAttempt: function(url, email, password): object}}
 */
const loginService = () => {
  
  /**
   * Checks whether a login attempt was successful or not. In dev Mode it will check upon a set string
   * @param {string} url 
   * @param {string} email 
   * @param {string} password 
   * @returns {promise} returns either a simulated returned data (which holds a token in case of a success) or a rejected promise
   */
  const loginAttempt = (email, password) => {
    return email === 'example@mail.com' && password === 'P4$$word'
      ? new Promise((resolve, reject) => {
          resolve({
            token: '1234'
          })
        })
      : Promise.reject(405)
  }

  return {
    loginAttempt
  }
}