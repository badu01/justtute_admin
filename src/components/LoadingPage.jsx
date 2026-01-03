import React from 'react'
import PencilLoader from './PencilLoader'

function LoadingPage() {
  return (
    <div className='w-screen h-screen bg-white'>
        <center>
            <PencilLoader/>
        </center>
    </div>
  )
}

export default LoadingPage