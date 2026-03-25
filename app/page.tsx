import { createClient } from './utils/supabase/server'
import CaptionCard from "./CaptionCard";
import { Bangers } from "next/font/google";
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Load the Comic Book Font
const bangers = Bangers({ weight: "400", subsets: ["latin"] });

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // If there is an error or no user is found, kick them to login
  if (userError || !user) {
    redirect('/login')
    }

  // Grab everything from 'captions', PLUS the 'url' from the 'images' tablee
  const { data: captions, error: captionsError } = await supabase
    .from("captions")
    .select("*, images(url)");

  const handleLogout = async () => {
    'use server'
    const supabaseServer = await createClient()
    await supabaseServer.auth.signOut()
    redirect('/login')
  }

  if (captionsError) {
    return <div className="p-8 text-red-500 font-bold border-4 border-black m-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">Error: {captionsError.message}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0]" style={{ backgroundImage: 'radial-gradient(#ccc 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      
      {/* HEADER */}
      <header className="bg-white border-b-8 border-black p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className={`${bangers.className} text-5xl md:text-6xl text-red-600 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-widest`}>
          COMIC LAUGH LAB <span className="text-yellow-400">🚀</span>
        </h1>
        <form action={handleLogout}>
          <button type="submit" className="bg-white border-4 border-black px-4 py-2 font-bold uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
            <span className="hidden sm:inline">{user?.email}</span>
            <span className="bg-red-500 text-white px-2 py-1 border-2 border-black">SIGN OUT</span>
          </button>
        </form>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 flex flex-col gap-4">
          <h2 className={`${bangers.className} text-3xl tracking-wide uppercase mb-2`}>Dashboard</h2>
          
          <div className="bg-[#fff9c4] border-4 border-black p-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-3 transition-transform hover:-translate-y-1">
            <span className="text-black font-black uppercase tracking-widest text-lg">
              Daily Panels
            </span>
          </div>
          <div className="bg-[#ffccbc] border-4 border-black p-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-3 transition-transform hover:-translate-y-1">
            <span className="text-black font-black uppercase tracking-widest text-lg">
              My Favorites
            </span>
          </div>
          <Link href="/create">
            <div className="bg-[#c8e6c9] border-4 border-black p-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-3 transition-transform hover:-translate-y-1">
            <span className="text-black font-black uppercase tracking-widest text-lg">
              Submit a Comic
            </span>
          </div>
          </Link> 

        </aside>

        {/* COMIC GRID */}
        <main className="flex-1">
          {!captions || captions.length === 0 ? (
            <div className="bg-white border-4 border-black p-8 text-center font-bold text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              NO COMICS FOUND IN THE LAB!
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {captions.map((caption: any) => (
                <CaptionCard key={caption.id} caption={caption} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}