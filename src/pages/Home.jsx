import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Shield, Users, Award, Clock, ArrowRight,
  Car, Home as HomeIcon, Building2, Ship, Umbrella, Heart,
  Globe, Handshake, Star, CheckCircle2
} from "lucide-react";
import Hero from "@/components/shared/Hero";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";
import ServiceCard from "@/components/shared/ServiceCard";
import StatsSection from "@/components/shared/StatsSection";
import CTASection from "@/components/shared/CTASection";

const heroImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/f5d94608c_generated_071f1d73.png";
const autoImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/c487bb0e3_generated_6eb43b1c.png";
const homeImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/936822612_generated_62b1348f.png";
const businessImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/bfe04bcc5_generated_9cdb5e31.png";
const boatImg = "https://media.base44.com/images/public/6a2c7d39abb365824919975b/1fa9fe87e_generated_1b6df7ed.png";

const values = [
  { icon: Shield, title: "Trusted Protection", description: "Over 40 years of safeguarding families and businesses across Massachusetts with reliable, comprehensive coverage." },
  { icon: Users, title: "Multilingual Service", description: "Our trilingual staff serves you in English, Spanish, Portuguese, and Italian — ensuring clear communication." },
  { icon: Award, title: "Top-Rated Providers", description: "We partner with 17+ leading insurance carriers to find you the best coverage at the most competitive rates." },
  { icon: Clock, title: "Full-Service Agency", description: "From registry services to claims assistance, we handle everything so you can focus on what matters most." },
];

const featuredServices = [
  { image: autoImg, title: "Auto Insurance", description: "Comprehensive vehicle protection with competitive rates and all available discounts applied to your policy." },
  { image: homeImg, title: "Homeowners Insurance", description: "Protect your most valuable asset with comprehensive homeowner packages including identity theft protection." },
  { image: businessImg, title: "Business Insurance", description: "Tailored commercial packages including property, liability, workers' compensation, and bonds for every industry." },
  { image: boatImg, title: "Boaters Insurance", description: "Full coverage for your watercraft with protection against bodily injury and property damage on the water." },
];

const whyUs = [
  "Over 40 years of insurance expertise",
  "17+ top-rated insurance providers",
  "Registry services included",
  "Trilingual staff (EN/ES/PT/IT)",
  "Professional claims assistance",
  "Competitive rates guaranteed",
  "Personalized coverage plans",
  "Saturday appointments available",
];

const industries = [
  { icon: HomeIcon, label: "Homeowners" },
  { icon: Car, label: "Auto & Fleet" },
  { icon: Building2, label: "Commercial" },
  { icon: Ship, label: "Marine" },
  { icon: Umbrella, label: "Personal Lines" },
  { icon: Heart, label: "Life & Health" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        subheadline="Trusted Insurance Since 1980"
        headline="Protecting Massachusetts Families & Businesses"
        description="For over 40 years, Sabatino/Mastrocola Insurance Agency has been delivering personalized insurance solutions with the highest quality coverage at the best value. Se habla español."
        primaryCTA="Get a Free Quote"
        primaryLink="/get-quote"
        secondaryCTA="Our Services"
        secondaryLink="/services"
        backgroundImage={heroImg}
      />

      {/* Quick Access Banner */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground text-base">Already a customer?</p>
            <p className="text-sm text-muted-foreground">Quickly access your carrier's payment or claims portal.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/customer-portal">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold gap-2 shadow-sm">
                Pay My Bill
              </Button>
            </Link>
            <Link to="/customer-portal">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 font-semibold gap-2">
                File a Claim
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsSection />

      {/* Value Proposition */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Why Choose Us"
            title="Insurance Expertise You Can Count On"
            description="We combine decades of industry knowledge with personal service to deliver insurance solutions tailored to your unique needs."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <FeatureCard key={v.title} icon={v.icon} title={v.title} description={v.description} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Solutions */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Our Solutions"
            title="Comprehensive Insurance Coverage"
            description="From auto and home to business and specialty lines, we offer the full spectrum of insurance products to keep you protected."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((s, i) => (
              <ServiceCard key={s.title} image={s.image} title={s.title} description={s.description} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg" className="font-semibold px-8">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Detailed */}
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
                label="The Sabatino Difference"
                title="A Tradition of Trust & Excellence"
                description="As an independent agency, we work for you — not the insurance companies. We shop multiple providers to find the perfect balance of coverage and value."
                center={false}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whyUs.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/about">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                    Learn About Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/[0.08]">
                <img src="https://media.base44.com/images/public/6a2c7d39abb365824919975b/81f1648d5_generated_25e36aa7.png" alt="Our team" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-2xl shadow-lg hidden md:block">
                <p className="font-display text-3xl font-bold">40+</p>
                <p className="text-sm font-medium mt-1">Years Serving<br />Massachusetts</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Who We Serve"
            title="Industries & Applications"
            description="We provide tailored insurance solutions across a wide range of industries and personal needs."
            light
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-secondary/30 transition-all duration-300"
              >
                <ind.icon className="w-8 h-8 text-secondary mx-auto mb-3" />
                <p className="text-white text-sm font-medium">{ind.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/industries">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8">
                Explore Industries
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Providers Ribbon */}
      <section className="py-16 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Partnered with 17+ Leading Insurance Carriers
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 items-center text-muted-foreground/50">
            {["Berkshire Hathaway Guard", "Liberty Mutual", "Progressive", "MAPFRE", "Travelers", "Safety Insurance", "Hanover", "GEICO"].map((name) => (
              <span key={name} className="text-sm font-medium tracking-wide">{name}</span>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/providers" className="text-sm text-secondary font-semibold hover:underline">
              View all providers →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}