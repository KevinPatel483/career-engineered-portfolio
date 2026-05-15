/* ══════════════════════════════════════════
   KEVIN PATEL PORTFOLIO — SCRIPT.JS
   ══════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

    /* ─────────────────────────────────────
       CARD STACK CAROUSEL
    ───────────────────────────────────── */
    const deck    = document.getElementById("stackDeck");
    const prevBtn = document.getElementById("stackPrev");
    const nextBtn = document.getElementById("stackNext");
    const dots    = document.querySelectorAll(".stack-dot");
    const cards   = deck ? Array.from(deck.querySelectorAll(".stack-card")) : [];
    const TOTAL   = cards.length;
    let current   = 0;
    let isAnimating = false;

    function layoutCards() {
        cards.forEach((card, i) => {
            const pos = ((i - current) % TOTAL + TOTAL) % TOTAL;
            card.dataset.pos = pos < 4 ? pos : 3;
        });
    }

    function updateDots() {
        dots.forEach((dot, i) => {
            const active = i === current;
            dot.classList.toggle("active", active);
            dot.setAttribute("aria-selected", String(active));
        });
    }

    function advance(direction) {
        if (isAnimating || !deck) return;
        isAnimating = true;
        const topCard  = cards[current];
        const flyClass = direction === "next" ? "fly-left" : "fly-right";
        topCard.classList.add(flyClass);
        setTimeout(() => {
            topCard.classList.remove(flyClass);
            current = direction === "next"
                ? (current + 1) % TOTAL
                : (current - 1 + TOTAL) % TOTAL;
            layoutCards();
            updateDots();
            isAnimating = false;
        }, 380);
    }

    function goTo(index) {
        if (isAnimating || index === current) return;
        isAnimating = true;
        current = index;
        layoutCards();
        updateDots();
        setTimeout(() => { isAnimating = false; }, 200);
    }

    if (deck && TOTAL > 0) {
        layoutCards();
        updateDots();

        if (nextBtn) nextBtn.addEventListener("click", () => advance("next"));
        if (prevBtn) prevBtn.addEventListener("click", () => advance("prev"));

        dots.forEach((dot) => {
            dot.addEventListener("click", () => goTo(parseInt(dot.dataset.dot, 10)));
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") advance("next");
            if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   advance("prev");
        });

        /* Drag / Swipe */
        let dragStartX = 0;
        let dragCurrentX = 0;
        let isDragging = false;
        const THRESHOLD = 80;

        function onDragStart(x) {
            if (isAnimating) return;
            isDragging  = true;
            dragStartX  = x;
            dragCurrentX = x;
            cards[current].classList.add("dragging");
        }
        function onDragMove(x) {
            if (!isDragging) return;
            dragCurrentX = x;
            const delta  = dragCurrentX - dragStartX;
            const top    = cards[current];
            top.style.transform = `translateX(${delta * 0.4}px) rotate(${delta * 0.06}deg) scale(${1 - Math.abs(delta) * 0.0003})`;
        }
        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            const delta = dragCurrentX - dragStartX;
            const top   = cards[current];
            top.classList.remove("dragging");
            top.style.transform = "";
            if      (delta < -THRESHOLD) advance("next");
            else if (delta >  THRESHOLD) advance("prev");
        }

        deck.addEventListener("mousedown",   (e) => onDragStart(e.clientX));
        window.addEventListener("mousemove", (e) => { if (isDragging) onDragMove(e.clientX); });
        window.addEventListener("mouseup",   ()  => onDragEnd());
        deck.addEventListener("touchstart",  (e) => onDragStart(e.touches[0].clientX), { passive: true });
        deck.addEventListener("touchmove",   (e) => onDragMove(e.touches[0].clientX),  { passive: true });
        deck.addEventListener("touchend",    ()  => onDragEnd());
    }


    /* ─────────────────────────────────────
       RESUME MODAL
    ───────────────────────────────────── */
    const resumeBtn  = document.getElementById("resumeBtn");
    const modal      = document.getElementById("resumeModal");
    const modalClose = document.getElementById("modalClose");

    const openModal  = () => { if (!modal) return; modal.hidden = false; document.body.style.overflow = "hidden"; modalClose && modalClose.focus(); };
    const closeModal = () => { if (!modal) return; modal.hidden = true;  document.body.style.overflow = "";       resumeBtn  && resumeBtn.focus();  };

    if (resumeBtn)   resumeBtn.addEventListener("click", openModal);
    if (modalClose)  modalClose.addEventListener("click", closeModal);
    if (modal)       modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal && !modal.hidden) closeModal(); });


    /* ─────────────────────────────────────
       MOBILE MENU
    ───────────────────────────────────── */
    const hamburger  = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuClose  = document.getElementById("menuClose");

    const openMenu  = () => { if (!mobileMenu) return; mobileMenu.classList.add("open");    hamburger && hamburger.setAttribute("aria-expanded", "true");  document.body.style.overflow = "hidden"; };
    const closeMenu = () => { if (!mobileMenu) return; mobileMenu.classList.remove("open"); hamburger && hamburger.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";       };

    if (hamburger) hamburger.addEventListener("click", openMenu);
    if (menuClose) menuClose.addEventListener("click", closeMenu);
    mobileMenu && mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));


    /* ─────────────────────────────────────
       SCROLL REVEAL
    ───────────────────────────────────── */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const delay = parseFloat(entry.target.style.getPropertyValue("--i") || 0);
                setTimeout(() => entry.target.classList.add("visible"), delay * 80);
                revealObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));


    /* ─────────────────────────────────────
       COUNTER ANIMATION
    ───────────────────────────────────── */
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const target = parseInt(el.getAttribute("data-target"), 10);
                const start  = performance.now();
                const dur    = 1200;
                (function tick(now) {
                    const p = Math.min((now - start) / dur, 1);
                    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
                    if (p < 1) requestAnimationFrame(tick);
                })(start);
                counterObserver.unobserve(el);
            });
        },
        { threshold: 0.5 }
    );
    document.querySelectorAll(".stat-num[data-target]").forEach((el) => counterObserver.observe(el));


    /* ─────────────────────────────────────
       ACTIVE NAV HIGHLIGHT
    ───────────────────────────────────── */
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    const hit = link.getAttribute("href") === `#${id}`;
                    link.style.borderColor = hit ? "var(--ink)"     : "";
                    link.style.background  = hit ? "var(--paper-2)" : "";
                });
            });
        },
        { threshold: 0.35 }
    );
    document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));


    /* ─────────────────────────────────────
       SMOOTH ANCHOR SCROLL
    ───────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const id     = anchor.getAttribute("href").slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            const offset = (document.querySelector(".nav")?.offsetHeight || 64) + 8;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
        });
    });

});