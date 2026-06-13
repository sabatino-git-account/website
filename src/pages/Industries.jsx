import React from "react";
import { motion } from "framer-motion";
import {
  Car, Home as HomeIcon, Building2, Ship, Umbrella, Heart,
  Store, UtensilsCrossed, Hotel, Truck, Briefcase, Shield
} from "lucide-react";
import Hero from "@/components/shared/Hero";
import SectionHeading from "@/components/shared/SectionHeading";
import CTASection from "@/components/shared/CTASection";

const personalLines = [
  { icon: Car, title: "Auto Owners", description: "Individual and family vehicle protection with all available discounts and competitive multi-car rates." },
  { icon: HomeIcon, title: "Homeowners", description: "Comprehensive protection for your most valuable asset, including identity theft and personal umbrella coverage." },
  { icon: Umbrella, title: "Renters", description: "Affordable personal property and liability coverage for apartment and house renters starting from $150/year." },
  { icon: Ship, title: "Boat Owners", description: "Full watercraft protection for boats, yachts, and other marine vessels against all common risks." },
  { icon: Heart, title: "Families", description: "Life insurance and disability coverage to protect your loved ones and secure their financial future." },
  { icon: Shield, title: "Condo Owners", description: "Unit-specific coverage that picks up where your condo association's building policy leaves off." },
];

const commercialLines = [
  { icon: Store, title: "Retail & Package Stores", description: "Tailored coverage for drug stores, food markets, beer & wine shops, and retail establishments." },
  { icon: UtensilsCrossed, title: "Restaurants & Bars", description: "Specialized insurance packages for restaurants, bars, grills, and food service businesses." },
  { icon: Hotel, title: "Hotels & Hospitality", description: "Comprehensive coverage for hotels, motels, and hospitality industry businesses." },
  { icon: Truck, title: "Wholesale Distributors", description: "Business automobile, property, and liability coverage tailored for distribution companies." },
  { icon: Briefcase, title: "Professional Services", description: "Professional liability, commercial umbrella, and general business coverage for service firms." },
  { icon: Building2, title: "General Commercial", description: "Flexible commercial packages including workers' comp, bonds, and property & liability." },
];

function IndustryGrid({ items, delay = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + i * 0.08 }}
          className="group p-7 rounded-2xl bg-card border border-border/60 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-500"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-secondary/10 transition-colors duration-500">
            <item.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-500" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function IndustriesPage() {
  return (
    <>
      <Hero
        subheadline="Industries We Serve"
        headline="Insurance for Every Need"
        description="From individual families to complex commercial operations, we provide tailored insurance solutions across every industry and walk of life."
        primaryCTA="Get a Quote"
        primaryLink="/get-quote"
        secondaryCTA="View Services"
        secondaryLink="/services"
        compact
      />

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Personal Lines"
            title="Protecting Individuals & Families"
            description="We help individuals and families across Massachusetts find the perfect coverage for their homes, vehicles, and personal needs."
          />
          <IndustryGrid items={personalLines} />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Commercial Lines"
            title="Empowering Businesses"
            description="Specialized commercial insurance packages for businesses of all types and sizes, from small shops to large enterprises."
          />
          <IndustryGrid items={commercialLines} delay={0.1} />
        </div>
      </section>

      <CTASection />
    </>
  );
}