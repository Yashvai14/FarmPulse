import React from 'react'
import Image from 'next/image'

const navBar = () => {
  return (
    <nav className='flex justify-center items-center py-8 p-4'>
        <div className='flex justify-between shadow-xl py-4 px-6 rounded-4xl bg-white items-center' style={{width: '1200px'}}>
        <div>
            <Image src="/logo.png" alt="Logo" width={120} height={220} />
        </div>
        <ul className='flex space-x-4 text-[16px] font-semibold'>
            <a href="/features">
              <li className="hover:font-bold hover:text-gray-800 text-gray-600  transition-all duration-300">Features</li>
            </a>
            <a href="">
              <li className="hover:font-bold hover:text-gray-800 text-gray-600 transition-all duration-300">About</li>
            </a>
            <a href="">
              <li className="hover:font-bold hover:text-gray-800 text-gray-600 transition-all duration-300">Contact</li>
            </a>
        </ul>
        <div>
            <a href=""><button className='py-2 px-6 text-gray-800 font-bold bg-lime-400 rounded-3xl '>Login</button></a>
        </div>
        </div>
    </nav>
  )
}

export default navBar