const STEPS = [
  { step: '01', title: 'Tell Us What You Need', desc: 'Share your requirements and business goals with our team.' },
  { step: '02', title: 'Get Matched', desc: 'We pair you with the virtual assistant best suited for your needs.' },
  { step: '03', title: 'Collaborate', desc: 'Work together seamlessly through our secure platform.' },
  { step: '04', title: 'Monitor Progress', desc: 'Track task completion and activity in real time.' },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Getting started is simple.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-slate-200 -translate-x-4 z-0" />
              )}
              <div className="relative z-10">
                <div className="inline-flex h-12 w-12 rounded-full bg-teal-600 text-white font-bold text-sm items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
