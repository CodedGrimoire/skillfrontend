import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";

const faqs = [
  {
    q: "Can I switch tutors if the fit isn’t right?",
    a: "Yes. Tell us what you need and we’ll rematch you—most learners switch within their first two sessions if needed.",
  },
  {
    q: "Do you support recurring sessions?",
    a: "Absolutely. Many learners book weekly or bi-weekly blocks to stay accountable.",
  },
  {
    q: "How do payments work?",
    a: "You pay at booking. Tutors are paid after the session completes. Refunds follow the tutor’s cancellation policy.",
  },
  {
    q: "Can tutors help with company-specific projects?",
    a: "Yes, as long as it respects your company’s confidentiality guidelines. Keep sensitive data redacted.",
  },
];

export function FaqSection() {
  return (
    <SectionWrapper>
      <PageContainer>
        <SectionHeader
          eyebrow="FAQ"
          title="Answers before you book"
        />
        <div className="mt-6 grid gap-3">
          {faqs.map((item) => (
            <details key={item.q} className="glass-card p-4 group">
              <summary className="cursor-pointer text-white font-semibold list-none flex items-center justify-between">
                <span>{item.q}</span>
                <span className="text-white/50 group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
