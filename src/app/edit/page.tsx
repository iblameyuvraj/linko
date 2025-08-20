"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/Button"
import Modal from "@/components/Modal"
import { Github, Dribbble, Linkedin, Globe, Plus, Trash2, Codepen, Instagram, Facebook, Copy, Check, Edit2, Save, Mail, Ghost, Link2, Twitter, Youtube } from "lucide-react"
import Avvvatars from "avvvatars-react"
import { getSupabaseClient } from "@/lib/supabase"

interface Link {
  id: string
  title: string
  url: string
}

interface SocialLink {
  platform: string
  url: string
}

// Historical user metadata may contain extra fields (e.g., an `icon` function) which
// cannot be serialized. Define a loose type for what might be stored and pick only
// what we need.
type StoredSocialLink = Partial<SocialLink> & Record<string, unknown>

// Row shape for the profiles table
type ProfileRow = {
  id: string
  username: string | null
  bio: string | null
  links: Link[] | null
  social_links: StoredSocialLink[] | null
}

const socialIcons = [
  { name: "Github", icon: Github },
  { name: "Dribbble", icon: Dribbble },
  { name: "Linkedin", icon: Linkedin },
  { name: "Instagram", icon: Instagram },
  { name: "Facebook", icon: Facebook },
  { name: "Any URL", icon: Globe },
  { name: "Codepen", icon: Codepen },
  { name: "Email", icon: Mail },
  { name: "Pinterest", icon: Link2 },
  { name: "Snapchat", icon: Ghost },
  { name: "Twitter", icon: Twitter },
  { name: "Youtube", icon: Youtube },
]

