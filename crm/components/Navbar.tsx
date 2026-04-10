'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',         label: 'Dashboard' },
  { href: '/contacts', label: 'Contacts'  },
  { href: '/deals',    label: 'Pipeline'  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-8">
      <span className="text-lg font-semibold text-indigo-600 tracking-tight">
        AesthCRM
      </span>
      <div className="flex gap-6">
        {links.map(({ href, label }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                active
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
