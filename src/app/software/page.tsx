"use client";

import { motion } from "framer-motion";
import { Code, ExternalLink, Github, Building2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const experience = [
  {
    company: "Linktree",
    role: "Software Engineer",
    period: "Current",
    description: "Building tools that help creators connect with their audiences.",
    technologies: ["React", "TypeScript", "Node.js"],
  },
  {
    company: "Previous Company",
    role: "Full Stack Developer",
    period: "2020 - 2023",
    description: "Placeholder for previous role description.",
    technologies: ["React", "Python", "PostgreSQL"],
  },
  {
    company: "Hack Reactor",
    role: "Software Engineering Immersive",
    period: "2014",
    description: "Completed 1,000+ hours of intensive full stack development training.",
    technologies: ["JavaScript", "Node.js", "React"],
    isEducation: true,
  },
];

const projects = [
  {
    title: "Project One",
    description: "Placeholder description for your first featured project. Describe what it does and the problem it solves.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    github: "#",
    demo: "#",
  },
  {
    title: "Project Two",
    description: "Placeholder description for your second featured project. Highlight key features and technologies used.",
    technologies: ["Next.js", "Prisma", "PostgreSQL"],
    github: "#",
    demo: "#",
  },
  {
    title: "Project Three",
    description: "Placeholder description for your third featured project. Mention any interesting technical challenges.",
    technologies: ["Node.js", "Express", "MongoDB"],
    github: "#",
  },
  {
    title: "Project Four",
    description: "Placeholder description for another project. Share what you learned or achieved.",
    technologies: ["Python", "FastAPI", "Redis"],
    github: "#",
    demo: "#",
  },
];

const skills = {
  languages: ["JavaScript", "TypeScript", "Python", "SQL"],
  frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  backend: ["Node.js", "Express", "FastAPI", "PostgreSQL"],
  tools: ["Git", "Docker", "AWS", "Vercel"],
};

export default function SoftwarePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-software/10 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex p-4 rounded-2xl bg-software/20 text-software mb-6">
              <Code className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-software">Software Development</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Full stack developer crafting elegant solutions with modern technologies.
              Hack Reactor 2014 graduate, currently building at Linktree.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Experience</h2>

            <div className="space-y-6">
              {experience.map((item, index) => (
                <motion.div
                  key={item.company}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:border-software/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${item.isEducation ? 'bg-accent/20 text-accent' : 'bg-software/20 text-software'}`}>
                            {item.isEducation ? (
                              <GraduationCap className="w-6 h-6" />
                            ) : (
                              <Building2 className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{item.company}</h3>
                            <p className="text-software font-medium">{item.role}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.technologies.map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {item.period}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:border-software/50 transition-colors">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Project Screenshot Placeholder */}
                      <div className="aspect-video rounded-lg bg-gradient-to-br from-software/20 to-primary/10 mb-4 flex items-center justify-center">
                        <Code className="w-12 h-12 text-software/50" />
                      </div>

                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-grow">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="software" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            Code
                          </a>
                        </Button>
                        {project.demo && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Skills & Technologies</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(skills).map(([category, items], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold capitalize mb-4 text-software">
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Badge key={item} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
