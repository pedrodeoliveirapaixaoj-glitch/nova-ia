document.addEventListener('DOMContentLoaded', () => {
    // ===== PERMISSIONS SCREEN =====
    const permissionsScreen = document.getElementById('permissionsScreen');
    const appContainer = document.getElementById('appContainer');
    const menuToggle = document.getElementById('menuToggle');
    const btnAllowPermissions = document.getElementById('btnAllowPermissions');

    if (localStorage.getItem('potiguar_permissions_accepted') === 'true') {
        permissionsScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
    }

    btnAllowPermissions.addEventListener('click', () => {
        const perms = {};
        document.querySelectorAll('.permission-item').forEach(item => {
            const cb = item.querySelector('.perm-checkbox');
            perms[item.dataset.perm] = cb.checked;
        });
        localStorage.setItem('potiguar_permissions', JSON.stringify(perms));
        localStorage.setItem('potiguar_permissions_accepted', 'true');

        permissionsScreen.style.transition = 'opacity 0.5s ease';
        permissionsScreen.style.opacity = '0';
        setTimeout(() => {
            permissionsScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            appContainer.style.opacity = '0';
            appContainer.style.transition = 'opacity 0.5s ease';
            requestAnimationFrame(() => { appContainer.style.opacity = '1'; });
        }, 400);
    });

    // ===== NAVIGATION =====
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay hidden';
    sidebarOverlay.id = 'sidebarOverlay';
    document.body.appendChild(sidebarOverlay);

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchSection(btn.dataset.section);
            closeSidebar();
        });
    });

    function switchSection(sectionId) {
        navBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${sectionId}`)?.classList.add('active');
        if (sectionId !== 'camera' && currentStream) stopCamera();
    }

    function openSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.remove('hidden');
        sidebarOverlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.add('hidden');
        sidebarOverlay.classList.remove('active');
    }

    menuToggle.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
    sidebarOverlay.addEventListener('click', closeSidebar);

    // ===== TABS SYSTEM =====
    function initTabs(containerSelector, tabClass, contentPrefix) {
        const tabBtns = document.querySelectorAll(`${containerSelector} .${tabClass}`);
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const container = btn.closest('.content-section, .section-header');
                const parent = btn.parentElement;
                parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                const target = document.getElementById(btn.dataset.tab);
                if (target) target.classList.add('active');
            });
        });
    }

    // Tab buttons in futebol section
    document.querySelectorAll('.tabs-futebol .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tabs-futebol .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            document.getElementById(btn.dataset.tab)?.classList.add('active');
        });
    });

    // Tab buttons in criacao section
    document.querySelectorAll('.tabs-criacao .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tabs-criacao .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            document.getElementById(btn.dataset.tab)?.classList.add('active');
        });
    });

    // ===== CHAT / AMIGO DE VERDADE =====
    const messageInput = document.getElementById('messageInput');
    const btnSend = document.getElementById('btnSend');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const chatContainer = document.getElementById('chatContainer');
    const messagesContainer = document.getElementById('messages');
    const typingIndicator = document.getElementById('typingIndicator');

    const funResponses = {
        greetings: {
            patterns: [/ol[áa]/i, /bom (dia|tarde|noite)/i, /oi/i, /hey/i, /hello/i, /eai/i, /e a[íi]/i, /salve/i, /opa/i, /falas/i],
            responses: [
                "Oxe! Fala tu! 😄 O que manda hoje, meu parceiro?",
                "E aí, beleza? O Potiguar IA tá na área! 🦞",
                "Fala aí! Tô aqui pra te ajudar no que precisar! 🚀",
                "Opa! Que bom te ver por aqui! Bora resolver algo? 😎",
                "Salve! Potiguar IA no comando! O que tu quer? 🦞"
            ]
        },
        identity: {
            patterns: [/quem (é|e) voc[eê]/i, /o que voc[eê] (é|e)/i, /seu nome/i, /como te chama/i],
            responses: [
                "Sou o Potiguar IA! 🦞 Teu parceiro de todas as horas — chat, futebol, jogos, programação, criação, culinária... eu faço de tudo (menos fazer café ☕😂).",
                "Meu nome é Potiguar IA! Sou um app completo com futebol, jogos, programação, criação, culinária, imagens e câmera. Basicamente, sou anavalha suíça do Nordeste! 🔥"
            ]
        },
        piadas: {
            patterns: [/piada/i, /engra[cç]ad/i, /rir/i, /humor/i, /comedi/i, /risada/i],
            responses: [
                "Lá vai: Por que o potiguar não joga xadrez? Porque ele prefere jogar bola! 😂⚽",
                "Piada rápida: O que o açaí disse pro bolinho de goma? 'Bora pro pote!' 🫐😂",
                "Por que o potiguar levou um mapa pra praia? Porque ele queria achar o caminho do mar! 😂🏖️",
                "Qual é o cúmulo da tecnologia no RN? Um celular que faz tapioca! 😅🫓",
                "O que o frango a potiguar disse pro caranguejo? 'Para de andar de lado!' 😂🦞",
                "Piada de potiguar: Por que o caranguejo é bom em programação? Porque ele anda de lado e nunca vai reto! 🦞💻"
            ]
        },
        adivinhas: {
            patterns: [/adivinh/i, /charada/i, /enigma/i, /adivinha/i],
            responses: [
                "🤔 Adivinha: O que é, o que é? Tem boca mas não fala, tem cama mas não dorme. Resposta: O rio! 😄",
                "🤔 O que é, o que é? Quanto mais se tira, maior fica. Resposta: O buraco! 😂",
                "🤔 Adivinha: O que é que sobe e nunca desce? Resposta: A idade! 🎂",
                "🤔 O que é, o que é? Tem coroa mas não é rei, tem dente mas não é animal. Resposta: O alho! 🧄",
                "🤔 Adivinha: O que é que está no meio do Rio de Janeiro? Resposta: A letra 'I'! 😄",
                "🤔 O que é, o que é? Quanto mais quente, mais frio fica. Resposta: A pimenta! 🌶️"
            ]
        },
        cantadas: {
            patterns: [/cantada/i, /cantar/i, /paquerar/i, /conquist/i],
            responses: [
                "😏 Lá vai: Você é açaí? Porque sem você, meu dia não tem graça!",
                "😏 Essa é boa: Se beleza fosse crime, você pegaria prisão perpétua!",
                "😏 Ó: Você é tapioca? Porque eu quero te recheear de carinho!",
                "😏 Vai essa: Seu sorriso é igual Carne de Sol — impossível de resistir!",
                "😏 Ô: Você é o Maracanã? Porque todo mundo quer entrar em você! 😂⚽",
                "😏 Potiguar style: Você é caranguejo? Porque me pegou pelas pinças!"
            ]
        },
        fluminense: {
            patterns: [/fluminense/i, /flu/i],
            responses: [
                "O Fluminense é o Tricolor das Laranjeiras! Fundado em 1902, tem a melhor academia de futebol do Brasil. Jogadores como Fred, Ganso e Thiago Silva brilharam lá! 🤍🩵❤️"
            ]
        },
        flamengo: {
            patterns: [/flamengo/i, /mengao/i, /meng[ãa]o/i, /rubro/i, /gabigol/i, /arrascaeta/i, /pedro/i],
            responses: [
                "🔴⚫ O MENGÃO! O maior do Brasil! 40+ milhões de torcedores, 3 Libertadores, 1 Mundial, e o Zico como maior ídolo! O Gabigol na final de 2019 foi ÉPICO! UMA VEZ FLAMENGO, SEMPRE FLAMENGO! 🔥",
                "Flamengo é paixão! O Maracanã treme quando o Mengão joga. Gabigol, Arrascaeta, Pedro, Bruno Henrique... o elenco é monstro! O Fla é gigante! 🔴⚫"
            ]
        },
        vasco: {
            patterns: [/vasco/i, /cruz/i, /s[ãa]o jan/i],
            responses: [
                "O Vasco da Gama! O Clube de Regatas! Gigante da Colina, 4x campeão brasileiro, campeão da Libertadores 1998! Romário foi ídolo lá! O Vasco nunca desiste! ⚫⚪"
            ]
        },
        botafogo: {
            patterns: [/botafogo/i, /fogo/i, /estrela sol/i],
            responses: [
                "Botafogo! A Estrela Solitária brilha forte! Fundado em 1894, tem a maior torcida do Rio depois de Flamengo e Vasco. Garrincha, Nílton Santos... lendas eternas! ⚫🤍"
            ]
        },
        corinthians: {
            patterns: [/corinthians/i, /tim[ãa]o/i],
            responses: [
                "Corinthians! A Fiel Torcida! 30+ milhões de torcedores, campeão do mundo 2000 e 2012! O Timão nunca desiste! Cassio, Cássio, Younis... ídolos eternos! ⚫⚪"
            ]
        },
        palmeiras: {
            patterns: [/palmeiras/i, /verd[ãa]o/i],
            responses: [
                "Palmeiras! O Verdão! Campeão do mundo 1999, 12x campeão brasileiro! Endrick foi revelado lá. O Palmeiras é gigante do futebol brasileiro! 🟢⚪"
            ]
        },
        vini: {
            patterns: [/vini/i, /vin[ií]/i, /vinicius/i, /vinici/i],
            responses: [
                "⭐ VINI JÚNIOR! O craque brasileiro que tá dominando o Real Madrid! Bola de Ouro 2024, 2x Champions League, e o cara mais ousado do futebol mundial! Revelado pelo Flamengo, orgulho do Brasil! 🇧🇷⚽",
                "O Vini Jr é fenômeno! Velocidade, drible, irreverência... ele joga como se estivesse se divertindo! E joga muito! O Real Madrid tem um tesouro brasileiro! 🌟"
            ]
        },
        jogos: {
            patterns: [/jogo/i, /game/i, /free fire/i, /blox fruit/i, /roblox/i, /fortnite/i],
            responses: [
                "🎮 Vai na seção **Jogos** no menu! Tem dicas de ouro de Free Fire, truques de Blox Fruits, ajuda com Roblox e estratégias de Fortnite! Tudo que tu precisa pra mandar bem! 🕹️",
                "Gamer de verdade! Vai na aba **🎮 Jogos** que tem dicas completas de todos os jogos que tu curte! Bora dominar o leaderboard! 🏆"
            ]
        },
        programacao: {
            patterns: [/programa[cç][aã]o/i, /c[óo]digo/i, /python/i, /javascript/i, /html/i, /css/i, /desenvolv/i],
            responses: [
                "💻 Programação é o futuro! Vai na aba **Programação** que tem um editor completo com preview ao vivo. Tem até 10 exemplos prontos, incluindo um jogo de cobra! 🐍",
                "Bora codar! Na seção **💻 Programação** tem um editor maneiro com preview em tempo real. Clica nos exemplos e vê a mágica acontecer! ✨"
            ]
        },
        culinaria: {
            patterns: [/comida/i, /receita/i, /a[cç]a[ií]/i, /leite ninho/i, /tapioca/i, /carne de sol/i, /culin/i, /cozinha/i],
            responses: [
                "🍴 Comida boa é no Potiguar IA! Vai na seção **Coisas da Terra** que tem receitas de açaí, leite ninho, tapioca, carne de sol, bolinho de goma e cajuzinho! Tudo típico do RN! 🦞",
                "Oxe! Fome de quê? Na aba **🍴 Coisas da Terra** tem receitas potiguaras autênticas! Açaí, carne de sol, bolinho de goma... bora cozinhar! 👨‍🍳"
            ]
        },
        criacao: {
            patterns: [/letra/i, /m[úu]sica/i, /rima/i, /cantada/i, /cursiva/i, /escreve/i, /poesia/i],
            responses: [
                "✍️ Vai na seção **Criação**! Lá tem gerador de letras de música, rimas, cantadas e prática de letra cursiva! É criatividade sem limites! 🎵",
                "Criação é com o Potiguar IA! Na aba **✍️ Criação** tu gera letras, rimas, cantadas e pratica letra cursiva! Bora criar! 🖊️"
            ]
        },
        imagens: {
            patterns: [/imagem/i, /foto/i, /gerar/i, /criar/i, /arte/i, /visual/i],
            responses: [
                "🖼️ Vai na seção **Imagens**! Lá você gera imagens com diferentes estilos, faz upload e organiza sua galeria. É tipo um estúdio de arte no bolso! 🎨"
            ]
        },
        camera: {
            patterns: [/c[âa]mera/i, /captur/i, /tirar/i, /fotografia/i],
            responses: [
                "📷 A seção **Câmera** tá te esperando! Liga a câmera e tira fotos direto pelo app. Funciona com a câmera frontal e traseira!"
            ]
        },
        thanks: {
            patterns: [/obrigad/i, /valeu/i, /thanks/i, /agrade[cç]o/i, /brigad/i],
            responses: [
                "De nada, meu parceiro! Tô sempre aqui! Qualquer coisa, é só chamar! 😄🦞",
                "Valeu tu! Fico feliz em ajudar! Volta sempre que precisar! 🙌",
                "Tamo junto! Potiguar IA nunca te abandona! 💪"
            ]
        },
        ajuda: {
            patterns: [/ajuda/i, /help/i, /como (uso|funciona)/i, /como (posso|fa[cç]o)/i, /menu/i],
            responses: [
                "Claro que te ajudo! Aqui estão as minhas habilidades:\n\n• 🤝 **Amigo de Verdade** — Converse comigo, piadas, adivinhas, cantadas\n• ⚽ **Futebol** — Narrações, Flamengo, Vini Jr, dicas de jogo, quiz de times\n• 🎮 **Jogos** — Dicas de Free Fire, Blox Fruits, Roblox, Fortnite\n• 💻 **Programação** — Editor de código HTML/CSS/JS com preview\n• ✍️ **Criação** — Letras de música, rimas, cantadas, letra cursiva\n• 🍴 **Coisas da Terra** — Receitas típicas do RN\n• 🖼️ **Imagens** — Gere e organize imagens\n• 📷 **Câmera** — Tire fotos pelo app\n\nÉ só navegar pelo menu lateral! 🚀"
            ]
        },
        default: [
            "Hmm, interessante! 🤔 Posso te ajudar com futebol, jogos, programação, criação, culinária, imagens ou câmera! O que te interessa?",
            "Beleza! Tô aqui pra ajudar no que precisar. Quer conversar sobre qualquer coisa? Me conta! 😄🦞",
            "Boa! Pode contar comigo! Se quiser, dá uma olhada nas seções do menu — tem de tudo um pouco. Ou se preferir, me conta mais sobre o que precisa! 🦞"
        ]
    };

    function generateAIResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        for (const [category, data] of Object.entries(funResponses)) {
            if (category === 'default') continue;
            if (data.patterns && data.patterns.some(p => p.test(lowerMsg))) {
                const responses = data.responses || [data];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        const defaults = funResponses.default;
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    function getTimeString() {
        return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function createMessageElement(content, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.innerHTML = `
            <div class="message-avatar">${type === 'user' ? '😎' : '🦞'}</div>
            <div>
                <div class="message-content">${content.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</div>
                <div class="message-time">${getTimeString()}</div>
            </div>
        `;
        return msg;
    }

    let isProcessing = false;

    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text || isProcessing) return;
        isProcessing = true;
        btnSend.disabled = true;
        welcomeScreen.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        messagesContainer.appendChild(createMessageElement(text, 'user'));
        messageInput.value = '';
        messageInput.style.height = 'auto';
        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        setTimeout(() => {
            const response = generateAIResponse(text);
            typingIndicator.classList.add('hidden');
            messagesContainer.appendChild(createMessageElement(response, 'ai'));
            scrollToBottom();
            isProcessing = false;
            updateSendButton();
        }, 800 + Math.random() * 1200);
    }

    function scrollToBottom() { chatContainer.scrollTop = chatContainer.scrollHeight; }
    function updateSendButton() { btnSend.disabled = !messageInput.value.trim() || isProcessing; }

    btnSend.addEventListener('click', sendMessage);
    messageInput.addEventListener('input', () => {
        updateSendButton();
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    });
    messageInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => { messageInput.value = btn.dataset.prompt; updateSendButton(); sendMessage(); });
    });

    // ===== FUTEBOL: NARRAÇÃO =====
    const narracoes = {
        flamengo: ["GOOOOL DO FLAMENGO! O Maracanã EXPLODIU! O Mengão não tem jeito! A torcida tá de pé, o estádio tá TREMENDO! É FLAMENGO, SENHOR! 🔴⚫", "GOOOOOL! O Flamengo é gigante! A Nação Rubro-Negra COMEMORA! Mais um gol pra história do Mengão! UMA VEZ FLAMENGO, SEMPRE FLAMENGO! 🔥"],
        vasco: ["GOOOOL DO VASCO! A Cruz de Malta brilha no Maracanã! O Gigante da Colina mostrou sua força! VASCO VASCO VASCO! ⚫⚪", "GOOOL! O Vasco nunca desiste! A Fiel Torcida do Vasco COMEMORA! Mais um capítulo da história cruzmaltina! ⚫⚪"],
        fluminense: ["GOOOOL DO FLU! O Tricolor das Laranjeiras balançou as redes! Fred estaria orgulhoso! FLU FLU FLU! 🤍🩵❤️", "GOOOL! O Fluminense é arte! O Verdinho tá de pé no Maracanã! Mais um gol pro Tricolor! 🩵🤍❤️"],
        botafogo: ["GOOOOL DO BOTAFOGO! A Estrela Solitária brilha mais forte que nunca! O Fogo tá ON! ⚫🤍", "GOOOL! O Botafogo é história! Garrincha estaria sorrindo! Mais um gol pro Glorioso! ⚫🤍"],
        corinthians: ["GOOOOL DO CORINTHIANS! A Fiel Torcida ENLOUQUECEU! O Timão não para! Corinthians é gigante! ⚫⚪", "GOOOL! O Timão tá ON! A Fiel tá de pé! Mais um gol pro Corinthians! Timão é raça! ⚫⚪"],
        palmeiras: ["GOOOOL DO PALMEIRAS! O Verdão tá dominando! 12 títulos brasileiros e o Palmeiras não para! 🟢⚪", "GOOOL! O Palmeiras é campeão! O Verdão tá mostrando por que é gigante! Endrick estaria orgulhoso! 🟢⚪"],
        santos: ["GOOOOL DO SANTOS! O Peixe tá vivo! A Vila Belmiro tá de pé! Santos é tradição! ⚫⚪", "GOOOL! O Santos é Pelé, é Neymar, é tradição! O Peixe tá ON! ⚫⚪"],
        brasil: ["GOOOOL DO BRASIL! O Maracanã tá de pé! A Seleção Brasileira mostrou por que é PENTA! VERDE E AMARELO! 🇧🇷", "GOOOL! O BRASIL TÁ ON! A torcida tá COMEMORANDO! Mais um gol pra história do futebol brasileiro! 🇧🇷🔥"],
        aleatorio: ["GOOOOOOOOOL! QUE JOGADA! O ESTÁDIO TÁ TREMENDO! A TORCIDA TÁ DE PÉ! ISSO É FUTEBOL! 🎉⚽", "GOOOOL! QUE GOL É ESSE! O JOGADOR TÁ VOANDO! A BOLA ENTROU NO ÂNGULO! IMPARÁVEL! 🎉⚽", "GOOOOOL! É GOL! É GOL! É GOL! O MARACANÃ EXPLODIU! QUE MOMENTO! 🎉⚽"]
    };

    document.getElementById('btnGerarNarracao')?.addEventListener('click', () => {
        const time = document.getElementById('narracaoTime').value;
        const narracaoList = narracoes[time] || narracoes.aleatorio;
        const narracao = narracaoList[Math.floor(Math.random() * narracaoList.length)];
        const result = document.getElementById('narracaoResult');
        result.classList.remove('hidden');
        result.innerHTML = `<div class="narracao-text">${narracao}</div>`;
    });

    // ===== FUTEBOL: QUIZ DE TIMES =====
    const quizFutebolQuestions = [
        { q: "Qual time é conhecido como 'O Mais Querido do Brasil'?", options: ["Vasco", "Flamengo", "Corinthians", "Palmeiras"], correct: 1 },
        { q: "Quantos títulos de Copa do Mundo o Brasil tem?", options: ["4", "5", "6", "3"], correct: 1 },
        { q: "Qual jogador é conhecido como 'O Fenômeno'?", options: ["Messi", "Cristiano Ronaldo", "Ronaldo Nazário", "Neymar"], correct: 2 },
        { q: "Em qual ano o Flamengo ganhou a Libertadores pela primeira vez?", options: ["1979", "1981", "1983", "1985"], correct: 1 },
        { q: "Qual time tem a maior torcida do Brasil?", options: ["Corinthians", "Palmeiras", "Flamengo", "São Paulo"], correct: 2 },
        { q: "Onde nasceu Vinícius Júnior?", options: ["Rio de Janeiro", "São Paulo", "Salvador", "Fortaleza"], correct: 0 },
        { q: "Qual é o estádio do Flamengo?", options: ["Arena Corinthians", "Maracanã", "Allianz Parque", "Mineirão"], correct: 1 },
        { q: "Quantos jogadores tem cada time em campo no futebol?", options: ["9", "10", "11", "12"], correct: 2 },
        { q: "Qual time é chamado de 'O Verdão'?", options: ["Fluminense", "Palmeiras", "Coritiba", "Ceará"], correct: 1 },
        { q: "Quem é o maior artilheiro da história do futebol?", options: ["Pelé", "Messi", "CR7", "Romário"], correct: 0 },
        { q: "Qual clube carioca é conhecido como 'Gigante da Colina'?", options: ["Flamengo", "Botafogo", "Vasco", "Fluminense"], correct: 2 },
        { q: "Quantos minutos dura uma partida oficial de futebol?", options: ["80", "90", "100", "120"], correct: 1 },
    ];

    let quizFutebolIndex = 0;
    let quizAcertos = 0;
    let quizErros = 0;
    const quizFutebolQuestionEl = document.getElementById('quizFutebolQuestion');
    const quizFutebolOptionsEl = document.getElementById('quizFutebolOptions');
    const quizFutebolResultEl = document.getElementById('quizFutebolResult');
    const btnNextQuizFutebol = document.getElementById('btnNextQuizFutebol');

    function loadQuizFutebol() {
        const q = quizFutebolQuestions[quizFutebolIndex % quizFutebolQuestions.length];
        quizFutebolQuestionEl.textContent = q.q;
        quizFutebolOptionsEl.innerHTML = '';
        quizFutebolResultEl.classList.add('hidden');
        btnNextQuizFutebol.classList.add('hidden');

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.dataset.index = i;
            btn.addEventListener('click', () => handleQuizFutebol(i, q.correct));
            quizFutebolOptionsEl.appendChild(btn);
        });
    }

    function handleQuizFutebol(selected, correct) {
        const options = quizFutebolOptionsEl.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.classList.add('disabled');
            if (parseInt(opt.dataset.index) === correct) opt.classList.add('correct');
            if (parseInt(opt.dataset.index) === selected && selected !== correct) opt.classList.add('wrong');
        });

        quizFutebolResultEl.classList.remove('hidden');
        if (selected === correct) {
            quizAcertos++;
            quizFutebolResultEl.className = 'quiz-result success';
            quizFutebolResultEl.textContent = '🎉 Acertou! Mandou bem, craque!';
        } else {
            quizErros++;
            quizFutebolResultEl.className = 'quiz-result fail';
            quizFutebolResultEl.textContent = '😅 Errou! Mas faz parte, bora pra próxima!';
        }
        document.getElementById('quizAcertos').textContent = quizAcertos;
        document.getElementById('quizErros').textContent = quizErros;
        btnNextQuizFutebol.classList.remove('hidden');
    }

    btnNextQuizFutebol?.addEventListener('click', () => { quizFutebolIndex++; loadQuizFutebol(); });
    loadQuizFutebol();

    // ===== PROGRAMAÇÃO =====
    const editorTabs = document.querySelectorAll('.editor-tab');
    const codeEditors = document.querySelectorAll('.code-editor');
    const btnRunCode = document.getElementById('btnRunCode');
    const btnClearCode = document.getElementById('btnClearCode');
    const btnRefreshPreview = document.getElementById('btnRefreshPreview');
    const previewFrame = document.getElementById('previewFrame');
    const consoleOutput = document.getElementById('consoleOutput');

    const codeSnippets = {
        html: {
            basic: `<h1>Olá, Mundo! 🌍</h1>\n<p>Meu primeiro site maneiro!</p>`,
            form: `<form>\n    <h2>Cadastro</h2>\n    <label>Nome:</label>\n    <input type="text" placeholder="Seu nome" required>\n    <label>Email:</label>\n    <input type="email" placeholder="seu@email.com" required>\n    <button type="submit">Enviar</button>\n</form>`
        },
        css: {
            flexbox: `body { margin: 0; font-family: Arial; background: #f8f9fa; display: flex; justify-content: center; align-items: center; min-height: 100vh; }\n.container { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; padding: 20px; }\n.card { width: 200px; height: 150px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; transition: transform 0.3s; }\n.card:hover { transform: translateY(-8px); }\n.card:nth-child(1) { background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; }\n.card:nth-child(2) { background: linear-gradient(135deg, #00cec9, #81ecec); color: white; }\n.card:nth-child(3) { background: linear-gradient(135deg, #fd79a8, #fab1a0); color: white; }`,
            animation: `body { margin: 0; height: 100vh; display: flex; justify-content: center; align-items: center; background: #1a1a2e; font-family: Arial; }\n.animated-box { width: 100px; height: 100px; background: linear-gradient(135deg, #6c5ce7, #fd79a8); border-radius: 20px; animation: float 3s ease-in-out infinite, rotate 6s linear infinite; }\n@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }\n@keyframes rotate { 0% { border-radius: 20px; } 50% { border-radius: 50%; } 100% { border-radius: 20px; } }`
        },
        js: {
            fetch: `async function fetchData() {\n    try {\n        const response = await fetch('https://api.github.com/users/github');\n        const data = await response.json();\n        document.getElementById('output').innerHTML = \n            '<h2>' + data.name + '</h2>' +\n            '<p>Seguidores: ' + data.followers + '</p>' +\n            '<p>Repos: ' + data.public_repos + '</p>';\n    } catch (error) {\n        document.getElementById('output').textContent = 'Erro: ' + error.message;\n    }\n}\nfetchData();`,
            dom: `const container = document.createElement('div');\ncontainer.style.cssText = 'text-align:center; padding:40px; font-family:Arial;';\nconst title = document.createElement('h1');\ntitle.textContent = '🎯 Manipulação DOM';\ntitle.style.color = '#6c5ce7';\nconst btn = document.createElement('button');\nbtn.textContent = 'Clique aqui!';\nbtn.style.cssText = 'padding:12px 24px; background:#6c5ce7; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;';\nlet count = 0;\nbtn.onclick = () => { count++; title.textContent = '🎯 Você clicou ' + count + ' vez' + (count > 1 ? 'es' : '') + '!'; };\ncontainer.appendChild(title);\ncontainer.appendChild(btn);\ndocument.body.appendChild(container);`
        },
        full: {
            card: { html: `<div class="card"><div class="card-image">🖼️</div><div class="card-body"><h3>Título do Card</h3><p>Descrição do card com informações relevantes.</p><button class="btn">Saiba mais</button></div></div>`, css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f0f0f0; font-family: Arial; }\n.card { width: 300px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }\n.card-image { height: 180px; background: linear-gradient(135deg, #6c5ce7, #a29bfe); display: flex; align-items: center; justify-content: center; font-size: 48px; }\n.card-body { padding: 20px; }\n.card-body h3 { margin: 0 0 8px; color: #333; }\n.card-body p { color: #666; font-size: 14px; line-height: 1.5; }\n.btn { margin-top: 12px; padding: 8px 20px; background: #6c5ce7; color: white; border: none; border-radius: 6px; cursor: pointer; }` },
            todo: { html: `<div id="app"><h1>📝 Todo List</h1><div class="input-group"><input id="taskInput" placeholder="Nova tarefa..." /><button id="addBtn">Adicionar</button></div><ul id="taskList"></ul><p id="counter">0 tarefas</p></div>`, css: `body { font-family: Arial; max-width: 400px; margin: 40px auto; padding: 0 20px; background: #f8f9fa; }\nh1 { color: #6c5ce7; }\n.input-group { display: flex; gap: 8px; margin: 16px 0; }\ninput { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }\nbutton { padding: 10px 16px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; }\nul { list-style: none; padding: 0; }\nli { display: flex; align-items: center; gap: 10px; padding: 10px; background: white; margin: 4px 0; border-radius: 8px; }\nli.done span { text-decoration: line-through; color: #aaa; }\nli .delete { margin-left: auto; color: #ff6b6b; cursor: pointer; }\n#counter { color: #666; font-size: 13px; }`, js: `const input = document.getElementById('taskInput');\nconst addBtn = document.getElementById('addBtn');\nconst taskList = document.getElementById('taskList');\nconst counter = document.getElementById('counter');\nlet tasks = [];\nfunction render() {\n    taskList.innerHTML = '';\n    tasks.forEach((task, i) => {\n        const li = document.createElement('li');\n        li.className = task.done ? 'done' : '';\n        li.innerHTML = '<span>' + task.text + '</span><span class="delete">✕</span>';\n        li.querySelector('span').onclick = () => { tasks[i].done = !tasks[i].done; render(); };\n        li.querySelector('.delete').onclick = () => { tasks.splice(i, 1); render(); };\n        taskList.appendChild(li);\n    });\n    counter.textContent = tasks.length + ' tarefa' + (tasks.length !== 1 ? 's' : '');\n}\naddBtn.onclick = () => { if (input.value.trim()) { tasks.push({ text: input.value.trim(), done: false }); input.value = ''; render(); } };\ninput.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });` },
            calculator: { html: `<div class="calc"><div class="display" id="display">0</div><div class="buttons"><button class="btn op" onclick="clearDisplay()">C</button><button class="btn op" onclick="appendOp('%')">%</button><button class="btn op" onclick="appendOp('/')">÷</button><button class="btn" onclick="appendNum('7')">7</button><button class="btn" onclick="appendNum('8')">8</button><button class="btn" onclick="appendNum('9')">9</button><button class="btn op" onclick="appendOp('*')">×</button><button class="btn" onclick="appendNum('4')">4</button><button class="btn" onclick="appendNum('5')">5</button><button class="btn" onclick="appendNum('6')">6</button><button class="btn op" onclick="appendOp('-')">−</button><button class="btn" onclick="appendNum('1')">1</button><button class="btn" onclick="appendNum('2')">2</button><button class="btn" onclick="appendNum('3')">3</button><button class="btn op" onclick="appendOp('+')">+</button><button class="btn zero" onclick="appendNum('0')">0</button><button class="btn" onclick="appendNum('.')">.</button><button class="btn eq" onclick="calculate()">=</button></div></div>`, css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #1a1a2e; font-family: Arial; }\n.calc { width: 300px; background: #2d2d44; border-radius: 20px; padding: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }\n.display { background: #1a1a2e; color: white; font-size: 36px; text-align: right; padding: 16px; border-radius: 12px; margin-bottom: 16px; min-height: 60px; }\n.buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }\n.btn { padding: 16px; font-size: 18px; border: none; border-radius: 12px; cursor: pointer; background: #3d3d5c; color: white; transition: 0.2s; }\n.btn:hover { background: #4d4d6c; }\n.btn.op { background: #6c5ce7; }\n.btn.eq { background: #00cec9; }\n.btn.zero { grid-column: span 2; }`, js: `let expression = '';\nconst display = document.getElementById('display');\nfunction appendNum(n) { expression += n; updateDisplay(); }\nfunction appendOp(op) { expression += op; updateDisplay(); }\nfunction clearDisplay() { expression = ''; display.textContent = '0'; }\nfunction updateDisplay() { display.textContent = expression || '0'; }\nfunction calculate() { try { let result = Function('"use strict"; return (' + expression + ')')(); expression = String(result); display.textContent = expression; } catch(e) { display.textContent = 'Erro'; expression = ''; } }` },
            game: { html: `<div class="game-container"><h1>🐍 Snake Game</h1><canvas id="gameCanvas" width="400" height="400"></canvas><p>Use as setas do teclado pra jogar!</p><p id="score">Pontos: 0</p><button onclick="startGame()">Iniciar / Reiniciar</button></div>`, css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #1a1a2e; font-family: Arial; color: white; }\n.game-container { text-align: center; }\ncanvas { border: 2px solid #6c5ce7; border-radius: 8px; background: #0f0f0f; display: block; margin: 16px auto; }\nbutton { padding: 10px 24px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }\n#score { font-size: 18px; color: #a29bfe; }`, js: `const canvas = document.getElementById('gameCanvas');\nconst ctx = canvas.getContext('2d');\nconst scoreEl = document.getElementById('score');\nconst size = 20;\nlet snake, food, dir, nextDir, gameLoop, score;\nfunction init() { snake = [{x:10,y:10}]; dir={x:1,y:0}; nextDir=dir; score=0; placeFood(); scoreEl.textContent='Pontos: '+score; }\nfunction placeFood() { food = {x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)}; }\nfunction draw() { ctx.fillStyle='#0f0f0f'; ctx.fillRect(0,0,400,400); snake.forEach((s,i)=>{ctx.fillStyle=i===0?'#6c5ce7':'#a29bfe';ctx.fillRect(s.x*size+1,s.y*size+1,size-2,size-2);}); ctx.fillStyle='#ff6b6b'; ctx.fillRect(food.x*size+1,food.y*size+1,size-2,size-2); }\nfunction update() { dir=nextDir; const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y}; if(head.x<0||head.x>=20||head.y<0||head.y>=20||snake.some(s=>s.x===head.x&&s.y===head.y)){clearInterval(gameLoop);alert('Game Over! Pontos: '+score);return;} snake.unshift(head); if(head.x===food.x&&head.y===food.y){score++;scoreEl.textContent='Pontos: '+score;placeFood();}else snake.pop(); draw(); }\ndocument.addEventListener('keydown',e=>{const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};if(map[e.key]&&(map[e.key].x+dir.x!==0||map[e.key].y+dir.y!==0))nextDir=map[e.key];});\nfunction startGame(){clearInterval(gameLoop);init();draw();gameLoop=setInterval(update,120);}\ninit();draw();` }
        }
    };

    editorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            editorTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            codeEditors.forEach(e => e.classList.remove('active'));
            document.getElementById(`editor-${tab.dataset.tab}`).classList.add('active');
        });
    });

    function runCode() {
        const html = document.getElementById('editor-html').value;
        const css = document.getElementById('editor-css').value;
        const js = document.getElementById('editor-js').value;
        const fullCode = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css}</style></head><body>${html}<script>const oLog=console.log,oErr=console.error,oWarn=console.warn;console.log=function(...a){oLog(...a);window.parent.postMessage({type:'log',text:a.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' ')},'*');};console.error=function(...a){oErr(...a);window.parent.postMessage({type:'error',text:a.map(x=>String(x)).join(' ')},'*');};console.warn=function(...a){oWarn(...a);window.parent.postMessage({type:'warn',text:a.map(x=>String(x)).join(' ')},'*');};try{${js}}catch(e){console.error(e.message);}<\/script></body></html>`;
        previewFrame.src = URL.createObjectURL(new Blob([fullCode], { type: 'text/html' }));
        consoleOutput.innerHTML = '';
    }

    btnRunCode.addEventListener('click', runCode);
    btnRefreshPreview.addEventListener('click', runCode);
    btnClearCode.addEventListener('click', () => { codeEditors.forEach(e => e.value = ''); previewFrame.src = 'about:blank'; consoleOutput.innerHTML = ''; });

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type) {
            const div = document.createElement('div');
            div.className = 'log-' + e.data.type;
            div.textContent = '> ' + e.data.text;
            consoleOutput.appendChild(div);
        }
    });

    document.querySelectorAll('.snippet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type, code = btn.dataset.code;
            const snippet = codeSnippets[type]?.[code];
            if (!snippet) return;
            if (type === 'full') { if(snippet.html) document.getElementById('editor-html').value=snippet.html; if(snippet.css) document.getElementById('editor-css').value=snippet.css; if(snippet.js) document.getElementById('editor-js').value=snippet.js; }
            else { if(type==='html') document.getElementById('editor-html').value=snippet; if(type==='css') document.getElementById('editor-css').value=snippet; if(type==='js') document.getElementById('editor-js').value=snippet; }
            editorTabs.forEach(t=>t.classList.remove('active')); codeEditors.forEach(e=>e.classList.remove('active'));
            const tt = document.querySelector(`[data-tab="${type==='full'?'html':type}"]`); if(tt) tt.classList.add('active');
            const te = document.getElementById(`editor-${type==='full'?'html':type}`); if(te) te.classList.add('active');
            runCode();
        });
    });

    // ===== CRIAÇÃO: LETRAS DE MÚSICA =====
    const letrasMusicas = {
        sertanejo: {
            amor: ["Eu vi você passando na estrada\nE meu coração ficou acelerado\nComo a chuva que cai na caatinga\nMeu amor por você não tem medida\n\nÔ, minha morena, vem cá\nQue eu quero te dizer que te amo demais\nNessa noite de lua cheia\nMeu coração só pensa em te encontrar", "Meu sertão é mais bonito quando você tá aqui\nComo a flor que nasce depois da chuva\nMeu amor é como o rio que não para\nSempre correndo na direção do seu sorriso"],
            amizade: ["Meu parceiro, meu irmão\nNessa estrada da vida sempre a mão\nComo o caranguejo que caminha de lado\nA amizade é forte e nunca vai mudar", "Companheiro de todas as horas\nComo o vento que sopra no sertão\nA nossa amizade é como o açaí\nDoce, forte e nunca acaba"]
        },
        funk: {
            amor: ["Ela é tipo açaí com granola\nCombinação perfeita, não tem igual\nQuando ela dança, o mundo para\nE eu fico preso nesse baile de amor\n\nÔ, vem cá, vem cá\nQue eu quero te mostrar o que é bom\nNessa noite de verão\nO nosso amor vai bater o som", "Ela chegou no baile\nTodos os olhos voltaram pra ela\nTipo leite ninho derretendo\nMeu coração tá querendo ela"],
            amizade: ["Meu parceiro de baile\nSempre junto, sempre na mesma vibe\nComo o beat que não para\nA nossa amizade é favela"]
        },
        rap: {
            amor: ["Na quebrada eu cresci, sem nada\nMas teu olhar mudou minha história\nComo o caranguejo que luta pro mar\nEu luto todos os dias pelo teu sorriso\n\nMeu amor é tipo açaí\nDoce na primeira vez, viciante pra sempre\nNesse jogo da vida, você é meu prêmio\nE eu jogo pra ganhar, não pra perder", "Da favela pro mundo inteiro\nMeu amor é como o Rio\nNunca para, nunca acaba\nE eu vou te amar até o fim"],
            amizade: ["Meus brothers da quebrada\nSempre juntos, nunca separados\nComo o batidão que não para\nA nossa amizade é eterna"]
        },
        pop: {
            amor: ["Você é como o sol da manhã\nIlumina tudo que toca\nMeu coração bate mais forte\nQuando você está perto de mim\n\nOh, você é meu universo\nCada estrela brilha por nós\nNessa noite de sonhos\nNosso amor vai além do céu", "Meu amor é como uma onda\nSobe, desce, mas nunca para\nVocê é minha melodia\nE eu sou sua harmonia perfeita"],
            amizade: ["Amigos pra vida inteira\nComo uma canção que não acaba\nCada momento juntos\nÉ um hit que fica na memória"]
        },
        mpb: {
            amor: ["Como a brisa do mar em Natal\nMeu amor por você é natural\nComo a areia branca da praia\nSuave, puro, sem igual\n\nOh, meu bem, vem comigo\nVamos dançar ao som do vento\nNosso amor é como o céu do sertão\nInfinito e sem fim", "Meu amor é como o capim\nCresce forte, não precisa de muito\nBasta um pouco de carinho\nE floresce pra sempre"],
            amizade: ["Amizade é como o rio Poti\nCorre livre, sem pressa\nMas nunca para de fluir\nE alimenta tudo ao redor"]
        },
        gospel: {
            amor: ["Deus abençoou meu caminho\nQuando te colocou na minha vida\nComo a luz que brilha no escuro\nSeu amor ilumina minha alma\n\nOh, Senhor, obrigado\nPor me dar esse presente\nMeu amor é um reflexo\nDo teu amor infinito", "Meu amor vem do céu\nComo a graça que nos alcança\nJuntos caminhamos na fé\nE o amor nos guia sempre"],
            amizade: ["Irmãos em Cristo\nCaminhando juntos na fé\nComo o pastor guia seu rebanho\nNossa amizade é abençoada"]
        }
    };

    document.getElementById('btnGerarLetra')?.addEventListener('click', () => {
        const tema = document.getElementById('letraTema').value.trim().toLowerCase() || 'amor';
        const estilo = document.getElementById('letraEstilo').value;
        const letras = letrasMusicas[estilo]?.[tema] || letrasMusicas[estilo]?.['amor'] || letrasMusicas.sertanejo['amor'];
        const letra = letras[Math.floor(Math.random() * letras.length)];
        const result = document.getElementById('letraResult');
        result.classList.remove('hidden');
        result.innerHTML = `<div class="letra-text"><h4>🎵 ${estilo.charAt(0).toUpperCase() + estilo.slice(1)} — ${tema.charAt(0).toUpperCase() + tema.slice(1)}</h4><pre>${letra}</pre></div>`;
    });

    // ===== CRIAÇÃO: RIMAS =====
    const rimasDB = {
        'amor': ['dor', 'cor', 'flor', 'calor', 'sabor', 'valor', 'humor', 'terror', 'primor', 'fervor'],
        'vida': ['comida', 'decida', 'medida', 'ferida', 'partida', 'subida', 'descida', 'sentida', 'corrida', 'acendida'],
        'coração': ['mão', 'pão', 'chão', 'madrugada não', 'verão', 'limão', 'feijão', 'carnaval', 'irmão', 'verão'],
        'sol': ['farol', 'lençol', 'lençol', 'carrossel', 'papel', 'pincel', 'pastel', 'quintal', 'local', 'cristal'],
        'lua': ['rua', 'nua', 'cua', 'tua', 'flutua', 'atua', 'avalia', 'continua', 'perpetua', 'tua'],
        'noite': ['gente', 'brilhante', 'distante', 'instante', 'importante', 'bastante', 'constante', 'reluzente', 'suave', 'calma'],
        'praia': ['praia', 'alegria', 'fantasia', 'melodia', 'harmonia', 'poesia', 'galeria', 'sinfonia', 'maria', 'alegria'],
        'amigo': ['abrigo', 'consigo', 'antigo', 'contigo', 'inimigo', 'perigo', 'sigo', 'trigo', 'figo', 'abrigo'],
        'fogo': ['fogo', 'logo', 'jogo', 'ago', 'cego', 'cego', 'cego', 'cego', 'cego', 'cego'],
        'flamengo': ['tempo', 'exemplo', 'sempre', 'sempre', 'campo', 'lampada', 'sempre', 'preto', 'preto', 'vermelho'],
        'açaí': ['aqui', 'eu vi', 'ali', 'senti', 'fugiu', 'partiu', 'caiu', 'surgiu', 'seguir', 'sorrir'],
        'tapioca': ['rica', 'bica', 'pica', 'mica', 'rica', 'rica', 'rica', 'rica', 'rica', 'rica'],
    };

    document.getElementById('btnGerarRimas')?.addEventListener('click', () => {
        const palavra = document.getElementById('rimaPalavra').value.trim().toLowerCase();
        const result = document.getElementById('rimasResult');
        
        if (!palavra) {
            result.classList.add('hidden');
            return;
        }

        const rimas = rimasDB[palavra] || gerarRimasGenericas(palavra);
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="rimas-list">
                <h4>🔤 Rimas para "${palavra}":</h4>
                <div class="rimas-tags">
                    ${rimas.map(r => `<span class="rima-tag">${r}</span>`).join('')}
                </div>
                <p class="rimas-dica">💡 Use essas rimas pra criar suas próprias músicas e poemas!</p>
            </div>
        `;
    });

    function gerarRimasGenericas(palavra) {
        const terminacoes = ['ão', 'ar', 'er', 'ir', 'or', 'al', 'el', 'ar', 'ão', 'ez'];
        const rimas = [];
        const sufixos = {
            'ão': ['mão', 'chão', 'pão', 'verão', 'limão', 'feijão', 'irmão', 'sabiá'],
            'ar': ['mar', 'lar', 'cantar', 'dançar', 'sonhar', 'amar', 'brilhar', 'voar'],
            'er': ['poder', 'querer', 'crescer', 'aprender', 'compreender', 'vencer', 'encontro', 'luz'],
            'ir': ['sorrir', 'fugir', 'partir', 'seguir', 'sentir', 'existir', 'resistir', 'sorrir'],
            'or': ['amor', 'calor', 'sabor', 'flor', 'valor', 'humor', 'cor', 'primor'],
            'al': ['festival', 'cristal', 'portal', 'natural', 'brutal', 'sinal', 'animal', 'local'],
            'el': ['papel', 'pastel', 'pincel', 'farol', 'hotel', 'pastel', 'pastel', 'pastel'],
            'ez': ['felicidade', 'beleza', 'pureza', 'natureza', 'tristeza', 'certeza', 'beleza', 'firmeza'],
        };
        const ending = palavra.slice(-2);
        rimas.push(...(sufixos[ending] || sufixos['ão']));
        return rimas.slice(0, 10);
    }

    // ===== CRIAÇÃO: CANTADAS =====
    const cantadas = [
        "Você é açaí? Porque sem você, meu dia não tem graça! 🫐",
        "Se beleza fosse crime, você pegaria prisão perpétua! 😏",
        "Você é tapioca? Porque eu quero te recheear de carinho! 🫓",
        "Seu sorriso é igual Carne de Sol — impossível de resistir! 🥩",
        "Você é o Maracanã? Porque todo mundo quer entrar em você! 😂⚽",
        "Você é caranguejo? Porque me pegou pelas pinças! 🦞",
        "Seu amor é como o açaí — doce, forte e viciante! 🫐",
        "Você é leite Ninho? Porque derreteu meu coração! 🥛",
        "Se você fosse praia, eu seria o mar — sempre perto de você! 🏖️",
        "Você é bolinho de goma? Porque é impossível resistir! 🧆",
        "Seu olhar é como o pôr do sol em Natal — lindo demais! 🌅",
        "Você é cajuzinho? Porque é doce e todo mundo quer um! 🍫",
        "Se fosses uma fruta, seria açaí — porque me dá energia pro dia inteiro! ⚡",
        "Você é como o Flamengo — todo mundo quer, mas poucos conseguem! 🔴⚫",
        "Seu abraço é como a manteiga de garrafa — derrete tudo! 🧈",
    ];

    document.getElementById('btnGerarCantada')?.addEventListener('click', () => {
        const cantada = cantadas[Math.floor(Math.random() * cantadas.length)];
        const result = document.getElementById('cantadaResult');
        result.classList.remove('hidden');
        result.innerHTML = `<div class="cantada-text">${cantada}</div><button class="btn-action btn-cantada-nova" id="btnNovaCantada">😏 Mais Uma!</button>`;
        document.getElementById('btnNovaCantada')?.addEventListener('click', () => {
            const nova = cantadas[Math.floor(Math.random() * cantadas.length)];
            result.innerHTML = `<div class="cantada-text">${nova}</div><button class="btn-action btn-cantada-nova" id="btnNovaCantada">😏 Mais Uma!</button>`;
            document.getElementById('btnNovaCantada')?.addEventListener('click', arguments.callee);
        });
    });

    // ===== CRIAÇÃO: LETRA CURSIVA =====
    document.getElementById('btnGerarCursiva')?.addEventListener('click', () => {
        const texto = document.getElementById('cursivaTexto').value.trim();
        const tamanho = document.getElementById('cursivaTamanho').value;
        
        if (!texto) {
            document.getElementById('cursivaResult').classList.add('hidden');
            return;
        }

        const fontSize = tamanho === 'small' ? '18px' : tamanho === 'medium' ? '28px' : '40px';
        const lineHeight = tamanho === 'small' ? '40px' : tamanho === 'medium' ? '60px' : '80px';
        
        const linhas = texto.split(' ');
        const result = document.getElementById('cursivaResult');
        result.classList.remove('hidden');
        
        let html = '<div class="cursiva-paper">';
        // Create lined paper effect
        const lines = Math.ceil(texto.length / (tamanho === 'small' ? 20 : tamanho === 'medium' ? 12 : 8));
        for (let i = 0; i < Math.max(lines, 5); i++) {
            html += `<div class="cursiva-line" style="height: ${lineHeight}; line-height: ${lineHeight}; font-size: ${fontSize};"></div>`;
        }
        html += '</div>';
        html += `<div class="cursiva-display" style="font-family: 'Brush Script MT', 'Segoe Script', 'Dancing Script', cursive; font-size: ${fontSize}; line-height: ${lineHeight}; padding: 20px; background: #fffef5; border-radius: 12px; border: 2px solid #e8e0d0;">`;
        html += `<p>${texto}</p>`;
        html += '</div>';
        html += `<p class="cursiva-tip">✏️ Pratique escrevendo cada palavra na linha de cima, seguindo o modelo!</p>`;
        
        result.innerHTML = html;
    });

    // ===== IMAGENS =====
    const generatedImages = [];
    const imagePrompt = document.getElementById('imagePrompt');
    const btnGenerateImage = document.getElementById('btnGenerateImage');
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyGallery = document.getElementById('emptyGallery');
    const dropZone = document.getElementById('dropZone');
    const imageUpload = document.getElementById('imageUpload');

    btnGenerateImage.addEventListener('click', () => {
        const prompt = imagePrompt.value.trim();
        if (!prompt) return;
        const size = document.getElementById('imageSize').value;
        const style = document.getElementById('imageStyle').value;
        const [w, h] = size.split('x').map(Number);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        const colors = {
            realistic: ['#667eea', '#764ba2'],
            artistic: ['#f093fb', '#f5576c'],
            cartoon: ['#4facfe', '#00f2fe'],
            pixel: ['#43e97b', '#38f9d7'],
            abstract: ['#fa709a', '#fee140']
        };
        const [c1, c2] = colors[style] || colors.realistic;
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, c1);
        gradient.addColorStop(1, c2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 80 + 20, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `bold ${Math.min(w, h) / 8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Potiguar IA', w / 2, h / 2 - 30);
        ctx.font = `${Math.min(w, h) / 16}px Arial`;
        ctx.fillText(style.charAt(0).toUpperCase() + style.slice(1), w / 2, h / 2 + 20);
        generatedImages.push({ dataUrl: canvas.toDataURL('image/png'), prompt, style, date: new Date() });
        renderGallery();
        imagePrompt.value = '';
    });

    function renderGallery() {
        galleryGrid.innerHTML = '';
        if (generatedImages.length === 0) { emptyGallery.classList.remove('hidden'); return; }
        emptyGallery.classList.add('hidden');
        generatedImages.forEach((img, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${img.dataUrl}" alt="${img.prompt}" title="${img.prompt}">`;
            item.addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = img.dataUrl;
                a.download = `potiguar-ia-${i}.png`;
                a.click();
            });
            galleryGrid.appendChild(item);
        });
    }

    dropZone.addEventListener('click', () => imageUpload.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent)'; });
    dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border)'; });
    dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--border)'; handleImageFiles(e.dataTransfer.files); });
    imageUpload.addEventListener('change', e => handleImageFiles(e.target.files));

    function handleImageFiles(files) {
        Array.from(files).forEach(f => {
            if (!f.type.startsWith('image/')) return;
            const r = new FileReader();
            r.onload = e => {
                generatedImages.push({ dataUrl: e.target.result, prompt: f.name, style: 'upload', date: new Date() });
                renderGallery();
            };
            r.readAsDataURL(f);
        });
    }
    renderGallery();

    // ===== CAMERA =====
    let currentStream = null;
    let facingMode = 'user';
    const cameraVideo = document.getElementById('cameraVideo');
    const cameraCanvas = document.getElementById('cameraCanvas');
    const cameraOverlay = document.getElementById('cameraOverlay');
    const btnStartCamera = document.getElementById('btnStartCamera');
    const btnCapture = document.getElementById('btnCapture');
    const btnSwitchCamera = document.getElementById('btnSwitchCamera');
    const photosGrid = document.getElementById('photosGrid');
    const emptyPhotos = document.getElementById('emptyPhotos');

    btnStartCamera.addEventListener('click', () => currentStream ? stopCamera() : startCamera());

    async function startCamera() {
        try {
            currentStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
            cameraVideo.srcObject = currentStream;
            cameraVideo.classList.remove('hidden');
            cameraOverlay.classList.add('hidden');
            btnCapture.classList.remove('hidden');
            btnSwitchCamera.classList.remove('hidden');
            btnStartCamera.textContent = '⏹ Parar Câmera';
        } catch (err) {
            cameraOverlay.classList.remove('hidden');
            cameraVideo.classList.add('hidden');
        }
    }

    function stopCamera() {
        if (currentStream) { currentStream.getTracks().forEach(t => t.stop()); currentStream = null; }
        cameraVideo.srcObject = null;
        cameraVideo.classList.add('hidden');
        btnCapture.classList.add('hidden');
        btnSwitchCamera.classList.add('hidden');
        btnStartCamera.textContent = '▶ Ligar Câmera';
    }

    btnSwitchCamera.addEventListener('click', () => { facingMode = facingMode === 'user' ? 'environment' : 'user'; if (currentStream) { stopCamera(); startCamera(); } });
    btnCapture.addEventListener('click', () => {
        if (!currentStream) return;
        cameraCanvas.width = cameraVideo.videoWidth;
        cameraCanvas.height = cameraVideo.videoHeight;
        cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0);
        const photo = document.createElement('div');
        photo.className = 'photo-item';
        photo.innerHTML = `<img src="${cameraCanvas.toDataURL('image/png')}" alt="Foto">`;
        photosGrid.appendChild(photo);
        emptyPhotos.classList.add('hidden');
        photosGrid.classList.remove('hidden');
    });

    // Init
    updateSendButton();
});
