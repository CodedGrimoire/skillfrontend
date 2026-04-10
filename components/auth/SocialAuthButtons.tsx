export function SocialAuthButtons({ onGoogle, onFacebook, disabled }: { onGoogle?: () => void; onFacebook?: () => void; disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onGoogle}
        className="glass-btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span role="img" aria-label="Google" className="text-lg">🔑</span> Continue with Google
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onFacebook}
        className="glass-btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span role="img" aria-label="Facebook" className="text-lg">📘</span> Continue with Facebook
      </button>
      {disabled && <p className="text-xs text-white/60 text-center">Social login coming soon</p>}
    </div>
  );
}
