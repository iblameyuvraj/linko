import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseClient } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { username, password } = req.body || {}

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid payload. Expected { username, password }' })
    }

    const email = `${username}@gmail.com`

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({ email, password })

    const status = error?.status ?? 200
    return res.status(status).json({ data, error })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return res.status(500).json({ error: message })
  }
}
