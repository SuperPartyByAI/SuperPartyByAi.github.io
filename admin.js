// ═══════════════════════════════════════════════════════════════
// ADMIN.JS - Funcții modul admin
// ═══════════════════════════════════════════════════════════════

// ==========================================
// LOAD ADMIN PAGES
// ==========================================

function loadAdminPages() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="page active" id="admin-overview">
            <div class="page-header">
                <h1>📊 Admin Overview</h1>
                <p>Control panel administratori</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="label">Total Operatori</div>
                    <div class="value">45</div>
                </div>
                <div class="stat-card">
                    <div class="label">Evenimente Astăzi</div>
                    <div class="value">18</div>
                </div>
                <div class="stat-card">
                    <div class="label">Venit Luna</div>
                    <div class="value">52.340 RON</div>
                </div>
            </div>
        </div>
        <div class="page" id="admin-bifari"><div class="page-header"><h1>✅ Bifări Evenimente</h1></div></div>
        <div class="page" id="admin-stats"><div class="page-header"><h1>📈 Vezi Statistici</h1></div></div>
        <div class="page" id="admin-total-stats"><div class="page-header"><h1>📊 Total Statistici</h1></div></div>
        <div class="page" id="admin-target-traineri"><div class="page-header"><h1>💰 Target Traineri</h1></div></div>
        <div class="page" id="admin-target-animatie"><div class="page-header"><h1>🎭 Target Animație</h1></div></div>
        <div class="page" id="admin-target-vanzari"><div class="page-header"><h1>💵 Target Vânzări</h1></div></div>
        <div class="page" id="admin-coduri"><div class="page-header"><h1>📝 Generează Coduri</h1></div></div>
        <div class="page" id="admin-chat"><div class="page-header"><h1>💬 Chat cu Clienții</h1></div></div>
        <div class="page" id="ai-instructions"><div class="page-header"><h1>🧠 Instrucțiuni AI</h1></div></div>
        <div class="page" id="admin-users"><div class="page-header"><h1>👥 Gestionare Utilizatori</h1></div></div>
    `;
    showPage('admin-overview');
}

// ==========================================
// ADMIN FUNCTIONS - Notare AI
// ==========================================

function showNotareAI() {
    showPage('pageNotareAI');
}

function showEroriAI() {
    showPage('pageEroriAI');
    loadEroriAI('all');
}

function showIstoricConversatii() {
    showPage('pageIstoricConversatii');
}

function showAprobareEvenimente() {
    showPage('pageAprobareEvenimente');
    loadApprovalsAI('incomplete');
}

function showExceptiiPermanente() {
    showPage('pageExceptiiPermanente');
    loadExceptionsAI();
}

function showModificareEvenimente() {
    showPage('pageModificareEvenimente');
}

// Chat AI pentru notare evenimente
function sendChatMessageAI() {
    const input = document.getElementById('chatInputAI');
    const message = input.value.trim();
    if (!message) return;
    
    const messagesDiv = document.getElementById('chatMessagesAI');
    messagesDiv.innerHTML += `<div class="chat-message user"><div class="chat-bubble">${message}</div></div>`;
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Mock response - în realitate ar face API call către GPT
    setTimeout(() => {
        messagesDiv.innerHTML += `<div class="chat-message bot"><div class="chat-bubble">Am înțeles! Notez evenimentul...</div></div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 1000);
}

function uploadProofAI() {
    const fileInput = document.getElementById('proofFileAI');
    if (fileInput.files.length === 0) {
        alert('Selectează fișiere!');
        return;
    }
    alert('Poze încărcate cu succes!');
}

function loadEroriAI(period) {
    const container = document.getElementById('eroriListAI');
    container.innerHTML = '<div class="loading">⏳ Se încarcă...</div>';
    
    apiCall('getEroriAI', { period: period }, function(data) {
        if (data.success && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(err => `<div class="event-card"><h3>Eroare: ${err.tip}</h3></div>`).join('');
        } else {
            container.innerHTML = '<div class="no-events"><div class="icon">✅</div><h3>Nicio eroare găsită!</h3></div>';
        }
    });
}

function searchConversationsAI() {
    const telefon = document.getElementById('filterTelefonAI').value;
    const eventId = document.getElementById('filterEventIDAI').value;
    const operator = document.getElementById('filterOperatorAI').value;
    const period = document.getElementById('filterPeriodAI').value;
    
    const container = document.getElementById('conversationsListAI');
    container.innerHTML = '<div class="loading">⏳ Se încarcă...</div>';
    
    apiCall('searchConversations', { telefon, eventId, operator, period }, function(data) {
        if (data.success && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(conv => `<div class="event-card"><h3>Conversație: ${conv.telefon}</h3></div>`).join('');
        } else {
            container.innerHTML = '<div class="no-events"><div class="icon">💬</div><h3>Nicio conversație găsită</h3></div>';
        }
    });
}

function loadApprovalsAI(filter) {
    const container = document.getElementById('approvalsListAI');
    container.innerHTML = '<div class="loading">⏳ Se încarcă...</div>';
    
    apiCall('getApprovalsAI', { filter: filter }, function(data) {
        if (data.success && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(ev => `<div class="event-card"><h3>Eveniment: ${ev.id}</h3></div>`).join('');
        } else {
            container.innerHTML = '<div class="no-events"><div class="icon">✅</div><h3>Toate complete!</h3></div>';
        }
    });
}

function loadExceptionsAI() {
    const container = document.getElementById('exceptionsListAI');
    container.innerHTML = '<div class="loading">⏳ Se încarcă...</div>';
    
    apiCall('getExceptionsAI', {}, function(data) {
        if (data.success && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(ex => `<div class="event-card"><h3>Excepție: ${ex.operator}</h3></div>`).join('');
        } else {
            container.innerHTML = '<div class="no-events"><div class="icon">⚙️</div><h3>Nicio excepție</h3></div>';
        }
    });
}

function showAddExceptionAI() {
    alert('Funcție în dezvoltare: Adăugare excepție');
}

function loadEventForEditAI() {
    const eventId = document.getElementById('searchEventIDAI').value.trim();
    if (!eventId) {
        alert('Introdu ID eveniment!');
        return;
    }
    document.getElementById('editEventFormAI').style.display = 'block';
    document.getElementById('editEventFormAI').innerHTML = '<div class="loading">⏳ Se încarcă...</div>';
    apiCall('getEvenimentDetalii', { eventId: eventId }, function(response) {
        if (response.success) {
            document.getElementById('editEventFormAI').innerHTML = '<div class="event-card"><h3>Eveniment: ' + eventId + '</h3><p>Formular în dezvoltare</p></div>';
        } else {
            document.getElementById('editEventFormAI').innerHTML = '<div class="no-events"><div class="icon">❌</div><h3>Nu găsit!</h3></div>';
        }
    });
}
