import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "40+", label: "Years of Experience" },
  { value: "17+", label: "Insurance Providers" },
  { value: "4", label: "Languages Spoken" },
  { value: "1000s", label: "Clients Protected" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-secondary mb-2">{stat.value}</p>
              <p className="text-sm text-white/60 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}