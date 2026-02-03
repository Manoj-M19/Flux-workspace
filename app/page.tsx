"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.02]" />

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/50" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/30 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-mono tracking-wide">
              Real-time collaboration
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-light tracking-tight mb-6"
          >
            Work flows
            <br />
            <span className="gradient-text">better together</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            A minimalist workspace designed for teams who value clarity, speed,
            and seamless collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/workspaces"
              className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-smooth focus-ring"
            >
              Get started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border border-border rounded-full font-medium hover:bg-muted transition-smooth focus-ring"
            >
              Learn more
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-border/50 flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-foreground/50"
            />
          </div>
        </motion.div>
      </section>

      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-display font-light tracking-tight mb-4">
              Built for flow
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              Everything you need, nothing you don't
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="p-8 rounded-2xl border border-border/50 hover:border-border transition-smooth bg-muted/20 hover:bg-muted/40">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-display font-medium mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary" />
            <span className="font-display font-medium text-lg">Flux</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Framer Motion & PostgreSQL
          </p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: Zap,
    title: "Real-time sync",
    description:
      "See changes instantly as your team collaborates. No refresh needed.",
  },
  {
    icon: Users,
    title: "Live presence",
    description:
      "Know who's working on what with real-time presence indicators.",
  },
  {
    icon: Sparkles,
    title: "Effortless UI",
    description:
      "Clean, minimal interface that gets out of your way so you can focus.",
  },
];
