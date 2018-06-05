import { expect } from 'chai'
import { login } from '../../services/login'

describe('login', () => {
  it('return a jwt token', async () => {
    const jwt = await login('test@test.com', 'development')

    // expects promise to be resolved and jwt to contain a token
    expect(jwt).to.not.be.undefined // eslint-disable-line
  })

  it('should discard bad/illformed login requests', async () => {
    const reject = await login(undefined, 'development').catch(e => 1)
    expect(reject).to.equal(1)
  })
})
