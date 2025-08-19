"use client"

import { useEffect, useMemo, useState } from "react"
import Button from "@/components/Button"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseClient(), [])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [username, setUsername] = useState<string>("")
  const [bio, setBio] = useState<string>("")
  const [links, setLinks] = useState<string[]>([])
  const [newLink, setNewLink] = useState<string>("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError(null)
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) {
        router.replace("/")
        return
      }

      // Derive username from fake email: username@gmail.com
      const email = user.email || ""
      const derivedUsername = email.includes("@") ? email.split("@")[0] : ""

      if (!mounted) return

      setUsername(derivedUsername)
      const meta = (user.user_metadata || {}) as { bio?: string; links?: string[] }
      setBio(meta.bio || "")
      setLinks(Array.isArray(meta.links) ? meta.links : [])
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [router, supabase])

  const handleAddLink = () => {
    const v = newLink.trim()
    if (!v) return
    setLinks((prev) => [...prev, v])
    setNewLink("")
  }

  const handleRemoveLink = (i: number) => {
    setLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { bio, links },
      })
      if (error) throw error
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const goLive = () => {
    if (username) router.push(`/${username}`)
  }

  if (loading) {
    return (
      <main className="container max-w-3xl mx-auto py-16 px-4">
        <p className="text-white/70">Loading dashboard…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 bg-black">
      {/* Header */}
      <header className="flex items-center justify-between max-w-md mx-auto mb-12">
        <h1 className="text-xl font-semibold text-white">linko</h1>
        <div className="flex items-center gap-3">
          {/* Back icon button */}
          <button
            className="rounded-full bg-gray-700 text-white hover:bg-gray-600 h-10 w-10 inline-flex items-center justify-center"
            onClick={goLive}
            aria-label="View live"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={goLive}
            className="bg-purple-400 hover:bg-purple-500 text-white rounded-full px-6 font-bold text-base h-10"
          >
            View live
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <div className="max-w-md mx-auto text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full grid place-items-center">
          <div className="w-8 h-8 bg-gray-800 rounded-sm rotate-45 relative">
            <div className="absolute inset-1 bg-purple-100 rounded-sm -rotate-45"></div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-white">@{username}</h2>
        <div className="flex items-center justify-center gap-1 mb-6">
          <span className="text-white">{bio || "Write your bio below and save"}</span>
          <span className="text-sm">👋</span>
        </div>
        {/* Social Icons */}
        <div className="flex items-center justify-center gap-6 mb-8 text-white/90">
          <button className="hover:text-white">Github</button>
          <button className="hover:text-white">Dribbble</button>
          <button className="hover:text-white">LinkedIn</button>
          <button className="hover:text-white">Website</button>
        </div>
      </div>

      {/* Featured Links Section (Preview style) */}
      <div className="max-w-md mx-auto">
        <h3 className="text-sm font-medium uppercase tracking-wider text-center mb-6 text-white">Featured Links</h3>
        <div className="space-y-4">
          {links.map((l, i) => (
            <div key={`${l}-${i}`} className="bg-white rounded-full border-2 border-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-500 rounded-sm flex items-center justify-center rotate-45">
                  <div className="w-3 h-3 bg-white -rotate-45"></div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 truncate max-w-[180px]">{new URL(l).hostname}</div>
                  <div className="text-sm text-gray-600 truncate max-w-[220px]">{l}</div>
                </div>
              </div>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => handleRemoveLink(i)}
                aria-label="Remove link"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add New Link Button */}
          <div className="bg-white rounded-full border-2 border-gray-900 p-6 flex items-center justify-center">
            <div className="flex w-full gap-2 max-w-sm">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://yourlink.com"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2"
              />
              <button
                onClick={handleAddLink}
                className="rounded-full px-4 py-2 bg-gray-900 text-white"
              >
                Add
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="bg-white rounded-full border-2 border-gray-900 p-6 flex items-center justify-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full px-6 py-2 bg-purple-400 hover:bg-purple-500 text-white font-bold"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
