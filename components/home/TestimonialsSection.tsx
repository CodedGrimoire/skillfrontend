import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { StarIcon } from "@/components/ui/Icons";

const testimonials = [
  {
    name: "Sara M.",
    role: "Frontend engineer → Senior",
    quote: "My tutor helped me structure a portfolio project and run daily standups to keep momentum. I promoted in 4 months.",
    rating: 5,
  },
  {
    name: "Anand P.",
    role: "Data analyst → Analytics engineer",
    quote: "We pair-programmed dbt models and rewrote my SQL for performance. The mock interview feedback was gold.",
    rating: 5,
  },
  {
    name: "Lina K.",
    role: "UX bootcamp grad",
    quote: "Weekly design critiques with a senior designer made my case studies click. I felt confident in onsite whiteboards.",
    rating: 4.8,
  },
];

export function TestimonialsSection() {
  return (
    <SectionWrapper>
      <PageContainer>
        <SectionHeader
          eyebrow="Testimonials"
          title="Learners who bridged the gap"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="glass-card h-full flex flex-col">
              <div className="flex items-center gap-2 text-amber-300">
                {Array.from({ length: Math.round(item.rating) }).map((_, idx) => (
                  <StarIcon key={idx} className="h-4 w-4 fill-amber-300" />
                ))}
              </div>
              <p className="mt-3 text-sm text-white/80 leading-relaxed">“{item.quote}”</p>
              <div className="mt-4 text-sm font-semibold text-white">{item.name}</div>
              <div className="text-xs text-white/60">{item.role}</div>
            </div>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
