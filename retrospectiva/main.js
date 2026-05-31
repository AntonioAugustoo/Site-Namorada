/* ============================================
   NOSSA JORNADA — main.js
   Sistema de áudio com fade + Intersection Observer
   ============================================ */

// ── Estado global ──────────────────────────────────────────
const state = {
  telaAtual: 0,
  somAtivo: true,
  audioAtual: null,
  fadingOut: false,
  desbloqueado: false,   // iOS exige interação antes de tocar áudio
};

const FADE_DURATION = 1200; // ms para fade entre músicas
const VOLUME_MAX    = 0.75;

// ── Elementos do DOM ──────────────────────────────────────
const player      = document.getElementById('player');
const btnSom      = document.getElementById('btn-som');
const iconOn      = document.getElementById('icon-som-on');
const iconOff     = document.getElementById('icon-som-off');
const dotsWrapper = document.getElementById('progress-dots');
const telas       = document.querySelectorAll('.tela');

// ── Gera os progress dots ──────────────────────────────────
function criarDots() {
  telas.forEach((tela, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Ir para tela ${i + 1}`);
    dot.addEventListener('click', () => {
      tela.scrollIntoView({ behavior: 'smooth' });
    });
    dotsWrapper.appendChild(dot);
  });
}

function atualizarDots(index) {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('ativo', i === index);
  });
}

// ── Sistema de áudio ──────────────────────────────────────

/**
 * Faz fade de volume: de `de` até `ate` em `duracao` ms
 * Retorna uma Promise que resolve ao terminar
 */
function fadeVolume(audioEl, de, ate, duracao) {
  return new Promise(resolve => {
    const passos   = 40;
    const intervalo = duracao / passos;
    const delta    = (ate - de) / passos;
    let passo      = 0;

    audioEl.volume = de;

    const timer = setInterval(() => {
      passo++;
      audioEl.volume = Math.min(1, Math.max(0, de + delta * passo));

      if (passo >= passos) {
        clearInterval(timer);
        audioEl.volume = ate;
        resolve();
      }
    }, intervalo);
  });
}

/**
 * Troca a música atual para `src`, com cross-fade suave
 */
async function trocarMusica(src) {
  if (!src) {
    console.warn('trocarMusica: src vazio');
    return;
  }
  if (!state.desbloqueado) {
    console.log('trocarMusica: áudio ainda não desbloqueado');
    return;
  }
  if (src === state.audioAtual) {
    console.log('trocarMusica: música já está tocando');
    return;
  }

  console.log('🎵 Carregando áudio:', src);
  state.audioAtual = src;

  // Fade out do player atual
  if (!player.paused) {
    await fadeVolume(player, player.volume, 0, FADE_DURATION / 2);
    player.pause();
  }

  if (!state.somAtivo) {
    console.log('Som desativado');
    return;
  }

  // Carrega nova música
  player.src = src;
  player.volume = 0;

  try {
    console.log('▶️ Iniciando reprodução de:', src);
    await player.play();
    await fadeVolume(player, 0, VOLUME_MAX, FADE_DURATION);
    console.log('✅ Áudio tocando com sucesso');
  } catch (err) {
    // Autoplay bloqueado (iOS/Safari) — aguarda interação
    console.warn('❌ Autoplay bloqueado:', err.message);
  }
}

/**
 * Desbloqueia o contexto de áudio na primeira interação do usuário
 * (necessário em iOS e alguns browsers)
 */
function desbloquearAudio() {
  if (state.desbloqueado) return;
  
  console.log('🔓 Desbloqueando contexto de áudio...');
  state.desbloqueado = true;

  // Cria um áudio silencioso para desbloquear o contexto
  const dummyAudio = new Audio();
  dummyAudio.src = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';
  dummyAudio.play().catch(err => console.log('ℹ️ Dummy audio:', err.message));

  // Toca o áudio da tela atual
  const telaAtiva = telas[state.telaAtual];
  if (telaAtiva) {
    const src = telaAtiva.dataset.audio;
    console.log('🎵 Tela ativa:', telaAtiva.id, '| Áudio:', src);
    if (src && state.somAtivo) trocarMusica(src);
  }

  // Remove listeners após desbloquear
  document.removeEventListener('click',      desbloquearAudio);
  document.removeEventListener('touchstart', desbloquearAudio);
  
  console.log('✅ Contexto de áudio desbloqueado!');
}

// ── Botão de som ──────────────────────────────────────────
btnSom.addEventListener('click', () => {
  state.somAtivo = !state.somAtivo;
  desbloquearAudio();

  if (state.somAtivo) {
    iconOn.style.display  = '';
    iconOff.style.display = 'none';
    trocarMusica(telas[state.telaAtual]?.dataset?.audio);
  } else {
    iconOn.style.display  = 'none';
    iconOff.style.display = '';
    fadeVolume(player, player.volume, 0, 400).then(() => player.pause());
  }
});

// ── Intersection Observer ─────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const index = Array.from(telas).indexOf(entry.target);
    state.telaAtual = index;
    
    console.log(`👁️ Tela visível: #${entry.target.id} (índice ${index})`);

    // Ativa animações CSS da tela visível
    telas.forEach((t, i) => t.classList.toggle('ativa', i === index));

    // Atualiza dots
    atualizarDots(index);

    // Troca música
    const src = entry.target.dataset.audio;
    console.log('🔊 Tentando trocar para:', src, '| Som ativo:', state.somAtivo);
    if (state.somAtivo) trocarMusica(src);
  });
}, {
  threshold: 0.55,   // 55% da tela visível para disparar
});

