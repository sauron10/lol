const connection = require('./connection')
const axios = require('axios').default

const miau = [1,2,3,4,5,6]

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


const as = async (arr) => {
  for (const num of arr){
    await delay(2000)
    console.log(num)
  }
}

const requests = async () => {
  const res = await axios.get('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/sauron10/na1',connection.config)
  // console.log(res.status)
  if (res.status !== 200){
    const data = res.data    
    return ([{'Header' : res.headers, ...data}])
  }
  return []
}

const callReq = async (n) => {
  for (let x=0;x<n;x++){
    const req = await requests()
    if (req.length > 0){
     return req
    }
  }
  return []
}

callReq(110).then((x) => console.log(x))
// requests()