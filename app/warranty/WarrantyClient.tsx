'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Wrench, ClipboardList, Calendar } from 'lucide-react';

const warrantyTable = [
  { part: 'Bicycle Frame', note: 'Does not include Headset and Seat Post', period: '12 Months', covered: true },
  { part: 'Rigid Fork', note: '', period: '06 Months', covered: true },
  { part: 'Suspension Fork', note: '', period: '06 Months', covered: true },
  { part: 'Brake Arch and Disc Caliper', note: 'Does not include Brake Shoe Rubbers and Rotor Disc', period: '03 Months', covered: true },
  { part: 'Tire and Inner Tubes', note: '', period: 'No Warranty', covered: false },
  { part: 'Drivetrain', note: 'Does not include Pedals', period: '03 Months', covered: true },
  { part: 'Bicycle Rims and Hubs', note: 'Does not include Spokes and Nipples', period: '03 Months', covered: true },
  { part: 'Gear Shifter, Rear Derailleur, Front Derailleur', note: '', period: 'No Warranty', covered: false },
  { part: 'Pedals, Spokes, Nipples, Brake Levers, Saddle, Fenders, Baskets, Bell, Brake Cables and other plastic parts', note: '', period: 'No Warranty', covered: false },
];

const conditions = [
  'This limited warranty applies only to the original owner of a COSMIC bicycle as mentioned in the Purchase Invoice. The warranty is not transferable.',
  'For any warranty claim to be considered, the bicycle must be brought in to an Authorized COSMIC Bicycle Retailer. The bicycle must be in assembled condition and accompanied by the original Purchase Invoice.',
  'This limited warranty is void if the bicycle is subjected to abuse, neglect, improper repair, improper maintenance, alteration, modification, an accident, racing, Stunts, Rental, Commercial Usage or any other uncharacteristic, unwarranted, or inappropriate use.',
  'This limited warranty applies only to bicycles purchased in fully assembled condition and Pre-Delivery Quality Check from Authorized COSMIC Retailers or other outlets specifically authorized by us to distribute or sell COSMIC bicycles.',
  'Damage resulting from normal wear and tear is not covered and it is the owner\'s responsibility to inspect, maintain and regularly service his/her bicycle to avoid any such damages.',
  'Any Paint fading caused by the effects of ultraviolet light (UV) or outdoor exposure is not covered under this warranty.',
  'Damages resulting from improper assembly or maintenance is not covered. Any Additional aftermarket accessories, customization of any kind is not covered.',
  'No warranty implies for Rust/Corrosion. Parts like Nuts, bolts, steel parts on the bicycle may get rusted due to Exposed climatic conditions and water wash.',
  'Any Costs Incurred for warranty service/Claim like freight, installation, assembling and labour charges are the responsibility of the bicycle owner.',
  'As we have a constant endeavour to improvise our products regularly some components, designs, colours, specifications may not be available. In these cases, the available, suitable parts or components will be offered. COSMIC will either repair any defective frame or component, or, at our option, replace any defective frame or component with the same or most nearly comparable model or component then available.',
  'Any Warranty claim for any failed component, only that particular component would be replaced under warranty not the entire Bicycle.',
  'This limited warranty is not meant to recommend or conclude that the bicycle cannot be broken. Check all parameters before taking delivery of the bicycle. Goods Once sold cannot be taken back.',
];

