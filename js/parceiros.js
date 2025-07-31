gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const logoSlots = document.querySelectorAll(".logo-slot");

  const masterTimeline = gsap.timeline({
    paused: true,
    repeat: -1,
  });

  logoSlots.forEach((slot) => {
    const logos = slot.querySelectorAll(".logo");
    const isFirstColumn = slot.closest(".column-1") !== null;

    if (logos.length < 2) {
      if (logos.length === 1) {
        gsap.set(logos[0], { opacity: 1 });
      }
      return;
    }

    gsap.set(logos, { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 });
    gsap.set(logos[0], { opacity: 1 });

    const timeline = gsap.timeline();

    // A correção definitiva:
    // Garante que no início de CADA repetição, o primeiro logo esteja
    // não só visível, mas perfeitamente posicionado.
    timeline.set(logos[0], { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 });

    logos.forEach((logo, i) => {
      const nextLogo = logos[(i + 1) % logos.length];
      const currentOut = getDirectionOffset(logo.dataset.fromDirection);
      const nextIn = getDirectionOffset(nextLogo.dataset.fromDirection);
      const waitTime = 2.5;

      timeline
        .to(
          logo,
          {
            opacity: 0,
            x: currentOut.x,
            y: currentOut.y,
            scale: isFirstColumn ? 0.5 : 1,
            rotate: isFirstColumn ? 45 : 0,
            ease: "power2.in",
            duration: 0.8,
          },
          `+=${waitTime}`
        )
        .fromTo(
          nextLogo,
          {
            opacity: 0,
            x: nextIn.x,
            y: nextIn.y,
            scale: isFirstColumn ? 1.5 : 1,
            rotate: isFirstColumn ? -45 : 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            ease: "power2.out",
            duration: 0.8,
          },
          "<0.3"
        );
    });

    masterTimeline.add(timeline, 0);
  });

  ScrollTrigger.create({
    trigger: ".brands-inner",
    start: "top 80%",
    once: true,
    onEnter: () => masterTimeline.play(),
  });
});

function getDirectionOffset(direction) {
  switch (direction) {
    case "top":
      return { x: 0, y: -100 };
    case "bottom":
      return { x: 0, y: 100 };
    case "left":
      return { x: -200, y: 0 };
    case "right":
      return { x: 200, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}
