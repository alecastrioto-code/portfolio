/* =========================================
   PORTFOLIO INTERACTIONS
   ========================================= */

document.documentElement.classList.add("js");

const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* =========================================================
   PORTFOLIO EASTER EGG SYSTEM
   ========================================================= */

const EASTER_EGG_STORAGE_KEY =
  "ale-portfolio-easter-eggs";


const EASTER_EGGS = {

  "rock-game": {
    name: "Make some noise"
  },

  "specialist-handover": {
    name: "Talk to a specialist"
  },

"future-mode": {
  name: "Exceeded the roadmap"
},

"egg-04": {
  name: "Somehow still shipping"
},

"egg-05": {
  name: "Tabpocalypse"
},

"egg-06": {
  name: "Make it pop™"
}

};


/* -------------------------------
   READ PROGRESS
-------------------------------- */

function getEasterEggData() {

  try {

    const stored =
      localStorage.getItem(
        EASTER_EGG_STORAGE_KEY
      );

    return stored
      ? JSON.parse(stored)
      : {};

  } catch (error) {

    console.warn(
      "Couldn't read Easter egg progress:",
      error
    );

    return {};

  }

}


/* -------------------------------
   SAVE PROGRESS
-------------------------------- */

function saveEasterEggData(data) {

  try {

    localStorage.setItem(
      EASTER_EGG_STORAGE_KEY,
      JSON.stringify(data)
    );

  } catch (error) {

    console.warn(
      "Couldn't save Easter egg progress:",
      error
    );

  }

}


/* -------------------------------
   UNLOCK EASTER EGG
-------------------------------- */

function unlockEasterEgg(id) {

  if (!EASTER_EGGS[id]) {

    console.warn(
      `Unknown Easter egg: ${id}`
    );

    return false;

  }


  const progress =
    getEasterEggData();


  /* Already discovered */

  if (progress[id]) {
    return false;
  }


  progress[id] = {

    discoveredAt:
      new Date().toISOString()

  };


  saveEasterEggData(progress);


  window.dispatchEvent(

    new CustomEvent(
      "portfolio-easter-egg-unlocked",
      {
        detail: {
          id,
          egg: EASTER_EGGS[id]
        }
      }
    )

  );


  console.log(
    `🥚 Easter egg unlocked: ${id}`
  );


  return true;

}


/* -------------------------------
   GET TOTAL PROGRESS
-------------------------------- */

function getEasterEggProgress() {

  const stored =
    getEasterEggData();


  const ids =
    Object.keys(EASTER_EGGS);


  const found =
    ids.filter(
      (id) => Boolean(stored[id])
    );


  return {

    found,

    foundCount:
      found.length,

    total:
      ids.length,

    complete:
      found.length === ids.length

  };

}


/* -------------------------------
   EXPOSE GLOBALLY
-------------------------------- */

window.PortfolioEggs = {

  unlock:
    unlockEasterEgg,

  getProgress:
    getEasterEggProgress,

  eggs:
    EASTER_EGGS

};


/* =========================================================
   NAVIGATION — STICKY + MOBILE MENU
   ========================================================= */

const siteNav =
  document.querySelector(".site-nav");

const siteNavToggle =
  document.querySelector(".site-nav-toggle");

const siteNavMenu =
  document.querySelector(".site-nav-links");


if (siteNav) {

  /* --------------------------------
     STICKY / SCROLLED STATE
  -------------------------------- */

  const updateNav = () => {

    siteNav.classList.toggle(
      "is-scrolled",
      window.scrollY > 20
    );

  };


  updateNav();


  window.addEventListener(
    "scroll",
    updateNav,
    {
      passive: true
    }
  );


  /* --------------------------------
     MOBILE MENU
  -------------------------------- */

  if (
    siteNavToggle &&
    siteNavMenu
  ) {

    const navToggleLabel =
      siteNavToggle.querySelector(
        ".site-nav-toggle-label"
      );


    const closeMobileNav = () => {

      siteNav.classList.remove(
        "is-menu-open"
      );


      siteNavToggle.setAttribute(
        "aria-expanded",
        "false"
      );


      siteNavToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );


      if (navToggleLabel) {
        navToggleLabel.textContent =
          "MENU";
      }

    };


    const openMobileNav = () => {

      siteNav.classList.add(
        "is-menu-open"
      );


      siteNavToggle.setAttribute(
        "aria-expanded",
        "true"
      );


      siteNavToggle.setAttribute(
        "aria-label",
        "Close navigation"
      );


      if (navToggleLabel) {
        navToggleLabel.textContent =
          "CLOSE";
      }

    };


    siteNavToggle.addEventListener(
      "click",
      () => {

        const isOpen =
          siteNav.classList.contains(
            "is-menu-open"
          );


        if (isOpen) {
          closeMobileNav();
        }

        else {
          openMobileNav();
        }

      }
    );


    /* Close after selecting a destination */

    siteNavMenu
      .querySelectorAll("a")
      .forEach(
        (link) => {

          link.addEventListener(
            "click",
            closeMobileNav
          );

        }
      );


    /* Escape closes the menu */

    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Escape" &&
          siteNav.classList.contains(
            "is-menu-open"
          )
        ) {

          closeMobileNav();
          siteNavToggle.focus();

        }

      }
    );


    /* Reset if the viewport becomes desktop-sized */

    window.addEventListener(
      "resize",
      () => {

        if (
          window.innerWidth > 700
        ) {

          closeMobileNav();

        }

      }
    );

  }

}


/* =========================================================
   SCROLL REVEALS
   ========================================================= */

const revealSelectors = [

  /* CASE STUDIES */

  ".case-section > .eyebrow",
  ".case-section > h2",
  ".case-intro > .large-copy",
  ".chapter-intro",
  ".pillar-card",
  ".decision-block",
  ".case-takeaway",
  ".impact-item",
  ".learning",
  ".project",
  ".about-principle",

  ".continuity-opening-copy",
  ".continuity-metric",
  ".continuity-handover-header",
  ".continuity-principle",

  ".craft-opening-copy > .eyebrow",
  ".craft-opening-copy > h2",

  ".cv-opening-top",
  ".cv-trajectory",
  ".cv-section-heading",
  ".cv-role-entry",
  ".cv-practice-grid span",
  ".cv-background-column",
  ".cv-print-cta",


  /* CV */

  ".cv-hero-main",
  ".cv-hero-summary",

  ".cv-trajectory",

  ".cv-section-heading",

  ".cv-role-entry",

  ".cv-expertise-grid span",

  ".cv-background-column",

  ".cv-footer-cta"

];


const revealElements =
  document.querySelectorAll(
    revealSelectors.join(",")
  );


if (!prefersReducedMotion) {

  document.body.classList.add(
    "motion-ready"
  );


  revealElements.forEach(
    (element) => {

      element.classList.add(
        "reveal"
      );

    }
  );


  const revealObserver =
    new IntersectionObserver(

      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            entry.target.classList.add(
              "is-visible"
            );


            revealObserver.unobserve(
              entry.target
            );

          }
        );

      },

      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -7% 0px"
      }

    );


  revealElements.forEach(
    (element) => {

      revealObserver.observe(
        element
      );

    }
  );


  /* -------------------------------
     MEDIA + DIAGRAMS
  -------------------------------- */

  const visualElements =
    document.querySelectorAll(
      `
        .capability-image,
        .evidence-image,
        .agent-diagram,
        .handover-visual,
        .continuity-hero-visual
      `
    );


  const visualObserver =
    new IntersectionObserver(

      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            entry.target.classList.add(
              "is-visible"
            );


            visualObserver.unobserve(
              entry.target
            );

          }
        );

      },

      {
        threshold: 0.2
      }

    );


  visualElements.forEach(
    (element) => {

      visualObserver.observe(
        element
      );

    }
  );

}


/* =========================================================
   CASE STUDY ACTIVE SECTION
   ========================================================= */

const progressLinks =
  document.querySelectorAll(
    "[data-section-link]"
  );


const trackedSections =
  [...progressLinks]

    .map(
      (link) => {

        const id =
          link.dataset.sectionLink;

        return document.getElementById(
          id
        );

      }
    )

    .filter(Boolean);


if (trackedSections.length) {

  const sectionObserver =
    new IntersectionObserver(

      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            progressLinks.forEach(
              (link) => {

                link.classList.toggle(
                  "is-active",

                  link.dataset.sectionLink ===
                    entry.target.id
                );

              }
            );

          }
        );

      },

      {
        rootMargin:
          "-28% 0px -58% 0px",

        threshold: 0
      }

    );


  trackedSections.forEach(
    (section) => {

      sectionObserver.observe(
        section
      );

    }
  );

}


/* =========================================================
   SMOOTH INTERNAL NAVIGATION
   ========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const href =
            link.getAttribute(
              "href"
            );


          if (
            !href ||
            href === "#"
          ) {
            return;
          }


          const target =
            document.querySelector(
              href
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          target.scrollIntoView({

            behavior:
              prefersReducedMotion
                ? "auto"
                : "smooth",

            block:
              "start"

          });

        }
      );

    }
  );


/* =========================================================
   HOME HERO
   ========================================================= */

