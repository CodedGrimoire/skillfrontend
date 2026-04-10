export default function ContactPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Contact</h1>
      <p className="text-white/80 leading-relaxed">
        We reply within one business day. Tell us about your learning goals or partnership ideas and we’ll connect you with the right person.
      </p>
      <div className="glass-card space-y-3">
        <div>
          <p className="text-sm text-white/60 uppercase tracking-wide">Email</p>
          <p className="text-white">hello@skillbridge.com</p>
        </div>
        <div>
          <p className="text-sm text-white/60 uppercase tracking-wide">Phone</p>
          <p className="text-white">+1 (234) 567-890</p>
        </div>
        <div>
          <p className="text-sm text-white/60 uppercase tracking-wide">Office</p>
          <p className="text-white/80">123 Learning Street, Education City, EC 12345</p>
        </div>
      </div>
    </div>
  );
}
