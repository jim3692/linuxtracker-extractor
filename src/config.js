module.exports = {
  linuxtracker: {
    url: 'https://linuxtracker.org/index.php?page=extra-stats',
    table: '10 Torrents Best Seeders (with minimum 5 seeders)'
  },
  transmission: {
    host: process.env.TRANSMISSION_SERVER ?? 'transmission',
    port: process.env.TRANSMISSION_PORT ?? 9091,
    speedLimitDown: (process.env.TRANSMISSION_SPEED_LIMIT_DOWN ?? 20000) - 0,
    speedLimitUp: (process.env.TRANSMISSION_SPEED_LIMIT_UP ?? 35000) - 0
  }
}
