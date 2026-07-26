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

    // Init
    updateSendButton();
});
