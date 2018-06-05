/**
 * Given a username and password, this micro-service will return a JWT.
 * Return reject if either of them is missing / null / undefined.
 */

import jwt from 'jsonwebtoken'

module.exports.login = async (uid, pwd) => {
  return new Promise((resolve, reject) => {
    // Checks for presence of both user-name and password
    if (!!uid && !!pwd) {
      const user = {
        uid,
        pwd
      }
      // Attempt to create a new Token
      jwt.sign(user, 'certificate', (err, token) => {
        if (err) reject(new Error(err))
        resolve(token)
      })
    } else reject(new Error('Bad or malformed request'))
  })
}
