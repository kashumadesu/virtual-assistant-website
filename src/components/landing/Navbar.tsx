import Link from 'next/link';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg">Zen VA</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Services</a>
            <a href="#why-zen" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Why Zen</a>
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#contact" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium">
              Client Login
            </Link>
            <Link href="/login" className="bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
