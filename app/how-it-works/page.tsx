import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Browse & Discover",
    description:
      "Explore our curated list of expert tutors across various subjects. Filter by category, price, ratings, and availability to find the perfect match for your learning goals.",
    icon: "🔍",
  },
  {
    number: "2",
    title: "Choose Your Tutor",
    description:
      "Review tutor profiles, read student reviews, and check their availability. Each tutor profile includes their expertise, hourly rate, ratings, and teaching style.",
    icon: "👤",
  },
  {
    number: "3",
    title: "Book a Session",
    description:
      "Select your preferred date and time slot from the tutor's availability. Confirm your booking and receive instant confirmation with all session details.",
    icon: "📅",
  },
  {
    number: "4",
    title: "Learn & Grow",
    description:
      "Attend your personalized session via video call or in-person (if available). Get hands-on guidance, ask questions, and accelerate your learning journey.",
    icon: "🎓",
  },
];

const features = [
  {
    title: "Flexible Scheduling",
    description:
      "Book sessions that fit your schedule. Tutors offer availability across different time zones and days.",
  },
  {
    title: "Secure Payments",
    description:
      "All transactions are processed securely. Pay per session with transparent pricing and no hidden fees.",
  },
  {
    title: "Progress Tracking",
    description:
      "Track your learning progress, review past sessions, and see your improvement over time.",
  },
  {
    title: "24/7 Support",
    description:
      "Our support team is always ready to help with any questions or issues you might encounter.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-900">How It Works</h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Getting started with SkillBridge is simple. Follow these four easy steps
          to begin your learning journey with expert tutors.
        </p>
      </section>

      {/* Steps */}
      <section className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-2xl font-semibold text-white shadow-lg">
                  {step.number}
                </div>
                <div className="text-4xl sm:hidden">{step.icon}</div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl hidden sm:inline">{step.icon}</span>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {step.title}
                  </h2>
                </div>
                <p className="text-slate-700 leading-relaxed">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="mt-8 flex justify-center">
                <div className="h-8 w-0.5 bg-gradient-to-b from-slate-300 to-slate-200" />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Why Choose SkillBridge?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Tutors */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Are You a Tutor?
        </h2>
        <p className="text-slate-700 mb-6 leading-relaxed">
          Join our community of expert tutors and help students achieve their
          learning goals. Set your own rates, manage your availability, and build
          your teaching reputation through student reviews.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Become a Tutor
        </Link>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          Ready to Get Started?
        </h2>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          Start your learning journey today. Browse our tutors and book your first
          session in minutes.
        </p>
        <Link
          href="/tutors"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Find Your Tutor
        </Link>
      </section>
    </div>
  );
}
