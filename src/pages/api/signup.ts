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

    if (error) {
      const errObj = error as unknown as { status?: number; message?: string; code?: string }
      const status = errObj?.status ?? 400
      const msg = (errObj?.message || '').toLowerCase()
      // Cover common variants: "User already registered", "already exists", "email address already in use",
      // duplicate key errors, or explicit 409/422 from backend policies
      const looksTaken =
        msg.includes('already') ||
        msg.includes('registered') ||
        msg.includes('exists') ||
        msg.includes('duplicate') ||
        msg.includes('taken') ||
        msg.includes('in use') ||
        errObj?.code === '23505'
      if ([400, 409, 422].includes(status) && looksTaken) {
        return res
          .status(409)
          .json({ error: { code: 'USERNAME_TAKEN', message: 'this username is already occupied' } })
      }
      return res
        .status(status ?? 500)
        .json({ error: { code: 'UNKNOWN', message: 'please refresh the website' } })
    }

    // Some Supabase responses may return no error but an empty identities array when the email already exists
    const identities = (data as unknown as { user?: { identities?: unknown[] } })?.user?.identities
    if (Array.isArray(identities) && identities.length === 0) {
      return res
        .status(409)
        .json({ error: { code: 'USERNAME_TAKEN', message: 'this username is already occupied' } })
    }

    return res.status(200).json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return res.status(500).json({ error: { code: 'UNKNOWN', message: 'please refresh the website', detail: message } })
  }
}
