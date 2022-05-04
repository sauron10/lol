const miau = [1,2,3,4,5,6]

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


const as = async (arr) => {
  for (const num of arr){
    await delay(2000)
    console.log(num)
  }
}

as(miau)