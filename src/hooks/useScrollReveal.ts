import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

/**
 * Aplica fade + slide suave em todos os elementos com [data-reveal]
 * conforme entram no viewport. Re-executa a cada mudança de rota.
 */
export const useScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      if (reduceMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      targets.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? "0");
        const y = parseFloat(el.dataset.revealY ?? "32");

        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // garante recalculo após imagens carregarem
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [location.pathname]);
};
