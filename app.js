// ═══════════════════════════════════════════════════════════
// SUPERPARTY v7.0 - CORE APP.JS
// Main application logic: auth, routing, state, navigation
// Mobile-first, fast, optimized
// ═══════════════════════════════════════════════════════════

// Global App State
const AppState = {
    user: null,
    currentPage: 'dashboard',
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    theme: 'light'
};

// ═══════════════════════════════════════════════════════════
// APP INITIALIZATION
// ═══════════════════════════════════════════════════════════

/**
 * Initialize app când DOM e ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 SuperParty App Starting...');
    
    // Show loading screen
    showLoadingScreen();
    
    // Check authentication
    const isAuthenticated = await checkAuth();
    
    if (isAuthenticated) {
        // User e logat
        await initializeApp();
    } else {
        // User NU e logat
        showLoginScreen();
    }
    
    // Hide loading screen
    hideLoadingScreen();
    
    console.log('✅ SuperParty App Ready!');
});

/**
 * Initialize app pentru user logat
 */
async function initializeApp() {
    console.log('Initializing app for user:', AppState.user.userId);
    
    // Load user data
    await loadUserData();
    
    // Initialize UI
    initializeUI();
    
    // Setup navigation
    setupNavigation();
    
    // Setup menu handlers
    setupMenuHandlers();
    
    // Load initial page
    await loadPage('dashboard');
    
    // Start notification polling
    startNotificationPolling();
    
    // Show app
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

/**
 * Load user data
 */
async function loadUserData() {
    try {
        // Get user profile
        const profileResponse = await API.getUserProfile();
        if (profileResponse.success) {
            AppState.user = {
                ...AppState.user,
                ...profileResponse.profile
            };
        }
        
        // Get notifications
        await loadNotifications();
        
        // Update UI with user data
        updateUserUI();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showToast('Eroare la încărcarea datelor', 'error');
    }
}

/**
 * Initialize UI elements
 */
function initializeUI() {
    // Set theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    AppState.theme = savedTheme;
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('#btn-toggle-theme i');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Show/hide admin sections based on role
    if (AppState.user.role === 'Admin' || AppState.user.role === 'GM') {
        document.getElementById('admin-menu-section').style.display = 'block';
    }
}

/**
 * Update UI cu user data
 */
function updateUserUI() {
    const user = AppState.user;
    
    // User initials
    const initials = getInitials(user.name || user.userId);
    document.getElementById('user-initials').textContent = initials;
    document.getElementById('menu-user-initials').textContent = initials;
    
    // User info în menu
    document.getElementById('menu-user-name').textContent = user.name || user.userId;
    document.getElementById('menu-user-role').textContent = user.role || '-';
    document.getElementById('menu-user-code').textContent = user.cod || '-';
    
    // Notification badge
    updateNotificationBadge();
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════

/**
 * Setup navigation handlers
 */
function setupNavigation() {
    // Bottom nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            
            // Update active state
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Load page
            await loadPage(page);
        });
    });
    
    // Menu items
    const menuItems = document.querySelectorAll('.menu-item[data-page]');
    menuItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            
            // Close menu
            closeSideMenu();
            
            // Load page
            await loadPage(page);
        });
    });
}

/**
 * Load page
 */
async function loadPage(pageName) {
    console.log('Loading page:', pageName);
    
    AppState.currentPage = pageName;
    
    // Update page title
    const pageTitles = {
        'dashboard': 'Dashboard',
        'events': 'Petreceri',
        'inbox': 'Inbox',
        'profile': 'Profil',
        'add-event': 'Petrecere Nouă',
        'my-events': 'Petrecerile Mele',
        'all-events': 'Toate Petrecerile',
        'archived-events': 'Arhivate',
        'my-performance': 'Statistici',
        'my-earnings': 'Câștiguri',
        'team-rankings': 'Clasament',
        'admin-dashboard': 'Admin Dashboard',
        'admin-users': 'Useri',
        'admin-broadcast': 'Trimite Mesaj',
        'admin-archive': 'Arhivă',
        'admin-reports': 'Rapoarte',
        'settings': 'Setări'
    };
    
    document.getElementById('page-title').textContent = pageTitles[pageName] || 'SuperParty';
    
    // Show loading
    showPageLoading();
    
    try {
        // Render page (funcție în pages.js)
        await renderPage(pageName);
    } catch (error) {
        console.error('Error loading page:', error);
        showToast('Eroare la încărcarea paginii', 'error');
    }
    
    // Hide loading
    hidePageLoading();
}

