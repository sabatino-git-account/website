import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", interest: "", message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSmsConsent(false);
    setForm({ name: "", company: "", email: "", phone: "", interest: "", message: "" });
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
                placeholder="(617) 555-0123"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
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
          {/* SMS / TCPA Consent */}
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
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!smsConsent}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full md:w-auto px-10 h-12 disabled:opacity-40"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}