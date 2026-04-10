export type PipelineStatus =
  | 'Lead'
  | 'Contacted'
  | 'Interested'
  | 'Demo'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export const PIPELINE_STAGES: PipelineStatus[] = [
  'Lead',
  'Contacted',
  'Interested',
  'Demo',
  'Negotiation',
  'Won',
  'Lost',
];

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  created_at: string;
}

export interface Deal {
  id: string;
  contact_id: string;
  title: string;
  value: number;
  status: PipelineStatus;
  created_at: string;
  contacts?: Contact; // joined
}

export interface Note {
  id: string;
  contact_id: string | null;
  deal_id: string | null;
  content: string;
  created_at: string;
}
