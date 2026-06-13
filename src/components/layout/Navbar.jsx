import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { images } from "@/lib/images";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Providers", path: "/providers" },
  { label: "Industries", path: "/industries" },
  { label: "Resources", path: "/resources" },
  { label: "Pay / Claims", path: "/customer-portal" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-primary text-primary-foreground text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <p className="opacity-80">We speak English, Spanish, Portuguese & Italian</p>
          <div className="flex items-center gap-6">
            <a href="tel:1-617-387-7466" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
              <Phone className="w-3.5 h-3.5" />
              (617) 387-7466
            </a>
            <span className="opacity-40">|</span>
            <span className="opacity-80">Mon–Fri 9am–5pm</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/[0.04]" 
          : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img src={images.logo} alt="Sabatino Insurance" className="h-14 w-auto object-contain" />
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.path === "/customer-portal" ? (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                      location.pathname === link.path
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "bg-secondary/10 text-amber-800 border-secondary/40 hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/get-quote">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-sm">
                  Get a Quote
                </Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border overflow-hidden bg-white"
            >
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-border mt-3">
                  <Link to="/get-quote">
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                      Get a Quote
                    </Button>
                  </Link>
                  <a href="tel:1-617-387-7466" className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    (617) 387-7466
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}