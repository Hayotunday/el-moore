"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  Copy,
  BookOpen,
  UserCheck,
  Twitter,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/scroll-reveal";
import MarkdownRenderer from "@/components/markdown-renderer";
import { getPostBySlug, listPublishedPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils";
import { estimateReadingTime, getMarkdownExcerpt } from "@/lib/markdown-utils";
import type { BlogPost } from "@/lib/api/types";

export default function BlogDetailsPage() {
  const params = useParams();
  const slugParam = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slugParam) return;
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setNotFound(false);

      let fetchedPost: BlogPost | null = null;

      // 1. Fetch single post directly from GET /api/blog/posts/:slug
      try {
        fetchedPost = await getPostBySlug(slugParam);
      } catch {
        // Post not found directly by slug
      }

      // 2. Fetch all published posts from GET /api/blog/posts for related section / fallback search
      let publishedList: BlogPost[] = [];
      try {
        publishedList = await listPublishedPosts();
      } catch {
        // Ignore error
      }

      if (cancelled) return;

      setAllPosts(Array.isArray(publishedList) ? publishedList : []);

      // If single endpoint returned a post, use it
      if (fetchedPost) {
        setPost(fetchedPost);
        setLoading(false);
        return;
      }

      // Fallback: search in publishedList by slug or id
      const match = publishedList.find((p) => p.slug === slugParam || p.id === slugParam);
      if (match) {
        setPost(match);
      } else {
        setNotFound(true);
      }

      setLoading(false);
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [slugParam]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOnTwitter = () => {
    if (typeof window === "undefined" || !post) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`"${post.title}" via El-Moore Academy`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    if (typeof window === "undefined" || !post) return;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  if (loading) {
    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 rounded-full border-2 border-gold border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading article insight…</p>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <BookOpen className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h1 className="font-serif text-3xl font-medium mb-3">Article Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The editorial insight you are looking for may have been updated or moved.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" /> Back to The Academy
        </Link>
      </div>
    );
  }

  const readTime = estimateReadingTime(post.content);
  const formattedDate = formatDate(post.publishedAt || post.createdAt || new Date().toISOString());
  const relatedPosts = allPosts.filter((p) => p.id !== post.id && p.slug !== post.slug).slice(0, 3);

  return (
    <article className="min-h-screen pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-primary/5 border-b border-border/40 py-6">
        <div className="container">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to The Academy
          </Link>
        </div>
      </div>

      {/* Header Container */}
      <header className="container pt-10 pb-8 max-w-4xl">
        <ScrollReveal>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-gold/20 text-gold-deep px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded">
              Editorial Insight
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-gold" />
              <span>{formattedDate}</span>
              <span>•</span>
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>{readTime} min read</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.15] text-foreground mb-6">
            {post.title}
          </h1>

          {/* Author & Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/50 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-gold/30 flex items-center justify-center text-gold font-serif font-bold text-sm">
                EM
              </div>
              <div>
                <p className="font-semibold text-foreground leading-snug">
                  El-Moore Editorial Desk
                </p>
                <p className="text-xs text-muted-foreground">
                  Financial & Real Estate Advisory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border/60 text-xs font-medium hover:border-gold hover:text-gold transition-colors"
                title="Copy link"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={shareOnTwitter}
                className="p-2 rounded-md bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                title="Share on X / Twitter"
              >
                <Twitter className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={shareOnLinkedIn}
                className="p-2 rounded-md bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </header>

      {/* Hero Image */}
      {post.coverImageUrl && (
        <div className="container max-w-4xl mb-12">
          <ScrollReveal>
            <div className="relative aspect-21/9 rounded-md overflow-hidden shadow-ambient bg-muted">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* Article Markdown Content */}
      <main className="container max-w-3xl">
        <ScrollReveal>
          <MarkdownRenderer content={post.content} />
        </ScrollReveal>
      </main>

      {/* Author Trust Badge */}
      <section className="container max-w-3xl mt-16 pt-8 border-t border-border/60">
        <ScrollReveal>
          <div className="bg-card rounded-md p-6 border border-border/40 shadow-ambient flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="h-14 w-14 rounded-full bg-gradient-green text-gold flex items-center justify-center shrink-0 shadow-xs">
              <UserCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-foreground">
                Verified by El-Moore Legal & Research Team
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Our market insights and title breakdown frameworks are prepared directly by senior conveyancing counsel and real estate analysts at El-Moore Real Estate.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="container max-w-5xl mt-20">
          <ScrollReveal>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-1">More Insights</p>
                <h2 className="font-serif text-2xl font-medium">
                  Continue Reading The Academy
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-semibold text-gold hover:underline underline-offset-4 hidden sm:block"
              >
                View all articles →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relPost, i) => (
              <ScrollReveal key={relPost.id} delay={i * 0.1}>
                <Link
                  href={`/blog/${relPost.slug || relPost.id}`}
                  className="group block rounded-md bg-card border border-border/30 overflow-hidden h-full shadow-ambient transition-all duration-300 hover:shadow-ambient-lg hover:-translate-y-0.5"
                >
                  <div className="aspect-3/2 overflow-hidden bg-muted relative">
                    {relPost.coverImageUrl ? (
                      <img
                        src={relPost.coverImageUrl}
                        alt={relPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col justify-between h-[calc(100%-aspect-3/2)]">
                    <div>
                      <h3 className="font-serif font-medium text-base text-foreground group-hover:text-gold transition-colors line-clamp-2">
                        {relPost.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                        {getMarkdownExcerpt(relPost.content, 120)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-4 pt-3 border-t border-border/30">
                      <span>{formatDate(relPost.publishedAt || relPost.createdAt || "")}</span>
                      <span className="text-gold font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
