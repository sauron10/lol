const config = {
  headers : {
    "X-Riot-Token": "RGAPI-c23b8b9c-b744-4c6c-be82-4849d31f2a41",
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
