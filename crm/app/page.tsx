import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function DashboardPage() {
  const [{ count: contactCount }, { count: dealCount }, { data: deals }] =
    await Promise.all([
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('deals').select('*', { count: 'exact', head: true }),
      supabase.from('deals').select('value, status'),
    ]);

  const wonValue = (deals ?? [])
    .filter((d) => d.status === 'Won')
    .reduce((sum, d) => sum + Number(d.value), 0);

  const openDeals = (deals ?? []).filter(
    (d) => d.status !== 'Won' && d.status !== 'Lost'
  ).length;

  const stats = [
    { label: 'Total Contacts', value: contactCount ?? 0, href: '/contacts' },
    { label: 'Total Deals', value: dealCount ?? 0, href: '/deals' },
    { label: 'Open Deals', value: openDeals, href: '/deals' },
    {
      label: 'Revenue Won',
      value: `$${wonValue.toLocaleString()}`,
      href: '/deals',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Medical Aesthetic Machines CRM
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          href="/contacts"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          View Contacts
        </Link>
        <Link
          href="/deals"
          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          View Pipeline
        </Link>
      </div>
    </div>
  );
}
