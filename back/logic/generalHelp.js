
const toRegexUppercase = s => {
  const sLs = [...s]
  return sLs.map((item) => {
    if (isLetter(item)){
      if (isUppercase(item)){
        return `[${item}${item.toLowerCase()}]`
      }
      return `[${item.toUpperCase()}${item}]`
    }
    return `${item}`
  }).join('')
  
}

const isLetter = c => {
  n = c.search("[A-z]")
  return n>=0
}

const isUppercase = c => {
  n = c.search("[A-Z]")
  return n>=0
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const isNumber = n => {

}


// const res =toRegexUppercase('sauron10')
// console.log(res)

module.exports = {
  toRegexUppercase,
  delay,
  isNumber
}