const maintenanceSchedule = [
  {
    period: 'Every Day Ride',
    color: 'bg-[#D61C1C]',
    tasks: [
      'Check your tire pressure and inflate as needed. A quality floor pump with gauge is a must-own.',
      'Check and clean tires for debris, thorns, etc. that could cause a flat.',
      'Lifting the front and rear of the bike, spin each wheel while looking for wobbles or rim damage. Wobbly wheels should be tried by a mechanic.',
      'Check your brake pads for wear and make sure that they are making firm contact with either the rim or the brake disc.',
      'Check suspension fork (and shock) for compression and release, and make sure there is no flex or play in the suspension.',
      'Check chain for cleanliness, clean if dirty, lubricate if dry.',
    ],
  },
  {
    period: 'Monthly',
    color: 'bg-zinc-800',
    tasks: [
      'Clean your bike with bike wash, a rag, and stiff plastic brush and inspect frame / components for cracks and wear. Only clean with bike shampoo and fresh water if you have to.',
      'Wipe the chain, cassette, and chainrings with a rag, brush, and degreaser. Re-lube with chain lube.',
      'Use a wrench to check the tightness of the crank arms, pedals, chainring bolts, stem/bar/seat post bolts, and all other mounting bolts.',
      'Lube pivots points on brakes, derailleurs, and pedals. Check all cables and cable housing for wear, kinks, rust, and fraying. Replace as needed and lube good cables/housing at entry/exit points.',
      'Check the wheels for loose or damaged spokes.',
      'Maintain, lubricate, and service your suspension components according mechanic\'s advice.',
    ],
  },
  {
    period: '6 Months and Thereafter',
    color: 'bg-zinc-900',
    tasks: [
      'Thoroughly clean frame and drivetrain, polish and protect frame with bike polish. Inspect for frame cracks or damage.',
      'Check tires for wear and replace as needed.',
      'Check bearing systems (hubs, bottom bracket, headset) for play and/or grinding and grumbling. Replace, adjust, or overhaul as needed.',
      'Check brake pads for wear and replace as needed. Also check for worn grips and handlebar tape and replace as needed.',
      'Check all cables and cable housing for wear, kinks, rust, and fraying. Replace as needed, lube good cables/housing at entry/exit points.',
      'Check cassette and chain rings for wear; check chain for wear, tight links, and bent links. Also check derailleur cages for damage. Replace drivetrain parts as needed.',
      'Maintain, lubricate, and service your suspension components according mechanic\'s advice.',
    ],
  },
];

const ownerFields = [
  { id: 'purchaseDate', label: 'Date of Purchase', type: 'date', placeholder: '' },
  { id: 'ownerName', label: "Owner's Name", type: 'text', placeholder: 'Full name' },
  { id: 'address', label: 'Address', type: 'text', placeholder: 'Full address' },
  { id: 'contact', label: 'Contact Number', type: 'tel', placeholder: '+91 00000 00000' },
  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com' },
  { id: 'modelName', label: 'Model Name', type: 'text', placeholder: 'e.g. Cosmic Apex Pro' },
  { id: 'colour', label: 'Colour', type: 'text', placeholder: 'e.g. Matte Black' },
  { id: 'frameNumber', label: 'Frame Number', type: 'text', placeholder: 'Located on bottom bracket shell' },
];

