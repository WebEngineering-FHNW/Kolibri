export { loginService }

const loginService = () => {

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
