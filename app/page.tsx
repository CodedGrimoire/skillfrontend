import Link from "next/link";
import {
  SearchIcon,
  UserIcon,
  CalendarIcon,
  GraduationCapIcon,
  TargetIcon,
  HandshakeIcon,
  SparklesIcon,
  RocketIcon,
  LightbulbIcon,
  GlobeIcon,
  StarIcon,
} from "@/components/ui/Icons";

const featuredTutors = [
  { name: "Ava Thompson", subject: "Data Science", rating: "4.9", price: "$45/hr" },
  { name: "Liam Carter", subject: "Full-Stack JS", rating: "4.8", price: "$40/hr" },
  { name: "Sofia Patel", subject: "UI/UX Design", rating: "4.7", price: "$38/hr" },
];

const categories = [
  "Web Development",
  "Data Science",
  "AI & ML",
  "UI/UX Design",
  "Business & Marketing",
  "Language Learning",
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-6 py-16 text-white shadow-lg">
        <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="max-w-3xl space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-200">
            SkillBridge
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Connect with Expert Tutors, Learn Anything
          </h1>
          <p className="max-w-2xl text-lg text-slate-200/80">
            Discover vetted tutors across technology, design, business, and more.
            Book personalized sessions and level up faster with guidance that fits
            your goals.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/tutors"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Browse Tutors
            </Link>
            <span className="text-sm text-slate-200/80">
              300+ tutors ready to teach today
            </span>
          </div>
        </div>
      </section>

      {/* Search UI */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Find your tutor</h2>
            <p className="text-sm text-slate-600">
              Search by subject, level, or tutor name. (UI only)
            </p>
          </div>
          <form className="flex w-full flex-col gap-3 sm:w-1/2 sm:flex-row">
            <input
              type="text"
              placeholder="What do you want to learn?"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-inner outline-none ring-0 transition focus:border-slate-400 focus:bg-slate-50"
            />
            <button
              type="button"
              className="whitespace-nowrap rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Featured Tutors</h2>
          <Link
            href="/tutors"
            className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTutors.map((tutor) => (
            <div
              key={tutor.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-100" />
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {tutor.rating} <StarIcon className="h-3 w-3 fill-emerald-700" />
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">{tutor.name}</h3>
                <p className="text-sm text-slate-600">{tutor.subject}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                <span>{tutor.price}</span>
                <button className="text-slate-900 underline underline-offset-4">
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Popular Categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="space-y-8 scroll-mt-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">How It Works</h2>
          <p className="text-slate-600">
            Getting started with SkillBridge is simple. Follow these four easy steps
            to begin your learning journey with expert tutors.
          </p>
        </div>
        <div className="space-y-6">
          {[
            {
              number: "1",
              title: "Browse & Discover",
              description:
                "Explore our curated list of expert tutors across various subjects. Filter by category, price, ratings, and availability to find the perfect match for your learning goals.",
              Icon: SearchIcon,
            },
            {
              number: "2",
              title: "Choose Your Tutor",
              description:
                "Review tutor profiles, read student reviews, and check their availability. Each tutor profile includes their expertise, hourly rate, ratings, and teaching style.",
              Icon: UserIcon,
            },
            {
              number: "3",
              title: "Book a Session",
              description:
                "Select your preferred date and time slot from the tutor's availability. Confirm your booking and receive instant confirmation with all session details.",
              Icon: CalendarIcon,
            },
            {
              number: "4",
              title: "Learn & Grow",
              description:
                "Attend your personalized session via video call or in-person (if available). Get hands-on guidance, ask questions, and accelerate your learning journey.",
              Icon: GraduationCapIcon,
            },
          ].map((step, index) => {
            const IconComponent = step.Icon;
            return (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-lg font-semibold text-white shadow-lg">
                      {step.number}
                    </div>
                    <div className="text-slate-600 sm:hidden">
                      <IconComponent className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="hidden text-slate-600 sm:inline">
                        <IconComponent className="h-6 w-6" />
                      </span>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className="space-y-8 scroll-mt-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">About SkillBridge</h2>
          <p className="text-slate-600">
            Connecting passionate learners with expert tutors to create meaningful
            learning experiences that drive real results.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Our Mission</h3>
          <p className="text-slate-700 leading-relaxed">
            At SkillBridge, we believe that personalized, one-on-one learning is the
            most effective way to master new skills. Our platform bridges the gap
            between students seeking knowledge and tutors who are passionate about
            teaching. We're committed to creating a community where expertise meets
            ambition, and where every learning journey is supported by dedicated
            professionals.
          </p>
        </div>

        {/* Values */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">Our Values</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                Icon: TargetIcon,
                title: "Quality First",
                description:
                  "We carefully vet all tutors to ensure they meet our high standards for expertise and teaching ability.",
              },
              {
                Icon: HandshakeIcon,
                title: "Community Driven",
                description:
                  "Building a supportive learning community where students and tutors can grow together.",
              },
              {
                Icon: SparklesIcon,
                title: "Personalized Learning",
                description:
                  "Every session is tailored to your unique learning style, pace, and goals.",
              },
              {
                Icon: RocketIcon,
                title: "Innovation",
                description:
                  "Continuously improving our platform to make learning more accessible and effective.",
              },
              {
                Icon: LightbulbIcon,
                title: "Transparency",
                description:
                  "Clear pricing, honest reviews, and open communication between students and tutors.",
              },
              {
                Icon: GlobeIcon,
                title: "Accessibility",
                description:
                  "Making quality education accessible to everyone, regardless of location or background.",
              },
            ].map((value) => {
              const IconComponent = value.Icon;
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 text-slate-600">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    {value.title}
                  </h4>
                  <p className="text-sm text-slate-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
          <h3 className="text-xl font-semibold mb-6">SkillBridge by the Numbers</h3>
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
        </div>
      </section>
    </div>
  );
}
