export { loginService }

const loginService = () => {
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