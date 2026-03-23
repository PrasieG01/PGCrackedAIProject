'use client'

import { createClient } from '../utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    // This triggers the Google OAuth flow
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        //No extra query parameters here
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Assignment 3: Auth</h1>
      <button 
        onClick={handleGoogleLogin}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  )
}