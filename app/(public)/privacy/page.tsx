export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="text-white/80">We collect only what’s needed to deliver tutoring services and never sell personal data.</p>
      <div className="glass-card space-y-3 text-white/80 text-sm leading-relaxed">
        <p><strong className="text-white">Data we store:</strong> account info, session bookings, tutor profiles, and payments handled via PCI-compliant providers.</p>
        <p><strong className="text-white">Your controls:</strong> you can request export or deletion of your data anytime by emailing privacy@skillbridge.com.</p>
        <p><strong className="text-white">Cookies:</strong> we use essential cookies for auth and optional analytics to improve the product.</p>
      </div>
    </div>
  );
}
