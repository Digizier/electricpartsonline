'use client';

import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export function SEOHead({
  title,
  description,
  canonical,
  image,
  type = 'website',
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Dynamic Title
    if (title) {
      document.title = title.includes('Usman Traders') ? title : `${title} | Usman Traders Pakistan`;
    }

    // Helper to update or create meta tags
    const updateMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.replace('meta[name="', '').replace('"]', '');
          el.name = name;
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.replace('meta[property="', '').replace('"]', '');
          el.setAttribute('property', prop);
        }
        document.head.appendChild(el);
      }
      el.content = value;
    };

    // 2. Meta Description
    if (description) {
      updateMeta('meta[name="description"]', 'content', description);
      updateMeta('meta[property="og:description"]', 'content', description);
      updateMeta('meta[name="twitter:description"]', 'content', description);
    }

    // 3. OpenGraph / Twitter Title
    if (title) {
      updateMeta('meta[property="og:title"]', 'content', title);
      updateMeta('meta[name="twitter:title"]', 'content', title);
    }

    // 4. Canonical URL
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonical;
      updateMeta('meta[property="og:url"]', 'content', canonical);
    }

    // 5. Image
    if (image) {
      updateMeta('meta[property="og:image"]', 'content', image);
      updateMeta('meta[name="twitter:image"]', 'content', image);
    }

    // 6. Type
    if (type) {
      updateMeta('meta[property="og:type"]', 'content', type);
    }

    // 7. Dynamic JSON-LD Structured Data
    const scriptId = 'dynamic-seo-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      // Cleanup dynamically injected product schema when unmounting
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [title, description, canonical, image, type, jsonLd]);

  return null;
}
