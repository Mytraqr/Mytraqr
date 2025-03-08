import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-100">
      <Head>
        <title>MyTraqr - Track Your Golf Game</title>
        <meta name="description" content="Track your golf game like never before" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">MyTraqr</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth" className="px-4 py-2 rounded hover:bg-gray-100">Log In</Link>
            <Link href="/auth?isSignUp=true" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-32 text-white bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Track Your Golf Game Like Never Before</h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">MyTraqr helps you track every shot, analyze your performance, and improve your golf game with detailed statistics and insights.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth?role=player&isSignUp=true" className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition">I'm a Player</Link>
            <Link href="/auth?role=coach&isSignUp=true" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition">I'm a Coach</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose MyTraqr?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature cards */}
            <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
              <div className="text-green-600 text-4xl mb-4">
                <i className="fas fa-golf-ball"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Shot-by-Shot Tracking</h3>
              <p className="text-gray-600">Record every shot with details like club selection, distance, and result.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
              <div className="text-green-600 text-4xl mb-4">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Statistics</h3>
              <p className="text-gray-600">Get detailed insights into your performance with comprehensive stats.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
              <div className="text-green-600 text-4xl mb-4">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Coach Connection</h3>
              <p className="text-gray-600">Share your stats with your coach for personalized feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Elevate Your Golf Game?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">Join thousands of golfers who are using MyTraqr to track, analyze, and improve their performance.</p>
          <Link href="/auth?isSignUp=true" className="px-8 py-3 bg-white text-green-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">Get Started for Free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MyTraqr</h3>
              <p className="text-gray-400">The ultimate golf performance tracking app for players and coaches.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/auth" className="text-gray-400 hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white text-xl"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white text-xl"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 MyTraqr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 