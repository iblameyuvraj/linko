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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Normalize known auth errors
      const errObj = error as unknown as { status?: number; message?: string }
      const msg = errObj?.message || ''
      if (errObj?.status === 400 || msg.toLowerCase().includes('invalid login')) {
        return res
          .status(401)
          .json({ error: { code: 'INVALID_CREDENTIALS', message: 'username and password is wrong please try again' } })
      }
      // Fallback unknown error
      return res
        .status(errObj?.status ?? 500)
        .json({ error: { code: 'UNKNOWN', message: 'please refresh the website' } })
    }

    return res.status(200).json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return res.status(500).json({ error: { code: 'UNKNOWN', message: 'please refresh the website', detail: message } })
  }
}
