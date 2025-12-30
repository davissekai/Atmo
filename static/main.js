// --- Setup ---
const md = window.markdownit({
    highlight: function (str, lang) { return ''; } // Simple highlighter
});

const body = document.body;
const hero = document.getElementById('hero');
const chatArea = document.getElementById('messages-display');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggle-sidebar');
const newChatBtn = document.getElementById('new-chat');

let currentSessionId = localStorage.getItem('atmo_session_id') || null;

// --- State Management ---
function enterChatMode() {
    if (body.classList.contains('launch-mode')) {
        body.classList.remove('launch-mode');
        body.classList.add('chat-mode');
    }
}

function resetToLaunchMode() {
    body.classList.remove('chat-mode');
    body.classList.add('launch-mode');
    chatArea.innerHTML = '';
    currentSessionId = null;
    localStorage.removeItem('atmo_session_id');
}

// --- UI Actions ---
toggleSidebar.onclick = () => {
    sidebar.classList.toggle('collapsed');
};

newChatBtn.onclick = () => {
    resetToLaunchMode();
};

// Auto-resize textarea
userInput.oninput = () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
};

// --- API Logic ---
async function askClimate(question) {
    if (!question.trim()) return;

    enterChatMode();

    // Create User Bubble
    addMessage('user', question);
    userInput.value = '';
    userInput.style.height = 'auto';

    // Create Assistant Bubble (Empty for streaming)
    const assistantBubble = addMessage('assistant', 'Analyzing...');
    const contentDiv = assistantBubble.querySelector('.content');
    let fullResponse = "";

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                session_id: currentSessionId
            })
        });

        // Capture Session ID from header
        const sessionId = response.headers.get('X-Session-ID');
        if (sessionId) {
            currentSessionId = sessionId;
            localStorage.setItem('atmo_session_id', sessionId);
        }

        if (!response.ok) throw new Error('Server error');

        // Handle Stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        contentDiv.innerHTML = ''; // Clear placeholder

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;

            // Render Markdown in real-time
            contentDiv.innerHTML = md.render(fullResponse);

            // Scroll to bottom
            chatArea.scrollTop = chatArea.scrollHeight;
        }

    } catch (error) {
        contentDiv.innerHTML = `<span style="color: #ff6b6b">I hit a snag: ${error.message}. Please try again.</span>`;
    }
}

function addMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;

    const icon = role === 'user' ? 'user' : 'earth';
    const avatarClass = role === 'user' ? 'user' : 'assistant';

    msgDiv.innerHTML = `
        <div class="avatar ${avatarClass}">
            <i data-lucide="${icon}"></i>
        </div>
        <div class="content">${md.render(text)}</div>
    `;

    chatArea.appendChild(msgDiv);
    lucide.createIcons();
    chatArea.scrollTop = chatArea.scrollHeight;
    return msgDiv;
}

// --- Event Listeners ---
sendBtn.onclick = () => askClimate(userInput.value);

userInput.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        askClimate(userInput.value);
    }
};

// Check for existing session on load
window.onload = () => {
    if (localStorage.getItem('atmo_session_id')) {
        // Option: We could fetch history here to restore the state
        // For now, let's keep it simple and stay in launch mode 
        // until they ask something, but keep the ID.
    }
};
