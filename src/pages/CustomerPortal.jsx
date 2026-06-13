import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, AlertCircle, ExternalLink, Search, Phone, Shield, Star, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const carriers = [
  {
    name: "Safety Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/1f4611120_image.png",
    initials: "SI", color: "bg-blue-600",
    phone: "800-951-2100",
    payUrl: "https://www.safetyinsurance.com/myaccount/billpay.pl?guest=1",
    claimUrl: "https://www.safetyinsurance.com/claimsservices/index.html",
  },
  {
    name: "MAPFRE Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/acbb69a58_image.png",
    initials: "MF", color: "bg-red-600",
    phone: "800-922-8276",
    payUrl: "https://myaccount.mapfreinsurance.com/make-payment",
    claimUrl: "https://mcr.mapfreinsurance.com/",
  },
  {
    name: "Liberty Mutual",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/8e91a750f_image.png",
    initials: "LM", color: "bg-yellow-600",
    phone: "800-290-7933",
    payUrl: "https://ciit-billing-portal.libertymutual.com/express-pay",
    claimUrl: "https://www.libertymutual.com/claims-center",
  },
  {
    name: "Travelers Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/1e9d49186_image.png",
    initials: "TR", color: "bg-red-700",
    phone: "800-252-4633",
    payUrl: "https://www.travelers.com/pay-your-bill",
    claimUrl: "https://www.travelers.com/claims",
  },
  {
    name: "Progressive Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/12e23748c_image.png",
    initials: "PR", color: "bg-blue-500",
    phone: "800-776-4737",
    payUrl: "https://www.progressive.com/rp/login",
    claimUrl: "https://www.progressive.com/claims/",
  },
  {
    name: "Hanover Insurance Group",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/858f0824a_image.png",
    initials: "HI", color: "bg-slate-700",
    phone: "800-922-8427",
    payUrl: "https://www.hanover.com/pay-your-bill",
    claimUrl: "https://www.hanover.com/claims/claims-services/report-claim",
  },
  {
    name: "Plymouth Rock Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/b6ffc35f2_image.png",
    initials: "PL", color: "bg-stone-600",
    phone: "844-856-5462",
    payUrl: "https://ci2.plymouthrock.com/qpay/login",
    claimUrl: "https://efnol.plymouthrock.com/",
  },
  {
    name: "Concord Group Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/b446e738f_image.png",
    initials: "CG", color: "bg-green-700",
    phone: "800-852-3380",
    payUrl: "https://customer.concordgroupinsurance.com/ccp/login",
    claimUrl: "https://www.concordgroupinsurance.com/claims/report-a-claim",
  },
  {
    name: "Quincy Mutual Group",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/8e97c38dd_image.png",
    initials: "QM", color: "bg-indigo-700",
    phone: "617-472-1000",
    payUrl: "https://www.quincymutual.com/billing.htm",
    claimUrl: "https://www.quincymutual.com/report-claim.htm",
  },
  {
    name: "Safeco Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/ff024949a_image.png",
    initials: "SC", color: "bg-teal-600",
    phone: "800-332-3226",
    payUrl: "https://www.safeco.com/log-in",
    claimUrl: "https://www.safeco.com/claims-center",
  },
  {
    name: "Stillwater Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/5d059a9aa_image.png",
    initials: "SW", color: "bg-cyan-700",
    phone: "800-220-1351",
    payUrl: "https://stillwaterinsurance.com/ClientSelfService/",
    claimUrl: "https://stillwaterinsurance.com/ClientSelfService/",
  },
  {
    name: "Utica First Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/2d01c5fa0_image.png",
    initials: "UF", color: "bg-orange-700",
    phone: "800-388-4642",
    payUrl: "https://www.uticafirst.com/pay-my-bill/",
    claimUrl: "https://www.uticafirst.com/claims/",
  },
  {
    name: "Providence Mutual",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/28db8f50a_image.png",
    initials: "PM", color: "bg-violet-700",
    phone: "800-343-3616",
    payUrl: "https://www.mypmfic.com/PayYourBill/FindAccount.do?parameter=getFindAccount",
    claimUrl: "https://providence-mutual.webflow.io/claims-billing#report-a-claim",
  },
  {
    name: "GEICO",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/2c07ae20b_image.png",
    initials: "GE", color: "bg-blue-700",
    phone: "800-841-3000",
    payUrl: "https://www.geico.com/information/make-a-payment/",
    claimUrl: "https://www.geico.com/claims/",
  },
  {
    name: "Foremost Insurance",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/043429a8b_image.png",
    initials: "FO", color: "bg-blue-600",
    phone: "800-527-3905",
    payUrl: "https://www.foremost.com/payonline/",
    claimUrl: "https://www.foremost.com/claims/",
  },
  {
    name: "Berkshire Hathaway Guard",
    logo: "https://media.base44.com/images/public/6a2c7d39abb365824919975b/d77462f1c_image.png",
    initials: "BG", color: "bg-slate-800",
    phone: "888-230-4675",
    payUrl: "https://policyholder.guard.com/access/",
    claimUrl: "https://www.guard.com/claims/",
  },
];

