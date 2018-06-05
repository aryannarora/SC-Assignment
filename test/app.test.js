import rp from 'request-promise'
import { expect } from 'chai'
import nock from 'nock'
require('dotenv').config()

describe('App', () => {
  // JWT that is tampered, expired or not signed by the library
  const invalidJWT = `eyJhbGciOiJIUzI1NiIsInR5CI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0IiwicHdkIjoidGVzdCIsImlhdCI6MTUyODIwMDc5M30.TBLJinTxkm7pT4j0LOrMfoYMbvqF-i3jFtRfem129bA`

  // JWT that is generated and signed by library
  const validJWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0IiwicHdkIjoidGVzdCIsImlhdCI6MTUyODIwMDc5M30.TBLJinTxkm7pT4j0LOrMfoYMbvqF-i3jFtRfem129bA`

  // this block will run before any test is executed.
  before(() => {
    // Mocking requests with nock
    nock(`http://localhost:${process.env.PORT}`, {
      reqheaders: {
        'authorization': `bearer ${invalidJWT}`
      }
    }).post((uri) => uri.includes('patchify') || uri.includes('download')).times(2)
      .reply(403)

    nock(`http://localhost:${process.env.PORT}`, {
      reqheaders: {
        'content-type': `application/x-www-form-urlencoded`
      }
    }).post(`/login`, 'uid=test&pwd=test')
      .reply(200, {
        token: validJWT
      })

    nock(`http://localhost:${process.env.PORT}`, {
      reqheaders: {
        'authorization': `bearer ${validJWT}`
      }
    }).post(`/patchify`)
      .reply(200, 'Patch must be an array of operations')

    nock(`http://localhost:${process.env.PORT}`)
      .post((uri) => uri.includes('patchify') || uri.includes('download')).times(2)
      .reply(403)

    nock(`http://localhost:${process.env.PORT}`, {
      reqheaders: {
        'authorization': `bearer ${validJWT}`
      }
    }).post(`/download`)
      .reply(200, 'Error: options.uri is a required argument')
  })

  it('should not allow requests with no jwt | Route: Patchify', async () => {
    const statusCode = await rp.post(`http://localhost:${process.env.PORT}/patchify`)
      .catch(e => e.statusCode)

    // expect access to be forbidden
    expect(statusCode).to.be.equal(403)
  })

  it('should not allow requests with invalid jwt | Route: Patchify', async () => {
    const options = {
      uri: `http://localhost:${process.env.PORT}/patchify`,
      headers: {
        'authorization': `bearer ${invalidJWT}`
      },
      method: 'POST',
      json: true
    }

    const statusCode = await rp(options).catch(e => e.statusCode)
    // expect access to be forbidden
    expect(statusCode).to.be.equal(403)
  })

  it('should allow requests with valid jwt | Route: Patchify', async () => {
    const options = {
      uri: `http://localhost:${process.env.PORT}/patchify`,
      headers: {
        'authorization': `bearer ${validJWT}`
      },
      method: 'POST'
    }

    const reply = await rp(options).then(res => res)
    expect(reply).to.be.equal('Patch must be an array of operations')
  })

  it('should not allow requests with no jwt | Route: Download', async () => {
    const statusCode = await rp.post(`http://localhost:${process.env.PORT}/download`)
      .catch(e => e.statusCode)

      // expect access to be forbidden
    expect(statusCode).to.be.equal(403)
  })

  it('should not allow requests with invalid jwt | Route: Download', async () => {
    const options = {
      uri: `http://localhost:${process.env.PORT}/download`,
      headers: {
        'authorization': `bearer ${invalidJWT}`
      },
      method: 'POST',
      json: true
    }

    const statusCode = await rp(options).catch(e => e.statusCode)
    // expect access to be forbidden
    expect(statusCode).to.be.equal(403)
  })

  it('should allow requests with valid jwt | Route: Download', async () => {
    const options = {
      uri: `http://localhost:${process.env.PORT}/download`,
      headers: {
        'authorization': `bearer ${validJWT}`
      },
      method: 'POST'
    }

    const reply = await rp(options).then(res => res)
    expect(reply).to.be.equal('Error: options.uri is a required argument')
  })

  it('should return a valid jwt | Route: login', async () => {
    const options = {
      uri: `http://localhost:${process.env.PORT}/login`,
      headers: {
        'content-type': `application/x-www-form-urlencoded`
      },
      method: 'POST',
      body: 'uid=test&pwd=test'

    }
    const expected = {}
    expected.token = validJWT
    const jwt = await rp(options).then(res => JSON.parse(res))
    expect(jwt).to.be.deep.equal(expected)
  })
})
