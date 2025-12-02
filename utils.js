// ═══════════════════════════════════════════════════════════════
// UTILS.JS - Funcții utilitare pentru navigare și management
// ═══════════════════════════════════════════════════════════════

// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }
    
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.onclick && item.onclick.toString().includes(pageId)) {
            item.classList.add('active');
        }
    });
    
    // Load specific page content
    if (pageId === 'petreceri-mele') {
        loadPetreceriMele();
    } else if (pageId === 'nealocate') {
        loadNealocate();
    } else if (pageId === 'total') {
        loadTotalPetreceri();
    }
}

// ==========================================
// MODE SWITCHING
// ==========================================

function switchToOperatorMode() {
    currentMode = MODES.OPERATOR;
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, MODES.OPERATOR);
    loadMenu();
}

function switchToAdminMode() {
    promptModePassword('admin');
}

function switchToGMMode() {
    promptModePassword('gm');
}

function promptModePassword(mode) {
    pendingMode = mode;
    const title = mode === 'admin' ? '🔐 Parolă Admin' : '👑 Parolă GM';
    document.getElementById('passwordModalTitle').textContent = title;
    document.getElementById('modal-password-input-actual').value = '';
    document.getElementById('passwordError').classList.remove('active');
    document.getElementById('modal-password').classList.add('active');
}

function checkModePassword() {
    const input = document.getElementById('modal-password-input-actual').value;
    const errorDiv = document.getElementById('passwordError');
    
    if (pendingMode === 'admin' && input === ADMIN_PASSWORD) {
        currentMode = MODES.ADMIN;
        localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, MODES.ADMIN);
        closeModal('modal-password');
        loadMenu();
        addChatMessage('✅ Mod Admin activat!', false);
    } else if (pendingMode === 'gm' && input === GM_PASSWORD) {
        currentMode = MODES.GM;
        localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, MODES.GM);
        closeModal('modal-password');
        loadMenu();
        addChatMessage('✅ Mod GM activat! Vezi în sidebar: GM Core, SEO Command Center, Ads Command Center, Performance Hub!', false);
    } else {
        errorDiv.textContent = '❌ Parolă incorectă!';
        errorDiv.classList.add('active');
    }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

// ==========================================
// MENU LOADING
// ==========================================

