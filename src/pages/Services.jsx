import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Hero from "@/components/shared/Hero";
import SectionHeading from "@/components/shared/SectionHeading";
import CTASection from "@/components/shared/CTASection";

const autoImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/c487bb0e3_generated_6eb43b1c.png";
const homeImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/936822612_generated_62b1348f.png";
const businessImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/bfe04bcc5_generated_9cdb5e31.png";
const boatImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/1fa9fe87e_generated_1b6df7ed.png";
const rentersImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/d5b0e1a4a_generated_0c189858.png";
const condoImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/a0ea25f46_generated_420d026e.png";
const floodImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/e445cdd49_generated_5db29af9.png";
const lifeImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/872915c21_generated_b14e1784.png";

const services = [
  {
    id: "auto",
    image: autoImg,
    title: "Automobile Insurance",
    description: "Auto insurance provides you with the ease of knowing that you are protected against bodily injury and property damage. Our staff will exceed your specific needs, review any and all available discounts, and provide you with comfortable knowledge that you are fully protected.",
    features: ["Bodily injury coverage", "Property damage protection", "All available discounts applied", "Competitive multi-car rates"],
  },
  {
    id: "home",
    image: homeImg,
    title: "Homeowners Insurance",
    description: "A Homeowner's Insurance Policy will cover your most valuable asset. Our comprehensive packages include coverage for your home, personal property, liability, and much more.",
    features: ["Home & attached structures", "Personal liability protection", "Identity theft coverage", "Personal umbrellas up to $5M"],
  },
  {
    id: "business",
    image: businessImg,
    title: "Business / Commercial Insurance",
    description: "We offer a variety of business insurance products at an affordable price. Our Commercial Package features a broad selection of coverage options tailored to meet your needs in highly competitive markets.",
    features: ["Business automobile", "Property & liability packages", "Workers' compensation", "Bonds & professional liability"],
  },
  {
    id: "boat",
    image: boatImg,
    title: "Boaters Insurance",
    description: "Boater's insurance provides you with protection against bodily injury and property damage on the water. We'll tailor the best rate for you and ensure quality coverage for your watercraft.",
    features: ["Bodily injury coverage", "Property damage protection", "Available discounts", "All watercraft types covered"],
  },
  {
    id: "flood",
    image: floodImg,
    title: "Flood Insurance",
    description: "Home insurance doesn't cover flooding. We've put together programs you can purchase for flood coverage. Pricing depends on what flood zone your home is located in. Ask about our FEMA flood insurance.",
    features: ["FEMA flood programs", "Zone-based pricing", "Gap coverage options", "Claims assistance included"],
  },
  {
    id: "renters",
    image: rentersImg,
    title: "Renters Insurance",
    description: "Renter's insurance covers your personal possessions if you rent a house or apartment. Coverage typically costs less than $150 depending on your circumstances. Let us get you a quote today!",
    features: ["Personal property coverage", "Liability protection", "Affordable rates from ~$150/yr", "Fire & burglary coverage"],
  },
  {
    id: "condo",
    image: condoImg,
    title: "Condo Insurance",
    description: "Our Condo Insurance covers your unit from damage, theft, fire, and vandalism, plus personal liability coverage. Don't rely on your condo association's policy — it only covers the building structure.",
    features: ["Full replacement coverage", "Living expense coverage", "Plumbing & vandalism", "Liability & medical expenses"],
  },
  {
    id: "life",
    image: lifeImg,
    title: "Life & Disability Insurance",
    description: "We're here to help protect your loved ones in the event of an unforeseen circumstance. We offer term life insurance products and disability insurance that protects 60% of your income.",
    features: ["Term life: 1, 5, 15, 20 year", "Disability income protection", "60% income replacement", "Customized coverage plans"],
  },
];

function ServiceBlock({ service, index }) {
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      id={service.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index > 0 ? "pt-20 border-t border-border/60" : ""}`}
    >
      <div className={isReversed ? "lg:order-2" : ""}>
        <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/[0.06]">
          <img src={service.image} alt={service.title} className="w-full h-auto aspect-[4/3] object-cover" />
        </div>
      </div>
      <div className={isReversed ? "lg:order-1" : ""}>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">{service.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {service.features.map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Hero
        subheadline="Our Services"
        headline="Comprehensive Insurance Solutions"
        description="From auto and home to business and specialty lines, we provide the full spectrum of insurance products tailored to your unique needs."
        primaryCTA="Get a Quote"
        primaryLink="/get-quote"
        secondaryCTA="Contact Us"
        secondaryLink="/contact"
        compact
      />

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {services.map((s, i) => (
            <ServiceBlock key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}