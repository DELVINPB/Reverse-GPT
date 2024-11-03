import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { input, userId } = req.body

  if (!input || !userId) {
    return res.status(400).json({ message: 'Input and userId are required' })
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Generate an inverse or opposite concept for the following input: "${input}". The response should be creative and thought-provoking, not just a simple antonym.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Store the query and response in Firestore
    const db = getFirestore()
    await addDoc(collection(db, 'history'), {
      userId,
      query: input,
      response: text,
      timestamp: Date.now()
    })

    res.status(200).json({ response: text })
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    res.status(500).json({ message: 'Error processing your request' })
  }
}