const popularCarriers = ["Safety Insurance", "Progressive Insurance", "Liberty Mutual", "Travelers Insurance"];

export default function CustomerPortal() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = carriers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const popularList = carriers.filter(c => popularCarriers.includes(c.name));

  return (
    <section className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with trust badge */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">Insurance Companies</h1>
            <p className="text-muted-foreground">Pay your bill or file a claim directly with your carrier.</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 border border-blue-100 text-sm flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900">Secure & Convenient</p>
              <p className="text-[13px] text-blue-700">Manage payments and claims safely.</p>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search carrier name or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {["All", "Auto", "Home", "Renters", "Life", "Commercial"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveTab(filter.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === filter.toLowerCase()
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-foreground hover:bg-muted"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Popular carriers section */}
        {search === "" && activeTab === "all" && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h2 className="font-semibold text-foreground text-lg">Popular Carriers</h2>
              </div>
              <a href="#all-carriers" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {popularList.map((carrier, i) => (
                <motion.div
                  key={carrier.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-white rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow p-4 flex items-start gap-3 group hover:border-primary/30"
                >
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-border/60 overflow-hidden p-1.5">
                    <img src={carrier.logo} alt={carrier.name} className="w-full h-full object-contain"
                      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                    />
                    <div className={`${carrier.color} w-full h-full rounded items-center justify-center hidden`}>
                      <span className="text-white font-bold text-sm">{carrier.initials}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{carrier.name}</h3>
                    <a href={`tel:${carrier.phone}`} className="text-[12px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {carrier.phone}
                    </a>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All carriers section */}
        <div id="all-carriers">
          <h2 className="font-semibold text-foreground text-lg mb-5">All Carriers</h2>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No carrier found for "{search}"</p>
              <p className="text-sm">Call us at (617) 387-7466 and we'll help you directly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {filtered.map((carrier, i) => (
                <motion.div
                  key={carrier.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="bg-white rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-start gap-3 p-4 border-b border-border/40">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-border/60 overflow-hidden p-1.5">
                      <img src={carrier.logo} alt={carrier.name} className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                      />
                      <div className={`${carrier.color} w-full h-full rounded items-center justify-center hidden`}>
                        <span className="text-white font-bold text-xs">{carrier.initials}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">{carrier.name}</h3>
                      <a href={`tel:${carrier.phone}`} className="text-[12px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-1">
                        <Phone className="w-2.5 h-2.5" />
                        {carrier.phone}
                      </a>
                    </div>

                  </div>

                  {/* Action buttons */}
                  <div className="px-4 py-3 flex gap-2">
                    <a
                      href={carrier.payUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors text-xs font-medium text-center"
                    >
                      Pay Bill
                    </a>

                    <a
                      href={carrier.claimUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 rounded-lg border border-orange-400 text-orange-600 hover:bg-orange-50 transition-colors text-xs font-medium text-center"
                    >
                      File Claim
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom help banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl bg-primary p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div>
            <h3 className="font-semibold text-lg text-white mb-1">Need Help? We're Here for You.</h3>
            <p className="text-white/75 text-sm">Not sure where to go or having trouble? Call our office — we'll guide you through it.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="tel:1-617-387-7466"
              className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              (617) 387-7466
            </a>
            <a
              href="/contact"
              className="flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              Send a Message
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}