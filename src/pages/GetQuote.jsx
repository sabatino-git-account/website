import React from "react";
import { motion } from "framer-motion";
import { Car, Home as HomeIcon, Building2 } from "lucide-react";
import Hero from "@/components/shared/Hero";
import SectionHeading from "@/components/shared/SectionHeading";
import ContactForm from "@/components/shared/ContactForm";
import { images } from "@/lib/images";

const autoImg = images.auto;
const homeImg = images.home;
const businessImg = images.business;

const quoteTypes = [
  {
    icon: Car,
    title: "Auto Insurance",
    description: "Get a personalized quote for your vehicle coverage including all available discounts.",
    image: autoImg,
  },
  {
    icon: HomeIcon,
    title: "Homeowners Insurance",
    description: "Protect your most valuable asset with comprehensive coverage at competitive rates.",
    image: homeImg,
  },
  {
    icon: Building2,
    title: "Commercial Insurance",
    description: "Tailored business packages including property, liability, workers' comp, and bonds.",
    image: businessImg,
  },
];

export default function GetQuotePage() {
  return (
    <>
      <Hero
        subheadline="Get a Quote"
        headline="Get Your Free Insurance Quote"
        description="Tell us about your insurance needs and we'll connect you with the best coverage options from our 17+ carrier partners."
        slim
      />

      {/* Form first — visible immediately when users click Get a Quote */}
      <section className="py-10 md:py-14 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-card rounded-2xl border border-border/60 p-8 md:p-10 shadow-sm">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2 text-center">
              Request a Quote
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Fill out the form below and one of our agents will prepare a personalized quote for you.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Coverage types — secondary context below the form */}
      <section className="py-14 md:py-20 bg-muted/30 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Choose Your Coverage"
            title="What Would You Like to Insure?"
            description="Popular quote categories we help Massachusetts families and businesses with every day."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quoteTypes.map((q, i) => (
              <motion.div
                key={q.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-border/60 hover:border-secondary/30 hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 bg-card"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={q.image}
                    alt={q.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <q.icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{q.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{q.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
