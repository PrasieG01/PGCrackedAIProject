'use client' 

import { useState } from 'react'
import { createClient } from './utils/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function CaptionCard({ caption }: { caption: any }) {
  const router = useRouter()
  // 1. A state to hold our current reaction
  const [reaction, setReaction] = useState<{ type: 'up' | 'down', id: number } | null>(null)

  const captionText = caption.content || "No caption provided";
  const imageUrl = caption.images?.url || null;
  const captionId = caption.id;

  const handleVote = async (type: 'up' | 'down') => {
    const voteValue = type === 'up' ? 1 : -1;
    
    // UI Animations
    setReaction(null)
    setReaction({ type, id: Date.now() })
    setTimeout(() => setReaction(null), 1500)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert("You must be signed in to vote!")
      return
    }

    // Use .upsert() instead of .insert()
    // We tell Supabase which columns to check for uniqueness
    const { error } = await supabase
      .from('caption_votes')
      .upsert({
        caption_id: captionId,
        profile_id: user.id,
        vote_value: voteValue,
      }, { 
        onConflict: 'caption_id, profile_id' // This tells Supabase what a "duplicate" looks like
      })

    if (error) {
      console.error("Lab Error:", error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group">
      
      {/* 5. THE SLOWED-DOWN, TRANSPARENT REACTION ANIMATION */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            key={reaction.id}
            // Starts just below where it will float
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            // Animates UPwards, grows slightly, and fades in
            animate={{ 
              opacity: 1, 
              y: -40, 
              scale: 1.1,
              transition: { 
                type: 'spring', 
                stiffness: 120, 
                damping: 10, 
                duration: 0.6 
              }
            }}
            // Smoothly fades out when the 1.5 second timeout hits
            exit={{ 
                opacity: 0, 
                transition: { duration: 0.3 } 
            }}
            className="absolute bottom-[60px] left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`font-black text-3xl md:text-4xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] ${reaction.type === 'up' ? 'text-yellow-400' : 'text-blue-400'}`}>
              {reaction.type === 'up' ? '😂 +1' : '😐 -1'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-yellow-100 border-b-4 border-black p-3 font-bold uppercase text-black">
        {captionText}
      </div>

      <div className="flex-grow bg-gray-100 relative min-h-[250px] border-b-4 border-black">
        {imageUrl ? (
          <img src={imageUrl} alt="Comic Panel" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 font-bold uppercase p-4 text-center">
            Image Missing
          </div>
        )}
      </div>

      <div className="p-4 bg-orange-50 flex gap-4">
          <button 
            onClick={() => handleVote('up')}
            className="flex-1 bg-red-500 text-white border-4 border-black py-2 font-black text-xl tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:translate-y-2 active:shadow-inner transition-all"
          >
            👍 LIKE
          </button>
          
          <button 
            onClick={() => handleVote('down')}
            className="flex-1 bg-blue-600 text-white border-4 border-black py-2 font-black text-xl tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:translate-y-2 active:shadow-inner transition-all"
          >
            👎 DISLIKE
          </button>
      </div>
    </div>
  );
}