const path = require('path'),
express = require('express'),
fs = require('fs'),
app = express(), // creates a server with the express library
port = 8001 // port for server

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

// Left over from learning
app.get('/knock', (req, res) => {
  res.status(200).send({
    answer: true
  })
  console.log('there is a knock at the door')
})
// Sends the requested character JSON to the user
app.get('/js/campaigns/test/characters/PCs/:name', (req, res, next) => {
  var characterName = req.params.name
  res.sendFile(characterName, (err) => {
    if (err) {
      next(err)
    }
  })
})
// Saves a modified character sheet
app.use(express.json())
app.post('/save/character/:name', (req, res, next) => {
  var chrData = req.body
  var path2chr = path2site + '/js/campaigns/test/characters/PCs' + `/${chrData.characterName}.json` 
  fs.writeFile(
    path2chr, JSON.stringify(chrData), (err) => {
      if(err) {
        next(err)
      } else {
        res.status(200).send('has been saved')
        console.log(chrData.characterName + ' has been updated')
      }
    })
})
app.listen(
  port,
  () => {
    console.log(`Dance floor is at http://${results.en0[0]}:${port}`)
  }
)