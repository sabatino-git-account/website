import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero({
  headline,
  subheadline,
  description,
  primaryCTA,
  primaryLink,
  secondaryCTA,
  secondaryLink,
  backgroundImage,
  overlay = true,
  compact = false,
}) {
  return (
    <section className={`relative overflow-hidden ${compact ? "py-20 md:py-28" : "py-24 md:py-36"}`}>
      {/* Background image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/60" />
          )}
        </div>
      )}

      {/* Fallback gradient */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(220,50%,28%)]" />
      )}

      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {subheadline && (
            <p className="text-secondary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              {subheadline}
            </p>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            {headline}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mb-10">
              {description}
            </p>
          )}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-wrap gap-4">
              {primaryCTA && (
                <Link to={primaryLink || "/"}>
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 h-12 text-base shadow-lg shadow-secondary/20">
                    {primaryCTA}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
              {secondaryCTA && (
                <Link to={secondaryLink || "/"}>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 h-12 text-base">
                    {secondaryCTA}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}