export default function WarrantyClient() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-14 bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <nav className="flex items-center gap-1.5 text-[11px] text-zinc-600 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Warranty</span>
          </nav>
          <p className="section-label text-zinc-600 mb-3">Cosmic Limited Warranty</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-[1.05] mb-4">Warranty & Support</h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
            Your Cosmic bicycle is covered under our limited warranty from the date of purchase. Read the terms below to understand your coverage.
          </p>
        </div>
      </section>

      {/* Warranty Coverage Table */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="mb-10">
            <p className="section-label mb-2">Coverage Details</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-zinc-900">Warranty Terms &amp; Conditions</h2>
            <p className="text-zinc-500 mt-3 leading-relaxed max-w-2xl">
              The bicycle is covered subject to the terms of the limited warranty as mentioned below.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white">
                  <th className="text-left px-6 py-4 text-[11px] font-semibold tracking-[0.15em] uppercase w-2/3">Part / Component</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold tracking-[0.15em] uppercase w-1/3">Warranty Period</th>
                </tr>
              </thead>
              <tbody>
                {warrantyTable.map((row, i) => (
                  <tr
                    key={row.part}
                    className={`border-b border-zinc-100 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-zinc-900">{row.part}</p>
                      {row.note && <p className="text-xs text-zinc-400 mt-0.5">{row.note}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${row.covered ? 'text-zinc-900' : 'text-zinc-400'}`}>
                        {row.covered ? (
                          <CheckCircle2 className="w-4 h-4 text-[#D61C1C] flex-shrink-0" />
                        ) : (
                          <span className="w-4 h-4 flex-shrink-0 inline-flex items-center justify-center text-zinc-300">—</span>
                        )}
                        {row.period}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Conditions */}
          <div className="border border-zinc-200 bg-zinc-50">
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-900 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-[#D61C1C] flex-shrink-0" />
              <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white">Important Warranty Conditions</h3>
            </div>
            <ul className="divide-y divide-zinc-200">
              {conditions.map((cond, i) => (
                <li key={i} className="flex gap-3 px-6 py-4">
                  <span className="text-[#D61C1C] font-bold text-sm flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
                  <p className="text-sm text-zinc-600 leading-[1.75]">{cond}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Owner Registration Form */}
      <section className="py-16 bg-zinc-950" id="register">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <p className="section-label text-zinc-600 mb-3">Register Your Bicycle</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
                Owner's<br /><em className="italic text-zinc-400">Details</em>
              </h2>
              <p className="text-zinc-400 text-sm leading-[1.8] mb-6">
                Complete this form to register your Cosmic bicycle warranty. Keep a copy of your Purchase Invoice — it is required for any warranty claim.
              </p>
              <div className="space-y-3">
                {[
                  'Original Purchase Invoice required for all claims',
                  'Warranty is non-transferable',
                  'Bicycle must be in assembled condition for service',
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D61C1C] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-[#D61C1C]/10 border border-[#D61C1C]/30 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8 text-[#D61C1C]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-2">Details Submitted</h3>
                  <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
                    Your warranty registration details have been received. Please retain your original Purchase Invoice for any future claims.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {ownerFields.map((field) => (
                      <div key={field.id} className={field.id === 'address' ? 'sm:col-span-2' : ''}>
                        <label htmlFor={field.id} className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-1.5">
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData((p) => ({ ...p, [field.id]: e.target.value }))}
                          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 text-sm outline-none focus:border-[#D61C1C] transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Dealer seal note */}
                  <div className="border border-zinc-700 bg-zinc-900/50 px-5 py-4 mt-2">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-1">Authorised Dealer Seal & Signature</p>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Ensure your Authorised Dealer has stamped and signed your physical warranty card at the time of purchase.
                    </p>
                  </div>

                  <button type="submit" className="cosmic-btn-primary w-full justify-center py-4">
                    Submit Registration
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Maintenance Chart */}
      <section className="py-16 bg-white" id="maintenance">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="mb-10">
            <p className="section-label mb-2">Keep Your Bike at Its Best</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-zinc-900 mb-3">Recommended Maintenance Chart</h2>
            <p className="text-zinc-500 text-sm leading-[1.75] max-w-2xl">
              Following these simple tips and guidelines will keep your bicycle riding better for longer. These are general tips for all bicycles — road, mountain, and recreation. Mountain bikes tend to require more frequent and extensive service than other models.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-zinc-100">
            {maintenanceSchedule.map((schedule) => (
              <div key={schedule.period} className="bg-white flex flex-col">
                <div className={`${schedule.color} px-6 py-4`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/70" />
                    <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">{schedule.period}</h3>
                  </div>
                </div>
                <ul className="divide-y divide-zinc-50 flex-1">
                  {schedule.tasks.map((task, i) => (
                    <li key={i} className="flex gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D61C1C] flex-shrink-0 mt-2" />
                      <p className="text-xs text-zinc-600 leading-[1.7]">{task}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-14 bg-zinc-900 text-center">
        <div className="max-w-lg mx-auto px-5">
          <Wrench className="w-8 h-8 text-zinc-600 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="font-display text-3xl font-semibold text-white mb-3">Need to make a claim?</h3>
          <p className="text-zinc-400 mb-2 text-sm leading-relaxed">
            Bring your bicycle to an Authorised COSMIC Retailer in fully assembled condition with your original Purchase Invoice.
          </p>
          <p className="text-zinc-500 text-xs mb-8">Available Mon–Sat, 9am–6pm IST</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/store-locator" className="cosmic-btn-primary">Find Authorised Dealer</Link>
            <Link href="/contact" className="cosmic-btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
