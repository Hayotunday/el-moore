"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Scale,
  Shield,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/scroll-reveal";
import { listPublishedPosts } from "@/lib/api/blog";
import { subscribe } from "@/lib/api/newsletter";
import { formatDate } from "@/lib/utils";
import {
  getMarkdownExcerpt,
  estimateReadingTime,
} from "@/lib/markdown-utils";
import type { BlogPost } from "@/lib/api/types";

export default function Blog() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;
    listPublishedPosts()
      .then((data) => {
        if (!cancelled) {
          setPosts(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error("Error fetching published blog posts:", err);
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      await subscribe(email.trim());
      toast.success("You're subscribed to The Curator's Digest.");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not subscribe.");
    } finally {
      setSubscribing(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === "All") return true;
      if (selectedCategory === "Legal & Titles") {
        return (
          post.title.toLowerCase().includes("title") ||
          post.title.toLowerCase().includes("legal") ||
          post.title.toLowerCase().includes("occupancy") ||
          post.title.toLowerCase().includes("consent")
        );
      }
      if (selectedCategory === "ROI & Wealth") {
        return (
          post.title.toLowerCase().includes("roi") ||
          post.title.toLowerCase().includes("invest") ||
          post.title.toLowerCase().includes("yield") ||
          post.title.toLowerCase().includes("land")
        );
      }
      return true;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="container pt-12 pb-8">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">The El-Moore Academy</p>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight mb-4">
              Insights for the discerning investor.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              In-depth legal frameworks, land title perfection guides, and commercial ROI intelligence curated by El-Moore experts.
            </p>
          </div>
        </ScrollReveal>

        {/* Search & Filter Controls */}
        <ScrollReveal delay={0.1}>
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-md bg-card border border-border/40 shadow-ambient">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search legal guides, title perfection, ROI models…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-muted/30 border border-border/50 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 shrink-0 mr-1">
                <Filter className="h-3 w-3" /> Category:
              </span>
              {["All", "Legal & Titles", "ROI & Wealth"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Featured Post */}
      {loading ? (
        <section className="container py-6">
          <div className="aspect-21/9 rounded-md bg-muted animate-pulse" />
        </section>
      ) : featured ? (
        <section className="container py-6">
          <ScrollReveal>
            <Link
              href={`/blog/${featured.slug || featured.id}`}
              className="group block rounded-md bg-card text-card-foreground border border-border/40 overflow-hidden shadow-ambient transition-all duration-300 hover:shadow-ambient-lg"
            >
              <div className="grid md:grid-cols-2 items-stretch">
                <div className="relative aspect-4/3 md:aspect-auto min-h-[260px] bg-muted overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 bg-gold text-secondary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded shadow-xs">
                    Featured Insight
                  </span>
                  {featured.coverImageUrl ? (
                    <img
                      src={featured.coverImageUrl}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-green">
                      <BookOpen className="h-12 w-12 text-white/40" />
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gold" />
                        {formatDate(featured.publishedAt || featured.createdAt || "")}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gold" />
                        {estimateReadingTime(featured.content)} min read
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl md:text-3xl font-medium leading-tight group-hover:text-gold transition-colors">
                      {featured.title}
                    </h2>

                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-3">
                      {getMarkdownExcerpt(featured.content, 220)}
                    </p>
                  </div>

                  <div className="flex items-center text-sm font-semibold text-gold gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Read Full Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </section>
      ) : (
        <section className="container py-12">
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            {searchQuery || selectedCategory !== "All"
              ? "No editorial insights matched your filter. Try adjusting your search query."
              : "More insights are coming soon from the El-Moore editorial desk."}
          </div>
        </section>
      )}

      {/* Grid of Remaining Posts */}
      {rest.length > 0 && (
        <section className="container py-12">
          <ScrollReveal>
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-medium">
                More From the Newsroom
              </h2>
              <p className="text-sm text-muted-foreground">
                Fresh from the El-Moore editorial and legal advisory desk.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.08}>
                <Link
                  href={`/blog/${post.slug || post.id}`}
                  className="group block rounded-md bg-card border border-border/30 overflow-hidden h-full shadow-ambient transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-0.5"
                >
                  <div className="aspect-3/2 overflow-hidden bg-muted relative">
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col justify-between h-[calc(100%-aspect-3/2)]">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3 text-gold" />
                        <span>{formatDate(post.publishedAt || post.createdAt || "")}</span>
                        <span>•</span>
                        <span>{estimateReadingTime(post.content)} min</span>
                      </div>

                      <h3 className="font-serif font-medium text-lg text-foreground group-hover:text-gold transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                        {getMarkdownExcerpt(post.content, 140)}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-semibold text-gold gap-1 mt-5 pt-3 border-t border-border/30 group-hover:translate-x-1 transition-transform">
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Legal Masterclass Banner */}
      <section className="bg-gradient-green w-full my-12">
        <div className="container py-16">
          <ScrollReveal>
            <h2 className="font-serif text-2xl font-medium italic mb-1 text-white">
              Legal Masterclass
            </h2>
            <p className="text-sm text-white/70 mb-8 max-w-xl">
              Asset protection and regulatory frameworks every Nigerian land investor must master.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="flex gap-6 border border-white/10 bg-white/5 text-white rounded-md p-6 h-full">
                <div className="w-24 h-32 rounded bg-white/10 shrink-0 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gold" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                    Getting Started
                  </span>
                  <h3 className="font-bold text-white">
                    Understanding &quot;Certificate of Occupancy&quot;
                  </h3>
                  <p className="text-sm text-white/70">
                    The vital document every Nigerian land investor must master before committing capital.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              <ScrollReveal delay={0.1}>
                <div className="border border-white/10 bg-white/5 text-white rounded-md p-5 flex items-start gap-3.5">
                  <Scale className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Governor&apos;s Consent, Explained
                    </h4>
                    <p className="text-xs text-white/70 mt-1">
                      Why title perfection matters before you sign a deed of assignment.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="border border-white/10 bg-white/5 text-white rounded-md p-5 flex items-start gap-3.5">
                  <Shield className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Due Diligence Before You Buy
                    </h4>
                    <p className="text-xs text-white/70 mt-1">
                      The multi-tiered verification steps El-Moore runs on every listing.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-12 mb-12">
        <ScrollReveal>
          <div className="bg-gradient-green rounded-md p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl font-medium italic mb-1 text-white">
                The Curator&apos;s Digest
              </h2>
              <p className="text-sm text-white/70">
                Receive our latest architectural and financial analysis directly in your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="professional@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-white/20 rounded-md px-4 py-2.5 text-sm bg-white/10 text-white placeholder:text-white/50 flex-1 md:w-64 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="bg-gold text-secondary-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] whitespace-nowrap disabled:opacity-60"
              >
                {subscribing ? "Subscribing…" : "Subscribe Now"}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
