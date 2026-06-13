import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection({
  title = "Ready to Protect What Matters Most?",
  description = "Get a personalized insurance quote today. Our team of experts is here to help you find the perfect coverage at the best value.",
  primaryCTA = "Get a Free Quote",
  primaryLink = "/get-quote",
  secondaryCTA = "Call Us Now",
  secondaryLink = "tel:1-617-387-7466",
}) {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(220,50%,28%)]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {title}
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-10">
            {description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={primaryLink}>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 h-12 text-base shadow-lg shadow-secondary/20">
                {primaryCTA}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            {secondaryLink.startsWith("tel:") ? (
              <a href={secondaryLink}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 h-12 text-base">
                  <Phone className="w-4 h-4 mr-2" />
                  {secondaryCTA}
                </Button>
              </a>
            ) : (
              <Link to={secondaryLink}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 h-12 text-base">
                  {secondaryCTA}
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}