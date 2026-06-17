import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Globe } from "lucide-react";
import Hero from "@/components/shared/Hero";
import ContactForm from "@/components/shared/ContactForm";

const contactDetails = [
  { icon: MapPin, label: "Visit Us", value: "519 Broadway\nEverett, MA 02149", href: "https://maps.google.com/?q=519+Broadway+Everett+MA+02149" },
  { icon: Phone, label: "Call Us", value: "(617) 387-7466", href: "tel:1-617-387-7466" },
  { icon: Mail, label: "Email Us", value: "info@sabatino-ins.com", href: "mailto:info@sabatino-ins.com" },
  { icon: Clock, label: "Office Hours", value: "Mon–Fri: 9am–5pm\nSat: By appointment", href: null },
  { icon: Globe, label: "Languages", value: "English, Spanish,\nPortuguese, Italian", href: null },
];

export default function ContactPage() {
  return (
    <>
      <Hero
        subheadline="Get in Touch"
        headline="We're Here to Help"
        description="Have questions about your insurance needs? Reach out to our team — we're just a phone call, email, or visit away."
        slim
      />

      <section className="py-10 md:py-14 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Form — first on mobile, right column on desktop */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-card rounded-2xl border border-border/60 p-8 md:p-10 shadow-sm">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Send Us a Message</h3>
                <p className="text-muted-foreground text-sm mb-8">
                  Fill out the form and we'll get back to you within 1 business day.
                </p>
                <ContactForm />
              </div>
            </div>

            {/* Contact info — below form on mobile, left column on desktop */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Visit us at our Everett office, give us a call, or send us a message. We also offer registry services and Saturday appointments.
              </p>
              <div className="space-y-6">
                {contactDetails.map((d, i) => (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <d.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{d.label}</p>
                      {d.href ? (
                        <a
                          href={d.href}
                          target={d.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground hover:text-secondary transition-colors whitespace-pre-line"
                        >
                          {d.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground whitespace-pre-line">{d.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl overflow-hidden border border-border bg-muted/30 aspect-video flex items-center justify-center">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2946.5!2d-71.056!3d42.407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370e3e3e3e3e3%3A0x1234567890!2s519+Broadway%2C+Everett%2C+MA+02149!5e0!3m2!1sen!2sus!4v1234567890"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
