import Link from "next/link";

const posts = [
  {
    title: "Choosing the right tutor for career pivots",
    summary: "How to evaluate experience, teaching style, and project relevance when you’re changing fields.",
    href: "/tutors",
  },
  {
    title: "Structuring a 60-minute session",
    summary: "A proven agenda to cover goals, practice, feedback, and next steps in one hour.",
    href: "/help",
  },
  {
    title: "Building accountability as a remote learner",
    summary: "Simple rituals and tools that keep momentum between sessions.",
    href: "/dashboard",
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Resources</h1>
        <p className="text-white/80">Playbooks, checklists, and stories from the SkillBridge community.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.title} href={post.href} className="glass-card block hover:translate-y-[-2px] transition-transform">
            <h3 className="text-xl font-semibold text-white">{post.title}</h3>
            <p className="text-sm text-white/70 mt-2">{post.summary}</p>
            <span className="text-sm font-semibold text-white/80 mt-3 inline-flex items-center gap-1">Read more →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