const homeHero =
  document.querySelector(
    ".home-hero"
  );


const heroArt =
  document.querySelector(
    ".home-hero-art"
  );


if (homeHero) {

  requestAnimationFrame(
    () => {

      document.body.classList.add(
        "hero-loaded"
      );

    }
  );

}


/* -------------------------------
   SUBTLE POINTER MOVEMENT
-------------------------------- */

if (
  homeHero &&
  heroArt &&
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches &&
  !prefersReducedMotion
) {

  homeHero.addEventListener(
    "pointermove",
    (event) => {

      const rect =
        homeHero.getBoundingClientRect();


      const x =
        (
          event.clientX -
          rect.left
        )
        /
        rect.width
        -
        0.5;


      const y =
        (
          event.clientY -
          rect.top
        )
        /
        rect.height
        -
        0.5;


      heroArt.style.transform =
        `
          translate3d(
            ${x * 7}px,
            ${y * 5}px,
            0
          )
        `;

    }
  );


  homeHero.addEventListener(
    "pointerleave",
    () => {

      heroArt.style.transform =
        "translate3d(0, 0, 0)";

    }
  );

}


/* =========================================================
   CASE STUDY HERO
   ========================================================= */

const caseHero =
  document.querySelector(
    ".case-hero, .ss-hero"
  );

if (caseHero) {

  requestAnimationFrame(
    () => {

      document.body.classList.add(
        "case-hero-loaded"
      );

    }
  );

}

/* =========================================================
   EASTER EGG — PRODUCT TIME MACHINE
   OPEN / CLOSE + INTERACTIVE TIMELINE + FORBIDDEN FUTURE
   ========================================================= */

const futureMachine =
  document.querySelector("[data-future-machine]");

const futureTrigger =
  document.querySelector("[data-future-trigger]");

const futureClose =
  document.querySelector("[data-future-close]");

const futureBackdrop =
  document.querySelector(".future-machine-backdrop");

const futureTrack =
  document.querySelector(".future-slider-track");

const futureHandle =
  document.querySelector("[data-future-handle]");

const futureProgress =
  document.querySelector("[data-future-progress]");

const futureImage =
  document.querySelector("[data-future-image]");

const futureYear =
  document.querySelector("[data-future-year]");

const futureTitle =
  document.querySelector("[data-future-title]");

const futureDescription =
  document.querySelector("[data-future-description]");

const futureForbidden =
  document.querySelector("[data-future-forbidden]");

const futureReturn =
  document.querySelector("[data-future-return]");


