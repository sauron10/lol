import { useEffect, useState } from "react"

export const useWindowDimensions = () => {
  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  

  useEffect(() => {
    window.addEventListener('resize', () => setWindowDimensions(getWindowDimensions))
    return (() => window.removeEventListener('resize', () => setWindowDimensions(getWindowDimensions)))


  }, [])

  

  return windowDimensions

}