const cron = require('node-cron')
const Transmission = require('transmission')

const config = require('./config')
const { extractMagnetLinks } = require('./extractor')

const CRON_JOB = process.env.NODE_ENV === 'production'
  ? '0 */2 * * *' // every 2 hours
  : '* * * * *' // every minute

const transmission = new Transmission({
  host: config.transmission.host,
  port: config.transmission.port
})

transmission.session({
  'speed-limit-down': config.transmission.speedLimitDown,
  'speed-limit-down-enabled': !!config.transmission.speedLimitDown,
  'speed-limit-up': config.transmission.speedLimitUp,
  'speed-limit-up-enabled': !!config.transmission.speedLimitUp
}, function (err, arg) {
  console.error(err)
})

cron.schedule(CRON_JOB, async () => {
  const magnetLinks = await extractMagnetLinks()

  for (const link of magnetLinks) {
    transmission.addUrl(link, function (err, arg) {
      console.error(err)
    })
  }
})
