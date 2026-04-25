"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Music, Code, Briefcase, Gamepad2, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const roles = [
  "Full Stack Developer",
  "Jazz Bassist",
  "Operations Leader",
];

const sections = [
  {
    href: "/music",
    title: "Music",
    description: "Jazz bass, performances, and recordings",
    icon: Music,
    color: "music",
    gradient: "from-music/20 to-music/5",
  },
  {
    href: "/software",
    title: "Software",
    description: "Full stack development and projects",
    icon: Code,
    color: "software",
    gradient: "from-software/20 to-software/5",
  },
  {
    href: "/operations",
    title: "Operations",
    description: "Sustainable fashion at Mira Blackman",
    icon: Briefcase,
    color: "operations",
    gradient: "from-operations/20 to-operations/5",
  },
  {
    href: "/games",
    title: "Games",
    description: "90s arcade-style mini games",
    icon: Gamepad2,
    color: "games",
    gradient: "from-games/20 to-games/5",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Gary Johnson</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-12 mb-8"
          >
            <RoleRotator roles={roles} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Building software, making music, and leading operations in sustainable fashion.
            Based in the San Francisco Bay Area.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <Link href="/software">
                View Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/music">Listen to Music</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Section Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover my work across music, software development, operations leadership, and some fun retro games.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={section.href}>
                  <Card className={`group cursor-pointer hover:border-${section.color} hover:shadow-xl hover:shadow-${section.color}/10 transition-all duration-300 overflow-hidden`}>
                    <CardContent className="p-0">
                      <div className={`bg-gradient-to-br ${section.gradient} p-8`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className={`inline-flex p-3 rounded-xl bg-${section.color}/20 text-${section.color} mb-4`}>
                              <section.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {section.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {section.description}
                            </p>
                          </div>
                          <ArrowRight className={`w-6 h-6 text-muted-foreground group-hover:text-${section.color} group-hover:translate-x-1 transition-all`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Photo placeholder */}
              <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center border-2 border-dashed border-muted">
                <span className="text-muted-foreground text-sm">Photo placeholder</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">About Me</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I&apos;m a full stack developer with a passion for building elegant, user-focused applications.
                  After completing an intensive program at Hack Reactor in 2014, I&apos;ve been crafting software
                  solutions across various industries.
                </p>
                <p>
                  Beyond code, I&apos;m a jazz bassist who brings the same creativity and precision to music
                  as I do to software development. Music has been a lifelong pursuit that complements my
                  technical work.
                </p>
                <p>
                  Currently, I serve as the Functional Operations Leader at Mira Blackman, an Oakland-based
                  sustainable fashion brand specializing in hand-dyed and upcycled clothing. I also work at
                  Linktree, helping connect creators with their audiences.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-software/20 text-software text-sm">React</span>
                <span className="px-3 py-1 rounded-full bg-software/20 text-software text-sm">TypeScript</span>
                <span className="px-3 py-1 rounded-full bg-software/20 text-software text-sm">Node.js</span>
                <span className="px-3 py-1 rounded-full bg-music/20 text-music text-sm">Jazz Bass</span>
                <span className="px-3 py-1 rounded-full bg-operations/20 text-operations text-sm">Operations</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleRotator({ roles }: { roles: string[] }) {
  return (
    <motion.div
      key="role-rotator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-2xl sm:text-3xl text-muted-foreground"
    >
      {roles.map((role, index) => (
        <motion.span
          key={role}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [20, 0, 0, -20],
          }}
          transition={{
            duration: 3,
            delay: index * 3,
            repeat: Infinity,
            repeatDelay: (roles.length - 1) * 3,
          }}
          className="absolute left-0 right-0"
        >
          {role}
        </motion.span>
      ))}
    </motion.div>
  );
}
