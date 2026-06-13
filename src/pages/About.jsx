import React from "react";
import { motion } from "framer-motion";
import { Shield, Users, Award, Globe, MapPin, Handshake, Star, CheckCircle2 } from "lucide-react";
import Hero from "@/components/shared/Hero";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";
import StatsSection from "@/components/shared/StatsSection";
import CTASection from "@/components/shared/CTASection";

const aboutImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/fcae128bd_generated_de3b1c7e.png";
const teamImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/81f1648d5_generated_25e36aa7.png";

const milestones = [
  { year: "1980s", title: "Founded", description: "Sabatino/Mastrocola Insurance Agency established in Everett, Massachusetts, serving the local community." },
  { year: "1990s", title: "Growth", description: "Expanded carrier partnerships and grew to serve thousands of families and businesses across the region." },
  { year: "2000s", title: "Full Service", description: "Became a full-service agency with registry services, claims assistance, and multilingual support." },
  { year: "Today", title: "Trusted Leader", description: "Over 40 years strong, partnered with 17+ carriers, and member of The Iroquois Group." },
];

const coreValues = [
  { icon: Shield, title: "Integrity", description: "We operate with transparency and honesty in every interaction, building trust that lasts decades." },
  { icon: Users, title: "Community", description: "Deep roots in Everett and the surrounding communities, understanding local needs and culture." },
  { icon: Star, title: "Excellence", description: "We pursue the highest standards in coverage quality, customer service, and competitive pricing." },
  { icon: Globe, title: "Inclusivity", description: "Our multilingual team ensures every client receives clear, comfortable communication in their language." },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        subheadline="About Our Agency"
        headline="40+ Years of Trusted Protection"
        description="Sabatino/Mastrocola Insurance Agency has been a cornerstone of the Everett, Massachusetts community since the 1980s, delivering personalized insurance solutions with integrity and care."
        primaryCTA="Get a Quote"
        primaryLink="/get-quote"
        secondaryCTA="Contact Us"
        secondaryLink="/contact"
        backgroundImage={aboutImg}
        compact
      />

      <StatsSection />

      {/* Story */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeading
                label="Our Story"
                title="Built on Relationships, Driven by Service"
                center={false}
              />
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Welcome to <strong className="text-foreground">Sabatino/Mastrocola Insurance Agency Inc.</strong>, located in Everett, Massachusetts. We have been in business for over 40 years and our team is comprised of a dynamic staff combining fresh energy with decades of experience in the insurance field.
                </p>
                <p>
                  We are a full-service agency writing auto, home, business, commercial, flood, bonding, IRA, and life insurance. Our trilingual staff communicates in Spanish, Portuguese, Italian, and English.
                </p>
                <p>
                  We are insurance professionals who provide superior knowledge and outstanding customer service with a focus on future trends in competitive insurance markets. Our goal is to meet the specific needs of each and every one of our clients with the highest quality insurance for the best value available.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-2xl shadow-black/[0.08]"
            >
              <img src={teamImg} alt="Our team" className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Our Journey"
            title="Milestones of Trust"
            description="A timeline of growth, commitment, and community impact."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-card rounded-2xl border border-border/60 p-8"
              >
                <p className="font-display text-2xl font-bold text-secondary mb-2">{m.year}</p>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{m.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Core Values"
            title="What We Stand For"
            description="These principles guide everything we do — from the carriers we partner with to the way we serve you."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <FeatureCard key={v.title} icon={v.icon} title={v.title} description={v.description} index={i} />
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
            The Iroquois Group has more than 2,250 member agencies. Despite their diversity, each joined Iroquois — without giving up their independence — for assistance with Market Optimization and strategies to increase revenue, profits, and agency value.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}