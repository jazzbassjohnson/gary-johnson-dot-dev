"use client";

import { motion } from "framer-motion";
import { Briefcase, Leaf, Recycle, Users, TrendingUp, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const responsibilities = [
  {
    title: "Supply Chain Management",
    description: "Overseeing sustainable sourcing and logistics for hand-dyed and upcycled materials.",
    icon: TrendingUp,
  },
  {
    title: "Sustainability Initiatives",
    description: "Implementing eco-friendly practices and reducing environmental impact across operations.",
    icon: Leaf,
  },
  {
    title: "Team Operations",
    description: "Coordinating cross-functional teams to ensure smooth production and fulfillment.",
    icon: Users,
  },
  {
    title: "Quality Assurance",
    description: "Maintaining high standards for unique, handcrafted fashion pieces.",
    icon: Heart,
  },
];

const sustainabilityMetrics = [
  { label: "Upcycled Materials", value: "XX%", description: "of materials sourced from recycled textiles" },
  { label: "Carbon Footprint", value: "XX%", description: "reduction in emissions year over year" },
  { label: "Local Production", value: "100%", description: "made in Oakland, California" },
  { label: "Zero Waste", value: "Goal", description: "working toward zero-waste production" },
];

export default function OperationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-operations/10 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex p-4 rounded-2xl bg-operations/20 text-operations mb-6">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-operations">Operations Leadership</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Functional Operations Leader at Mira Blackman, an Oakland-based
              sustainable fashion brand pioneering hand-dyed and upcycled clothing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mira Blackman Feature */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Brand Image Placeholder */}
                  <div className="aspect-square lg:aspect-auto bg-gradient-to-br from-operations/30 via-operations/20 to-accent/20 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto rounded-full bg-operations/30 flex items-center justify-center mb-4">
                        <Recycle className="w-16 h-16 text-operations" />
                      </div>
                      <h3 className="text-2xl font-bold text-operations mb-2">Mira Blackman</h3>
                      <p className="text-muted-foreground">Brand imagery placeholder</p>
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-operations text-sm font-medium mb-2">Oakland, California</span>
                    <h2 className="text-3xl font-bold mb-4">Sustainable Fashion Pioneer</h2>
                    <p className="text-muted-foreground mb-6">
                      Mira Blackman is redefining sustainable fashion through hand-dyed and
                      upcycled clothing. Each piece is unique, crafted with care for both
                      style and environmental responsibility.
                    </p>
                    <p className="text-muted-foreground mb-8">
                      As Functional Operations Leader, I oversee the operational backbone
                      that makes sustainable fashion possible at scale while maintaining
                      the artisanal quality that defines the brand.
                    </p>

                    <Button className="w-fit bg-operations hover:bg-operations/90" asChild>
                      <a href="https://mirablackman.com" target="_blank" rel="noopener noreferrer">
                        Visit Mira Blackman
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Key Responsibilities</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {responsibilities.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:border-operations/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-operations/20 text-operations">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sustainability Impact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Sustainability Focus</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every operational decision is made with sustainability at the forefront.
                Here are some of the metrics we track and goals we&apos;re working toward.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sustainabilityMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:border-operations/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="text-4xl font-bold text-operations mb-2">
                        {metric.value}
                      </div>
                      <h3 className="font-semibold mb-1">{metric.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {metric.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Operations Philosophy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Placeholder for your operations philosophy. Describe your approach to
                balancing efficiency with sustainability, and how you ensure that
                every aspect of operations aligns with the brand&apos;s mission.
              </p>
              <p>
                Share insights about managing a sustainable fashion operation,
                the unique challenges, and the rewards of building something that
                makes a positive impact.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Placeholder */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Behind the Scenes</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gradient-to-br from-operations/20 to-accent/10 flex items-center justify-center border border-dashed border-muted"
                >
                  <span className="text-muted-foreground text-sm">Photo {i}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
