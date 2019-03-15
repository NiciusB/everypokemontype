const fs = require('fs')
const Twit = require('twit')
const { generateImage } = require('./imageGenerator')

let keys
try {
  keys = JSON.parse(fs.readFileSync('keys.json'))
} catch (e) {
  console.error('keys.json is needed. Copy keys.example.json and fill the values')
  process.kill(1)
}

const T = new Twit({
  consumer_key:         keys.CONSUMER_KEY,
  consumer_secret:      keys.CONSUMER_SECRET,
  access_token:         keys.OAUTH_TOKEN,
  access_token_secret:  keys.OAUTH_TOKEN_SECRET,
  timeout_ms:           20 * 1000
})

function tweet (imgBuffer, typeName) {
  fs.writeFileSync('temp.png', imgBuffer)
  T.postMediaChunked({ file_path: 'temp.png' }, function (err, data, response) {
    fs.unlinkSync('temp.png')
    if (err) {
      console.error('[tweet] error uploading image: ', err)
      return
    }
    const mediaIdStr = data.media_id_string
    const altText = `Pokemon-styled rectangle with the text ${typeName}`
    const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (err) {
        console.error('[tweet] error creating metadata: ', err)
        return
      }
      const params = { status: typeName, media_ids: [mediaIdStr] }
      T.post('statuses/update', params, function (err, data, response) {
        if (err) console.error('[tweet] error tweeting: ', err)
      })
    })
  })  
}

const words = fs.readFileSync('words/list.txt').toString().split('\n')

function tick () {
  let progress
  if (fs.existsSync('progress.json')) progress = JSON.parse(fs.readFileSync('progress.json'))
  else progress = 0

  if (progress > words.length) {
    console.warn('Finished all words!!')
    return false
  }

  const word = words[progress]
  const imgData = generateImage(word)
  tweet(imgData, word)

  fs.writeFileSync('progress.json', progress + 1)
  setTimeout(tick, 60 * 1000)
}
setTimeout(tick, (Date.now() % 60) * 1000)
