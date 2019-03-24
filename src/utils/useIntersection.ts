import { useEffect, useState } from 'react';

const useIntersection = (
  targets: React.RefObject<HTMLElement>[],
  containerRef: React.RefObject<HTMLElement>,
  options: object
): number => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const activeEntry =
      entries.length > 1
        ? entries.reduce((prev, current) =>
            prev.intersectionRatio > current.intersectionRatio ? prev : current
          )
        : entries[0];

    if (!activeEntry) {
      return;
    }

    const activeIndex = targets.findIndex(
      ({ current }) => current === activeEntry.target
    );

    setActiveIndex(activeIndex);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: containerRef.current,
      ...options
    });

    targets.forEach(target => {
      if (target && target.current) {
        observer.observe(target.current);
      }
    });

    return () => observer.disconnect();
  }, [containerRef]);

  return activeIndex;
};

export default useIntersection;
