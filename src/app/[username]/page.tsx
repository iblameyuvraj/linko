"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import NextLink from "next/link"
import Avvvatars from "avvvatars-react"
import { getSupabaseClient } from "@/lib/supabase"
import { Github, Dribbble, Linkedin, Globe, Codepen, Instagram, Facebook, Copy, Check } from "lucide-react"

interface Link {
  id: string
  title: string
  url: string
}

interface SocialLink {
  platform: string
  url: string
}

interface UserData {
  bio: string
  links: Link[]
  socialLinks: SocialLink[]
}

interface UserProfileProps {
  params: {
    username: string
  }
}

export default function UserProfile({ params }: UserProfileProps) {
  const { username } = params
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userExists, setUserExists] = useState(true)
  const [copied, setCopied] = useState(false)

  const profileUrl = `https://linko.zentha.in/${username}`

  useEffect(() => {
    loadUserProfile()
  }, [username]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${username}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setUserExists(false)
          return
        }
        throw new Error('Failed to fetch user profile')
      }

      const userData = await response.json()
      setUserData(userData)
    } catch (error) {
      console.error("Error loading user profile:", error)
      setUserExists(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Lordicon loader */}
        <lord-icon
          src="https://cdn.lordicon.com/egiwmiit.json"
          trigger="loop"
          colors="primary:#a5e830"
          style={{ width: 100, height: 100 }}
        />
      </div>
    )
  }

  if (!userExists || !userData) {
    notFound()
  }

  return (
    <div className="min-h-screen p-4 bg-black">
      {/* Top Logo */}
      <header className="py-4 lg:py-8">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <svg
            viewBox="0 0 370 99.51387157577669"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-auto md:h-8"
            role="img"
            aria-label="Layer logo"
          >
            <defs></defs>
            <g
              transform="matrix(3.115100622177124,0,0,3.115100622177124,0.15838625897268133,0.0965715165747583)"
              fill="#89F363"
            >
              <path d="M24.5-.031c-1.918.001-3.808.714-5.25 2.156l-3.906 3.906 2.125 2.125 3.906-3.906c1.716-1.716 4.546-1.721 6.375.031 1.779 1.704 1.737 4.499 0 6.344-.01.011-.021.02-.031.031l-6.969 6.969c-1.716 1.716-4.577 1.753-6.406 0l-2.094 2.156c2.971 2.847 7.741 2.853 10.625-.031l7-7c2.832-2.955 2.98-7.74-.031-10.625-1.486-1.424-3.426-2.157-5.344-2.156zm-10.094 10c-1.918.001-3.839.714-5.281 2.156l-7 7a1.5 1.5 0 0 0 0 .031c-2.832 2.955-2.98 7.74.031 10.625 2.971 2.847 7.71 2.853 10.594-.031l4-4-2.125-2.125-4 4c-1.716 1.716-4.546 1.753-6.375 0-1.789-1.715-1.737-4.53.031-6.375l6.969-7c1.716-1.716 4.577-1.721 6.406.031l2.094-2.156c-1.486-1.424-3.426-2.157-5.344-2.156z"></path>
            </g>
            <g
              transform="matrix(2.843494176864624,0,0,2.843494176864624,113.4030930960573,-23.529569111017587)"
              fill="#FFFFFF"
            >
              <path d="M8 11.440000000000001 l0 28.56 l-5.68 0 l0 -28.56 l5.68 0 z M18.32 11.440000000000001 l0 4.68 l-5.68 0 l0 -4.68 l5.68 0 z M18.32 19.32 l0 20.68 l-5.68 0 l0 -20.68 l5.68 0 z M34.68 18.76 c2.64 0 4.5532 0.66676 5.74 2.0001 s1.78 3.4533 1.78 6.36 l0 12.88 l-5.68 0 l0 -11.72 c0 -1.7067 -0.27332 -2.9734 -0.82 -3.8 s-1.4867 -1.24 -2.82 -1.24 c-1.5467 0 -2.6667 0.46668 -3.36 1.4 s-1.04 2.4666 -1.04 4.6 l0 10.76 l-5.68 0 l0 -20.68 l5.4 0 l0 2.88 l0.12 0 c1.4133 -2.2933 3.5333 -3.44 6.36 -3.44 z M52.72 11.440000000000001 l0 15.32 l7.16 -7.44 l6.72 0 l-7.8 7.6 l8.68 13.08 l-6.88 0 l-5.68 -9.24 l-2.2 2.12 l0 7.12 l-5.68 0 l0 -28.56 l5.68 0 z M79.52 18.76 c3.3067 0 5.92 1.0067 7.84 3.02 s2.88 4.6468 2.88 7.9 c0 3.28 -0.98 5.9132 -2.94 7.9 s-4.5532 2.98 -7.78 2.98 c-3.28 0 -5.88 -1.0067 -7.8 -3.02 s-2.88 -4.6332 -2.88 -7.86 c0 -3.3333 0.98 -5.9868 2.94 -7.96 s4.54 -2.96 7.74 -2.96 z M74.52 29.68 c0 2.1067 0.42668 3.7333 1.28 4.88 s2.0933 1.72 3.72 1.72 c1.68 0 2.94 -0.58668 3.78 -1.76 s1.26 -2.7866 1.26 -4.84 c0 -2.1333 -0.43332 -3.7733 -1.3 -4.92 s-2.1267 -1.72 -3.78 -1.72 c-1.6 0 -2.8267 0.57332 -3.68 1.72 s-1.28 2.7867 -1.28 4.92 z"></path>
            </g>
          </svg>
        </div>
      </header>
      {/* Profile Section */}
      <div className="max-w-md mx-auto text-center mb-8 pt-12">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Avvvatars style="shape" value={username} size={80} />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-white">@{username}</h2>
          <button
            onClick={handleCopy}
            aria-label="Copy profile link"
            className="inline-flex items-center justify-center rounded-full p-2 bg-transparent text-white"
            title={profileUrl}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4 animate-pulse" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mb-6">
          <span className="text-white">{userData.bio}</span>
        </div>

        {/* Social Icons */}
        {userData.socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            {userData.socialLinks.map((social: SocialLink) => {
              const platformIcons = [
                { name: "Github", icon: Github },
                { name: "Dribbble", icon: Dribbble },
                { name: "Linkedin", icon: Linkedin },
                { name: "Instagram", icon: Instagram },
                { name: "Facebook", icon: Facebook },
                { name: "Globe", icon: Globe },
                { name: "Codepen", icon: Codepen },
              ]
              const IconComponent = platformIcons.find(s => s.name === social.platform)?.icon || Globe
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* Featured Links Section */}
      {userData.links.length > 0 && (
        <div className="max-w-md mx-auto">
          <h3 className="text-sm font-medium uppercase tracking-wider text-center mb-6 text-white">Featured Links</h3>

          <div className="space-y-4">
            {userData.links.map((link: Link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-full border-2 border-gray-900 p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <Avvvatars style="shape" value={link.title} size={48} />
                </div>

                <div>
                  <div className="font-medium text-gray-900">{link.title}</div>
                  <div className="text-sm text-gray-600">{link.url}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <footer className="mt-12">
        <div className="max-w-md mx-auto flex justify-center">
          <NextLink
            href="https://linko.zentha.in/"
            className="inline-flex items-center justify-center rounded-full bg-lime-400 px-6 py-3 font-semibold text-black shadow-sm hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-400/60 focus:ring-offset-2 focus:ring-offset-black transition-colors"
          >
            Get your own
          </NextLink>
        </div>
      </footer>
    </div>
  )
}