/**
 * Show page loading
 */
function showPageLoading() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 60vh;">
            <div class="loading-spinner"></div>
        </div>
    `;
}

/**
 * Hide page loading
 */
function hidePageLoading() {
    // Page content is already rendered
}

// ═══════════════════════════════════════════════════════════
// MENU HANDLERS
// ═══════════════════════════════════════════════════════════

/**
 * Setup menu handlers
 */
function setupMenuHandlers() {
    // Open side menu
    document.getElementById('btn-menu').addEventListener('click', () => {
        openSideMenu();
    });
    
    // Close side menu
    document.getElementById('btn-close-menu').addEventListener('click', () => {
        closeSideMenu();
    });
    
    // Close menu când se dă click pe overlay
    document.getElementById('overlay').addEventListener('click', () => {
        closeSideMenu();
        closeNotificationPanel();
    });
    
    // Open notification panel
    document.getElementById('btn-notifications').addEventListener('click', () => {
        openNotificationPanel();
    });
    
    // Close notification panel
    document.getElementById('btn-close-notifications').addEventListener('click', () => {
        closeNotificationPanel();
    });
    
    // User menu (avatar click)
    document.getElementById('btn-user-menu').addEventListener('click', () => {
        openSideMenu();
    });
    
    // Theme toggle
    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
        toggleTheme();
    });
    
    // Logout
    document.getElementById('btn-logout').addEventListener('click', async () => {
        await logout();
    });
}

/**
 * Open side menu
 */
function openSideMenu() {
    document.getElementById('side-menu').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

/**
 * Close side menu
 */
function closeSideMenu() {
    document.getElementById('side-menu').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

/**
 * Open notification panel
 */
function openNotificationPanel() {
    document.getElementById('notification-panel').classList.add('open');
    document.getElementById('overlay').classList.add('active');
    
    // Load notifications (funcție în inbox.js)
    loadNotificationPanel();
}

/**
 * Close notification panel
 */
function closeNotificationPanel() {
    document.getElementById('notification-panel').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

/**
 * Toggle theme (dark/light)
 */
function toggleTheme() {
    const currentTheme = AppState.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    AppState.theme = newTheme;
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const themeIcon = document.querySelector('#btn-toggle-theme i');
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Update text
    const themeText = document.querySelector('#btn-toggle-theme span');
    themeText.textContent = newTheme === 'dark' ? 'Mod Luminos' : 'Mod Întunecat';
    
    showToast(`Temă ${newTheme === 'dark' ? 'întunecată' : 'luminoasă'} activată`, 'success');
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

/**
 * Load notifications
 */
async function loadNotifications() {
    try {
        const response = await API.getNotifications();
        
        if (response.success) {
            AppState.notifications = response.notifications || [];
            AppState.unreadCount = response.badgeCount || 0;
            
            updateNotificationBadge();
        }
        
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

/**
 * Update notification badge
 */
function updateNotificationBadge() {
    const count = AppState.unreadCount;
    
    // Top bar badge
    const topBadge = document.getElementById('notification-badge');
    if (topBadge) {
        topBadge.textContent = count;
        topBadge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    // Bottom nav badge
    const bottomBadge = document.getElementById('inbox-badge');
    if (bottomBadge) {
        bottomBadge.textContent = count;
        bottomBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Start notification polling (every 30 seconds)
 */
function startNotificationPolling() {
    // Initial load
    loadNotifications();
    
    // Poll every 30 seconds
    setInterval(() => {
        loadNotifications();
    }, 30000);
}

// ═══════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════

/**
 * Check authentication
 */
async function checkAuth() {
    try {
        // Check localStorage for session
        const sessionToken = localStorage.getItem('sessionToken');
        const userId = localStorage.getItem('userId');
        
        if (!sessionToken || !userId) {
            return false;
        }
        
        // Verify session cu backend
        const response = await API.verifySession(sessionToken, userId);
        
        if (response.success) {
            AppState.user = {
                userId: userId,
                sessionToken: sessionToken,
                ...response.user
            };
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

/**
 * Show login screen
 */
function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    
    // Setup login form
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });
    
    // Setup register button
    const btnRegister = document.getElementById('btn-register');
    if (btnRegister) {
        btnRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
    }
    
    // Setup forgot password button
    const btnForgotPassword = document.getElementById('btn-forgot-password');
    if (btnForgotPassword) {
        btnForgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            showForgotPasswordForm();
        });
    }
}

/**
 * Handle login
 */
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showToast('Te rog completează email și parola', 'error');
        return;
    }
    
    // Show loading
    const btnText = document.querySelector('#login-form .btn-text');
    const btnLoading = document.querySelector('#login-form .btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    try {
        const response = await API.login(email, password);
        
        if (response.success) {
            // Save session
            localStorage.setItem('sessionToken', response.sessionToken);
            localStorage.setItem('userId', response.userId);
            
            AppState.user = {
                userId: response.userId,
                sessionToken: response.sessionToken,
                ...response.user
            };
            
            // Initialize app
            await initializeApp();
            
            showToast('Bun venit!', 'success');
        } else {
            showToast(response.error || 'Eroare la autentificare', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showToast('Eroare la conectare', 'error');
    }
    
    // Hide loading
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
}

/**
 * Logout
 */
async function logout() {
    try {
        // Clear session
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userId');
        
        AppState.user = null;
        
        showToast('La revedere!', 'success');
        showLoginScreen();
        
    } catch (error) {
        console.error('Logout error:', error);
    }
}

/**
 * Show register form
 */
function showRegisterForm() {
    const modalHTML = `
        <div class="modal-backdrop" id="register-modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Creează cont nou</h3>
                    <button class="btn-close" onclick="document.getElementById('register-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="register-form">
                        <div class="form-group">
                            <label>Nume complet</label>
                            <input type="text" id="reg-name" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="reg-email" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Telefon</label>
                            <input type="tel" id="reg-phone" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Parolă</label>
                            <input type="password" id="reg-password" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Confirmă parola</label>
                            <input type="password" id="reg-password-confirm" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Rol</label>
                            <select id="reg-role" class="form-control" required>
                                <option value="">Selectează rol...</option>
                                <option value="OPERATOR">Operator</option>
                                <option value="TRAINER">Trainer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        
                        <div class="modal-footer" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                            <button type="button" class="btn btn-secondary" onclick="document.getElementById('register-modal').remove()">
                                Anulează
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <span class="btn-text">Creează cont</span>
                                <span class="btn-loading" style="display: none;">
                                    <i class="fas fa-spinner fa-spin"></i> Se încarcă...
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Handle form submit
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRegister();
    });
}

