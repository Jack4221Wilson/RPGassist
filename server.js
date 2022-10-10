const path = require('path')
const express = require('express')
const app = express() // creates a server with the express library
const port = 8001 // port for server

// path to static 'front end' client-side files
const path2site = path.join(__dirname, './clientSide')
app.use(express.static(path2site))

// 3126952310
// Gets comuputer's IP for local network use
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = {}
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
          if (!results[name]) {
              results[name] = [];
          }
          results[name].push(net.address);
      }
  }
}
app.listen(
  port,
  () => {
    console.log(`Dance floor is at http://${results.en0[0]}:${port}`)
  }
)
// Left over from learning
app.get('/knock', (req, res) => {
  res.status(200).send({
    answer: true
  })
  console.log('there is a knock at the door')
})
// Sends the requested character JSON to the user
app.get('/clientSide/js/campaigns/test/characters/PCs/:name', (req, res, next) => {
  var characterName = req.params.name
  res.status(200).sendFile(characterName, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', characterName)
    }
    console.log('Sent:', characterName)
  })
})