// ── Init ──────────────────────────────────────────────────
function init() {
  console.log('📱 Inicializando aplicação...');
  console.log('📊 Total de telas encontradas:', telas.length);
  telas.forEach((t, i) => console.log(`  Tela ${i + 1}: #${t.id}, áudio: ${t.dataset.audio}`));
  
  criarDots();

  telas.forEach(tela => observer.observe(tela));

  // Primeira tela já começa ativa
  telas[0]?.classList.add('ativa');
  atualizarDots(0);

  // Botões "Avançar" — scrollam para a próxima tela
  document.querySelectorAll('.btn-avancar').forEach(btn => {
    btn.addEventListener('click', () => {
      const proximaTela = telas[state.telaAtual + 1];
      if (proximaTela) proximaTela.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Botão "Iniciar" da capa também avança
  document.getElementById('btn-iniciar')?.addEventListener('click', () => {
    desbloquearAudio();
    const proximaTela = telas[1];
    if (proximaTela) proximaTela.scrollIntoView({ behavior: 'smooth' });
  });

  // Desbloqueia áudio na PRIMEIRA interação (qualquer clique)
  const desbloqueoPrimeiro = () => {
    console.log('🖱️ Primeiro clique detectado!');
    desbloquearAudio();
    document.removeEventListener('click', desbloqueoPrimeiro);
    document.removeEventListener('touchstart', desbloqueoPrimeiro);
  };
  
  document.addEventListener('click',      desbloqueoPrimeiro, { once: true });
  document.addEventListener('touchstart', desbloqueoPrimeiro, { once: true });
  
  // Listener adicional para botão de som
  document.addEventListener('click',      desbloquearAudio, { once: false });
  document.addEventListener('touchstart', desbloquearAudio, { once: false });

  // Bloqueia scroll da tela 1 — só permite com botão "Começar"
  document.addEventListener('wheel', (e) => {
    if (state.telaAtual === 0) {
      e.preventDefault();
      console.log('🚫 Scroll bloqueado na Tela 1 — clique em "Começar"');
    }
  }, { passive: false });

  // Bloqueia touch scroll na tela 1
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (state.telaAtual === 0) {
      const touchEndY = e.touches[0].clientY;
      if (touchEndY < touchStartY) { // scroll para cima
        e.preventDefault();
        console.log('🚫 Scroll bloqueado na Tela 1 (touch)');
      }
    }
  }, { passive: false });
}

document.addEventListener('DOMContentLoaded', init);

// ── Tela 2: Cards → popup ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Abre popup ao clicar no card
  document.querySelectorAll('.elogio-card[data-popup]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.popup;
      const popup = document.getElementById(id);
      if (popup) popup.classList.add('visivel');
    });
  });

  // Abre popup ao clicar no card de playlist
  document.querySelectorAll('.playlist-card[data-popup]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.popup;
      const popup = document.getElementById(id);
      if (popup) popup.classList.add('visivel');
    });
  });
  // Abre popup ao clicar no card de playlist
  document.querySelectorAll('.playlist-card[data-popup]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.popup;
      const popup = document.getElementById(id);
      if (popup) popup.classList.add('visivel');
    });
  });
  // Fecha popup ao clicar no overlay ou no botão ✕
  document.querySelectorAll('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('[data-close]')) {
        overlay.classList.remove('visivel');
      }
    });
  });

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.popup-overlay.visivel')
        .forEach(p => p.classList.remove('visivel'));
    }
  });

  // ── Canvas de partículas (Tela 2) ──────────────────────
  const canvas = document.getElementById('elogios-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Cria partículas
  const TOTAL = 55;
  const particulas = Array.from({ length: TOTAL }, () => ({
    x:    Math.random(),
    y:    Math.random(),
    r:    Math.random() * 2.2 + 0.5,
    vx:   (Math.random() - 0.5) * 0.00015,
    vy:   (Math.random() - 0.5) * 0.00015,
    alfa: Math.random(),
    dAlfa:(Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    cor:  ['#d4a0ff','#f59e0b','#60a5fa','#f472b6'][Math.floor(Math.random()*4)],
  }));

  function desenhar() {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);

    particulas.forEach(p => {
      // Move
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;

      // Pulsa
      p.alfa += p.dAlfa;
      if (p.alfa > 1 || p.alfa < 0) p.dAlfa *= -1;

      // Desenha
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.cor;
      ctx.globalAlpha = p.alfa * 0.6;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(desenhar);
  }
  desenhar();
});

// ── Tela 3: Canvas de estrelas ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('estrelas-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Gera estrelas em dois tamanhos
  const TOTAL = 220;
  const estrelas = Array.from({ length: TOTAL }, () => ({
    x:    Math.random(),
    y:    Math.random(),
    r:    Math.random() * 1.4 + 0.2,
    alfa: Math.random() * 0.7 + 0.15,
    vel:  Math.random() * 0.003 + 0.001,   // velocidade de piscar
    fase: Math.random() * Math.PI * 2,      // fase inicial diferente por estrela
  }));

  let t = 0;
  function desenharEstrelas() {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    t += 0.016;

    estrelas.forEach(s => {
      const pulso = s.alfa * (0.5 + 0.5 * Math.sin(t * s.vel * 60 + s.fase));
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = pulso;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(desenharEstrelas);
  }
  desenharEstrelas();
});

// ── Tela 4: Slider horizontal de momentos ────────────────
document.addEventListener('DOMContentLoaded', () => {
  const track      = document.getElementById('momentos-track');
  const btnPrev    = document.getElementById('momento-prev');
  const btnNext    = document.getElementById('momento-next');
  const dots       = document.querySelectorAll('.momento-dot');
  const slides     = document.querySelectorAll('.momento-slide');
  const TOTAL      = slides.length;
  let   atual      = 0;

  function irPara(index) {
    atual = Math.max(0, Math.min(index, TOTAL - 1));
    track.style.transform = `translateX(-${atual * 100}vw)`;

    // Atualiza dots
    dots.forEach((d, i) => d.classList.toggle('ativo', i === atual));

    // Desabilita setas nas extremidades
    btnPrev.disabled = atual === 0;
    btnNext.disabled = atual === TOTAL - 1;
  }

  btnPrev.addEventListener('click', () => irPara(atual - 1));
  btnNext.addEventListener('click', () => irPara(atual + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => irPara(i)));

  // Swipe touch (mobile)
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) irPara(diff > 0 ? atual + 1 : atual - 1);
  });

  // Estado inicial
  irPara(0);
});

