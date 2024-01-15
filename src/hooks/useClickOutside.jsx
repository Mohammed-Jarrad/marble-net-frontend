import { useEffect, useRef } from "react"

const useClickOutside = (callback) => {
    const ref = useRef()
    
    useEffect(() => {
        const handler = e => {
            if (!ref.current.contains(e.target)) {
                callback()
            }
        }
        window.addEventListener('mousedown', handler)
        return () => window.removeEventListener('mousedown', handler)
    }, [])
    
  return { ref }
}

export default useClickOutside