if (
  futureMachine &&
  futureTrigger &&
  futureClose &&
  futureTrack &&
  futureHandle &&
  futureProgress &&
  futureImage &&
  futureYear &&
  futureTitle &&
  futureDescription
) {

  let futureLastFocusedElement = null;
  let futureCloseTimer = null;
  let futureImageTimer = null;
  let futureRevealTimer = null;

  let isDraggingFuture = false;
  let currentFuturePosition = 0;
  let currentFutureState = -1;

  /*
    0–100 = normal roadmap
    100–110 = hidden overscroll zone
    108+ = forbidden future unlock
  */

  const FUTURE_ROADMAP_END = 100;
  const FUTURE_FORBIDDEN_LIMIT = 110;
  const FUTURE_UNLOCK_POINT = 108;

  let futureForbiddenTriggered = false;
  let futureRevealInProgress = false;


  /* -------------------------------
     NORMAL TIMELINE STATES
  -------------------------------- */

  const futureStates = [

    {
      position: 0,
      year: "2024",
      label: "Support AI",
      title:
        "Answers support questions.",
      description:
        "The original vision: make customer support easier to access through conversation.",
      image:
        "../assets/vision/vision-hero-01.png"
    },

    {
      position: 50,
      year: "NOW",
      label: "Vista Assistant",
      title:
        "Understands context, guides and acts.",
      description:
        "The experience moves beyond answering questions by connecting conversation to customer context, service capabilities and human support.",
      image:
        "../assets/vision/vision-hero-02.png"
    },

    {
      position: 100,
      year: "NEXT",
      label: "Copilot",
      title:
        "Becomes part of the product journey.",
      description:
        "The next direction explores a more persistent copilot that can support shopping, decisions and work beyond traditional customer support.",
      image:
        "../assets/vision/vision-hero-03.png"
    }

  ];


  /* -------------------------------
     HELPERS
  -------------------------------- */

  function clampFuturePosition(value) {

    const numericValue =
      Number(value);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(
        FUTURE_FORBIDDEN_LIMIT,
        numericValue
      )
    );

  }


  function getNormalFuturePosition(position) {

    return Math.min(
      position,
      FUTURE_ROADMAP_END
    );

  }


  function getFutureStateIndex(position) {

    const normalPosition =
      getNormalFuturePosition(position);

    if (normalPosition < 25) {
      return 0;
    }

    if (normalPosition < 75) {
      return 1;
    }

    return 2;

  }


  function getNearestFutureState(position) {

    const normalPosition =
      getNormalFuturePosition(position);

    return futureStates.reduce(
      (nearest, state) => {

        const currentDistance =
          Math.abs(
            normalPosition - state.position
          );

        const nearestDistance =
          Math.abs(
            normalPosition - nearest.position
          );

        return currentDistance <
          nearestDistance
          ? state
          : nearest;

      },
      futureStates[0]
    );

  }


  function updateFutureContent(stateIndex) {

    if (
      stateIndex === currentFutureState
    ) {
      return;
    }

    currentFutureState =
      stateIndex;

    const state =
      futureStates[stateIndex];

    futureYear.textContent =
      state.year;

    futureTitle.textContent =
      state.title;

    futureDescription.textContent =
      state.description;

    futureHandle.setAttribute(
      "aria-valuetext",
      `${state.label}: ${state.title}`
    );

    clearTimeout(
      futureImageTimer
    );

    if (prefersReducedMotion) {

      futureImage.src =
        state.image;

      futureImage.alt =
        `${state.label} product direction`;

      futureImage.style.opacity =
        "";

      futureImage.style.transform =
        "";

      return;

    }

    futureImage.style.opacity =
      "0";

    futureImage.style.transform =
      "translateY(6px) scale(0.99)";

    futureImageTimer =
      window.setTimeout(
        () => {

          futureImage.src =
            state.image;

          futureImage.alt =
            `${state.label} product direction`;

          requestAnimationFrame(
            () => {

              futureImage.style.opacity =
                "1";

              futureImage.style.transform =
                "translateY(0) scale(1)";

            }
          );

        },
        140
      );

  }


  function hideForbiddenFuture() {

    clearTimeout(
      futureRevealTimer
    );

    futureRevealInProgress =
      false;

    futureMachine.classList.remove(
      "is-glitching"
    );

    futureHandle.classList.remove(
      "is-beyond-roadmap"
    );

    if (!futureForbidden) {
      return;
    }

    futureForbidden.classList.remove(
      "is-revealed"
    );

    futureForbidden.hidden =
      true;

  }


  function revealForbiddenFuture() {

    if (
      !futureForbidden ||
      futureForbiddenTriggered ||
      futureRevealInProgress
    ) {
      return;
    }

    futureForbiddenTriggered =
      true;

    futureRevealInProgress =
      true;

    futureMachine.classList.add(
      "is-glitching"
    );

    clearTimeout(
      futureRevealTimer
    );

    futureRevealTimer =
      window.setTimeout(
        () => {

          futureMachine.classList.remove(
            "is-glitching"
          );

          futureRevealInProgress =
            false;

          if (futureMachine.hidden) {
            return;
          }

          futureForbidden.hidden =
            false;

          futureForbidden.classList.add(
            "is-revealed"
          );

          /* Easter egg officially discovered */

          window.PortfolioEggs?.unlock(
            "future-mode"
          );

          window.setTimeout(
            () => {

              futureForbidden.scrollIntoView({
                behavior:
                  prefersReducedMotion
                    ? "auto"
                    : "smooth",
                block: "center"
              });

            },
            100
          );

        },
        prefersReducedMotion
          ? 0
          : 650
      );

  }


  function setFuturePosition(
    position,
    {
      updateContent = true
    } = {}
  ) {

    currentFuturePosition =
      clampFuturePosition(
        position
      );

    const normalPosition =
      getNormalFuturePosition(
        currentFuturePosition
      );

    futureHandle.style.left =
      `${currentFuturePosition}%`;

    /*
      The normal progress line stops at
      the approved roadmap boundary.
      Only the handle travels beyond it.
    */

    futureProgress.style.width =
      `${normalPosition}%`;

    const beyondRoadmap =
      currentFuturePosition >
      FUTURE_ROADMAP_END;

    futureHandle.classList.toggle(
      "is-beyond-roadmap",
      beyondRoadmap
    );

    futureHandle.setAttribute(
      "aria-valuenow",
      String(
        Math.round(
          currentFuturePosition
        )
      )
    );

    if (updateContent) {

      updateFutureContent(
        getFutureStateIndex(
          normalPosition
        )
      );

    }

    if (
      currentFuturePosition >=
      FUTURE_UNLOCK_POINT
    ) {

      revealForbiddenFuture();

    }

  }


  function snapFutureToNearestState() {

    /*
      If the user made it far enough to
      unlock the forbidden state, leave
      the handle beyond the roadmap.
    */

    if (
      currentFuturePosition >=
      FUTURE_UNLOCK_POINT
    ) {
      return;
    }

    const nearest =
      getNearestFutureState(
        currentFuturePosition
      );

    setFuturePosition(
      nearest.position
    );

  }


  function getFuturePointerPosition(clientX) {

    const rect =
      futureTrack.getBoundingClientRect();

    if (!rect.width) {
      return 0;
    }

    return (
      (clientX - rect.left)
      /
      rect.width
    ) * 100;

  }


  /* -------------------------------
     ACCESSIBLE SLIDER SETUP
  -------------------------------- */

  futureHandle.setAttribute(
    "role",
    "slider"
  );

  futureHandle.setAttribute(
    "aria-valuemin",
    "0"
  );

  futureHandle.setAttribute(
    "aria-valuemax",
    String(
      FUTURE_FORBIDDEN_LIMIT
    )
  );

  futureHandle.setAttribute(
    "aria-orientation",
    "horizontal"
  );


  /* -------------------------------
     OPEN
  -------------------------------- */

  function openFutureMachine() {

    futureLastFocusedElement =
      document.activeElement;

    clearTimeout(
      futureCloseTimer
    );

    futureMachine.hidden =
      false;

    futureMachine.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    /*
      Every new trip begins at 2024.
      The tracker remains unlocked if
      the egg was found previously.
    */

    futureForbiddenTriggered =
      false;

    hideForbiddenFuture();

    currentFutureState =
      -1;

    setFuturePosition(0);

    requestAnimationFrame(
      () => {

        futureMachine.classList.add(
          "is-open"
        );

        futureClose.focus();

      }
    );

  }


  /* -------------------------------
     CLOSE
  -------------------------------- */

  function closeFutureMachine() {

    isDraggingFuture =
      false;

    clearTimeout(
      futureRevealTimer
    );

    futureRevealInProgress =
      false;

    futureMachine.classList.remove(
      "is-glitching"
    );

    futureMachine.classList.remove(
      "is-open"
    );

    futureMachine.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";

    clearTimeout(
      futureCloseTimer
    );

    futureCloseTimer =
      window.setTimeout(
        () => {

          futureMachine.hidden =
            true;

        },
        prefersReducedMotion
          ? 0
          : 400
      );

    if (
      futureLastFocusedElement instanceof
      HTMLElement
    ) {

      futureLastFocusedElement.focus();

    }

  }


  /* -------------------------------
     OPEN / CLOSE EVENTS
  -------------------------------- */

  futureTrigger.addEventListener(
    "click",
    openFutureMachine
  );

  futureClose.addEventListener(
    "click",
    closeFutureMachine
  );

  futureBackdrop?.addEventListener(
    "click",
    closeFutureMachine
  );


  /* -------------------------------
     RETURN TO RESPONSIBLE STRATEGY
  -------------------------------- */

  futureReturn?.addEventListener(
    "click",
    () => {

      hideForbiddenFuture();

      futureForbiddenTriggered =
        false;

      setFuturePosition(
        FUTURE_ROADMAP_END
      );

      futureHandle.focus();

    }
  );


  /* -------------------------------
     CLICK TIMELINE
  -------------------------------- */

  futureTrack.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        futureHandle
      ) {
        return;
      }

      const position =
        getFuturePointerPosition(
          event.clientX
        );

      setFuturePosition(
        position
      );

      snapFutureToNearestState();

    }
  );


  /* -------------------------------
     DRAG HANDLE
  -------------------------------- */

  futureHandle.addEventListener(
    "pointerdown",
    (event) => {

      event.preventDefault();

      isDraggingFuture =
        true;

      futureHandle.setPointerCapture?.(
        event.pointerId
      );

    }
  );


  window.addEventListener(
    "pointermove",
    (event) => {

      if (!isDraggingFuture) {
        return;
      }

      setFuturePosition(
        getFuturePointerPosition(
          event.clientX
        )
      );

    }
  );


  window.addEventListener(
    "pointerup",
    () => {

      if (!isDraggingFuture) {
        return;
      }

      isDraggingFuture =
        false;

      snapFutureToNearestState();

    }
  );


  window.addEventListener(
    "pointercancel",
    () => {

      if (!isDraggingFuture) {
        return;
      }

      isDraggingFuture =
        false;

      snapFutureToNearestState();

    }
  );


  /* -------------------------------
     KEYBOARD CONTROL
  -------------------------------- */

  futureHandle.addEventListener(
    "keydown",
    (event) => {

      const stateIndex =
        getFutureStateIndex(
          currentFuturePosition
        );

      if (
        event.key ===
        "ArrowRight"
      ) {

        event.preventDefault();

        /*
          Once the user reaches COPILOT,
          Right Arrow quietly enters the
          forbidden overscroll zone too.
        */

        if (
          currentFuturePosition >=
          FUTURE_ROADMAP_END
        ) {

          setFuturePosition(
            currentFuturePosition + 5
          );

          return;

        }

        const nextIndex =
          Math.min(
            futureStates.length - 1,
            stateIndex + 1
          );

        setFuturePosition(
          futureStates[
            nextIndex
          ].position
        );

      }


      if (
        event.key ===
        "ArrowLeft"
      ) {

        event.preventDefault();

        if (
          currentFuturePosition >
          FUTURE_ROADMAP_END
        ) {

          futureForbiddenTriggered =
            false;

          hideForbiddenFuture();

          setFuturePosition(
            FUTURE_ROADMAP_END
          );

          return;

        }

        const previousIndex =
          Math.max(
            0,
            stateIndex - 1
          );

        setFuturePosition(
          futureStates[
            previousIndex
          ].position
        );

      }


      if (event.key === "Home") {

        event.preventDefault();

        futureForbiddenTriggered =
          false;

        hideForbiddenFuture();

        setFuturePosition(
          futureStates[0].position
        );

      }


      if (event.key === "End") {

        event.preventDefault();

        futureForbiddenTriggered =
          false;

        hideForbiddenFuture();

        setFuturePosition(
          FUTURE_ROADMAP_END
        );

      }

    }
  );


  /* -------------------------------
     ESC TO CLOSE
  -------------------------------- */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        !futureMachine.hidden
      ) {

        closeFutureMachine();

      }

    }
  );


  /* Initial state */

  setFuturePosition(0);

}


/* =========================================================
   EASTER EGG — HANDOVER TO ALE
   ========================================================= */

const specialistDialog =
  document.querySelector(
    "[data-specialist-dialog]"
  );


const specialistTrigger =
  document.querySelector(
    "[data-specialist-trigger]"
  );


const specialistCloseButtons =
  document.querySelectorAll(
    "[data-specialist-close]"
  );


const specialistHandoverState =
  document.querySelector(
    "[data-handover-state]"
  );


const specialistHuman =
  document.querySelector(
    "[data-specialist-human]"
  );


const specialistAnswer =
  document.querySelector(
    "[data-specialist-answer]"
  );


const specialistQuestions =
  document.querySelectorAll(
    "[data-specialist-question]"
  );


if (
  specialistDialog &&
  specialistTrigger &&
  specialistHandoverState &&
  specialistHuman &&
  specialistAnswer
) {

  let lastFocusedElement =
    null;

  let handoverTimer =
    null;


  const answers = {

    hardest:
      "The hardest part wasn't designing what the AI should say. It was defining what the system should know, what it could safely do, and when a human was simply the better tool.",

    failed:
      "One early assumption was that lower engagement meant customers didn't want AI support. Research showed something more interesting: people were bringing distrust from other chatbot experiences into ours. That changed what we tested next.",

    hidden:
      "Because if you've made it this far into a case study about handovers, you've earned access to the specialist. Also, apparently I cannot build a normal portfolio."

  };


  /* -------------------------------
     OPEN
  -------------------------------- */

  function openSpecialist() {

    lastFocusedElement =
      document.activeElement;


    specialistDialog.classList.add(
      "is-open"
    );


    specialistDialog.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    specialistHandoverState.hidden =
      false;


    specialistHuman.hidden =
      true;


    specialistAnswer.textContent =
      "";


    clearTimeout(
      handoverTimer
    );


    handoverTimer =
      setTimeout(
        () => {

          specialistHandoverState.hidden =
            true;


          specialistHuman.hidden =
            false;


          /* Easter egg discovered */

          window.PortfolioEggs?.unlock(
            "specialist-handover"
          );


          const firstQuestion =
            specialistHuman.querySelector(
              "[data-specialist-question]"
            );


          firstQuestion?.focus();

        },

        1500
      );

  }


  /* -------------------------------
     CLOSE
  -------------------------------- */

  function closeSpecialist() {

    clearTimeout(
      handoverTimer
    );


    specialistDialog.classList.remove(
      "is-open"
    );


    specialistDialog.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    if (
      lastFocusedElement instanceof
      HTMLElement
    ) {

      lastFocusedElement.focus();

    }

  }


  /* -------------------------------
     OPEN EVENT
  -------------------------------- */

  specialistTrigger.addEventListener(
    "click",
    openSpecialist
  );


  /* -------------------------------
     CLOSE EVENTS
  -------------------------------- */

  specialistCloseButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        closeSpecialist
      );

    }
  );


  /* -------------------------------
     QUESTION RESPONSES
  -------------------------------- */

  specialistQuestions.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const question =
            button.dataset
              .specialistQuestion;


          specialistAnswer.textContent =
            answers[question] || "";

        }
      );

    }
  );


  /* -------------------------------
     ESC TO CLOSE
  -------------------------------- */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        specialistDialog.classList.contains(
          "is-open"
        )
      ) {

        closeSpecialist();

      }

    }
  );

}

