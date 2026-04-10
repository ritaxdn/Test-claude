'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Contact } from '@/types';
import Modal from '@/components/Modal';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  async function fetchContacts() {
    setLoading(true);
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    setContacts(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchContacts(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await supabase.from('contacts').insert({ ...form });
    setForm({ name: '', phone: '', email: '', company: '' });
    setSaving(false);
    setShowModal(false);
    fetchContacts();
  }

  const filtered = contacts.filter((c) =>
    [c.name, c.email, c.company, c.phone]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{contacts.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Contact
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search contacts…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      {/* List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">No contacts found.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/contacts/${c.id}`}
              className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow block"
            >
              <p className="font-semibold text-gray-800">{c.name}</p>
              {c.company && (
                <p className="text-sm text-indigo-500 mt-0.5">{c.company}</p>
              )}
              <div className="mt-3 space-y-1">
                {c.email && (
                  <p className="text-xs text-gray-500 truncate">{c.email}</p>
                )}
                {c.phone && (
                  <p className="text-xs text-gray-500">{c.phone}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add contact modal */}
      {showModal && (
        <Modal title="New Contact" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Name *', key: 'name', type: 'text' },
              { label: 'Company', key: 'company', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Phone', key: 'phone', type: 'tel' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save Contact'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
