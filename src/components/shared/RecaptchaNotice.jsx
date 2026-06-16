import { ShieldCheck } from "lucide-react";

export default function RecaptchaNotice({ verifying = false }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3 flex items-start gap-3">
      <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${verifying ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {verifying ? "Running security check…" : "Security verification"}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This form is protected by Google reCAPTCHA. Verification runs automatically when you click Send Message.
        </p>
      </div>
    </div>
  );
}
