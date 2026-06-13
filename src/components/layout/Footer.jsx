import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { images } from "@/lib/images";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Providers", path: "/providers" },
  { label: "Pay / File a Claim", path: "/customer-portal" },
  { label: "Get a Quote", path: "/get-quote" },
  { label: "Contact", path: "/contact" },
];

const services = [
  "Auto Insurance",
  "Homeowners Insurance",
  "Business Insurance",
  "Flood Insurance",
  "Life & Disability",
  "Renters Insurance",
];

export default function Footer() {
  return (
    <footer className="bg-[hsl(220,40%,10%)] text-white">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={images.logo}
                alt="Sabatino Insurance"
                className="w-12 h-12 object-contain mix-blend-screen"
              />
              <div>
                <p className="font-display text-base font-semibold leading-tight tracking-tight">Sabatino</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">Insurance Agency</p>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              Trusted insurance for Massachusetts families and businesses — for over 40 years.
            </p>
            <a
              href="mailto:info@sabatino-ins.com"
              className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-secondary/80 transition-colors font-medium"
            >
              info@sabatino-ins.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-5">Navigate</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-1.5 text-sm text-white/55 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-secondary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-5">Coverage</h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="group flex items-center gap-1.5 text-sm text-white/55 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-secondary" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/55">
                <MapPin className="w-4 h-4 mt-0.5 text-secondary/70 flex-shrink-0" />
                <span>519 Broadway<br />Everett, MA 02149</span>
              </li>
              <li>
                <a href="tel:1-617-387-7466" className="flex items-center gap-3 text-sm text-white/55 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-secondary/70 flex-shrink-0" />
                  (617) 387-7466
                </a>
              </li>
              <li>
                <a href="mailto:info@sabatino-ins.com" className="flex items-center gap-3 text-sm text-white/55 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-secondary/70 flex-shrink-0" />
                  info@sabatino-ins.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/55">
                <Clock className="w-4 h-4 mt-0.5 text-secondary/70 flex-shrink-0" />
                <span>Mon–Fri: 9am–5pm<br />Sat: By appointment</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Sabatino/Mastrocola Insurance Agency Inc. All rights reserved.
          </p>
          <p className="text-xs text-white/20">Everett, MA · Est. 1980s</p>
        </div>
      </div>
    </footer>
  );
}