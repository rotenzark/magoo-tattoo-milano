/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'magoo-tattoo-milano',
    /* niente WhatsApp finché non confermano: il cellulare (chiamata) e i messaggi su Instagram */
    whatsapp: {
      number: '',
      message: '',
      ids: [],
    },
    /* Google (29/9/2026): da lunedì a sabato 10:30–19:30, domenica chiuso (altre fonti ne danno altre versioni: da chiedere) */
    hours: {
      0: [],
      1: [['10:30', '19:30']],
      2: [['10:30', '19:30']],
      3: [['10:30', '19:30']],
      4: [['10:30', '19:30']],
      5: [['10:30', '19:30']],
      6: [['10:30', '19:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Magoo Tattoo: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.stili": "The work",
      "n.come": "How it works",
      "n.negozio": "The shop",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.instagram": "Message on Instagram",
      "t.scrivi": "Message",
      "t.indicazioni": "Directions",
      "h.sopra": "Tattoos and piercing · Via Giambellino 41/A",
      "h.titolo": "Artisan.",
      "h.testo": "That is how Andrea describes the work, after more than twenty-five years of tattooing: tribal and Polynesian, ornamental and geometric, lettering, freehand too; and piercing. The studio is under the “TATTOO” sign on Via Giambellino, with tram 14 stopping right outside the door.",
      "h.chi": "from a review on Facebook",
      "h.google": "on Google, 49 reviews",
      "h.facebook": "recommend it on Facebook",
      "f.titolo": "From stencil to black",
      "f.desc": "A sheet of practice skin: the stencil paper peels away and leaves the purple lines of a band; a tattoo machine drawn in wire, like the one hanging from their sign, goes over them in black, one line at a time.",
      "f.testa": "PRACTICE SKIN · TEST",
      "f.piede": "purple stencil · black line work",
      "f.n0": "TRIBAL",
      "f.n1": "ORNAMENTAL",
      "f.n2": "GEOMETRIC",
      "f.d0": "Tribal: solid borders, shark teeth, the wave and the points, like their Polynesian bands.",
      "f.d1": "Ornamental: scallops and rosettes, like their mandala bands.",
      "f.d2": "Geometric: crossing triangles that make diamonds.",
      "f.modi": "The band to go over",
      "f.b0": "Tribal",
      "f.b1": "Ornamental",
      "f.b2": "Geometric",
      "s.etichetta": "The work",
      "s.titolo": "The flash sheet",
      "s.sotto": "Their work by style, like the sheets hanging in tattoo studios. They posted it themselves, on Facebook; the bio says “Tribal, Ornamental & Geometrics, Lettering”.",
      "a.tribale": "A sleeve and chest in Polynesian style, all black: bands of triangles, waves, points and spirals.",
      "c.tribale": "Tribal and Polynesian",
      "c.tribaled": "sleeve and chest",
      "a.fasce": "Four Polynesian and Maori bands on the arm, in black.",
      "c.fasce": "Freehand",
      "c.fasced": "Polynesian and Maori bands",
      "a.mandala": "An ornamental mandala band on the forearm, with three solid black bands.",
      "c.mandala": "Ornamental",
      "c.mandalad": "the mandala band",
      "a.rossa": "The same mandala band in red, with the black bands.",
      "c.rossa": "In red",
      "c.rossad": "with the black bands",
      "a.lettering": "Black and red lettering among clouds, on the forearm.",
      "c.lettering": "Lettering",
      "c.letteringd": "black and red",
      "a.madonnina": "The golden Madonnina on a Gothic rose window, above the shield with the red cross of Milan and the laurel, on the shoulder.",
      "c.madonnina": "Milan on the skin",
      "c.madonninad": "the Madonnina",
      "a.kanji": "Two Japanese characters inside a brushed circle, on the shoulder.",
      "c.kanji": "Kanji",
      "c.kanjid": "inside an ensō",
      "a.duomo": "Milan Cathedral tattooed on the chest, with rays behind the spires.",
      "c.duomo": "The Duomo",
      "c.duomod": "on the chest",
      "a.pistoni": "Two crossed spanners behind a piston with a small skull, in black line work.",
      "c.pistoni": "Engines",
      "c.pistonid": "spanners and a piston, like their logo",
      "a.coverup": "A cover-up in three stages: the old light-blue tattoo, the drawing on top, the finished mask in colour.",
      "c.coverup": "Cover-up",
      "c.coverupd": "the old one under the new",
      "w.etichetta": "How it works",
      "w.titolo": "From the idea to black",
      "a.disegni": "On the table, a dragon and a carp coloured in pencil and some line sketches, with coloured pencils scattered around.",
      "w.1": "The idea",
      "w.1t": "It starts with a chat: an idea, a photo, a drawing. Andrea helps you choose and redraws it to measure; the reviews keep mentioning the advice.",
      "a.stencil": "Two hands peel the stencil paper off the skin: the purple drawing of a cross stays behind.",
      "w.2": "The stencil, or freehand",
      "w.2t": "The design goes onto the skin with the stencil: the paper peels away and the purple lines stay. Some tribal bands Andrea draws straight onto the skin, freehand.",
      "a.gesto": "Hands in black gloves with the machine, on a dreamcatcher in progress.",
      "w.3": "The line work, then the care",
      "w.3t": "Then the machine goes over the lines one at a time. At the end they explain how to look after it in the days that follow. And there is piercing too.",
      "v.etichetta": "The shop",
      "v.titolo": "Under the “TATTOO” sign",
      "v.sotto": "Orange letters on a light-blue panel, the wire tattoo machine hanging underneath; on the glass “Magoo Tattoo” in script and the flames; inside, the red walls. On Via Giambellino, in front of the tram 14 stop.",
      "a.facciata": "The shopfront: the TATTOO sign with orange letters on a light-blue panel, a wire tattoo machine hanging underneath, the window with Magoo Tattoo in script and the flames, the word PIERCING running down the door.",
      "c.facciata": "The sign and the window.",
      "a.vetrina": "The window: Magoo Tattoo in white script on the glass, the flames below, tattooed mannequin heads and tribal drawings inside.",
      "c.vetrina": "The script and the flames on the glass.",
      "a.interno": "Inside: red walls with painted flames, the mirror, the tattoo chair and the mannequin heads.",
      "c.interno": "Inside, the red walls.",
      "d.etichetta": "Reviews",
      "d.titolo": "A light hand, the right advice",
      "d.google": "on Google, 49 reviews",
      "d.g3m": "Google, 3 months ago",
      "d.g5m": "Google, 5 months ago",
      "d.g3a": "Google, 3 years ago",
      "d.g5a": "Google, 5 years ago",
      "d.g4a": "Google, 4 years ago",
      "d.g1a": "Google, a year ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […]. The line at the top comes from a review on Facebook.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Monday to Saturday",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.nota": "Better to call first: sometimes they are away at a convention (in 2026 Rotterdam, Herford, Amsterdam).",
      "o.mappa": "Map: Magoo Tattoo, Via Giambellino 41/A, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Giambellino 41/A, 20146 Milan",
      "o.tram": "By tram",
      "o.tramv": "The 14, Via Giambellino – Via Vignoli stop, right outside the shop",
      "o.metro": "By metro",
      "o.metrov": "M4 Tolstoj, about 400 metres away",
      "o.bus": "By bus",
      "o.busv": "The 58 and the 98, about 350 metres away",
      "o.tel": "Phone",
      "o.email": "Email",
      "o.social": "Social",
      "q.etichetta": "Questions",
      "q.titolo": "Before you come",
      "q.1": "How do I book?",
      "q.1r": "By phone or with a message on +39 338 181 5848, or on Instagram, @magootattoo_milano.",
      "q.2": "Can I bring my own design?",
      "q.2r": "Yes: you start from there and Andrea adapts it, or draws it from scratch, freehand too.",
      "q.3": "Do you do piercing too?",
      "q.3r": "Yes, piercing too: nose, earlobe and navel are the ones mentioned most in the reviews.",
      "q.4": "How much does a tattoo cost?",
      "q.4r": "It depends on the size and the detail: the price is agreed together, once the idea is clear.",
      "q.5": "Are you open on Sundays?",
      "q.5r": "No: Monday to Saturday, 10:30 am to 7:30 pm. Better to call first, sometimes they are away at a convention.",
      "q.6": "How do I get there?",
      "q.6r": "Via Giambellino 41/A: tram 14 stops right outside the shop (Via Giambellino – Via Vignoli); M4 Tolstoj is about 400 metres away; buses 58 and 98 run nearby too.",
      "f.orario": "Monday to Saturday 10:30 am–7:30 pm · closed on Sunday",
      "f.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the work is theirs, from their Facebook page; the photos of the shop from their Google listing; hours and reviews from Google (September 2026). We drew the band ourselves: the styles are theirs, the machine is the wire one from their sign.",
      "f.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ MAGOO TATTOO — «Artigiano.» ══════════
     La pagina è la loro facciata: il nero, l'arancio e l'azzurro dell'insegna «TATTOO», il corsivo e le fiamme della vetrina.
     la FIRMA — «dallo stencil al nero»: su un foglio di pelle sintetica la carta dello stencil si stacca e lascia le linee viola di
     una fascia; una macchinetta disegnata a fil di ferro, come quella appesa alla loro insegna, le ripassa in nero una alla volta.
     Tre fasce, i loro stili: Tribale, Ornamentale, Geometrico. Lo stato è D (la fascia), A (la carta: 0 sopra, 1 via), P (le linee
     finite), Q (quanto della linea in corso, 0…1: la punta sta lì, sulla linea spezzata), la punta (x, y) e V (l'opacità del nero
     mentre una fascia si svuota). Senza JS e alla fine: D = Tribale, A = 1, tutte le linee, la macchinetta a riposo (l'HTML).
     L'attesa (classe nell'head): niente nero, la carta sopra, cioè A = 0 e P = 0 nello stesso posto. Scegliere una fascia: il nero
     di prima svanisce (e la carta, se c'era ancora), la macchinetta ripassa la nuova. Reduced-motion: tutto subito. rAF a tempo,
     guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è (#244). */
  var DATI = {"vb":[560,440],"riposo":{"x":452,"y":396},"tempi":{"inizio":300,"stacca":650,"vola":260,"sposta":80,"mmPx":0.42,"minimo":120,"rientra":420,"svuota":260,"spostaV":55,"mmPxV":0.32,"minimoV":90,"volaV":200,"rientraV":360},"disegni":[{"nome":"Tribale","linee":[{"p":[[64,156],[496,156]],"cum":[0,432],"len":432,"dur":181,"durV":138},{"p":[[64,264],[496,264]],"cum":[0,432],"len":432,"dur":181,"durV":138},{"p":[[64,162],[76,184],[88,162],[100,184],[112,162],[124,184],[136,162],[148,184],[160,162],[172,184],[184,162],[196,184],[208,162],[220,184],[232,162],[244,184],[256,162],[268,184],[280,162],[292,184],[304,162],[316,184],[328,162],[340,184],[352,162],[364,184],[376,162],[388,184],[400,162],[412,184],[424,162],[436,184],[448,162],[460,184],[472,162],[484,184],[496,162]],"cum":[0,25.06,50.12,75.18,100.24,125.3,150.36,175.42,200.48,225.54,250.6,275.66,300.72,325.78,350.84,375.9,400.96,426.02,451.08,476.14,501.2,526.26,551.32,576.38,601.44,626.5,651.56,676.62,701.68,726.74,751.8,776.86,801.92,826.98,852.04,877.1,902.16],"len":902.16,"dur":379,"durV":289},{"p":[[64,258],[76,236],[88,258],[100,236],[112,258],[124,236],[136,258],[148,236],[160,258],[172,236],[184,258],[196,236],[208,258],[220,236],[232,258],[244,236],[256,258],[268,236],[280,258],[292,236],[304,258],[316,236],[328,258],[340,236],[352,258],[364,236],[376,258],[388,236],[400,258],[412,236],[424,258],[436,236],[448,258],[460,236],[472,258],[484,236],[496,258]],"cum":[0,25.06,50.12,75.18,100.24,125.3,150.36,175.42,200.48,225.54,250.6,275.66,300.72,325.78,350.84,375.9,400.96,426.02,451.08,476.14,501.2,526.26,551.32,576.38,601.44,626.5,651.56,676.62,701.68,726.74,751.8,776.86,801.92,826.98,852.04,877.1,902.16],"len":902.16,"dur":379,"durV":289},{"p":[[64,210],[68,214.4],[72,218.4],[76,221.3],[80,222.8],[84,222.8],[88,221.3],[92,218.4],[96,214.4],[100,210],[104,205.6],[108,201.6],[112,198.7],[116,197.2],[120,197.2],[124,198.7],[128,201.6],[132,205.6],[136,210],[140,214.4],[144,218.4],[148,221.3],[152,222.8],[156,222.8],[160,221.3],[164,218.4],[168,214.4],[172,210],[176,205.6],[180,201.6],[184,198.7],[188,197.2],[192,197.2],[196,198.7],[200,201.6],[204,205.6],[208,210],[212,214.4],[216,218.4],[220,221.3],[224,222.8],[228,222.8],[232,221.3],[236,218.4],[240,214.4],[244,210],[248,205.6],[252,201.6],[256,198.7],[260,197.2],[264,197.2],[268,198.7],[272,201.6],[276,205.6],[280,210],[284,214.4],[288,218.4],[292,221.3],[296,222.8],[300,222.8],[304,221.3],[308,218.4],[312,214.4],[316,210],[320,205.6],[324,201.6],[328,198.7],[332,197.2],[336,197.2],[340,198.7],[344,201.6],[348,205.6],[352,210],[356,214.4],[360,218.4],[364,221.3],[368,222.8],[372,222.8],[376,221.3],[380,218.4],[384,214.4],[388,210],[392,205.6],[396,201.6],[400,198.7],[404,197.2],[408,197.2],[412,198.7],[416,201.6],[420,205.6],[424,210],[428,214.4],[432,218.4],[436,221.3],[440,222.8],[444,222.8],[448,221.3],[452,218.4],[456,214.4],[460,210],[464,205.6],[468,201.6],[472,198.7],[476,197.2],[480,197.2],[484,198.7],[488,201.6],[492,205.6],[496,210]],"cum":[0,5.95,11.6,16.54,20.82,24.82,29.09,34.03,39.69,45.63,51.58,57.24,62.18,66.45,70.45,74.72,79.66,85.32,91.26,97.21,102.87,107.81,112.08,116.08,120.35,125.29,130.95,136.9,142.84,148.5,153.44,157.71,161.71,165.98,170.92,176.58,182.53,188.47,194.13,199.07,203.34,207.34,211.62,216.56,222.21,228.16,234.11,239.76,244.7,248.98,252.98,257.25,262.19,267.84,273.79,279.74,285.39,290.34,294.61,298.61,302.88,307.82,313.48,319.42,325.37,331.03,335.97,340.24,344.24,348.51,353.45,359.11,365.05,371,376.66,381.6,385.87,389.87,394.14,399.08,404.74,410.69,416.63,422.29,427.23,431.5,435.5,439.77,444.72,450.37,456.32,462.27,467.92,472.86,477.13,481.13,485.41,490.35,496,501.95,507.9,513.55,518.49,522.77,526.77,531.04,535.98,541.64,547.58],"len":547.58,"dur":230,"durV":175},{"p":[[118,201],[125,212],[118,223],[111,212],[118,201]],"cum":[0,13.04,26.08,39.12,52.15],"len":52.15,"dur":120,"durV":90},{"p":[[190,201],[197,212],[190,223],[183,212],[190,201]],"cum":[0,13.04,26.08,39.12,52.15],"len":52.15,"dur":120,"durV":90},{"p":[[262,201],[269,212],[262,223],[255,212],[262,201]],"cum":[0,13.04,26.08,39.12,52.15],"len":52.15,"dur":120,"durV":90},{"p":[[334,201],[341,212],[334,223],[327,212],[334,201]],"cum":[0,13.04,26.08,39.12,52.15],"len":52.15,"dur":120,"durV":90},{"p":[[406,201],[413,212],[406,223],[399,212],[406,201]],"cum":[0,13.04,26.08,39.12,52.15],"len":52.15,"dur":120,"durV":90},{"p":[[478,201],[485,212],[478,223],[471,212],[478,201]],"cum":[0,13.04,26.08,39.12,52.15],"len":52.15,"dur":120,"durV":90}]},{"nome":"Ornamentale","linee":[{"p":[[64,156],[496,156]],"cum":[0,432],"len":432,"dur":181,"durV":138},{"p":[[64,164],[496,164]],"cum":[0,432],"len":432,"dur":181,"durV":138},{"p":[[64,264],[496,264]],"cum":[0,432],"len":432,"dur":181,"durV":138},{"p":[[64,256],[496,256]],"cum":[0,432],"len":432,"dur":181,"durV":138},{"p":[[64,164],[64.6,167.7],[66.3,171.1],[68.9,173.7],[72.3,175.4],[76,176],[79.7,175.4],[83.1,173.7],[85.7,171.1],[87.4,167.7],[88,164],[88.6,167.7],[90.3,171.1],[92.9,173.7],[96.3,175.4],[100,176],[103.7,175.4],[107.1,173.7],[109.7,171.1],[111.4,167.7],[112,164],[112.6,167.7],[114.3,171.1],[116.9,173.7],[120.3,175.4],[124,176],[127.7,175.4],[131.1,173.7],[133.7,171.1],[135.4,167.7],[136,164],[136.6,167.7],[138.3,171.1],[140.9,173.7],[144.3,175.4],[148,176],[151.7,175.4],[155.1,173.7],[157.7,171.1],[159.4,167.7],[160,164],[160.6,167.7],[162.3,171.1],[164.9,173.7],[168.3,175.4],[172,176],[175.7,175.4],[179.1,173.7],[181.7,171.1],[183.4,167.7],[184,164],[184.6,167.7],[186.3,171.1],[188.9,173.7],[192.3,175.4],[196,176],[199.7,175.4],[203.1,173.7],[205.7,171.1],[207.4,167.7],[208,164],[208.6,167.7],[210.3,171.1],[212.9,173.7],[216.3,175.4],[220,176],[223.7,175.4],[227.1,173.7],[229.7,171.1],[231.4,167.7],[232,164],[232.6,167.7],[234.3,171.1],[236.9,173.7],[240.3,175.4],[244,176],[247.7,175.4],[251.1,173.7],[253.7,171.1],[255.4,167.7],[256,164],[256.6,167.7],[258.3,171.1],[260.9,173.7],[264.3,175.4],[268,176],[271.7,175.4],[275.1,173.7],[277.7,171.1],[279.4,167.7],[280,164],[280.6,167.7],[282.3,171.1],[284.9,173.7],[288.3,175.4],[292,176],[295.7,175.4],[299.1,173.7],[301.7,171.1],[303.4,167.7],[304,164],[304.6,167.7],[306.3,171.1],[308.9,173.7],[312.3,175.4],[316,176],[319.7,175.4],[323.1,173.7],[325.7,171.1],[327.4,167.7],[328,164],[328.6,167.7],[330.3,171.1],[332.9,173.7],[336.3,175.4],[340,176],[343.7,175.4],[347.1,173.7],[349.7,171.1],[351.4,167.7],[352,164],[352.6,167.7],[354.3,171.1],[356.9,173.7],[360.3,175.4],[364,176],[367.7,175.4],[371.1,173.7],[373.7,171.1],[375.4,167.7],[376,164],[376.6,167.7],[378.3,171.1],[380.9,173.7],[384.3,175.4],[388,176],[391.7,175.4],[395.1,173.7],[397.7,171.1],[399.4,167.7],[400,164],[400.6,167.7],[402.3,171.1],[404.9,173.7],[408.3,175.4],[412,176],[415.7,175.4],[419.1,173.7],[421.7,171.1],[423.4,167.7],[424,164],[424.6,167.7],[426.3,171.1],[428.9,173.7],[432.3,175.4],[436,176],[439.7,175.4],[443.1,173.7],[445.7,171.1],[447.4,167.7],[448,164],[448.6,167.7],[450.3,171.1],[452.9,173.7],[456.3,175.4],[460,176],[463.7,175.4],[467.1,173.7],[469.7,171.1],[471.4,167.7],[472,164],[472.6,167.7],[474.3,171.1],[476.9,173.7],[480.3,175.4],[484,176],[487.7,175.4],[491.1,173.7],[493.7,171.1],[495.4,167.7],[496,164]],"cum":[0,3.75,7.55,11.23,15.03,18.78,22.52,26.33,30,33.8,37.55,41.3,45.1,48.78,52.58,56.33,60.08,63.88,67.56,71.36,75.11,78.85,82.65,86.33,90.13,93.88,97.63,101.43,105.11,108.91,112.66,116.41,120.21,123.88,127.69,131.43,135.18,138.98,142.66,146.46,150.21,153.96,157.76,161.44,165.24,168.99,172.73,176.54,180.21,184.01,187.76,191.51,195.31,198.99,202.79,206.54,210.29,214.09,217.77,221.57,225.32,229.06,232.86,236.54,240.34,244.09,247.84,251.64,255.32,259.12,262.87,266.62,270.42,274.09,277.9,281.64,285.39,289.19,292.87,296.67,300.42,304.17,307.97,311.65,315.45,319.2,322.94,326.75,330.42,334.22,337.97,341.72,345.52,349.2,353,356.75,360.5,364.3,367.98,371.78,375.53,379.27,383.07,386.75,390.55,394.3,398.05,401.85,405.53,409.33,413.08,416.83,420.63,424.3,428.11,431.85,435.6,439.4,443.08,446.88,450.63,454.38,458.18,461.86,465.66,469.41,473.15,476.96,480.63,484.43,488.18,491.93,495.73,499.41,503.21,506.96,510.71,514.51,518.19,521.99,525.74,529.48,533.28,536.96,540.76,544.51,548.26,552.06,555.74,559.54,563.29,567.04,570.84,574.51,578.32,582.06,585.81,589.61,593.29,597.09,600.84,604.59,608.39,612.07,615.87,619.62,623.36,627.17,630.84,634.64,638.39,642.14,645.94,649.62,653.42,657.17,660.92,664.72,668.4,672.2,675.95],"len":675.95,"dur":284,"durV":216},{"p":[[64,256],[64.6,252.3],[66.3,248.9],[68.9,246.3],[72.3,244.6],[76,244],[79.7,244.6],[83.1,246.3],[85.7,248.9],[87.4,252.3],[88,256],[88.6,252.3],[90.3,248.9],[92.9,246.3],[96.3,244.6],[100,244],[103.7,244.6],[107.1,246.3],[109.7,248.9],[111.4,252.3],[112,256],[112.6,252.3],[114.3,248.9],[116.9,246.3],[120.3,244.6],[124,244],[127.7,244.6],[131.1,246.3],[133.7,248.9],[135.4,252.3],[136,256],[136.6,252.3],[138.3,248.9],[140.9,246.3],[144.3,244.6],[148,244],[151.7,244.6],[155.1,246.3],[157.7,248.9],[159.4,252.3],[160,256],[160.6,252.3],[162.3,248.9],[164.9,246.3],[168.3,244.6],[172,244],[175.7,244.6],[179.1,246.3],[181.7,248.9],[183.4,252.3],[184,256],[184.6,252.3],[186.3,248.9],[188.9,246.3],[192.3,244.6],[196,244],[199.7,244.6],[203.1,246.3],[205.7,248.9],[207.4,252.3],[208,256],[208.6,252.3],[210.3,248.9],[212.9,246.3],[216.3,244.6],[220,244],[223.7,244.6],[227.1,246.3],[229.7,248.9],[231.4,252.3],[232,256],[232.6,252.3],[234.3,248.9],[236.9,246.3],[240.3,244.6],[244,244],[247.7,244.6],[251.1,246.3],[253.7,248.9],[255.4,252.3],[256,256],[256.6,252.3],[258.3,248.9],[260.9,246.3],[264.3,244.6],[268,244],[271.7,244.6],[275.1,246.3],[277.7,248.9],[279.4,252.3],[280,256],[280.6,252.3],[282.3,248.9],[284.9,246.3],[288.3,244.6],[292,244],[295.7,244.6],[299.1,246.3],[301.7,248.9],[303.4,252.3],[304,256],[304.6,252.3],[306.3,248.9],[308.9,246.3],[312.3,244.6],[316,244],[319.7,244.6],[323.1,246.3],[325.7,248.9],[327.4,252.3],[328,256],[328.6,252.3],[330.3,248.9],[332.9,246.3],[336.3,244.6],[340,244],[343.7,244.6],[347.1,246.3],[349.7,248.9],[351.4,252.3],[352,256],[352.6,252.3],[354.3,248.9],[356.9,246.3],[360.3,244.6],[364,244],[367.7,244.6],[371.1,246.3],[373.7,248.9],[375.4,252.3],[376,256],[376.6,252.3],[378.3,248.9],[380.9,246.3],[384.3,244.6],[388,244],[391.7,244.6],[395.1,246.3],[397.7,248.9],[399.4,252.3],[400,256],[400.6,252.3],[402.3,248.9],[404.9,246.3],[408.3,244.6],[412,244],[415.7,244.6],[419.1,246.3],[421.7,248.9],[423.4,252.3],[424,256],[424.6,252.3],[426.3,248.9],[428.9,246.3],[432.3,244.6],[436,244],[439.7,244.6],[443.1,246.3],[445.7,248.9],[447.4,252.3],[448,256],[448.6,252.3],[450.3,248.9],[452.9,246.3],[456.3,244.6],[460,244],[463.7,244.6],[467.1,246.3],[469.7,248.9],[471.4,252.3],[472,256],[472.6,252.3],[474.3,248.9],[476.9,246.3],[480.3,244.6],[484,244],[487.7,244.6],[491.1,246.3],[493.7,248.9],[495.4,252.3],[496,256]],"cum":[0,3.75,7.55,11.23,15.03,18.78,22.52,26.33,30,33.8,37.55,41.3,45.1,48.78,52.58,56.33,60.08,63.88,67.56,71.36,75.11,78.85,82.65,86.33,90.13,93.88,97.63,101.43,105.11,108.91,112.66,116.41,120.21,123.88,127.69,131.43,135.18,138.98,142.66,146.46,150.21,153.96,157.76,161.44,165.24,168.99,172.73,176.54,180.21,184.01,187.76,191.51,195.31,198.99,202.79,206.54,210.29,214.09,217.77,221.57,225.32,229.06,232.86,236.54,240.34,244.09,247.84,251.64,255.32,259.12,262.87,266.62,270.42,274.09,277.9,281.64,285.39,289.19,292.87,296.67,300.42,304.17,307.97,311.65,315.45,319.2,322.94,326.75,330.42,334.22,337.97,341.72,345.52,349.2,353,356.75,360.5,364.3,367.98,371.78,375.53,379.27,383.07,386.75,390.55,394.3,398.05,401.85,405.53,409.33,413.08,416.83,420.63,424.3,428.11,431.85,435.6,439.4,443.08,446.88,450.63,454.38,458.18,461.86,465.66,469.41,473.15,476.96,480.63,484.43,488.18,491.93,495.73,499.41,503.21,506.96,510.71,514.51,518.19,521.99,525.74,529.48,533.28,536.96,540.76,544.51,548.26,552.06,555.74,559.54,563.29,567.04,570.84,574.51,578.32,582.06,585.81,589.61,593.29,597.09,600.84,604.59,608.39,612.07,615.87,619.62,623.36,627.17,630.84,634.64,638.39,642.14,645.94,649.62,653.42,657.17,660.92,664.72,668.4,672.2,675.95],"len":675.95,"dur":284,"durV":216},{"p":[[100,193],[103.8,193.4],[107.4,194.7],[110.6,196.7],[113.3,199.4],[115.3,202.6],[116.6,206.2],[117,210],[116.6,213.8],[115.3,217.4],[113.3,220.6],[110.6,223.3],[107.4,225.3],[103.8,226.6],[100,227],[96.2,226.6],[92.6,225.3],[89.4,223.3],[86.7,220.6],[84.7,217.4],[83.4,213.8],[83,210],[83.4,206.2],[84.7,202.6],[86.7,199.4],[89.4,196.7],[92.6,194.7],[96.2,193.4],[100,193]],"cum":[0,3.82,7.65,11.42,15.24,19.01,22.84,26.66,30.48,34.31,38.08,41.9,45.68,49.5,53.33,57.15,60.97,64.75,68.57,72.34,76.17,79.99,83.81,87.64,91.41,95.23,99,102.83,106.65],"len":106.65,"dur":120,"durV":90},{"p":[[172,193],[175.8,193.4],[179.4,194.7],[182.6,196.7],[185.3,199.4],[187.3,202.6],[188.6,206.2],[189,210],[188.6,213.8],[187.3,217.4],[185.3,220.6],[182.6,223.3],[179.4,225.3],[175.8,226.6],[172,227],[168.2,226.6],[164.6,225.3],[161.4,223.3],[158.7,220.6],[156.7,217.4],[155.4,213.8],[155,210],[155.4,206.2],[156.7,202.6],[158.7,199.4],[161.4,196.7],[164.6,194.7],[168.2,193.4],[172,193]],"cum":[0,3.82,7.65,11.42,15.24,19.01,22.84,26.66,30.48,34.31,38.08,41.9,45.68,49.5,53.33,57.15,60.97,64.75,68.57,72.34,76.17,79.99,83.81,87.64,91.41,95.23,99,102.83,106.65],"len":106.65,"dur":120,"durV":90},{"p":[[244,193],[247.8,193.4],[251.4,194.7],[254.6,196.7],[257.3,199.4],[259.3,202.6],[260.6,206.2],[261,210],[260.6,213.8],[259.3,217.4],[257.3,220.6],[254.6,223.3],[251.4,225.3],[247.8,226.6],[244,227],[240.2,226.6],[236.6,225.3],[233.4,223.3],[230.7,220.6],[228.7,217.4],[227.4,213.8],[227,210],[227.4,206.2],[228.7,202.6],[230.7,199.4],[233.4,196.7],[236.6,194.7],[240.2,193.4],[244,193]],"cum":[0,3.82,7.65,11.42,15.24,19.01,22.84,26.66,30.48,34.31,38.08,41.9,45.68,49.5,53.33,57.15,60.97,64.75,68.57,72.34,76.17,79.99,83.81,87.64,91.41,95.23,99,102.83,106.65],"len":106.65,"dur":120,"durV":90},{"p":[[316,193],[319.8,193.4],[323.4,194.7],[326.6,196.7],[329.3,199.4],[331.3,202.6],[332.6,206.2],[333,210],[332.6,213.8],[331.3,217.4],[329.3,220.6],[326.6,223.3],[323.4,225.3],[319.8,226.6],[316,227],[312.2,226.6],[308.6,225.3],[305.4,223.3],[302.7,220.6],[300.7,217.4],[299.4,213.8],[299,210],[299.4,206.2],[300.7,202.6],[302.7,199.4],[305.4,196.7],[308.6,194.7],[312.2,193.4],[316,193]],"cum":[0,3.82,7.65,11.42,15.24,19.01,22.84,26.66,30.48,34.31,38.08,41.9,45.68,49.5,53.33,57.15,60.97,64.75,68.57,72.34,76.17,79.99,83.81,87.64,91.41,95.23,99,102.83,106.65],"len":106.65,"dur":120,"durV":90},{"p":[[388,193],[391.8,193.4],[395.4,194.7],[398.6,196.7],[401.3,199.4],[403.3,202.6],[404.6,206.2],[405,210],[404.6,213.8],[403.3,217.4],[401.3,220.6],[398.6,223.3],[395.4,225.3],[391.8,226.6],[388,227],[384.2,226.6],[380.6,225.3],[377.4,223.3],[374.7,220.6],[372.7,217.4],[371.4,213.8],[371,210],[371.4,206.2],[372.7,202.6],[374.7,199.4],[377.4,196.7],[380.6,194.7],[384.2,193.4],[388,193]],"cum":[0,3.82,7.65,11.42,15.24,19.01,22.84,26.66,30.48,34.31,38.08,41.9,45.68,49.5,53.33,57.15,60.97,64.75,68.57,72.34,76.17,79.99,83.81,87.64,91.41,95.23,99,102.83,106.65],"len":106.65,"dur":120,"durV":90},{"p":[[460,193],[463.8,193.4],[467.4,194.7],[470.6,196.7],[473.3,199.4],[475.3,202.6],[476.6,206.2],[477,210],[476.6,213.8],[475.3,217.4],[473.3,220.6],[470.6,223.3],[467.4,225.3],[463.8,226.6],[460,227],[456.2,226.6],[452.6,225.3],[449.4,223.3],[446.7,220.6],[444.7,217.4],[443.4,213.8],[443,210],[443.4,206.2],[444.7,202.6],[446.7,199.4],[449.4,196.7],[452.6,194.7],[456.2,193.4],[460,193]],"cum":[0,3.82,7.65,11.42,15.24,19.01,22.84,26.66,30.48,34.31,38.08,41.9,45.68,49.5,53.33,57.15,60.97,64.75,68.57,72.34,76.17,79.99,83.81,87.64,91.41,95.23,99,102.83,106.65],"len":106.65,"dur":120,"durV":90}]},{"nome":"Geometrico","linee":[{"p":[[64,156],[496,156]],"cum":[0,432],"len":432,"dur":181,"durV":138},{"p":[[64,264],[496,264]],"cum":[0,432],"len":432,"dur":181,"durV":138},{"p":[[64,256],[100,164],[136,256],[172,164],[208,256],[244,164],[280,256],[316,164],[352,256],[388,164],[424,256],[460,164],[496,256]],"cum":[0,98.79,197.59,296.38,395.17,493.96,592.76,691.55,790.34,889.13,987.93,1086.72,1185.51],"len":1185.51,"dur":498,"durV":379},{"p":[[64,164],[100,256],[136,164],[172,256],[208,164],[244,256],[280,164],[316,256],[352,164],[388,256],[424,164],[460,256],[496,164]],"cum":[0,98.79,197.59,296.38,395.17,493.96,592.76,691.55,790.34,889.13,987.93,1086.72,1185.51],"len":1185.51,"dur":498,"durV":379},{"p":[[64,210],[496,210]],"cum":[0,432],"len":432,"dur":181,"durV":138}]}],"carta":{"tx":230,"ty":-120,"rot":14,"cx":516,"cy":132}};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('fascia'), svgF = prendi('fasciaSvg'), macchinaF = prendi('fasciaMacchina'), cartaF = prendi('fasciaCarta'), leggiF = prendi('fasciaLeggi');
  var BOTTONI = [].slice.call(document.querySelectorAll('.fascia__modi button[data-disegno]'));
  var INCHIOSTRI = [].slice.call(document.querySelectorAll('#fasciaSvg .inchiostro')).map(function (g) { return [].slice.call(g.querySelectorAll('path')); });
  var TF = DATI.tempi, RIP = DATI.riposo, DIS = DATI.disegni, CA = DATI.carta;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var DF = 0, AF = 1, PF = DIS[0].linee.length, QF = 0, XF = RIP.x, YF = RIP.y, VF = 1;
  var destinazioneF = { d: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  /* la punta sulla linea j della fascia d, alla frazione q della sua lunghezza */
  function puntoF(d, j, q) {
    var L = DIS[d].linee[j], s = c01(q) * L.len, i = 1;
    while (i < L.cum.length - 1 && L.cum[i] < s) i++;
    var a = L.cum[i - 1], b = L.cum[i], u = b > a ? (s - a) / (b - a) : 0;
    return [L.p[i - 1][0] + (L.p[i][0] - L.p[i - 1][0]) * u, L.p[i - 1][1] + (L.p[i][1] - L.p[i - 1][1]) * u];
  }
  function annunciaF(d) {
    var el = document.querySelector('.fascia__d[data-d="' + d + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  /* il disegno dello stato: allo stato finale nessun attributo in più di quelli dell'HTML */
  function disegnaF(d, a, p, q, x, y, v) {
    if (d !== DF || figuraF.getAttribute('data-disegno') !== String(d)) {
      DF = d;
      figuraF.setAttribute('data-disegno', String(d));
      BOTTONI.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-disegno') === d)); });
    }
    AF = a; PF = p; QF = q || 0; XF = x; YF = y; VF = v === undefined ? 1 : v;
    if (AF <= 0) { cartaF.removeAttribute('opacity'); cartaF.removeAttribute('transform'); }
    else if (AF >= 1) { cartaF.setAttribute('opacity', '0'); cartaF.removeAttribute('transform'); }
    else {
      cartaF.setAttribute('opacity', String(r3(1 - AF)));
      cartaF.setAttribute('transform', 'translate(' + r3(CA.tx * AF) + ' ' + r3(CA.ty * AF) + ') rotate(' + r3(CA.rot * AF) + ' ' + CA.cx + ' ' + CA.cy + ')');
    }
    INCHIOSTRI.forEach(function (linee, g) {
      linee.forEach(function (el, j) {
        if (g === d && j < p) {
          el.removeAttribute('stroke-dasharray'); el.removeAttribute('stroke-dashoffset');
          if (VF >= 1) el.removeAttribute('opacity'); else el.setAttribute('opacity', String(r3(VF)));
        } else if (g === d && j === p && QF > 0 && VF >= 1) {
          el.removeAttribute('opacity');
          el.setAttribute('stroke-dasharray', '1 1');
          el.setAttribute('stroke-dashoffset', String(r3(1 - QF)));
        } else {
          el.removeAttribute('stroke-dasharray'); el.removeAttribute('stroke-dashoffset');
          el.setAttribute('opacity', '0');
        }
      });
    });
    if (Math.abs(x - RIP.x) < 1e-9 && Math.abs(y - RIP.y) < 1e-9) macchinaF.setAttribute('transform', 'translate(' + RIP.x + ' ' + RIP.y + ')');
    else macchinaF.setAttribute('transform', 'translate(' + r3(x) + ' ' + r3(y) + ')');
  }
  /* un piano: tratti { da, a, tipo ('vola' | 'traccia' | 'stacca' | 'svuota'), d, a0, a1, p, j?, x0, y0, x1, y1, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var u = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](u);
    var aa = cur.a0 + (cur.a1 - cur.a0) * e;
    if (cur.tipo === 'svuota') { disegnaF(cur.d, aa, cur.p, 0, cur.x0, cur.y0, 1 - u); return; }
    if (cur.tipo === 'traccia') { var pt = puntoF(cur.d, cur.j, u); disegnaF(cur.d, aa, cur.p, u, pt[0], pt[1]); return; }
    disegnaF(cur.d, aa, cur.p, 0, cur.x0 + (cur.x1 - cur.x0) * e, cur.y0 + (cur.y1 - cur.y0) * e);
  }
  /* ripassare le linee della fascia d dalla linea «da» partendo da (x0, y0), poi tornare a riposo */
  function pianoTraccia(inizio, d, da, x0, y0, veloce) {
    var P = [], t = inizio, x = x0, y = y0, L = DIS[d].linee;
    var vola = veloce ? TF.volaV : TF.vola, sposta = veloce ? TF.spostaV : TF.sposta, rientra = veloce ? TF.rientraV : TF.rientra;
    for (var j = da; j < L.length; j++) {
      var p0 = L[j].p[0], dm = j === da ? vola : sposta, dt = veloce ? L[j].durV : L[j].dur;
      P.push({ da: t, a: t + dm, tipo: 'vola', d: d, a0: 1, a1: 1, p: j, x0: x, y0: y, x1: p0[0], y1: p0[1], curva: 'dolce' }); t += dm;
      P.push({ da: t, a: t + dt, tipo: 'traccia', d: d, a0: 1, a1: 1, p: j, j: j, x0: 0, y0: 0, x1: 0, y1: 0, curva: 'lineare' }); t += dt;
      var pn = L[j].p[L[j].p.length - 1]; x = pn[0]; y = pn[1];
    }
    P.push({ da: t, a: t + rientra, tipo: 'vola', d: d, a0: 1, a1: 1, p: L.length, x0: x, y0: y, x1: RIP.x, y1: RIP.y, curva: 'dolce' }); t += rientra;
    return { piano: P, fine: t };
  }
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    var d = destinazioneF.d;
    disegnaF(d, 1, DIS[d].linee.length, 0, RIP.x, RIP.y);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): la fascia si ferma dov'è (#244); dall'attesa lo stato è A = 0, P = 0 */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(0, 0, 0, 0, RIP.x, RIP.y); root.classList.remove('firma-attesa'); }
    else disegnaF(DF, AF, PF, QF, XF, YF, VF < 1 ? VF : undefined);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: A = 0, P = 0, la macchinetta a riposo */
    disegnaF(0, 0, 0, 0, RIP.x, RIP.y);
    destinazioneF = { d: 0 };
    var stacca = { da: TF.inizio, a: TF.inizio + TF.stacca, tipo: 'stacca', d: 0, a0: 0, a1: 1, p: 0, x0: RIP.x, y0: RIP.y, x1: RIP.x, y1: RIP.y, curva: 'dolce' };
    var resto = pianoTraccia(TF.inizio + TF.stacca, 0, 0, RIP.x, RIP.y, false);
    avviaF('intro', { piano: [{ da: 0, a: TF.inizio, tipo: 'vola', d: 0, a0: 0, a1: 0, p: 0, x0: RIP.x, y0: RIP.y, x1: RIP.x, y1: RIP.y, curva: 'lineare' }, stacca].concat(resto.piano), fine: resto.fine });
  }
  /* il gesto: scegliere una fascia. Se è quella che si sta già ripassando, niente; altrimenti la fascia si ferma dov'è, il nero
     svanisce (e la carta, se c'era ancora) e la macchinetta ripassa la fascia scelta (anche la stessa, a fascia finita: la rifà). */
  function sceltaF(d) {
    if (faseF === 'corre' && destinazioneF.d === d) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { d: d };
    annunciaF(d);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], dopo = 0;
    if (PF > 0 || QF > 0 || AF < 1) { P.push({ da: 0, a: TF.svuota, tipo: 'svuota', d: DF, a0: AF, a1: 1, p: PF, x0: XF, y0: YF, x1: XF, y1: YF, curva: 'lineare' }); dopo = TF.svuota; }
    var nuovo = pianoTraccia(dopo, d, 0, XF, YF, true);
    avviaF('rifai', { piano: P.concat(nuovo.piano), fine: nuovo.fine });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche accanto alla settimana */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la fascia è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && macchinaF && cartaF && BOTTONI.length === DIS.length && INCHIOSTRI.length === DIS.length) {
    try { clearTimeout(window.__attesaFascia); } catch (e) {}
    window.__fascia = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, d: DF, a: AF, p: PF, q: QF, x: XF, y: YF, v: VF, meta: destinazioneF.d };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__fascia.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la fascia sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora resta sotto la carta */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__fascia.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-disegno')); }); });
  }
})();
