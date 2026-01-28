import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-900">About SkillBridge</h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Connecting passionate learners with expert tutors to create meaningful
          learning experiences that drive real results.
        </p>
      </section>

      {/* Mission */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Mission</h2>
        <p className="text-slate-700 leading-relaxed">
          At SkillBridge, we believe that personalized, one-on-one learning is the
          most effective way to master new skills. Our platform bridges the gap
          between students seeking knowledge and tutors who are passionate about
          teaching. We're committed to creating a community where expertise meets
          ambition, and where every learning journey is supported by dedicated
          professionals.
        </p>
      </section>

      {/* Values */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🎯</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Quality First
            </h3>
            <p className="text-sm text-slate-600">
              We carefully vet all tutors to ensure they meet our high standards
              for expertise and teaching ability.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🤝</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Community Driven
            </h3>
            <p className="text-sm text-slate-600">
              Building a supportive learning community where students and tutors
              can grow together.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">✨</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Personalized Learning
            </h3>
            <p className="text-sm text-slate-600">
              Every session is tailored to your unique learning style, pace, and
              goals.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🚀</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Innovation
            </h3>
            <p className="text-sm text-slate-600">
              Continuously improving our platform to make learning more accessible
              and effective.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">💡</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Transparency
            </h3>
            <p className="text-sm text-slate-600">
              Clear pricing, honest reviews, and open communication between students
              and tutors.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🌍</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Accessibility
            </h3>
            <p className="text-sm text-slate-600">
              Making quality education accessible to everyone, regardless of
              location or background.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">SkillBridge by the Numbers</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-3xl font-semibold mb-1">300+</div>
            <div className="text-sm text-slate-300">Expert Tutors</div>
          </div>
          <div>
            <div className="text-3xl font-semibold mb-1">5,000+</div>
            <div className="text-sm text-slate-300">Students Served</div>
          </div>
          <div>
            <div className="text-3xl font-semibold mb-1">10,000+</div>
            <div className="text-sm text-slate-300">Sessions Completed</div>
          </div>
          <div>
            <div className="text-3xl font-semibold mb-1">4.8</div>
            <div className="text-sm text-slate-300">Average Rating</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          Ready to Start Learning?
        </h2>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          Join thousands of students who are already advancing their skills with
          SkillBridge. Find your perfect tutor today.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/tutors"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Browse Tutors
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Become a Tutor
          </Link>
        </div>
      </section>
    </div>
  );
}
