// ===== Nova IA - App JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const messageInput = document.getElementById('messageInput');
    const btnSend = document.getElementById('btnSend');
    const btnNewChat = document.getElementById('btnNewChat');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const chatContainer = document.getElementById('chatContainer');
    const messagesContainer = document.getElementById('messages');
    const typingIndicator = document.getElementById('typingIndicator');
    const chatHistory = document.getElementById('chatHistory');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const inputArea = document.getElementById('inputArea');

    let currentChat = null;
    let chats = [];
    let isProcessing = false;

    // ===== Knowledge Base for AI Responses =====
    const knowledgeBase = {
        greetings: {
            patterns: [/ol[áa]/i, /bom (dia|tarde|noite)/i, /oi/i, /hey/i, /eai/i, /e a[íi]/i, /hello/i, /hi/i],
            responses: [
                "Olá! Sou a Nova IA. Como posso ajudar você hoje?",
                "Oi! Bem-vindo(a)! Estou aqui para ajudar. O que você precisa?",
                "Olá! Que bom te ver aqui. Como posso ser útil?"
            ]
        },
        identity: {
            patterns: [/quem (é|e) voc[eê]/i, /o que voc[eê] (é|e)/i, /seu nome/i, /como te chama/i, /voc[eê] é (quem|o que)/i],
            responses: [
                "Sou a Nova IA, um assistente inteligente projetado para ajudar com perguntas, ideias, textos, código e muito mais. Fui criada para ser útil, rápida e intuitiva. Como posso ajudar?",
                "Meu nome é Nova IA. Sou um modelo de inteligência artificial desenvolvido para ser seu assistente pessoal. Posso ajudar com informações, textos, programação, criatividade e muito mais!"
            ]
        },
        capabilities: {
            patterns: [/o que voc[eê] (faz|pode fazer)/i, /suas (habilidades|capacidades)/i, /como (posso usar|utilizar)/i, /o que voc[eê] sabe/i],
            responses: [
                "Posso ajudar com diversas tarefas:\n\n• 💬 Responder perguntas sobre qualquer tema\n• ✍️ Escrever e revisar textos\n• 💻 Ajuda com programação e código\n• 📊 Explicar conceitos complexos\n• 🧠 Brainstorming e ideias criativas\n• 📝 Resumir informações\n• 🌐 Traduzir entre idiomas\n\nÉ só perguntar!"
            ]
        },
        programming: {
            patterns: [/programa[cç][aã]o/i, /c[óo]digo/i, /python/i, /javascript/i, /desenvolv/i, /software/i, /algoritmo/i],
            responses: [
                "Programação é fascinante! Aqui vão algumas dicas:\n\n• Comece com uma linguagem simples como Python\n• Pratique todos os dias, mesmo que pouco\n• Resolva problemas em sites como CodeWars ou LeetCode\n• Leia código de outras pessoas\n• Não tenha medo de errar — bugs fazem parte do processo!\n\nQuer ajuda com algo específico em programação?",
                "Ótimo interesse em programação! As linguagens mais populares hoje são Python, JavaScript e TypeScript. Para iniciantes, recomendo Python pela sintaxe simples. Para web, JavaScript é essencial. Quer que eu explique algum conceito específico?"
            ]
        },
        ai: {
            patterns: [/intelig[eê]ncia artificial/i, /o que é ia/i, /machine learning/i, /deep learning/i, /redes neurais/i, /ia/i],
            responses: [
                "Inteligência Artificial (IA) é o campo da ciência da computação que busca criar sistemas capazes de realizar tarefas que normalmente requerem inteligência humana. Isso inclui:\n\n• Aprendizado de máquina (Machine Learning)\n• Processamento de linguagem natural\n• Visão computacional\n• Sistemas de recomendação\n\nA IA está transformando setores como saúde, educação, finanças e muito mais. Quer saber mais sobre algum aspecto específico?",
                "A Inteligência Artificial é um campo amplo que engloba diversas tecnologias. Modelos como eu (LLMs) são treinados com grandes volumes de texto para entender e gerar linguagem natural. Outros tipos incluem IA generativa para imagens, modelos de visão e sistemas autônomos. É um campo em rápida evolução!"
            ]
        },
        email: {
            patterns: [/e-?mail/i, /email/i, /carta/i, /mensagen/i, /comunica[cç][aã]o/i, /profissional/i],
            responses: [
                "Claro! Para escrever um e-mail profissional, siga esta estrutura:\n\n1. Assunto claro e objetivo\n2. Saudação adequada (Prezado/a [Nome])\n3. Contexto breve na primeira linha\n4. Corpo do e-mail — seja direto e objetivo\n5. Call to action (o que você espera do destinatário)\n6. Fechamento cordial (Atenciosamente / Cordialmente)\n7. Assinatura com seus dados\n\nDica: mantenha parágrafos curtos e evite jargões desnecessários. Quer que eu escreva um modelo específico?"
            ]
        },
        productivity: {
            patterns: [/produtiv/i, /produti/i, /foco/i, /concentra[cç][aã]o/i, /gest[ãa]o do tempo/i, /h[áa]bitos/i],
            responses: [
                "Dicas para ser mais produtivo:\n\n• 🎯 Técnica Pomodoro: 25 min de foco + 5 min de pausa\n• 📋 Método GTD: capture, processe e organize tarefas\n• 🚫 Elimine distrações: desative notificações durante trabalho focado\n• ⏰ Blocos de tempo: reserve horários específicos para cada tipo de tarefa\n• 💪 Comece pelo mais difícil: faça as tarefas mais importantes primeiro\n• 🛌 Cuide do sono: 7-8 horas por noite fazem diferença enorme\n• 🏃 Exercício regular melhora cognição e energia\n\nQual dessas técnicas gostaria de explorar mais?"
            ]
        },
        study: {
            patterns: [/estudar/i, /plano de estudo/i, /aprend/i, /curso/i, /faculdade/i, /educa[cç][aã]o/i],
            responses: [
                "Vou te ajudar com um plano de estudos! Aqui está uma estrutura eficiente:\n\n📚 Plano de Estudos Semanal:\n\nSegunda: Conceitos teóricos (leitura + anotações)\nTerça: Prática aplicada (exercícios)\nQuarta: Revisão espaçada do conteúdo\nQuinta: Projetos práticos\nSexta: Simulados e autoavaliação\nSábado: Exploração de temas complementares\nDomingo: Descanso e planejamento da próxima semana\n\n💡 Dicas:\n• Estude em blocos de 45-90 minutos\n• Faça pausas regulares\n• Use flashcards para memorização\n• Ensine o que aprendeu para consolidar\n\nQuer um plano mais específico para alguma área?"
            ]
        },
        thanks: {
            patterns: [/obrigad/i, /valeu/i, /thanks/i, /agrade[cç]o/i],
            responses: [
                "De nada! Estou sempre aqui para ajudar. Se tiver mais alguma dúvida, é só perguntar! 😊",
                "Por nada! Fico feliz em ajudar. Qualquer coisa, estou aqui!"
            ]
        },
        farewell: {
            patterns: [/tchau/i, /at[eé] (logo|mais|logo)/i, /bye/i, /flw/i, /falou/i],
            responses: [
                "Até logo! Foi bom conversar com você. Volte sempre que precisar! 👋",
                "Tchau! Espero ter sido útil. Qualquer dúvida no futuro, estarei aqui!"
            ]
        },
        weather: {
            patterns: [/tempo/i, /clima/i, /previs[ãa]o/i, /chuva/i, /sol/i],
            responses: [
                "Para verificar a previsão do tempo, recomendo usar apps como Climatempo, AccuWeather ou a previsão do Google. Infelizmente não tenho acesso a dados em tempo real, mas posso te ajudar com outras informações! 🌤️"
            ]
        },
        math: {
            patterns: [/matem[aá]tica/i, /c[áa]lculo/i, /equa[cç][ãa]o/i, /n[úu]mero/i, /conta/i, /soma/i, /divis[ãa]o/i],
            responses: [
                "Matemática é a base de muitas áreas! Posso ajudar com explicações de conceitos como álgebra, geometria, estatística, cálculo e mais. Me diga qual tópico específico te interessa e posso explicar de forma clara e didática!"
            ]
        },
        health: {
            patterns: [/sa[úu]de/i, /exerc[íi]cio/i, /dieta/i, /alimenta[cç][aã]o/i, /bem-estar/i, /fitness/i],
            responses: [
                "Saúde e bem-estar são fundamentais! Aqui vão algumas recomendações gerais:\n\n• 💧 Hidrate-se: beba pelo menos 2L de água por dia\n• 🥗 Alimentação balanceada com vegetais, proteínas e carboidratos\n• 🏋️ Exercício regular (150 min/semana de atividade moderada)\n• 😴 Sono de qualidade (7-8 horas)\n• 🧘 Pratique mindfulness ou meditação para reduzir estresse\n\n⚠️ Importante: Para questões específicas de saúde, consulte sempre um profissional médico."
            ]
        },
        creative: {
            patterns: [/criativ/i, /criar/i, /ideia/i, /brainstorm/i, /imagin/i, /arte/i, /escrever/i, /hist[óo]ria/i],
            responses: [
                "Adoro criatividade! Posso ajudar com:\n\n• ✍️ Escrita criativa (contos, poesias, roteiros)\n• 🎨 Brainstorming de ideias para projetos\n• 📝 Revisão e aprimoramento de textos\n• 💡 Geração de conceitos e nomes\n• 🎭 Desenvolvimento de personagens e narrativas\n\nMe diga o que você quer criar e vamos juntos!"
            ]
        },
        default: [
            "Essa é uma pergunta interessante! Vou tentar ajudar da melhor forma. Pode me dar mais detalhes sobre o que você precisa?",
            "Entendi! Deixe-me pensar sobre isso. Você poderia me explicar um pouco mais o contexto para que eu possa dar uma resposta mais precisa?",
            "Boa pergunta! Embora eu tenha conhecimento em diversas áreas, posso precisar de mais contexto. O que exatamente você gostaria de saber?",
            "Vou fazer o meu melhor para ajudar! Me conte mais sobre o que você está procurando e eu farei o possível para fornecer uma resposta útil.",
            "Interessante! Para te ajudar melhor, poderia detalhar um pouco mais sua pergunta? Assim consigo direcionar minha resposta de forma mais precisa."
        ]
    };

    // ===== Core Functions =====

    function getTimeString() {
        const now = new Date();
        return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function generateAIResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        
        // Check each category
        for (const [category, data] of Object.entries(knowledgeBase)) {
            if (category === 'default') continue;
            
            if (data.patterns && Array.isArray(data.patterns)) {
                const matched = data.patterns.some(pattern => pattern.test(lowerMsg));
                if (matched) {
                    const responses = data.responses || [data];
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }

        // Return default response
        const defaults = knowledgeBase.default;
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    function createMessageElement(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'user' ? '👤' : '✦';

        const contentWrapper = document.createElement('div');
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Handle line breaks
        messageContent.innerHTML = content.replace(/\n/g, '<br>');
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = getTimeString();

        contentWrapper.appendChild(messageContent);
        contentWrapper.appendChild(time);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentWrapper);

        return messageDiv;
    }

    function showWelcome() {
        welcomeScreen.classList.remove('hidden');
        chatContainer.classList.add('hidden');
    }

    function showChat() {
        welcomeScreen.classList.add('hidden');
        chatContainer.classList.remove('hidden');
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text || isProcessing) return;

        isProcessing = true;
        btnSend.disabled = true;

        // Show chat view
        showChat();

        // Add user message
        const userMessage = createMessageElement(text, 'user');
        messagesContainer.appendChild(userMessage);

        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Show typing indicator
        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        // Save chat
        saveChat(text);

        // Simulate AI response delay
        const delay = 1000 + Math.random() * 2000;
        setTimeout(() => {
            const aiResponse = generateAIResponse(text);
            typingIndicator.classList.add('hidden');

            const aiMessage = createMessageElement(aiResponse, 'ai');
            messagesContainer.appendChild(aiMessage);
            scrollToBottom();

            isProcessing = false;
            updateSendButton();
        }, delay);
    }

    function updateSendButton() {
        const hasText = messageInput.value.trim().length > 0;
        btnSend.disabled = !hasText || isProcessing;
    }

    function newChat() {
        currentChat = null;
        messagesContainer.innerHTML = '';
        showWelcome();
        updateSendButton();
        closeSidebar();
    }

    function saveChat(firstMessage) {
        const title = firstMessage.substring(0, 40) + (firstMessage.length > 40 ? '...' : '');
        const chat = {
            id: Date.now(),
            title: title,
            date: new Date(),
            messages: [{ content: firstMessage, type: 'user' }]
        };
        chats.unshift(chat);
        updateChatHistory();
    }

    function updateChatHistory() {
        chatHistory.innerHTML = '';
        chats.forEach((chat, index) => {
            const item = document.createElement('div');
            item.className = 'chat-history-item';
            if (index === 0) item.classList.add('active');
            item.textContent = chat.title;
            item.addEventListener('click', () => loadChat(chat.id));
            chatHistory.appendChild(item);
        });
    }

    function loadChat(chatId) {
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
            currentChat = chat;
            messagesContainer.innerHTML = '';
            chat.messages.forEach(msg => {
                const msgElement = createMessageElement(msg.content, msg.type);
                messagesContainer.appendChild(msgElement);
            });
            showChat();
            scrollToBottom();
            closeSidebar();
        }
    }

    // Sidebar toggle for mobile
    function openSidebar() {
        sidebar.classList.add('open');
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay active';
        overlay.id = 'sidebarOverlay';
        overlay.addEventListener('click', closeSidebar);
        document.body.appendChild(overlay);
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.remove();
    }

    // ===== Event Listeners =====

    btnSend.addEventListener('click', sendMessage);

    messageInput.addEventListener('input', () => {
        updateSendButton();
        // Auto-resize textarea
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    });

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    btnNewChat.addEventListener('click', newChat);

    menuToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.dataset.prompt;
            messageInput.value = prompt;
            updateSendButton();
            sendMessage();
        });
    });

    // Initialize
    updateSendButton();
});
