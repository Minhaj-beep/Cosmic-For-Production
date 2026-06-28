'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, X, Check, Upload, ChevronRight, ChevronDown, Briefcase } from 'lucide-react';
import { getPublicVacancies, submitApplication, uploadResumeFile, type Vacancy } from '@/lib/api/vacancies';

type Career = Vacancy;

interface AppForm {
  experience: string;
  name: string; email: string; phone: string; linkedin: string; coverLetter: string; resumeName: string;
}
interface AppErrors {
  name?: string; email?: string; phone?: string; coverLetter?: string; resumeName?: string;
}

const whyItems = [
  { title: 'Every voice counts', desc: "Your ideas won't get lost in layers of hierarchy." },
  { title: 'Direct impact', desc: 'See your work shape products and culture in real time.' },
  { title: 'Agility', desc: 'We move quickly, experiment boldly, and celebrate wins together.' },
  { title: 'Growth with us', desc: 'As Cosmic expands, so will your opportunities.' },
];

const snapshot = [
  { label: 'A close-knit crew of passionate members' },
  { label: '8 versatile departments working hand in hand' },
  { label: '3 offices across India keeping us connected' },
];

export default function CareersClient() {
  const [careers, setCareers] = useState<Vacancy[]>([]);
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [applyJob, setApplyJob] = useState<Career | null>(null);
  const [appForm, setAppForm] = useState<AppForm>({ name: '', email: '', phone: '', linkedin: '', coverLetter: '', resumeName: '', experience: '' });
  const [appErrors, setAppErrors] = useState<AppErrors>({});
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const resumeFileRef = useRef<File | null>(null);
  const [department, setDepartment] = useState('All');

  useEffect(() => {
    getPublicVacancies().then(({ data }) => setCareers(data));
  }, []);

  const departments = ['All', ...Array.from(new Set(careers.map((c) => c.department)))];
  const filtered = department === 'All' ? careers : careers.filter((c) => c.department === department);

  const setField = (key: keyof AppForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setAppForm((f) => ({ ...f, [key]: e.target.value }));

  const validateApp = (): boolean => {
    const e: AppErrors = {};
    if (!appForm.name.trim()) e.name = 'Required';
    if (!appForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appForm.email)) e.email = 'Valid email required';
    if (!appForm.phone.trim()) e.phone = 'Required';
    if (!appForm.coverLetter.trim()) e.coverLetter = 'Required';
    if (!appForm.resumeName) e.resumeName = 'Please attach your resume';
    setAppErrors(e);
    return !Object.keys(e).length;
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateApp()) return;
    setAppLoading(true);

    let resumeUrl = '';
    if (resumeFileRef.current) {
      setUploadingResume(true);
      const { url, error } = await uploadResumeFile(resumeFileRef.current);
      setUploadingResume(false);
      if (error || !url) {
        setAppErrors((prev) => ({ ...prev, resumeName: 'Upload failed. Please try again.' }));
        setAppLoading(false);
        return;
      }
      resumeUrl = url;
    }

    await submitApplication({
      vacancy_id: applyJob?.id ?? null,
      name: appForm.name,
      email: appForm.email,
      phone: appForm.phone,
      experience: appForm.experience,
      cover_letter: appForm.coverLetter,
      resume_url: resumeUrl,
    });
    setAppLoading(false);
    setAppSubmitted(true);
  };

  const openApply = (job: Career) => {
    setApplyJob(job);
    setAppForm({ name: '', email: '', phone: '', linkedin: '', coverLetter: '', resumeName: '', experience: '' });
    resumeFileRef.current = null;
    setAppErrors({});
    setAppSubmitted(false);
    setShowModal(true);
    setSelectedJob(null);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg" alt="" className="w-full h-full object-cover" aria-hidden />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-5 lg:px-10">
          <nav className="flex items-center gap-1.5 text-[11px] text-zinc-600 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Careers</span>
          </nav>
          <p className="section-label text-zinc-600 mb-3">Join the Team</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-5 leading-[1.05]">
            Build Your Future<br />with Cosmic
          </h1>
          <p className="text-zinc-400 max-w-lg leading-[1.8] text-[15px]">
            We're shaping the future of cycling — one extraordinary bike at a time. Be part of the journey, and ride your career forward with us.
          </p>
        </div>
      </section>

      {/* Our Team Snapshot */}
      <section className="py-14 bg-white border-b border-zinc-100">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <p className="section-label mb-8 text-center">Our Team Snapshot</p>
          <div className="grid md:grid-cols-3 gap-px bg-zinc-100">
            {snapshot.map((item) => (
              <div key={item.label} className="bg-white px-8 py-8 text-center">
                <p className="text-sm font-medium text-zinc-700 leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work Here */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="max-w-2xl mx-auto">
            <p className="section-label mb-3 text-center">Why Work Here</p>
            <div className="space-y-5 mt-8">
              {whyItems.map((item, i) => (
                <div key={item.title} className="flex items-start gap-5 bg-white border border-zinc-100 px-6 py-5 hover:border-zinc-300 transition-colors">
                  <span className="text-[11px] font-bold text-zinc-300 tracking-widest mt-0.5 w-5 flex-shrink-0">0{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 mb-1">{item.title}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 border-l-2 border-[#D61C1C] pl-5">
              <p className="text-zinc-600 italic text-[15px] leading-relaxed">
                "We're growing, and we'd love you to grow with us."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
            <div>
              <p className="section-label mb-1">Current Openings</p>
              <h2 className="font-display text-3xl font-semibold text-zinc-900">
                {filtered.length} Open Position{filtered.length !== 1 ? 's' : ''}
              </h2>
            </div>
            <div className="md:ml-auto flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {departments.map((d) => (
                <button
                  key={d}
                  onClick={() => setDepartment(d)}
                  className={`px-4 py-1.5 text-xs font-semibold border whitespace-nowrap transition-all ${
                    department === d ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((job) => (
              <div key={job.id} className="border border-zinc-100 hover:border-zinc-300 transition-colors overflow-hidden">
                <div
                  className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-900 text-[15px]">{job.title}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 text-zinc-600">{job.type}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span>{job.department}</span>
                      <span>{job.experience} exp.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); openApply(job); }}
                      className="px-5 py-2.5 text-white text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors bg-[#D61C1C] hover:bg-[#B01515]"
                    >
                      Apply
                    </button>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${selectedJob?.id === job.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {selectedJob?.id === job.id && (
                  <div className="border-t border-zinc-100 p-5 md:p-6 bg-zinc-50">
                    <p className="text-sm text-zinc-600 leading-[1.8] mb-6">{job.description}</p>
                    <div>
                      <h4 className="label-field mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-zinc-600">
                            <Check className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={() => openApply(job)} className="mt-6 cosmic-btn-primary group">
                      Apply for This Role
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 border border-zinc-100">
                <Briefcase className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
                <p className="text-zinc-400">No open positions in this department right now.</p>
                <button onClick={() => setDepartment('All')} className="mt-2 text-sm text-zinc-600 underline">View all departments</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showModal && applyJob && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
          <div
            className="bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 sticky top-0 bg-white z-10">
              <div>
                <p className="text-[10px] text-zinc-400 mb-0.5 tracking-widest uppercase">Applying for</p>
                <h3 id="modal-title" className="font-display text-xl font-semibold text-zinc-900">{applyJob.title}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {appSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-zinc-900 mb-3">Application Received!</h3>
                  <p className="text-zinc-500 mb-6 leading-[1.8] text-sm">
                    Thank you for applying to <strong>{applyJob.title}</strong>. Our HR team will review your application and reach out within 7–10 business days.
                  </p>
                  <button onClick={() => setShowModal(false)} className="cosmic-btn-primary">Close</button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-field" htmlFor="app-name">Full Name *</label>
                      <input id="app-name" type="text" value={appForm.name} onChange={setField('name')}
                        className={`input-field ${appErrors.name ? 'input-field-error' : ''}`} />
                      {appErrors.name && <p className="text-xs text-red-500 mt-1">{appErrors.name}</p>}
                    </div>
                    <div>
                      <label className="label-field" htmlFor="app-email">Email *</label>
                      <input id="app-email" type="email" value={appForm.email} onChange={setField('email')}
                        className={`input-field ${appErrors.email ? 'input-field-error' : ''}`} />
                      {appErrors.email && <p className="text-xs text-red-500 mt-1">{appErrors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-field" htmlFor="app-phone">Phone *</label>
                      <input id="app-phone" type="tel" value={appForm.phone} onChange={setField('phone')}
                        className={`input-field ${appErrors.phone ? 'input-field-error' : ''}`} />
                      {appErrors.phone && <p className="text-xs text-red-500 mt-1">{appErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="label-field" htmlFor="app-linkedin">Experience</label>
                      <input id="app-linkedin" type="url" value={appForm.experience} onChange={setField('experience')}
                         className="input-field" />
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Resume / CV *</label>
                    <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed cursor-pointer transition-colors hover:border-zinc-500 ${appErrors.resumeName ? 'border-red-300' : appForm.resumeName ? 'border-zinc-400 bg-zinc-50' : 'border-zinc-200'}`}>
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            resumeFileRef.current = file;
                            setAppForm((f) => ({ ...f, resumeName: file.name }));
                          }
                        }} />
                      {appForm.resumeName ? (
                        <div className="flex items-center gap-2 text-zinc-700">
                          <Check className="w-4 h-4 text-[#D61C1C]" />
                          <span className="text-sm font-medium">{appForm.resumeName}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-zinc-300 mb-2" />
                          <span className="text-sm text-zinc-500">Click to upload PDF or Word</span>
                          <span className="text-xs text-zinc-400 mt-1">Max 10MB</span>
                        </>
                      )}
                    </label>
                    {appErrors.resumeName && <p className="text-xs text-red-500 mt-1">{appErrors.resumeName}</p>}
                  </div>

                  <div>
                    <label className="label-field" htmlFor="app-cover">Cover Letter *</label>
                    <textarea id="app-cover" rows={4} value={appForm.coverLetter} onChange={setField('coverLetter')}
                      placeholder="Tell us why you'd be a great fit for this role..."
                      className={`input-field resize-none ${appErrors.coverLetter ? 'input-field-error' : ''}`} />
                    {appErrors.coverLetter && <p className="text-xs text-red-500 mt-1">{appErrors.coverLetter}</p>}
                  </div>

                  <button type="submit" disabled={appLoading || uploadingResume}
                    className="w-full cosmic-btn-primary justify-center disabled:opacity-50 group">
                    {uploadingResume ? 'Uploading resume...' : appLoading ? 'Submitting...' : (<>Submit Application <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>)}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