/* =========================================================
   PORTFOLIO SIDE QUEST — GLOBAL SHELL
   ========================================================= */

function createPortfolioQuestShell() {

  /* Prevent duplicates */

  if (
    document.querySelector(
      ".portfolio-quest"
    )
  ) {
    return;
  }


  const questShell =
    document.createElement("div");


  questShell.className =
    "portfolio-quest";


  questShell.innerHTML = `
    <button
      class="quest-fab"
      type="button"
      data-quest-trigger
      aria-expanded="false"
      aria-controls="portfolio-quest-panel"
    >

      <span
        class="quest-fab-icon"
        aria-hidden="true"
      >
        🍟
      </span>

      <span class="quest-fab-label">
        FREE DINNER?
      </span>

    </button>


    <section
      class="quest-panel"
      id="portfolio-quest-panel"
      data-quest-panel
      role="dialog"
      aria-labelledby="quest-title"
      hidden
    >

      <div class="quest-panel-header">

        <div>
          <span class="quest-panel-status">
            PORTFOLIO SIDE QUEST
          </span>
        </div>

        <button
          class="quest-close"
          type="button"
          data-quest-close
          aria-label="Close side quest"
        >
          ×
        </button>

      </div>


      <div class="quest-conversation">

        <div
          class="
            quest-message
            quest-message-assistant
          "
        >

          <p>
            Oh good. You clicked it.
            There are
            <strong>6 hidden things</strong>
            somewhere in this portfolio.
          </p>

        </div>


        <div class="quest-reward">

          <span class="quest-reward-label">
            YOUR EXTREMELY SERIOUS REWARD
          </span>

          <strong>
            🍔 McDonald's dinner<br>
            🥤 + one milkshake
          </strong>

        </div>


        <div
          class="quest-progress"
          data-quest-progress
        >

          <div class="quest-progress-header">

            <span>
              CURRENT PROGRESS
            </span>

            <strong data-quest-count>
              0 / 6
            </strong>

          </div>


          <div class="quest-progress-bar">

            <span
              class="quest-progress-fill"
              data-quest-progress-fill
            ></span>

          </div>

        </div>


        <div class="quest-list">

          <ol data-quest-list>

            <li
              data-quest-item="rock-game"
            >
              <span>01</span>
              <strong>???</strong>
            </li>

            <li
              data-quest-item="specialist-handover"
            >
              <span>02</span>
              <strong>???</strong>
            </li>

            <li
              data-quest-item="future-mode"
            >
              <span>03</span>
              <strong>???</strong>
            </li>

            <li
              data-quest-item="egg-04"
            >
              <span>04</span>
              <strong>???</strong>
            </li>

            <li
              data-quest-item="egg-05"
            >
              <span>05</span>
              <strong>???</strong>
            </li>

            <li
              data-quest-item="egg-06"
            >
              <span>06</span>
              <strong>???</strong>
            </li>

          </ol>

        </div>


        <button
          class="quest-start"
          type="button"
          data-quest-start
        >
          START MAKING QUESTIONABLE DECISIONS
          <span aria-hidden="true">→</span>
        </button>


        <p class="quest-legal">
          Terms & conditions: you may need
          to physically locate Ale to claim
          your prize.
        </p>

      </div>

    </section>
  `;


  document.body.appendChild(
    questShell
  );

}


/* Create it on every portfolio page */

createPortfolioQuestShell();

/* =========================================================
   PORTFOLIO SIDE QUEST — FREE DINNER
   ========================================================= */

const questTrigger =
  document.querySelector(
    "[data-quest-trigger]"
  );

const questPanel =
  document.querySelector(
    "[data-quest-panel]"
  );

const questClose =
  document.querySelector(
    "[data-quest-close]"
  );

const questStart =
  document.querySelector(
    "[data-quest-start]"
  );

const questCount =
  document.querySelector(
    "[data-quest-count]"
  );

const questFill =
  document.querySelector(
    "[data-quest-progress-fill]"
  );

const questListItems =
  document.querySelectorAll(
    "[data-quest-item]"
  );

const questFabIcon =
  questTrigger?.querySelector(
    ".quest-fab-icon"
  );

const questFabLabel =
  questTrigger?.querySelector(
    ".quest-fab-label"
  );


if (
  questTrigger &&
  questPanel &&
  questClose
) {

  const QUEST_STARTED_KEY =
    "ale-portfolio-side-quest-started";

  let questLastFocusedElement =
    null;

  let questCloseTimer =
    null;


  /* -------------------------------
     QUEST STATE
  -------------------------------- */

  function isQuestStarted() {

    try {

      return (
        localStorage.getItem(
          QUEST_STARTED_KEY
        ) === "true"
      );

    } catch (error) {

      console.warn(
        "Couldn't read side quest state:",
        error
      );

      return false;

    }

  }


  function saveQuestStarted() {

    try {

      localStorage.setItem(
        QUEST_STARTED_KEY,
        "true"
      );

    } catch (error) {

      console.warn(
        "Couldn't save side quest state:",
        error
      );

    }

  }


  /* -------------------------------
     OPEN / CLOSE
  -------------------------------- */

  function openQuestPanel() {

    questLastFocusedElement =
      document.activeElement;

    clearTimeout(
      questCloseTimer
    );

    questPanel.hidden =
      false;

    questTrigger.setAttribute(
      "aria-expanded",
      "true"
    );

    requestAnimationFrame(
      () => {

        questPanel.classList.add(
          "is-open"
        );

        questClose.focus();

      }
    );

  }


  function closeQuestPanel() {

    questPanel.classList.remove(
      "is-open"
    );

    questTrigger.setAttribute(
      "aria-expanded",
      "false"
    );

    clearTimeout(
      questCloseTimer
    );

    questCloseTimer =
      window.setTimeout(
        () => {

          questPanel.hidden =
            true;

        },
        prefersReducedMotion
          ? 0
          : 240
      );

    if (
      questLastFocusedElement instanceof
      HTMLElement
    ) {

      questLastFocusedElement.focus();

    }

  }


  /* -------------------------------
     PROGRESS
  -------------------------------- */

  function updateQuestUI() {

    const progress =
      window.PortfolioEggs?.getProgress();

    if (!progress) {
      return;
    }

    const found =
      progress.found || [];

    const foundCount =
      progress.foundCount || 0;

    const total =
      progress.total || 6;

    const started =
      isQuestStarted();


    /* Count */

    if (questCount) {

      questCount.textContent =
        `${foundCount} / ${total}`;

    }


    /* Progress bar */

    if (questFill) {

      const percentage =
        total > 0
          ? (foundCount / total) * 100
          : 0;

      questFill.style.width =
        `${percentage}%`;

    }


    /* Floating button */

    if (questFabIcon) {

      questFabIcon.textContent =
        started
          ? "🥚"
          : "🍟";

    }


    if (questFabLabel) {

      questFabLabel.textContent =
        started
          ? `${foundCount} / ${total}`
          : "FREE DINNER?";

    }


    /* Discovered egg names */

    questListItems.forEach(
      (item) => {

        const id =
          item.dataset.questItem;

        const label =
          item.querySelector(
            "strong"
          );

        const isFound =
          found.includes(id);

        item.classList.toggle(
          "is-found",
          isFound
        );

        if (!label) {
          return;
        }

        if (!isFound) {

          label.textContent =
            "???";

          return;

        }

        const eggName =
          window.PortfolioEggs
            ?.eggs?.[id]?.name;

        label.textContent =
          eggName || id;

      }
    );


    /* Start / active / complete button */

    if (questStart) {

      if (progress.complete) {

        questStart.disabled =
          true;

        questStart.textContent =
          "DINNER UNLOCKED ✓";

      }

      else if (started) {

        questStart.disabled =
          true;

        questStart.textContent =
          "SIDE QUEST IN PROGRESS";

      }

      else {

        questStart.disabled =
          false;

        questStart.innerHTML =
          `
            START MAKING QUESTIONABLE DECISIONS
            <span aria-hidden="true">→</span>
          `;

      }

    }


    /* Reward completion copy */

    if (progress.complete) {

      const reward =
        questPanel.querySelector(
          ".quest-reward strong"
        );

      if (reward) {

        reward.innerHTML =
          `
            🍔 Dinner unlocked<br>
            🥤 + one milkshake secured
          `;

      }

    }

  }


  /* -------------------------------
     START QUEST
  -------------------------------- */

  function startQuest() {

    saveQuestStarted();

    updateQuestUI();

  }


  /* -------------------------------
     EVENTS
  -------------------------------- */

  questTrigger.addEventListener(
    "click",
    () => {

      const isOpen =
        questPanel.classList.contains(
          "is-open"
        ) &&
        !questPanel.hidden;

      if (isOpen) {

        closeQuestPanel();

      }

      else {

        openQuestPanel();

      }

    }
  );


  questClose.addEventListener(
    "click",
    closeQuestPanel
  );


  questStart?.addEventListener(
    "click",
    startQuest
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        !questPanel.hidden
      ) {

        closeQuestPanel();

      }

    }
  );


  /*
    Updates immediately when an egg is
    unlocked on the current page.
  */

  window.addEventListener(
    "portfolio-easter-egg-unlocked",
    updateQuestUI
  );


  /*
    Keeps the UI in sync if progress is
    changed in another browser tab.
  */

  window.addEventListener(
    "storage",
    (event) => {

      if (
        event.key ===
          EASTER_EGG_STORAGE_KEY ||
        event.key ===
          QUEST_STARTED_KEY
      ) {

        updateQuestUI();

      }

    }
  );


  /* Initial state */

  updateQuestUI();

}

