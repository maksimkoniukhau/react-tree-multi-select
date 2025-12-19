import {useEffect, useRef, useState} from 'react';

export const useScrollDirection = (): 'UP' | 'DOWN' => {
  const [direction, setDirection] = useState<'UP' | 'DOWN'>('DOWN');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setDirection(scrollY > lastScrollY.current ? 'DOWN' : 'UP');
      lastScrollY.current = scrollY;
    };

    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return direction;
};
