const config = {
  headers : {
    "X-Riot-Token": process.env.X_RIOT_TOKEN,
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36",
  },
  validateStatus : function (status) {
    return true
  }
}

module.exports = {
  config,
}
