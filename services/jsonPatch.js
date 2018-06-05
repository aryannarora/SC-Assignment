/**
 * Micro-service to apply Json patch to the given JSON object.
 * Requests with invalid patches will be rejected with Error.
 */

import jp from 'jsonpatch'

module.exports.applyJsonPatch = async (obj, patch) => {
  return new Promise((resolve, reject) => {
    const patchedObj = jp.apply_patch(obj, patch)

    if (patchedObj) resolve(patchedObj)

    // Rejects for invalid patches
    reject(new Error(`Couldn't apply Patch`))
  })
}
