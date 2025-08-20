import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseClient } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username } = req.query

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' })
  }

  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('username, bio, links, social_links')
      .eq('username', username)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: 'User not found' })
    }

    const normalized = {
      bio: data.bio || 'hi',
      links: (data.links || []) as Array<{ id: string; title: string; url: string }>,
      socialLinks: ((data.social_links || []) as Array<{ platform?: string; url?: string }>).map(s => ({
        platform: s.platform || '',
        url: s.url || '',
      })),
    }

    res.status(200).json(normalized)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
