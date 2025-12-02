// ═══════════════════════════════════════════════════════════════
// AUTH.JS - Autentificare și gestionare sesiune
// ═══════════════════════════════════════════════════════════════

// Variabile globale
let currentUser = null;
let currentMode = 'operator';
let pendingMode = null;

// ==========================================
// SESSION MANAGEMENT
// ==========================================

function saveSession(user) {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, currentMode);
}

function loadSession() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const savedMode = localStorage.getItem(STORAGE_KEYS.CURRENT_MODE);
    
    if (savedMode) {
        currentMode = savedMode;
    }
    
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing session:', e);
            return null;
        }
    }
    return null;
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_MODE);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// ==========================================
// SCREEN MANAGEMENT
// ==========================================

function showLogin() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('loginError').classList.remove('active');
}

function showRegister() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('registerScreen').classList.add('active');
    document.getElementById('registerError').classList.remove('active');
    document.getElementById('registerSuccess').classList.remove('active');
}

function showDashboard() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('dashboardScreen').classList.add('active');
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userCode').textContent = currentUser.code;
    
    document.getElementById('chatWidget').style.display = 'block';
    
    loadMenu();
}

// ==========================================
// LOGIN
// ==========================================

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');
    
    btn.disabled = true;
    btn.textContent = 'Se autentifică...';
    errorDiv.classList.remove('active');
    
    apiCall('login', { username: email, password }, function(data) {
        if (data.success) {
            currentUser = data.user;
            saveSession(currentUser);
            showDashboard();
        } else {
            errorDiv.textContent = data.error || data.message || 'Eroare la autentificare';
            errorDiv.classList.add('active');
        }
        
        btn.disabled = false;
        btn.textContent = 'Autentificare';
    });
}

// ==========================================
// REGISTER
// ==========================================

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const btn = document.getElementById('registerBtn');
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    
    btn.disabled = true;
    btn.textContent = 'Se creează contul...';
    errorDiv.classList.remove('active');
    successDiv.classList.remove('active');
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Parolele nu coincid!';
        errorDiv.classList.add('active');
        btn.disabled = false;
        btn.textContent = 'Creare Cont';
        return;
    }
    
    apiCall('register', { name, username: email, password, confirmPassword }, function(data) {
        if (data.success) {
            successDiv.textContent = 'Cont creat cu succes! Așteaptă aprobarea adminului pentru a te loga...';
            successDiv.classList.add('active');
            
            document.getElementById('registerForm').reset();
            
            setTimeout(() => {
                showLogin();
                document.getElementById('loginEmail').value = email;
            }, 3000);
        } else {
            errorDiv.textContent = data.error || data.message || 'Eroare la creare cont';
            errorDiv.classList.add('active');
        }
        
        btn.disabled = false;
        btn.textContent = 'Creare Cont';
    });
}

// ==========================================
// LOGOUT
// ==========================================

function handleLogout() {
    if (confirm('Sigur vrei să te deconectezi?')) {
        currentUser = null;
        currentMode = 'operator';
        clearSession();
        location.reload();
    }
}

// ==========================================
// MODE PASSWORD VERIFICATION
// ==========================================

function handlePasswordInput() {
    const input = document.getElementById('passwordInput').value;
    const errorDiv = document.getElementById('passwordError');
    
    errorDiv.classList.remove('active');
    
    if (pendingMode === 'admin' && input === ADMIN_PASSWORD) {
        currentMode = 'admin';
        localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, 'admin');
        closeModal('modal-password');
        loadMenu();
        addChatMessage('✅ Mod Admin activat!', false);
    } else if (pendingMode === 'gm' && input === GM_PASSWORD) {
        currentMode = 'gm';
        localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, 'gm');
        closeModal('modal-password');
        loadMenu();
        addChatMessage('✅ Mod GM activat! Vezi în sidebar: GM Core, SEO Command Center, Ads Command Center, Performance Hub!', false);
    } else {
        errorDiv.textContent = '❌ Parolă incorectă!';
        errorDiv.classList.add('active');
    }
}

// ==========================================
// INIT ON PAGE LOAD
// ==========================================

window.addEventListener('DOMContentLoaded', function() {
    const session = loadSession();
    if (session) {
        currentUser = session;
        showDashboard();
    } else {
        showLogin();
    }
});