export default function EditProfile() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("Enter bio")
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempBio, setTempBio] = useState("")
  const [links, setLinks] = useState<Link[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Modal states
  const [showAddLink, setShowAddLink] = useState(false)
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [selectedSocial, setSelectedSocial] = useState("")
  const [socialUrl, setSocialUrl] = useState("")
  
  // Copy states
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadUserData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserData = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) {
        router.replace("/")
        return
      }

      // Load from profiles table; create a default row if missing
      const email = user.email || ""
      const fallbackUsername = email.includes("@") ? email.split("@")[0] : ""

      const { data: existing, error: fetchErr } = await supabase
        .from('profiles')
        .select('id, username, bio, links, social_links')
        .eq('id', user.id)
        .maybeSingle()

      if (fetchErr) throw fetchErr

      if (!existing) {
        const initial = {
          id: user.id,
          username: fallbackUsername || user.user_metadata?.username || '',
          bio: 'Enter bio',
          links: [],
          social_links: [],
        }
        const { error: insertErr } = await supabase.from('profiles').insert(initial)
        if (insertErr) throw insertErr
        setUsername(initial.username)
        setBio(initial.bio)
        setLinks(initial.links)
        setSocialLinks([])
      } else {
        const row = existing as ProfileRow
        setUsername(row.username || fallbackUsername)
        setBio(row.bio || 'Enter bio')
        setLinks((row.links || []) as Link[])
        const storedSocial: StoredSocialLink[] = row.social_links || []
        setSocialLinks(storedSocial.map((s) => ({ platform: s.platform || '', url: s.url || '' })))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveUserData = async (payload?: { bio?: string; links?: Link[]; socialLinks?: SocialLink[] }) => {
    setSaving(true)
    try {
      const supabase = getSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) throw new Error('Not authenticated')

      const toSave = {
        id: user.id,
        username,
        bio: payload?.bio ?? bio,
        links: payload?.links ?? links,
        social_links: payload?.socialLinks ?? socialLinks,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(toSave, { onConflict: 'id' })
      if (error) throw error
    } catch (error) {
      console.error("Error saving user data:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleViewLive = () => {
    if (username) {
      window.open(`/${username}`, "_blank")
    }
  }

  const copyProfileLink = async () => {
    if (username) {
      const profileUrl = `${window.location.origin}/${username}`
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleBioEdit = () => {
    setTempBio(bio)
    setIsEditingBio(true)
  }

  const saveBio = async () => {
    const nextBio = tempBio
    setBio(nextBio)
    setIsEditingBio(false)
    await saveUserData({ bio: nextBio })
  }

  const cancelBioEdit = () => {
    setTempBio("")
    setIsEditingBio(false)
  }

  const addLink = async () => {
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      const newLink: Link = {
        id: Date.now().toString(),
        title: newLinkTitle.trim(),
        url: newLinkUrl.trim()
      }
      const nextLinks = [...links, newLink]
      setLinks(nextLinks)
      setNewLinkTitle("")
      setNewLinkUrl("")
      setShowAddLink(false)
      await saveUserData({ links: nextLinks })
    }
  }

  const removeLink = async (id: string) => {
    const nextLinks = links.filter(link => link.id !== id)
    setLinks(nextLinks)
    await saveUserData({ links: nextLinks })
  }

  const addSocialLink = async () => {
    if (selectedSocial && socialUrl.trim()) {
      const newSocialLink: SocialLink = {
        platform: selectedSocial,
        url: socialUrl.trim(),
      }
      const nextSocial = [...socialLinks, newSocialLink]
      setSocialLinks(nextSocial)
      setSelectedSocial("")
      setSocialUrl("")
      setShowSocialModal(false)
      await saveUserData({ socialLinks: nextSocial })
    }
  }

  const removeSocialLink = async (platform: string) => {
    const nextSocial = socialLinks.filter(link => link.platform !== platform)
    setSocialLinks(nextSocial)
    await saveUserData({ socialLinks: nextSocial })
  }

  const shareProfile = async () => {
    if (navigator.share && username) {
      try {
        await navigator.share({
          title: `@${username} - Linko Profile`,
          url: `${window.location.origin}/${username}`
        })
      } catch (error) {
        // Fallback to copy
        copyProfileLink()
      }
    } else {
      copyProfileLink()
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

  return (
    <div className="min-h-screen p-4 bg-black">
      {/* Header */}
      <header className="flex items-center justify-between max-w-md mx-auto mb-12">

        <h1 className="text-xl font-semibold text-white">
          <svg
            viewBox="0 0 370 99.51387157577669"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-auto md:h-8"
            role="img"
            aria-label="Linko logo"
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
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="border h-12 w-12 rounded-full flex items-center justify-center bg-lime-400 text-black hover:bg-lime-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
          </button>
          <Button
            size="sm"
            className="whitespace-nowrap"
            variant="primary"
            onClick={handleViewLive}
          >
            View Live
          </Button>
        </div>
      </header>

      {/* Profile Section */}
      <div className="max-w-md mx-auto text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Avvvatars style="shape" value={username} size={80} />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-white">@{username}</h2>
          <button
            onClick={copyProfileLink}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mb-6">
          {isEditingBio ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full bg-gray-900/70 text-gray-100 placeholder-gray-400 px-3 py-2 rounded-lg text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
              <button onClick={saveBio} className="text-lime-400 hover:text-lime-300">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={cancelBioEdit} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-white">{bio}</span>
              <button onClick={handleBioEdit} className="text-gray-400 hover:text-white">
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {socialLinks.map((social) => {
            const IconComponent = socialIcons.find(s => s.name === social.platform)?.icon || Globe
            return (
              <div key={social.platform} className="relative group">
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </a>
                <button
                  onClick={() => removeSocialLink(social.platform)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            )
          })}
          <button
            onClick={() => setShowSocialModal(true)}
            className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors border-2 border-dashed border-gray-600"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Featured Links Section */}
      <div className="max-w-md mx-auto">
        <h3 className="text-sm font-medium uppercase tracking-wider text-center mb-6 text-white">Featured Links</h3>

        <div className="space-y-4">
          {/* Dynamic Links */}
          {links.map((link) => (
            <div key={link.id} className="bg-white rounded-full border-2 border-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 flex items-center justify-center">
                  <Avvvatars style="shape" value={link.title} size={48} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{link.title}</div>
                  <div className="text-sm text-gray-600">{link.url}</div>
                </div>
              </div>
              <button
                onClick={() => removeLink(link.id)}
                className="text-gray-400 hover:text-red-600 h-10 w-10 p-0 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add New Link Button */}
          <div
            className="bg-lime-400 rounded-full border-2 border-gray-900 p-6 flex items-center justify-center hover:bg-lime-500 transition cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => setShowAddLink(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowAddLink(true);
              }
            }}
            aria-label="Add new link"
          >
            <Plus className="w-6 h-6 text-black" />
          </div>

          {/* Share Link Button */}
          <div
            className="bg-lime-400 rounded-full border-2 border-gray-900 p-6 flex items-center justify-center hover:bg-lime-500 transition cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={shareProfile}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                shareProfile();
              }
            }}
            aria-label="Share profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round">
              <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Add Link Modal */}
      <Modal isOpen={showAddLink} onClose={() => setShowAddLink(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Add New Link</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                placeholder="Enter link title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                placeholder="https://example.com"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={addLink} variant="primary" className="flex-1">
                Add Link
              </Button>
              <Button onClick={() => setShowAddLink(false)} variant="secondary" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Social Modal */}
      <Modal isOpen={showSocialModal} onClose={() => setShowSocialModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Add Social Link</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {socialIcons.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <button
                      key={social.name}
                      onClick={() => setSelectedSocial(social.name)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedSocial === social.name
                          ? 'border-lime-400 bg-lime-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <IconComponent className="w-6 h-6 text-white mx-auto" />
                      <div className="text-xs text-gray-300 mt-1">{social.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
              <input
                type="url"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                placeholder="Enter URL"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={addSocialLink} variant="primary" className="flex-1">
                Add Social
              </Button>
              <Button onClick={() => setShowSocialModal(false)} variant="secondary" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
