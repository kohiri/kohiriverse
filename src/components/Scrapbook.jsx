import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import PageCreator from './PageCreator'

export default function Scrapbook() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [showCreator, setShowCreator] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('scrapbook_pages')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching pages:', error)
    } else {
      setPages(data || [])
    }
    setLoading(false)
  }

  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(c => c + 1)
  }

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(c => c - 1)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-blue-500"></div>
        <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs">Opening Book...</p>
      </div>
    )
  }

  if (!supabase) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-6 text-center max-w-md mx-auto">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-white text-xl font-bold">Supabase Not Connected</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The shared scrapbook requires a backend. Please follow the instructions in the 
          <span className="text-blue-400"> walkthrough.md</span> to add your Supabase URL and Key to 
          <code className="bg-zinc-800 px-1 rounded">supabaseClient.js</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-12 py-10">
      {/* Scrapbook Container */}
      <div className="relative group perspective-1000">
        {pages.length === 0 ? (
          <div className="w-[500px] h-[700px] bg-zinc-800 rounded-2xl border-4 border-dashed border-zinc-700 flex flex-col items-center justify-center p-12 text-center gap-6">
            <div className="text-6xl">📖</div>
            <h3 className="text-zinc-300 text-2xl font-bold">The Book starts here</h3>
            <p className="text-zinc-500">Capture the first page and leave your mark on the universe.</p>
            <button 
                onClick={() => setShowCreator(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20"
            >
                Create First Page
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            {/* Nav Left */}
            <button 
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`p-4 rounded-full bg-zinc-800 border border-zinc-700 text-white transition-all ${currentPage === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-zinc-700 shadow-xl'}`}
            >
                ←
            </button>

            {/* The Page */}
            <div className="relative w-[500px] h-[700px] bg-[#f8f5f0] shadow-[10px_10px_30px_rgba(0,0,0,0.5),-10px_-10px_30px_rgba(255,255,255,0.02)] rounded-sm border-l-[15px] border-zinc-900 overflow-hidden transform -rotate-1 transition-transform hover:rotate-0 duration-700">
                <img 
                    src={pages[currentPage].image_url} 
                    alt={`Page ${currentPage + 1}`}
                    className="w-full h-full object-cover mix-multiply"
                />
                <div className="absolute bottom-6 right-8 text-zinc-400 font-['Indie_Flower'] italic">
                    Page {currentPage + 1} of {pages.length}
                </div>
                
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>
            </div>

            {/* Nav Right */}
            <button 
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
                className={`p-4 rounded-full bg-zinc-800 border border-zinc-700 text-white transition-all ${currentPage === pages.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-zinc-700 shadow-xl'}`}
            >
                →
            </button>
          </div>
        )}

        {/* Global Toolbar */}
        <div className="flex gap-4 mt-8">
             <button 
                onClick={() => setShowCreator(true)}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-lg text-sm font-semibold tracking-wide border border-white/10 backdrop-blur-sm transition-all flex items-center gap-2"
            >
                ✏️ Add a Page
            </button>
            <button 
                onClick={fetchPages}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-lg text-sm font-semibold tracking-wide border border-white/10 backdrop-blur-sm transition-all"
            >
                🔄 Refresh
            </button>
        </div>
      </div>

      {showCreator && (
        <PageCreator 
            onCancel={() => setShowCreator(false)}
            onPageAdded={() => {
                setShowCreator(false)
                fetchPages()
            }}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .mix-multiply { mix-blend-mode: multiply; }
        .perspective-1000 { perspective: 1000px; }
      `}} />
    </div>
  )
}
