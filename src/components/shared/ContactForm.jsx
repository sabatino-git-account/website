import React, { useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPhoneInput, isValidPhoneInput } from "@/lib/phone";
import RecaptchaNotice from "@/components/shared/RecaptchaNotice";

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const interests = [
  "Auto Insurance",
  "Homeowners Insurance",
  "Business / Commercial",
  "Flood Insurance",
  "Renters Insurance",
  "Condo Insurance",
  "Boaters Insurance",
  "Life & Disability",
  "Other",
];

function ContactFormFields() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", interest: "", message: "", _gotcha: ""
  });

  const captchaEnabled = Boolean(RECAPTCHA_SITE_KEY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!CONTACT_API_URL) {
      setError("Contact form is not configured yet. Please email info@sabatino-ins.com.");
      return;
    }

    if (form.phone && !isValidPhoneInput(form.phone)) {
      setError("Please enter a complete 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      let captchaToken = null;
      if (captchaEnabled) {
        if (!executeRecaptcha) {
          throw new Error("Security verification is still loading. Please try again.");
        }
        setVerifying(true);
        captchaToken = await executeRecaptcha("contact_form");
        setVerifying(false);
      }

      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          interest: form.interest,
          message: form.message,
          smsConsent,
          captchaToken,
          _gotcha: form._gotcha,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again or call (617) 387-7466.");
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError("");
    setSmsConsent(false);
    setForm({ name: "", company: "", email: "", phone: "", interest: "", message: "", _gotcha: "" });
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value) => {
    handleChange("phone", formatPhoneInput(value));
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
            Thank You!
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Your message has been received. One of our team members will get back to you within 1 business day.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Send Another Message
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            name="_gotcha"
            value={form._gotcha}
            onChange={(e) => handleChange("_gotcha", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Smith"
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Your company"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="h-11"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="(617) 555-0123"
                maxLength={14}
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest">I'm interested in...</Label>
            <Select value={form.interest} onValueChange={(v) => handleChange("interest", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {interests.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="How can we help you?"
              required
              rows={5}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
            />
          </div>

          {captchaEnabled && <RecaptchaNotice verifying={verifying} />}

          <div className="rounded-xl bg-muted/50 border border-border/60 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="sms-consent"
                checked={smsConsent}
                onCheckedChange={setSmsConsent}
                className="mt-0.5"
              />
              <label htmlFor="sms-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                By submitting this form, I consent to receive SMS text messages and/or phone calls from Sabatino/Mastrocola Insurance Agency Inc. at the number provided above regarding my insurance inquiry. Message and data rates may apply. Message frequency varies. Reply <strong>STOP</strong> to opt out at any time. Reply <strong>HELP</strong> for help. This consent is not a condition of purchasing any goods or services.
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground/70 pl-7">
              Your information is protected and will never be sold to third parties. View our{" "}
              <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
              {captchaEnabled && (
                <>
                  {" "}This site is protected by reCAPTCHA and the Google{" "}
                  <a href="https://policies.google.com/privacy" className="underline hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  {" "}and{" "}
                  <a href="https://policies.google.com/terms" className="underline hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
                </>
              )}
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!smsConsent || loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full md:w-auto px-10 h-12 disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {verifying ? "Verifying…" : "Sending..."}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function ContactForm() {
  if (!RECAPTCHA_SITE_KEY) {
    return <ContactFormFields />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <ContactFormFields />
    </GoogleReCaptchaProvider>
  );
}
