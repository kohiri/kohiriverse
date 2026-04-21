import { useState } from 'react';

const SocialsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const socials = [
    {
      name: 'INSTAGRAM',
      url: 'https://www.instagram.com/kohirii/?hl=en',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      )
    },
    {
      name: 'SPOTIFY',
      url: 'https://open.spotify.com/user/y362zx20mp4qo9oxmlhcy96os?si=0c50ba19e24f43b0',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12c3-1 6-1 8 0"></path><path d="M9 15c2.5-.5 5-.5 7 0"></path><path d="M7 9c4-1 8-1 11 0"></path></svg>
      )
    },
    {
      name: 'LINKEDIN',
      url: 'https://www.linkedin.com/in/kohiri-j-296391220/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      )
    }
  ];

  return (
    <>
      <div className="relative">
        {/* Hamburger Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex flex-col items-center justify-center w-10 h-10 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 active:scale-95 z-50 pointer-events-auto shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)]"
          aria-label="Socials Menu"
        >
          <div className={`w-4 h-0.5 mb-1 transition-all duration-300 ${isOpen ? 'bg-white rotate-45 translate-y-1.5' : 'bg-white/40 group-hover:bg-white'}`}></div>
          <div className={`w-4 h-0.5 mb-1 transition-all duration-300 ${isOpen ? 'opacity-0' : 'bg-white/40 group-hover:bg-white opacity-100'}`}></div>
          <div className={`w-4 h-0.5 transition-all duration-300 ${isOpen ? 'bg-white -rotate-45 -translate-y-1.5' : 'bg-white/40 group-hover:bg-white'}`}></div>
        </button>

        {/* Dropdown Menu */}
        <div 
          className={`absolute top-12 right-0 w-48 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 origin-top-right z-40 ${
            isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setShowAbout(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all group"
            >
              <div className="w-4 flex justify-center opacity-70 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <span>ABOUT ME</span>
            </button>

            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all group"
              >
                <div className="w-4 flex justify-center opacity-70 group-hover:opacity-100">
                  {social.icon}
                </div>
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* About Me Modal */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all duration-500 ${
          showAbout ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowAbout(false)}
        ></div>
        
        <div className={`relative max-w-lg w-full bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 scale-95 ${
          showAbout ? 'scale-100' : 'scale-95'
        }`}>
          <div className="p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-white text-3xl font-extralight tracking-[0.2em] uppercase">About Me</h2>
                <div className="w-12 h-0.5 bg-white/20"></div>
              </div>
              <button 
                onClick={() => setShowAbout(false)}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="space-y-6 text-white/70 text-sm font-light leading-relaxed tracking-wide max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
              <p className="text-white/90 font-normal">Hi, I’m Kohiri.</p>
              
              <p>
                This space is a small personal project I brought to life in a surprisingly short time, 
                mostly out of curiosity, a bit of obsession, and the need to create something that feels like mine. 
                It’s still evolving, still imperfect, and that’s kind of the point.
              </p>
              
              <p>
                Think of this website as my own little universe. A place where I collect the things I love the most 
                like music I keep coming back to and love exploring, sketches and art I create myself, 
                and photos I capture of the people I care about. It’s all the little things I genuinely enjoy, 
                gathered in one place.
              </p>
              
              <p>
                This isn’t meant to be polished or perfect. It’s just honest, personal, and always growing — just like me.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-6">
              {socials.map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-white transition-all transform hover:-translate-y-1"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
};

export default SocialsMenu;
