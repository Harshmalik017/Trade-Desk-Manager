import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function AppFooter() {
  return (
    <footer className="mt-10 bg-gradient-to-r from-violet-700 via-violet-600 to-cyan-600 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandLogo />
            <p className="mt-3 max-w-xl text-sm text-violet-100">
              Professional trade-compliance support for EDPMS and IDPMS regularisation, reconciliation clarity, and
              structured closure workflows.
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Website</p>
            <div className="grid gap-2 text-sm">
              <Link href="/" className="text-violet-100 hover:text-white">
                Home
              </Link>
              <Link href="/about" className="text-violet-100 hover:text-white">
                About
              </Link>
              <Link href="/services" className="text-violet-100 hover:text-white">
                Services
              </Link>
              <Link href="/pricing" className="text-violet-100 hover:text-white">
                Pricing
              </Link>
              <Link href="/connect" className="text-violet-100 hover:text-white">
                Connect with us
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Compliance</p>
            <div className="grid gap-2 text-sm">
              <Link href="/privacy-policy" className="text-violet-100 hover:text-white">
                Privacy policy
              </Link>
              <Link href="/terms-and-conditions" className="text-violet-100 hover:text-white">
                Terms & conditions
              </Link>
              <Link href="/admin/login" className="text-violet-100 hover:text-white">
                Admin portal
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/20 pt-4 text-xs text-violet-100 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} BillClear Desk. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Phone size={13} /> 8800441855
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail size={13} /> desk@billcleardesk.demo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
