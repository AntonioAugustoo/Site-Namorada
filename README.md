# 💙 Nossa Jornada — Retrospectiva Interativa

Um site interativo e imersivo que celebra a nossa história, combinando fotos, vídeos, áudio e interações especiais para reviver os momentos mais bonitos da nossa relação.

---

## 🚀 O Projeto

"Nossa Jornada" é uma experiência digital única que guia você através de **7 telas temáticas**, cada uma contando um capítulo especial da nossa história. O site é responsivo, totalmente animado e acompanhado por uma trilha sonora cuidadosamente selecionada.

### 🎬 As 7 Telas

| # | Tema | Descrição |
|---|------|-----------|
| 1 | **Capa** | Introdução com logo e botão para iniciar a jornada |
| 2 | **Elogios** | Detalhes admiráveis com cards interativos (Sorriso, Olhar, Determinação) |
| 3 | **Intro Estelar** | Transição com animação de estrelas e introdução cósmica |
| 4 | **Momentos** | Carrossel de fotos dos momentos mais importantes (1ª msg, 1º beijo, pedido) |
| 5 | **Playlists** | Trilha sonora especial em 3 volumes (Dedicatórias, Para Conhecer, Que Lembram Nós) |
| 6 | **Cupons** | 3 vales especiais para serem resgatados (Jantar, Filmes, Massagem) |
| 7 | **Grand Finale** | Vídeo + foto final com mensagem de amor e botões para playlist/recomeçar |

---

## 🛠️ Stack Tecnológico

- **HTML5** — Estrutura semântica com 7 seções completas
- **CSS3** — Animações fluidas, gradientes, efeitos visuais e responsividade
- **JavaScript (Vanilla)** — Gerenciamento de navegação, áudio, canvas animations e interações
- **Canvas API** — Efeitos visuais dinâmicos (particulas, estrelas, confete)
- **Audio API** — Reprodução de áudio sincronizado com cada tela

---

## 📁 Estrutura do Projeto

```
Site-Namorada/
├── retrospectiva/
│   ├── index.html              ← Estrutura principal (7 telas)
│   ├── main.js                 ← Lógica de navegação e interações
│   └── style.css               ← Estilos, animações e responsividade
├── assets/
│   ├── fotos/
│   │   ├── capa.jpeg           ← Capa do site
│   │   ├── sorriso.jpeg        ← Foto do elogio "Seu Sorriso"
│   │   ├── olhar.jpeg          ← Foto do elogio "Seu Olhar"
│   │   ├── determinacao.jpeg   ← Foto do elogio "Sua Determinação"
│   │   ├── momento1.jpg        ← 1ª foto (Primeira Mensagem)
│   │   ├── momento2.jpg        ← 2ª foto (Primeiro Beijo)
│   │   ├── momento3.jpg        ← 3ª foto (Pedido de Namoro)
│   │   ├── final.png           ← Foto final com mensagem
│   │   └── (mais fotos conforme necessário)
│   └── videos/
│       └── finale.mp4          ← Vídeo final da jornada
├── audio/
│   ├── musica1.mp3             ← Trilha da capa
│   ├── sorriso.m4a             ← Trilha dos elogios
│   ├── musica3.mp3             ← Trilha intro estelar
│   ├── nasa.m4a                ← Trilha dos momentos
│   ├── play.m4a                ← Trilha das playlists
│   ├── bala.m4a                ← Trilha dos cupons
│   └── sonha.m4a               ← Trilha do finale
├── README.md
└── .gitignore
```

---

## 🎮 Como Usar

**1. Abra o site:**
```
Navegue até: retrospectiva/index.html
```

**2. Navegação:**
- Clique em **"Iniciar Nossa Retrospectiva"** na capa
- Use o botão **"AVANÇAR →"** para ir para a próxima tela
- Clique nos **cards interativos** (elogios, playlists) para ver popups
- Use as **setas** no carrossel para navegar entre momentos

**3. Funcionalidades Especiais:**
- 🎵 **Áudio**: Cada tela tem sua própria trilha sonora
- 🔊 **Botão de Som**: Controle o áudio com o ícone no canto inferior direito
- 📱 **Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- 💫 **Animações**: Fade-in, efeitos de particulas, confete nos cupons

---

## ✨ Recursos Principais

### 🎨 Animações Visuais
- **Fade-in/Fade-up**: Entrada gradual de elementos
- **Particulas**: Canvas dinâmico na tela de elogios
- **Estrelas**: Animação de estrelas na transição estelar
- **Confete**: Efeito ao resgatar cupons

### 🎧 Áudio Sincronizado
- Cada tela possui uma trilha sonora exclusiva
- Reprodução automática e controle via botão de som
- Opção de silenciar permanentemente

### 🎫 Sistema de Cupons
- 3 vales especiais com ícones únicos
- Códigos resgatáveis gerados dinamicamente
- Modal de confirmação com confete

### 🎵 Integração Spotify
- Links diretos para 3 playlists exclusivas
- Modais informativos antes de redirecionar
- Gerenciamento de links nas variáveis do JS

### 📸 Popups Interativos
- Cards de elogios com fotos e descrições
- Playlists com informações sobre cada volume
- Vales com detalhes do cupom

---

## 🎯 Personalizações Necessárias

Antes de usar, atualize os seguintes arquivos:

### 📷 Fotos
- `assets/fotos/` — Substitua todas as fotos pelos seus momentos especiais

### 🎬 Vídeo
- `assets/videos/finale.mp4` — Adicione seu vídeo final

### 🎵 Áudio
- `audio/` — Troque as trilhas sonoras (busque livres de direitos autorais)

### 🔗 Links do Spotify
No arquivo `main.js` ou direto no HTML, procure por:
```javascript
// Playlists Spotify (atualize os IDs)
playlist1: "https://open.spotify.com/playlist/..."
playlist2: "https://open.spotify.com/playlist/..."
playlist3: "https://open.spotify.com/playlist/..."
```

### 💌 Textos e Mensagens
- Edite direto no `index.html` para personalizar títulos, descrições e a mensagem final

---

## 🚀 Como Implantar

### Opção 1: GitHub Pages
```bash
git push origin main
# Ative GitHub Pages nas configurações do repositório
```

### Opção 2: Hospedagem Manual
- Envie os arquivos para qualquer servidor web
- Garanta que a estrutura de pastas seja mantida

### Opção 3: Localmente
Basta abrir `retrospectiva/index.html` no navegador

---

## 🎨 Paleta de Cores

| Tema | Cores | Sentimento |
|------|-------|-----------|
| Capa | Rosa/Branco | Romantismo |
| Elogios | Amarelo, Azul, Rosa | Diversidade e Admiração |
| Estelar | Tons de Azul/Roxo | Infinidade e Eternidade |
| Momentos | Cyan Overlay | Nostalgia Vibrante |
| Playlists | Roxo, Azul, Laranja/Vermelho | Energia Musical |
| Cupons | Gradientes | Celebração |
| Finale | Rosa/Cyan | Apogeu da Jornada |

---

## 💝 Mensagens Especiais

A experiência termina com:
- ✉️ Mensagem de amor personalizada
- 🎁 3 cupons para resgatar experiências juntos
- 🎬 Vídeo e foto final marcante
- 🔄 Opção de recomeçar a jornada

---

## 🤝 Créditos

Desenvolvido com ❤️ para celebrar cada momento especial.