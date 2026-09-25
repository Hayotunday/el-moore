"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-md overflow-hidden bg-[#001712] border border-white/10 shadow-ambient">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-white/60">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-gold transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-100/90 leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose-custom text-foreground/90 leading-relaxed font-sans ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mt-10 mb-5 leading-tight tracking-tight border-b border-border/40 pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mt-9 mb-4 leading-snug">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground mt-7 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-serif text-lg font-semibold text-foreground mt-5 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-base md:text-[17px] leading-relaxed text-foreground/90 mb-6 font-normal">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gold bg-gold/5 pl-6 py-4 my-8 rounded-r-md italic text-muted-foreground text-base md:text-lg shadow-xs">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 space-y-2.5 mb-6 text-foreground/90 text-base md:text-[17px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 space-y-2.5 mb-6 text-foreground/90 text-base md:text-[17px]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed">{children}</li>
          ),
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-gold font-medium underline underline-offset-4 hover:text-gold/80 transition-colors inline-flex items-center gap-1"
              >
                {children}
                {isExternal && <ExternalLink className="h-3 w-3 opacity-70" />}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <figure className="my-8 rounded-md overflow-hidden bg-muted/30 border border-border/40 shadow-ambient">
              <img
                src={src}
                alt={alt || "Blog image"}
                className="w-full h-auto max-h-[550px] object-cover rounded-md"
                loading="lazy"
              />
              {alt && (
                <figcaption className="text-center text-xs text-muted-foreground py-2 px-4 italic border-t border-border/20 bg-muted/10">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto rounded-md border border-border/50 shadow-xs">
              <table className="w-full text-left border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-primary/5 border-b border-border text-foreground font-serif">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/30 bg-card">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/20 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="py-3 px-4 font-semibold text-foreground text-xs uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-3.5 px-4 text-muted-foreground leading-normal">{children}</td>
          ),
          hr: () => <hr className="my-10 border-border/50" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");
            
            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono border border-border/50 text-foreground font-medium">
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock language={match?.[1]}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
