'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';
import { submitContactForm } from '@/lib/api/contact';

interface FormData { name: string; email: string; phone: string; subject: string; message: string; }
interface FormErrors { name?: string; email?: string; message?: string; }

export default function ContactClient() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await submitContactForm({ name: form.name, email: form.email, phone: form.phone, subject: form.subject, message: form.message });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <section className="pt-32 pb-14 bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <nav className="flex items-center gap-1.5 text-[11px] text-zinc-600 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Contact</span>
          </nav>
          <p className="section-label text-zinc-600 mb-3">Get in Touch</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-[1.05]">Contact Us</h1>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Info column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-display text-xl font-semibold text-zinc-900 mb-5">Our Offices</h3>
                <div className="space-y-5">
                  {[
                    {
                      title: 'Headquarters — Mumbai',
                      address: '22, Bandra-Kurla Complex, Mumbai, Maharashtra 400051',
                      phone: '+91 22 6789 1234',
                      email: 'hello@cosmicbikes.com',
                      hours: 'Mon–Fri, 9am–6pm IST',
                    },
                    {
                      title: 'Design Studio — Pune',
                      address: '14, Koregaon Park, Pune, Maharashtra 411001',
                      phone: '+91 20 2567 8901',
                      email: 'design@cosmicbikes.com',
                      hours: 'Mon–Fri, 10am–6pm IST',
                    },
                  ].map((office) => (
                    <div key={office.title} className="border border-zinc-100 p-5 hover:border-zinc-200 transition-colors">
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">{office.title}</p>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-zinc-600 leading-relaxed">{office.address}</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                          <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">{office.phone}</a>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                          <a href={`mailto:${office.email}`} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">{office.email}</a>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                          <p className="text-sm text-zinc-500">{office.hours}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="aspect-[4/3] bg-zinc-50 border border-zinc-100 flex flex-col items-center justify-center gap-2">
                <MapPin className="w-8 h-8 text-zinc-200" />
                <p className="text-sm text-zinc-400">BKC, Mumbai</p>
                <p className="text-xs text-zinc-300">Map placeholder</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="font-display text-3xl font-semibold text-zinc-900 mb-3">Message Sent!</h2>
                  <p className="text-zinc-500 max-w-sm mx-auto leading-[1.8]">
                    Thank you for reaching out. We'll respond to your enquiry within 1–2 business days.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-semibold text-zinc-900 mb-7">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="label-field" htmlFor="name">Full Name *</label>
                        <input id="name" type="text" value={form.name} onChange={set('name')}
                          className={`input-field ${errors.name ? 'input-field-error' : ''}`} />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="label-field" htmlFor="email">Email Address *</label>
                        <input id="email" type="email" value={form.email} onChange={set('email')}
                          className={`input-field ${errors.email ? 'input-field-error' : ''}`} />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="label-field" htmlFor="phone">Phone (optional)</label>
                        <input id="phone" type="tel" value={form.phone} onChange={set('phone')} className="input-field" />
                      </div>
                      <div>
                        <label className="label-field" htmlFor="subject">Topic</label>
                        <select id="subject" value={form.subject} onChange={set('subject')} className="input-field cursor-pointer">
                          <option value="">Select a topic</option>
                          <option value="product">Product Enquiry</option>
                          <option value="dealer">Dealer / Sales</option>
                          <option value="service">Service & Warranty</option>
                          <option value="press">Press & Media</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label-field" htmlFor="message">Message *</label>
                      <textarea id="message" rows={5} value={form.message} onChange={set('message')}
                        placeholder="How can we help you?"
                        className={`input-field resize-none ${errors.message ? 'input-field-error' : ''}`} />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="cosmic-btn-primary disabled:opacity-50 group">
                      {loading ? 'Sending...' : (<>Send Message <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>)}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
