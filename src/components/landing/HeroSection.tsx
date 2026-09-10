import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="pt-32 pb-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
          Professional Virtual Assistance
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          ZEN VIRTUAL
          <span className="block text-teal-600">ASSISTANCE</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Reliable virtual assistance that helps your business work smarter.
          Skilled assistants, seamless collaboration, real results.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="bg-teal-600 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-teal-700 transition-colors text-base w-full sm:w-auto"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-base w-full sm:w-auto"
          >
            Client Login
          </Link>
        </div>
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '100+', label: 'Happy Clients' },
            { value: '50+', label: 'Expert Assistants' },
            { value: '5★', label: 'Average Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
