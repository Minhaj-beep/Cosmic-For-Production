'use client';

import { useState } from 'react';
import { Check, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { submitDealerEnquiry } from '@/lib/api/contact';

const states = [
  'Andhra Pradesh', 'Assam', 'Delhi', 'Goa', 'Gujarat', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

interface FormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  message: string;
}

interface FormErrors {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  state?: string;
  city?: string;
}

export default function DealerEnquiryClient() {
  const [form, setForm] = useState<FormData>({ name: '', company: '', phone: '', email: '', state: '', city: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.company.trim()) e.company = 'Required';
    if (!form.phone.trim() || !/^\+?[\d\s\-]{10,}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.state) e.state = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await submitDealerEnquiry({ name: form.name, company: form.company, email: form.email, phone: form.phone, city: form.city, state: form.state, message: form.message });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-5 pt-20">
        <div className="max-w-md w-full text-center py-16">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-zinc-900 mb-4">Enquiry Received</h2>
          <p className="text-zinc-500 mb-2 leading-[1.8]">
            Thank you, <strong className="text-zinc-700">{form.name}</strong>. Our dealer partnerships team will review your application and reach out within 3–5 business days.
          </p>
          <p className="text-sm text-zinc-400 mb-10">A confirmation has been sent to <strong>{form.email}</strong></p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="cosmic-btn-primary">Back to Home</Link>
            <Link href="/store-locator" className="cosmic-btn-outline-dark">Find Dealers Near You</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg" alt="" className="w-full h-full object-cover" aria-hidden />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-5 lg:px-10">
          <nav className="flex items-center gap-1.5 text-[11px] text-zinc-600 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Dealer Enquiry</span>
          </nav>
          <p className="section-label text-zinc-600 mb-3">Partner with Us</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-4 leading-[1.05]">Dealer Enquiry</h1>
          <p className="text-zinc-400 max-w-md leading-[1.8]">
            Interested in carrying Cosmic bikes? Fill out the form below and our partnerships team will be in touch within 3–5 business days.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Benefits */}
            <div className="lg:col-span-2">
              <h3 className="font-display text-2xl font-semibold text-zinc-900 mb-8">Why Partner with Cosmic?</h3>
              <div className="space-y-6">
                {[
                  { title: 'Premium Margin Structure', desc: 'Competitive dealer margins with a brand premium that commands full-price sales.' },
                  { title: 'Co-op Marketing Support', desc: 'In-store displays, digital assets, and co-op advertising budget for qualified dealers.' },
                  { title: 'Protected Territory', desc: 'Defined dealer territories to protect your local market investment.' },
                  { title: 'Training & Certification', desc: 'Full product training, service certification, and continuous education programs.' },
                  { title: 'Dedicated Account Manager', desc: 'A single point of contact for all ordering, support, and marketing needs.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 border border-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-field" htmlFor="name">Full Name *</label>
                    <input id="name" type="text" value={form.name} onChange={set('name')}
                      className={`input-field ${errors.name ? 'input-field-error' : ''}`} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label-field" htmlFor="company">Company / Store Name *</label>
                    <input id="company" type="text" value={form.company} onChange={set('company')}
                      className={`input-field ${errors.company ? 'input-field-error' : ''}`} />
                    {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-field" htmlFor="email">Email Address *</label>
                    <input id="email" type="email" value={form.email} onChange={set('email')}
                      className={`input-field ${errors.email ? 'input-field-error' : ''}`} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label-field" htmlFor="phone">Phone Number *</label>
                    <input id="phone" type="tel" value={form.phone} onChange={set('phone')}
                      className={`input-field ${errors.phone ? 'input-field-error' : ''}`} />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-field" htmlFor="state">State *</label>
                    <select id="state" value={form.state} onChange={set('state')}
                      className={`input-field cursor-pointer ${errors.state ? 'input-field-error' : ''}`}>
                      <option value="">Select State</option>
                      {states.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="label-field" htmlFor="city">City *</label>
                    <input id="city" type="text" value={form.city} onChange={set('city')}
                      className={`input-field ${errors.city ? 'input-field-error' : ''}`} />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                </div>
                <div>
                  <label className="label-field" htmlFor="message">Message / Additional Info</label>
                  <textarea id="message" rows={4} value={form.message} onChange={set('message')}
                    placeholder="Tell us about your store, current brands you carry, estimated annual bike sales..."
                    className="input-field resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="cosmic-btn-primary disabled:opacity-50 disabled:cursor-not-allowed group">
                  {loading ? 'Submitting...' : (<>Submit Enquiry <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>)}
                </button>
                <p className="text-xs text-zinc-400">
                  We respect your privacy. Your information will only be used to process your dealer application.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