/* =========================================================
   CV PAGE — CAREER MAP
   Add this near the bottom of script.js.
   If you already added an older "CV PAGE" block,
   replace it with this one.
   ========================================================= */

const cvRoles =
  document.querySelectorAll(
    "[data-cv-role]"
  );

const cvCarry =
  document.querySelector(
    ".cv-carry"
  );

const cvCarryCompany =
  document.querySelector(
    "[data-cv-carry-company]"
  );

const cvCarryTitle =
  document.querySelector(
    "[data-cv-carry-title]"
  );

const cvCarryTags =
  document.querySelector(
    "[data-cv-carry-tags]"
  );

const cvPrintButton =
  document.querySelector(
    "[data-cv-print]"
  );


if (
  cvRoles.length &&
  cvCarry &&
  cvCarryCompany &&
  cvCarryTitle &&
  cvCarryTags
) {

  let activeCvRole =
    null;

  let cvCarryTimer =
    null;


  function updateCvCarry(role) {

    if (
      !role ||
      role === activeCvRole
    ) {
      return;
    }

    activeCvRole =
      role;

    const company =
      role.dataset.carryCompany || "";

    const title =
      role.dataset.carryTitle || "";

    const tags =
      (
        role.dataset.carryTags || ""
      )
        .split("|")
        .filter(Boolean);


    clearTimeout(
      cvCarryTimer
    );


    if (!prefersReducedMotion) {

      cvCarry.classList.add(
        "is-updating"
      );

    }


    cvCarryTimer =
      window.setTimeout(
        () => {

          cvCarryCompany.textContent =
            company;

          cvCarryTitle.textContent =
            title;

          cvCarryTags.innerHTML =
            tags
              .map(
                (tag) =>
                  `<span>${tag}</span>`
              )
              .join("");


          cvCarry.classList.remove(
            "is-updating"
          );

        },
        prefersReducedMotion
          ? 0
          : 130
      );

  }


  const cvRoleObserver =
    new IntersectionObserver(

      (entries) => {

        const visible =
          entries
            .filter(
              (entry) =>
                entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            );


        if (!visible.length) {
          return;
        }


/* --------------------------------
   ACTIVE ROLE WHILE SCROLLING
-------------------------------- */

let cvScrollFrame =
  null;


function updateActiveCvRole() {

  /*
    The role becomes active when its
    top crosses roughly 42% of the
    viewport.

    Once active, it stays active until
    the next role reaches that point.
  */

  const triggerPoint =
    window.innerHeight * 0.42;


  let activeRole =
    cvRoles[0];


  cvRoles.forEach(
    (role) => {

      const rect =
        role.getBoundingClientRect();


      if (
        rect.top <= triggerPoint
      ) {

        activeRole =
          role;

      }

    }
  );


  updateCvCarry(
    activeRole
  );

}


function requestCvRoleUpdate() {

  if (cvScrollFrame) {
    return;
  }


  cvScrollFrame =
    requestAnimationFrame(
      () => {

        updateActiveCvRole();

        cvScrollFrame =
          null;

      }
    );

}


window.addEventListener(
  "scroll",
  requestCvRoleUpdate,
  {
    passive: true
  }
);


window.addEventListener(
  "resize",
  requestCvRoleUpdate
);


/* Initial state */

updateActiveCvRole();

      },

      {
        rootMargin:
          "-22% 0px -56% 0px",

        threshold: [
          0,
          0.15,
          0.35,
          0.6
        ]
      }

    );


  cvRoles.forEach(
    (role) => {

      cvRoleObserver.observe(
        role
      );

    }
  );


  updateCvCarry(
    cvRoles[0]
  );

}


/* --------------------------------
   PRINT / SAVE AS PDF
-------------------------------- */

cvPrintButton?.addEventListener(
  "click",
  () => {

    window.print();

  }
);

/* =========================================================
   EASTER EGG — CAREER CHANGELOG
   ========================================================= */

const cvChangelog =
  document.querySelector(
    "[data-cv-changelog]"
  );

const cvChangelogTrigger =
  document.querySelector(
    "[data-cv-changelog-trigger]"
  );

const cvChangelogCloseButtons =
  document.querySelectorAll(
    "[data-cv-changelog-close]"
  );


if (
  cvChangelog &&
  cvChangelogTrigger
) {

  let cvChangelogLastFocused =
    null;

  let cvChangelogCloseTimer =
    null;


  /* --------------------------------
     OPEN
  -------------------------------- */

  function openCvChangelog() {

    cvChangelogLastFocused =
      document.activeElement;


    clearTimeout(
      cvChangelogCloseTimer
    );


    cvChangelog.hidden =
      false;


    cvChangelog.setAttribute(
      "aria-hidden",
      "false"
    );


    cvChangelogTrigger.setAttribute(
      "aria-expanded",
      "true"
    );


    document.body.style.overflow =
      "hidden";


    requestAnimationFrame(
      () => {

        cvChangelog.classList.add(
          "is-open"
        );


        const closeButton =
          cvChangelog.querySelector(
            ".cv-changelog-close"
          );


        closeButton?.focus();

      }
    );


    /* Easter egg discovered */

    window.PortfolioEggs?.unlock(
      "egg-04"
    );

  }


  /* --------------------------------
     CLOSE
  -------------------------------- */

  function closeCvChangelog() {

    cvChangelog.classList.remove(
      "is-open"
    );


    cvChangelog.setAttribute(
      "aria-hidden",
      "true"
    );


    cvChangelogTrigger.setAttribute(
      "aria-expanded",
      "false"
    );


    document.body.style.overflow =
      "";


    clearTimeout(
      cvChangelogCloseTimer
    );


    cvChangelogCloseTimer =
      window.setTimeout(
        () => {

          cvChangelog.hidden =
            true;

        },
        prefersReducedMotion
          ? 0
          : 340
      );


    if (
      cvChangelogLastFocused instanceof
      HTMLElement
    ) {

      cvChangelogLastFocused.focus();

    }

  }


  /* --------------------------------
     EVENTS
  -------------------------------- */

  cvChangelogTrigger.addEventListener(
    "click",
    openCvChangelog
  );


  cvChangelogCloseButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        closeCvChangelog
      );

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        !cvChangelog.hidden
      ) {

        closeCvChangelog();

      }

    }
  );

}

/* =========================================================
   CV CHANGELOG — CURSED CAREER ROLLBACK
   ========================================================= */

const cvRollbackButtons =
  document.querySelectorAll(
    "[data-cv-rollback]"
  );

const cvRollbackResult =
  document.querySelector(
    "[data-cv-rollback-result]"
  );

const cvRollbackState =
  document.querySelector(
    "[data-cv-rollback-state]"
  );

const cvRollbackVersion =
  document.querySelector(
    "[data-cv-rollback-version]"
  );

const cvRollbackRole =
  document.querySelector(
    "[data-cv-rollback-role]"
  );

const cvRollbackStatus =
  document.querySelector(
    "[data-cv-rollback-status]"
  );

const cvRollbackRestore =
  document.querySelector(
    "[data-cv-rollback-restore]"
  );