// ── Tela 5: Playlists ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Popups de playlist
  document.querySelectorAll('.playlist-card[data-popup]').forEach(card => {
    card.addEventListener('click', () => {
      const popup = document.getElementById(card.dataset.popup);
      if (popup) popup.classList.add('visivel');
    });
  });

  // Fechar popups playlist (overlay, ✕ e "Ver mais tarde")
  document.querySelectorAll('#popup-playlist-1, #popup-playlist-2, #popup-playlist-3').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.closest('[data-close]')) {
        overlay.classList.remove('visivel');
      }
    });
  });

  // Visualizador de barras decorativo
  const vizBars = document.getElementById('viz-bars');
  if (vizBars) {
    const BARRAS = 80;
    for (let i = 0; i < BARRAS; i++) {
      const bar = document.createElement('div');
      bar.className = 'viz-bar';
      const h = Math.random() * 70 + 20;
      const dur = (Math.random() * 0.8 + 0.5).toFixed(2);
      bar.style.setProperty('--h', h + '%');
      bar.style.setProperty('--dur', dur + 's');
      bar.style.animationDelay = (Math.random() * 1).toFixed(2) + 's';
      vizBars.appendChild(bar);
    }
  }

  // Canvas de ondas suaves no fundo da Tela 5
  const canvas = document.getElementById('playlist-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function desenharOndas() {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    t += 0.008;

    const ondas = [
      { amp: 28, freq: 0.008, speed: 0.6, y: h * 0.35, cor: 'rgba(168,224,99,0.06)' },
      { amp: 20, freq: 0.012, speed: 0.9, y: h * 0.55, cor: 'rgba(168,224,99,0.04)' },
      { amp: 35, freq: 0.006, speed: 0.4, y: h * 0.75, cor: 'rgba(168,224,99,0.05)' },
    ];

    ondas.forEach(o => {
      ctx.beginPath();
      ctx.moveTo(0, o.y);
      for (let x = 0; x <= w; x += 4) {
        const y = o.y + Math.sin(x * o.freq + t * o.speed) * o.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = o.cor;
      ctx.fill();
    });

    requestAnimationFrame(desenharOndas);
  }
  desenharOndas();
});

