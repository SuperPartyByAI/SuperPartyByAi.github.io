// ═══════════════════════════════════════════════════════════════
// OPERATOR.JS - Funcții modul operator
// ═══════════════════════════════════════════════════════════════

let currentRolDetalii = null;

// ==========================================
// LOAD OPERATOR PAGES
// ==========================================

function loadOperatorPages() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <!-- HOME PAGE -->
        <div class="page active" id="home">
            <div class="page-header">
                <h1>🏠 Acasă</h1>
                <p>Bine ai venit, ${currentUser.name}!</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="label">Petreceri Astăzi</div>
                    <div class="value">3</div>
                </div>
                <div class="stat-card">
                    <div class="label">Luna Asta</div>
                    <div class="value">24</div>
                </div>
                <div class="stat-card">
                    <div class="label">Venit Total</div>
                    <div class="value">1240 RON</div>
                </div>
            </div>
        </div>
        
        <!-- NOTEAZA PAGE -->
        <div class="page" id="noteaza">
            <div class="page-header">
                <h1>➕ Notează Eveniment</h1>
                <p>Adaugă un eveniment nou</p>
            </div>
            <div style="max-width: 600px;">
                <div class="form-group">
                    <label>Personaj</label>
                    <input type="text" id="input-personaj" placeholder="Spider-Man, Elsa, etc.">
                </div>
                <div class="form-group">
                    <label>Data</label>
                    <input type="date" id="input-data">
                </div>
                <div class="form-group">
                    <label>Ora</label>
                    <input type="time" id="input-ora">
                </div>
                <button class="btn-primary">Salvează Eveniment</button>
            </div>
        </div>
        
        <!-- NEALOCATE PAGE -->
        <div class="page" id="nealocate">
            <div class="page-header">
                <h1>📋 Petreceri Nealocate</h1>
                <p>Evenimente disponibile</p>
            </div>
            <div id="nealocate-content">
                <div class="loading">⏳ Se încarcă...</div>
            </div>
        </div>
        
        <!-- PETRECERI MELE PAGE -->
        <div class="page" id="petreceri-mele">
            <div class="page-header">
                <h1>🎊 Ce Petreceri Am</h1>
                <p>Evenimentele tale alocate</p>
            </div>
            <div id="petreceri-mele-content">
                <div class="loading">⏳ Se încarcă...</div>
            </div>
        </div>
        
        <!-- TOTAL PAGE -->
        <div class="page" id="total">
            <div class="page-header">
                <h1>📈 Total Petreceri</h1>
                <p>Toate evenimentele</p>
            </div>
            <div id="total-content">
                <div class="loading">⏳ Se încarcă...</div>
            </div>
        </div>
        
        <!-- SOFERI PAGE -->
        <div class="page" id="soferi">
            <div class="page-header">
                <h1>🚗 Evenimente cu Șoferi</h1>
                <p>Gestionare transport</p>
            </div>
            <div class="no-events">
                <div class="icon">🚗</div>
                <h3>Sistem șoferi</h3>
                <p>Gestionare transport pentru evenimente</p>
            </div>
        </div>
        
        <!-- FACTURA PAGE -->
        <div class="page" id="factura">
            <div class="page-header">
                <h1>🧾 Cu Factură</h1>
                <p>Evenimente cu factură</p>
            </div>
            <div class="no-events">
                <div class="icon">🧾</div>
                <h3>Evenimente cu factură</h3>
            </div>
        </div>
        
        <!-- ECHIPA PAGE -->
        <div class="page" id="echipa">
            <div class="page-header">
                <h1>👥 Echipa</h1>
                <p>Membri echipei tale</p>
            </div>
            <div class="no-events">
                <div class="icon">👥</div>
                <h3>Echipa ta</h3>
                <p>Gestionare membri echipă</p>
            </div>
        </div>
        
        <!-- INVENTAR PAGE -->
        <div class="page" id="inventar">
            <div class="page-header">
                <h1>📦 Inventar</h1>
                <p>Gestionare materiale</p>
            </div>
            <div class="no-events">
                <div class="icon">📦</div>
                <h3>Inventar</h3>
                <p>Materiale și echipament</p>
            </div>
        </div>
        
        <!-- PINIATA PAGE -->
        <div class="page" id="piniata">
            <div class="page-header">
                <h1>🎯 Piniata</h1>
                <p>Gestionare piniata</p>
            </div>
            <div class="no-events">
                <div class="icon">🎯</div>
                <h3>Piniata</h3>
                <p>Sistem gestionare piniata</p>
            </div>
        </div>
        
        <!-- CONVERSATIONS PAGE -->
        <div class="page" id="conversations">
            <div class="page-header">
                <h1>💬 Conversații Clienți</h1>
                <p>Chat cu clienții</p>
            </div>
            <div class="no-events">
                <div class="icon">💬</div>
                <h3>Conversații</h3>
                <p>Sistem chat clienți</p>
            </div>
        </div>
    `;
    showPage('home');
}

// ==========================================
// LOAD DATA FUNCTIONS
// ==========================================

function loadNealocate() {
    const container = document.getElementById('nealocate-content');
    container.innerHTML = '<div class="loading">⏳ Se încarcă...</div>';
    
    apiCall('getNealocate', { userEmail: currentUser.email }, function(data) {
        if (data.success && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(event => renderEventCard(event)).join('');
        } else {
            container.innerHTML = '<div class="no-events"><div class="icon">📋</div><h3>Nu sunt petreceri nealocate</h3></div>';
        }
    });
}

function loadPetreceriMele() {
    const container = document.getElementById('petreceri-mele-content');
    container.innerHTML = '<div class="loading">⏳ Se încarcă...</div>';
    
    apiCall('getPetreceriMele', { userEmail: currentUser.email }, function(data) {
        if (data.success && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(event => renderEventCard(event)).join('');
        } else {
            container.innerHTML = '<div class="no-events"><div class="icon">🎊</div><h3>Nu ai petreceri alocate</h3></div>';
        }
    });
}

function loadTotalPetreceri() {
    const container = document.getElementById('total-content');
    container.innerHTML = '<div class="loading">⏳ Se încarcă...</div>';
    
    apiCall('getTotalPetreceri', { userEmail: currentUser.email }, function(data) {
        if (data.success && data.data && data.data.length > 0) {
            container.innerHTML = data.data.map(event => renderEventCard(event)).join('');
        } else {
            container.innerHTML = '<div class="no-events"><div class="icon">📈</div><h3>Nu sunt petreceri</h3></div>';
        }
    });
}

// ==========================================
// RENDER FUNCTIONS
// ==========================================

function renderEventCard(event) {
    const hasAllocation = event.ce_cod_ai;
    
    return `
        <div class="event-card" onclick="${hasAllocation ? `veziDetaliiRol('${event.id}')` : `openAlocareModal('${event.id}')`}">
            <div class="event-header">
                <div>
                    <div class="event-title">${event.personaj || 'Eveniment'}</div>
                    <div class="event-id">ID: ${event.id || event.cod || 'N/A'}</div>
                </div>
                ${hasAllocation ? `<div class="event-badge">Alocat: ${event.ce_cod_ai}</div>` : '<div class="event-badge">Nealocate</div>'}
            </div>
            
            <div class="event-details">
                <div class="event-detail">
                    <span class="icon">📅</span>
                    <span>${event.data || 'N/A'}</span>
                </div>
                <div class="event-detail">
                    <span class="icon">🕐</span>
                    <span>${event.ora || 'N/A'}</span>
                </div>
                <div class="event-detail">
                    <span class="icon">📍</span>
                    <span>${event.adresa || 'N/A'}</span>
                </div>
                <div class="event-detail">
                    <span class="icon">👤</span>
                    <span>Notat: ${event.cine_noteaza || 'N/A'}</span>
                </div>
            </div>
            
            ${hasAllocation ? `
                <div class="dovezi-status" onclick="event.stopPropagation();">
                    <div class="dovezi-status-title">📸 DOVEZI</div>
                    <div class="dovezi-etape">
                        <div class="etapa-icon validat" title="Bagaj - Validat">✓</div>
                        <div class="etapa-icon obligatoriu" title="Am ajuns - Obligatoriu">2</div>
                        <div class="etapa-icon blocat" title="Returnare - Blocat">3</div>
                    </div>
                </div>
            ` : ''}
            
            ${!hasAllocation ? '<div class="event-actions"><button class="btn-primary" onclick="event.stopPropagation(); openAlocareModal(\'' + event.id + '\')">🎯 Alocă</button></div>' : ''}
        </div>
    `;
}

// ==========================================
// EVENT ACTIONS
// ==========================================

function openAlocareModal(eventId) {
    console.log('Open alocare modal:', eventId);
    // Funcție stub - poate fi implementată mai târziu
}

function veziDetaliiRol(evenimentId) {
    console.log('🔍 veziDetaliiRol:', evenimentId);
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('rolDetaliiScreen').classList.add('active');
    incarcaDetaliiRol(evenimentId);
}

function inchideDetaliiRol() {
    document.getElementById('rolDetaliiScreen').classList.remove('active');
    document.getElementById('mainContent').style.display = 'block';
    currentRolDetalii = null;
}

function incarcaDetaliiRol(evenimentId) {
    const titleEl = document.getElementById('rolDetaliiTitle');
    const infoGrid = document.getElementById('rolInfoGrid');
    const etapeContainer = document.getElementById('etapeContainer');
    
    titleEl.textContent = 'Se încarcă...';
    infoGrid.innerHTML = '<div class="loading">⏳ Încărcare...</div>';
    etapeContainer.innerHTML = '';
    
    apiCall('getRolDetalii', { email: currentUser.code, evenimentId: evenimentId }, function(data) {
        if (!data.success) {
            infoGrid.innerHTML = '<div style="color:#ef4444;padding:20px;">❌ Eroare</div>';
            return;
        }
        
        currentRolDetalii = data.eveniment;
        titleEl.textContent = currentRolDetalii.rol + ' | ' + currentRolDetalii.data;
        
        infoGrid.innerHTML = '<div class="rol-info-item"><div class="rol-info-label">🎭 ROL</div><div class="rol-info-value">' + currentRolDetalii.rol + '</div></div>';
        etapeContainer.innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;">Sistem dovezi activ</div>';
    });
}
