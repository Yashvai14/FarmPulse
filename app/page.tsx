import React from 'react'
import NavBar from '../components/navBar'
import Hero from '../components/hero'
import Feature from '../components/feature'
import Faq from '../components/Faq'
import Cta from '../components/Cta'
import Footer from '../components/footer'

const home = () => {
  return (
    <>
    <NavBar />
    <Hero />
    <Feature />
    <Faq />
    <Cta />
    <Footer />
    </>
  )
}

export default home