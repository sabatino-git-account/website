import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import Hero from "@/components/shared/Hero";

const sections = [
  {
    title: "10DLC Registration Information",
    note: "Updated 10/3/24",
    content: [
      {
        heading: "What is 10DLC?",
        body: "10DLC (10-Digit Long Code) is a framework that regulates messaging campaigns to ensure compliance and protect user privacy.",
      },
      {
        heading: "Information We Collect",
        bullets: [
          "Business Information: Sabatino Insurance, 519 Broadway, Everett, MA 02149",
          "Contact: info@sabatino-ins.com",
          "Consent Records: Documentation of your consent to receive SMS messages.",
        ],
      },
      {
        heading: "Opt-In Process",
        body: "By providing your information, you agree to receive SMS messages from us for easier communication. You can opt in by confirming your consent via SMS.",
      },
      {
        heading: "Opt-Out Process",
        body: "You can opt out of receiving messages at any time:",
        bullets: [
          'Reply "STOP" to any SMS you receive.',
          "Contact us directly at info@sabatino-ins.com.",
        ],
      },
      {
        heading: "How We Use Your Information",
        bullets: [
          "Facilitate communication between us and you.",
          "Ensure compliance with regulatory requirements.",
        ],
      },
    ],
  },
  {
    title: "Privacy Policy",
    note: "Effective Date: Friday, September 26th, 2024",
    content: [
      {
        heading: "1. Information We Collect",
        bullets: [
          "Personal Information: Your name, phone number, and business details.",
          "Communication Preferences: Records of your consent to receive SMS messages.",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        bullets: [
          "Communicate effectively with you regarding our services.",
          "Ensure compliance with regulations, including 10DLC.",
          "Improve our messaging services and user experience.",
        ],
      },
      {
        heading: "3. Data Security",
        body: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
      },
      {
        heading: "4. Your Rights",
        bullets: [
          "Access the personal information we hold about you.",
          "Request correction or deletion of your information.",
          "Opt-out of future communications at any time.",
        ],
      },
      {
        heading: "5. Sharing Your Information",
        body: "We do not sell or rent your personal information to third parties. We may share your information only with service providers who assist us in delivering our services, and they are required to protect your data.",
      },
      {
        heading: "6. Changes to This Policy",
        body: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.",
      },
      {
        heading: "7. Contact Us",
        body: "If you have any questions or concerns about this Privacy Policy, please contact us:",
      },
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Hero
        subheadline="Legal"
        headline="Privacy Policy"
        description="How Sabatino/Mastrocola Insurance Agency collects, uses, and protects your personal information."
        compact
      />

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          {sections.map((section, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: si * 0.1 }}
              className="mb-16"
            >
              <div className="mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">{section.title}</h2>
                {section.note && <p className="text-xs text-muted-foreground uppercase tracking-wider">{section.note}</p>}
              </div>

              <div className="space-y-8">
                {section.content.map((block, bi) => (
                  <div key={bi} className="pl-0">
                    <h3 className="font-semibold text-foreground mb-3">{block.heading}</h3>
                    {block.body && <p className="text-muted-foreground leading-relaxed mb-3">{block.body}</p>}
                    {block.bullets && (
                      <ul className="space-y-2 pl-4">
                        {block.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Contact Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-primary/5 border border-border p-8"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Contact Us About This Policy</h3>
            <div className="space-y-3">
              <a href="mailto:info@sabatino-ins.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-secondary" />
                info@sabatino-ins.com
              </a>
              <a href="tel:16173877466" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-secondary" />
                1 (617) 387-7466
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
              Thank you for trusting us with your information. Your privacy is important to us, and we are committed to maintaining your trust by ensuring your data is handled responsibly and securely.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}