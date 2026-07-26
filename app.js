// ===== Nova IA - App JavaScript v3.0 (Fun Edition) =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== PERMISSIONS SCREEN =====
    const permissionsScreen = document.getElementById('permissionsScreen');
    const appContainer = document.getElementById('appContainer');
    const menuToggle = document.getElementById('menuToggle');
    const btnAllowPermissions = document.getElementById('btnAllowPermissions');

    // Check if already accepted
    if (localStorage.getItem('novaia_permissions_accepted') === 'true') {
        permissionsScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
    }

    btnAllowPermissions.addEventListener('click', () => {
        // Save permissions
        const perms = {};
        document.querySelectorAll('.permission-item').forEach(item => {
            const cb = item.querySelector('.perm-checkbox');
            perms[item.dataset.perm] = cb.checked;
        });
        localStorage.setItem('novaia_permissions', JSON.stringify(perms));
        localStorage.setItem('novaia_permissions_accepted', 'true');

        // Animate transition
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
    const sidebarOverlay = document.getElementById('sidebarOverlay');

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

    // ===== CHAT =====
    const messageInput = document.getElementById('messageInput');
    const btnSend = document.getElementById('btnSend');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const chatContainer = document.getElementById('chatContainer');
    const messagesContainer = document.getElementById('messages');
    const typingIndicator = document.getElementById('typingIndicator');

    const funResponses = {
        greetings: {
            patterns: [/ol[áa]/i, /bom (dia|tarde|noite)/i, /oi/i, /hey/i, /hello/i, /eai/i, /e a[íi]/i],
            responses: [
                "Opa! Fala tu! 😄 O que manda hoje?",
                "E aí, beleza? Tô aqui pra te ajudar no que precisar! 🚀",
                "Fala aí! Nova IA na área, pronta pra ação! 💜",
                "Salve! Que bom te ver por aqui! Bora resolver algo? 😎"
            ]
        },
        identity: {
            patterns: [/quem (é|e) voc[eê]/i, /o que voc[eê] (é|e)/i, /seu nome/i, /como te chama/i],
            responses: [
                "Sou a Nova IA, tua parceira de jornada! Chat, código, fotos, bola... eu faço de tudo (menos fazer café ☕😂). Como posso ajudar?",
                "Meu nome é Nova IA! Sou um app completo com chat, editor de código, projetos, imagens, câmera e tutorial de bola. Basicamente, sou a navalha suíça dos apps! 🔥"
            ]
        },
        bola: {
            patterns: [/bola/i, /futebol/i, /jogar/i, /chutar/i, /gol/i, /campo/i, /jogo/i],
            responses: [
                "⚽ Ôpa! Bora falar de bola? Vai na seção **Jogar Bola** no menu lateral que tem um tutorial completo com 6 passos pra você virar craque! Tem quiz também pra testar seus conhecimentos!",
                "Futebol é vida, meu parceiro! Vai na aba **⚽ Jogar Bola** que tem dicas de ouro, curiosidades e um quiz. Bora se tornar o próximo Messi? 😂⚽"
            ]
        },
        programming: {
            patterns: [/programa[cç][aã]o/i, /c[óo]digo/i, /python/i, /javascript/i, /html/i, /css/i, /desenvolv/i],
            responses: [
                "💻 Programação é o futuro, meu parceiro! Vai na aba **Programação** no menu que tem um editor completo de HTML, CSS e JS com preview ao vivo. Tem até 10 exemplos prontos, incluindo um jogo de cobra! 🐍",
                "Bora codar! Na seção **Programação** tem um editor maneiro com preview em tempo real. Clica nos exemplos e vê a mágica acontecer! ✨"
            ]
        },
        projects: {
            patterns: [/projeto/i, /gest[ãa]o/i, /organizar/i, /salvar/i],
            responses: [
                "📁 Na seção **Projetos** você pode criar e guardar suas ideias! Clica em '+ Novo Projeto' e bora organizar tudo. Funciona até offline!"
            ]
        },
        images: {
            patterns: [/imagem/i, /foto/i, /gerar/i, /criar/i, /arte/i, /visual/i],
            responses: [
                "🎨 Vai na seção **Imagens**! Lá você gera imagens com diferentes estilos, faz upload e organiza sua galeria. É tipo um estúdio de arte no bolso!"
            ]
        },
        camera: {
            patterns: [/c[âa]mera/i, /foto/i, /captur/i, /tirar/i],
            responses: [
                "📷 A seção **Câmera** tá te esperando! Liga a câmera e tira fotos direto pelo app. Funciona com a câmera frontal e traseira!"
            ]
        },
        thanks: {
            patterns: [/obrigad/i, /valeu/i, /thanks/i, /agrade[cç]o/i, /brigad/i],
            responses: [
                "De nada, meu parceiro! Tô sempre aqui! Qualquer coisa, é só chamar! 😄✨",
                "Valeu tu! Fico feliz em ajudar! Volta sempre que precisar! 🙌",
                "Tamo junto! Qualquer dúvida, já sabe: Nova IA na área! 💜"
            ]
        },
        funny: {
            patterns: [/piada/i, /engra[cç]ad/i, /rir/i, /humor/i, /comedi/i],
            responses: [
                "Tá bom, vai uma piada de dev: Por que o programador foi ao oftalmologista? Porque ele não conseguia C# (ver) 😂",
                "Piada rápida: O que o zero disse pro oito? 'Belo cinto!' 😂",
                "Lá vai: Por que o JavaScript não vai à praia? Porque ele tem medo de NaN (nadando) 🏖️😂",
                "Uma piada pra você: Qual é o cúmulo da tecnologia? Um celular que não carrega! 😅"
            ]
        },
        help: {
            patterns: [/ajuda/i, /help/i, /como (uso|funciona)/i, /como (posso|fa[cç]o)/i],
            responses: [
                "Claro que te ajudo! Aqui estão as minhas habilidades:\n\n• 💬 **Chat IA** — Converse comigo sobre qualquer coisa\n• ⚽ **Jogar Bola** — Tutorial completo de futebol com quiz\n• 💻 **Programação** — Editor de código HTML/CSS/JS com preview\n• 📁 **Projetos** — Gerencie suas ideias e projetos\n• 🖼️ **Imagens** — Gere e organize imagens\n• 📷 **Câmera** — Tire fotos pelo app\n\nÉ só navegar pelo menu lateral! 🚀"
            ]
        },
        default: [
            "Hmm, interessante! 🤔 Posso te ajudar com chat, código, projetos, imagens, câmera ou até te ensinar a jogar bola! O que te interessa?",
            "Beleza! Tô aqui pra ajudar no que precisar. Quer conversar sobre programação, futebol, projetos ou qualquer outra coisa? 😄",
            "Boa! Pode contar comigo! Se quiser, dá uma olhada nas seções do menu — tem de tudo um pouco. Ou se preferir, me conta mais sobre o que precisa! 💜"
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
            <div class="message-avatar">${type === 'user' ? '😎' : '✦'}</div>
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

    // ===== BOLA / QUIZ =====
    const quizQuestions = [
        { q: "Quem ganhou a Copa do Mundo de 2022?", options: ["Brasil", "França", "Argentina", "Alemanha"], correct: 2 },
        { q: "Quantos jogadores tem cada time em campo?", options: ["9", "10", "11", "12"], correct: 2 },
        { q: "Quanto tempo dura uma partida oficial?", options: ["80 min", "90 min", "100 min", "120 min"], correct: 1 },
        { q: "Qual país tem mais títulos de Copa do Mundo?", options: ["Alemanha", "Argentina", "Brasil", "Itália"], correct: 2 },
        { q: "O que é um 'hat-trick'?", options: ["3 gols no jogo", "3 assistências", "3 defesas", "3 faltas"], correct: 0 },
        { q: "Qual é o tamanho oficial de um campo de futebol?", options: ["90-120m x 45-90m", "100-110m x 64-75m", "80-100m x 50-60m", "150-200m x 100m"], correct: 1 },
        { q: "Quem é conhecido como 'O Fenômeno'?", options: ["Messi", "Cristiano Ronaldo", "Ronaldo Nazário", "Neymar"], correct: 2 },
        { q: "Qual é a punição por mão na bola dentro da área?", options: ["Falta simples", "Pênalti", "Cartão amarelo", "Escanteio"], correct: 1 }
    ];

    let currentQuizIndex = 0;
    const quizQuestionEl = document.getElementById('quizQuestion');
    const quizOptionsEl = document.getElementById('quizOptions');
    const quizResultEl = document.getElementById('quizResult');
    const btnNextQuiz = document.getElementById('btnNextQuiz');

    function loadQuizQuestion() {
        const q = quizQuestions[currentQuizIndex % quizQuestions.length];
        quizQuestionEl.textContent = q.q;
        quizOptionsEl.innerHTML = '';
        quizResultEl.classList.add('hidden');
        btnNextQuiz.classList.add('hidden');

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.dataset.index = i;
            btn.addEventListener('click', () => handleQuizAnswer(i, q.correct));
            quizOptionsEl.appendChild(btn);
        });
    }

    function handleQuizAnswer(selected, correct) {
        const options = quizOptionsEl.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.classList.add('disabled');
            if (parseInt(opt.dataset.index) === correct) opt.classList.add('correct');
            if (parseInt(opt.dataset.index) === selected && selected !== correct) opt.classList.add('wrong');
        });

        quizResultEl.classList.remove('hidden');
        if (selected === correct) {
            quizResultEl.className = 'quiz-result success';
            quizResultEl.textContent = '🎉 Acertou! Mandou bem, craque!';
        } else {
            quizResultEl.className = 'quiz-result fail';
            quizResultEl.textContent = '😅 Errou! Mas faz parte, bora pra próxima!';
        }
        btnNextQuiz.classList.remove('hidden');
    }

    btnNextQuiz.addEventListener('click', () => { currentQuizIndex++; loadQuizQuestion(); });
    loadQuizQuestion();

    // ===== PROGRAMMING =====
    const editorTabs = document.querySelectorAll('.editor-tab');
    const codeEditors = document.querySelectorAll('.code-editor');
    const btnRunCode = document.getElementById('btnRunCode');
    const btnClearCode = document.getElementById('btnClearCode');
    const btnRefreshPreview = document.getElementById('btnRefreshPreview');
    const previewFrame = document.getElementById('previewFrame');
    const consoleOutput = document.getElementById('consoleOutput');

    const codeSnippets = {
        html: {
            basic: `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <title>Olá Mundo</title>\n</head>\n<body>\n    <h1>Olá, Mundo! 🌍</h1>\n    <p>Meu primeiro site maneiro!</p>\n</body>\n</html>`,
            form: `<form id="myForm">\n    <h2>Cadastro</h2>\n    <label>Nome:</label>\n    <input type="text" placeholder="Seu nome" required>\n    <label>Email:</label>\n    <input type="email" placeholder="seu@email.com" required>\n    <label>Mensagem:</label>\n    <textarea placeholder="Sua mensagem..." rows="4"></textarea>\n    <button type="submit">Enviar</button>\n</form>\n<style>\n    body { font-family: Arial; padding: 20px; max-width: 400px; margin: 0 auto; }\n    label { display: block; margin-top: 10px; font-weight: bold; }\n    input, textarea { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }\n    button { margin-top: 16px; padding: 10px 20px; background: #6c5ce7; color: white; border: none; border-radius: 6px; cursor: pointer; }\n</style>`
        },
        css: {
            flexbox: `body { margin: 0; font-family: Arial; background: #f8f9fa; display: flex; justify-content: center; align-items: center; min-height: 100vh; }\n.container { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; padding: 20px; }\n.card { width: 200px; height: 150px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.3s; }\n.card:hover { transform: translateY(-8px); }\n.card:nth-child(1) { background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; }\n.card:nth-child(2) { background: linear-gradient(135deg, #00cec9, #81ecec); color: white; }\n.card:nth-child(3) { background: linear-gradient(135deg, #fd79a8, #fab1a0); color: white; }`,
            animation: `body { margin: 0; height: 100vh; display: flex; justify-content: center; align-items: center; background: #1a1a2e; font-family: Arial; }\n.animated-box { width: 100px; height: 100px; background: linear-gradient(135deg, #6c5ce7, #fd79a8); border-radius: 20px; animation: float 3s ease-in-out infinite, rotate 6s linear infinite; }\n@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }\n@keyframes rotate { 0% { border-radius: 20px; } 50% { border-radius: 50%; } 100% { border-radius: 20px; } }`
        },
        js: {
            fetch: `async function fetchData() {\n    try {\n        const response = await fetch('https://api.github.com/users/github');\n        const data = await response.json();\n        document.getElementById('output').innerHTML = \n            '<h2>' + data.name + '</h2>' +\n            '<p>Seguidores: ' + data.followers + '</p>' +\n            '<p>Repos: ' + data.public_repos + '</p>';\n    } catch (error) {\n        document.getElementById('output').textContent = 'Erro: ' + error.message;\n    }\n}\nfetchData();`,
            dom: `const container = document.createElement('div');\ncontainer.style.cssText = 'text-align:center; padding:40px; font-family:Arial;';\nconst title = document.createElement('h1');\ntitle.textContent = '🎯 Manipulação DOM';\ntitle.style.color = '#6c5ce7';\nconst btn = document.createElement('button');\nbtn.textContent = 'Clique aqui!';\nbtn.style.cssText = 'padding:12px 24px; background:#6c5ce7; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;';\nlet count = 0;\nbtn.onclick = () => { count++; title.textContent = '🎯 Você clicou ' + count + ' vez' + (count > 1 ? 'es' : '') + '!'; };\ncontainer.appendChild(title);\ncontainer.appendChild(btn);\ndocument.body.appendChild(container);`
        },
        full: {
            card: { html: `<div class="card">\n    <div class="card-image">🖼️</div>\n    <div class="card-body">\n        <h3>Título do Card</h3>\n        <p>Descrição do card com informações relevantes.</p>\n        <button class="btn">Saiba mais</button>\n    </div>\n</div>`, css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f0f0f0; font-family: Arial; }\n.card { width: 300px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }\n.card-image { height: 180px; background: linear-gradient(135deg, #6c5ce7, #a29bfe); display: flex; align-items: center; justify-content: center; font-size: 48px; }\n.card-body { padding: 20px; }\n.card-body h3 { margin: 0 0 8px; color: #333; }\n.card-body p { color: #666; font-size: 14px; line-height: 1.5; }\n.btn { margin-top: 12px; padding: 8px 20px; background: #6c5ce7; color: white; border: none; border-radius: 6px; cursor: pointer; }` },
            todo: { html: `<div id="app">\n    <h1>📝 Todo List</h1>\n    <div class="input-group">\n        <input id="taskInput" placeholder="Nova tarefa..." />\n        <button id="addBtn">Adicionar</button>\n    </div>\n    <ul id="taskList"></ul>\n    <p id="counter">0 tarefas</p>\n</div>`, css: `body { font-family: Arial; max-width: 400px; margin: 40px auto; padding: 0 20px; background: #f8f9fa; }\nh1 { color: #6c5ce7; }\n.input-group { display: flex; gap: 8px; margin: 16px 0; }\ninput { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }\nbutton { padding: 10px 16px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; }\nul { list-style: none; padding: 0; }\nli { display: flex; align-items: center; gap: 10px; padding: 10px; background: white; margin: 4px 0; border-radius: 8px; }\nli.done span { text-decoration: line-through; color: #aaa; }\nli .delete { margin-left: auto; color: #ff6b6b; cursor: pointer; }\n#counter { color: #666; font-size: 13px; }`, js: `const input = document.getElementById('taskInput');\nconst addBtn = document.getElementById('addBtn');\nconst taskList = document.getElementById('taskList');\nconst counter = document.getElementById('counter');\nlet tasks = [];\nfunction render() {\n    taskList.innerHTML = '';\n    tasks.forEach((task, i) => {\n        const li = document.createElement('li');\n        li.className = task.done ? 'done' : '';\n        li.innerHTML = '<span>' + task.text + '</span><span class="delete">✕</span>';\n        li.querySelector('span').onclick = () => { tasks[i].done = !tasks[i].done; render(); };\n        li.querySelector('.delete').onclick = () => { tasks.splice(i, 1); render(); };\n        taskList.appendChild(li);\n    });\n    counter.textContent = tasks.length + ' tarefa' + (tasks.length !== 1 ? 's' : '');\n}\naddBtn.onclick = () => { if (input.value.trim()) { tasks.push({ text: input.value.trim(), done: false }); input.value = ''; render(); } };\ninput.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });` },
            calculator: { html: `<div class="calc">\n    <div class="display" id="display">0</div>\n    <div class="buttons">\n        <button class="btn op" onclick="clearDisplay()">C</button>\n        <button class="btn op" onclick="appendOp('%')">%</button>\n        <button class="btn op" onclick="appendOp('/')">÷</button>\n        <button class="btn" onclick="appendNum('7')">7</button>\n        <button class="btn" onclick="appendNum('8')">8</button>\n        <button class="btn" onclick="appendNum('9')">9</button>\n        <button class="btn op" onclick="appendOp('*')">×</button>\n        <button class="btn" onclick="appendNum('4')">4</button>\n        <button class="btn" onclick="appendNum('5')">5</button>\n        <button class="btn" onclick="appendNum('6')">6</button>\n        <button class="btn op" onclick="appendOp('-')">−</button>\n        <button class="btn" onclick="appendNum('1')">1</button>\n        <button class="btn" onclick="appendNum('2')">2</button>\n        <button class="btn" onclick="appendNum('3')">3</button>\n        <button class="btn op" onclick="appendOp('+')">+</button>\n        <button class="btn zero" onclick="appendNum('0')">0</button>\n        <button class="btn" onclick="appendNum('.')">.</button>\n        <button class="btn eq" onclick="calculate()">=</button>\n    </div>\n</div>`, css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #1a1a2e; font-family: Arial; }\n.calc { width: 300px; background: #2d2d44; border-radius: 20px; padding: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }\n.display { background: #1a1a2e; color: white; font-size: 36px; text-align: right; padding: 16px; border-radius: 12px; margin-bottom: 16px; min-height: 60px; }\n.buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }\n.btn { padding: 16px; font-size: 18px; border: none; border-radius: 12px; cursor: pointer; background: #3d3d5c; color: white; transition: 0.2s; }\n.btn:hover { background: #4d4d6c; }\n.btn.op { background: #6c5ce7; }\n.btn.op:hover { background: #7f70f0; }\n.btn.eq { background: #00cec9; }\n.btn.zero { grid-column: span 2; }`, js: `let expression = '';\nconst display = document.getElementById('display');\nfunction appendNum(n) { expression += n; updateDisplay(); }\nfunction appendOp(op) { expression += op; updateDisplay(); }\nfunction clearDisplay() { expression = ''; display.textContent = '0'; }\nfunction updateDisplay() { display.textContent = expression || '0'; }\nfunction calculate() { try { let result = Function('"use strict"; return (' + expression + ')')(); expression = String(result); display.textContent = expression; } catch(e) { display.textContent = 'Erro'; expression = ''; } }` },
            game: { html: `<div class="game-container">\n    <h1>🐍 Snake Game</h1>\n    <canvas id="gameCanvas" width="400" height="400"></canvas>\n    <p>Use as setas do teclado pra jogar!</p>\n    <p id="score">Pontos: 0</p>\n    <button onclick="startGame()">Iniciar / Reiniciar</button>\n</div>`, css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #1a1a2e; font-family: Arial; color: white; }\n.game-container { text-align: center; }\ncanvas { border: 2px solid #6c5ce7; border-radius: 8px; background: #0f0f0f; display: block; margin: 16px auto; }\nbutton { padding: 10px 24px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }\n#score { font-size: 18px; color: #a29bfe; }`, js: `const canvas = document.getElementById('gameCanvas');\nconst ctx = canvas.getContext('2d');\nconst scoreEl = document.getElementById('score');\nconst size = 20;\nlet snake, food, dir, nextDir, gameLoop, score;\nfunction init() { snake = [{x:10,y:10}]; dir={x:1,y:0}; nextDir=dir; score=0; placeFood(); scoreEl.textContent='Pontos: '+score; }\nfunction placeFood() { food = {x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)}; }\nfunction draw() { ctx.fillStyle='#0f0f0f'; ctx.fillRect(0,0,400,400); snake.forEach((s,i)=>{ctx.fillStyle=i===0?'#6c5ce7':'#a29bfe';ctx.fillRect(s.x*size+1,s.y*size+1,size-2,size-2);}); ctx.fillStyle='#ff6b6b'; ctx.fillRect(food.x*size+1,food.y*size+1,size-2,size-2); }\nfunction update() { dir=nextDir; const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y}; if(head.x<0||head.x>=20||head.y<0||head.y>=20||snake.some(s=>s.x===head.x&&s.y===head.y)){clearInterval(gameLoop);alert('Game Over! Pontos: '+score);return;} snake.unshift(head); if(head.x===food.x&&head.y===food.y){score++;scoreEl.textContent='Pontos: '+score;placeFood();}else snake.pop(); draw(); }\ndocument.addEventListener('keydown',e=>{const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};if(map[e.key]&&(map[e.key].x+dir.x!==0||map[e.key].y+dir.y!==0))nextDir=map[e.key];});\nfunction startGame(){clearInterval(gameLoop);init();draw();gameLoop=setInterval(update,120);}\ninit();draw();` }
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

    // ===== PROJECTS =====
    let projects = [];
    const projectsGrid = document.getElementById('projectsGrid');
    const emptyProjects = document.getElementById('emptyProjects');
    const btnAddProject = document.getElementById('btnAddProject');
    const projectModal = document.getElementById('projectModal');
    const projectName = document.getElementById('projectName');
    const projectDesc = document.getElementById('projectDesc');
    const projectTech = document.getElementById('projectTech');
    const projectTags = document.getElementById('projectTags');

    function loadProjects() { const s = localStorage.getItem('novaia_projects'); if(s) projects = JSON.parse(s); renderProjects(); }
    function saveProjects() { localStorage.setItem('novaia_projects', JSON.stringify(projects)); }

    function renderProjects() {
        projectsGrid.innerHTML = '';
        if (projects.length === 0) { emptyProjects.classList.remove('hidden'); projectsGrid.classList.add('hidden'); return; }
        emptyProjects.classList.add('hidden'); projectsGrid.classList.remove('hidden');
        const icons = { html: '🌐', react: '⚛️', python: '🐍', node: '🟢', mobile: '📱', other: '📦' };
        projects.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `<div class="project-card-header"><div class="project-icon">${icons[p.tech]||'📦'}</div><h4>${p.name}</h4></div><p>${p.desc||'Sem descrição'}</p><div class="project-tags">${(p.tags||[]).map(t=>`<span class="project-tag">${t.trim()}</span>`).join('')}<span class="project-tag">${p.tech}</span></div>`;
            card.addEventListener('dblclick', () => { if(confirm('Excluir este projeto?')) { projects.splice(i,1); saveProjects(); renderProjects(); }});
            projectsGrid.appendChild(card);
        });
    }

    btnAddProject.addEventListener('click', () => { projectModal.classList.remove('hidden'); projectName.value=''; projectDesc.value=''; projectTags.value=''; projectName.focus(); });
    document.getElementById('modalClose').addEventListener('click', () => projectModal.classList.add('hidden'));
    document.getElementById('btnCancelProject').addEventListener('click', () => projectModal.classList.add('hidden'));
    document.getElementById('btnSaveProject').addEventListener('click', () => {
        const name = projectName.value.trim(); if(!name) { projectName.style.borderColor='#ff6b6b'; return; }
        projects.push({ name, desc: projectDesc.value.trim(), tech: projectTech.value, tags: projectTags.value.split(',').filter(t=>t.trim()), date: new Date().toISOString() });
        saveProjects(); renderProjects(); projectModal.classList.add('hidden');
    });
    projectModal.addEventListener('click', e => { if(e.target===projectModal) projectModal.classList.add('hidden'); });
    loadProjects();

    // ===== IMAGES =====
    const generatedImages = [];
    const imagePrompt = document.getElementById('imagePrompt');
    const btnGenerateImage = document.getElementById('btnGenerateImage');
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyGallery = document.getElementById('emptyGallery');
    const dropZone = document.getElementById('dropZone');
    const imageUpload = document.getElementById('imageUpload');

    btnGenerateImage.addEventListener('click', () => {
        const prompt = imagePrompt.value.trim(); if(!prompt) return;
        const size = document.getElementById('imageSize').value;
        const style = document.getElementById('imageStyle').value;
        const [w,h] = size.split('x').map(Number);
        const canvas = document.createElement('canvas'); canvas.width=w; canvas.height=h;
        const ctx = canvas.getContext('2d');
        const colors = { realistic:['#667eea','#764ba2'], artistic:['#f093fb','#f5576c'], cartoon:['#4facfe','#00f2fe'], pixel:['#43e97b','#38f9d7'], abstract:['#fa709a','#fee140'] };
        const [c1,c2] = colors[style]||colors.realistic;
        const gradient = ctx.createLinearGradient(0,0,w,h); gradient.addColorStop(0,c1); gradient.addColorStop(1,c2);
        ctx.fillStyle=gradient; ctx.fillRect(0,0,w,h);
        for(let i=0;i<20;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.3})`;ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*80+20,0,Math.PI*2);ctx.fill();}
        ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font=`bold ${Math.min(w,h)/8}px Arial`; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('Nova IA',w/2,h/2-30); ctx.font=`${Math.min(w,h)/16}px Arial`; ctx.fillText(style.charAt(0).toUpperCase()+style.slice(1),w/2,h/2+20);
        generatedImages.push({ dataUrl: canvas.toDataURL('image/png'), prompt, style, date: new Date() });
        renderGallery(); imagePrompt.value='';
    });

    function renderGallery() {
        galleryGrid.innerHTML='';
        if(generatedImages.length===0){emptyGallery.classList.remove('hidden');return;}
        emptyGallery.classList.add('hidden');
        generatedImages.forEach((img,i)=>{const item=document.createElement('div');item.className='gallery-item';item.innerHTML=`<img src="${img.dataUrl}" alt="${img.prompt}" title="${img.prompt}">`;item.addEventListener('click',()=>{const a=document.createElement('a');a.href=img.dataUrl;a.download=`nova-ia-${i}.png`;a.click();});galleryGrid.appendChild(item);});
    }

    dropZone.addEventListener('click', ()=>imageUpload.click());
    dropZone.addEventListener('dragover', e=>{e.preventDefault();dropZone.style.borderColor='var(--accent)';});
    dropZone.addEventListener('dragleave', ()=>{dropZone.style.borderColor='var(--border)';});
    dropZone.addEventListener('drop', e=>{e.preventDefault();dropZone.style.borderColor='var(--border)';handleImageFiles(e.dataTransfer.files);});
    imageUpload.addEventListener('change', e=>handleImageFiles(e.target.files));

    function handleImageFiles(files) { Array.from(files).forEach(f=>{if(!f.type.startsWith('image/'))return;const r=new FileReader();r.onload=e=>{generatedImages.push({dataUrl:e.target.result,prompt:f.name,style:'upload',date:new Date()});renderGallery();};r.readAsDataURL(f);}); }
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
        } catch(err) { cameraOverlay.classList.remove('hidden'); cameraVideo.classList.add('hidden'); }
    }

    function stopCamera() {
        if(currentStream) { currentStream.getTracks().forEach(t=>t.stop()); currentStream=null; }
        cameraVideo.srcObject=null; cameraVideo.classList.add('hidden');
        btnCapture.classList.add('hidden'); btnSwitchCamera.classList.add('hidden');
        btnStartCamera.textContent = '▶ Ligar Câmera';
    }

    btnSwitchCamera.addEventListener('click', () => { facingMode = facingMode==='user'?'environment':'user'; if(currentStream){stopCamera();startCamera();} });
    btnCapture.addEventListener('click', () => {
        if(!currentStream) return;
        cameraCanvas.width=cameraVideo.videoWidth; cameraCanvas.height=cameraVideo.videoHeight;
        cameraCanvas.getContext('2d').drawImage(cameraVideo,0,0);
        const photo=document.createElement('div'); photo.className='photo-item';
        photo.innerHTML=`<img src="${cameraCanvas.toDataURL('image/png')}" alt="Foto">`;
        photosGrid.appendChild(photo); emptyPhotos.classList.add('hidden'); photosGrid.classList.remove('hidden');
    });

    // ===== VIDEO GENERATOR =====
    const videoPrompt = document.getElementById('videoPrompt');
    const btnGenerateVideo = document.getElementById('btnGenerateVideo');
    const videosGrid = document.getElementById('videosGrid');
    const emptyVideos = document.getElementById('emptyVideos');
    const videoPlayerSection = document.getElementById('videoPlayerSection');
    const videoPlayer = document.getElementById('videoPlayer');
    const playerInfo = document.getElementById('playerInfo');
    const videoDropZone = document.getElementById('videoDropZone');
    const videoUpload = document.getElementById('videoUpload');
    let generatedVideos = [];

    // Load saved videos
    try { const sv = localStorage.getItem('novaia_videos'); if(sv) generatedVideos = JSON.parse(sv); renderVideos(); } catch(e) {}

    // Video generation with canvas animation
    function generateVideoCanvas(prompt, duration, style, resolution) {
        const canvas = document.createElement('canvas');
        const dims = { '16:9': [640, 360], '9:16': [360, 640], '1:1': [480, 480] };
        const [w, h] = dims[resolution] || [640, 360];
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        const styleColors = {
            cinematic: [['#0f0c29','#302b63','#24243e'],['stars','nebula','lightRays']],
            anime: [['#ff6b9d','#c44569','#f8b500'],['particles','sparkle','speedLines']],
            realistic: [['#2d3436','#636e72','#b2bec3'],['water','cloud','reflection']],
            cartoon: [['#74b9ff','#a29bfe','#fd79a8'],['bubbles','rainbow','bounce']],
            pixel: [['#00b894','#00cec9','#0984e3'],['pixelWave','grid','glitch']],
            abstract: [['#fdcb6e','#e17055','#d63031'],['morph','kaleidoscope','flow']],
            galaxy: [['#0a0a2e','#1a0533','#2d1b69'],['stars','spiral','glow']],
            ocean: [['#006994','#00b4d8','#90e0ef'],['waves','foam','bubble']],
            city: [['#2d3436','#6c5ce7','#a29bfe'],['buildings','lights','cars']],
            flowers: [['#fd79a8','#e84393','#fab1a0'],['petals','bloom','grow']],
            dragon: [['#2d3436','#d63031','#0984e3'],['fire','flight','mountains']],
            music: [['#6c5ce7','#00cec9','#fd79a8'],['wave','bars','pulse']]
        };

        // Determine effect from prompt
        const lowerPrompt = prompt.toLowerCase();
        let effectKey = style;
        if(lowerPrompt.includes('galax') || lowerPrompt.includes('espaço') || lowerPrompt.includes('estrela')) effectKey = 'galaxy';
        else if(lowerPrompt.includes('mar') || lowerPrompt.includes('onda') || lowerPrompt.includes('praia')) effectKey = 'ocean';
        else if(lowerPrompt.includes('cidade') || lowerPrompt.includes('futurista') || lowerPrompt.includes('prédio')) effectKey = 'city';
        else if(lowerPrompt.includes('flor') || lowerPrompt.includes('desabroch')) effectKey = 'flowers';
        else if(lowerPrompt.includes('drag') || lowerPrompt.includes('fogo')) effectKey = 'dragon';
        else if(lowerPrompt.includes('música') || lowerPrompt.includes('som') || lowerPrompt.includes('onda')) effectKey = 'music';

        const colors = styleColors[effectKey] || styleColors[style] || styleColors.cinematic;
        const effects = colors[1];
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, colors[0][0]); gradient.addColorStop(0.5, colors[0][1]); gradient.addColorStop(1, colors[0][2]);

        let frame = 0;
        const totalFrames = Math.floor(duration * 30);
        const fps = 30;
        const stream = canvas.captureStream(fps);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        const chunks = [];
        recorder.ondataavailable = e => { if(e.data.size > 0) chunks.push(e.data); };

        return new Promise(resolve => {
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const dataUrl = URL.createObjectURL(blob);
                resolve({ dataUrl, blob, prompt, style, duration, resolution });
            };
            recorder.start();

            function drawFrame() {
                const t = frame / totalFrames;
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);

                // Draw animated effects
                effects.forEach(effect => {
                    ctx.save();
                    switch(effect) {
                        case 'stars':
                            for(let i = 0; i < 50; i++) {
                                const x = (Math.sin(i * 7.3 + t * 20) * 0.5 + 0.5) * w;
                                const y = (Math.cos(i * 3.1 + t * 15) * 0.5 + 0.5) * h;
                                const size = Math.sin(t * 10 + i) * 2 + 3;
                                ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(t * 5 + i) * 0.3})`;
                                ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
                            }
                            // Nebula
                            for(let i = 0; i < 5; i++) {
                                const cx = w * (0.3 + 0.4 * Math.sin(t * 3 + i));
                                const cy = h * (0.3 + 0.4 * Math.cos(t * 2 + i));
                                const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80 + Math.sin(t*4)*20);
                                grd.addColorStop(0, `rgba(${100+i*30},${50+i*20},255,0.3)`);
                                grd.addColorStop(1, 'rgba(0,0,0,0)');
                                ctx.fillStyle = grd; ctx.fillRect(0,0,w,h);
                            }
                            break;
                        case 'waves':
                        case 'wave':
                            for(let row = 0; row < 8; row++) {
                                ctx.beginPath();
                                for(let x = 0; x <= w; x += 5) {
                                    const y = h * 0.3 + row * (h*0.08) + Math.sin(x * 0.02 + t * 20 + row) * 20;
                                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                                }
                                ctx.strokeStyle = `rgba(100,200,255,${0.5 - row * 0.05})`;
                                ctx.lineWidth = 3; ctx.stroke();
                            }
                            break;
                        case 'particles':
                        case 'sparkle':
                            for(let i = 0; i < 30; i++) {
                                const x = (Math.sin(i * 5.7 + t * 30) * 0.5 + 0.5) * w;
                                const y = ((i * 0.1 + t * 2) % 1) * h;
                                const size = Math.random() * 4 + 2;
                                ctx.fillStyle = `hsla(${(i * 30 + t * 200) % 360}, 80%, 70%, ${0.6 + Math.sin(t*8+i)*0.3})`;
                                ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
                            }
                            break;
                        case 'speedLines':
                            for(let i = 0; i < 20; i++) {
                                const x1 = Math.random() * w;
                                const y1 = Math.random() * h;
                                ctx.strokeStyle = `rgba(255,255,255,${Math.random()*0.3})`;
                                ctx.lineWidth = Math.random() * 2;
                                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + Math.sin(t*10)*50, y1 + Math.cos(t*10)*50); ctx.stroke();
                            }
                            break;
                        case 'buildings':
                            for(let i = 0; i < 15; i++) {
                                const bw = 20 + Math.sin(i*2.3)*10;
                                const bh = 80 + Math.sin(i*1.7)*60;
                                const bx = i * (w/15);
                                ctx.fillStyle = `rgba(30,30,60,0.8)`;
                                ctx.fillRect(bx, h-bh, bw, bh);
                                // Windows
                                for(let wy = h-bh+10; wy < h-10; wy += 15) {
                                    for(let wx = bx+4; wx < bx+bw-4; wx += 10) {
                                        if(Math.sin(wx*7+wy*3+t*20) > 0) {
                                            ctx.fillStyle = `rgba(253,203,110,${0.5+Math.sin(t*5+wx)*0.3})`;
                                            ctx.fillRect(wx, wy, 6, 8);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'lights':
                        case 'cars':
                            for(let i = 0; i < 8; i++) {
                                const lx = ((t * 100 + i * 80) % (w + 100)) - 50;
                                const ly = h * 0.7 + i * 15;
                                ctx.fillStyle = `hsla(${(i*45+t*60)%360}, 80%, 60%, 0.7)`;
                                ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI*2); ctx.fill();
                                // Light trail
                                ctx.strokeStyle = ctx.fillStyle;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx-30, ly); ctx.stroke();
                            }
                            break;
                        case 'petals':
                        case 'bloom':
                        case 'grow':
                            for(let i = 0; i < 12; i++) {
                                const cx = w/2 + Math.cos(t*5+i)*100;
                                const cy = h/2 + Math.sin(t*4+i)*80;
                                const size = 15 + Math.sin(t*3+i)*10;
                                ctx.fillStyle = `hsla(${300+i*20}, 70%, 65%, 0.6)`;
                                for(let p = 0; p < 5; p++) {
                                    const angle = (p/5)*Math.PI*2 + t*2;
                                    ctx.beginPath();
                                    ctx.ellipse(cx+Math.cos(angle)*size, cy+Math.sin(angle)*size, size*0.4, size*0.2, angle, 0, Math.PI*2);
                                    ctx.fill();
                                }
                            }
                            break;
                        case 'fire':
                        case 'flight':
                            for(let i = 0; i < 25; i++) {
                                const fx = w*0.6 + Math.sin(t*8+i)*60;
                                const fy = h*0.5 - i*8 - Math.sin(t*12)*20;
                                const fs = 8 + Math.sin(t*6+i)*4;
                                const grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, fs);
                                grd.addColorStop(0, `rgba(255,${150-i*5},0,0.8)`);
                                grd.addColorStop(0.5, `rgba(255,${50+i*3},0,0.4)`);
                                grd.addColorStop(1, 'rgba(255,0,0,0)');
                                ctx.fillStyle = grd; ctx.fillRect(fx-fs, fy-fs, fs*2, fs*2);
                            }
                            break;
                        case 'mountains':
                            ctx.fillStyle = 'rgba(20,20,40,0.7)';
                            ctx.beginPath(); ctx.moveTo(0, h);
                            for(let x = 0; x <= w; x += 10) {
                                ctx.lineTo(x, h*0.6 + Math.sin(x*0.01)*40 + Math.sin(x*0.03)*20);
                            }
                            ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
                            // Snow caps
                            ctx.fillStyle = 'rgba(200,220,255,0.3)';
                            ctx.beginPath(); ctx.moveTo(0, h);
                            for(let x = 0; x <= w; x += 10) {
                                const mtY = h*0.6 + Math.sin(x*0.01)*40 + Math.sin(x*0.03)*20;
                                ctx.lineTo(x, mtY + 15);
                            }
                            ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
                            break;
                        case 'bars':
                        case 'pulse':
                            for(let i = 0; i < 20; i++) {
                                const barH = (Math.sin(t*15+i*2)*0.5+0.5) * h * 0.6 + 20;
                                const bx = (i+1) * (w/22);
                                const by = h - barH - 20;
                                const grd = ctx.createLinearGradient(bx, by+barH, bx, by);
                                grd.addColorStop(0, `hsla(${(i*18+t*100)%360},80%,50%,0.8)`);
                                grd.addColorStop(1, `hsla(${(i*18+t*100)%360},80%,80%,0.9)`);
                                ctx.fillStyle = grd;
                                ctx.fillRect(bx, by, w/25, barH);
                            }
                            break;
                        case 'nebula':
                        case 'lightRays':
                            const cx2 = w/2, cy2 = h/2;
                            for(let i = 0; i < 8; i++) {
                                const angle = t * 3 + (i/8) * Math.PI * 2;
                                const len = 150 + Math.sin(t*5+i)*30;
                                ctx.strokeStyle = `rgba(200,180,255,${0.1+Math.sin(t*3+i)*0.05})`;
                                ctx.lineWidth = 20 + Math.sin(t*4+i)*10;
                                ctx.beginPath(); ctx.moveTo(cx2, cy2);
                                ctx.lineTo(cx2+Math.cos(angle)*len, cy2+Math.sin(angle)*len);
                                ctx.stroke();
                            }
                            break;
                        case 'rainbow':
                        case 'bubbles':
                        case 'bounce':
                            for(let i = 0; i < 15; i++) {
                                const bx2 = (Math.sin(i*3+t*8)*0.4+0.5)*w;
                                const by2 = (Math.cos(i*2+t*5)*0.4+0.5)*h;
                                const bs = 15+Math.sin(t*4+i)*8;
                                const grd2 = ctx.createRadialGradient(bx2-bs*0.3, by2-bs*0.3, 0, bx2, by2, bs);
                                grd2.addColorStop(0, `hsla(${(i*24+t*60)%360},80%,70%,0.7)`);
                                grd2.addColorStop(1, `hsla(${(i*24+t*60)%360},80%,70%,0.1)`);
                                ctx.fillStyle = grd2; ctx.beginPath(); ctx.arc(bx2, by2, bs, 0, Math.PI*2); ctx.fill();
                            }
                            break;
                        case 'pixelWave':
                        case 'grid':
                        case 'glitch':
                            const gridSize = 20;
                            for(let gx = 0; gx < w; gx += gridSize) {
                                for(let gy = 0; gy < h; gy += gridSize) {
                                    const v = Math.sin(gx*0.05+t*10)*Math.cos(gy*0.05+t*8);
                                    if(v > 0.3) {
                                        ctx.fillStyle = `hsla(${(v*360+t*100)%360},80%,50%,${v})`;
                                        ctx.fillRect(gx, gy, gridSize-1, gridSize-1);
                                    }
                                }
                            }
                            break;
                        case 'morph':
                        case 'kaleidoscope':
                        case 'flow':
                            for(let i = 0; i < 6; i++) {
                                ctx.save();
                                ctx.translate(w/2, h/2);
                                ctx.rotate(t * 2 + (i/6) * Math.PI * 2);
                                const grd3 = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
                                grd3.addColorStop(0, `hsla(${(i*60+t*120)%360},80%,60%,0.4)`);
                                grd3.addColorStop(1, 'rgba(0,0,0,0)');
                                ctx.fillStyle = grd3;
                                ctx.beginPath(); ctx.ellipse(0, 0, 150, 50, 0, 0, Math.PI*2); ctx.fill();
                                ctx.restore();
                            }
                            break;
                        default:
                            // Default: floating circles
                            for(let i = 0; i < 10; i++) {
                                const cx3 = (Math.sin(t*3+i*2)*0.4+0.5)*w;
                                const cy3 = (Math.cos(t*2+i*3)*0.4+0.5)*h;
                                const cs = 30+Math.sin(t+i)*15;
                                ctx.fillStyle = `rgba(108,92,231,${0.2+Math.sin(t*2+i)*0.1})`;
                                ctx.beginPath(); ctx.arc(cx3, cy3, cs, 0, Math.PI*2); ctx.fill();
                            }
                    }
                    ctx.restore();
                });

                // Center text overlay
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.font = `bold ${Math.min(w,h)/10}px Arial`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10;
                const shortPrompt = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
                ctx.fillText(shortPrompt, w/2, h/2);
                ctx.font = `${Math.min(w,h)/20}px Arial`;
                ctx.fillText(`${style.charAt(0).toUpperCase()+style.slice(1)} • ${t.toFixed(1)}s / ${duration}s`, w/2, h/2 + Math.min(w,h)/8);
                ctx.shadowBlur = 0;

                frame++;
                if(frame < totalFrames) requestAnimationFrame(drawFrame);
                else { recorder.stop(); }
            }
            drawFrame();
        });
    }

    btnGenerateVideo.addEventListener('click', async () => {
        const prompt = videoPrompt.value.trim();
        if(!prompt) { videoPrompt.style.borderColor='#ff6b6b'; setTimeout(()=>videoPrompt.style.borderColor='var(--border)',2000); return; }
        const duration = parseInt(document.getElementById('videoDuration').value);
        const style = document.getElementById('videoStyle').value;
        const resolution = document.getElementById('videoResolution').value;
        const quality = document.getElementById('videoQuality').value;

        // Show loading state
        btnGenerateVideo.disabled = true;
        btnGenerateVideo.textContent = '⏳ Gerando vídeo... Aguarda aí!';

        try {
            const video = await generateVideoCanvas(prompt, duration, style, resolution);
            generatedVideos.push({ ...video, quality, date: new Date().toISOString(), id: Date.now() });
            try { localStorage.setItem('novaia_videos', JSON.stringify(generatedVideos.slice(-20))); } catch(e) {}
            renderVideos();
            videoPrompt.value = '';
        } catch(err) {
            console.error('Erro ao gerar vídeo:', err);
        }

        btnGenerateVideo.disabled = false;
        btnGenerateVideo.textContent = '🎬 Gerar Vídeo';
    });

    function renderVideos() {
        videosGrid.innerHTML = '';
        if(generatedVideos.length === 0) { emptyVideos.classList.remove('hidden'); videosGrid.classList.add('hidden'); return; }
        emptyVideos.classList.add('hidden'); videosGrid.classList.remove('hidden');
        generatedVideos.forEach((v, i) => {
            const item = document.createElement('div');
            item.className = 'video-item';
            item.innerHTML = `
                <video src="${v.dataUrl}" muted preload="metadata"></video>
                <div class="video-item-overlay">
                    <button class="video-play-btn" data-index="${i}">▶</button>
                    <button class="video-download-btn" data-index="${i}" title="Download">⬇️</button>
                </div>
                <div class="video-item-info">
                    <span class="video-item-prompt" title="${v.prompt}">${v.prompt}</span>
                    <span class="video-item-meta">${v.duration}s • ${v.quality} • ${v.style}</span>
                </div>
            `;
            const thumbVideo = item.querySelector('video');
            thumbVideo.addEventListener('loadeddata', () => { thumbVideo.currentTime = 1; });
            item.querySelector('.video-play-btn').addEventListener('click', () => playVideo(i));
            item.querySelector('.video-download-btn').addEventListener('click', () => {
                const a = document.createElement('a'); a.href = v.dataUrl; a.download = `nova-ia-video-${i}.webm`; a.click();
            });
            videosGrid.appendChild(item);
        });
    }

    function playVideo(index) {
        const v = generatedVideos[index];
        if(!v) return;
        videoPlayer.src = v.dataUrl;
        videoPlayerSection.classList.remove('hidden');
        playerInfo.textContent = `${v.prompt} | ${v.duration}s | ${v.quality} | ${v.style}`;
        videoPlayer.play();
        videoPlayerSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Video templates
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            videoPrompt.value = btn.dataset.prompt;
            btnGenerateVideo.click();
        });
    });

    // Video upload
    videoDropZone.addEventListener('click', () => videoUpload.click());
    videoDropZone.addEventListener('dragover', e => { e.preventDefault(); videoDropZone.style.borderColor = 'var(--accent)'; });
    videoDropZone.addEventListener('dragleave', () => { videoDropZone.style.borderColor = 'var(--border)'; });
    videoDropZone.addEventListener('drop', e => { e.preventDefault(); videoDropZone.style.borderColor = 'var(--border)'; handleVideoFiles(e.dataTransfer.files); });
    videoUpload.addEventListener('change', e => handleVideoFiles(e.target.files));

    function handleVideoFiles(files) {
        Array.from(files).forEach(f => {
            if(!f.type.startsWith('video/')) return;
            const dataUrl = URL.createObjectURL(f);
            generatedVideos.push({ dataUrl, prompt: f.name, style: 'upload', duration: Math.round(f.size/1000000), quality: 'original', date: new Date().toISOString(), id: Date.now() });
            renderVideos();
        });
    }

    // Init
    updateSendButton();
});
