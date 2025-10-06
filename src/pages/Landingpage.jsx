import React, { useEffect,useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'  
import './Landingpage.css'
import { RiGeminiFill } from "react-icons/ri";
import { FiCode } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion'
import RotatingText from '../components/Rotatingtext'
import Plans from '../components/Plans'

import {useLocation} from 'react-router-dom'

import { useNavigate } from 'react-router-dom'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)  


export default function LandingPage() {

    const navigate = useNavigate()
    const location = useLocation();
    const planref = useRef(null);

     const {user} = useUser();
    const {openSignIn} = useClerk();


    useEffect(() => {
        if(location.hash==='#plans'&&planref.current  ){
            planref.current.scrollIntoView({ behavior: 'smooth' })
        }
    },[location])
     
  useEffect(() => {
          if(location.hash==='#plans'&&planref.current  ){
        return;
    }

          window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Disable browser's scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    // Initialize animations and interactions
    initNavigation()
    initHeroAnimations()
    initScrollAnimations()
    initHoverEffects()


    initScrollProgress()
 
    // Set initial states
    setInitialStates()
    // Refresh ScrollTrigger on resize
    window.addEventListener('resize', ScrollTrigger.refresh)
    return () => {
      window.removeEventListener('resize', ScrollTrigger.refresh)
    }
  }, [])

  // All helper functions (setInitialStates, initNavigation, etc.)
  // are moved here from app.js exactly as-is.

  function setInitialStates() {
    gsap.set('.hero-headline-line', { y: 100, opacity: 0 })
    gsap.set('.hero-headline-line-top', { y: 100, opacity: 0 })
    gsap.set('.hero-subheadline', { y: 50, opacity: 0 })
    gsap.set('.hero-btn-primary', { y: 30, opacity: 0, scale: 0.9 })
    gsap.set('.code-preview', { y: 10, opacity: 0, scale: 0.9 })
    gsap.set('.section-title', { y: 50, opacity: 0 })
    gsap.set('.section-subtitle', { y: 30, opacity: 0 })
    gsap.set('.feature-card', { y: 80, opacity: 0 })
    gsap.set('.benefit-card', { y: 60, opacity: 0, scale: 0.9 })
    gsap.set('.code-line', { opacity: 0, x: -20 })
  }

  function initNavigation() {
    const navbar = document.getElementById('navbar')
    const navLinks = document.querySelectorAll('.nav-link')
    
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: navbar }
    })
    
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()
        const targetId = link.getAttribute('href').slice(1)
        const target = document.getElementById(targetId)
        if (target) {
          const offset = navbar.offsetHeight + 20
          const pos = target.offsetTop - offset
          
      
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: pos, autoKill: true },
            ease: 'power2.inOut'
          })
        }
      })
    })
 
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', () => {})
    })
  }
  

  function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.5 })
    gsap.to('.hero-background', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })

    tl.from('.hero-background', {
      duration: 1,
      height: 0,
      opacity: 0,
      ease: 'power2.out'
      
    })
    tl.from(".nav-brand .logo", {
      duration: 0.5,
      x: -15,
      opacity: 0,
      ease: 'power2.out'
    })
    tl.to('.hero-headline-line', {
      duration: 1,
      y: 0,
      opacity: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })
    tl.to('.hero-headline-line-top', {
      duration: 1,
      y: 0,
      opacity: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })
      .to(
        '.hero-subheadline',
        { duration: 0.8, y: 0, opacity: 1, ease: 'power2.out' },
        '-=0.5'
      )
      .to(
        ['.hero-btn-primary'],
        {
          duration: 0.6,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        },
        '-=0.3'
      )
      .to('.code-preview', {
        duration: 1,
        y: 0,
        opacity: 1,
        scale: 1,
        ease: 'power2.out'
      }, '-=0.8')
    gsap.to('.code-line', {
      duration: 0.5,
      opacity: 1,
      x: 0,
      stagger: 0.3,
      ease: 'power2.out',
      delay: 2
    })
    gsap.to('.code-preview', {
      y: -20,
      duration: 2.5,
      repeat: -1,
      yoyo: 1,
      ease: 'power1.inOut',
      delay: 2
    })


  }

  function initScrollAnimations() {
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.to(title, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      })
    })
    gsap.utils.toArray('.section-subtitle').forEach(sub => {
      gsap.to(sub, {
        duration: 0.6,
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: sub,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      })
    })
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      const isEven = i % 2 === 0
      const startX = isEven ? -100 : 100
      gsap.fromTo(
        card,
        { x: startX, y: 80, opacity: 0 },
        {
          duration: 0.8,
          x: 0,
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      const icon = card.querySelector('.feature-icon')
      if (icon) {
        card.addEventListener('mouseenter', () => {
          gsap.to(icon, { duration: 0.3, rotation: 5, scale: 1.05 })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(icon, { duration: 0.3, rotation: 0, scale: 1 })
        })
      }
    })
    ScrollTrigger.create({
      trigger: '.benefits-grid',
      start: 'top 80%',
      onEnter: () => {
        gsap.to('.benefit-card', {
          duration: 0.6,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          ease: 'back.out(1.7)'
        })
      }
    })
    ScrollTrigger.create({
      trigger: '.footer',
      start: 'top 95%',

      onEnter: () => {
        gsap.fromTo(
          '.footer-content > *',
          { y: 50, opacity: 0 },
          { duration: 2, y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' }
        )
      }
    })
    document.querySelectorAll('.benefit-metric').forEach(metric => {
      ScrollTrigger.create({
        trigger: metric,
        start: 'top 80%',
        onEnter: () => {
          const text = metric.textContent
          const num = parseInt(text.match(/\d+/)[0], 10)
          const suffix = text.replace(num, '')
          const counter = { value: 0 }
          gsap.to(counter, {
            duration: 2,
            value: num,
            ease: 'power2.out',
            onUpdate: () => {
              metric.textContent = Math.round(counter.value) + suffix
            }
          })
        }
      })
    })
  }

  function initHoverEffects() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { duration: 0.2, scale: 1.05, ease: 'power2.out' })
      })
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { duration: 0.2, scale: 1, ease: 'power2.out' })
      })
      btn.addEventListener('mousedown', () => {
        gsap.to(btn, { duration: 0.1, scale: 0.95, ease: 'power2.out' })
      })
      btn.addEventListener('mouseup', () => {
        gsap.to(btn, { duration: 0.1, scale: 1.05, ease: 'power2.out' })
      })
    })
    document
      .querySelectorAll('.feature-card, .benefit-card, .testimonial-card')
      .forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            duration: 0.3,
            y: -10,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            ease: 'power2.out'
          })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            duration: 0.3,
            y: 0,
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            ease: 'power2.out'
          })
        })
      })
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, { duration: 0.2, color: '#3b82f6', ease: 'power2.out' })
      })
      link.addEventListener('mouseleave', () => {
        gsap.to(link, { duration: 0.2, color: '#374151', ease: 'power2.out' })
      })
    })
    document.querySelectorAll('.social-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, { duration: 0.2, scale: 1.1, rotation: 5, ease: 'back.out(1.7)' })
      })
      link.addEventListener('mouseleave', () => {
        gsap.to(link, { duration: 0.2, scale: 1, rotation: 0, ease: 'back.out(1.7)' })
      })
    })
  }

 

  

  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => {
            gsap.set(progressBar, {
                width: (self.progress * 100) + '%'
            });
        }
    });
}



  const handlestartfusing=()=>{
    openSignIn({redirectUrl:'/home'})
    // navigate('/home')
  }

  return (

    <>
      <nav className="navbar" id="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <div className="nav-brand">
            
            <span className="logo"> <FiCode className='logo-icon' size={24} style={{color:"black"}} />CODEFUSE</span>
          </div>
          <div className="nav-cta">

            {user?<UserButton/>:<button onClick={openSignIn} className="btn btn--primary">Get Started</button>}
            
          </div>
        </div>
      </nav>

      <section className="hero landing-section" id="hero" role="banner">
        <div className="hero-background" />
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-headline landing-heading landing-h1">
              {/* <span className="hero-headline-line">Code Collaboratively</span>
              <span className="hero-headline-line">with AI Intelligence</span> */}

              {/*  */}

         
              <span className="hero-headline-line-top"><h2>Code</h2></span>
              <RotatingText   className="px-2 py-1 bg-cyan-300 text-black rounded-lg hero-headline-line" 
  texts={['Collaborate','with','AI Intelligence']}
  interval={3300}

/>




              {/*  */}
            </h1>
            <p className="hero-subheadline landing-p">
              Transform your development workflow with real-time collaboration powered by artificial intelligence
            </p>
            <div className="hero-cta">
              <button className="btn btn--primary btn--lg hero-btn-primary" onClick={()=>{user?navigate('/home'):handlestartfusing()}}>Start Fusing</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-preview">
              <div className="code-header">
                <div className="code-dots">
                  <span className="dot dot--red" />
                  <span className="dot dot--yellow" />
                  <span className="dot dot--green" />
                </div>
                <span className="code-title">main.js</span>
              </div>
              <div className="code-content">
                {['const editor = new CODEFUSE({',
                  '  aiAssistance: true,',
                  '  realTimeSync: true,',
                  '  smartDebugging: true',
                  '});'
                ].map((line, i) => (
                  <div key={i} className="code-line">
                    <span className="line-number">{i + 1}</span>
                    <span className="code-text">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features landing-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title landing-heading landing-h2">Powerful Features for Modern Development</h2>
            <p className="section-subtitle landing-p">Everything you need to build better code, faster</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '🤖', title: 'AI-Powered Code Assistance', desc: 'Code generation, Bug detection and optimization suggestions' },
              { icon: '👥', title: 'Real-Time Collaboration', desc: 'Work together seamlessly with your team, wherever they are, with instant updates' },
              { icon: '🔍', title: 'Smart Code Review', desc: 'AI-assisted code reviews that catch issues before deployment and suggest best practices' },
              {icon:'📝',title:'Generate Documentation',desc:'Generate documentation for your code with AI-powered code documentation generation'},
              { icon: '💻', title: 'Multi-Language Support', desc: 'Support for 5+ programming languages with intelligent syntax highlighting' },
              { icon: '🐛', title: 'Advanced Debugging', desc: 'AI-powered debugging that identifies root causes instantly and suggests optimal solutions' },
              {icon:'🚀',title:'Live Execution',desc:'Run your code in real-time and see the results in real-time'}
            ].map((f, idx) => (
              <article
                key={idx}
                className={`feature-card ${idx % 2 === 1 ? 'feature-card--right' : 'feature-card--left'}`}
              >
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-content">
                  <h3 className="feature-title landing-heading landing-h3">{f.title}</h3>
                  <p className="feature-description landing-p">{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="benefits landing-section" id="benefits">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title landing-heading landing-h2">Measurable Results That Matter</h2>
          </div>
          <div className="benefits-grid">
            {[
              { metric: '3x', title: 'Increase Development Speed' },
              { metric: '80%', title: 'Reduce Bugs' },
              { metric: '100%', title: 'Collaborate Effortlessly' },
              { metric: '5x', title: 'Scale Team Productivity' }
            ].map((b, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-metric">{b.metric}</div>
                <h3 className="benefit-title landing-heading landing-h3">{b.title}</h3>
                <p className="benefit-description landing-p">{b.title === 'Reduce Bugs' ? 'Smart detection catches issues before they happen' : 'AI assistance accelerates your coding workflow'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='plans landing-section' id='plans' ref={planref}>
        <Plans/>
      </section>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">CODEFUSE</div>
              <p className="footer-description landing-p">
                Transform your development workflow with AI-powered collaboration
              </p>  
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright landing-p">
              © 2025 CODEFUSE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  
  )
}
