export const vars = (() => {
  const dev = process.env.NODE_ENV === 'development'
  const vars =  {axiosConf:{validateStatus:status => status<500}}
  if(dev) return {...vars,route: 'http://localhost:8080',}
  return {...vars,route: '/api'} 
})()