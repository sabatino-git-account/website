import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({ image, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-secondary/30 hover:shadow-2xl hover:shadow-black/[0.06] transition-all duration-500"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mt-3 line-clamp-3">{description}</p>
      </div>
    </motion.div>
  );
}