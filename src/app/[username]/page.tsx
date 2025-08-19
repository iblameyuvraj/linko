"use client"

import { useState } from "react"
import { useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import Button from "@/components/Button"
import { useRouter } from "next/navigation"

interface PageProps {
  params: { username: string }
}

export default function UserPage({ params }: PageProps) {
  const { username } = params
  const router = useRouter()

  // Local state (later replace with Supabase fetch/save)
  const [bio, setBio] = useState("This is my personal paragraph ✨")
  const [links, setLinks] = useState<string[]>(["https://example.com"])
  const [newLink, setNewLink] = useState("")
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseClient()
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const u = data.user
      if (!u?.email) return
      const currentUsername = u.email.includes("@") ? u.email.split("@")[0] : ""
      const owner = currentUsername === username
      setIsOwner(owner)
      if (owner) {
        const meta = (u.user_metadata || {}) as { bio?: string; links?: string[] }
        if (typeof meta.bio === "string") setBio(meta.bio)
        if (Array.isArray(meta.links)) setLinks(meta.links)
      }
    })()
  }, [username])

  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      setLinks([...links, newLink.trim()])
      setNewLink("")
    }
  }

  return (
    <main className="container max-w-4xl mx-auto py-12 px-4">
      {/* Top Preview */}
      <section className="bg-gray-900/40 p-6 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-semibold">Welcome, {username}</h1>
        <p className="mt-4 text-white/70">{bio}</p>
      </section>

      {/* Owner hint */}
      {isOwner && (
        <section className="mt-6">
          <div className="flex items-center justify-between gap-3 bg-gray-900/40 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-white/70">
              You are viewing your public page. Edit your profile in the Dashboard.
            </p>
            <Button variant="primary" onClick={() => router.push("/dashboard")}>Edit in Dashboard</Button>
          </div>
        </section>
      )}

      {/* Links Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Your Links</h2>

        {/* Public page is read-only */}

        {/* Links list */}
        <ul className="mt-4 space-y-2">
          {links.map((link, i) => (
            <li key={i}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-lime-400"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
