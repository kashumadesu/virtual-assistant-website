import { ClipboardList, Database, HeadphonesIcon, Share2, Search, Mail, Briefcase } from 'lucide-react';

const SERVICES = [
  { icon: ClipboardList, title: 'Administrative Support', desc: 'Scheduling, document management, and day-to-day operations.' },
  { icon: Database, title: 'Data Entry', desc: 'Accurate and efficient data processing and organization.' },
  { icon: HeadphonesIcon, title: 'Customer Support', desc: 'Professional client communication and issue resolution.' },
  { icon: Share2, title: 'Social Media Assistance', desc: 'Content planning, posting, and community engagement.' },
  { icon: Search, title: 'Research Assistance', desc: 'In-depth research and compiled reports on any topic.' },
  { icon: Mail, title: 'Email Management', desc: 'Inbox organization, prioritization, and professional responses.' },
  { icon: Briefcase, title: 'Executive Assistance', desc: 'High-level support for founders, executives, and managers.' },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Everything your business needs, handled by skilled virtual assistants.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="p-6 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group"
              >
                <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
