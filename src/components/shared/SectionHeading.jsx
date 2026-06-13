import React from "react";
import { motion } from "framer-motion";

export default function SectionHeading({ label, title, description, center = true, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 md:mb-16 ${center ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}
    >
      {label && (
        <p className={`text-sm font-semibold uppercase tracking-[0.2em] mb-3 ${
          light ? "text-secondary" : "text-secondary"
        }`}>
          {label}
        </p>
      )}
      <h2 className={`font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-4 ${
        light ? "text-white" : "text-foreground"
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base md:text-lg leading-relaxed ${
          light ? "text-white/70" : "text-muted-foreground"
        }`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}