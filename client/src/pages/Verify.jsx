import React from 'react'

const Verify = () => {
  return (
    <div className='relative w-full h-[780px] overflow-hidden'>
        <div className='min-h-screen flex items-center justify-center bg-green-200 px-6'>
            <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
                <h2 className='font-bold text-2xl text-green-600'>Check Your Email</h2>
                <p className='text-black/70'>We send you an email to verify your account. Please check and click verification</p>
            </div>
        </div>
    </div>
  )
}

export default Verify