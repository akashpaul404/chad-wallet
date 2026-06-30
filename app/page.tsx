import Image from "next/image";
import TokenBanner from "./components/TokenBanner";
import HeroButtons from "./components/HeroButtons";
import Navbar from "./components/Navbar";
import MuteableVideo from "./components/MuteableVideo";
import StartTradingButton from "./components/StartTradingButton";
import Link from "next/link";

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

      {/* HERO SECTION — unchanged */}
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
          <div className="mb-6 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now available on web
          </div>
          <h1 className="text-4xl md:text-[160px] font-bold tracking-tighter text-white mb-2 leading-none lowercase">
            chad
          </h1>
          <h2 className="text-2xl md:text-[40px] font-bold tracking-tight text-white drop-shadow-lg">
            where traders become legends.
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl font-medium drop-shadow-md mt-3">
            From memecoins to viral tokens, trade any crypto in seconds.
          </p>
          <div className="relative z-[200] mt-6">
            <HeroButtons />
          </div>
        </div>
      </section>

      {/* SECTION 1 — trade from anywhere (fomo.family style) */}
      <section className="relative py-32 md:py-40 px-6 bg-[#050505] overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center mb-16 md:mb-24">
          <p className="text-[#606AF7] text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
            NOW AVAILABLE ON WEB
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05] mb-6 lowercase">
            trade from anywhere.<br />never lose a beat.
          </h2>
          <p className="text-lg md:text-xl text-white/50 max-w-xl font-medium">
            Open a trade on your phone, close it on your desktop — all in one app.
          </p>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Large centered screenshot with plain dark background */}
          <div className="w-full rounded-2xl bg-[#0a0a0f] border border-white/5 drop-shadow-2xl p-2 md:p-4">
            <img
              src="/assets/flow/buy-sell-4.png"
              alt="ChadWallet Trading App"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* SECTION 1.5 — Video Showcase */}
      <section className="py-24 px-6 bg-[#060510]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          
          {/* Left Column: Text */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
            <h2 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 lowercase text-white">
              outrun the bots.
            </h2>
            <p className="text-lg md:text-xl text-white/50 max-w-xl font-medium">
            
              execute lightning-fast trades, snipe new listings before anyone else, and earn massive rewards.
            </p>
            <p className="text-lg md:text-xl text-white/50 max-w-xl font-medium">
              built for the real chads of the trenches.
            </p>
            
            <div className="mt-8 flex">
              <StartTradingButton className="w-full sm:w-auto text-center" />
            </div>
          </div>

          {/* Right Column: Video in Phone Frame */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[300px] md:max-w-[340px] aspect-[9/17.5] bg-[#0a0a0f] rounded-[2.5rem] md:rounded-[3rem] p-3 md:p-4 border-[6px] border-[#1a1924] shadow-2xl mx-auto md:mx-0">
              <div className="w-full h-full bg-[#050505] rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden relative">
                <MuteableVideo src="/assets/video/chadwallet.mp4" />
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* SECTION 2 — never miss out again (fomo.family 3+3 grid) */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-3 lowercase leading-tight">
              never miss out again
            </h2>
            <p className="text-lg text-white/40 font-medium">
              the only social-first trading app
            </p>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-300 min-h-[420px]">
              <span className="text-[#606AF7] text-[10px] font-bold tracking-[0.18em] uppercase mb-4">LEADERBOARD</span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-auto lowercase">
                become a legend, top the leaderboard
              </h3>
              <div className="mt-8 -mx-2 -mb-2">
                <img src="/assets/app store/kol.png" alt="Leaderboard" className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-300 min-h-[420px]">
              <span className="text-purple-400 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">FEED</span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-auto lowercase">
                discover and follow top traders
              </h3>
              <div className="mt-8 -mx-2 -mb-2">
                <img src="/assets/app store/discover.png" alt="Feed" className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-300 min-h-[420px]">
              <span className="text-emerald-400 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">ALERTS</span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-auto lowercase">
                real time notifications for what the best are buying
              </h3>
              <div className="mt-8 -mx-2 -mb-2">
                <img src="/assets/app store/x.png" alt="Alerts" className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-300 min-h-[380px]">
              <span className="text-emerald-400 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">EASY ONBOARDING</span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-auto lowercase">
                create an account in an instant
              </h3>
              <div className="mt-8 -mx-2 -mb-2">
                <img src="/assets/app store/splash.png" alt="Easy Onboarding" className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-300 min-h-[380px]">
              <span className="text-[#606AF7] text-[10px] font-bold tracking-[0.18em] uppercase mb-4">ZERO COMPLEXITY</span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-auto lowercase">
                multichain &amp; gasless
              </h3>
              <div className="mt-8 -mx-2 -mb-2">
                <img src="/assets/app store/deposit.png" alt="Zero Complexity" className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-300 min-h-[380px]">
              <span className="text-purple-400 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">ONE CLICK TO BUY</span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-auto lowercase">
                buy with one tap
              </h3>
              <div className="mt-8 -mx-2 -mb-2">
                <img src="/assets/app store/token.png" alt="One Click to Buy" className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Final CTA (fomo.family orbit animation) */}
      <section className="py-40 px-6 relative z-20 flex flex-col items-center text-center min-h-[700px] justify-center bg-[#050505] overflow-x-clip">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[900px] h-[900px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(48,46,120,0.60) 0%, rgba(30,27,90,0.30) 45%, transparent 72%)',
            }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-white/[0.12] animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-white/[0.12] animate-[spin_22s_linear_infinite_reverse]" />
          <div className="absolute w-[260px] h-[260px] rounded-full border border-dashed border-white/[0.12] animate-[spin_15s_linear_infinite]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="absolute" style={{ top: 'calc(50% - 300px)', left: '50%', transform: 'translateX(-50%)' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 border-2 border-white/20 shadow-lg" />
          </div>
          <div className="absolute" style={{ top: '50%', left: 'calc(50% + 300px)', transform: 'translateY(-50%)' }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-2 border-white/20 shadow-lg flex items-center justify-center text-sm">🦊</div>
          </div>
          <div className="absolute" style={{ top: 'calc(50% + 220px)', left: 'calc(50% - 230px)' }}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 border-2 border-white/20 shadow-lg flex items-center justify-center text-sm">🐸</div>
          </div>
          <div className="absolute" style={{ top: 'calc(50% + 220px)', left: 'calc(50% + 200px)' }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 border-2 border-white/20 shadow-lg flex items-center justify-center text-sm">🚀</div>
          </div>
          <div className="absolute" style={{ top: 'calc(50% - 200px)', left: 'calc(50% - 270px)' }}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white/20 shadow-lg" />
          </div>
          <div className="absolute" style={{ top: 'calc(50% - 80px)', left: 'calc(50% + 210px)' }}>
            <div className="w-8 h-8 rounded-full bg-[#606AF7] border-2 border-white/30 shadow-lg flex items-center justify-center text-white text-xs font-bold">C</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 leading-[1.0] lowercase">
            a trading app<br />for the rest of us
          </h2>
          <p className="text-lg md:text-xl text-white/50 mb-10 font-medium">
            join 500,000 traders making their mark on ChadWallet
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

      {/* FOOTER — 3 columns: ABOUT, SOCIAL, LEGAL (fomo.family style) */}
      <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="flex flex-col gap-4 max-w-xs">
              <div className="flex items-center gap-2">
                <img src="/assets/logo/light.png" alt="ChadWallet Logo" className="h-[1em] text-2xl w-auto" />
                <span className="text-2xl font-bold tracking-tighter text-white">ChadWallet</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                where traders become legends.
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div className="flex flex-col gap-3">
                <span className="text-white/60 font-semibold uppercase tracking-widest text-xs">About</span>
                <a href="https://www.chadwallet.xyz" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Blog</a>
                <a href="https://www.chadwallet.xyz" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">FAQ</a>
                <a href="https://www.chadwallet.xyz" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Affiliates</a>
                <a href="https://www.chadwallet.xyz" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Careers</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-white/60 font-semibold uppercase tracking-widest text-xs">Social</span>
                <a href="https://discord.gg/chadwallet" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Discord</a>
                <a href="https://x.com/chadwallet" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">X / Twitter</a>
                <a href="https://instagram.com/chadwallet" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Instagram</a>
                <a href="https://youtube.com/@chadwallet" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">YouTube</a>
                <a href="https://linkedin.com/company/chadwallet" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">LinkedIn</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-white/60 font-semibold uppercase tracking-widest text-xs">Legal</span>
                <a href="https://www.chadwallet.xyz/privacy" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Privacy Policy</a>
                <a href="https://www.chadwallet.xyz/terms" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
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
