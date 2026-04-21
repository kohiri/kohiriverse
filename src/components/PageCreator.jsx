import React, { useRef, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function PageCreator({ onPageAdded, onCancel }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#222222')
  const [brushSize, setBrushSize] = useState(3)
  const [text, setText] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Initialize canvas with a paper texture background or white
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f8f5f0' // Cream paper color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add subtle paper grain if possible, or just solid cream
    ctx.strokeStyle = '#e0dad0'
    for(let i=0; i<canvas.width; i+=4) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
  }, [])

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = e.nativeEvent
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(offsetX, offsetY)
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const addTextToCanvas = () => {
    if (!text) return
    const ctx = canvasRef.current.getContext('2d')
    ctx.font = '32px "Indie Flower", cursive'
    ctx.fillStyle = color
    // Random position for a "scrapbook" feel
    const x = 50 + Math.random() * 200
    const y = 80 + Math.random() * 300
    ctx.fillText(text, x, y)
    setText('')
  }

  const handleSave = async () => {
    setIsUploading(true)
    try {
      const canvas = canvasRef.current
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))
      
      const fileName = `page_${Date.now()}.jpg`
      
      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('scrapbook')
        .upload(fileName, blob)

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('scrapbook')
        .getPublicUrl(fileName)

      // 3. Save to DB
      const { error: dbError } = await supabase
        .from('scrapbook_pages')
        .insert([{ image_url: publicUrl }])

      if (dbError) throw dbError

      onPageAdded()
    } catch (err) {
      console.error('Error saving page:', err)
      alert(`Failed to save: ${err.message || err.error_description || JSON.stringify(err)}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-4xl w-full shadow-2xl flex flex-col gap-6">
        <div className="flex justify-between items-center">
            <h2 className="text-white text-3xl font-bold tracking-tight">Create Scrapbook Page</h2>
            <button 
                onClick={onCancel}
                className="text-zinc-500 hover:text-white transition-colors"
            >
                ✕ Close
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Canvas Area */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-inner border-4 border-zinc-700">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={800}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair w-full max-w-[450px] aspect-[3/4]"
                />
            </div>

            {/* Controls Area */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="space-y-4">
                    <label className="text-zinc-400 text-sm uppercase tracking-widest font-semibold">Tools</label>
                    <div className="flex gap-4 items-center">
                        <input 
                            type="color" 
                            value={color} 
                            onChange={(e) => setColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-2 border-zinc-700 overflow-hidden"
                        />
                        <div className="flex-1">
                            <input 
                                type="range" 
                                min="1" 
                                max="20" 
                                value={brushSize} 
                                onChange={(e) => setBrushSize(e.target.value)}
                                className="w-full accent-blue-500"
                            />
                            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                                <span>Thin</span>
                                <span>Thick</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-zinc-400 text-sm uppercase tracking-widest font-semibold">Add Text</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Type something..." 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Indie_Flower']"
                        />
                        <button 
                            onClick={addTextToCanvas}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold transition-all"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="mt-auto pt-8 border-t border-zinc-800 flex gap-4">
                    <button 
                        onClick={onCancel}
                        className="flex-1 px-6 py-4 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all"
                        disabled={isUploading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className={`flex-1 px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                            isUploading 
                            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500'
                        }`}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-500 border-t-white"></span>
                                Saving...
                            </>
                        ) : 'Save to Scrapbook'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
