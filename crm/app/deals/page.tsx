'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Deal, Contact, Note, PipelineStatus, PIPELINE_STAGES } from '@/types';
import Modal from '@/components/Modal';
import NoteList from '@/components/NoteList';

const STAGE_COLORS: Record<PipelineStatus, string> = {
  Lead:        'border-gray-300',
  Contacted:   'border-blue-300',
  Interested:  'border-yellow-300',
  Demo:        'border-purple-300',
  Negotiation: 'border-orange-300',
  Won:         'border-green-400',
  Lost:        'border-red-300',
};

const STAGE_HEADER_COLORS: Record<PipelineStatus, string> = {
  Lead:        'bg-gray-100 text-gray-600',
  Contacted:   'bg-blue-100 text-blue-700',
  Interested:  'bg-yellow-100 text-yellow-700',
  Demo:        'bg-purple-100 text-purple-700',
  Negotiation: 'bg-orange-100 text-orange-700',
  Won:         'bg-green-100 text-green-700',
  Lost:        'bg-red-100 text-red-600',
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Deal detail/notes panel
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealNotes, setDealNotes] = useState<Note[]>([]);

  // New deal modal
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '',
    value: '',
    status: 'Lead' as PipelineStatus,
    contact_id: '',
  });
  const [savingNew, setSavingNew] = useState(false);

  // Drag state
  const draggingId = useRef<string | null>(null);

  async function fetchDeals() {
    const { data } = await supabase
      .from('deals')
      .select('*, contacts(id, name, company)')
      .order('created_at', { ascending: false });
    setDeals((data as Deal[]) ?? []);
  }

  async function fetchContacts() {
    const { data } = await supabase
      .from('contacts')
      .select('id, name, company')
      .order('name');
    setContacts((data as Contact[]) ?? []);
  }

  async function fetchDealNotes(dealId: string) {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });
    setDealNotes(data ?? []);
  }

  useEffect(() => {
    Promise.all([fetchDeals(), fetchContacts()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDeal) fetchDealNotes(selectedDeal.id);
  }, [selectedDeal]);

  // Move a deal to a new stage
  async function moveToStage(dealId: string, newStatus: PipelineStatus) {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, status: newStatus } : d))
    );
    await supabase.from('deals').update({ status: newStatus }).eq('id', dealId);
    if (selectedDeal?.id === dealId) {
      setSelectedDeal((d) => (d ? { ...d, status: newStatus } : d));
    }
  }

  // Drag handlers
  function onDragStart(dealId: string) {
    draggingId.current = dealId;
  }

  function onDrop(stage: PipelineStatus) {
    if (!draggingId.current) return;
    moveToStage(draggingId.current, stage);
    draggingId.current = null;
  }

  // Add new deal
  async function handleAddDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.title.trim() || !newForm.contact_id) return;
    setSavingNew(true);
    await supabase.from('deals').insert({
      title: newForm.title.trim(),
      value: parseFloat(newForm.value) || 0,
      status: newForm.status,
      contact_id: newForm.contact_id,
    });
    setNewForm({ title: '', value: '', status: 'Lead', contact_id: '' });
    setSavingNew(false);
    setShowNewDeal(false);
    fetchDeals();
  }

  // Delete deal
  async function deleteDeal(dealId: string) {
    await supabase.from('deals').delete().eq('id', dealId);
    setSelectedDeal(null);
    fetchDeals();
  }

  const byStage = (stage: PipelineStatus) =>
    deals.filter((d) => d.status === stage);

  const totalValue = (stage: PipelineStatus) =>
    byStage(stage).reduce((s, d) => s + Number(d.value), 0);

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">{deals.length} deals</p>
        </div>
        <button
          onClick={() => setShowNewDeal(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Deal
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <div
            key={stage}
            className={`flex-shrink-0 w-56 bg-white rounded-2xl border-t-4 shadow-sm flex flex-col ${STAGE_COLORS[stage]}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(stage)}
          >
            {/* Column header */}
            <div className={`px-3 py-2 rounded-t-xl ${STAGE_HEADER_COLORS[stage]}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {stage}
                </span>
                <span className="text-xs font-medium bg-white/60 rounded-full px-2 py-0.5">
                  {byStage(stage).length}
                </span>
              </div>
              {byStage(stage).length > 0 && (
                <p className="text-xs opacity-70 mt-0.5">
                  ${totalValue(stage).toLocaleString()}
                </p>
              )}
            </div>

            {/* Deal cards */}
            <div className="flex flex-col gap-2 p-2 min-h-24">
              {byStage(stage).map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={() => onDragStart(deal.id)}
                  onClick={() => setSelectedDeal(deal)}
                  className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all active:opacity-70 select-none"
                >
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    {deal.title}
                  </p>
                  {deal.contacts && (
                    <p className="text-xs text-gray-400 mt-1">
                      {deal.contacts.name}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-indigo-600 mt-2">
                    ${Number(deal.value).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Deal detail side panel */}
      {selectedDeal && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col z-40">
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 truncate pr-4">
              {selectedDeal.title}
            </h2>
            <button
              onClick={() => setSelectedDeal(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Deal info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-600">
                  ${Number(selectedDeal.value).toLocaleString()}
                </span>
              </div>

              {selectedDeal.contacts && (
                <p className="text-sm text-gray-600">
                  Contact:{' '}
                  <span className="font-medium">{selectedDeal.contacts.name}</span>
                  {selectedDeal.contacts.company && (
                    <span className="text-gray-400">
                      {' '}· {selectedDeal.contacts.company}
                    </span>
                  )}
                </p>
              )}

              {/* Move stage */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={selectedDeal.status}
                  onChange={(e) =>
                    moveToStage(selectedDeal.id, e.target.value as PipelineStatus)
                  }
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes for this deal */}
            <NoteList
              notes={dealNotes}
              dealId={selectedDeal.id}
              onAdded={() => fetchDealNotes(selectedDeal.id)}
            />
          </div>

          {/* Delete */}
          <div className="px-6 py-4 border-t border-gray-100">
            <button
              onClick={() => {
                if (confirm('Delete this deal? This cannot be undone.')) {
                  deleteDeal(selectedDeal.id);
                }
              }}
              className="text-sm text-red-400 hover:text-red-600"
            >
              Delete deal
            </button>
          </div>
        </div>
      )}

      {/* New deal modal */}
      {showNewDeal && (
        <Modal title="New Deal" onClose={() => setShowNewDeal(false)}>
          <form onSubmit={handleAddDeal} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Contact *
              </label>
              <select
                value={newForm.contact_id}
                onChange={(e) =>
                  setNewForm((f) => ({ ...f, contact_id: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">Select a contact…</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.company ? ` (${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Deal Title *
              </label>
              <input
                type="text"
                value={newForm.title}
                onChange={(e) =>
                  setNewForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Laser System Purchase"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Value ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newForm.value}
                onChange={(e) =>
                  setNewForm((f) => ({ ...f, value: e.target.value }))
                }
                placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Stage
              </label>
              <select
                value={newForm.status}
                onChange={(e) =>
                  setNewForm((f) => ({
                    ...f,
                    status: e.target.value as PipelineStatus,
                  }))
                }
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
                onClick={() => setShowNewDeal(false)}
                className="px-4 py-2 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingNew || !newForm.title.trim() || !newForm.contact_id}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {savingNew ? 'Saving…' : 'Add Deal'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
