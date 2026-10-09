// Marco tipo ERP: la barra superior muestra el modulo y la seccion activos, y en
// celular el menu lateral se abre y cierra con el boton de tres rayas.
// Las pestanas siguen funcionando igual (functions.js); esto solo las acompana.
(function(){
  const body = document.body;
  const titulo = document.getElementById("pageTitle");
  const migas = document.getElementById("pageCrumb");
  const btnMenu = document.getElementById("btnNavToggle");
  const fondo = document.getElementById("sidebarScrim");
  const tituloBase = document.title;

  // Texto de la pestana sin los contadores (los badges tambien son texto).
  function textoPestana(tab){
    const copia = tab.cloneNode(true);
    copia.querySelectorAll("span").forEach(s => s.remove());
    return copia.textContent.trim();
  }

  function sincronizarTitulo(){
    const tab = document.querySelector(".side-nav .tab.active");
    if (!tab || !titulo) return;
    const seccion = textoPestana(tab);
    titulo.textContent = seccion;
    if (migas) migas.textContent = tab.closest(".nav-group")?.querySelector(".nav-group-title span")?.textContent.trim() || "";
    document.title = `${seccion} · ${tituloBase}`;
    // Si la seccion se abrio desde otro lado (un aviso, un boton), que se vea marcada en el
    // menu. Se desplaza solo el menu, no la pagina.
    const nav = tab.closest(".side-nav");
    if (nav) {
      const n = nav.getBoundingClientRect(), r = tab.getBoundingClientRect();
      if (r.top < n.top) nav.scrollTop -= n.top - r.top + 8;
      else if (r.bottom > n.bottom) nav.scrollTop += r.bottom - n.bottom + 8;
    }
  }

  function abrirMenu(abrir){
    body.classList.toggle("nav-abierto", abrir);
    if (btnMenu) btnMenu.setAttribute("aria-expanded", String(abrir));
  }

  // functions.js ya registro su clic (marca .active); este va despues. La pagina vuelve
  // arriba para que la seccion elegida se vea de una vez, aunque se viniera de bajar
  // en una tabla larga (quien abre la seccion por codigo y luego desplaza, lo hace despues).
  document.querySelectorAll(".side-nav .tab").forEach(tab => {
    tab.addEventListener("click", () => {
      sincronizarTitulo();
      abrirMenu(false);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
  });
  if (btnMenu) btnMenu.addEventListener("click", () => abrirMenu(!body.classList.contains("nav-abierto")));
  if (fondo) fondo.addEventListener("click", () => abrirMenu(false));
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && body.classList.contains("nav-abierto")) abrirMenu(false);
  });

  sincronizarTitulo();
})();