// ── Tela 6: Grand Finale — Vales + Confetti ───────────────
document.addEventListener('DOMContentLoaded', () => {

  const valeConfig = {
    jantar:   { icon: '🍽️', titulo: 'Vale Jantar Resgatado!',   codigo: 'VALE-JANTAR-2027',   texto: 'Escolha o restaurante, eu pago. Expira: nunca.' },
    filmes:   { icon: '🎬', titulo: 'Vale Filmes Resgatado!',    codigo: 'VALE-FILMES-2027',    texto: 'Você escolhe o filme, eu faço a pipoca. Zero reclamações garantidas por contrato.' },
    massagem: { icon: '✨', titulo: 'Vale Massagem Resgatado!',  codigo: 'VALE-MASSAGEM-2027',  texto: '30 minutos de relaxamento completo. Quando quiser, é só pedir.' },
  };

  const popupVale   = document.getElementById('popup-vale');
  const valeIcon    = document.getElementById('vale-modal-icon');
  const valeTitulo  = document.getElementById('vale-modal-titulo');
  const valeTexto   = document.getElementById('vale-modal-texto');
  const valeCodigo  = document.getElementById('vale-modal-codigo');
  const confettiEl  = document.getElementById('vale-confetti');

  function lancarConfetti() {
    if (!confettiEl) return;
    confettiEl.innerHTML = '';
    const cores = ['#ffd700','#ff6b6b','#7c3aed','#06b6d4','#a8e063','#f472b6'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left     = Math.random() * 100 + '%';
      p.style.background = cores[Math.floor(Math.random() * cores.length)];
      p.style.setProperty('--dur',   (Math.random() * 1.5 + 1.2) + 's');
      p.style.setProperty('--delay', (Math.random() * 0.5) + 's');
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      confettiEl.appendChild(p);
    }
  }

  // Abre modal ao clicar em "RESGATAR CUPOM"
  document.querySelectorAll('.vale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.vale;
      const cfg  = valeConfig[tipo];
      if (!cfg || !popupVale) return;

      valeIcon.textContent   = cfg.icon;
      valeTitulo.textContent = cfg.titulo;
      valeTexto.textContent  = cfg.texto;
      valeCodigo.textContent = cfg.codigo;

      popupVale.classList.add('visivel');
      setTimeout(lancarConfetti, 200);
    });
  });

  // Fecha modal do vale
  document.querySelectorAll('[data-close-vale]').forEach(el => {
    el.addEventListener('click', () => popupVale?.classList.remove('visivel'));
  });

  popupVale?.addEventListener('click', e => {
    if (e.target === popupVale) popupVale.classList.remove('visivel');
  });

  // Botão "Recomeçar" — volta para o topo
  document.querySelectorAll('.btn-avancar').forEach(btn => {
    if (btn.textContent.includes('Recomeçar')) {
      btn.addEventListener('click', () => {
        document.getElementById('tela-1')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });

  // Canvas de estrelas douradas — Tela 6
  const canvas = document.getElementById('finale-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const TOTAL = 180;
  const estrelas = Array.from({ length: TOTAL }, () => ({
    x:    Math.random(),
    y:    Math.random(),
    r:    Math.random() * 1.5 + 0.3,
    alfa: Math.random(),
    vel:  Math.random() * 0.004 + 0.001,
    fase: Math.random() * Math.PI * 2,
    // algumas estrelas são douradas
    dourada: Math.random() < 0.25,
  }));

  let t = 0;
  function desenhar() {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    t += 0.016;

    estrelas.forEach(s => {
      const pulso = s.alfa * (0.4 + 0.6 * Math.sin(t * s.vel * 60 + s.fase));
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.dourada ? '#ffd700' : '#ffffff';
      ctx.globalAlpha = pulso * (s.dourada ? 0.7 : 0.5);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(desenhar);
  }
  desenhar();
});

// ── Tela 7: Vídeo + Transição para Foto ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('finale-video');
  const videoContainer = document.getElementById('finale-video-container');
  const fotoContainer = document.getElementById('finale-foto-container');
  const btnRecomecar = document.getElementById('btn-recomecar');

  if (!video) return;

  // Quando o vídeo termina (7 segundos)
  video.addEventListener('ended', () => {
    // Inicia fade-out do vídeo + fade-in da foto simultaneamente
    videoContainer.classList.add('saindo');
    setTimeout(() => {
      fotoContainer.classList.add('visivel');
    }, 100);
  });

  // Botão recomeçar: volta para Tela 1
  if (btnRecomecar) {
    btnRecomecar.addEventListener('click', () => {
      document.getElementById('tela-1')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Botão de Playlist: abre modal
  const btnPlaylist = document.getElementById('btn-playlist');
  const popupPlaylists = document.getElementById('popup-playlists');
  
  if (btnPlaylist && popupPlaylists) {
    btnPlaylist.addEventListener('click', () => {
      popupPlaylists.classList.add('visivel');
    });
  }

  // Fechar popup de playlists
  const closePlaylistsButtons = document.querySelectorAll('[data-close-playlists]');
  if (popupPlaylists) {
    closePlaylistsButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        popupPlaylists.classList.remove('visivel');
      });
    });

    // Fechar ao clicar fora
    popupPlaylists.addEventListener('click', (e) => {
      if (e.target === popupPlaylists) {
        popupPlaylists.classList.remove('visivel');
      }
    });
  }
});