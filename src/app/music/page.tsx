"use client";

import { motion } from "framer-motion";
import { Music, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const albums = [
  {
    title: "Album Title 1",
    year: "2024",
    description: "Placeholder for album description",
  },
  {
    title: "Album Title 2",
    year: "2023",
    description: "Placeholder for album description",
  },
  {
    title: "Album Title 3",
    year: "2022",
    description: "Placeholder for album description",
  },
  {
    title: "Album Title 4",
    year: "2021",
    description: "Placeholder for album description",
  },
];

const streamingLinks = [
  { name: "Spotify", href: "#" },
  { name: "Apple Music", href: "#" },
  { name: "SoundCloud", href: "#" },
  { name: "Bandcamp", href: "#" },
];

export default function MusicPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-music/10 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex p-4 rounded-2xl bg-music/20 text-music mb-6">
              <Music className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-music">Music</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Jazz bassist exploring the intersection of tradition and innovation.
              Performing, recording, and collaborating in the Bay Area music scene.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Release */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Featured Release</h2>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Album Art Placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-music/30 via-music/20 to-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto rounded-full bg-music/30 flex items-center justify-center mb-4">
                        <Play className="w-12 h-12 text-music" />
                      </div>
                      <span className="text-muted-foreground">Album artwork placeholder</span>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-music text-sm font-medium mb-2">Latest Release</span>
                    <h3 className="text-3xl font-bold mb-2">Album Title</h3>
                    <p className="text-muted-foreground mb-6">
                      Placeholder for album description. This is where you&apos;ll describe
                      the album, its themes, collaborators, and what inspired the music.
                    </p>

                    {/* Embed Placeholder */}
                    <div className="bg-muted/50 rounded-lg p-8 mb-6 text-center border border-dashed border-muted-foreground">
                      <p className="text-muted-foreground text-sm">
                        Spotify/SoundCloud embed placeholder
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {streamingLinks.map((link) => (
                        <Button key={link.name} variant="outline" size="sm" asChild>
                          <a href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.name}
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Discography */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Discography</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {albums.map((album, index) => (
                <motion.div
                  key={album.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group cursor-pointer hover:border-music transition-all duration-300">
                    <CardContent className="p-4">
                      {/* Album Art Placeholder */}
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-music/20 to-primary/10 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                        <Music className="w-12 h-12 text-music/50" />
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-music transition-colors">
                        {album.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{album.year}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Performances */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Live Performances</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Placeholder 1 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center border-b">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-muted-foreground mb-2 mx-auto" />
                      <span className="text-muted-foreground text-sm">Video embed placeholder</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">Performance Title</h3>
                    <p className="text-sm text-muted-foreground">Venue Name, Date</p>
                  </div>
                </CardContent>
              </Card>

              {/* Video Placeholder 2 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center border-b">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-muted-foreground mb-2 mx-auto" />
                      <span className="text-muted-foreground text-sm">Video embed placeholder</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">Performance Title</h3>
                    <p className="text-sm text-muted-foreground">Venue Name, Date</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Music */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">About My Music</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Placeholder for your music bio. Share your musical journey, influences,
                the artists you&apos;ve worked with, and what drives your passion for jazz bass.
              </p>
              <p>
                Describe your style, your approach to music, and any upcoming projects
                or collaborations you&apos;re excited about.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
