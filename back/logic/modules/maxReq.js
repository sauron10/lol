const numReq = (req,res,next) => {
  try{
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    next()
  }catch(e){
    console.log('Error counting the number of requests: ',e)
  }
}


module.exports = {
  numReq
}