const admin = async (req,res,next) => {
  try{
    const regex = new RegExp('[/]admin[/].*')
    if(regex.test(req.originalUrl)){
      if(!req.userInfo.admin) throw 'Hmm you shouldnt be here, how weird'
      next()
      return
    }
    next()
  }catch(e){
    return res.status(401).json({ error: e })
  }
}

module.exports = {admin}