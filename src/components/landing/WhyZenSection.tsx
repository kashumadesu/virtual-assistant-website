import { Shield, Star, Zap, Target } from 'lucide-react';

const REASONS = [
  { icon: Shield, title: 'Reliable Support', desc: 'Consistent, dependable assistance you can count on every day.' },
  { icon: Star, title: 'Skilled Virtual Assistants', desc: 'Trained, experienced professionals across multiple disciplines.' },
  { icon: Zap, title: 'Flexible Services', desc: 'Scale up or down based on your business needs.' },
  { icon: Target, title: 'Business-Focused', desc: 'Every decision we make is aligned with your business goals.' },
];

export function WhyZenSection() {
  return (
    <section id="why-zen" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Zen?</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We are not just a virtual assistance provider — we are a business partner
              committed to helping you focus on what matters most.
            </p>
            <div className="space-y-6">
              {REASONS.map((reason) => {
                const Icon = reason.icon;
                return (
                  <div key={reason.title} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{reason.title}</h3>
                      <p className="text-sm text-slate-600">{reason.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="space-y-4">
              {[
                { label: 'Response Time', value: '< 2 hours' },
                { label: 'Client Satisfaction', value: '98%' },
                { label: 'Task Completion Rate', value: '99.2%' },
                { label: 'Availability', value: 'Mon–Sat' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <span className="text-slate-600 text-sm">{stat.label}</span>
                  <span className="font-semibold text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
