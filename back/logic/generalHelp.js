
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

const isNumber = n => {}

const waitLimit = async res =>{
  if(res.status !==200){
    if(res.status !==429){
      console.log('Error waiting 1 min',res)
      await delay(60000)
      return true
    } 
    console.log('Retry after : ',res.headers['retry-after'])
    await delay(res.headers['retry-after']*1000)
    return true
  }
  return false
  
}


// const res =toRegexUppercase('But Her Lettuce ')
// console.log(res,'miau')

module.exports = {
  toRegexUppercase,
  delay,
  isNumber,
  waitLimit,
}