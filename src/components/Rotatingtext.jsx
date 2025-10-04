import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiGeminiFill } from "react-icons/ri";
import { gsap } from 'gsap'
import './Rotatingtext.css'
export default function RotatingText({
  texts = [],
  interval = 2000,
  className = ''
}) {
  const [index, setIndex] = useState(0)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length)
    }, interval)
    return () => clearInterval(id)
  }, [texts, interval])

    
  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={texts[index]}
          initial={{x : -100, y: '100%' }}
          animate={{ x : 0, y: 0 }}
          exit={{ x : 100, y: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        >
          { 
          
          texts[index] === "AI Intelligence"?
          <>
          <RiGeminiFill className='gemini-icon-landing' />
          {texts[index]}
          </>:
        texts[index]

        
       

          
          }
       

          
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
