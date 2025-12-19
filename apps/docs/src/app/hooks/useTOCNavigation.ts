import {useEffect, useRef, useState} from 'react';
import {Heading} from '@/utils/headingUtils';
import {useScrollDirection} from '@/hooks/useScrollDirection';

export const useTOCNavigation = (headings: Heading[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollDirection = useScrollDirection();

  const visible = useRef<Map<string, DOMRect>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.current.set(entry.target.id, entry.boundingClientRect);
          } else {
            visible.current.delete(entry.target.id);
          }
        });

        const candidates = Array.from(visible.current.entries());
        if (candidates.length === 0) {
          return;
        }

        const sorted = candidates.sort((a, b) => (
          scrollDirection === 'DOWN'
            ? a[1].top - b[1].top
            : b[1].top - a[1].top
        ));

        setActiveId(sorted[0][0]);
      },
      {rootMargin: '-71px 0px -70% 0px'}
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [headings, scrollDirection]);

  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const isDocumentBottom = scrollPosition + viewportHeight >= documentHeight;

      if (isDocumentBottom) {
        setActiveId(headings[headings.length - 1]?.id ?? null);
      }
    };

    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  return activeId;
};
