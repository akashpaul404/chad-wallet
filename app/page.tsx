import Image from "next/image";
import TokenBanner from "./components/TokenBanner";
import HeroButtons from "./components/HeroButtons";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-white/30 font-sans">
      
      {/* Navigation & Top Marquee */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
        <div className="w-full border-t border-white/5">
          <TokenBanner />
        </div>
      </div>

      {/* Hero Section — overflow-visible so QR dropdown is not clipped */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-visible">
        <Image 
          src="/assets/hero/earth.webp" 
          alt="Earth Background" 
          priority 
          quality={80} 
          fill 
          sizes="100vw" 
          className="object-cover pointer-events-none" 
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

        {/* Floating Astronaut */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="w-64 md:w-72 animate-float">
            <Image 
              src="/assets/astronaut/astronaut.webp" 
              alt="Astronaut" 
              priority 
              quality={80} 
              width={400} 
              height={500} 
              className="w-full h-auto object-contain drop-shadow-2xl mix-blend-screen" 
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 mt-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-[160px] font-bold tracking-tighter text-white mb-2 leading-none lowercase">
            chad
          </h1>
          <h2 className="text-2xl md:text-[40px] font-bold tracking-tight text-white drop-shadow-lg">
            where traders become legends.
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl font-medium drop-shadow-md">
            From memecoins to viral tokens, trade any crypto in seconds.
          </p>
          {/* Wrapped in high z-index so QR popover overlaps next section */}
          <div className="relative z-[200] mt-6">
            <HeroButtons />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative py-32 md:py-48 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full opacity-40"
            src="/assets/video/chadwallet.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="w-full max-w-[600px] mb-16 animate-[float_6s_ease-in-out_infinite]">
            <img src="/assets/flow/launch-4.png" alt="Trade anywhere" className="w-full h-auto object-contain drop-shadow-2xl" />
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            trade from anywhere,<br />never lose a beat.
          </h2>
          <p className="text-xl text-white/50 max-w-2xl font-medium">
            Create sub-accounts to manage your portfolio with laser focus.
          </p>
        </div>
      </section>

      {/* Desktop/Mobile Mockups Section */}
      <section className="py-20 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto bg-[#0a0a0c] rounded-[40px] p-8 md:p-16 border border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
          <img src="/assets/flow/portfolio-4.png" alt="Dashboard" className="w-full max-w-[1100px] h-auto object-contain relative z-10" />
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
              never miss out again
            </h2>
            <p className="text-xl text-white/50 font-medium">
              the only social-first trading app
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a0a0c] rounded-[32px] p-10 border border-white/5 flex flex-col transition-transform hover:-translate-y-2 duration-300">
              <span className="text-blue-500 text-xs font-bold mb-4 uppercase tracking-widest">Step 1</span>
              <h3 className="text-3xl font-semibold mb-10 tracking-tight leading-tight">become a legend, top the leaderboard</h3>
              <div className="mt-auto">
                <img src="/assets/flow/kol-4.png" alt="Leaderboard" className="w-full h-auto rounded-xl object-contain" />
              </div>
            </div>
            
            <div className="bg-[#0a0a0c] rounded-[32px] p-10 border border-white/5 flex flex-col transition-transform hover:-translate-y-2 duration-300">
              <span className="text-purple-500 text-xs font-bold mb-4 uppercase tracking-widest">Step 2</span>
              <h3 className="text-3xl font-semibold mb-10 tracking-tight leading-tight">discover and follow top traders</h3>
              <div className="mt-auto">
                <img src="/assets/flow/buy-sell-4.png" alt="Follow Traders" className="w-full h-auto rounded-xl object-contain" />
              </div>
            </div>
            
            <div className="bg-[#0a0a0c] rounded-[32px] p-10 border border-white/5 flex flex-col transition-transform hover:-translate-y-2 duration-300">
              <span className="text-emerald-500 text-xs font-bold mb-4 uppercase tracking-widest">Step 3</span>
              <h3 className="text-3xl font-semibold mb-10 tracking-tight leading-tight">real time notifications for what the best are buying</h3>
              <div className="mt-auto">
                <img src="/assets/flow/memecoin-4.png" alt="Notifications" className="w-full h-auto rounded-xl object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — clean, no spinning image */}
      <section className="py-40 px-6 relative flex flex-col items-center text-center min-h-[600px] justify-center bg-[#050505]">
        {/* Subtle radial glow instead of spinning image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full bg-[#606AF7]/10 blur-[150px]" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-tight">
            a trading app<br />for the rest of us
          </h2>
          <p className="text-xl md:text-2xl text-white/60 mb-12 font-medium">
            Join 500,000 traders making their mark on ChadWallet
          </p>
          <div className="relative z-[200]">
            <HeroButtons />
          </div>
        </div>
      </section>
      
      {/* Bottom Marquee */}
      <div className="w-full border-t border-white/5 py-4 bg-[#050505]">
        <TokenBanner />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            {/* Brand */}
            <div className="flex flex-col gap-4 max-w-xs">
              <span className="text-2xl font-bold tracking-tighter text-white">ChadWallet</span>
              <p className="text-white/40 text-sm leading-relaxed">
                The social-first Solana trading app. Trade any token in seconds, follow top traders, and become a legend.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <a href="https://apps.apple.com/us/app/chadwallet/id6757367474" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                  <img src="/assets/badges/appstore.svg" alt="Download on the App Store" className="h-9 w-auto" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                  <img src="/assets/badges/playstore.svg" alt="Get it on Google Play" className="h-9 w-auto" />
                </a>
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div className="flex flex-col gap-3">
                <span className="text-white/60 font-semibold uppercase tracking-widest text-xs">Product</span>
                <a href="/" className="text-white/40 hover:text-white transition-colors">Home</a>
                <a href="/trade/So11111111111111111111111111111111111111112" className="text-white/40 hover:text-white transition-colors">Trade</a>
                <a href="/download" className="text-white/40 hover:text-white transition-colors">Download</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-white/60 font-semibold uppercase tracking-widest text-xs">Download</span>
                <a href="https://apps.apple.com/us/app/chadwallet/id6757367474" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">App Store</a>
                <a href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Google Play</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-white/60 font-semibold uppercase tracking-widest text-xs">Legal</span>
                <a href="https://www.chadwallet.xyz/terms" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Terms of Service</a>
                <a href="https://www.chadwallet.xyz/privacy" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs">
            <p>&copy; {new Date().getFullYear()} ChadWallet. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="https://www.chadwallet.xyz/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="https://www.chadwallet.xyz/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
