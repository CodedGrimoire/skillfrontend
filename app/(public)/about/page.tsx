export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">About SkillBridge</h1>
      <p className="text-white/80 leading-relaxed">
        SkillBridge connects motivated learners with vetted expert tutors so every session delivers clear outcomes. We focus on quality, transparency, and support across technology, design, business, and academic subjects.
      </p>
      <div className="glass-card space-y-3">
        <h2 className="text-xl font-semibold text-white">What makes us different</h2>
        <ul className="list-disc list-inside text-white/80 space-y-1">
          <li>Curated tutor onboarding with subject checks and teaching demos.</li>
          <li>Clear pricing and availability before you book.</li>
          <li>Session follow-ups and progress notes to keep momentum.</li>
          <li>Supportive community events and resources for continuous growth.</li>
        </ul>
      </div>
    </div>
  );
}
