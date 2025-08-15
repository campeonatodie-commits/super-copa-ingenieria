/* Override loadJSON to support championship selection and fallback */
(async function() {
  window.loadJSON = async function(path) {
    const file = path.split('/').pop();
    const segments = window.location.pathname.split('/');
    const base = segments.length > 2 ? '/' + segments[1] : '';
    const params = new URLSearchParams(window.location.search);
    let champSlug = params.get('champ') || params.get('c') || localStorage.getItem('champ') || 'campeonato-die';
    // store champion slug if provided in query
    if (params.get('champ') || params.get('c')) {
      localStorage.setItem('champ', champSlug);
    }
    const champPath = `${base}/data/${champSlug}/${file}`;
    try {
      const res = await fetch(champPath);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // ignore error and fallback
    }
    const fallbackPath = `${base}/data/${file}`;
    const res2 = await fetch(fallbackPath);
    return await res2.json();
  };
})();
