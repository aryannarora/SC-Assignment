import express from 'express'
import jwt from 'jsonwebtoken'
import { login } from './services/login'
import { download } from './services/download'
import bunyan from 'bunyan'
import bodyParser from 'body-parser'
import { applyJsonPatch } from './services/jsonPatch'

const app = express()

require('dotenv').config()

// Bunyan logger setup
const log = bunyan.createLogger({
  name: 'App.js',
  serializers: {
    req: reqSerializer
  },
  streams: [
    {
      level: process.env.LOG_LEVEL,
      stream: process.stdout
    },
    {
      level: 'error',
      path: './logs/SC.log'  // log ERROR and above to a file
    }
  ] 
})

// serializer for Bunyan logger
function reqSerializer (req) {
  return {
    method: req.method,
    url: req.url,
    status: req.status,
    headers: req.headers
  }
}

// logger middleware
app.use((req, res, next) => {
  log.debug(reqSerializer(req))
  next()
})

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse application/json
app.use(bodyParser.json())

// middleware to block unauthorized requests
function verifyToken (req, res, next) {
  const authToken = req.headers['authorization']

  if (authToken) req.token = authToken.split(' ')[1]

  if (req.token) {
    next()
  } else {
    res.sendStatus(403)
  }
}

// Routes start from here
app.get('/', (req, res) => res.send(`Happy Day! Isn't it?`))

// Route to download the image and get a resized 50 x 50 thumbnail
app.post('/download', verifyToken, (req, res) => {
  jwt.verify(req.token, 'certificate', (err, decoded) => {
    if (err) {
      log.error(err)
      res.sendStatus(403)
    } else {
      download(req.body.image)
        .then((contentType) => {
          res.setHeader('Content-Type', `image/${contentType}`)
          res.download('./output')
        })
        .catch(e => {
          log.error(e)
          res.send(e)
        })
    }
  })
})

// Route for getting signed JWT
app.post('/login', (req, res) => {
  const uid = req.body.uid
  const pwd = req.body.pwd

  login(uid, pwd).then(jwt => {
    res.status(200).send({token: jwt})
  }).catch(e => {
    log.fatal(e)
    res.sendStatus(400)
  })
})

// Route to apply JSON patch to an Object
app.post('/patchify', verifyToken, (req, res) => {
  jwt.verify(req.token, 'certificate', (err, decoded) => {
    if (err) {
      log.error(err)
      res.sendStatus(403)
    } else {
      const jsonObj = req.body.json
      const patch = req.body.patch

      applyJsonPatch(jsonObj, patch)
        .then(patchedObj => res.send(patchedObj))
        .catch(e => {
          log.error(e)
          res.send(e)
        })
    }
  })
})
// Routes end

const port = process.env.PORT || 3000

// starting up the app
app.listen(port, () => log.info(`Server started at port: ${port}`))
