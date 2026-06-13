import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Hero from "@/components/shared/Hero";
import SectionHeading from "@/components/shared/SectionHeading";
import CTASection from "@/components/shared/CTASection";

const governmentResources = [
  { name: "MA Dept. of Insurance", url: "https://www.mass.gov/orgs/division-of-insurance", phone: "(617) 521-7478" },
  { name: "MA Registry of Motor Vehicles", url: "https://www.mass.gov/orgs/massachusetts-registry-of-motor-vehicles", phone: "(617) 351-4500" },
  { name: "Dept. of Industrial Accidents", url: "https://www.mass.gov/orgs/department-of-industrial-accidents", phone: "1-800-323-3249" },
  { name: "Merit Rating Board", url: "https://www.mass.gov/orgs/merit-rating-board", phone: "(617) 351-4400" },
  { name: "National Highway Safety Administration", url: "https://www.nhtsa.gov", phone: null },
  { name: "Insurance Fraud Bureau of MA", url: "https://www.ifb.org", phone: "1-800-323-7283" },
];

const localResources = [
  { name: "Everett City Hall", url: "https://www.cityofeverett.com", phone: "(617) 389-2100" },
  { name: "Revere City Hall", url: "https://www.revere.org", phone: "(781) 286-8100" },
  { name: "Malden City Hall", url: "https://www.cityofmalden.org", phone: "(781) 397-7000" },
  { name: "Chelsea City Hall", url: "https://www.chelseama.gov", phone: "(617) 466-4000" },
];

const industryResources = [
  { name: "MAIA Insurance Agents", url: "https://www.massagent.com", phone: "(508) 634-2900" },
  { name: "Kelly Blue Book", url: "https://www.kbb.com", phone: null },
  { name: "The Iroquois Group", url: "https://www.iroquoisgroup.com", phone: null },
];

function ResourceGroup({ title, resources }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-5 pb-3 border-b border-border">
        {title}
      </h3>
      <div className="space-y-3">
        {resources.map((r, i) => (
          <motion.a
            key={r.name}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group flex items-center justify-between p-4 rounded-xl hover:bg-muted/60 transition-all duration-200"
          >
            <div>
              <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{r.name}</p>
              {r.phone && <p className="text-xs text-muted-foreground mt-0.5">{r.phone}</p>}
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-secondary transition-colors" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <Hero
        subheadline="Resources"
        headline="Helpful Insurance Resources"
        description="Quick access to government agencies, local offices, and industry resources to help you navigate your insurance needs."
        primaryCTA="Get a Quote"
        primaryLink="/get-quote"
        compact
      />

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Resource Library"
            title="Everything You Need in One Place"
            description="Important links and contact information for government agencies, local municipalities, and industry organizations."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <ResourceGroup title="Government & Regulatory" resources={governmentResources} />
            <ResourceGroup title="Local Municipalities" resources={localResources} />
            <ResourceGroup title="Industry & Tools" resources={industryResources} />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}