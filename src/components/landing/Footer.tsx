import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Zen Virtual Assistance</p>
              <p className="text-slate-500 text-xs">Reliable. Professional. Flexible.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Login</Link>
            <a href="#services" className="text-slate-400 hover:text-white text-sm transition-colors">Services</a>
            <a href="#contact" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</a>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Zen Virtual Assistance</p>
        </div>
      </div>
    </footer>
  );
}