if (
  cvRollbackButtons.length &&
  cvRollbackResult &&
  cvRollbackState &&
  cvRollbackVersion &&
  cvRollbackRole &&
  cvRollbackStatus
) {

  let lastRollbackTrigger =
    null;

  let rollbackTimer =
    null;


  /* --------------------------------
     SHOW RESULT
  -------------------------------- */

  function showRollbackResult(button) {

    lastRollbackTrigger =
      button;


    const version =
      button.dataset.version || "";

    const role =
      button.dataset.role || "";

    const status =
      button.dataset.status || "";

    const failed =
      button.dataset.rollbackFailed ===
      "true";


    clearTimeout(
      rollbackTimer
    );


    /*
      Brief fake system-processing state.
    */

    cvRollbackResult.hidden =
      false;

    cvRollbackResult.classList.add(
      "is-entering"
    );


    cvRollbackState.textContent =
      failed
        ? "ROLLBACK FAILED"
        : "ROLLING BACK...";


    cvRollbackVersion.textContent =
      `ALE.CASTRIOTO ${version}`;


    cvRollbackRole.textContent =
      failed
        ? ""
        : "Reconstructing career path...";


    cvRollbackStatus.textContent =
      failed
        ? ""
        : "please wait";


    cvRollbackResult.classList.toggle(
      "is-failed",
      failed
    );


    rollbackTimer =
      window.setTimeout(
        () => {

          if (failed) {

            cvRollbackState.textContent =
              "ROLLBACK FAILED";


            cvRollbackVersion.textContent =
              `ALE.CASTRIOTO ${version}`;


            cvRollbackRole.textContent =
              "";


            cvRollbackStatus.textContent =
              "You are already here. There is no one left to blame.";

          }

          else {

            cvRollbackState.textContent =
              "ROLLBACK COMPLETE";


            cvRollbackVersion.textContent =
              `ALE.CASTRIOTO ${version}`;


            cvRollbackRole.textContent =
              role;


            cvRollbackStatus.textContent =
              status;

          }


          requestAnimationFrame(
            () => {

              cvRollbackResult.classList.remove(
                "is-entering"
              );

            }
          );


          window.setTimeout(
            () => {

              cvRollbackResult.scrollIntoView({
                behavior:
                  prefersReducedMotion
                    ? "auto"
                    : "smooth",

                block:
                  "nearest"
              });

            },
            60
          );

        },

        prefersReducedMotion
          ? 0
          : 420
      );

  }


  /* --------------------------------
     RESTORE CURRENT TIMELINE
  -------------------------------- */

  function restoreCurrentTimeline() {

    clearTimeout(
      rollbackTimer
    );


    cvRollbackResult.classList.add(
      "is-entering"
    );


    window.setTimeout(
      () => {

        cvRollbackResult.hidden =
          true;


        cvRollbackResult.classList.remove(
          "is-entering",
          "is-failed"
        );


        cvRollbackState.textContent =
          "ROLLBACK COMPLETE";


        cvRollbackVersion.textContent =
          "";


        cvRollbackRole.textContent =
          "";


        cvRollbackStatus.textContent =
          "";


        if (
          lastRollbackTrigger instanceof
          HTMLElement
        ) {

          lastRollbackTrigger.focus();

        }

      },

      prefersReducedMotion
        ? 0
        : 180
    );

  }


  /* --------------------------------
     EVENTS
  -------------------------------- */

  cvRollbackButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          showRollbackResult(
            button
          );

        }
      );

    }
  );


  cvRollbackRestore?.addEventListener(
    "click",
    restoreCurrentTimeline
  );

}



/* =========================================================
   EASTER EGG — TABPOCALYPSE
   ========================================================= */

(() => {

  const modal =
    document.querySelector(
      "[data-tabpocalypse]"
    );


  if (!modal) {
    return;
  }


  const openButton =
    document.querySelector(
      "[data-tabpocalypse-open]"
    );


  const closeButtons =
    modal.querySelectorAll(
      "[data-tabpocalypse-close]"
    );


  const tabsContainer =
    modal.querySelector(
      "[data-tabpocalypse-tabs]"
    );


  const countElement =
    modal.querySelector(
      "[data-tabpocalypse-count]"
    );


  const healthElement =
    modal.querySelector(
      "[data-tabpocalypse-health]"
    );


  const manualButton =
    modal.querySelector(
      "[data-tabpocalypse-manual]"
    );


  const aiButton =
    modal.querySelector(
      "[data-tabpocalypse-ai]"
    );


  const stressBar =
    modal.querySelector(
      "[data-tabpocalypse-stress-bar]"
    );


  const stressLabel =
    modal.querySelector(
      "[data-tabpocalypse-stress-label]"
    );


  const summaryEmpty =
    modal.querySelector(
      "[data-tabpocalypse-summary-empty]"
    );


  const summaryGenerated =
    modal.querySelector(
      "[data-tabpocalypse-summary-generated]"
    );


  const summaryStatus =
    modal.querySelector(
      "[data-tabpocalypse-summary-status]"
    );


  const result =
    modal.querySelector(
      "[data-tabpocalypse-result]"
    );



  /* =======================================================
     TAB DATA
     ======================================================= */

  const initialTabs = [

    "Salesforce",

    "Case #48172",

    "Customer Chat",

    "Order Search",

    "Order Search again",

    "Knowledge Base",

    "Missing Orders Policy",

    "Tracking",

    "Chat — Jamie",

    "Chat — Priya",

    "Chat — Alex",

    "Email",

    "Case I swear was here",

    "Untitled",

    "Definitely the right case",

    "Why is this open",

    "???"

  ];


  const extraTabNames = [

    "Order Search, but worse",

    "Another Salesforce",

    "Case maybe",

    "Knowledge Base 2",

    "Old chat probably",

    "PLEASE DON'T CLOSE",

    "Untitled (7)",

    "Where was I?",

    "Tracking again",

    "Possibly important",

    "This seemed necessary",

    "One more tab won't hurt",

    "Case_Final_FINAL",

    "Help",

    "help"

  ];


  let tabCount =
    initialTabs.length;


  let manualClicks =
    0;


  let lastFocusedElement =
    null;



  /* =======================================================
     BUILD TAB
     ======================================================= */

  function createTab(
    label,
    index,
    isNew = false
  ) {

    const tab =
      document.createElement(
        "div"
      );


    tab.className =
      "tabpocalypse-tab";


    tab.textContent =
      label;


    /*
      Three tabs survive when AI restores
      the workspace.
    */

    if (
      label === "Case #48172" ||
      label === "Customer Chat" ||
      label === "Knowledge Base"
    ) {

      tab.classList.add(
        "is-essential"
      );

    }


    if (index === 1) {

      tab.classList.add(
        "is-active"
      );

    }


    if (isNew) {

      tab.classList.add(
        "is-new"
      );

    }


    tabsContainer.appendChild(
      tab
    );

  }



  /* =======================================================
     INITIALISE
     ======================================================= */

  function resetTabpocalypse() {

    modal.classList.remove(
      "is-restored"
    );


    tabsContainer.innerHTML =
      "";


    initialTabs.forEach(
      (tab, index) => {

        createTab(
          tab,
          index
        );

      }
    );


    tabCount =
      initialTabs.length;


    manualClicks =
      0;


    countElement.textContent =
      tabCount;


    healthElement.textContent =
      "WORKSPACE HEALTH: QUESTIONABLE";


    stressBar.style.width =
      "46%";


    stressLabel.textContent =
      "MANAGEABLE-ISH";


    summaryEmpty.hidden =
      false;


    summaryGenerated.hidden =
      true;


    summaryStatus.textContent =
      "NOT STARTED";


    result.hidden =
      true;


    manualButton.textContent =
      "I'll do it manually";


    aiButton.textContent =
      "Let AI do the boring bit";

  }



  /* =======================================================
     OPEN
     ======================================================= */

  function openTabpocalypse() {

    lastFocusedElement =
      document.activeElement;


    resetTabpocalypse();


    modal.hidden =
      false;


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    requestAnimationFrame(
      () => {

        modal.classList.add(
          "is-open"
        );

      }
    );


    const closeButton =
      modal.querySelector(
        ".tabpocalypse-close"
      );


    window.setTimeout(
      () => {

        closeButton?.focus();

      },
      260
    );

  }



  /* =======================================================
     CLOSE
     ======================================================= */

  function closeTabpocalypse() {

    modal.classList.remove(
      "is-open"
    );


    document.body.style.overflow =
      "";


    window.setTimeout(
      () => {

        modal.hidden =
          true;


        modal.setAttribute(
          "aria-hidden",
          "true"
        );


        lastFocusedElement?.focus();

      },
      250
    );

  }



  /* =======================================================
     MANUAL MODE
     ======================================================= */

  function makeThingsWorse() {

    manualClicks +=
      1;


    const amount =
      manualClicks === 1
        ? 3
        : manualClicks === 2
          ? 4
          : 5;


    for (
      let i = 0;
      i < amount;
      i += 1
    ) {

      const randomName =
        extraTabNames[
          Math.floor(
            Math.random() *
            extraTabNames.length
          )
        ];


      createTab(
        randomName,
        tabCount,
        true
      );


      tabCount +=
        1;

    }


    countElement.textContent =
      tabCount;



    /* STRESS LEVEL */

    const stress =
      Math.min(
        46 + manualClicks * 18,
        100
      );


    stressBar.style.width =
      `${stress}%`;



    if (manualClicks === 1) {

      stressLabel.textContent =
        "MILDLY CURSED";


      healthElement.textContent =
        "WORKSPACE HEALTH: DETERIORATING";


      manualButton.textContent =
        "No no, I can handle this";

    }


    else if (manualClicks === 2) {

      stressLabel.textContent =
        "CONCERNING";


      healthElement.textContent =
        "WORKSPACE HEALTH: POOR";


      manualButton.textContent =
        "One more tab won't hurt";

    }


    else {

      stressLabel.textContent =
        "CRITICAL";


      healthElement.textContent =
        "WORKSPACE HEALTH: ABSOLUTELY NOT";


      manualButton.textContent =
        "This was a mistake";

    }

  }



  /* =======================================================
     AI MODE
     ======================================================= */

  function restoreWorkspace() {

    modal.classList.add(
      "is-restored"
    );


    countElement.textContent =
      "3";


    healthElement.textContent =
      "WORKSPACE HEALTH: SUSPICIOUSLY HEALTHY";


    summaryEmpty.hidden =
      true;


    summaryGenerated.hidden =
      false;


    summaryStatus.textContent =
      "GENERATED";


    result.hidden =
      false;


    /*
      Scroll result into view if needed.
    */

    window.setTimeout(
      () => {

        result.scrollIntoView({
          behavior:
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches
              ? "auto"
              : "smooth",

          block:
            "nearest"
        });

      },
      120
    );

  }



  /* =======================================================
     EVENTS
     ======================================================= */

openButton?.addEventListener(
  "click",
  () => {

    /* Easter egg discovered immediately */

    window.PortfolioEggs?.unlock(
      "egg-05"
    );


    openTabpocalypse();

  }
);

  closeButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        closeTabpocalypse
      );

    }
  );


  manualButton?.addEventListener(
    "click",
    makeThingsWorse
  );


  aiButton?.addEventListener(
    "click",
    restoreWorkspace
  );


  modal.addEventListener(
    "click",
    event => {

      if (
        event.target.classList.contains(
          "tabpocalypse-backdrop"
        )
      ) {

        closeTabpocalypse();

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        !modal.hidden
      ) {

        closeTabpocalypse();

      }

    }
  );

})();


