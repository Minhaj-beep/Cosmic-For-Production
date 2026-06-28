import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Award, Users, Globe, Wrench, ChevronRight } from 'lucide-react';
import { getSeoByRoute } from '@/lib/api/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/about');
  return {
    title: seo?.title ?? 'About Cosmic | Cosmic Bikes',
    description: seo?.description ?? 'COSMIC is a proud brand of NANDI MARKETING — over five decades of expertise in the bicycle industry, proudly designed and built in India.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

const team = [
  { name: 'Arjun Sharma', role: 'Founder & CEO', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', bio: '16 years in cycling innovation' },
  { name: 'Priya Desai', role: 'Chief Design Officer', image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', bio: 'Ex-Specialized, RISD alumna' },
  { name: 'Marcus Webb', role: 'Head of Engineering', image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg', bio: '20+ patents in frame design' },
  { name: 'Sarah Chen', role: 'Head of Product', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', bio: 'Former pro road cyclist' },
];

const milestones = [
  { year: '2008', event: 'Cosmic founded in a small Mumbai workshop by Arjun Sharma and 4 co-founders with a shared obsession for cycling excellence.' },
  { year: '2011', event: 'Launch of the first Apex carbon road frame. Won Best New Bike at India Cycle Expo and sold out in 3 weeks.' },
  { year: '2014', event: 'Expanded into mountain bikes with the Terra series. Opened our Pune design and engineering facility.' },
  { year: '2017', event: 'Launched the electric Flux series, pioneering e-bike design in India. Reached 10,000 bikes milestone.' },
  { year: '2020', event: 'International expansion into Southeast Asia, Middle East and Europe. First export shipment to 12 countries.' },
  { year: '2023', event: '8 industry awards including Best Manufacturer at Asia Cycle Summit. 50,000 riders worldwide milestone.' },
  { year: '2024', event: 'Opened Cosmic Experience Centres in Mumbai, Delhi, and Bangalore — redefining the premium bicycle retail experience.' },
];

const values = [
  { icon: Award, title: 'Uncompromising Quality', desc: "Every Cosmic bike meets the same rigorous quality standards — from our entry-level youth bikes to our top-tier race machines. No exceptions." },
  { icon: Wrench, title: 'Innovation First', desc: 'We invest 12% of revenue in R&D, collaborating with elite athletes and aerodynamicists to push the boundaries of bicycle engineering.' },
  { icon: Users, title: 'Rider-Centric Design', desc: 'Our riders guide our design process through feedback programs, testing sessions, and athlete partnerships — creating bikes that truly serve the people who ride them.' },
  { icon: Globe, title: 'Sustainable Craft', desc: 'We are committed to reducing our environmental footprint through responsible sourcing, solar-powered facilities, and a 2030 carbon neutrality target.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Cinematic hero */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg"
          alt="About Cosmic — craftsmanship"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 40%', filter: 'brightness(0.55) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10 pb-12 md:pb-16 w-full">
            <nav className="flex items-center gap-1.5 text-[11px] text-white/40 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/70">About</span>
            </nav>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/50 mb-4">Our Story</p>
            <h1 className="font-display font-semibold text-white leading-none" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>
              About Cosmic
            </h1>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-4">Our Mission</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-zinc-900 leading-[1.1] mb-6">
                The sky is not the limit —<br />
                <em className="italic text-zinc-400">it's the beginning.</em>
              </h2>
              <p className="text-zinc-500 text-base leading-[1.8] mb-4">
                COSMIC is a proud brand of NANDI MARKETING, a company built on over five decades of expertise in the bicycle industry. As a trusted manufacturer and importer of bicycles, accessories, parts, and baby ride-on products, NANDI MARKETING has consistently delivered innovation and reliability to its customers.
              </p>
              <p className="text-zinc-500 text-base leading-[1.8] mb-4">
                Whether for fun, fitness, or adventure, our wide range of products is designed to inspire riders to aim higher and go further. Every COSMIC and COSPRO creation is backed by precise engineering, premium designs, superior paint finishes, and high-quality components — ensuring performance that matches passion.
              </p>
              <p className="text-zinc-500 text-base leading-[1.8] mb-8">
                With COSMIC, every ride is more than a journey — it's an experience of freedom, adventure, and excellence.
              </p>
              <Link href="/collections" className="cosmic-btn-outline-dark group">
                Explore Our Bikes
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="https://www.shutterstock.com/image-photo/bicycle-repair-diy-young-man-600nw-2644661163.jpg"
                  alt="Cosmic workshop craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-zinc-900 px-6 py-5 w-40 text-center">
                <p className="font-display text-4xl font-semibold text-white">20+</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 mt-1">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      {/* <section className="py-20 bg-zinc-50" id="values">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What Drives Us</p>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8 group hover:bg-zinc-900 transition-all duration-500 cursor-default">
                <div className="w-11 h-11 border border-zinc-100 group-hover:border-zinc-700 flex items-center justify-center mb-6 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-900 group-hover:text-white mb-3 transition-colors duration-500">{title}</h3>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 leading-[1.75] transition-colors duration-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Timeline */}
      {/* <section className="py-20 md:py-28 bg-white" id="history">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="section-label mb-3">Our Journey</p>
              <h2 className="section-title mb-6">
                16 Years of<br /><em className="italic">Milestones</em>
              </h2>
              <p className="text-zinc-500 leading-[1.8] max-w-sm">
                From a Mumbai workshop to 50,000 riders on six continents — every year has brought new breakthroughs, bold innovations, and an ever-growing community of riders who share our passion.
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-[22px] top-0 bottom-0 w-px bg-zinc-100" />
              <div className="space-y-0">
                {milestones.map((m, i) => (
                  <div key={m.year} className="flex gap-6 pb-8">
                    <div className="flex flex-col items-center flex-shrink-0 z-10">
                      <div className="w-11 h-11 bg-zinc-900 text-white flex items-center justify-center text-xs font-bold leading-none flex-shrink-0">
                        <span style={{ fontSize: '10px', letterSpacing: '0.05em' }}>{m.year}</span>
                      </div>
                    </div>
                    <div className="pt-2.5">
                      <p className="text-sm text-zinc-600 leading-[1.75]">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Team */}
      {/* <section className="py-20 bg-zinc-50" id="team">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The People</p>
            <h2 className="section-title">Leadership Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="aspect-square overflow-hidden bg-zinc-100 mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </div>
                <h3 className="font-semibold text-zinc-900 text-sm">{member.name}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{member.role}</p>
                <p className="text-[11px] text-zinc-400 mt-1">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Sustainability */}
      {/* <section className="py-0 bg-zinc-950" id="sustainability">
        <div className="grid lg:grid-cols-2 min-h-[400px]">
          <div className="relative h-64 lg:h-auto overflow-hidden">
            <img
              src="https://media.istockphoto.com/id/511245761/photo/picking-up-the-pace.jpg?s=612x612&w=0&k=20&c=ldE-9wn8fiXwGv-w0APsrRXYD1w7s85rOjc_fRPssGw="
              alt="Sustainability"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="flex items-center px-8 md:px-14 py-16 md:py-20">
            <div className="max-w-md">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-zinc-500 mb-5">Responsibility</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-5 leading-[1.1]">
                Committed to<br />a greener future.
              </h2>
              <p className="text-zinc-400 leading-[1.8] mb-4">
                We believe cycling is inherently good for the planet, and we strive to match that ethos in our operations. From recycled packaging to solar-powered facilities, every decision at Cosmic considers our environmental impact.
              </p>
              <p className="text-zinc-500 leading-[1.8]">
                By 2030, we aim to achieve carbon neutrality across our entire manufacturing process.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Press */}
      {/* <section className="py-14 bg-white border-t border-zinc-100" id="press">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <p className="text-center section-label mb-8">As Seen In</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {['Cycling Weekly', 'Bike Magazine', 'CyclingNews', 'BikeRumor', 'Velo'].map((pub) => (
              <span key={pub} className="text-sm font-display font-semibold tracking-widest text-zinc-300 uppercase">
                {pub}
              </span>
            ))}
          </div>
        </div>
      </section> */}

      {/* Careers CTA */}
      <section className="py-16 bg-zinc-50 text-center">
        <div className="max-w-xl mx-auto px-5">
          <h3 className="font-display text-3xl font-semibold text-zinc-900 mb-4">Join the Cosmic story.</h3>
          <p className="text-zinc-500 mb-8 leading-[1.8]">We're always looking for passionate people to help us build the future of cycling.</p>
          <Link href="/careers" className="cosmic-btn-outline-dark group">
            View Open Positions
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
