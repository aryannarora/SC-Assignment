import { expect } from 'chai'
import { applyJsonPatch } from '../../services/jsonPatch'

describe('Json Patch', () => {
  // JSON Object we will be applying our patch on
  const object = {
    'baz': 'qux',
    'foo': 'bar'
  }

  // Patch that will be succesfully applied with no errors
  const validPatch = [
    {'op': 'replace', 'path': '/baz', 'value': 'boo'},
    {'op': 'add', 'path': '/hello', 'value': ['world']},
    {'op': 'remove', 'path': '/foo'}
  ]

  // Patch that is invaild and can not be applied
  const invalidPatch = [
    { 'op': 'replace', 'path': '/xyz', 'value': 'boo' },
    { 'op': 'add', 'path': '/hello', 'value': ['world'] },
    {'op': 'remove', 'path': '/bar'}
  ]

  // Expected result after applying the valid patch
  const result = {
    'baz': 'boo',
    'hello': ['world']
  }

  it('should resolve with patched object for valid patches', async () => {
    const patchedObject = await applyJsonPatch(object, validPatch)
    expect(patchedObject).to.be.deep.equal(result)
  })

  it('should reject promise for invalid patches', async () => {
    const reject = await applyJsonPatch(object, invalidPatch).catch(e => 1)
    expect(reject).to.equal(1)
  })
})
