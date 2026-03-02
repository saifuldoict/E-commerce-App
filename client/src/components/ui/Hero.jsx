
import {  ArrowRight, Badge, Zap } from 'lucide-react'
import React from 'react'
import { Button } from './button'
import { useSelector } from 'react-redux'


const Hero = () => {
 const {user}=useSelector(store=>store.user)
  return (
    <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4'>
           <div className='grid md:grid-cols-2 gap-8 items-center'>
               <div>
                    <h1 className='text-4xl font-bold mb-4'>Latest Electronics at Best Prices</h1>
                    <p className='text-xl mb-6 text-blue-100'>Discover technology with deals on smartphones, laptops</p>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Button className="bg-white text-blue-600 hover:bg-gray-100">Shop Now</Button>
                        <Button variant='outline' className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent">View Deals</Button>
                    </div>
               </div>
               <div className='relative'>
                    <img src='/laptop.avif' className='rounded-lg shadow-2xl' alt='hero-image'/>
               </div>
           </div>
        </div>
    </div>
  )
}

export default Hero