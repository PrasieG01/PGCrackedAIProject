import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'
import { Bangers } from "next/font/google";
import { headers } from 'next/headers'

// Load the Comic Book Font
const bangers = Bangers({ weight: "400", subsets: ["latin"] });

export default async function LoginPage() {
  
  // This Server Action securely handles the Google redirect
  const signInWithGoogle = async () => {
    'use server'
    const supabase = await createClient()
    
    // This dynamically figures out if I'm  on localhost or Vercel
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'http'
    const origin = `${protocol}://${host}`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (data?.url) {
      redirect(data.url)
    }
  }

  return (
    // Halftone comic book background
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f0f0]" style={{ backgroundImage: 'radial-gradient(#ccc 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      
      {/* The Main Comic Panel Card */}
      <div className="max-w-md w-full bg-white border-8 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative rotate-1">
        
        {/* Decorative Floating Elements */}
        <div className={`${bangers.className} absolute -top-6 -left-8 bg-yellow-300 text-black border-4 border-black px-4 py-1 text-2xl -rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
          POW!
        </div>
        <div className={`${bangers.className} absolute -bottom-6 -right-6 bg-cyan-300 text-black border-4 border-black px-4 py-1 text-2xl rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
          ZAP!
        </div>

        {/* Header */}
        <h1 className={`${bangers.className} text-6xl text-center text-red-600 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-widest mb-4`}>
          COMIC <br/> LAUGH LAB
        </h1>
        
        {/* Description */}
        <div className="bg-orange-50 border-4 border-black p-4 mb-8">
          <p className="text-center font-bold text-gray-800 text-lg uppercase leading-relaxed">
            Step into the laboratory! Rate the latest panels, vote on the funniest captions, and curate the ultimate comic collection.
          </p>
        </div>

        {/* The Animated Sign-In Button */}
        <form action={signInWithGoogle}>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white border-4 border-black py-4 font-black text-2xl tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex justify-center items-center gap-3"
          >
            <span>SIGN IN WITH GOOGLE</span>
            <span className="text-3xl">🚀</span>
          </button>
        </form>

      </div>
    </div>
  )
}