'use client';

import { useState, useEffect } from 'react';
import { Save, Loader as Loader2, TriangleAlert as AlertTriangle, ToggleLeft, ToggleRight, Plus, Trash2 } from 'lucide-react';
import { getAllSettings, setSettings } from '@/lib/api/settings';
import AdminToast from '@/components/admin/AdminToast';

interface SocialLink { platform: string; url: string }

interface SettingsState {
  company_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  footer_about: string;
  footer_copyright: string;
  maintenance_mode: boolean;
  social_links: SocialLink[];
}

const defaultState: SettingsState = {
  company_name: 'Cosmic Bicycles',
  tagline: 'Sky Is The Limit',
  email: 'info@cosmicbicycles.com',
  phone: '',
  address: '',
  footer_about: '',
  footer_copyright: '',
  maintenance_mode: false,
  social_links: [],
};

export default function SettingsPage() {
  const [settings, setSettingsState] = useState<SettingsState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'footer' | 'advanced'>('general');

  useEffect(() => {
    getAllSettings().then((data) => {
      setSettingsState({
        company_name: data.company_name ?? defaultState.company_name,
        tagline: data.tagline ?? defaultState.tagline,
        email: data.email ?? defaultState.email,
        phone: data.phone ?? '',
        address: data.address ?? '',
        footer_about: data.footer_about ?? '',
        footer_copyright: data.footer_copyright ?? '',
        maintenance_mode: data.maintenance_mode === 'true',
        social_links: data.social_links ? JSON.parse(data.social_links) : [],
      });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    const { error } = await setSettings({
      company_name: settings.company_name,
      tagline: settings.tagline,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      footer_about: settings.footer_about,
      footer_copyright: settings.footer_copyright,
      maintenance_mode: String(settings.maintenance_mode),
      social_links: JSON.stringify(settings.social_links),
    });
    setSaving(false);
    if (error) { setToast({ msg: error.message, type: 'error' }); return; }
    setToast({ msg: 'Settings saved successfully.', type: 'success' });
  }

  const updateSocial = (i: number, key: 'platform' | 'url', value: string) => {
    setSettingsState((p) => {
      const links = [...p.social_links];
      links[i] = { ...links[i], [key]: value };
      return { ...p, social_links: links };
    });
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'social', label: 'Social Links' },
    { id: 'footer', label: 'Footer' },
    { id: 'advanced', label: 'Advanced' },
  ] as const;

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Site Settings</h2>
          <p className="text-sm text-zinc-400 mt-0.5">Manage global site configuration and contact information.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm font-semibold hover:bg-[#D61C1C] transition-colors disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
        </button>
      </div>

      <div className="flex border-b border-zinc-200 mb-6 gap-0">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.id ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl space-y-5">
        {activeTab === 'general' && (
          <>
            <div><label className="admin-label">Company Name</label><input className="admin-input" value={settings.company_name} onChange={(e) => setSettingsState((p) => ({ ...p, company_name: e.target.value }))} /></div>
            <div><label className="admin-label">Brand Tagline</label><input className="admin-input" value={settings.tagline} onChange={(e) => setSettingsState((p) => ({ ...p, tagline: e.target.value }))} /></div>
            <div><label className="admin-label">Contact Email</label><input type="email" className="admin-input" value={settings.email} onChange={(e) => setSettingsState((p) => ({ ...p, email: e.target.value }))} /></div>
            <div><label className="admin-label">Contact Phone</label><input className="admin-input" value={settings.phone} onChange={(e) => setSettingsState((p) => ({ ...p, phone: e.target.value }))} /></div>
            <div><label className="admin-label">Company Address</label><textarea className="admin-input min-h-[80px] resize-y" value={settings.address} onChange={(e) => setSettingsState((p) => ({ ...p, address: e.target.value }))} /></div>
          </>
        )}

        {activeTab === 'social' && (
          <div className="space-y-3">
            {settings.social_links.map((link, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input className="admin-input w-36" value={link.platform} onChange={(e) => updateSocial(i, 'platform', e.target.value)} placeholder="Platform" />
                <input className="admin-input flex-1" value={link.url} onChange={(e) => updateSocial(i, 'url', e.target.value)} placeholder="URL" />
                <button onClick={() => setSettingsState((p) => ({ ...p, social_links: p.social_links.filter((_, idx) => idx !== i) }))} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-zinc-200 transition-colors flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button onClick={() => setSettingsState((p) => ({ ...p, social_links: [...p.social_links, { platform: '', url: '' }] }))} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-dashed border-zinc-300 px-4 py-2.5 hover:border-zinc-500 transition-colors w-full justify-center">
              <Plus className="w-3.5 h-3.5" /> Add Social Link
            </button>
          </div>
        )}

        {activeTab === 'footer' && (
          <>
            <div><label className="admin-label">Footer About Text</label><textarea className="admin-input min-h-[80px] resize-y" value={settings.footer_about} onChange={(e) => setSettingsState((p) => ({ ...p, footer_about: e.target.value }))} /></div>
            <div><label className="admin-label">Copyright Text</label><input className="admin-input" value={settings.footer_copyright} onChange={(e) => setSettingsState((p) => ({ ...p, footer_copyright: e.target.value }))} /></div>
          </>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between p-5 bg-white border border-zinc-200">
              <div>
                <p className="text-sm font-semibold text-zinc-900 mb-1">Maintenance Mode</p>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">When enabled, visitors will see a maintenance page. Admin access remains unaffected.</p>
              </div>
              <button onClick={() => setSettingsState((p) => ({ ...p, maintenance_mode: !p.maintenance_mode }))} className="flex items-center gap-2 flex-shrink-0 ml-4">
                {settings.maintenance_mode
                  ? <><ToggleRight className="w-8 h-8 text-[#D61C1C]" /><span className="text-xs font-semibold text-[#D61C1C]">On</span></>
                  : <><ToggleLeft className="w-8 h-8 text-zinc-400" /><span className="text-xs text-zinc-400">Off</span></>}
              </button>
            </div>
            {settings.maintenance_mode && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">Maintenance mode is currently <strong>enabled</strong>. Public visitors cannot access the site. Save settings to apply changes.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
