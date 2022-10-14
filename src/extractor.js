const axios = require('axios')
const { JSDOM } = require('jsdom')
const parseTorrent = require('parse-torrent')

const config = require('./config')

const BASE_URL = (() => {
  const url = new URL(config.linuxtracker.url)
  return url.protocol + '//' + url.hostname
})()

module.exports.extractMagnetLinks = async () => {
  const html = await axios(config.linuxtracker.url).then(res => res.data)
  const document = new JSDOM(html).window.document

  const tableTitles = document.querySelectorAll('.block .block-head .block-head-title')
  const bestSeedersTitle = [...tableTitles].find(title => title.innerHTML === config.linuxtracker.table)
  const bestSeedersParent = bestSeedersTitle.closest('.block')
  const bestSeedersLinks = bestSeedersParent.querySelectorAll('.lista a[href]')

  const urls = [...bestSeedersLinks]
    .map(row => row.getAttribute('href'))
    .map(path => BASE_URL + '/' + path)

  console.log({ urls })

  const detailsPages = await Promise.all(urls.map(url => axios(url).then(res => res.data)))
    .catch(err => console.error(err))
  const torrentPageUrls = detailsPages
    .map(page => new JSDOM(page).window.document)
    .map(doc => [...doc.querySelectorAll('td.header')].find(td => td.innerHTML === 'Torrent'))
    .map(torrentRow => torrentRow.parentElement)
    .map(torrentRowParent => torrentRowParent.querySelector('.lista a[href]'))
    .map(torrentLink => torrentLink.getAttribute('href'))
    .map(href => BASE_URL + '/' + href)

  console.log({ torrentPageUrls })

  const torrentPages = await Promise.all(torrentPageUrls.map(url => axios(url).then(res => res.data)))
    .catch(err => console.error(err))
  const torrentFileUrls = torrentPages
    .map(page => new JSDOM(page).window.document)
    .map(doc => [...doc.querySelectorAll('a b')].find(b => b.innerHTML.includes('Download Torrent File Now')))
    .map(torrentTitle => torrentTitle.parentElement)
    .map(torrentLink => torrentLink.getAttribute('href'))
    .map(href => BASE_URL + '/' + href)

  console.log({ torrentFileUrls })

  const torrentFiles = await Promise.all(torrentFileUrls.map(url => axios({ url, responseType: 'arraybuffer' }).then(res => res.data)))
    .catch(err => console.error(err))
  const magnetLinks = torrentFiles
    .map(buffer => parseTorrent(buffer))
    .map(parsed => parseTorrent.toMagnetURI(parsed))

  console.log({ magnetLinks })

  return magnetLinks
}
