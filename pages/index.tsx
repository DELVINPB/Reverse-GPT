import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/inverse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch inverse response')
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Error:', error)
      setResponse('An error occurred while processing your request.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
          Welcome to Inverse World
        </h1>
        {user ? (
          <>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex items-center border-b-2 border-purple-500 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your query..."
                  className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? 'Inverting...' : 'Invert'}
                </motion.button>
              </div>
            </form>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Inverse Response</h2>
                <p className="text-gray-600 dark:text-gray-400">{response}</p>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Please log in to use Inverse World</p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/login"
              className="inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </motion.a>
          </div>
        )}
      </div>
    </Layout>
  )
}