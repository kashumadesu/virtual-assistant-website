export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Ready to work smarter? Contact us and a team member will reach out within one business day.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Email', value: 'hello@zenva.com' },
                { label: 'Phone', value: '+1 (555) 123-4567' },
                { label: 'Hours', value: 'Monday – Saturday, 8AM–6PM' },
              ].map((info) => (
                <div key={info.label}>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{info.label}</p>
                  <p className="text-white font-medium">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8">
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input type="text" placeholder="Jane" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input type="text" placeholder="Smith" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" placeholder="jane@company.com" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea rows={4} placeholder="Tell us about your needs..." className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-lg hover:bg-teal-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
