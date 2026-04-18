import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-bold text-lg">pharmaci</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bangladesh's trusted online pharmacy. Delivering medicines and health products nationwide.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Privacy Policy', 'Terms & Conditions', 'Return & Refund Policy'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              {['My Account', 'My Orders', 'Special Offers', 'Register the Pharmacy'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Hotline: 16516</li>
              <li>WhatsApp: 01XXX-XXXXXX</li>
              <li>Email: support@pharmaci.com</li>
              <li className="pt-2">
                <div className="flex gap-2">
                  {['Play Store', 'App Store'].map((s) => (
                    <span key={s} className="bg-gray-700 text-xs px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2025 Pharmaci. All rights reserved.</p>
          <p>Trade License: TRAD/DNCC/XXXXX</p>
        </div>
      </div>
    </footer>
  );
}