function loadMenu() {
    const menu = document.getElementById('sidebarMenu');
    const badge = document.getElementById('modeBadge');
    
    if (currentMode === MODES.OPERATOR) {
        badge.innerHTML = '';
        menu.innerHTML = `
            <div class="menu-item active" onclick="showPage('home')">
                <span class="icon">🏠</span>
                <span>Acasă</span>
            </div>
            <div class="menu-item" onclick="showPage('noteaza')">
                <span class="icon">➕</span>
                <span style="color: #10b981;">Notează Eveniment</span>
            </div>
            <div class="menu-item" onclick="showPage('nealocate')">
                <span class="icon">📋</span>
                <span>Petreceri Nealocate</span>
            </div>
            <div class="menu-item" onclick="showPage('petreceri-mele')">
                <span class="icon">🎊</span>
                <span>Ce Petreceri Am</span>
            </div>
            <div class="menu-item" onclick="showPage('total')">
                <span class="icon">📈</span>
                <span>Total Petreceri</span>
            </div>
            <div class="menu-item" onclick="showPage('soferi')">
                <span class="icon">🚗</span>
                <span>Evenimente cu Șoferi</span>
            </div>
            <div class="menu-item" onclick="showPage('factura')">
                <span class="icon">🧾</span>
                <span>Cu Factură</span>
            </div>
            <div class="menu-item" onclick="showPage('echipa')">
                <span class="icon">👥</span>
                <span>Echipa</span>
            </div>
            <div class="menu-item" onclick="showPage('inventar')">
                <span class="icon">📦</span>
                <span>Inventar</span>
            </div>
            <div class="menu-item" onclick="showPage('piniata')">
                <span class="icon">🎯</span>
                <span>Piniata</span>
            </div>
            <div class="menu-item" onclick="showPage('conversations')">
                <span class="icon">💬</span>
                <span>Conversații Clienți</span>
            </div>
        `;
        loadOperatorPages();
    } else if (currentMode === MODES.ADMIN) {
        badge.innerHTML = '<div class="mode-badge admin">🔐 MOD ADMIN</div>';
        menu.innerHTML = `
            <div class="menu-section">📊 ADMIN DASHBOARD</div>
            <div class="menu-item active" onclick="showPage('admin-overview')">
                <span class="icon">📊</span>
                <span>Overview</span>
            </div>
            <div class="menu-item" onclick="showPage('admin-bifari')">
                <span class="icon">✅</span>
                <span>Bifează Evenimente</span>
            </div>
            <div class="menu-item" onclick="showPage('admin-stats')">
                <span class="icon">📈</span>
                <span>Vezi Statistici</span>
            </div>
            <div class="menu-item" onclick="showPage('admin-total-stats')">
                <span class="icon">📊</span>
                <span>Total Statistici</span>
            </div>
            <div class="menu-item" onclick="showPage('admin-target-traineri')">
                <span class="icon">💰</span>
                <span>Target Traineri</span>
            </div>
            <div class="menu-item" onclick="showPage('admin-target-animatie')">
                <span class="icon">🎭</span>
                <span>Target Animație</span>
            </div>
            <div class="menu-item" onclick="showPage('admin-target-vanzari')">
                <span class="icon">💵</span>
                <span>Target Vânzări</span>
            </div>
            <div class="menu-item" onclick="showPage('admin-coduri')">
                <span class="icon">📝</span>
                <span>Generează Coduri</span>
            </div>
            <div class="menu-section">💬 CHAT</div>
            <div class="menu-item" onclick="showPage('admin-chat')">
                <span class="icon">💬</span>
                <span style="color: #10b981;">Chat cu Clienții</span>
            </div>
            <div class="menu-item" onclick="showPage('ai-instructions')">
                <span class="icon">🧠</span>
                <span style="color: #fbbf24;">Instrucțiuni AI (Prompt)</span>
            </div>
            <div class="menu-section">👥 MANAGEMENT</div>
            <div class="menu-item" onclick="showPage('admin-users')">
                <span class="icon">👥</span>
                <span>Gestionare Utilizatori</span>
            </div>
            <div class="menu-section">📱 NOTARE EVENIMENTE</div>
            <div class="menu-item" onclick="showNotareAI()">
                <span class="icon">🤖</span>
                <span>Notare Evenimente AI</span>
            </div>
            <div class="menu-item" onclick="showEroriAI()">
                <span class="icon">⚠️</span>
                <span>Erori AI</span>
            </div>
            <div class="menu-item" onclick="showIstoricConversatii()">
                <span class="icon">💬</span>
                <span>Istoric Conversații</span>
            </div>
            <div class="menu-item" onclick="showAprobareEvenimente()">
                <span class="icon">✅</span>
                <span>Aprobare Evenimente</span>
            </div>
            <div class="menu-item" onclick="showExceptiiPermanente()">
                <span class="icon">⚙️</span>
                <span>Excepții Permanente</span>
            </div>
            <div class="menu-item" onclick="showModificareEvenimente()">
                <span class="icon">✏️</span>
                <span>Modificare Eveniment</span>
            </div>
            <div class="menu-section">🔙 ÎNAPOI</div>
            <div class="menu-item" onclick="switchToOperatorMode()">
                <span class="icon">↩️</span>
                <span>Mod Operator</span>
            </div>
        `;
        loadAdminPages();
    } else if (currentMode === MODES.GM) {
        badge.innerHTML = '<div class="mode-badge gm">👑 MOD GM</div>';
        menu.innerHTML = `
            <div class="menu-section">👑 GM COMMAND CENTER</div>
            <div class="menu-item active" onclick="showPage('gm-core')">
                <span class="icon">🎯</span>
                <span>GM Core</span>
            </div>
            <div class="menu-item" onclick="showPage('gm-seo')">
                <span class="icon">🔍</span>
                <span>SEO Command Center</span>
            </div>
            <div class="menu-item" onclick="showPage('gm-ads')">
                <span class="icon">📢</span>
                <span>Ads Command Center</span>
            </div>
            <div class="menu-item" onclick="showPage('gm-performance')">
                <span class="icon">📊</span>
                <span>Performance Hub</span>
            </div>
            <div class="menu-item" onclick="showPage('gm-budget')">
                <span class="icon">💰</span>
                <span>Budget & AI</span>
            </div>
            <div class="menu-section">🔙 ÎNAPOI</div>
            <div class="menu-item" onclick="switchToOperatorMode()">
                <span class="icon">↩️</span>
                <span>Mod Operator</span>
            </div>
            <div class="menu-item" onclick="switchToAdminMode()">
                <span class="icon">🔐</span>
                <span>Mod Admin</span>
            </div>
        `;
        loadGMPages();
    }
}
