// ═══════════════════════════════════════════════════════════════
// GM.JS - Funcții modul GM (General Manager)
// ═══════════════════════════════════════════════════════════════

// ==========================================
// LOAD GM PAGES
// ==========================================

function loadGMPages() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="page active" id="gm-core">
            <div class="page-header">
                <h1>🧠 GM Core</h1>
                <p>General Manager Control Center</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="label">Total Business Value</div>
                    <div class="value">285K RON</div>
                </div>
                <div class="stat-card">
                    <div class="label">Monthly Growth</div>
                    <div class="value">+24%</div>
                </div>
                <div class="stat-card">
                    <div class="label">Team Members</div>
                    <div class="value">1326</div>
                </div>
                <div class="stat-card">
                    <div class="label">Active Events</div>
                    <div class="value">142</div>
                </div>
            </div>
        </div>
        <div class="page" id="gm-users">
            <div class="page-header">
                <h1>👥 GM Users Management</h1>
                <p>Gestionare utilizatori nivel GM</p>
            </div>
        </div>
        <div class="page" id="gm-guests">
            <div class="page-header">
                <h1>👻 Guests Tracking</h1>
                <p>Monitorizare invitați</p>
            </div>
        </div>
        <div class="page" id="gm-creier">
            <div class="page-header">
                <h1>🧠 Creier AI Integration</h1>
                <p>Sistem inteligență artificială</p>
            </div>
        </div>
        <div class="page" id="gm-seo">
            <div class="page-header">
                <h1>🔍 SEO Command Center</h1>
                <p>Optimizare motoare căutare</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="label">Organic Traffic</div>
                    <div class="value">12.5K</div>
                </div>
                <div class="stat-card">
                    <div class="label">Keywords Ranked</div>
                    <div class="value">342</div>
                </div>
                <div class="stat-card">
                    <div class="label">Domain Authority</div>
                    <div class="value">58</div>
                </div>
            </div>
        </div>
        <div class="page" id="gm-ads">
            <div class="page-header">
                <h1>📢 Ads Command Center</h1>
                <p>Gestionare campanii publicitare</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="label">Active Campaigns</div>
                    <div class="value">8</div>
                </div>
                <div class="stat-card">
                    <div class="label">Total Spend</div>
                    <div class="value">4.2K RON</div>
                </div>
                <div class="stat-card">
                    <div class="label">ROAS</div>
                    <div class="value">6.8x</div>
                </div>
            </div>
        </div>
        <div class="page" id="gm-performance">
            <div class="page-header">
                <h1>📊 Performance Hub</h1>
                <p>Analiză performanță business</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="label">Revenue This Month</div>
                    <div class="value">85.3K RON</div>
                </div>
                <div class="stat-card">
                    <div class="label">Avg Event Value</div>
                    <div class="value">3.2K RON</div>
                </div>
                <div class="stat-card">
                    <div class="label">Client Satisfaction</div>
                    <div class="value">94%</div>
                </div>
            </div>
        </div>
        <div class="page" id="gm-budget">
            <div class="page-header">
                <h1>💰 Budget & AI Optimization</h1>
                <p>Optimizare buget prin AI</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="label">Monthly Budget</div>
                    <div class="value">28K RON</div>
                </div>
                <div class="stat-card">
                    <div class="label">Spent This Month</div>
                    <div class="value">18.5K RON</div>
                </div>
                <div class="stat-card">
                    <div class="label">AI Savings</div>
                    <div class="value">4.2K RON</div>
                </div>
            </div>
        </div>
    `;
    showPage('gm-core');
}

// ==========================================
// GM SPECIFIC FUNCTIONS
// ==========================================

function loadGMUsers() {
    // Funcție pentru încărcarea utilizatorilor din perspectivă GM
    console.log('Loading GM users...');
}

function loadGMGuests() {
    // Funcție pentru încărcarea invitaților
    console.log('Loading GM guests...');
}

function loadGMCreier() {
    // Funcție pentru integrarea cu Creier AI
    console.log('Loading Creier AI...');
}

function loadGMSEO() {
    // Funcție pentru SEO analytics
    console.log('Loading SEO data...');
}

function loadGMAds() {
    // Funcție pentru ads management
    console.log('Loading Ads data...');
}

function loadGMPerformance() {
    // Funcție pentru performance analytics
    console.log('Loading Performance data...');
}

function loadGMBudget() {
    // Funcție pentru budget management
    console.log('Loading Budget data...');
}
