"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { 
  ArrowRight, 
  Sparkles, 
  Users,
  Workflow,
  PenTool,
  MousePointer2,
  MessageSquare,
  Boxes,
  BarChart3,
  Github,
  Star,
} from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Flux
              </span>
            </motion.div>

            {/* Center Nav */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden md:flex items-center gap-8"
            >
              <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                Features
              </Link>
              <Link href="#resources" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                Resources
              </Link>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              {session ? (
                <Link 
                  href="/workspaces" 
                  className="group px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => signIn()}
                    className="group px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/workspaces" })}
                    className="group px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Try for free
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-white">
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-8"
          >
            <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
            <span className="text-sm font-medium text-purple-700">Loved by teams</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Collaborate
            </span>
            <br />
            <span className="text-gray-900">visually, ship faster</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            The unified workspace where teams brainstorm, diagram, and document
            <span className="font-medium text-purple-600"> in one delightful experience</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {session ? (
              <Link 
                href="/workspaces" 
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-medium rounded-full hover:shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/workspaces" })}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Start with Google — it's free
                </button>
                <button
                  onClick={() => signIn("github", { callbackUrl: "/workspaces" })}
                  className="group px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Github className="w-5 h-5" />
                  Continue with GitHub
                </button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
              One tool for
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> everything</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stop juggling multiple tools. Flux brings your entire workflow into one beautiful workspace.
            </p>
          </motion.div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whimsicalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="h-full p-8 bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-purple-300 transition-all">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="text-purple-600 font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="relative py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
              Learn & grow with
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Flux</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to get started and master collaborative workflows.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-gray-50 rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-purple-300 transition-all"
              >
                <resource.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <a href="#" className="text-purple-600 font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
                  {resource.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-16 text-center shadow-2xl"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of teams already collaborating visually on Flux.
              </p>
              
              {!session && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/workspaces" })}
                    className="px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-full hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Start for free
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-2xl">Flux</span>
              </div>
              <p className="text-gray-400 mb-6">
                The visual workspace where teams create, collaborate, and ship faster.
              </p>
            </div>

            {/* Links */}
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 Flux. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const whimsicalFeatures = [
  {
    icon: Workflow,
    title: "Flowcharts",
    description: "Map out processes, user flows, and system architectures with smart shapes and connectors.",
  },
  {
    icon: PenTool,
    title: "Wireframes",
    description: "Design beautiful interfaces with pre-built components and drag-and-drop simplicity.",
  },
  {
    icon: MousePointer2,
    title: "Mind Maps",
    description: "Brainstorm ideas, organize thoughts, and see the big picture with infinite canvas.",
  },
  {
    icon: MessageSquare,
    title: "Sticky Notes",
    description: "Collaborate in real-time with virtual sticky notes. Perfect for workshops.",
  },
  {
    icon: Boxes,
    title: "Docs & Wiki",
    description: "Write beautiful documentation with rich formatting and collaborative editing.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track team activity, measure engagement, and understand workspace usage.",
  },
];

const resources = [
  {
    icon: Boxes,
    title: "Documentation",
    description: "Comprehensive guides and tutorials to help you get the most out of Flux.",
    cta: "Browse docs",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join thousands of users sharing tips, templates, and best practices.",
    cta: "Join community",
  },
  {
    icon: Sparkles,
    title: "Templates",
    description: "Kickstart your projects with our library of professional templates.",
    cta: "Explore templates",
  },
];

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Templates", "Integrations"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Blog", "Tutorials", "Community"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
];