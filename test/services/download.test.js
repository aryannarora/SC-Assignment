import { expect } from 'chai'
import { download } from '../../services/download'

// HTTP(S) requets mocking library
import nock from 'nock'

describe('Download and resize', () => {
  // this block will run before any test is executed.
  before(() => {
    // Mocking requests with nock
    nock('https://www.google.com')
      .head('/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png')
      .reply(200, null, {
        'Content-Type': 'image/png'
      })

    nock('https://www.google.com')
      .get('/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png')
      .replyWithFile(200, 'test/images/google.png', {
        'Content-Type': 'image/png'
      })

    nock('http://www.test.com')
      .head('/xyz/abc/def/1x/color.png')
      .replyWithError('something awful happened')
  })

  // URL that point to an image
  const validUrl = `https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png`

  // URL that doesn't point to an image or points to one but not accessible.
  const invalidUri = `https://www.test.com/xyz/abc/def/1x/color.png`

  it('Resolves with valid image URI', async () => {
    const format = await download(validUrl)
    expect(format).to.not.be.undefined // eslint-disable-line
  })

  it('Rejects promise with invalid image URI', async () => {
    let reject = 0
    await download(invalidUri)
      .catch(e => {
        reject = 1
      })

    expect(reject).to.equal(1)
  })
})
