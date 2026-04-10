interface Props {
  onFill: (creds: { email: string; password: string; name?: string; role?: string }) => void;
}

const demos = [
  { label: "Demo Student", email: "student@demo.com", password: "Password123!", role: "STUDENT" },
  { label: "Demo Tutor", email: "tutor@demo.com", password: "Password123!", role: "TUTOR" },
  { label: "Demo Admin", email: "admin@demo.com", password: "Password123!", role: "ADMIN" },
];

export function DemoCredentialButtons({ onFill }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {demos.map((d) => (
        <button
          key={d.label}
          type="button"
          onClick={() => onFill(d)}
          className="glass-btn-secondary text-sm w-full"
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
