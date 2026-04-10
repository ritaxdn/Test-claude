'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Note } from '@/types';

interface Props {
  notes: Note[];
  contactId?: string;
  dealId?: string;
  onAdded: () => void;
}

export default function NoteList({ notes, contactId, dealId, onAdded }: Props) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function addNote() {
    if (!content.trim()) return;
    setSaving(true);
    await supabase.from('notes').insert({
      content: content.trim(),
      contact_id: contactId ?? null,
      deal_id: dealId ?? null,
    });
    setContent('');
    setSaving(false);
    onAdded();
  }

  async function deleteNote(id: string) {
    await supabase.from('notes').delete().eq('id', id);
    onAdded();
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Notes
      </h3>

      {/* Add note */}
      <div className="flex gap-2">
        <textarea
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          rows={2}
          placeholder="Add a note…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={addNote}
          disabled={saving || !content.trim()}
          className="self-end px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Note list */}
      {notes.length === 0 ? (
        <p className="text-sm text-gray-400">No notes yet.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((n) => (
            <li
              key={n.id}
              className="bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 text-sm text-gray-700 flex justify-between items-start gap-3"
            >
              <p className="whitespace-pre-wrap flex-1">{n.content}</p>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => deleteNote(n.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
