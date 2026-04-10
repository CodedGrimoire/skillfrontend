import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@/components/ui/Icons";

export type TutorCardData = {
  id: string;
  name: string;
  subject?: string;
  category?: string;
  pricePerHour?: number;
  rating?: number;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  mode?: string;
};

export function TutorCard({ tutor }: { tutor: TutorCardData }) {
  const initial = (tutor.name?.[0] || "T").toUpperCase();
  return (
    <div className="glass-card h-full flex flex-col">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 overflow-hidden flex items-center justify-center text-white font-semibold">
          {tutor.avatarUrl ? (
            <Image src={tutor.avatarUrl} alt={tutor.name} width={48} height={48} className="h-12 w-12 object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{tutor.name}</h3>
          <p className="text-xs text-white/60 truncate">{tutor.location || tutor.mode || "Remote"}</p>
        </div>
        {tutor.rating && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30">
            {tutor.rating.toFixed(1)} <StarIcon className="h-3 w-3 fill-emerald-200" />
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2 text-sm text-white/80">
        <p className="font-semibold text-white">{tutor.subject || tutor.category || "Tutoring"}</p>
        <p className="line-clamp-3 text-white/70">{tutor.bio || "Personalized sessions tailored to your goals."}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-white/70">
        <span>{tutor.category || "General"}</span>
        <span>{tutor.pricePerHour ? `$${tutor.pricePerHour}/hr` : "Custom"}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
        <span>{tutor.mode || "Online"}</span>
        <span>{tutor.location || "Global"}</span>
      </div>

      <Link
        href={`/tutors/${tutor.id}`}
        className="mt-4 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/30 hover:text-white"
      >
        View profile
      </Link>
    </div>
  );
}
