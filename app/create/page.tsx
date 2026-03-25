'use client'

import { useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { Bangers } from "next/font/google"
import Link from 'next/link'

const bangers = Bangers({ weight: "400", subsets: ["latin"] })

export default function CreatePage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const [status, setStatus] = useState("") 

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setResults([])

    try {
      setStatus("Grabbing ID Card")
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error("Not authenticated")

      setStatus("Opening the Front Door")
      const res1 = await fetch('https://api.almostcrackd.ai/pipeline/generate-presigned-url', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type })
      })
      const { presignedUrl, cdnUrl } = await res1.json()

      setStatus("Uploading Bio-Matter")
      await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })

      setStatus("Registering Specimen")
      const res3 = await fetch('https://api.almostcrackd.ai/pipeline/upload-image-from-url', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false })
      })
      const { imageId } = await res3.json()

      setStatus("Synthesizing Humor...")
      const res4 = await fetch('https://api.almostcrackd.ai/pipeline/generate-captions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId })
      })
      
      const captions = await res4.json()
      setResults(captions)
      setStatus("Success! 🏆")

    } catch (err) {
      console.error(err)
      setStatus("Experiment Exploded...Check Console.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-[#f0f0f0]" style={{ backgroundImage: 'radial-gradient(#ccc 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      <div className="max-w-2xl mx-auto bg-white border-8 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <h1 className={`${bangers.className} text-5xl text-red-600 mb-6 text-center underline italic`}>
          NEW JOKE GENERATOR
        </h1>

        {/* THE BACK BUTTON */}
        <Link href="/">
          <button className="mb-6 bg-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 group">
            <span className="text-2xl">⬅️</span>
            {/* FORCED BLACK TEXT */}
            <span className="text-black font-black uppercase tracking-widest text-lg">
              RETURN TO LAB
            </span>
          </button>
        </Link>

        <div className="border-4 border-dashed border-black p-10 text-center bg-yellow-50 mb-6">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="font-bold uppercase"
          />
        </div>

        <button 
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full bg-blue-500 text-white border-4 border-black py-4 font-black text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 active:translate-y-2 transition-all disabled:opacity-50"
        >
          {loading ? "ANALYZING IMAGE..." : "GENERATE HUMOR! 🚀"}
        </button>

        {results.length > 0 && (
  <div className="mt-8 space-y-4">
    <h2 className={`${bangers.className} text-4xl text-blue-600 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase`}>
      Results:
    </h2>
    
    {results.map((c: any) => (
      <div 
        key={c.id} 
        className="bg-orange-50 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 transition-colors"
      >
        {/* TEXT IS NOW SOLID BLACK AND BOLD */}
        <p className="text-black font-black text-xl uppercase leading-tight tracking-tight">
          "{c.content}"
        </p>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  )
}