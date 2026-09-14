"use client";

import { useEffect, useState } from "react";
import { BookOpen, Scale, Shield } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/scroll-reveal";
import { listPublishedPosts } from "@/lib/api/blog";
import { subscribe } from "@/lib/api/newsletter";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/api/types";

export default function Blog() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublishedPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const [featured, ...rest] = posts;

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

  return (
    <div>
      <section className="container pt-12 pb-6">
        <ScrollReveal>
          <p className="eyebrow mb-3">The El-Moore Academy</p>
          <h1 className="font-serif text-3xl md:text-4xl font-medium max-w-xl">
            Insights for the discerning investor.
          </h1>
        </ScrollReveal>
      </section>

      {loading ? (
        <section className="container py-12">
          <div className="aspect-video rounded-md bg-muted animate-pulse" />
        </section>
      ) : featured ? (
        <section className="container py-6">
          <ScrollReveal>
            <div className="grid md:grid-cols-2 gap-8 items-center bg-card text-card-foreground rounded-md overflow-hidden shadow-ambient">
              <div className="relative aspect-4/3 bg-muted">
                <span className="absolute top-4 left-4 z-10 bg-gold text-secondary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded">
                  Featured Insight
                </span>
                {featured.coverImageUrl ? (
                  <img
                    src={featured.coverImageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="p-8 space-y-4">
                <h2 className="font-serif text-3xl font-medium leading-tight">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-4">
                  {featured.content}
                </p>
                {featured.publishedAt && (
                  <p className="text-xs text-muted-foreground">
                    {formatDate(featured.publishedAt)}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>
      ) : (
        <section className="container py-12">
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            More insights are coming soon from the El-Moore editorial desk.
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="container py-12">
          <ScrollReveal>
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-medium">
                More From the Newsroom
              </h2>
              <p className="text-sm text-muted-foreground">
                Fresh from the El-Moore editorial desk.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.08}>
                <div className="group cursor-pointer rounded-md bg-card overflow-hidden h-full shadow-ambient transition-shadow hover:shadow-ambient-lg">
                  <div className="aspect-3/2 overflow-hidden bg-muted">
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
                  <div className="p-6">
                    <h3 className="font-serif font-medium text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                      {post.content}
                    </p>
                    {post.publishedAt && (
                      <p className="text-xs text-muted-foreground mt-4">
                        {formatDate(post.publishedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Legal Masterclass */}
      <section className="bg-gradient-green w-full">
        <div className="container py-16">
          <ScrollReveal>
            <h2 className="font-serif text-2xl font-medium italic mb-1 text-white">
              Legal Masterclass
            </h2>
            <p className="text-sm text-white/70 mb-8">
              Asset protection and regulatory frameworks every investor should
              know.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="flex gap-6 border border-white/10 text-white rounded-md p-6">
                <div className="w-24 h-32 rounded bg-white/10 shrink-0 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white/50" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                    Getting Started
                  </span>
                  <h3 className="font-bold text-white">
                    Understanding &quot;Certificate of Occupancy&quot;
                  </h3>
                  <p className="text-sm text-white/70">
                    The vital document every Nigerian land investor must master
                    before committing capital.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="space-y-4">
              <ScrollReveal delay={0.1}>
                <div className="border border-white/10 text-white rounded-md p-5 flex items-start gap-3">
                  <Scale className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Governor&apos;s Consent, Explained
                    </h4>
                    <p className="text-xs text-white/70 mt-1">
                      Why title perfection matters before you sign.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="border border-white/10 text-white rounded-md p-5 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Due Diligence Before You Buy
                    </h4>
                    <p className="text-xs text-white/70 mt-1">
                      The verification steps El-Moore runs on every listing.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-20">
        <ScrollReveal>
          <div className="bg-gradient-green rounded-md p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl font-medium italic mb-1 text-white">
                The Curator&apos;s Digest
              </h2>
              <p className="text-sm text-white/70">
                Receive our latest architectural and financial analysis directly
                in your inbox.
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
