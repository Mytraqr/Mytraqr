import React from 'react'
import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-6 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-block">
          Go back home
        </Link>
      </div>
    </div>
  )
} 