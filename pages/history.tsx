import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore'

interface HistoryItem {
  id: string
  query: string
  response: string
  timestamp: number
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const db = getFirestore()
        const historyRef = collection(db, 'history')
        const q = query(
          historyRef,
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const historyData: HistoryItem[] = []
        querySnapshot.forEach((doc) => {
          historyData.push({ id: doc.id, ...doc.data() } as HistoryItem)
        })
        setHistory(historyData)
      }
    }

    fetchHistory()
  }, [user])

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">Query History</h1>
        {history.length > 0 ? (
          <motion.ul className="space-y-4">
            {history.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.query}</p>
                    <p className="text-gray-600 dark:text-gray-400">{item.response}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No history found.</p>
        )}
      </div>
    </Layout>
  )
}