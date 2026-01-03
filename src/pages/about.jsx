import React from 'react'

function About() {
  return (
    <div className="w-full h-full flex bg-blue-400">

      {/* Left Sidebar */}
      <div className="w-32 h-full relative border-r border-black overflow-visible flex items-center justify-center">
        <h1 className="leading-0 -rotate-90 origin-left absolute left-10 bottom-0 whitespace-nowrap text-7xl font-bold">
          badu
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h2 className="text-white text-2xl font-semibold">Main Content</h2>
        <p className="text-white">Your content goes here...</p>
      </div>

    </div>
  )
}

export default About
