import Link from "next/link";

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
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {tutor.rating} ★
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
    </div>
  );
}
