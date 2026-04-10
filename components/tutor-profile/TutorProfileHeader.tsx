import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@/components/ui/Icons";

export type TutorProfile = {
  id: string;
  name: string;
  subject?: string;
  category?: string;
  pricePerHour?: number;
  rating?: number;
  reviewCount?: number;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  mode?: string;
  headline?: string;
  badges?: string[];
};

export function TutorProfileHeader({ tutor }: { tutor: TutorProfile }) {
  const initial = (tutor.name?.[0] || "T").toUpperCase();
  return (
    <div className="glass-card p-6 flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 overflow-hidden flex items-center justify-center text-2xl font-semibold text-white">
          {tutor.avatarUrl ? (
            <Image src={tutor.avatarUrl} alt={tutor.name} width={80} height={80} className="h-20 w-20 object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">{tutor.category || "Tutor"}</p>
          <h1 className="text-2xl font-semibold text-white">{tutor.name}</h1>
          {tutor.headline && <p className="text-sm text-white/70">{tutor.headline}</p>}
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
            {tutor.mode && <span className="rounded-full border border-white/15 px-2 py-1">{tutor.mode}</span>}
            {tutor.location && <span className="rounded-full border border-white/15 px-2 py-1">{tutor.location}</span>}
            {tutor.badges?.map((b) => (
              <span key={b} className="rounded-full border border-white/15 px-2 py-1 bg-white/5 text-white/80">{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-start">
        <div className="space-y-1">
          <p className="text-xs text-white/60">Rating</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-200 border border-emerald-500/25">
            <StarIcon className="h-4 w-4 fill-emerald-200" />
            <span>{tutor.rating ? tutor.rating.toFixed(1) : "New"}</span>
            <span className="text-white/60 text-xs">{tutor.reviewCount ? `(${tutor.reviewCount} reviews)` : ""}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-white/60">Hourly</p>
          <p className="text-lg font-semibold text-white">{tutor.pricePerHour ? `$${tutor.pricePerHour}/hr` : "Custom pricing"}</p>
          {tutor.subject && <p className="text-xs text-white/60">Focus: {tutor.subject}</p>}
        </div>
        <div className="space-y-2 flex flex-col sm:items-end sm:text-right">
          <Link href={`/login?next=/tutors/${tutor.id}`} className="glass-btn w-full sm:w-auto text-center">
            Book session
          </Link>
          <div className="flex gap-2 sm:justify-end w-full">
            <Link href="/contact" className="glass-btn-secondary text-sm w-full sm:w-auto text-center">Message</Link>
            <Link href="/tutors" className="glass-btn-secondary text-sm w-full sm:w-auto text-center">Browse</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
