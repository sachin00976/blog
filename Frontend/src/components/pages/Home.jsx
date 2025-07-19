import React from 'react'
import { HeroSection } from '../miniComponents/index'
import { Helmet } from 'react-helmet-async'
function Home() {
  return (
    <>

      <div className='bg-[#2f0c5f] h-full'>
        <Helmet>
          <title>{`Home - ${import.meta.env.VITE_APP_NAME}`}</title>
        </Helmet>
        <HeroSection />
      </div>

    </>
  )
}

export default Home