/* =========================================================
   EASTER EGG — MAKE IT POP™
   ARCHIVE CLIENT FEEDBACK CONSOLE
   ========================================================= */

(() => {

  const body =
    document.body;


  if (
    !body.classList.contains(
      "archive-page"
    )
  ) {
    return;
  }


  const consolePanel =
    document.querySelector(
      "[data-client-console]"
    );


  const openButton =
    document.querySelector(
      "[data-client-console-open]"
    );


  if (
    !consolePanel ||
    !openButton
  ) {
    return;
  }


  const clientPrefersReducedMotion =
    typeof prefersReducedMotion !== "undefined"
      ? prefersReducedMotion
      : window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;



  /* =======================================================
     ELEMENTS
     ======================================================= */

  const closeButton =
    consolePanel.querySelector(
      "[data-client-console-close]"
    );


  const triggerStatus =
    document.querySelector(
      "[data-client-trigger-status]"
    );


  const feedback =
    consolePanel.querySelector(
      "[data-client-feedback]"
    );


  const logoButton =
    consolePanel.querySelector(
      "[data-client-logo]"
    );


  const logoValue =
    consolePanel.querySelector(
      "[data-client-logo-value]"
    );


  const radiusButton =
    consolePanel.querySelector(
      "[data-client-radius]"
    );


  const radiusValue =
    consolePanel.querySelector(
      "[data-client-radius-value]"
    );


  const gradientButton =
    consolePanel.querySelector(
      "[data-client-gradient]"
    );


  const gradientValue =
    consolePanel.querySelector(
      "[data-client-gradient-value]"
    );


  const motionButton =
    consolePanel.querySelector(
      "[data-client-motion]"
    );


  const motionValue =
    consolePanel.querySelector(
      "[data-client-motion-value]"
    );


  const premiumButton =
    consolePanel.querySelector(
      "[data-client-premium]"
    );


  const premiumValue =
    consolePanel.querySelector(
      "[data-client-premium-value]"
    );


  const popButton =
    consolePanel.querySelector(
      "[data-client-pop]"
    );


  const resetButton =
    consolePanel.querySelector(
      "[data-client-reset]"
    );


  const status =
    consolePanel.querySelector(
      "[data-client-status]"
    );



  /* =======================================================
     STATE
     ======================================================= */

  const DEFAULT_STATE = {

    logo:
      0,

    radius:
      0,

    gradients:
      0,

    motion:
      false,

    premium:
      false,

    pop:
      false

  };


  let state = {
    ...DEFAULT_STATE
  };


  const radiusLevels = [
    16,
    32,
    56,
    96,
    999
  ];



  /* =======================================================
     HELPERS
     ======================================================= */

  function setText(
    element,
    value
  ) {

    if (element) {
      element.textContent =
        value;
    }

  }


  function setFeedback(
    message
  ) {

    setText(
      feedback,
      message
    );

  }



  /* =======================================================
     STATUS COPY
     ======================================================= */

  function getStatusCopy() {

    if (state.pop) {

      return "CLIENT SATISFACTION 100% · DESIGN INTEGRITY -12% · It's definitely popping.";

    }


    if (
      state.logo >= 3 &&
      state.gradients >= 2
    ) {

      return "Stakeholder confidence is increasing for reasons science cannot explain.";

    }


    if (
      state.motion ||
      state.premium ||
      state.gradients >= 1
    ) {

      return "Promising. Could still use a little more visual energy.";

    }


    return "No measurable stakeholder excitement detected.";

  }



  /* =======================================================
     APPLY STATE
     ======================================================= */

  function applyState() {

    const logoScale =
      1 +
      state.logo * .19;


    const radius =
      radiusLevels[
        state.radius
      ];


    body.style.setProperty(
      "--client-logo-scale",
      String(logoScale)
    );


    body.style.setProperty(
      "--client-radius",
      `${radius}px`
    );



    /* CLASSES */

    body.classList.toggle(
      "client-gradients",
      state.gradients >= 1
    );


    body.classList.toggle(
      "client-gradients-max",
      state.gradients >= 2
    );


    body.classList.toggle(
      "client-motion",
      state.motion
    );


    body.classList.toggle(
      "client-premium",
      state.premium
    );


    body.classList.toggle(
      "client-pop",
      state.pop
    );



    /* READOUTS */

    setText(
      logoValue,
      `${Math.round(
        logoScale * 100
      )}%`
    );


    setText(
      radiusValue,
      radius >= 999
        ? "MAXIMUM"
        : `${radius}px`
    );


    const gradientLabels = [
      "RESTRAINED",
      "ENERGETIC",
      "TOO MANY",
      "ABSOLUTELY"
    ];


    setText(
      gradientValue,
      gradientLabels[
        state.gradients
      ]
    );


    setText(
      motionValue,
      state.motion
        ? "EVERYTHING MOVES"
        : "STATIC"
    );


    setText(
      premiumValue,
      state.premium
        ? "LUXURY™"
        : "REGULAR"
    );



    /* BUTTON LABELS */

    if (logoButton) {

      if (state.logo === 0) {

        logoButton.textContent =
          "BIGGER LOGO";

      }

      else if (state.logo === 1) {

        logoButton.textContent =
          "BIGGER";

      }

      else if (state.logo === 2) {

        logoButton.textContent =
          "NO, BIGGER";

      }

      else if (state.logo === 3) {

        logoButton.textContent =
          "BIGGERER";

      }

      else {

        logoButton.textContent =
          "PERFECT. DON'T TOUCH IT.";

      }

    }


    if (radiusButton) {

      if (state.radius <= 1) {

        radiusButton.textContent =
          "ROUNDER";

      }

      else if (state.radius === 2) {

        radiusButton.textContent =
          "EVEN ROUNDER";

      }

      else if (state.radius === 3) {

        radiusButton.textContent =
          "CAN IT BE FRIENDLIER?";

      }

      else {

        radiusButton.textContent =
          "CIRCLES ARE APPROACHABLE";

      }

    }


    if (gradientButton) {

      if (state.gradients === 0) {

        gradientButton.textContent =
          "ADD GRADIENT";

      }

      else if (state.gradients === 1) {

        gradientButton.textContent =
          "ADD ANOTHER GRADIENT";

      }

      else if (state.gradients === 2) {

        gradientButton.textContent =
          "MORE GRADIENT";

      }

      else {

        gradientButton.textContent =
          "WE HAVE ENOUGH GRADIENTS";

      }

    }


    motionButton?.classList.toggle(
      "is-active",
      state.motion
    );


    premiumButton?.classList.toggle(
      "is-active",
      state.premium
    );


    setText(
      status,
      getStatusCopy()
    );

  }



  /* =======================================================
     OPEN / CLOSE
     ======================================================= */

  function openConsole() {

    consolePanel.hidden =
      false;


    consolePanel.setAttribute(
      "aria-hidden",
      "false"
    );


    openButton.setAttribute(
      "aria-expanded",
      "true"
    );


    setText(
      triggerStatus,
      "ON"
    );


    requestAnimationFrame(
      () => {

        consolePanel.classList.add(
          "is-open"
        );

      }
    );


    /*
      Easter egg 06 is discovered as
      soon as the console is found.
    */

    window.PortfolioEggs?.unlock(
      "egg-06"
    );

  }


  function closeConsole() {

    consolePanel.classList.remove(
      "is-open"
    );


    consolePanel.setAttribute(
      "aria-hidden",
      "true"
    );


    openButton.setAttribute(
      "aria-expanded",
      "false"
    );


    setText(
      triggerStatus,
      "OFF"
    );


    window.setTimeout(
      () => {

        consolePanel.hidden =
          true;

      },
      clientPrefersReducedMotion
        ? 0
        : 280
    );

  }



  /* =======================================================
     CONTROLS
     ======================================================= */

  logoButton?.addEventListener(
    "click",
    () => {

      state.logo =
        Math.min(
          4,
          state.logo + 1
        );


      state.pop =
        false;


      const messages = [

        "Can the logo be bigger?",

        "I meant noticeably bigger.",

        "Still feels a bit small.",

        "No, like REALLY bigger."

      ];


      setFeedback(
        state.logo >= 4
          ? "Perfect. Brand awareness solved."
          : messages[
              Math.max(
                0,
                state.logo - 1
              )
            ]
      );


      applyState();

    }
  );


  radiusButton?.addEventListener(
    "click",
    () => {

      state.radius =
        Math.min(
          radiusLevels.length - 1,
          state.radius + 1
        );


      state.pop =
        false;


      const messages = [

        "Can the corners feel a little friendlier?",

        "Rounder.",

        "More approachable.",

        "Even friendlier."

      ];


      setFeedback(
        state.radius >= 4
          ? "Yes. Nothing threatening about a circle."
          : messages[
              Math.max(
                0,
                state.radius - 1
              )
            ]
      );


      applyState();

    }
  );


  gradientButton?.addEventListener(
    "click",
    () => {

      state.gradients =
        Math.min(
          3,
          state.gradients + 1
        );


      state.pop =
        false;


      const messages = [

        "Could we introduce a gradient?",

        "Nice. Could there be another one?",

        "Can you make the gradients more gradient-y?"

      ];


      setFeedback(
        messages[
          Math.max(
            0,
            state.gradients - 1
          )
        ]
      );


      applyState();

    }
  );


  motionButton?.addEventListener(
    "click",
    () => {

      state.motion =
        !state.motion;


      state.pop =
        false;


      setFeedback(
        state.motion
          ? "It feels much more engaging now that nothing stays still."
          : "Actually, maybe it was making me nauseous."
      );


      applyState();

    }
  );


  premiumButton?.addEventListener(
    "click",
    () => {

      state.premium =
        !state.premium;


      state.pop =
        false;


      setFeedback(
        state.premium
          ? "Yes. This definitely feels more premium."
          : "Can we make it less... expensive?"
      );


      applyState();

    }
  );



  /* =======================================================
     MAKE IT POP
     ======================================================= */

  popButton?.addEventListener(
    "click",
    () => {

      state = {

        logo:
          4,

        radius:
          4,

        gradients:
          3,

        motion:
          true,

        premium:
          true,

        pop:
          true

      };


      setFeedback(
        "Yes. That's exactly what I meant by pop."
      );


      applyState();

    }
  );



  /* =======================================================
     RESTORE DIGNITY
     ======================================================= */

  resetButton?.addEventListener(
    "click",
    () => {

      state = {
        ...DEFAULT_STATE
      };


      setFeedback(
        "Professional judgment restored."
      );


      applyState();

    }
  );



  /* =======================================================
     OPEN / CLOSE EVENTS
     ======================================================= */

  openButton.addEventListener(
    "click",
    openConsole
  );


  closeButton?.addEventListener(
    "click",
    closeConsole
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        !consolePanel.hidden
      ) {

        closeConsole();

      }

    }
  );



  /* INITIAL STATE */

  applyState();

})();


