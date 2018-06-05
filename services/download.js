/**
 * Micro-service to download the specified image on server and then return a 50 x 50 thumbnail
 * version of it. This service will reject invalid requests.
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import rp from 'request-promise'

module.exports.download = async (uri) => {
  return new Promise((resolve, reject) => {
    // Generates a random name for every image to download
    const randomName = parseInt(Date.now() + Math.random())
    const pth = path.join('downloaded_images', randomName.toString())

    // First, just make a lite head request to check if the URI is valid.
    rp.head(uri).then(res => {
      rp(uri).pipe(fs.createWriteStream(pth)).on('close', () => {
        // Resize the image using sharp and save as file, named output
        sharp(pth).resize(50, 50).max().toFile('output')
          .then(info => resolve(info.format))
          .catch(e => reject(e))
      })
    }).catch(e => reject(e))
  })
}
