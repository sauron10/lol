const config = {
  headers : {
    "X-Riot-Token": "RGAPI-5000d431-5d02-47bd-a2fb-24b94240c389",
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
