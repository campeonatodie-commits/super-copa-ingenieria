/* Minimal JS: carga datos y renderiza agenda, resultados, goleadores y tabla */
const pathSegments = window.location.pathname.split('/');
const BASE_PATH = pathSegments.length > 2 ? '/' + pathSegments[1] : '';
const urlParams = new URLSearchParams(window.location.search);
const champParam = urlParams.get('champ') || urlParams.get('c');
if (champParam) localStorage.setItem('champ', champParam);
const CHAMP = localStorage.getItem('champ') || 'campeonato-die';


const YEAR_ELs = document.querySelectorAll('#year');
YEAR_ELs.forEach(el => el.textContent = new Date().getFullYear());

asyasync function loadJSON(path) {
  const file = path.split('/').pop();
  const champPath = `${BASE_PATH}/data/${CHAMP}/${file}`;
  try {
    let res = await fetch(champPath);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // ignore and fallback
  }
  async function loadJSON(path) {
  const file = path.split('/').pop();
  const champPath = `${BASE_PATH}/data/${CHAMP}/${file}`;
  try {
    let res = await fetch(champPath);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // ignore and fallback
  }
  const fallbackPath = `${BASE_PATH}/data/${file}`;
  const res2 = await fetch(fallbackPath);
  return await res2.json();
}




function computeStandings(teams, matches){
  // Tabla clásica 3/1/0
  const idx = Object.fromEntries(teams.map(t => [t.id, { team: t, PJ:0,G:0,E:0,P:0,GF:0,GC:0,PTS:0 }]));
  for(const m of matches){
    if(m.status !== 'FINISHED') continue;
    const h = idx[m.home_team_id], a = idx[m.away_team_id];
    h.PJ++; a.PJ++; h.GF+=m.home_goals; h.GC+=m.away_goals; a.GF+=m.away_goals; a.GC+=m.home_goals;
    if(m.home_goals > m.away_goals){ h.G++; a.P++; h.PTS+=3; }
    else if(m.home_goals < m.away_goals){ a.G++; h.P++; a.PTS+=3; }
    else { h.E++; a.E++; h.PTS++; a.PTS++; }
  }
  const rows = Object.values(idx).map(r => ({...r, DG: r.GF - r.GC}));
  rows.sort((x,y)=> y.PTS - x.PTS || y.DG - x.DG || y.GF - x.GF || x.team.name.localeCompare(y.team.name));
  return rows;
}

function computeScorers(players, events){
  const goalsByPlayer = new Map();
  for(const e of events){
    if(e.type !== 'goal') continue;
    goalsByPlayer.set(e.player_id, (goalsByPlayer.get(e.player_id)||0)+1);
  }
  const arr = players.map(p => ({...p, goals: goalsByPlayer.get(p.id)||0})).filter(p=>p.goals>0);
  arr.sort((a,b)=> b.goals - a.goals || a.name.localeCompare(b.name));
  return arr.slice(0, 15);
}

async function main(){
  const [teams, players, matches, events, photos] = await Promise.all([
    loadJSON('/data/teams.json'),
    loadJSON('/data/players.json'),
    loadJSON('/data/matches.json'),
    loadJSON('/data/events.json'),
    loadJSON('/data/photos.json'),
  ]);

  // Próximos
  const proximosEl = document.querySelector('#proximos');
  if(proximosEl){
    const upcoming = matches.filter(m=>m.status==='SCHEDULED').sort((a,b)=> new Date(a.date)-new Date(b.date)).slice(0,8);
    proximosEl.innerHTML = upcoming.map(m => {
      const h = teams.find(t=>t.id===m.home_team_id)?.name || 'Local';
      const a = teams.find(t=>t.id===m.away_team_id)?.name || 'Visita';
      const d = new Date(m.date).toLocaleString();
      return `<article class="card"><h3>${h} vs ${a}</h3><p>${d}</p><p>${m.venue||''}</p></article>`;
    }).join('') || '<p>No hay partidos programados.</p>';
  }

  // Resultados
  const resultadosEl = document.querySelector('#resultados');
  if(resultadosEl){
    const finished = matches.filter(m=>m.status==='FINISHED').sort((a,b)=> new Date(b.date)-new Date(a.date)).slice(0,8);
    resultadosEl.innerHTML = finished.map(m => {
      const h = teams.find(t=>t.id===m.home_team_id)?.name || 'Local';
      const a = teams.find(t=>t.id===m.away_team_id)?.name || 'Visita';
      const d = new Date(m.date).toLocaleDateString();
      return `<article class="card"><h3>${h} ${m.home_goals} - ${m.away_goals} ${a}</h3><p>${d}</p></article>`;
    }).join('') || '<p>Aún no hay resultados.</p>';
  }

  // Goleadores
  const goleadoresEl = document.querySelector('#goleadores');
  if(goleadoresEl){
    const scorers = computeScorers(players, events);
    goleadoresEl.innerHTML = scorers.map(p => `<li>${p.name} (${p.goals}) - ${teams.find(t=>t.id===p.team_id)?.name||''}</li>`).join('') || '<li>Sin goles aún.</li>';
  }

  // Tabla
  const tablaBody = document.querySelector('#tabla tbody');
  if(tablaBody){
    const standings = computeStandings(teams, matches);
    tablaBody.innerHTML = standings.map((r,i)=>`
      <tr>
        <td>${i+1}</td>
        <td style="text-align:left">${r.team.name}</td>
        <td>${r.PJ}</td><td>${r.G}</td><td>${r.E}</td><td>${r.P}</td>
        <td>${r.GF}</td><td>${r.GC}</td><td>${r.DG}</td><td>${r.PTS}</td>
      </tr>`).join('');
  }

  // Fotos
  const galeria = document.querySelector('#galeria');
  if(galeria){
    galeria.innerHTML = photos.map(ph => `<figure><img src="${ph.src}" alt="${ph.alt||''}"><figcaption>${ph.caption||''}</figcaption></figure>`).join('') || '<p>Sin fotos aún.</p>';
  }
}
main().catch(console.error);
