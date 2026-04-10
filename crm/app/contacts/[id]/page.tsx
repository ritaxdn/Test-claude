'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Contact, Deal, Note, PIPELINE_STAGES } from '@/types';
import NoteList from '@/components/NoteList';
import Modal from '@/components/Modal';

const STATUS_COLORS: Record<string, string> = {
  Lead:        'bg-gray-100 text-gray-600',
  Contacted:   'bg-blue-100 text-blue-600',
  Interested:  'bg-yellow-100 text-yellow-700',
  Demo:        'bg-purple-100 text-purple-600',
  Negotiation: 'bg-orange-100 text-orange-600',
  Won:         'bg-green-100 text-green-700',
  Lost:        'bg-red-100 text-red-500',
};

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [contact, setContact] = useState<Contact | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Deal modal state
  const [showDealModal, setShowDealModal] = useState(false);
  const [dealForm, setDealForm] = useState({ title: '', value: '', status: 'Lead' });
  const [savingDeal, setSavingDeal] = useState(false);

  // Edit contact modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '', company: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  async function fetchAll() {
    const [{ data: c }, { data: d }, { data: n }] = await Promise.all([
      supabase.from('contacts').select('*').eq('id', id).single(),
      supabase.from('deals').select('*').eq('contact_id', id).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('contact_id', id).order('created_at', { ascending: false }),
    ]);
    setContact(c);
    setDeals(d ?? []);
    setNotes(n ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, [id]);

  async function handleAddDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!dealForm.title.trim()) return;
    setSavingDeal(true);
    await supabase.from('deals').insert({
      contact_id: id,
      title: dealForm.title.trim(),
      value: parseFloat(dealForm.value) || 0,
      status: dealForm.status,
    });
    setDealForm({ title: '', value: '', status: 'Lead' });
    setSavingDeal(false);
    setShowDealModal(false);
    fetchAll();
  }

  async function handleEditContact(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name.trim()) return;
    setSavingEdit(true);
    await supabase.from('contacts').update(editForm).eq('id', id);
    setSavingEdit(false);
    setShowEditModal(false);
    fetchAll();
  }

  function openEdit() {
    if (!contact) return;
    setEditForm({
      name: contact.name,
      phone: contact.phone ?? '',
      email: contact.email ?? '',
      company: contact.company ?? '',
    });
    setShowEditModal(true);
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;
  if (!contact) return <p className="text-sm text-gray-500">Contact not found.</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Back */}
      <Link href="/contacts" className="text-sm text-indigo-500 hover:underline">
        ← Back to Contacts
      </Link>

      {/* Contact header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{contact.name}</h1>
            {contact.company && (
              <p className="text-indigo-500 text-sm mt-0.5">{contact.company}</p>
            )}
          </div>
          <button
            onClick={openEdit}
            className="text-sm text-gray-400 hover:text-indigo-600 border border-gray-200 rounded-lg px-3 py-1"
          >
            Edit
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.phone && <span>📞 {contact.phone}</span>}
        </div>
      </div>

      {/* Deals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Deals ({deals.length})
          </h2>
          <button
            onClick={() => setShowDealModal(true)}
            className="text-sm text-indigo-600 hover:underline"
          >
            + Add Deal
          </button>
        </div>

        {deals.length === 0 ? (
          <p className="text-sm text-gray-400">No deals yet.</p>
        ) : (
          <div className="space-y-2">
            {deals.map((d) => (
              <Link
                key={d.id}
                href={`/deals?highlight=${d.id}`}
                className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-gray-800">{d.title}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">
                    ${Number(d.value).toLocaleString()}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[d.status] ?? ''}`}
                  >
                    {d.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <NoteList notes={notes} contactId={id} onAdded={fetchAll} />

      {/* Add Deal modal */}
      {showDealModal && (
        <Modal title="New Deal" onClose={() => setShowDealModal(false)}>
          <form onSubmit={handleAddDeal} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input
                type="text"
                value={dealForm.title}
                onChange={(e) => setDealForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. HIFU Machine Interest"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Value ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={dealForm.value}
                onChange={(e) => setDealForm((f) => ({ ...f, value: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stage</label>
              <select
                value={dealForm.status}
                onChange={(e) => setDealForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDealModal(false)}
                className="px-4 py-2 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingDeal || !dealForm.title.trim()}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {savingDeal ? 'Saving…' : 'Add Deal'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Contact modal */}
      {showEditModal && (
        <Modal title="Edit Contact" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEditContact} className="space-y-4">
            {[
              { label: 'Name *', key: 'name', type: 'text' },
              { label: 'Company', key: 'company', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Phone', key: 'phone', type: 'tel' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  value={editForm[key as keyof typeof editForm]}
                  onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm text-gray-600">
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit || !editForm.name.trim()}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {savingEdit ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
