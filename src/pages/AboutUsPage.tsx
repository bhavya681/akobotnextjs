"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Bot,
  Check,
  Shield,
  Plug,
  Layers,
  Sparkles,
  ArrowRight,
  Star,
  Rocket,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
};

const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { duration: 0.3 },
};

const agents = [
  {
    icon: MessageSquare,
    title: "Support Agent – 24/7 Intelligent Customer Automation",
    desc: "Deliver instant, human-like responses across channels. Handle inquiries, resolve issues, analyze sentiment, and automatically generate support tickets. Reduce support costs. Increase customer satisfaction. Scale effortlessly.",
  },
  {
    icon: TrendingUp,
    title: "Sales Agent – Your 24/7 Revenue Engine",
    desc: "Engage visitors, qualify leads, schedule meetings, and guide prospects through intelligent sales conversations. Shorten sales cycles and increase conversions through AI-powered engagement.",
  },
  {
    icon: Users,
    title: "Lead Management Agent – Automated Prospect Qualification",
    desc: "Capture and score leads in real time. Route high-value prospects directly into your CRM and sales pipeline. Never miss an opportunity again.",
  },
  {
    icon: Calendar,
    title: "Booking Agent – Seamless Appointment Automation",
    desc: "Automate scheduling, confirmations, and reminders. Eliminate back-and-forth communication and improve customer experience.",
  },
  {
    icon: FileText,
    title: "Content Creation Agent – AI Marketing at Scale",
    desc: "Generate marketing content, promotional materials, and digital assets instantly. Maintain consistent branding while reducing creative workload.",
  },
  {
    icon: BarChart3,
    title: "Data Analysis Agent – Smarter Business Decisions",
    desc: "Turn business data into actionable insights. Automated reporting and intelligent analytics for faster strategic decisions.",
  },
];

const customUseCases = [
  "E-commerce automation bots",
  "HR & recruitment agents",
  "Customer onboarding assistants",
  "Finance & operations bots",
  "Industry-specific AI systems",
  "Internal workflow automation agents",
  "Custom API-integrated AI solutions",
];

const whyPoints = [
  "24/7 AI-powered customer support",
  "Automated lead capture & sales engagement",
  "Smart scheduling & workflow automation",
  "AI-driven content & visual generation",
  "Seamless integration with existing tools",
  "Scalable infrastructure for growing businesses",
];

const securityFeatures = [
  {
    title: "Advanced guardrails for brand-safe responses",
    desc: "AKOBOT agents are tuned to your brand's unique tone, voice, and policies. Our guardrails ensure every response stays professional, on-topic, and compliant with your industry's rules and regulations.",
  },
  {
    title: "Evidence-based, accurate responses",
    desc: "Every answer is grounded in your own business data — your docs, FAQs, and product info. No hallucinations, no off-topic replies. Just reliable responses your customers can trust.",
  },
  {
    title: "Security and privacy of your customer's data",
    desc: "Customer conversations are encrypted end-to-end and never sold or shared with third parties. Your customer data stays yours — always.",
  },
  {
    title: "Privacy of LLM training data",
    desc: "We do not use your business data or conversations to train our AI models. What happens in your workspace stays in your workspace.",
  },
];

const faqs = [
  {
    q: "Can I upload my own documents for AKOBOT to provide answers?",
    a: "Yes. You can train your AKOBOT agent on your own documents — PDFs, FAQs, product manuals, help articles, and more. The agent learns from your content and uses it to answer customer questions accurately.",
  },
  {
    q: "Do I need coding skills to set up AKOBOT?",
    a: "No coding required at all. AKOBOT is built for non-technical users. You can create, train, and deploy a fully functional AI agent in minutes using our no-code builder.",
  },
  {
    q: "Is AKOBOT available on WhatsApp?",
    a: "Yes. AKOBOT supports WhatsApp, Web, Slack, Discord, Email, and more. You can deploy the same agent across multiple channels from a single dashboard.",
  },
  {
    q: "Can AKOBOT respond to queries from my e-commerce website?",
    a: "Absolutely. AKOBOT integrates with your website and e-commerce platforms like Shopify. It can answer product questions, help customers track orders, recommend products, and even share discount codes.",
  },
  {
    q: "Which AI models does AKOBOT use?",
    a: "AKOBOT is powered by leading AI models including GPT-4, Claude, and Sarvam. You can choose the model that best fits your use case, and your agents will improve with every conversation.",
  },
  {
    q: "How long does it take to go live?",
    a: "Most businesses go live within an hour. Simply connect your data sources, configure your agent's tone and behaviour, and deploy — no lengthy onboarding or technical setup needed.",
  },
];

