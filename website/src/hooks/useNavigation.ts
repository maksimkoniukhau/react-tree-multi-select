import {useEffect, useRef} from 'react';

export const useNavigation = (): void => {
  const sectionId = useRef<string>('');

  useEffect(() => {
    const handleScroll = (): void => {
      const sections = Array.from(document.querySelectorAll('.section-heading')) as HTMLElement[];
      if (!sections.length) {
        return;
      }
      const links = document.querySelectorAll('.nav-link');

      let currentSectionId = '';

      sections.forEach((section: HTMLElement) => {
        const sectionHeight = section.offsetHeight;
        const distanceFromDocumentTop = section.getBoundingClientRect().top + window.scrollY - 71;
        if (window.scrollY >= distanceFromDocumentTop && window.scrollY <= distanceFromDocumentTop + sectionHeight) {
          currentSectionId = section.id;
          sectionId.current = currentSectionId;
          return;
        }
      });

      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      if (scrollPosition + viewportHeight >= documentHeight) {
        if (sectionId.current !== sections[sections.length - 1].id) {
          currentSectionId = sections[sections.length - 1].id;
          sectionId.current = currentSectionId;
        }
      }

      links.forEach((link) => link.classList.remove('active'));

      const activeLink = document.querySelector(`a[href="#${currentSectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
