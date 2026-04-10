import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageContainer } from "@/components/layout/PageContainer";

interface InfoItem {
  label: string;
  value?: string;
}

export function TutorKeyInfo({ items }: { items: InfoItem[] }) {
  const visible = items.filter((i) => i.value);
  if (visible.length === 0) return null;
  return (
    <SectionWrapper padded={false}>
      <PageContainer>
        <SectionHeader title="Key information" description="Quick facts before you book." />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <div key={item.label} className="glass-card p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">{item.label}</p>
              <p className="mt-2 text-sm text-white/85">{item.value}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </SectionWrapper>
  );
}
