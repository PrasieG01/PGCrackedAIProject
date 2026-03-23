export default function CaptionCard({ caption }: { caption: any }) {
  // 1. Pointing to the specific columns from Supabase tables
  const captionText = caption.content || "No caption provided";
  const imageUrl = caption.images?.url || null;

  return (
    <div className="flex flex-col border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      
      {/* The Narration Box (Caption) */}
      <div className="bg-yellow-100 border-b-4 border-black p-3 font-bold uppercase text-black">
        {captionText}
      </div>

      {/* The Art (Image) */}
      <div className="flex-grow bg-gray-100 relative min-h-[250px] border-b-4 border-black">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Comic Panel" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 font-bold uppercase p-4 text-center">
            Image Missing (or URL broken)
          </div>
        )}
      </div>

      {/* The Action Bar (Likes/Dislikes) */}
      <div className="p-4 bg-orange-50 flex gap-4">
        {/* Like Button */}
        <button className="flex-1 bg-red-500 text-white border-4 border-black py-2 font-black text-xl tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
          👍 LIKE
        </button>
        
        {/* Dislike Button */}
        <button className="flex-1 bg-blue-600 text-white border-4 border-black py-2 font-black text-xl tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
          👎 DISLIKE
        </button>
      </div>

    </div>
  );
}