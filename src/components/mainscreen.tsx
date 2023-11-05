'use client'
import Map from "@/components/map";

export default function MainScreen() {
  const isBrowser = () => typeof window !== 'undefined'

  function scrollToTop() {
    if (!isBrowser()) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <>
      <div className="w-full h-full">
        <Map />
      </div>
      <div className="h-screen w-screen flex justify-center items-center flex-col gap-3">
        <p className="text-center text-4xl text-black">If you are viewing this page then you disable <br /> <span className="font-extrabold text-blue-600">'Use scroll to zoom in/out'</span></p>
        <button onClick={() => scrollToTop()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg">
          Back to top
        </button>
        
      </div>
    </>
  )
}