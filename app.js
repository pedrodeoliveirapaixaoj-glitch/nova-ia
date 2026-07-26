// ===== Nova IA - App JavaScript v2.0 =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM Elements =====
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Chat elements
    const messageInput = document.getElementById('messageInput');
    const btnSend = document.getElementById('btnSend');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const chatContainer = document.getElementById('chatContainer');
    const messagesContainer = document.getElementById('messages');
    const typingIndicator = document.getElementById('typingIndicator');

    // Programming elements
    const editorTabs = document.querySelectorAll('.editor-tab');
    const codeEditors = document.querySelectorAll('.code-editor');
    const btnRunCode = document.getElementById('btnRunCode');
    const btnClearCode = document.getElementById('btnClearCode');
    const btnRefreshPreview = document.getElementById('btnRefreshPreview');
    const previewFrame = document.getElementById('previewFrame');
    const consoleOutput = document.getElementById('consoleOutput');
    const snippetBtns = document.querySelectorAll('.snippet-btn');

    // Projects elements
    const projectsGrid = document.getElementById('projectsGrid');
    const emptyProjects = document.getElementById('emptyProjects');
    const btnAddProject = document.getElementById('btnAddProject');
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const btnCancelProject = document.getElementById('btnCancelProject');
    const btnSaveProject = document.getElementById('btnSaveProject');
    const projectName = document.getElementById('projectName');
    const projectDesc = document.getElementById('projectDesc');
    const projectTech = document.getElementById('projectTech');
    const projectTags = document.getElementById('projectTags');

    // Images elements
    const imagePrompt = document.getElementById('imagePrompt');
    const btnGenerateImage = document.getElementById('btnGenerateImage');
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyGallery = document.getElementById('emptyGallery');
    const dropZone = document.getElementById('dropZone');
    const imageUpload = document.getElementById('imageUpload');

    // Camera elements
    const cameraVideo = document.getElementById('cameraVideo');
    const cameraCanvas = document.getElementById('cameraCanvas');
    const cameraOverlay = document.getElementById('cameraOverlay');
    const btnStartCamera = document.getElementById('btnStartCamera');
    const btnCapture = document.getElementById('btnCapture');
    const btnSwitchCamera = document.getElementById('btnSwitchCamera');
    const photosGrid = document.getElementById('photosGrid');
    const emptyPhotos = document.getElementById('emptyPhotos');

    let isProcessing = false;
    let projects = [];
    let currentStream = null;
    let facingMode = 'user';

    // ===== NAVIGATION =====
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            switchSection(sectionId);
            closeSidebar();
        });
    });

    function switchSection(sectionId) {
        navBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${sectionId}`).classList.add('active');

        // Stop camera when leaving camera section
        if (sectionId !== 'camera' && currentStream) {
            stopCamera();
        }
    }

    // ===== SIDEBAR TOGGLE =====
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

    menuToggle.addEventListener('click', () => {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    sidebarOverlay.addEventListener('click', closeSidebar);

    // ===== CHAT FUNCTIONALITY =====
    const knowledgeBase = {
        greetings: {
            patterns: [/ol[áa]/i, /bom (dia|tarde|noite)/i, /oi/i, /hey/i, /hello/i, /hi/i, /eai/i],
            responses: [
                "Olá! Sou a Nova IA. Como posso ajudar você hoje?",
                "Oi! Bem-vindo(a)! Estou aqui para ajudar. O que você precisa?",
                "Olá! Que bom te ver aqui. Como posso ser útil?"
            ]
        },
        identity: {
            patterns: [/quem (é|e) voc[eê]/i, /o que voc[eê] (é|e)/i, /seu nome/i, /como te chama/i],
            responses: [
                "Sou a Nova IA, um assistente inteligente com chat, editor de código, gerenciador de projetos, gerador de imagens e câmera! Como posso ajudar?",
                "Meu nome é Nova IA. Sou um app completo de IA com múltiplas funcionalidades: chat inteligente, programação, projetos, imagens e câmera."
            ]
        },
        programming: {
            patterns: [/programa[cç][aã]o/i, /c[óo]digo/i, /python/i, /javascript/i, /html/i, /css/i, /desenvolv/i],
            responses: [
                "Vá até a seção **Programação** no menu lateral! Lá você encontra um editor completo de HTML, CSS e JavaScript com preview em tempo real. Também tem exemplos prontos para você começar!",
                "Programação é incrível! Use a aba **Programação** no menu para editar código e ver o resultado instantaneamente. Quer que eu te ajude com algo específico?"
            ]
        },
        projects: {
            patterns: [/projeto/i, /gest[ãa]o/i, /organizar/i, /salvar/i],
            responses: [
                "Na seção **Projetos** você pode criar e gerenciar seus projetos! Clique em '+ Novo Projeto' para adicionar um novo projeto com nome, descrição, tecnologia e tags."
            ]
        },
        images: {
            patterns: [/imagem/i, /foto/i, /gerar/i, /criar/i, /arte/i, /visual/i],
            responses: [
                "Use a seção **Imagens** no menu! Lá você pode gerar imagens com IA, fazer upload de imagens e organizar sua galeria."
            ]
        },
        camera: {
            patterns: [/c[âa]mera/i, /c[âa]mera/i, /foto/i, /captur/i, /tirar/i],
            responses: [
                "Na seção **Câmera** você pode tirar fotos diretamente pelo app! Clique em 'Iniciar Câmera' e depois em 'Capturar' para salvar suas fotos."
            ]
        },
        thanks: {
            patterns: [/obrigad/i, /valeu/i, /thanks/i, /agrade[cç]o/i],
            responses: [
                "De nada! Estou sempre aqui para ajudar. Se tiver mais alguma dúvida, é só perguntar!",
                "Por nada! Fico feliz em ajudar. Qualquer coisa, estou aqui!"
            ]
        },
        default: [
            "Essa é uma pergunta interessante! Posso ajudar com chat, programação, projetos, imagens e câmera. Quer saber mais sobre alguma funcionalidade?",
            "Entendi! Você pode explorar minhas funcionalidades no menu lateral: Chat IA, Programação, Projetos, Imagens e Câmera. O que te interessa?",
            "Boa pergunta! Vou fazer o meu melhor para ajudar. Quer que eu explique alguma das funcionalidades do Nova IA?"
        ]
    };

    function generateAIResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        for (const [category, data] of Object.entries(knowledgeBase)) {
            if (category === 'default') continue;
            if (data.patterns && data.patterns.some(p => p.test(lowerMsg))) {
                return data.responses[Math.floor(Math.random() * data.responses.length)];
            }
        }
        const defaults = knowledgeBase.default;
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    function getTimeString() {
        return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function createMessageElement(content, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.innerHTML = `
            <div class="message-avatar">${type === 'user' ? '👤' : '✦'}</div>
            <div>
                <div class="message-content">${content.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</div>
                <div class="message-time">${getTimeString()}</div>
            </div>
        `;
        return msg;
    }

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
        }, 800 + Math.random() * 1500);
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function updateSendButton() {
        btnSend.disabled = !messageInput.value.trim() || isProcessing;
    }

    btnSend.addEventListener('click', sendMessage);
    messageInput.addEventListener('input', () => {
        updateSendButton();
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    });
    messageInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            messageInput.value = btn.dataset.prompt;
            updateSendButton();
            sendMessage();
        });
    });

    // ===== PROGRAMMING FUNCTIONALITY =====
    const codeSnippets = {
        html: {
            basic: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Olá Mundo</title>
</head>
<body>
    <h1>Olá, Mundo! 🌍</h1>
    <p>Meu primeiro site com Nova IA</p>
</body>
</html>`,
            form: `<form id="myForm">
    <h2>Cadastro</h2>
    <label>Nome:</label>
    <input type="text" placeholder="Seu nome" required>
    <label>Email:</label>
    <input type="email" placeholder="seu@email.com" required>
    <label>Mensagem:</label>
    <textarea placeholder="Sua mensagem..." rows="4"></textarea>
    <button type="submit">Enviar</button>
</form>
<style>
    body { font-family: Arial; padding: 20px; max-width: 400px; margin: 0 auto; }
    label { display: block; margin-top: 10px; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
    button { margin-top: 16px; padding: 10px 20px; background: #6c5ce7; color: white; border: none; border-radius: 6px; cursor: pointer; }
</style>`
        },
        css: {
            flexbox: `body {
    margin: 0;
    font-family: Arial;
    background: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
.container {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
}
.card {
    width: 200px;
    height: 150px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;
}
.card:hover { transform: translateY(-8px); }
.card:nth-child(1) { background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; }
.card:nth-child(2) { background: linear-gradient(135deg, #00cec9, #81ecec); color: white; }
.card:nth-child(3) { background: linear-gradient(135deg, #fd79a8, #fab1a0); color: white; }`,
            animation: `body {
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1a1a2e;
    font-family: Arial;
}
.animated-box {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #6c5ce7, #fd79a8);
    border-radius: 20px;
    animation: float 3s ease-in-out infinite, rotate 6s linear infinite;
}
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
}
@keyframes rotate {
    0% { border-radius: 20px; }
    50% { border-radius: 50%; }
    100% { border-radius: 20px; }
}`
        },
        js: {
            fetch: `// Fetch API - Buscar dados
async function fetchData() {
    try {
        const response = await fetch('https://api.github.com/users/github');
        const data = await response.json();
        document.getElementById('output').innerHTML = 
            '<h2>' + data.name + '</h2>' +
            '<p>Seguidores: ' + data.followers + '</p>' +
            '<p>Repos: ' + data.public_repos + '</p>';
    } catch (error) {
        document.getElementById('output').textContent = 'Erro: ' + error.message;
    }
}
fetchData();`,
            dom: `// Manipulação do DOM
const container = document.createElement('div');
container.style.cssText = 'text-align:center; padding:40px; font-family:Arial;';

const title = document.createElement('h1');
title.textContent = '🎯 Manipulação DOM';
title.style.color = '#6c5ce7';

const btn = document.createElement('button');
btn.textContent = 'Clique aqui!';
btn.style.cssText = 'padding:12px 24px; background:#6c5ce7; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;';

let count = 0;
btn.onclick = () => {
    count++;
    title.textContent = '🎯 Você clicou ' + count + ' vez' + (count > 1 ? 'es' : '') + '!';
};

container.appendChild(title);
container.appendChild(btn);
document.body.appendChild(container);`
        },
        full: {
            card: {
                html: `<div class="card">
    <div class="card-image">🖼️</div>
    <div class="card-body">
        <h3>Título do Card</h3>
        <p>Descrição do card com informações relevantes sobre o conteúdo.</p>
        <button class="btn">Saiba mais</button>
    </div>
</div>`,
                css: `body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background: #f0f0f0;
    font-family: Arial;
}
.card {
    width: 300px;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.card-image {
    height: 180px;
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
}
.card-body { padding: 20px; }
.card-body h3 { margin: 0 0 8px; color: #333; }
.card-body p { color: #666; font-size: 14px; line-height: 1.5; }
.btn {
    margin-top: 12px;
    padding: 8px 20px;
    background: #6c5ce7;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}`
            },
            todo: {
                html: `<div id="app">
    <h1>📝 Todo List</h1>
    <div class="input-group">
        <input id="taskInput" placeholder="Nova tarefa..." />
        <button id="addBtn">Adicionar</button>
    </div>
    <ul id="taskList"></ul>
    <p id="counter">0 tarefas</p>
</div>`,
                css: `body { font-family: Arial; max-width: 400px; margin: 40px auto; padding: 0 20px; background: #f8f9fa; }
h1 { color: #6c5ce7; }
.input-group { display: flex; gap: 8px; margin: 16px 0; }
input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
button { padding: 10px 16px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; }
ul { list-style: none; padding: 0; }
li { display: flex; align-items: center; gap: 10px; padding: 10px; background: white; margin: 4px 0; border-radius: 8px; }
li.done span { text-decoration: line-through; color: #aaa; }
li .delete { margin-left: auto; color: #ff6b6b; cursor: pointer; }
#counter { color: #666; font-size: 13px; }`,
                js: `const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
let tasks = [];

function render() {
    taskList.innerHTML = '';
    tasks.forEach((task, i) => {
        const li = document.createElement('li');
        li.className = task.done ? 'done' : '';
        li.innerHTML = '<span>' + task.text + '</span><span class="delete">✕</span>';
        li.querySelector('span').onclick = () => { tasks[i].done = !tasks[i].done; render(); };
        li.querySelector('.delete').onclick = () => { tasks.splice(i, 1); render(); };
        taskList.appendChild(li);
    });
    counter.textContent = tasks.length + ' tarefa' + (tasks.length !== 1 ? 's' : '');
}

addBtn.onclick = () => {
    if (input.value.trim()) { tasks.push({ text: input.value.trim(), done: false }); input.value = ''; render(); }
};
input.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });`
            },
            calculator: {
                html: `<div class="calc">
    <div class="display" id="display">0</div>
    <div class="buttons">
        <button class="btn op" onclick="clearDisplay()">C</button>
        <button class="btn op" onclick="appendOp('%')">%</button>
        <button class="btn op" onclick="appendOp('/')">÷</button>
        <button class="btn" onclick="appendNum('7')">7</button>
        <button class="btn" onclick="appendNum('8')">8</button>
        <button class="btn" onclick="appendNum('9')">9</button>
        <button class="btn op" onclick="appendOp('*')">×</button>
        <button class="btn" onclick="appendNum('4')">4</button>
        <button class="btn" onclick="appendNum('5')">5</button>
        <button class="btn" onclick="appendNum('6')">6</button>
        <button class="btn op" onclick="appendOp('-')">−</button>
        <button class="btn" onclick="appendNum('1')">1</button>
        <button class="btn" onclick="appendNum('2')">2</button>
        <button class="btn" onclick="appendNum('3')">3</button>
        <button class="btn op" onclick="appendOp('+')">+</button>
        <button class="btn zero" onclick="appendNum('0')">0</button>
        <button class="btn" onclick="appendNum('.')">.</button>
        <button class="btn eq" onclick="calculate()">=</button>
    </div>
</div>`,
                css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #1a1a2e; font-family: Arial; }
.calc { width: 300px; background: #2d2d44; border-radius: 20px; padding: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
.display { background: #1a1a2e; color: white; font-size: 36px; text-align: right; padding: 16px; border-radius: 12px; margin-bottom: 16px; min-height: 60px; }
.buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.btn { padding: 16px; font-size: 18px; border: none; border-radius: 12px; cursor: pointer; background: #3d3d5c; color: white; transition: 0.2s; }
.btn:hover { background: #4d4d6c; }
.btn.op { background: #6c5ce7; }
.btn.op:hover { background: #7f70f0; }
.btn.eq { background: #00cec9; grid-column: span 1; }
.btn.eq:hover { background: #00e6e0; }
.btn.zero { grid-column: span 2; }`,
                js: `let expression = '';
const display = document.getElementById('display');

function appendNum(n) { expression += n; updateDisplay(); }
function appendOp(op) { expression += op; updateDisplay(); }
function clearDisplay() { expression = ''; display.textContent = '0'; }
function updateDisplay() { display.textContent = expression || '0'; }

function calculate() {
    try {
        let result = Function('"use strict"; return (' + expression + ')')();
        expression = String(result);
        display.textContent = expression;
    } catch(e) { display.textContent = 'Erro'; expression = ''; }
}`
            },
            game: {
                html: `<div class="game-container">
    <h1>🐍 Snake Game</h1>
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    <p>Use as setas do teclado para jogar!</p>
    <p id="score">Pontos: 0</p>
    <button onclick="startGame()">Iniciar / Reiniciar</button>
</div>`,
                css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #1a1a2e; font-family: Arial; color: white; }
.game-container { text-align: center; }
canvas { border: 2px solid #6c5ce7; border-radius: 8px; background: #0f0f0f; display: block; margin: 16px auto; }
button { padding: 10px 24px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
#score { font-size: 18px; color: #a29bfe; }`,
                js: `const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const size = 20;
let snake, food, dir, nextDir, gameLoop, score;

function init() {
    snake = [{x: 10, y: 10}];
    dir = {x: 1, y: 0};
    nextDir = dir;
    score = 0;
    placeFood();
    scoreEl.textContent = 'Pontos: ' + score;
}

function placeFood() {
    food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
}

function draw() {
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, 400, 400);
    // Snake
    snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#6c5ce7' : '#a29bfe';
        ctx.fillRect(seg.x*size+1, seg.y*size+1, size-2, size-2);
    });
    // Food
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(food.x*size+1, food.y*size+1, size-2, size-2);
}

function update() {
    dir = nextDir;
    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.some(s => s.x === head.x && s.y === head.y)) {
        clearInterval(gameLoop);
        alert('Game Over! Pontos: ' + score);
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) { score++; scoreEl.textContent = 'Pontos: ' + score; placeFood(); }
    else snake.pop();
    draw();
}

document.addEventListener('keydown', e => {
    const map = {ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
    if (map[e.key] && (map[e.key].x + dir.x !== 0 || map[e.key].y + dir.y !== 0)) nextDir = map[e.key];
});

function startGame() { clearInterval(gameLoop); init(); draw(); gameLoop = setInterval(update, 120); }
init(); draw();`
            }
        }
    };

    // Editor Tabs
    editorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            editorTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            codeEditors.forEach(e => e.classList.remove('active'));
            document.getElementById(`editor-${tab.dataset.tab}`).classList.add('active');
        });
    });

    // Run Code
    function runCode() {
        const html = document.getElementById('editor-html').value;
        const css = document.getElementById('editor-css').value;
        const js = document.getElementById('editor-js').value;

        const fullCode = `
            <!DOCTYPE html>
            <html><head><meta charset="UTF-8"><style>${css}</style></head>
            <body>${html}
            <script>
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                console.log = function(...args) {
                    originalLog(...args);
                    window.parent.postMessage({type:'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}, '*');
                };
                console.error = function(...args) {
                    originalError(...args);
                    window.parent.postMessage({type:'error', text: args.map(a => String(a)).join(' ')}, '*');
                };
                console.warn = function(...args) {
                    originalWarn(...args);
                    window.parent.postMessage({type:'warn', text: args.map(a => String(a)).join(' ')}, '*');
                };
                try { ${js} } catch(e) { console.error(e.message); }
            <\/script>
            </body></html>
        `;

        const blob = new Blob([fullCode], { type: 'text/html' });
        previewFrame.src = URL.createObjectURL(blob);
        consoleOutput.innerHTML = '';
    }

    btnRunCode.addEventListener('click', runCode);
    btnRefreshPreview.addEventListener('click', runCode);
    btnClearCode.addEventListener('click', () => {
        codeEditors.forEach(e => e.value = '');
        previewFrame.src = 'about:blank';
        consoleOutput.innerHTML = '';
    });

    // Console messages from iframe
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type) {
            const div = document.createElement('div');
            div.className = 'log-' + e.data.type;
            div.textContent = '> ' + e.data.text;
            consoleOutput.appendChild(div);
        }
    });

    // Snippet buttons
    snippetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const code = btn.dataset.code;
            const snippet = codeSnippets[type] && codeSnippets[type][code];

            if (!snippet) return;

            if (type === 'full') {
                // Full project with HTML + CSS + JS
                if (snippet.html) document.getElementById('editor-html').value = snippet.html;
                if (snippet.css) document.getElementById('editor-css').value = snippet.css;
                if (snippet.js) document.getElementById('editor-js').value = snippet.js;
            } else {
                // Single file snippet
                if (type === 'html') document.getElementById('editor-html').value = snippet;
                if (type === 'css') document.getElementById('editor-css').value = snippet;
                if (type === 'js') document.getElementById('editor-js').value = snippet;
            }

            // Switch to the right tab
            editorTabs.forEach(t => t.classList.remove('active'));
            codeEditors.forEach(e => e.classList.remove('active'));
            const targetTab = document.querySelector(`[data-tab="${type === 'full' ? 'html' : type}"]`);
            if (targetTab) targetTab.classList.add('active');
            const targetEditor = document.getElementById(`editor-${type === 'full' ? 'html' : type}`);
            if (targetEditor) targetEditor.classList.add('active');

            runCode();
        });
    });

    // ===== PROJECTS FUNCTIONALITY =====
    function loadProjects() {
        const saved = localStorage.getItem('novaia_projects');
        if (saved) projects = JSON.parse(saved);
        renderProjects();
    }

    function saveProjects() {
        localStorage.setItem('novaia_projects', JSON.stringify(projects));
    }

    function renderProjects() {
        projectsGrid.innerHTML = '';
        if (projects.length === 0) {
            emptyProjects.classList.remove('hidden');
            projectsGrid.classList.add('hidden');
        } else {
            emptyProjects.classList.add('hidden');
            projectsGrid.classList.remove('hidden');
            projects.forEach((project, index) => {
                const card = document.createElement('div');
                card.className = 'project-card';
                const techIcons = { html: '🌐', react: '⚛️', python: '🐍', node: '🟢', mobile: '📱', other: '📦' };
                card.innerHTML = `
                    <div class="project-card-header">
                        <div class="project-icon">${techIcons[project.tech] || '📦'}</div>
                        <h4>${project.name}</h4>
                    </div>
                    <p>${project.desc || 'Sem descrição'}</p>
                    <div class="project-tags">
                        ${(project.tags || []).map(t => `<span class="project-tag">${t.trim()}</span>`).join('')}
                        <span class="project-tag">${project.tech}</span>
                    </div>
                `;
                card.addEventListener('dblclick', () => deleteProject(index));
                projectsGrid.appendChild(card);
            });
        }
    }

    function deleteProject(index) {
        if (confirm('Deseja excluir este projeto?')) {
            projects.splice(index, 1);
            saveProjects();
            renderProjects();
        }
    }

    function openProjectModal() {
        projectModal.classList.remove('hidden');
        projectName.value = '';
        projectDesc.value = '';
        projectTech.value = 'html';
        projectTags.value = '';
        projectName.focus();
    }

    function closeProjectModal() {
        projectModal.classList.add('hidden');
    }

    btnSaveProject.addEventListener('click', () => {
        const name = projectName.value.trim();
        if (!name) { projectName.style.borderColor = '#ff6b6b'; return; }
        projects.push({
            name: name,
            desc: projectDesc.value.trim(),
            tech: projectTech.value,
            tags: projectTags.value.split(',').filter(t => t.trim()),
            date: new Date().toISOString()
        });
        saveProjects();
        renderProjects();
        closeProjectModal();
    });

    btnAddProject.addEventListener('click', openProjectModal);
    modalClose.addEventListener('click', closeProjectModal);
    btnCancelProject.addEventListener('click', closeProjectModal);
    projectModal.addEventListener('click', e => { if (e.target === projectModal) closeProjectModal(); });

    loadProjects();

    // ===== IMAGES FUNCTIONALITY =====
    const generatedImages = [];

    btnGenerateImage.addEventListener('click', () => {
        const prompt = imagePrompt.value.trim();
        if (!prompt) return;

        const size = document.getElementById('imageSize').value;
        const style = document.getElementById('imageStyle').value;
        const [w, h] = size.split('x').map(Number);

        // Generate a canvas-based image as placeholder
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        // Create gradient background based on style
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

        // Add decorative shapes
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 80 + 20;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add text
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `bold ${Math.min(w, h) / 8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Nova IA', w / 2, h / 2 - 30);
        ctx.font = `${Math.min(w, h) / 16}px Arial`;
        ctx.fillText(style.charAt(0).toUpperCase() + style.slice(1), w / 2, h / 2 + 20);

        const dataUrl = canvas.toDataURL('image/png');
        generatedImages.push({ dataUrl, prompt, style, date: new Date() });
        renderGallery();
        imagePrompt.value = '';
    });

    function renderGallery() {
        galleryGrid.innerHTML = '';
        if (generatedImages.length === 0) {
            emptyGallery.classList.remove('hidden');
        } else {
            emptyGallery.classList.add('hidden');
            generatedImages.forEach((img, i) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${img.dataUrl}" alt="${img.prompt}" title="${img.prompt}">`;
                item.addEventListener('click', () => {
                    const a = document.createElement('a');
                    a.href = img.dataUrl;
                    a.download = `nova-ia-${i}.png`;
                    a.click();
                });
                galleryGrid.appendChild(item);
            });
        }
    }

    // Image Upload
    dropZone.addEventListener('click', () => imageUpload.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent)'; });
    dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border)'; });
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border)';
        handleImageFiles(e.dataTransfer.files);
    });
    imageUpload.addEventListener('change', e => handleImageFiles(e.target.files));

    function handleImageFiles(files) {
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                generatedImages.push({ dataUrl: e.target.result, prompt: file.name, style: 'upload', date: new Date() });
                renderGallery();
            };
            reader.readAsDataURL(file);
        });
    }

    renderGallery();

    // ===== CAMERA FUNCTIONALITY =====
    btnStartCamera.addEventListener('click', () => {
        if (currentStream) {
            stopCamera();
        } else {
            startCamera();
        }
    });

    async function startCamera() {
        try {
            const constraints = { video: { facingMode: facingMode }, audio: false };
            currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraVideo.srcObject = currentStream;
            cameraVideo.classList.remove('hidden');
            cameraOverlay.classList.add('hidden');
            btnCapture.classList.remove('hidden');
            btnSwitchCamera.classList.remove('hidden');
            btnStartCamera.textContent = '⏹ Parar Câmera';
        } catch (err) {
            cameraOverlay.classList.remove('hidden');
            cameraVideo.classList.add('hidden');
            console.error('Camera error:', err);
        }
    }

    function stopCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(t => t.stop());
            currentStream = null;
        }
        cameraVideo.srcObject = null;
        cameraVideo.classList.add('hidden');
        btnCapture.classList.add('hidden');
        btnSwitchCamera.classList.add('hidden');
        btnStartCamera.textContent = '▶ Iniciar Câmera';
    }

    btnSwitchCamera.addEventListener('click', () => {
        facingMode = facingMode === 'user' ? 'environment' : 'user';
        if (currentStream) {
            stopCamera();
            startCamera();
        }
    });

    btnCapture.addEventListener('click', () => {
        if (!currentStream) return;
        const canvas = cameraCanvas;
        canvas.width = cameraVideo.videoWidth;
        canvas.height = cameraVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cameraVideo, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');

        const photo = document.createElement('div');
        photo.className = 'photo-item';
        photo.innerHTML = `<img src="${dataUrl}" alt="Foto capturada">`;
        photosGrid.appendChild(photo);
        emptyPhotos.classList.add('hidden');
        photosGrid.classList.remove('hidden');
    });

    // Initialize
    updateSendButton();
});