/* =========================================================
   CV — MESSENGER PIGEON DELIVERY
   Definitely not an Easter egg.
   ========================================================= */

(() => {

  const pigeon =
    document.querySelector(
      "[data-cv-pigeon]"
    );


  if (!pigeon) {
    return;
  }


  const openButton =
    document.querySelector(
      "[data-cv-pigeon-open]"
    );


  const closeButtons =
    pigeon.querySelectorAll(
      "[data-cv-pigeon-close]"
    );


  const dispatchButton =
    pigeon.querySelector(
      "[data-cv-pigeon-dispatch]"
    );


  const status =
    pigeon.querySelector(
      "[data-cv-pigeon-status]"
    );


  const manifestStatus =
    pigeon.querySelector(
      "[data-cv-pigeon-manifest-status]"
    );


  const result =
    pigeon.querySelector(
      "[data-cv-pigeon-result]"
    );


  let lastFocusedElement =
    null;


  let closeTimer =
    null;


  let dispatchTimer =
    null;



  /* =======================================================
     RESET
     ======================================================= */

  function resetPigeon() {

    clearTimeout(
      dispatchTimer
    );


    pigeon.classList.remove(
      "is-dispatching",
      "is-delivered"
    );


    if (status) {

      status.textContent =
        "Sir Breadcrumb IV is standing by.";

    }


    if (manifestStatus) {

      manifestStatus.textContent =
        "READY FOR DISPATCH";

    }


    if (result) {

      result.hidden =
        true;

    }


    if (dispatchButton) {

      dispatchButton.disabled =
        false;


      dispatchButton.innerHTML =
        `
          DISPATCH PIGEON
          <span aria-hidden="true">→</span>
        `;

    }

  }



  /* =======================================================
     OPEN
     ======================================================= */

  function openPigeon() {

    lastFocusedElement =
      document.activeElement;


    clearTimeout(
      closeTimer
    );


    resetPigeon();


    pigeon.hidden =
      false;


    pigeon.setAttribute(
      "aria-hidden",
      "false"
    );


    openButton?.setAttribute(
      "aria-expanded",
      "true"
    );


    document.body.style.overflow =
      "hidden";


    requestAnimationFrame(
      () => {

        pigeon.classList.add(
          "is-open"
        );


        pigeon
          .querySelector(
            ".cv-pigeon-close"
          )
          ?.focus();

      }
    );

  }



  /* =======================================================
     CLOSE
     ======================================================= */

  function closePigeon() {

    clearTimeout(
      dispatchTimer
    );


    pigeon.classList.remove(
      "is-open"
    );


    pigeon.setAttribute(
      "aria-hidden",
      "true"
    );


    openButton?.setAttribute(
      "aria-expanded",
      "false"
    );


    document.body.style.overflow =
      "";


    clearTimeout(
      closeTimer
    );


    closeTimer =
      window.setTimeout(
        () => {

          pigeon.hidden =
            true;


          resetPigeon();

        },
        prefersReducedMotion
          ? 0
          : 280
      );


    if (
      lastFocusedElement instanceof
      HTMLElement
    ) {

      lastFocusedElement.focus();

    }

  }



  /* =======================================================
     DISPATCH
     ======================================================= */

  function dispatchPigeon() {

    if (
      pigeon.classList.contains(
        "is-dispatching"
      )
    ) {
      return;
    }


    clearTimeout(
      dispatchTimer
    );


    pigeon.classList.remove(
      "is-delivered"
    );


    pigeon.classList.add(
      "is-dispatching"
    );


    if (dispatchButton) {

      dispatchButton.disabled =
        true;


      dispatchButton.textContent =
        "PIGEON IN FLIGHT...";

    }


    if (manifestStatus) {

      manifestStatus.textContent =
        "IN TRANSIT";

    }


    if (status) {

      status.textContent =
        "Sir Breadcrumb IV has left the premises.";

    }


    if (result) {

      result.hidden =
        true;

    }


    dispatchTimer =
      window.setTimeout(
        () => {

          pigeon.classList.remove(
            "is-dispatching"
          );


          pigeon.classList.add(
            "is-delivered"
          );


          if (manifestStatus) {

            manifestStatus.textContent =
              "DISPATCHED";

          }


          if (status) {

            status.textContent =
              "Recruiter acquisition attempt initiated.";

          }


          if (dispatchButton) {

            dispatchButton.disabled =
              false;


            dispatchButton.innerHTML =
              `
                DISPATCH ANOTHER PIGEON
                <span aria-hidden="true">→</span>
              `;

          }


          if (result) {

            result.hidden =
              false;

          }

        },
        prefersReducedMotion
          ? 0
          : 2200
      );

  }



  /* =======================================================
     EVENTS
     ======================================================= */

  openButton?.addEventListener(
    "click",
    openPigeon
  );


  closeButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        closePigeon
      );

    }
  );


  dispatchButton?.addEventListener(
    "click",
    dispatchPigeon
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        !pigeon.hidden
      ) {

        closePigeon();

      }

    }
  );

})();