const AboutUsPage = () => {
  const router = useRouter();
  const [contactForm, setContactForm] = useState({ email: "", message: "" });

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden w-full relative">
      <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }} ></div>
      <div className="relative z-10">
        <Navbar />
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="mx-auto max-w-5xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Automation Platform</span>
            </motion.div>
            
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Build Your AI Workforce &amp;{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Automate Your Business Operations
              </span>
            </motion.h1>
            
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Deploy intelligent AI agents for support, sales, content creation, and custom automation — all in one scalable ecosystem.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap gap-3 justify-center text-sm sm:text-base text-muted-foreground mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {["24/7 Support", "Sales Automation", "Content Generation", "Custom AI Agents"].map((item, i) => (
                <motion.span
                  key={i}
                  className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                onClick={() => router.push("/auth/sign-in")}
              >
                Start Building Your AI Agent
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-border hover:border-primary/50 px-8 py-6 text-base font-semibold backdrop-blur-sm bg-background/50 hover:bg-muted/30 transition-all"
                onClick={() => router.push("/pricing")}
              >
                Book a Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-border hover:border-primary/50 px-8 py-6 text-base font-semibold backdrop-blur-sm bg-background/50 hover:bg-muted/30 transition-all"
                onClick={() => window.open("https://discord.gg/54FjQR7G", "_blank")}
              >
                Join our Discord
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Why AKOBOT Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 relative">
          <div className="mx-auto max-w-6xl">
            <motion.div className="text-center mb-12" {...fadeIn}>
              <div className="inline-flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why Choose Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Why <span className="text-primary">AKOBOT</span>?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
                Modern businesses need more than chatbots. They need intelligent AI agents that perform real work.
              </p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                AKOBOT combines conversational AI, workflow automation, sales intelligence, and content generation into one unified platform.
              </p>
            </motion.div>
            
            <motion.ul
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
            >
              {whyPoints.map((point, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                  variants={fadeIn}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                  </div>
                  <span className="text-foreground font-medium pt-0.5">{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Win and Retain Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight"
              {...fadeIn}
            >
              Deliver 24/7 Customer Support with Smart AI Chat and Voice Agents
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-3"
              {...fadeIn}
            >
              Now sell and service in 50+ languages. At 60% lower operating costs
            </motion.p>
            <motion.p
              className="text-lg font-medium text-primary mb-10"
              {...fadeIn}
            >
              Works with WhatsApp, Web, Shopify, Email, CRM.
            </motion.p>

            <motion.div className="relative max-w-xl mx-auto mb-6" {...fadeIn}>
              <div className="absolute -left-28 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-1">
                <span className="text-sm text-muted-foreground italic" style={{ fontFamily: "cursive" }}>
                  Enter Website Url
                </span>
                <ArrowRight className="w-5 h-5 text-muted-foreground rotate-45 self-end mr-2" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 shadow-sm">
                <input
                  type="text"
                  placeholder="Go Live! Resolve 80% sales and support queries"
                  className="flex-1 bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/60 min-w-0"
                />
                <Button
                  size="sm"
                  className="rounded-full px-4 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 gap-1"
                  onClick={() => router.push("/auth/sign-in")}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Try for free
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground"
              {...fadeIn}
            >
              {["No sign-up", "No credit card", "Forever free plan", "Instant setup"].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Agents Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background dark:from-muted/10 dark:to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <div className="mx-auto max-w-7xl relative z-10">
            <motion.div className="text-center mb-16" {...fadeIn}>
              <div className="inline-flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Agents</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Most Powerful{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AI Agents
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These flagship agents demonstrate the full power of AKOBOT. Built for real business impact.
              </p>
            </motion.div>
            
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
            >
              {agents.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden"
                    variants={fadeIn}
                    whileHover={cardHover}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex gap-4 mb-4">
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 p-4 h-fit group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-foreground mb-3 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Custom Agents Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-5xl">
            <motion.div className="text-center mb-12" {...fadeIn}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Not Just These Bots —{" "}
                <span className="text-primary">Build Any AI Agent</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
                AKOBOT is fully customizable. You are not limited to predefined bots.
              </p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Our platform allows you to build any AI agent tailored to your workflow, industry, or business model.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-gradient-to-br from-card to-card/50 rounded-3xl border border-border/50 p-8 md:p-12 shadow-xl"
              {...fadeIn}
            >
              <h3 className="text-xl font-bold text-foreground text-center mb-8">
                Create Custom Solutions:
              </h3>
              <motion.ul
                className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto"
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                {customUseCases.map((useCase, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    variants={fadeIn}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-foreground">{useCase}</span>
                  </motion.li>
                ))}
              </motion.ul>
              
              <motion.div
                className="mt-10 text-center p-6 rounded-2xl bg-primary/5 border border-primary/20"
                {...fadeIn}
              >
                <p className="text-lg font-semibold text-foreground">
                  If your business has a process —{" "}
                  <span className="text-primary">AKOBOT can automate it.</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20 border-y border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <div className="mx-auto max-w-4xl text-center relative z-10">
            <motion.div {...fadeIn} className="flex justify-center mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 p-6">
                <Plug className="w-12 h-12 text-primary" />
              </div>
            </motion.div>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6"
              {...fadeIn}
            >
              Works With Your{" "}
              <span className="text-primary">Existing Tools</span>
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              {...fadeIn}
            >
              AKOBOT integrates seamlessly with CRMs, helpdesk platforms, e-commerce systems, marketing tools, and custom APIs. No disruption. No complex setup. Just intelligent automation layered onto your existing infrastructure.
            </motion.p>
          </div>
        </section>

        {/* Scale Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div {...fadeIn} className="flex justify-center mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 p-6">
                <Layers className="w-12 h-12 text-primary" />
              </div>
            </motion.div>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6"
              {...fadeIn}
            >
              Built for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Scale
              </span>
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto"
              {...fadeIn}
            >
              Whether you are a startup, growing business, or enterprise organization, AKOBOT scales with your operations.
            </motion.p>
            <motion.p
              className="text-base text-muted-foreground max-w-2xl mx-auto"
              {...fadeIn}
            >
              Automate thousands of conversations. Manage unlimited workflows. Deploy AI agents across multiple departments. Grow without increasing overhead.
            </motion.p>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background dark:from-muted/10 dark:to-background relative">
          <div className="mx-auto max-w-6xl">
            <motion.div className="text-center mb-14" {...fadeIn}>
              <div className="inline-flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Security & Privacy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Security and privacy
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                AKOBOT ensures security, privacy, and trust in every interaction
              </p>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
            >
              {securityFeatures.map((item, i) => (
                <motion.div
                  key={i}
                  className="group rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  variants={fadeIn}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors shrink-0">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-center text-base text-muted-foreground mt-10"
              {...fadeIn}
            >
              Your automation runs securely and reliably at scale.
            </motion.p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 relative">
          <div className="mx-auto max-w-3xl">
            <motion.div className="text-center mb-12" {...fadeIn}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Frequently asked questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about AKOBOT
              </p>
            </motion.div>

            <motion.div {...fadeIn}>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="rounded-xl border border-border/50 bg-card/50 px-6 hover:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5 text-base">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <motion.div
            className="mx-auto max-w-3xl text-center relative z-10"
            {...fadeIn}
          >
            <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-12 md:p-16 shadow-2xl">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Bot className="w-10 h-10 text-primary" />
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Stop hiring for{" "}
                <span className="text-primary">repetitive tasks</span>.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Start deploying AI agents that work 24/7. Build your AI workforce with AKOBOT.
              </p>
              
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                onClick={() => router.push("/auth/sign-in")}
              >
                Start Building Your AI Agent
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Contact Us Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 relative">
          <div className="mx-auto max-w-5xl">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Left */}
              <div className="space-y-5">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                  Contact us
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Use this form to send your business use case, technical or pricing queries, demo requests or FAQs
                </p>
                <a
                  href="mailto:hello@akobot.ai"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  hello@akobot.ai
                </a>
              </div>

              {/* Right — form */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-colors"
                    suppressHydrationWarning
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-colors resize-none"
                    suppressHydrationWarning
                  />
                </div>
                <Button
                  className="w-full py-6 text-base font-semibold rounded-lg bg-linear-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white shadow-lg shadow-violet-500/20 transition-all"
                  onClick={() => {
                    setContactForm({ email: "", message: "" });
                  }}
                >
                  Send Message
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default AboutUsPage;
