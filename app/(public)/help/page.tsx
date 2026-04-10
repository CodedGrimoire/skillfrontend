const faqs = [
  {
    q: "How do bookings work?",
    a: "Choose a tutor, pick an available time slot, and confirm. You’ll receive confirmation instantly and reminders before the session.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes. Tutors can set their own policy, but most allow rescheduling at least 12 hours before the session.",
  },
  {
    q: "How are tutors vetted?",
    a: "We review subject expertise, teaching samples, and student references before a tutor goes live.",
  },
  {
    q: "How do payments work?",
    a: "Payment is secured at booking. Funds are released to tutors after the session is completed.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Help Center</h1>
        <p className="text-white/80">Guides and quick answers for learners and tutors.</p>
      </header>
      <div className="grid gap-4">
        {faqs.map((item) => (
          <div key={item.q} className="glass-card">
            <h3 className="text-lg font-semibold text-white">{item.q}</h3>
            <p className="text-sm text-white/70 mt-2">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
