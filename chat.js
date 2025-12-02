// ═══════════════════════════════════════════════════════════════
// CHAT.JS - Chat widget cu GPT API
// ═══════════════════════════════════════════════════════════════

let chatConversationId = '';

// ==========================================
// CHAT WIDGET FUNCTIONS
// ==========================================

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
}

function addChatMessage(text, isUser) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const lowerMessage = message.toLowerCase();
    
    // Comenzi speciale pentru admin/GM
    if (lowerMessage === 'open mod andrei admin') {
        addChatMessage(message, true);
        input.value = '';
        promptModePassword('admin');
        return;
    }
    
    if (lowerMessage === 'open mod andrei gm') {
        addChatMessage(message, true);
        input.value = '';
        promptModePassword('gm');
        return;
    }
    
    addChatMessage(message, true);
    input.value = '';
    
    const sendBtn = document.getElementById('chatSendBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Trimite...';
    
    // API call către backend care folosește GPT API
    apiCall('chat', {
        message: message,
        conversationId: chatConversationId,
        userEmail: currentUser.email,
        userName: currentUser.name
    }, function(data) {
        if (data.success && data.response) {
            addChatMessage(data.response, false);
            chatConversationId = data.conversationId || '';
        } else {
            addChatMessage('Ne pare rău, a apărut o eroare. Încearcă din nou.', false);
        }
        
        sendBtn.disabled = false;
        sendBtn.textContent = 'Trimite';
        input.focus();
    });
}

// Enter key support
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

// ==========================================
// NOTARE EVENIMENTE CU AI
// ==========================================

let currentConvIdAI = null;

function sendChatMessageAI() {
    const input = document.getElementById('chatInputAI');
    const message = input.value.trim();
    if (!message) return;
    
    if (!currentConvIdAI) {
        currentConvIdAI = 'CONV_' + Date.now();
    }
    
    appendChatMessageAI('user', message);
    input.value = '';
    
    // API call către backend care folosește GPT API pentru notare evenimente
    apiCall('chatOperator', {
        message: message,
        userEmail: currentUser.email,
        convId: currentConvIdAI
    }, function(response) {
        if (response.success) {
            appendChatMessageAI('ai', response.message);
            
            if (response.requireProof) {
                document.getElementById('proofUploadAreaAI').style.display = 'block';
            }
            
            if (response.eventId) {
                appendChatMessageAI('system', '✅ Eveniment creat: ' + response.eventId);
                currentConvIdAI = null;
                setTimeout(function() {
                    document.getElementById('proofUploadAreaAI').style.display = 'none';
                }, 1000);
            }
        } else {
            appendChatMessageAI('ai', '❌ ' + (response.message || response.error || 'Eroare'));
        }
    });
}

function appendChatMessageAI(type, message) {
    const container = document.getElementById('chatMessagesAI');
    const div = document.createElement('div');
    div.style.marginBottom = '15px';
    div.style.padding = '12px 16px';
    div.style.borderRadius = '10px';
    div.style.maxWidth = '85%';
    
    if (type === 'user') {
        div.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        div.style.color = 'white';
        div.style.marginLeft = 'auto';
        div.innerHTML = '<strong>👤 Tu:</strong><br>' + message;
    } else if (type === 'ai') {
        div.style.background = 'rgba(255,255,255,0.05)';
        div.style.border = '1px solid rgba(255,255,255,0.1)';
        div.style.color = 'white';
        div.innerHTML = '<strong>🤖 AI:</strong><br>' + message.replace(/\n/g, '<br>');
    } else if (type === 'system') {
        div.style.background = '#10b981';
        div.style.color = 'white';
        div.style.textAlign = 'center';
        div.style.margin = '20px auto';
        div.style.maxWidth = '100%';
        div.innerHTML = message;
    }
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function uploadProofAI() {
    const fileInput = document.getElementById('proofFileAI');
    if (fileInput.files.length === 0) {
        alert('Selectează fișiere!');
        return;
    }
    
    // Convert files to base64 și trimite către backend
    const promises = Array.from(fileInput.files).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
                fileName: file.name,
                data: reader.result.split(',')[1],
                mimeType: file.type
            });
            reader.readAsDataURL(file);
        });
    });
    
    Promise.all(promises).then(poze => {
        apiCall('uploadProofAI', {
            userEmail: currentUser.email,
            convId: currentConvIdAI,
            poze: JSON.stringify(poze)
        }, function(response) {
            if (response.success) {
                alert('Poze încărcate cu succes!');
                document.getElementById('proofUploadAreaAI').style.display = 'none';
                appendChatMessageAI('system', '📸 Dovezi încărcate cu succes');
            } else {
                alert('Eroare: ' + (response.error || 'Nu s-au putut încărca pozele'));
            }
        });
    });
}
