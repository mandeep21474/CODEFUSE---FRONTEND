import React, { useEffect } from 'react'   
import './Plans.css'
import { PricingTable } from '@clerk/clerk-react' 
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'  
gsap.registerPlugin(ScrollTrigger)  
const Plans = () => {
    useEffect(()=>{
        gsap.from('.pricing-table', {
            duration: 2.5,
            y: 100,
            opacity: 0,
            // scale: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.pricing-table',
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                // scrub: true,
                // pin: true
            }
        })
    },[])
  return (

    <div className='plans'>
        <h2 className='landing-heading landing-h2 section-title'>CHOOSE YOUR PLAN</h2>
        <p className='landing-p'>Start for free and scale up with affordable pricing plans.</p>

        <div className='pricing-table'>
            <PricingTable/>
        </div>
        
    </div>
  )
}

export default Plans