// import { redirect } from 'next/navigation'

// export default function Home() {
//   redirect('/dashboard')
// }

import { createClient } from './utils/supabase/server'
import CaptionCard from "./CaptionCard";
import { Indie_Flower } from "next/font/google";
import { redirect } from 'next/navigation'

const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] });

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Use the new secure server client
  const supabase = await createClient()

  // 2. Check who is logged in 
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Fetch captions
  const { data: captions, error: captionsError } = await supabase.from("captions").select("*");

  // 4. Logout Logic
  const handleLogout = async () => {
    'use server'
    const supabaseServer = await createClient()
    await supabaseServer.auth.signOut()
    redirect('/login')
  }

  if (captionsError) {
    return (
      <div className="p-8 text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error fetching data</h1>
        {captionsError && <p>Captions Error: {captionsError.message}</p>}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8 bg-[#fafafa]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' dy='.35em' fill-opacity='0.1'%3E😂%3C/text%3E%3C/svg%3E")`,
      }}
    >
      {/* Tiny Header showing the user and a logout button */}
      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <form action={handleLogout}>
          <button type="submit" className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition">
            Sign Out ({user?.email})
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className={`${indieFlower.className} text-5xl font-bold mb-10 text-center text-gray-800 drop-shadow-sm`}>
          "I don't need therapy, I just need more captions"
        </h1>

        {!captions || captions.length === 0 ? (
          <p className="text-gray-500 italic text-center">No captions found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {captions.map((caption: any) => (
              <CaptionCard
                key={caption.id}
                caption={caption}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}