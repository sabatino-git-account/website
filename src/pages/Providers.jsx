import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Hero from "@/components/shared/Hero";
import SectionHeading from "@/components/shared/SectionHeading";
import CTASection from "@/components/shared/CTASection";

const providers = [
  { name: "Berkshire Hathaway Guard", url: "https://www.guard.com" },
  { name: "Concord Group", url: "https://www.concordgroupinsurance.com" },
  { name: "Foremost Insurance", url: "https://www.foremost.com" },
  { name: "GEICO", url: "https://www.geico.com" },
  { name: "Hanover Insurance Group", url: "https://www.hanover.com" },
  { name: "Liberty Mutual", url: "https://www.libertymutual.com" },
  { name: "MAPFRE Insurance", url: "https://www.mapfreinsurance.com" },
  { name: "Mass Property Insurance", url: "#" },
  { name: "Plymouth Rock Insurance", url: "https://www.plymouthrock.com" },
  { name: "Progressive Insurance", url: "https://www.progressive.com" },
  { name: "Providence Mutual", url: "https://www.providencemutual.com" },
  { name: "Quincy Mutual Group", url: "https://www.quincymutual.com" },
  { name: "Safeco Insurance", url: "https://www.safeco.com" },
  { name: "Safety Insurance", url: "https://www.safetyinsurance.com" },
  { name: "Stillwater Insurance", url: "https://stillwaterinsurance.com" },
  { name: "Travelers Insurance", url: "https://www.travelers.com" },
  { name: "Utica First", url: "https://www.uticafirst.com" },
];

export default function ProvidersPage() {
  return (
    <>
      <Hero
        subheadline="Our Partners"
        headline="Trusted Insurance Providers"
        description="We partner with 17+ leading insurance carriers to find you the best coverage at competitive rates. Our independence means we work for you — not the insurance companies."
        primaryCTA="Get a Quote"
        primaryLink="/get-quote"
        compact
      />

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Carrier Partners"
            title="The Best Names in Insurance"
            description="As an independent agency and proud member of The Iroquois Group, we have access to a wide network of top-rated carriers to find you the perfect policy."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p, i) => (
              <motion.a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group flex items-center justify-between p-5 rounded-xl bg-card border border-border/60 hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                    <span className="text-primary font-display font-bold text-sm group-hover:text-secondary transition-colors">
                      {p.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-foreground text-sm">{p.name}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-secondary transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Iroquois Group */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-secondary font-semibold text-sm uppercase tracking-[0.2em] mb-4">Proud Member</p>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">The Iroquois Group</h3>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
            The Iroquois Group started more than 38 years ago with five independent insurance agencies trying to bolster each other in a competitive marketplace. Today, The Iroquois Group has more than 2,250 member agencies of all shapes and sizes, each joined without giving up their independence.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}