/**
 * Handle register
 */
async function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const role = document.getElementById('reg-role').value;
    
    // Validation
    if (!name || !email || !phone || !password || !passwordConfirm || !role) {
        showToast('Te rog completează toate câmpurile', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showToast('Parolele nu se potrivesc', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Parola trebuie să aibă minim 6 caractere', 'error');
        return;
    }
    
    // Show loading
    const btnText = document.querySelector('#register-form .btn-text');
    const btnLoading = document.querySelector('#register-form .btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    try {
        const response = await API.register({
            name: name,
            email: email,
            phone: phone,
            password: password,
            role: role
        });
        
        if (response.success) {
            showToast('Cont creat cu succes! Te poți autentifica acum.', 'success');
            document.getElementById('register-modal').remove();
            
            // Pre-fill email in login form
            document.getElementById('login-email').value = email;
        } else {
            showToast(response.error || 'Eroare la crearea contului', 'error');
        }
        
    } catch (error) {
        console.error('Register error:', error);
        showToast('Eroare la crearea contului', 'error');
    }
    
    // Hide loading
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
}

/**
 * Show forgot password form
 */
function showForgotPasswordForm() {
    const modalHTML = `
        <div class="modal-backdrop" id="forgot-password-modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Resetare parolă</h3>
                    <button class="btn-close" onclick="document.getElementById('forgot-password-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 20px; color: #666;">
                        Introdu adresa de email și vei primi instrucțiuni pentru resetarea parolei.
                    </p>
                    
                    <form id="forgot-password-form">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="forgot-email" class="form-control" required>
                        </div>
                        
                        <div class="modal-footer" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                            <button type="button" class="btn btn-secondary" onclick="document.getElementById('forgot-password-modal').remove()">
                                Anulează
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <span class="btn-text">Trimite instrucțiuni</span>
                                <span class="btn-loading" style="display: none;">
                                    <i class="fas fa-spinner fa-spin"></i> Se trimite...
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Handle form submit
    document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleForgotPassword();
    });
}

/**
 * Handle forgot password
 */
async function handleForgotPassword() {
    const email = document.getElementById('forgot-email').value.trim();
    
    if (!email) {
        showToast('Te rog introdu adresa de email', 'error');
        return;
    }
    
    // Show loading
    const btnText = document.querySelector('#forgot-password-form .btn-text');
    const btnLoading = document.querySelector('#forgot-password-form .btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    try {
        const response = await API.forgotPassword(email);
        
        if (response.success) {
            showToast('Instrucțiunile au fost trimise pe email!', 'success');
            document.getElementById('forgot-password-modal').remove();
        } else {
            showToast(response.error || 'Eroare la trimiterea instrucțiunilor', 'error');
        }
        
    } catch (error) {
        console.error('Forgot password error:', error);
        showToast('Eroare la trimiterea instrucțiunilor', 'error');
    }
    
    // Hide loading
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
}
        localStorage.removeItem('userId');
        
        // Reset state
        AppState.user = null;
        AppState.notifications = [];
        AppState.unreadCount = 0;
        
        // Show login screen
        showLoginScreen();
        
        showToast('Te-ai deconectat', 'success');
        
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// ═══════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════

/**
 * Show loading screen
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 300);
}

// ═══════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, duration);
}

/**
 * Get toast icon
 */
function getToastIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get initials from name
 */
function getInitials(name) {
    if (!name) return '?';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

/**
 * Format date
 */
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('ro-RO', options);
}

/**
 * Format currency (RON)
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Get time ago
 */
function getTimeAgo(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Acum';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}z`;
    return formatDate(date);
}

// ═══════════════════════════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Show modal
 */
function showModal(title, content, buttons = []) {
    const container = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1200;
        padding: 20px;
    `;
    
    const buttonsHtml = buttons.map((btn, index) => {
        return `
            <button class="btn ${btn.className || 'btn-primary'}" data-action="${index}">
                ${btn.text}
            </button>
        `;
    }).join('');
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-secondary);
            border-radius: var(--radius-lg);
            padding: var(--spacing-xl);
            max-width: 400px;
            width: 100%;
        ">
            <h2 style="margin-bottom: var(--spacing-md);">${title}</h2>
            <div style="margin-bottom: var(--spacing-lg);">${content}</div>
            <div style="display: flex; gap: var(--spacing-sm);">
                ${buttonsHtml}
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    
    // Handle button clicks
    buttons.forEach((btn, index) => {
        const buttonEl = modal.querySelector(`[data-action="${index}"]`);
        buttonEl.addEventListener('click', () => {
            if (btn.action) btn.action();
            container.removeChild(modal);
        });
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            container.removeChild(modal);
        }
    });
}

// ═══════════════════════════════════════════════════════════
// EXPORT PENTRU DEBUGGING
// ═══════════════════════════════════════════════════════════

window.AppState = AppState;
window.showToast = showToast;
window.showModal = showModal;
window.loadPage = loadPage;
