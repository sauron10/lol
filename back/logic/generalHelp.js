
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

let waitLimit = async res =>{
  if(res.status !==200){
    if(res.status === 429){
        console.log('Retry after : ',res.headers['retry-after'])
        await delay(res.headers['retry-after']*1000)
      }

    if(res.status === 503){
      console.log('Service unavailable',res)
      await delay(5000)
      return true
    }

    if(res.status !==429){
      console.log('Error waiting 1 min',res)
      await delay(60000)
      return true
    }
    
    // console.log('Retry after : ',res.headers['retry-after'])
    // await delay(res.headers['retry-after']*1000)
    return true
  }
  return false
}

const countFn = fn => {
  const PERIOD = 120000
  const MAX = 98
  let counter = 0
  let twoMinCount = 0
  let firstTime = Date.now()
  let wait = 0


  return async (res) => {
    if(res.status === 429){
      console.log('Retry after : ',res.headers['retry-after'])
    }
    if (twoMinCount >= MAX) {
      wait = firstTime + PERIOD - Date.now()
      console.log(`Local delay of ${(wait/1000).toFixed(1)} seconds`)
      await delay(wait)
      wait = 0
    }
    if (Date.now() - firstTime > PERIOD){
      firstTime = Date.now()
      twoMinCount = 0
    }
    
    twoMinCount += 1
    console.log(`${fn.name} has been called ${counter += 1} times`)
    console.log({firstTime,twoMinCount})
    console.log(res.config.url)
    return await fn(res)
  }
  
}

const localTimer = () => {
  const PERIOD = 120000
  const MAX = 100
  let twoMinCount = 0
  let firstTime = Date.now()
  let wait = 0

  return async () => {
    if (twoMinCount >= MAX) {
      wait = firstTime + PERIOD - Date.now()
      console.log(`Local delay of ${(wait/1000).toFixed(1)} seconds`)
      await delay(wait)
      wait = 0
    }
    if (Date.now() - firstTime > PERIOD){
      firstTime = Date.now()
      twoMinCount = 0
    }    
    twoMinCount += 1
    console.log({firstTime,twoMinCount})
  }
}

const timer = localTimer()


module.exports = {
  toRegexUppercase,
  delay,
  isNumber,
  waitLimit,
  localTimer,
  timer,
}