// ═══════════════════════════════════════════════════════════
// SUPERPARTY v7.0 - PAGES.JS
// Page rendering logic - toate paginile app-ului
// Dashboard Performance cu comparații mega-detailed
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// RENDER PAGE (main router)
// ═══════════════════════════════════════════════════════════

/**
 * Render page by name
 */
async function renderPage(pageName) {
    const mainContent = document.getElementById('main-content');
    
    switch (pageName) {
        case 'dashboard':
            await renderDashboard();
            break;
        case 'events':
            await renderEvents();
            break;
        case 'inbox':
            await renderInbox();
            break;
        case 'profile':
            await renderProfile();
            break;
        case 'add-event':
            await renderAddEvent();
            break;
        case 'my-events':
            await renderMyEvents();
            break;
        case 'all-events':
            await renderAllEvents();
            break;
        case 'archived-events':
            await renderArchivedEvents();
            break;
        case 'my-performance':
            await renderMyPerformance();
            break;
        case 'my-earnings':
            await renderMyEarnings();
            break;
        case 'team-rankings':
            await renderTeamRankings();
            break;
        case 'admin-dashboard':
            await renderAdminDashboard();
            break;
        case 'admin-users':
            await renderAdminUsers();
            break;
        case 'admin-broadcast':
            await renderAdminBroadcast();
            break;
        case 'admin-archive':
            await renderAdminArchive();
            break;
        case 'admin-reports':
            await renderAdminReports();
            break;
        case 'settings':
            await renderSettings();
            break;
        default:
            mainContent.innerHTML = '<p>Pagina nu a fost găsită</p>';
    }
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD - PERFORMANCE MEGA-DETAILED
// ═══════════════════════════════════════════════════════════

/**
 * Render dashboard cu performance stats
 */
async function renderDashboard() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = '<div class="loading-spinner"></div>';
    
    try {
        // Load dashboard data
        const response = await API.getPerformanceDashboard();
        
        if (!response.success) {
            throw new Error(response.error || 'Failed to load dashboard');
        }
        
        const dashboard = response.dashboard;
        
        // Render
        mainContent.innerHTML = `
            <div class="dashboard-container">
                
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <h2>Bună, ${AppState.user.name || AppState.user.userId}! 👋</h2>
                    <p class="user-code">Cod: ${AppState.user.cod || '-'}</p>
                </div>
                
                <!-- Quick Stats Today -->
                ${renderQuickStatsToday(dashboard.daily)}
                
                <!-- Comparisons -->
                <div class="section">
                    <h3>📊 Comparații</h3>
                    
                    <!-- Today vs Yesterday -->
                    ${renderDailyComparison(dashboard.daily)}
                    
                    <!-- This Week vs Last Week -->
                    ${renderWeeklyComparison(dashboard.weekly)}
                    
                    <!-- This Month -->
                    ${renderMonthlyStats(dashboard.monthly)}
                    
                    <!-- This Month vs Last Month -->
                    ${renderMonthlyComparison(dashboard.monthlyComparison)}
                </div>
                
                <!-- Rankings -->
                ${renderRankingsPreview(dashboard.rankings)}
                
                <!-- Team Stats (doar pentru traineri) -->
                ${dashboard.teamStats ? renderTeamStatsPreview(dashboard.teamStats) : ''}
                
                <!-- Achievements -->
                ${renderAchievements(dashboard.achievements)}
                
            </div>
        `;
        
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        mainContent.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <p style="color: var(--error);">Eroare la încărcarea dashboard-ului</p>
                <button class="btn btn-primary" onclick="renderPage('dashboard')">
                    Încearcă din nou
                </button>
            </div>
        `;
    }
}

/**
 * Render quick stats TODAY
 */
function renderQuickStatsToday(daily) {
    const today = daily.today;
    
    return `
        <div class="quick-stats">
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value">${formatCurrency(today.totalEarnings)}</div>
                <div class="stat-label">Azi</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🎉</div>
                <div class="stat-value">${today.eventsCompleted}</div>
                <div class="stat-label">Petreceri</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">⏰</div>
                <div class="stat-value">${today.hoursWorked}h</div>
                <div class="stat-label">Ore lucrate</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📸</div>
                <div class="stat-value">${today.doveziCompletePercent}%</div>
                <div class="stat-label">Dovezi</div>
            </div>
        </div>
    `;
}

/**
 * Render daily comparison (TODAY vs YESTERDAY)
 */
function renderDailyComparison(daily) {
    const summary = daily.summary;
    
    return `
        <div class="comparison-card">
            <h4>Azi vs Ieri</h4>
            
            <div class="comparison-row">
                <div class="comparison-label">Câștiguri</div>
                <div class="comparison-values">
                    <span class="value-main">${formatCurrency(summary.earnings.today)}</span>
                    <span class="value-trend ${getTrendClass(summary.earnings.trend)}">
                        ${getTrendIcon(summary.earnings.trend)}
                        ${summary.earnings.diffPercent > 0 ? '+' : ''}${summary.earnings.diffPercent}%
                        (${summary.earnings.diff > 0 ? '+' : ''}${formatCurrency(summary.earnings.diff)})
                    </span>
                </div>
            </div>
            
            <div class="comparison-row">
                <div class="comparison-label">Evenimente</div>
                <div class="comparison-values">
                    <span class="value-main">${summary.events.today}</span>
                    <span class="value-trend ${getTrendClass(summary.events.trend)}">
                        ${getTrendIcon(summary.events.trend)}
                        ${summary.events.diff > 0 ? '+' : ''}${summary.events.diff}
                    </span>
                </div>
            </div>
            
            <div class="comparison-row">
                <div class="comparison-label">Ore</div>
                <div class="comparison-values">
                    <span class="value-main">${summary.hours.today}h</span>
                    <span class="value-trend ${getTrendClass(summary.hours.trend)}">
                        ${getTrendIcon(summary.hours.trend)}
                        ${summary.hours.diff > 0 ? '+' : ''}${summary.hours.diff}h
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render weekly comparison (THIS WEEK vs LAST WEEK)
 */
function renderWeeklyComparison(weekly) {
    const summary = weekly.summary;
    
    return `
        <div class="comparison-card">
            <h4>Săptămâna Asta vs Săptămâna Trecută</h4>
            
            <div class="comparison-row">
                <div class="comparison-label">Total Câștiguri</div>
                <div class="comparison-values">
                    <span class="value-main">${formatCurrency(summary.earnings.thisWeek)}</span>
                    <span class="value-trend ${getTrendClass(summary.earnings.trend)}">
                        ${getTrendIcon(summary.earnings.trend)}
                        ${summary.earnings.diffPercent > 0 ? '+' : ''}${summary.earnings.diffPercent}%
                        (${summary.earnings.diff > 0 ? '+' : ''}${formatCurrency(summary.earnings.diff)})
                    </span>
                </div>
            </div>
            
            <div class="comparison-row">
                <div class="comparison-label">Mediu pe Zi</div>
                <div class="comparison-values">
                    <span class="value-main">${formatCurrency(summary.avgPerDay.thisWeek)}/zi</span>
                    <span class="value-trend ${getTrendClass(summary.avgPerDay.trend)}">
                        ${getTrendIcon(summary.avgPerDay.trend)}
                        ${summary.avgPerDay.diff > 0 ? '+' : ''}${formatCurrency(summary.avgPerDay.diff)}
                    </span>
                </div>
            </div>
            
            <div class="comparison-row">
                <div class="comparison-label">Evenimente</div>
                <div class="comparison-values">
                    <span class="value-main">${summary.events.thisWeek}</span>
                    <span class="value-trend ${getTrendClass(summary.events.trend)}">
                        ${getTrendIcon(summary.events.trend)}
                        ${summary.events.diff > 0 ? '+' : ''}${summary.events.diff}
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render monthly stats (TOTAL NIVEL)
 */
function renderMonthlyStats(monthly) {
    const stats = monthly.stats;
    const progress = monthly.progress;
    const projected = monthly.projected;
    
    return `
        <div class="comparison-card">
            <h4>Luna Curentă - Total Nivel</h4>
            
            <div class="progress-bar-container">
                <div class="progress-bar-label">
                    <span>Zi ${progress.daysPassed} din ${progress.daysInMonth}</span>
                    <span>${progress.percentComplete}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.percentComplete}%"></div>
                </div>
            </div>
            
            <div class="comparison-row">
                <div class="comparison-label">Câștiguri Acumulate</div>
                <div class="comparison-values">
                    <span class="value-main">${formatCurrency(stats.totalEarnings)}</span>
                </div>
            </div>
            
            <div class="comparison-row">
                <div class="comparison-label">Proiecție Finală</div>
                <div class="comparison-values">
                    <span class="value-main">${formatCurrency(projected.totalEarnings)}</span>
                    <span class="value-trend ${projected.onTrack ? 'trend-up' : 'trend-down'}">
                        ${projected.onTrack ? '✅ On Track' : '⚠️ Sub țintă'}
                    </span>
                </div>
            </div>
            
            <div class="comparison-row">
                <div class="comparison-label">Evenimente</div>
                <div class="comparison-values">
                    <span class="value-main">${stats.eventsCompleted}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render monthly comparison (THIS MONTH vs LAST MONTH)
 */
function renderMonthlyComparison(monthlyComp) {
    const summary = monthlyComp.summary;
    
    return `
        <div class="comparison-card">
            <h4>Luna Asta vs Luna Trecută</h4>
            
            <div class="comparison-row">
                <div class="comparison-label">Total Câștiguri</div>
                <div class="comparison-values">
                    <span class="value-main">${formatCurrency(summary.earnings.thisMonth)}</span>
                    <span class="value-trend ${getTrendClass(summary.earnings.trend)}">
                        ${getTrendIcon(summary.earnings.trend)}
                        ${summary.earnings.diffPercent > 0 ? '+' : ''}${summary.earnings.diffPercent}%
                    </span>
                </div>
            </div>
            
            <div class="comparison-row">
                <div class="comparison-label">Vs Luna Trecută</div>
                <div class="comparison-values">
                    <span class="value-secondary">${formatCurrency(summary.earnings.lastMonth)}</span>
                    <span class="value-trend ${getTrendClass(summary.earnings.trend)}">
                        ${summary.earnings.diff > 0 ? '+' : ''}${formatCurrency(summary.earnings.diff)}
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render rankings preview
 */
function renderRankingsPreview(rankings) {
    if (!rankings) return '';
    
    const isTrainer = rankings.currentUserIsTrainer;
    const relevantRankings = isTrainer ? rankings.trainers : rankings.operators;
    const title = isTrainer ? '🏆 Top Traineri' : '🏆 Top Operatori';
    
    return `
        <div class="section">
            <h3>${title}</h3>
            
            <div class="rankings-preview">
                ${relevantRankings.top3.map((item, index) => `
                    <div class="ranking-item rank-${index + 1}">
                        <div class="rank-badge">${getRankBadge(index + 1)}</div>
                        <div class="rank-info">
                            <div class="rank-name">${item.name || item.cod}</div>
                            <div class="rank-value">${formatCurrency(item.earnings || item.totalEarnings)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${relevantRankings.currentUser ? `
                <div class="current-user-rank">
                    <span>Poziția ta: #${relevantRankings.currentUser.rank}</span>
                    <span>${formatCurrency(relevantRankings.currentUser.earnings || relevantRankings.currentUser.totalEarnings)}</span>
                </div>
            ` : ''}
            
            <button class="btn btn-text" onclick="loadPage('team-rankings')">
                Vezi clasamentul complet →
            </button>
        </div>
    `;
}

/**
 * Render team stats preview (pentru traineri)
 */
function renderTeamStatsPreview(teamStats) {
    return `
        <div class="section">
            <h3>👥 Echipa Mea (${teamStats.teamCode})</h3>
            
            <div class="team-stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${teamStats.teamSize}</div>
                    <div class="stat-label">Operatori</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-value">${formatCurrency(teamStats.totalEarnings)}</div>
                    <div class="stat-label">Total Echipă</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-value">${formatCurrency(teamStats.avgEarningsPerOperator)}</div>
                    <div class="stat-label">Mediu/Operator</div>
                </div>
            </div>
            
            <div class="team-top-performers">
                <h4>Top Performeri</h4>
                ${teamStats.topPerformers.slice(0, 3).map((op, index) => `
                    <div class="performer-item">
                        <span class="performer-rank">${index + 1}</span>
                        <span class="performer-name">${op.name || op.cod}</span>
                        <span class="performer-value">${formatCurrency(op.earnings)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Render achievements
 */
function renderAchievements(achievements) {
    return `
        <div class="section">
            <h3>🏅 Realizări</h3>
            
            <div class="achievements-grid">
                <div class="achievement-card">
                    <div class="achievement-icon">🎉</div>
                    <div class="achievement-value">${achievements.totalEvents || 0}</div>
                    <div class="achievement-label">Petreceri Total</div>
                </div>
                
                <div class="achievement-card">
                    <div class="achievement-icon">💰</div>
                    <div class="achievement-value">${formatCurrency(achievements.totalEarnings || 0)}</div>
                    <div class="achievement-label">Câștiguri Total</div>
                </div>
                
                <div class="achievement-card">
                    <div class="achievement-icon">⭐</div>
                    <div class="achievement-value">${achievements.avgRating || 0}</div>
                    <div class="achievement-label">Rating Mediu</div>
                </div>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get trend class
 */
function getTrendClass(trend) {
    if (trend === 'up') return 'trend-up';
    if (trend === 'down') return 'trend-down';
    return 'trend-same';
}

/**
 * Get trend icon
 */
function getTrendIcon(trend) {
    if (trend === 'up') return '🔺';
    if (trend === 'down') return '🔻';
    return '➡️';
}

/**
 * Get rank badge
 */
function getRankBadge(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
}

// ═══════════════════════════════════════════════════════════
// OTHER PAGES (placeholders - să fie implementate după)
// ═══════════════════════════════════════════════════════════

async function renderEvents() {
    const content = document.getElementById('main-content');
    
    // Loading state
    content.innerHTML = `
        <div class="section">
            <div class="loading">Se încarcă evenimente...</div>
        </div>
    `;
    
    try {
        // Get all events
        const response = await API.getEvents({ status: 'active' });
        
        if (!response.success) {
            throw new Error(response.error || 'Eroare la încărcarea evenimentelor');
        }
        
        const events = response.events || [];
        
        // Render page
        content.innerHTML = `
            <div class="section">
                <div class="section-header">
                    <h2>Toate Petrecerile</h2>
                    <button class="btn btn-primary" onclick="renderPage('add-event')">
                        <span class="icon">➕</span> Adaugă Petrecere
                    </button>
                </div>
                
                <!-- Filters -->
                <div class="filters-container">
                    <div class="filter-group">
                        <input type="text" 
                               id="search-events" 
                               class="input" 
                               placeholder="Caută după nume, telefon, adresă...">
                    </div>
                    
                    <div class="filter-group">
                        <select id="filter-status" class="input">
                            <option value="all">Toate statusurile</option>
                            <option value="active" selected>Active</option>
                            <option value="completed">Completate</option>
                            <option value="cancelled">Anulate</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <select id="filter-trainer" class="input">
                            <option value="all">Toți trainerii</option>
                            ${getTrainerOptions()}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <input type="date" id="filter-date-from" class="input" placeholder="Data de la">
                    </div>
                    
                    <div class="filter-group">
                        <input type="date" id="filter-date-to" class="input" placeholder="Data până la">
                    </div>
                    
                    <button class="btn btn-secondary" onclick="applyEventsFilters()">
                        🔍 Filtrează
                    </button>
                    
                    <button class="btn btn-outline" onclick="clearEventsFilters()">
                        ✖️ Resetează
                    </button>
                </div>
                
                <!-- Events count -->
                <div class="events-count">
                    <strong>${events.length}</strong> petreceri găsite
                </div>
                
                <!-- Events list -->
                <div id="events-list" class="events-list">
                    ${events.length > 0 ? renderEventsList(events) : '<p class="text-center">Nu sunt evenimente.</p>'}
                </div>
            </div>
        `;
        
        // Setup search
        setupEventsSearch();
        
    } catch (error) {
        content.innerHTML = `
            <div class="section">
                <div class="error-message">
                    ❌ ${error.message}
                </div>
                <button class="btn btn-primary" onclick="renderPage('events')">
                    🔄 Încearcă din nou
                </button>
            </div>
        `;
    }
}

/**
 * Render events list
 */
function renderEventsList(events) {
    return events.map(event => `
        <div class="event-card" onclick="openEventDetails('${event.id}')">
            <div class="event-header">
                <div class="event-id">${event.id}</div>
                <div class="event-status status-${event.status}">${getStatusLabel(event.status)}</div>
            </div>
            
            <div class="event-body">
                <div class="event-info">
                    <div class="event-client">
                        <strong>👤 ${event.numeClient}</strong>
                    </div>
                    <div class="event-details">
                        📱 ${formatPhone(event.telefon)}<br>
                        📍 ${event.adresa}<br>
                        📅 ${formatDateTime(event.dataOra)}<br>
                        💰 ${formatCurrency(event.pret)} RON
                    </div>
                </div>
                
                ${event.trainer ? `
                    <div class="event-trainer">
                        <span class="trainer-badge">${event.trainer}</span>
                    </div>
                ` : ''}
                
                ${event.roles && event.roles.length > 0 ? `
                    <div class="event-roles">
                        <strong>Roluri:</strong> ${event.roles.map(r => r.name).join(', ')}
                    </div>
                ` : ''}
            </div>
            
            <div class="event-footer">
                <button class="btn-icon" onclick="editEvent('${event.id}'); event.stopPropagation();">
                    ✏️
                </button>
                <button class="btn-icon" onclick="viewEventDetails('${event.id}'); event.stopPropagation();">
                    👁️
                </button>
                ${event.canArchive ? `
                    <button class="btn-icon" onclick="archiveEventFromList('${event.id}'); event.stopPropagation();">
                        📦
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Get trainer options for filter
 */
function getTrainerOptions() {
    const trainers = ['Atrainer', 'Btrainer', 'Ctrainer', 'Dtrainer', 'Etrainer', 
                     'Ftrainer', 'Gtrainer', 'Htrainer', 'Itrainer', 'Jtrainer',
                     'Ktrainer', 'Ltrainer', 'Mtrainer', 'Ntrainer', 'Otrainer',
                     'Ptrainer', 'Qtrainer', 'Rtrainer', 'Strainer', 'Ttrainer',
                     'Utrainer', 'Vtrainer', 'Wtrainer', 'Xtrainer', 'Ytrainer', 'Ztrainer'];
    
    return trainers.map(t => `<option value="${t}">${t}</option>`).join('');
}

/**
 * Get status label
 */
function getStatusLabel(status) {
    const labels = {
        'active': '🟢 Activ',
        'completed': '✅ Completat',
        'cancelled': '❌ Anulat',
        'pending': '🟡 În așteptare'
    };
    return labels[status] || status;
}

/**
 * Setup events search
 */
function setupEventsSearch() {
    const searchInput = document.getElementById('search-events');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            applyEventsFilters();
        }, 300));
    }
}

/**
 * Apply events filters
 */
async function applyEventsFilters() {
    const search = document.getElementById('search-events')?.value || '';
    const status = document.getElementById('filter-status')?.value || 'all';
    const trainer = document.getElementById('filter-trainer')?.value || 'all';
    const dateFrom = document.getElementById('filter-date-from')?.value || '';
    const dateTo = document.getElementById('filter-date-to')?.value || '';
    
    const filters = {
        search: search,
        status: status !== 'all' ? status : undefined,
        trainer: trainer !== 'all' ? trainer : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
    };
    
    try {
        const response = await API.getEvents(filters);
        
        if (response.success) {
            const events = response.events || [];
            const listContainer = document.getElementById('events-list');
            listContainer.innerHTML = events.length > 0 ? 
                renderEventsList(events) : 
                '<p class="text-center">Nu sunt evenimente care să corespundă filtrelor.</p>';
            
            // Update count
            document.querySelector('.events-count strong').textContent = events.length;
        }
    } catch (error) {
        showToast('Eroare la aplicarea filtrelor: ' + error.message, 'error');
    }
}

/**
 * Clear events filters
 */
function clearEventsFilters() {
    document.getElementById('search-events').value = '';
    document.getElementById('filter-status').value = 'active';
    document.getElementById('filter-trainer').value = 'all';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    
    applyEventsFilters();
}

/**
 * Open event details
 */
function openEventDetails(eventId) {
    // TODO: Implement event details modal/page
    showToast('Detalii eveniment ' + eventId, 'info');
}

/**
 * Edit event
 */
function editEvent(eventId) {
    // TODO: Implement edit event
    showToast('Editează eveniment ' + eventId, 'info');
}

/**
 * View event details
 */
function viewEventDetails(eventId) {
    // TODO: Implement view details
    showToast('Vezi detalii ' + eventId, 'info');
}

/**
 * Archive event from list
 */
async function archiveEventFromList(eventId) {
    if (!confirm('Sigur vrei să arhivezi acest eveniment?')) {
        return;
    }
    
    try {
        const response = await API.archiveEvent(eventId);
        
        if (response.success) {
            showToast('✅ Eveniment arhivat cu succes!', 'success');
            renderPage('events'); // Reload
        } else {
            throw new Error(response.error || 'Eroare la arhivare');
        }
    } catch (error) {
        showToast('❌ ' + error.message, 'error');
    }
}

async function renderInbox() {
    document.getElementById('main-content').innerHTML = `
        <div class="section">
            <h2>Inbox</h2>
            <p>Notificări (vezi panelul din dreapta)</p>
        </div>
    `;
}

async function renderProfile() {
    const content = document.getElementById('main-content');
    
    const user = AppState.user;
    const isTrainer = user.cod && user.cod.includes('trainer');
    
    content.innerHTML = `
        <div class="section">
            <div class="section-header">
                <h2>Profilul Meu</h2>
                <button class="btn btn-outline" onclick="editProfile()">
                    ✏️ Editează
                </button>
            </div>
            
            <!-- User info card -->
            <div class="profile-card">
                <div class="profile-avatar">
                    ${getAvatarInitials(user.name || user.userId)}
                </div>
                <div class="profile-info">
                    <h3>${user.name || user.userId}</h3>
                    <div class="profile-badge ${isTrainer ? 'trainer' : 'operator'}">
                        ${isTrainer ? '👑 Trainer' : '👤 Operator'}
                    </div>
                </div>
            </div>
            
            <!-- Details -->
            <div class="profile-details">
                <div class="detail-section">
                    <h4>📧 Informații Contact</h4>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${user.email || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Telefon:</span>
                        <span class="detail-value">${user.phone || '-'}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>🆔 Informații Cont</h4>
                    <div class="detail-item">
                        <span class="detail-label">Cod:</span>
                        <span class="detail-value"><strong>${user.cod || '-'}</strong></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Rol:</span>
                        <span class="detail-value">${user.role || '-'}</span>
                    </div>
                    ${isTrainer ? `
                        <div class="detail-item">
                            <span class="detail-label">Echipă:</span>
                            <span class="detail-value">${user.cod.charAt(0)}1 - ${user.cod.charAt(0)}50</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="detail-section">
                    <h4>📊 Statistici</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">${user.stats?.totalEvents || 0}</div>
                            <div class="stat-label">Evenimente Total</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${user.stats?.totalHours || 0}h</div>
                            <div class="stat-label">Ore Lucrate</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${formatCurrency(user.stats?.totalEarnings || 0)}</div>
                            <div class="stat-label">Câștiguri Totale</div>
                        </div>
                        ${isTrainer ? `
                            <div class="stat-item">
                                <div class="stat-value">${user.stats?.teamSize || 50}</div>
                                <div class="stat-label">Membri Echipă</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>🔒 Securitate</h4>
                    <button class="btn btn-outline" onclick="changePassword()">
                        🔑 Schimbă Parola
                    </button>
                </div>
                
                <div class="detail-section">
                    <h4>🔔 Setări Notificări</h4>
                    <label class="checkbox-label">
                        <input type="checkbox" id="notify-events" ${user.settings?.notifyEvents !== false ? 'checked' : ''} onchange="updateNotificationSettings()">
                        <span>Notifică-mă despre evenimente noi</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="notify-payments" ${user.settings?.notifyPayments !== false ? 'checked' : ''} onchange="updateNotificationSettings()">
                        <span>Notifică-mă despre plăți</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="notify-reminders" ${user.settings?.notifyReminders !== false ? 'checked' : ''} onchange="updateNotificationSettings()">
                        <span>Notifică-mă cu reminder-e</span>
                    </label>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get avatar initials
 */
function getAvatarInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
}

/**
 * Edit profile
 */
function editProfile() {
    // TODO: Implement edit profile modal
    showToast('Editare profil - coming soon', 'info');
}

/**
 * Change password
 */
function changePassword() {
    // TODO: Implement change password modal
    showToast('Schimbare parolă - coming soon', 'info');
}

/**
 * Update notification settings
 */
async function updateNotificationSettings() {
    const settings = {
        notifyEvents: document.getElementById('notify-events').checked,
        notifyPayments: document.getElementById('notify-payments').checked,
        notifyReminders: document.getElementById('notify-reminders').checked
    };
    
    try {
        const response = await API.updateUserSettings(settings);
        if (response.success) {
            showToast('✅ Setări actualizate!', 'success');
        }
    } catch (error) {
        showToast('❌ Eroare la actualizare setări', 'error');
    }
}

async function renderAddEvent() {
    const content = document.getElementById('main-content');
    
    content.innerHTML = `
        <div class="section">
            <div class="section-header">
                <h2>Adaugă Petrecere Nouă</h2>
                <button class="btn btn-outline" onclick="renderPage('events')">
                    ← Înapoi
                </button>
            </div>
            
            <form id="add-event-form" class="form">
                <!-- Step indicator -->
                <div class="steps-indicator">
                    <div class="step active" data-step="1">
                        <div class="step-number">1</div>
                        <div class="step-label">Date Client</div>
                    </div>
                    <div class="step" data-step="2">
                        <div class="step-number">2</div>
                        <div class="step-label">Detalii Petrecere</div>
                    </div>
                    <div class="step" data-step="3">
                        <div class="step-number">3</div>
                        <div class="step-label">Confirmă</div>
                    </div>
                </div>
                
                <!-- Step 1: Date Client -->
                <div class="form-step active" data-step="1">
                    <h3>Date Client</h3>
                    
                    <div class="form-group">
                        <label for="client-phone">Telefon Client *</label>
                        <input type="tel" 
                               id="client-phone" 
                               class="input" 
                               placeholder="0744123456"
                               pattern="[0-9]{10}"
                               required>
                        <small>Introduceți 10 cifre (ex: 0744123456)</small>
                        <div id="client-info" class="client-info"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="client-name">Nume Client *</label>
                        <input type="text" 
                               id="client-name" 
                               class="input" 
                               placeholder="Ex: Maria Popescu"
                               required>
                    </div>
                    
                    <div class="form-group">
                        <label for="client-email">Email Client</label>
                        <input type="email" 
                               id="client-email" 
                               class="input" 
                               placeholder="email@exemplu.ro">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary" onclick="nextFormStep(2)">
                            Următorul →
                        </button>
                    </div>
                </div>
                
                <!-- Step 2: Detalii Petrecere -->
                <div class="form-step" data-step="2">
                    <h3>Detalii Petrecere</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="event-date">Data Petrecere *</label>
                            <input type="date" 
                                   id="event-date" 
                                   class="input"
                                   min="${getTodayDate()}"
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="event-time">Ora *</label>
                            <input type="time" 
                                   id="event-time" 
                                   class="input"
                                   required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="event-address">Adresa *</label>
                        <input type="text" 
                               id="event-address" 
                               class="input" 
                               placeholder="Str. Exemplu, Nr. 1, București"
                               required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="event-duration">Durată (ore) *</label>
                            <input type="number" 
                                   id="event-duration" 
                                   class="input" 
                                   min="1" 
                                   max="8" 
                                   value="2"
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="event-price">Preț (RON) *</label>
                            <input type="number" 
                                   id="event-price" 
                                   class="input" 
                                   min="0" 
                                   step="50"
                                   placeholder="1500"
                                   required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="event-type">Tip Eveniment *</label>
                        <select id="event-type" class="input" required>
                            <option value="">Selectează...</option>
                            <option value="aniversare">Aniversare</option>
                            <option value="botez">Botez</option>
                            <option value="nunta">Nuntă</option>
                            <option value="corporate">Corporate</option>
                            <option value="altele">Altele</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="event-trainer">Trainer Responsabil</label>
                        <select id="event-trainer" class="input">
                            <option value="">Auto-assign</option>
                            ${getTrainerOptions()}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="event-notes">Notițe</label>
                        <textarea id="event-notes" 
                                  class="input" 
                                  rows="3" 
                                  placeholder="Notițe suplimentare despre petrecere..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="prevFormStep(1)">
                            ← Înapoi
                        </button>
                        <button type="button" class="btn btn-primary" onclick="nextFormStep(3)">
                            Următorul →
                        </button>
                    </div>
                </div>
                
                <!-- Step 3: Confirmă -->
                <div class="form-step" data-step="3">
                    <h3>Confirmă Datele</h3>
                    
                    <div id="event-summary" class="event-summary">
                        <!-- Will be populated by JS -->
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="prevFormStep(2)">
                            ← Înapoi
                        </button>
                        <button type="submit" class="btn btn-success">
                            ✅ Creează Petrecere
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    
    // Setup form handlers
    setupAddEventForm();
}

/**
 * Setup add event form
 */
function setupAddEventForm() {
    const form = document.getElementById('add-event-form');
    const phoneInput = document.getElementById('client-phone');
    
    // Phone input - check for existing client
    if (phoneInput) {
        phoneInput.addEventListener('blur', async function() {
            const phone = this.value.trim();
            if (phone.length === 10) {
                await checkExistingClient(phone);
            }
        });
    }
    
    // Form submit
    if (form) {
        form.addEventListener('submit', handleAddEventSubmit);
    }
}

/**
 * Check for existing client
 */
async function checkExistingClient(phone) {
    try {
        const response = await API.identifyClient(phone);
        
        if (response.success && response.client) {
            const client = response.client;
            const clientInfo = document.getElementById('client-info');
            
            // Show client info
            clientInfo.innerHTML = `
                <div class="alert alert-info">
                    <strong>👤 Client Existent!</strong><br>
                    ${client.nume}<br>
                    ${client.totalPetreceri || 0} petreceri anterioare
                    ${client.nextBirthday ? `<br>🎂 Următoarea aniversare: ${client.nextBirthday}` : ''}
                </div>
            `;
            
            // Auto-fill name if empty
            const nameInput = document.getElementById('client-name');
            if (!nameInput.value && client.nume) {
                nameInput.value = client.nume;
            }
        }
    } catch (error) {
        console.error('Error checking client:', error);
    }
}

/**
 * Next form step
 */
function nextFormStep(step) {
    // Validate current step
    const currentStep = document.querySelector('.form-step.active');
    const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    if (!isValid) {
        showToast('❌ Completează toate câmpurile obligatorii!', 'error');
        return;
    }
    
    // Special validation for phone
    if (step === 2) {
        const phone = document.getElementById('client-phone').value.trim();
        if (phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
            showToast('❌ Telefonul trebuie să aibă exact 10 cifre!', 'error');
            return;
        }
    }
    
    // Show summary in step 3
    if (step === 3) {
        showEventSummary();
    }
    
    // Switch to next step
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Previous form step
 */
function prevFormStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Show event summary
 */
function showEventSummary() {
    const summary = {
        clientName: document.getElementById('client-name').value,
        clientPhone: document.getElementById('client-phone').value,
        clientEmail: document.getElementById('client-email').value,
        eventDate: document.getElementById('event-date').value,
        eventTime: document.getElementById('event-time').value,
        eventAddress: document.getElementById('event-address').value,
        eventDuration: document.getElementById('event-duration').value,
        eventPrice: document.getElementById('event-price').value,
        eventType: document.getElementById('event-type').value,
        eventTrainer: document.getElementById('event-trainer').value,
        eventNotes: document.getElementById('event-notes').value
    };
    
    const summaryContainer = document.getElementById('event-summary');
    summaryContainer.innerHTML = `
        <div class="summary-card">
            <h4>👤 Date Client</h4>
            <p><strong>Nume:</strong> ${summary.clientName}</p>
            <p><strong>Telefon:</strong> ${formatPhone(summary.clientPhone)}</p>
            ${summary.clientEmail ? `<p><strong>Email:</strong> ${summary.clientEmail}</p>` : ''}
        </div>
        
        <div class="summary-card">
            <h4>🎉 Detalii Petrecere</h4>
            <p><strong>Data:</strong> ${formatDate(summary.eventDate)} la ${summary.eventTime}</p>
            <p><strong>Adresa:</strong> ${summary.eventAddress}</p>
            <p><strong>Durată:</strong> ${summary.eventDuration} ore</p>
            <p><strong>Preț:</strong> ${formatCurrency(summary.eventPrice)} RON</p>
            <p><strong>Tip:</strong> ${getEventTypeLabel(summary.eventType)}</p>
            ${summary.eventTrainer ? `<p><strong>Trainer:</strong> ${summary.eventTrainer}</p>` : ''}
            ${summary.eventNotes ? `<p><strong>Notițe:</strong> ${summary.eventNotes}</p>` : ''}
        </div>
    `;
}

/**
 * Get event type label
 */
function getEventTypeLabel(type) {
    const labels = {
        'aniversare': '🎂 Aniversare',
        'botez': '👶 Botez',
        'nunta': '💒 Nuntă',
        'corporate': '🏢 Corporate',
        'altele': '🎈 Altele'
    };
    return labels[type] || type;
}

/**
 * Handle add event submit
 */
async function handleAddEventSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Se creează...';
    
    try {
        const eventData = {
            numeClient: document.getElementById('client-name').value.trim(),
            telefon: document.getElementById('client-phone').value.trim(),
            email: document.getElementById('client-email').value.trim(),
            data: document.getElementById('event-date').value,
            ora: document.getElementById('event-time').value,
            adresa: document.getElementById('event-address').value.trim(),
            durata: parseInt(document.getElementById('event-duration').value),
            pret: parseFloat(document.getElementById('event-price').value),
            tip: document.getElementById('event-type').value,
            trainer: document.getElementById('event-trainer').value || null,
            notite: document.getElementById('event-notes').value.trim()
        };
        
        const response = await API.createEvent(eventData);
        
        if (response.success) {
            showToast('✅ Petrecere creată cu succes!', 'success');
            
            // Redirect to events list after 1 second
            setTimeout(() => {
                renderPage('events');
            }, 1000);
        } else {
            throw new Error(response.error || 'Eroare la crearea petrecerii');
        }
        
    } catch (error) {
        showToast('❌ ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '✅ Creează Petrecere';
    }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

async function renderMyEvents() {
    const content = document.getElementById('main-content');
    
    // Loading state
    content.innerHTML = `
        <div class="section">
            <div class="loading">Se încarcă petrecerile tale...</div>
        </div>
    `;
    
    try {
        // Get user's events (where they are assigned)
        const userCod = AppState.user.cod;
        const response = await API.getEvents({ 
            assignedTo: userCod,
            status: 'active'
        });
        
        if (!response.success) {
            throw new Error(response.error || 'Eroare la încărcarea evenimentelor');
        }
        
        const events = response.events || [];
        
        // Group events by status
        const upcoming = events.filter(e => new Date(e.dataOra) > new Date());
        const past = events.filter(e => new Date(e.dataOra) <= new Date());
        
        // Render page
        content.innerHTML = `
            <div class="section">
                <div class="section-header">
                    <h2>Petrecerile Mele</h2>
                    <div class="header-stats">
                        <span class="stat-badge">📅 Viitoare: ${upcoming.length}</span>
                        <span class="stat-badge">✅ Trecute: ${past.length}</span>
                    </div>
                </div>
                
                <!-- Filter tabs -->
                <div class="tabs">
                    <button class="tab active" data-tab="upcoming" onclick="switchMyEventsTab('upcoming')">
                        📅 Viitoare (${upcoming.length})
                    </button>
                    <button class="tab" data-tab="past" onclick="switchMyEventsTab('past')">
                        ✅ Trecute (${past.length})
                    </button>
                </div>
                
                <!-- Upcoming events -->
                <div id="tab-upcoming" class="tab-content active">
                    ${upcoming.length > 0 ? renderMyEventsList(upcoming, true) : 
                      '<p class="text-center">Nu ai evenimente viitoare.</p>'}
                </div>
                
                <!-- Past events -->
                <div id="tab-past" class="tab-content">
                    ${past.length > 0 ? renderMyEventsList(past, false) : 
                      '<p class="text-center">Nu ai evenimente trecute.</p>'}
                </div>
            </div>
        `;
        
    } catch (error) {
        content.innerHTML = `
            <div class="section">
                <div class="error-message">
                    ❌ ${error.message}
                </div>
                <button class="btn btn-primary" onclick="renderPage('my-events')">
                    🔄 Încearcă din nou
                </button>
            </div>
        `;
    }
}

/**
 * Render my events list
 */
function renderMyEventsList(events, isUpcoming) {
    return `
        <div class="my-events-list">
            ${events.map(event => `
                <div class="my-event-card ${isUpcoming ? 'upcoming' : 'past'}">
                    <div class="event-date-badge">
                        <div class="date-day">${formatDay(event.dataOra)}</div>
                        <div class="date-month">${formatMonth(event.dataOra)}</div>
                    </div>
                    
                    <div class="event-content">
                        <div class="event-header">
                            <div class="event-title">
                                <strong>${event.numeClient}</strong>
                                <span class="event-id">${event.id}</span>
                            </div>
                            <div class="event-time">
                                🕐 ${formatTime(event.dataOra)}
                            </div>
                        </div>
                        
                        <div class="event-details">
                            <div class="detail-row">
                                <span class="icon">📍</span>
                                <span>${event.adresa}</span>
                            </div>
                            <div class="detail-row">
                                <span class="icon">📱</span>
                                <span>${formatPhone(event.telefon)}</span>
                            </div>
                            ${event.myRole ? `
                                <div class="detail-row">
                                    <span class="icon">🎭</span>
                                    <span><strong>Rolul meu:</strong> ${event.myRole}</span>
                                </div>
                            ` : ''}
                            ${event.myHours ? `
                                <div class="detail-row">
                                    <span class="icon">⏱️</span>
                                    <span><strong>Ore:</strong> ${event.myHours}h</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${isUpcoming ? `
                            <div class="event-actions">
                                <button class="btn btn-sm btn-primary" onclick="viewEventDetails('${event.id}')">
                                    👁️ Detalii
                                </button>
                                <button class="btn btn-sm btn-outline" onclick="getDirections('${event.adresa}')">
                                    🗺️ Indicații
                                </button>
                                ${event.canUploadDovezi ? `
                                    <button class="btn btn-sm btn-success" onclick="uploadDovezi('${event.id}')">
                                        📸 Încarcă Dovezi
                                    </button>
                                ` : ''}
                            </div>
                        ` : `
                            <div class="event-actions">
                                <button class="btn btn-sm btn-outline" onclick="viewEventDetails('${event.id}')">
                                    👁️ Vezi Detalii
                                </button>
                                ${event.dovezi && event.dovezi.length > 0 ? `
                                    <button class="btn btn-sm btn-outline" onclick="viewDovezi('${event.id}')">
                                        📸 Dovezi (${event.dovezi.length})
                                    </button>
                                ` : ''}
                            </div>
                        `}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Switch between upcoming/past tabs
 */
function switchMyEventsTab(tab) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
}

/**
 * Get directions to event location
 */
function getDirections(address) {
    const encodedAddress = encodeURIComponent(address);
    
    // Detect if mobile
    if (isMobile()) {
        // Try to open Google Maps app
        window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    } else {
        // Open in new tab
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
}

/**
 * Upload dovezi for event
 */
function uploadDovezi(eventId) {
    // TODO: Implement dovezi upload modal/page
    showToast('Upload dovezi pentru ' + eventId, 'info');
}

/**
 * View dovezi for event
 */
function viewDovezi(eventId) {
    // TODO: Implement dovezi viewer
    showToast('Vezi dovezi pentru ' + eventId, 'info');
}

/**
 * Format day from date
 */
function formatDay(dateStr) {
    const date = new Date(dateStr);
    return date.getDate();
}

/**
 * Format month from date (short)
 */
function formatMonth(dateStr) {
    const date = new Date(dateStr);
    const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
}

async function renderAllEvents() {
    // Similar cu renderEvents - redirect acolo
    await renderEvents();
}

async function renderArchivedEvents() {
    const content = document.getElementById('main-content');
    
    content.innerHTML = `
        <div class="section">
            <div class="loading">Se încarcă arhiva...</div>
        </div>
    `;
    
    try {
        const response = await API.getArchivedEvents();
        
        if (!response.success) {
            throw new Error(response.error || 'Eroare la încărcarea arhivei');
        }
        
        const archived = response.events || [];
        
        content.innerHTML = `
            <div class="section">
                <div class="section-header">
                    <h2>Petreceri Arhivate</h2>
                    <div class="header-stats">
                        <span class="stat-badge">📦 Total: ${archived.length}</span>
                    </div>
                </div>
                
                <!-- Search -->
                <div class="search-box">
                    <input type="text" 
                           id="search-archived" 
                           class="input" 
                           placeholder="Caută în arhivă (nume, telefon, ID...)">
                </div>
                
                <!-- Archived list -->
                <div id="archived-list">
                    ${archived.length > 0 ? renderArchivedList(archived) : 
                      '<p class="text-center">Nu există evenimente arhivate.</p>'}
                </div>
            </div>
        `;
        
        // Setup search
        document.getElementById('search-archived')?.addEventListener('input', debounce(filterArchivedEvents, 300));
        
    } catch (error) {
        content.innerHTML = `
            <div class="section">
                <div class="error-message">❌ ${error.message}</div>
                <button class="btn btn-primary" onclick="renderPage('archived')">🔄 Încearcă din nou</button>
            </div>
        `;
    }
}

/**
 * Render archived events list
 */
function renderArchivedList(events) {
    return `
        <div class="archived-list">
            ${events.map(event => `
                <div class="archived-card" data-searchable="${JSON.stringify(event).toLowerCase()}">
                    <div class="archived-header">
                        <div>
                            <strong>${event.numeClient}</strong>
                            <span class="event-id">${event.id}</span>
                        </div>
                        <div class="archived-date">
                            📅 ${formatDate(event.dataOra)}
                        </div>
                    </div>
                    <div class="archived-body">
                        <div class="archived-info">
                            📍 ${event.adresa}<br>
                            📱 ${formatPhone(event.telefon)}<br>
                            💰 ${formatCurrency(event.pret)} RON
                        </div>
                        <div class="archived-meta">
                            <small>Arhivat: ${formatDate(event.archivedAt)}</small>
                            ${event.archivedBy ? `<small>De: ${event.archivedBy}</small>` : ''}
                        </div>
                    </div>
                    <div class="archived-actions">
                        <button class="btn btn-sm btn-outline" onclick="viewArchivedDetails('${event.id}')">
                            👁️ Detalii
                        </button>
                        ${AppState.user.role === 'Admin' || AppState.user.role === 'GM' ? `
                            <button class="btn btn-sm btn-primary" onclick="restoreEvent('${event.id}')">
                                ♻️ Restaurează
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Filter archived events
 */
function filterArchivedEvents() {
    const search = document.getElementById('search-archived').value.toLowerCase();
    const cards = document.querySelectorAll('.archived-card');
    
    cards.forEach(card => {
        const searchable = card.getAttribute('data-searchable');
        if (searchable.includes(search)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * View archived event details
 */
function viewArchivedDetails(eventId) {
    showToast('Detalii eveniment ' + eventId, 'info');
}

/**
 * Restore archived event
 */
async function restoreEvent(eventId) {
    if (!confirm('Sigur vrei să restaurezi acest eveniment?')) return;
    
    try {
        const response = await API.restoreEvent(eventId);
        if (response.success) {
            showToast('✅ Eveniment restaurat!', 'success');
            renderPage('archived'); // Reload
        }
    } catch (error) {
        showToast('❌ Eroare la restaurare', 'error');
    }
}

async function renderMyPerformance() {
    // Redirect to dashboard (same content)
    await renderDashboard();
}

async function renderMyEarnings() {
    const content = document.getElementById('main-content');
    
    // Loading state
    content.innerHTML = `
        <div class="section">
            <div class="loading">Se calculează câștigurile...</div>
        </div>
    `;
    
    try {
        // Get earnings data from API
        const response = await API.getMyEarnings(AppState.user.cod);
        
        if (!response.success) {
            throw new Error(response.error || 'Eroare la încărcarea câștigurilor');
        }
        
        const earnings = response.earnings || {};
        const isTrainer = AppState.user.cod && AppState.user.cod.includes('trainer');
        
        // Render page
        content.innerHTML = `
            <div class="section">
                <div class="section-header">
                    <h2>Câștigurile Mele</h2>
                    <select id="month-selector" class="input" onchange="changeEarningsMonth()">
                        ${generateMonthOptions()}
                    </select>
                </div>
                
                <!-- Total câștigat -->
                <div class="earnings-total">
                    <div class="total-label">Total Câștigat Luna Aceasta</div>
                    <div class="total-amount">${formatCurrency(earnings.total || 0)} RON</div>
                </div>
                
                <!-- Breakdown componente -->
                <div class="earnings-breakdown">
                    <h3>📊 Detalii Câștiguri</h3>
                    
                    <!-- 1. Salariu Bază -->
                    <div class="earning-component">
                        <div class="component-header" onclick="toggleComponent('salariu-baza')">
                            <div class="component-title">
                                <span class="component-icon">💵</span>
                                <span>Salariu Bază</span>
                                <span class="component-expand">▼</span>
                            </div>
                            <div class="component-amount">${formatCurrency(earnings.salariuBaza || 0)} RON</div>
                        </div>
                        <div id="component-salariu-baza" class="component-details">
                            <div class="detail-item">
                                <span>Ore lucrate:</span>
                                <strong>${earnings.oreLucrate || 0}h</strong>
                            </div>
                            <div class="detail-item">
                                <span>Tarif:</span>
                                <strong>${earnings.isDriver ? '15' : '30'} lei/oră</strong>
                            </div>
                            <div class="detail-formula">
                                Formula: ${earnings.oreLucrate || 0}h × ${earnings.isDriver ? '15' : '30'} lei = ${formatCurrency(earnings.salariuBaza || 0)} RON
                            </div>
                            ${earnings.roleBreakdown ? renderRoleBreakdown(earnings.roleBreakdown) : ''}
                        </div>
                    </div>
                    
                    ${isTrainer ? `
                        <!-- 2. Target Trainer Nivel 1 -->
                        <div class="earning-component">
                            <div class="component-header" onclick="toggleComponent('target-nivel-1')">
                                <div class="component-title">
                                    <span class="component-icon">🏆</span>
                                    <span>Target Trainer Nivel 1</span>
                                    <span class="component-expand">▼</span>
                                </div>
                                <div class="component-amount">${formatCurrency(earnings.targetNivel1 || 0)} RON</div>
                            </div>
                            <div id="component-target-nivel-1" class="component-details">
                                <div class="detail-item">
                                    <span>Ore echipă (total):</span>
                                    <strong>${earnings.oreEchipa || 0}h</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Prag minim:</span>
                                    <strong>150h</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Poziții câștigate:</span>
                                    <strong>${earnings.pozitiiNivel1 || 0}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Valoare per poziție:</span>
                                    <strong>${formatCurrency(earnings.valoarePozitieN1 || 0)} RON</strong>
                                </div>
                                <div class="detail-formula">
                                    Pot total: ${formatCurrency(earnings.potNivel1Total || 0)} RON (1% din toate vânzările)<br>
                                    Poziții de 10h: (${earnings.oreEchipa}h - 150h) / 10 = ${earnings.pozitiiNivel1 || 0}<br>
                                    Primești: ${earnings.pozitiiNivel1 || 0} × ${formatCurrency(earnings.valoarePozitieN1 || 0)} = ${formatCurrency(earnings.targetNivel1 || 0)} RON
                                </div>
                                ${earnings.rankingNivel1 ? `
                                    <div class="ranking-info">
                                        Poziția ta: <strong>#${earnings.rankingNivel1}</strong> din ${earnings.totalTraineri || 26} traineri
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- 3. Target Trainer Nivel 2 -->
                        <div class="earning-component">
                            <div class="component-header" onclick="toggleComponent('target-nivel-2')">
                                <div class="component-title">
                                    <span class="component-icon">💎</span>
                                    <span>Target Trainer Nivel 2</span>
                                    <span class="component-expand">▼</span>
                                </div>
                                <div class="component-amount">${formatCurrency(earnings.targetNivel2 || 0)} RON</div>
                            </div>
                            <div id="component-target-nivel-2" class="component-details">
                                <div class="detail-item">
                                    <span>Vânzări echipă ta:</span>
                                    <strong>${formatCurrency(earnings.vanzariEchipa || 0)} RON</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Pot echipă (1%):</span>
                                    <strong>${formatCurrency(earnings.potNivel2 || 0)} RON</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Prag dinamic (de la top):</span>
                                    <strong>${earnings.pragNivel2 || 0}h</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Procent deblocat:</span>
                                    <strong>${earnings.procentNivel2 || 0}%</strong>
                                </div>
                                <div class="detail-formula">
                                    Puncte câștigate: (${earnings.oreEchipa}h - 150h) = ${(earnings.oreEchipa || 0) - 150}<br>
                                    Puncte necesare: (${earnings.pragNivel2}h - 150h) = ${(earnings.pragNivel2 || 0) - 150}<br>
                                    Procent: ${(earnings.oreEchipa || 0) - 150} / ${(earnings.pragNivel2 || 0) - 150} = ${earnings.procentNivel2 || 0}%<br>
                                    Primești: ${formatCurrency(earnings.potNivel2 || 0)} × ${earnings.procentNivel2 || 0}% = ${formatCurrency(earnings.targetNivel2 || 0)} RON
                                </div>
                                ${earnings.baniLaFirma ? `
                                    <div class="info-box">
                                        💰 Bani rămași la firmă: ${formatCurrency(earnings.baniLaFirma)} RON
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- 4. Target Animație (pentru toți) -->
                    <div class="earning-component">
                        <div class="component-header" onclick="toggleComponent('target-animatie')">
                            <div class="component-title">
                                <span class="component-icon">🎭</span>
                                <span>Target Animație</span>
                                <span class="component-expand">▼</span>
                            </div>
                            <div class="component-amount">${formatCurrency(earnings.targetAnimatie || 0)} RON</div>
                        </div>
                        <div id="component-target-animatie" class="component-details">
                            <div class="detail-item">
                                <span>Ore animație (personale):</span>
                                <strong>${earnings.oreAnimatie || 0}h</strong>
                            </div>
                            <div class="detail-item">
                                <span>Prag minim:</span>
                                <strong>20h</strong>
                            </div>
                            <div class="detail-item">
                                <span>Poziții câștigate:</span>
                                <strong>${earnings.pozitiiAnimatie || 0}</strong>
                            </div>
                            <div class="detail-item">
                                <span>Valoare per poziție:</span>
                                <strong>${formatCurrency(earnings.valoarePozitieAnimatie || 0)} RON</strong>
                            </div>
                            <div class="detail-formula">
                                Pot total: ${formatCurrency(earnings.potAnimatieTotal || 0)} RON (2.5 lei × total ore)<br>
                                Poziții de 10h: (${earnings.oreAnimatie}h - 20h) / 10 = ${earnings.pozitiiAnimatie || 0}<br>
                                Primești: ${earnings.pozitiiAnimatie || 0} × ${formatCurrency(earnings.valoarePozitieAnimatie || 0)} = ${formatCurrency(earnings.targetAnimatie || 0)} RON
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Istoric plăți -->
                <div class="payment-history">
                    <h3>💳 Istoric Plăți</h3>
                    ${earnings.paymentHistory && earnings.paymentHistory.length > 0 ? 
                        renderPaymentHistory(earnings.paymentHistory) : 
                        '<p class="text-center">Nu există plăți înregistrate.</p>'}
                </div>
            </div>
        `;
        
    } catch (error) {
        content.innerHTML = `
            <div class="section">
                <div class="error-message">
                    ❌ ${error.message}
                </div>
                <button class="btn btn-primary" onclick="renderPage('my-earnings')">
                    🔄 Încearcă din nou
                </button>
            </div>
        `;
    }
}

/**
 * Generate month options for selector
 */
function generateMonthOptions() {
    const months = [
        'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
        'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let options = '';
    
    // Last 12 months
    for (let i = 0; i < 12; i++) {
        const month = (currentMonth - i + 12) % 12;
        const year = currentYear - Math.floor((currentMonth - i) / 12);
        const value = `${year}-${String(month + 1).padStart(2, '0')}`;
        const label = `${months[month]} ${year}`;
        const selected = i === 0 ? 'selected' : '';
        
        options += `<option value="${value}" ${selected}>${label}</option>`;
    }
    
    return options;
}

/**
 * Change earnings month
 */
async function changeEarningsMonth() {
    const month = document.getElementById('month-selector').value;
    // TODO: Reload with new month
    showToast('Se încarcă datele pentru ' + month, 'info');
}

/**
 * Toggle component details
 */
function toggleComponent(componentId) {
    const component = document.getElementById(`component-${componentId}`);
    const header = component.previousElementSibling;
    const expand = header.querySelector('.component-expand');
    
    if (component.classList.contains('active')) {
        component.classList.remove('active');
        expand.textContent = '▼';
    } else {
        component.classList.add('active');
        expand.textContent = '▲';
    }
}

/**
 * Render role breakdown
 */
function renderRoleBreakdown(breakdown) {
    if (!breakdown || breakdown.length === 0) return '';
    
    return `
        <div class="role-breakdown">
            <h5>Detalii per rol:</h5>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th>Rol</th>
                        <th>Ore</th>
                        <th>Tarif</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${breakdown.map(role => `
                        <tr>
                            <td>${role.name}</td>
                            <td>${role.hours}h</td>
                            <td>${role.tarif} lei/h</td>
                            <td><strong>${formatCurrency(role.total)} RON</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Render payment history
 */
function renderPaymentHistory(history) {
    return `
        <div class="payments-list">
            ${history.map(payment => `
                <div class="payment-item">
                    <div class="payment-date">
                        ${formatDate(payment.date)}
                    </div>
                    <div class="payment-details">
                        <div class="payment-amount">${formatCurrency(payment.amount)} RON</div>
                        <div class="payment-method">${getPaymentMethodLabel(payment.method)}</div>
                    </div>
                    <div class="payment-status status-${payment.status}">
                        ${getPaymentStatusLabel(payment.status)}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Get payment method label
 */
function getPaymentMethodLabel(method) {
    const labels = {
        'cash': '💵 Numerar',
        'transfer': '🏦 Transfer Bancar',
        'card': '💳 Card',
        'revolut': '💜 Revolut'
    };
    return labels[method] || method;
}

/**
 * Get payment status label
 */
function getPaymentStatusLabel(status) {
    const labels = {
        'paid': '✅ Plătit',
        'pending': '🟡 În așteptare',
        'processing': '⏳ Se procesează'
    };
    return labels[status] || status;
}

async function renderTeamRankings() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = '<div class="loading-spinner"></div>';
    
    try {
        const response = await API.getRankings();
        
        if (response.success) {
            const rankings = response.rankings;
            
            mainContent.innerHTML = `
                <div class="section">
                    <h2>🏆 Clasamente</h2>
                    
                    <!-- Trainer Rankings -->
                    <h3>Top Traineri</h3>
                    <div class="rankings-list">
                        ${rankings.trainers.allRankings.map(t => `
                            <div class="ranking-item ${rankings.trainers.currentUser && rankings.trainers.currentUser.userId === t.userId ? 'current-user' : ''}">
                                <span class="rank">#${t.rank}</span>
                                <span class="name">${t.name || t.cod}</span>
                                <span class="value">${formatCurrency(t.totalEarnings)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Operator Rankings -->
                    <h3 class="mt-lg">Top Operatori</h3>
                    <div class="rankings-list">
                        ${rankings.operators.allRankings.slice(0, 50).map(o => `
                            <div class="ranking-item ${rankings.operators.currentUser && rankings.operators.currentUser.userId === o.userId ? 'current-user' : ''}">
                                <span class="rank">#${o.rank}</span>
                                <span class="name">${o.name || o.cod}</span>
                                <span class="value">${formatCurrency(o.earnings)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${rankings.operators.allRankings.length > 50 ? '<p class="text-center mt-md">...și alții</p>' : ''}
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading rankings:', error);
        mainContent.innerHTML = '<p>Eroare la încărcarea clasamentului</p>';
    }
}

async function renderAdminDashboard() {
    const content = document.getElementById('main-content');
    
    content.innerHTML = `<div class="section"><div class="loading">Se încarcă dashboard...</div></div>`;
    
    try {
        const response = await API.getAdminDashboard();
        
        if (!response.success) throw new Error(response.error || 'Eroare la încărcare');
        
        const data = response.data || {};
        
        content.innerHTML = `
            <div class="section">
                <h2>Admin Dashboard</h2>
                
                <!-- Quick Stats -->
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-icon">🎉</div>
                        <div class="stat-content">
                            <div class="stat-value">${data.totalEventsThisMonth || 0}</div>
                            <div class="stat-label">Evenimente Luna Asta</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">${formatCurrency(data.revenueThisMonth || 0)}</div>
                            <div class="stat-label">Venit Luna Asta</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <div class="stat-value">${data.activeUsers || 0}</div>
                            <div class="stat-label">Useri Activi</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⏳</div>
                        <div class="stat-content">
                            <div class="stat-value">${data.pendingEvents || 0}</div>
                            <div class="stat-label">Evenimente Pending</div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="quick-actions">
                    <h3>⚡ Acțiuni Rapide</h3>
                    <div class="actions-grid">
                        <button class="action-btn" onclick="renderPage('add-event')">
                            ➕ Adaugă Petrecere
                        </button>
                        <button class="action-btn" onclick="renderPage('admin-users')">
                            👥 Gestionare Useri
                        </button>
                        <button class="action-btn" onclick="renderPage('admin-broadcast')">
                            📢 Trimite Mesaj
                        </button>
                        <button class="action-btn" onclick="renderPage('admin-reports')">
                            📊 Vezi Rapoarte
                        </button>
                    </div>
                </div>
                
                <!-- Recent Activity -->
                <div class="recent-activity">
                    <h3>📋 Activitate Recentă</h3>
                    ${data.recentActivity && data.recentActivity.length > 0 ? 
                        renderRecentActivity(data.recentActivity) : 
                        '<p class="text-center">Nu există activitate recentă.</p>'}
                </div>
            </div>
        `;
        
    } catch (error) {
        content.innerHTML = `
            <div class="section">
                <div class="error-message">❌ ${error.message}</div>
                <button class="btn btn-primary" onclick="renderPage('admin-dashboard')">🔄 Încearcă din nou</button>
            </div>
        `;
    }
}

function renderRecentActivity(activity) {
    return `
        <div class="activity-list">
            ${activity.map(item => `
                <div class="activity-item">
                    <div class="activity-icon">${item.icon || '•'}</div>
                    <div class="activity-content">
                        <div class="activity-text">${item.text}</div>
                        <div class="activity-time">${formatRelativeTime(item.timestamp)}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function renderAdminUsers() {
    const content = document.getElementById('main-content');
    
    content.innerHTML = `<div class="section"><div class="loading">Se încarcă userii...</div></div>`;
    
    try {
        const response = await API.getAllUsers();
        
        if (!response.success) throw new Error(response.error || 'Eroare la încărcarea userilor');
        
        const users = response.users || [];
        const pending = users.filter(u => u.status === 'pending');
        const active = users.filter(u => u.status === 'active');
        
        content.innerHTML = `
            <div class="section">
                <div class="section-header">
                    <h2>Gestionare Useri</h2>
                    <button class="btn btn-primary" onclick="showAddUserModal()">
                        ➕ Adaugă User
                    </button>
                </div>
                
                ${pending.length > 0 ? `
                    <div class="pending-users">
                        <h3>⏳ Useri Pending Aprobare (${pending.length})</h3>
                        ${renderPendingUsersList(pending)}
                    </div>
                ` : ''}
                
                <div class="tabs">
                    <button class="tab active" onclick="switchUserTab('all')">Toți (${active.length})</button>
                    <button class="tab" onclick="switchUserTab('trainers')">Traineri</button>
                    <button class="tab" onclick="switchUserTab('operators')">Operatori</button>
                </div>
                
                <div class="filters-row">
                    <input type="text" id="search-users" class="input" placeholder="Caută (nume, cod, email)...">
                    <select id="filter-team" class="input">
                        <option value="all">Toate echipele</option>
                        ${generateTeamFilterOptions()}
                    </select>
                </div>
                
                <div id="users-list">
                    ${renderUsersList(active)}
                </div>
            </div>
        `;
        
        document.getElementById('search-users')?.addEventListener('input', debounce(filterUsers, 300));
        document.getElementById('filter-team')?.addEventListener('change', filterUsers);
        
    } catch (error) {
        content.innerHTML = `
            <div class="section">
                <div class="error-message">❌ ${error.message}</div>
                <button class="btn btn-primary" onclick="renderPage('admin-users')">🔄 Încearcă din nou</button>
            </div>
        `;
    }
}

function renderPendingUsersList(pending) {
    return `
        <div class="pending-list">
            ${pending.map(user => `
                <div class="pending-card">
                    <div class="pending-info">
                        <strong>${user.name || user.email}</strong><br>
                        <small>${user.email} · Cod solicitat: ${user.requestedCod || '-'}</small>
                    </div>
                    <div class="pending-actions">
                        <button class="btn btn-sm btn-success" onclick="approveUser('${user.id}')">✅ Aprobă</button>
                        <button class="btn btn-sm btn-danger" onclick="rejectUser('${user.id}')">❌ Respinge</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderUsersList(users) {
    return `
        <table class="users-table">
            <thead>
                <tr>
                    <th>Nume</th>
                    <th>Cod</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Status</th>
                    <th>Acțiuni</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr data-searchable="${JSON.stringify(user).toLowerCase()}" data-team="${user.cod ? user.cod.charAt(0) : ''}">
                        <td><strong>${user.name || '-'}</strong></td>
                        <td><span class="code-badge">${user.cod || '-'}</span></td>
                        <td>${user.email || '-'}</td>
                        <td>${user.role || '-'}</td>
                        <td><span class="status-badge status-${user.status}">${user.status || 'active'}</span></td>
                        <td>
                            <button class="btn-icon" onclick="editUser('${user.id}')" title="Editează">✏️</button>
                            <button class="btn-icon" onclick="deleteUser('${user.id}')" title="Șterge">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generateTeamFilterOptions() {
    const teams = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return teams.map(t => `<option value="${t}">Echipa ${t}</option>`).join('');
}

function switchUserTab(tab) {
    // Filter logic here
}

function filterUsers() {
    const search = document.getElementById('search-users').value.toLowerCase();
    const team = document.getElementById('filter-team').value;
    const rows = document.querySelectorAll('.users-table tbody tr');
    
    rows.forEach(row => {
        const searchable = row.getAttribute('data-searchable');
        const rowTeam = row.getAttribute('data-team');
        const matchSearch = searchable.includes(search);
        const matchTeam = team === 'all' || rowTeam === team;
        
        row.style.display = (matchSearch && matchTeam) ? '' : 'none';
    });
}

async function approveUser(userId) {
    if (!confirm('Aprobă acest user?')) return;
    try {
        const response = await API.approveUser(userId);
        if (response.success) {
            showToast('✅ User aprobat!', 'success');
            renderPage('admin-users');
        }
    } catch (error) {
        showToast('❌ Eroare', 'error');
    }
}

async function rejectUser(userId) {
    if (!confirm('Respinge acest user?')) return;
    try {
        const response = await API.rejectUser(userId);
        if (response.success) {
            showToast('✅ User respins!', 'success');
            renderPage('admin-users');
        }
    } catch (error) {
        showToast('❌ Eroare', 'error');
    }
}

function showAddUserModal() {
    showToast('Add user modal - coming soon', 'info');
}

function editUser(userId) {
    showToast('Edit user ' + userId, 'info');
}

async function deleteUser(userId) {
    if (!confirm('Sigur vrei să ștergi acest user?')) return;
    try {
        const response = await API.deleteUser(userId);
        if (response.success) {
            showToast('✅ User șters!', 'success');
            renderPage('admin-users');
        }
    } catch (error) {
        showToast('❌ Eroare', 'error');
    }
}

async function renderAdminBroadcast() {
    document.getElementById('main-content').innerHTML = `
        <div class="section">
            <h2>📢 Trimite Mesaj Către Toți</h2>
            
            <div class="broadcast-form">
                <div class="form-group">
                    <label>Destinatari</label>
                    <select id="broadcast-audience" class="form-input">
                        <option value="all">Toți</option>
                        <option value="operators">Operatori</option>
                        <option value="trainers">Traineri</option>
                        <option value="admins">Admini</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Prioritate</label>
                    <select id="broadcast-priority" class="form-input">
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Mesaj</label>
                    <textarea id="broadcast-message" class="form-input" rows="5" placeholder="Scrie mesajul aici..."></textarea>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="broadcast-require-ack">
                        Necesită confirmare (Acknowledge)
                    </label>
                </div>
                
                <button class="btn btn-primary btn-block" onclick="sendBroadcast()">
                    Trimite către toți
                </button>
            </div>
        </div>
    `;
}

async function sendBroadcast() {
    const audience = document.getElementById('broadcast-audience').value;
    const priority = document.getElementById('broadcast-priority').value;
    const message = document.getElementById('broadcast-message').value;
    const requireAck = document.getElementById('broadcast-require-ack').checked;
    
    if (!message.trim()) {
        showToast('Mesajul nu poate fi gol!', 'error');
        return;
    }
    
    try {
        const response = await API.sendBroadcastMessage({
            targetAudience: audience,
            priority: priority,
            message: message,
            requiresAcknowledge: requireAck
        });
        
        if (response.success) {
            showToast(`✅ Mesaj trimis către ${response.sentTo} persoane!`, 'success');
            document.getElementById('broadcast-message').value = '';
        } else {
            showToast('Eroare la trimitere', 'error');
        }
        
    } catch (error) {
        console.error('Error sending broadcast:', error);
        showToast('Eroare la trimitere', 'error');
    }
}

async function renderAdminArchive() {
    const content = document.getElementById('main-content');
    
    content.innerHTML = `<div class="section"><div class="loading">Se încarcă...</div></div>`;
    
    try {
        const [eventsResp, statsResp] = await Promise.all([
            API.getEvents({ status: 'completed' }),
            API.getArchiveStats()
        ]);
        
        const completed = eventsResp.events || [];
        const stats = statsResp.stats || {};
        
        content.innerHTML = `
            <div class="section">
                <div class="section-header">
                    <h2>Gestionare Arhivă</h2>
                </div>
                
                <div class="stats-cards">
                    <div class="stat-card">
                        <div class="stat-value">${stats.totalArchived || 0}</div>
                        <div class="stat-label">Total Arhivate</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${completed.length}</div>
                        <div class="stat-label">Completate (Pending)</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.thisMonth || 0}</div>
                        <div class="stat-label">Arhivate Luna Asta</div>
                    </div>
                </div>
                
                <h3>📋 Evenimente Completate (Pending Arhivare)</h3>
                
                ${completed.length > 0 ? `
                    <div class="bulk-actions">
                        <button class="btn btn-primary" onclick="selectAllForArchive()">
                            ☑️ Selectează Tot
                        </button>
                        <button class="btn btn-success" onclick="bulkArchiveSelected()">
                            📦 Arhivează Selectate (<span id="selected-count">0</span>)
                        </button>
                    </div>
                    
                    <div class="archive-list">
                        ${completed.map(event => `
                            <div class="archive-item">
                                <label class="archive-checkbox">
                                    <input type="checkbox" class="archive-select" data-event-id="${event.id}">
                                    <div class="archive-item-content">
                                        <div class="archive-header">
                                            <strong>${event.numeClient}</strong>
                                            <span class="event-id">${event.id}</span>
                                        </div>
                                        <div class="archive-details">
                                            📅 ${formatDate(event.dataOra)} · 
                                            📍 ${event.adresa} · 
                                            💰 ${formatCurrency(event.pret)} RON
                                        </div>
                                        <div class="archive-status">
                                            ${event.allDoveziComplete ? '✅ Dovezi complete' : '⚠️ Dovezi incomplete'}
                                        </div>
                                    </div>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-center">Nu există evenimente completate pending arhivare.</p>'}
            </div>
        `;
        
        // Setup checkbox listeners
        document.querySelectorAll('.archive-select').forEach(cb => {
            cb.addEventListener('change', updateSelectedCount);
        });
        
    } catch (error) {
        content.innerHTML = `
            <div class="section">
                <div class="error-message">❌ ${error.message}</div>
                <button class="btn btn-primary" onclick="renderPage('admin-archive')">🔄 Încearcă din nou</button>
            </div>
        `;
    }
}

function updateSelectedCount() {
    const selected = document.querySelectorAll('.archive-select:checked').length;
    const countEl = document.getElementById('selected-count');
    if (countEl) countEl.textContent = selected;
}

function selectAllForArchive() {
    const checkboxes = document.querySelectorAll('.archive-select');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    updateSelectedCount();
}

async function bulkArchiveSelected() {
    const selected = Array.from(document.querySelectorAll('.archive-select:checked'))
        .map(cb => cb.getAttribute('data-event-id'));
    
    if (selected.length === 0) {
        showToast('Selectează cel puțin un eveniment!', 'error');
        return;
    }
    
    if (!confirm(`Arhivezi ${selected.length} evenimente?`)) return;
    
    try {
        const response = await API.bulkArchiveEvents(selected);
        if (response.success) {
            showToast(`✅ ${selected.length} evenimente arhivate!`, 'success');
            renderPage('admin-archive');
        }
    } catch (error) {
        showToast('❌ Eroare la arhivare', 'error');
    }
}

async function renderAdminReports() {
    const content = document.getElementById('main-content');
    
    content.innerHTML = `
        <div class="section">
            <div class="section-header">
                <h2>Rapoarte Admin</h2>
            </div>
            
            <div class="reports-grid">
                <!-- Raport 1: Vânzări -->
                <div class="report-card">
                    <div class="report-icon">💰</div>
                    <div class="report-content">
                        <h4>Raport Vânzări</h4>
                        <p>Vânzări per perioadă, echipă, trainer</p>
                        <button class="btn btn-primary" onclick="generateReport('sales')">
                            📊 Generează
                        </button>
                    </div>
                </div>
                
                <!-- Raport 2: Performanță Traineri -->
                <div class="report-card">
                    <div class="report-icon">🏆</div>
                    <div class="report-content">
                        <h4>Performanță Traineri</h4>
                        <p>Target Nivel 1 & 2, ore, vânzări</p>
                        <button class="btn btn-primary" onclick="generateReport('trainers')">
                            📊 Generează
                        </button>
                    </div>
                </div>
                
                <!-- Raport 3: Performanță Operatori -->
                <div class="report-card">
                    <div class="report-icon">👥</div>
                    <div class="report-content">
                        <h4>Performanță Operatori</h4>
                        <p>Ore lucrate, câștiguri, evenimente</p>
                        <button class="btn btn-primary" onclick="generateReport('operators')">
                            📊 Generează
                        </button>
                    </div>
                </div>
                
                <!-- Raport 4: Evenimente -->
                <div class="report-card">
                    <div class="report-icon">🎉</div>
                    <div class="report-content">
                        <h4>Raport Evenimente</h4>
                        <p>Total, completate, anulate, arhivate</p>
                        <button class="btn btn-primary" onclick="generateReport('events')">
                            📊 Generează
                        </button>
                    </div>
                </div>
                
                <!-- Raport 5: Financiar -->
                <div class="report-card">
                    <div class="report-icon">💵</div>
                    <div class="report-content">
                        <h4>Raport Financiar</h4>
                        <p>Venituri, plăți, profit net</p>
                        <button class="btn btn-primary" onclick="generateReport('financial')">
                            📊 Generează
                        </button>
                    </div>
                </div>
                
                <!-- Raport 6: Clienți -->
                <div class="report-card">
                    <div class="report-icon">👤</div>
                    <div class="report-content">
                        <h4>Raport Clienți</h4>
                        <p>Noi, repeat, aniversări viitoare</p>
                        <button class="btn btn-primary" onclick="generateReport('clients')">
                            📊 Generează
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Export Options -->
            <div class="export-section">
                <h3>📥 Export Date</h3>
                <div class="export-options">
                    <button class="btn btn-outline" onclick="exportData('excel')">
                        📊 Export Excel
                    </button>
                    <button class="btn btn-outline" onclick="exportData('csv')">
                        📄 Export CSV
                    </button>
                    <button class="btn btn-outline" onclick="exportData('pdf')">
                        📑 Export PDF
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function generateReport(type) {
    showToast(`Se generează raportul ${type}...`, 'info');
    
    try {
        const response = await API.generateReport(type);
        if (response.success) {
            // Display report or download
            showToast('✅ Raport generat!', 'success');
        }
    } catch (error) {
        showToast('❌ Eroare la generare raport', 'error');
    }
}

async function exportData(format) {
    showToast(`Se exportă în format ${format}...`, 'info');
    
    try {
        const response = await API.exportData(format);
        if (response.success && response.downloadUrl) {
            window.open(response.downloadUrl, '_blank');
            showToast('✅ Export gata!', 'success');
        }
    } catch (error) {
        showToast('❌ Eroare la export', 'error');
    }
}

async function renderSettings() {
    const content = document.getElementById('main-content');
    const user = AppState.user;
    
    content.innerHTML = `
        <div class="section">
            <div class="section-header">
                <h2>Setări</h2>
            </div>
            
            <!-- App Settings -->
            <div class="settings-section">
                <h3>🎨 Aspect</h3>
                <label class="setting-item">
                    <span>Mod întunecat</span>
                    <input type="checkbox" id="dark-mode" ${user.settings?.darkMode ? 'checked' : ''} onchange="toggleDarkMode()">
                </label>
            </div>
            
            <!-- Notification Settings -->
            <div class="settings-section">
                <h3>🔔 Notificări</h3>
                <label class="setting-item">
                    <span>Notificări push</span>
                    <input type="checkbox" id="push-notifications" ${user.settings?.pushNotifications !== false ? 'checked' : ''} onchange="saveSettings()">
                </label>
                <label class="setting-item">
                    <span>Notificări email</span>
                    <input type="checkbox" id="email-notifications" ${user.settings?.emailNotifications !== false ? 'checked' : ''} onchange="saveSettings()">
                </label>
                <label class="setting-item">
                    <span>Sunet notificări</span>
                    <input type="checkbox" id="sound-notifications" ${user.settings?.soundNotifications !== false ? 'checked' : ''} onchange="saveSettings()">
                </label>
            </div>
            
            <!-- Language -->
            <div class="settings-section">
                <h3>🌐 Limbă</h3>
                <select id="language" class="input" onchange="saveSettings()">
                    <option value="ro" ${user.settings?.language === 'ro' ? 'selected' : ''}>Română</option>
                    <option value="en" ${user.settings?.language === 'en' ? 'selected' : ''}>English</option>
                </select>
            </div>
            
            ${user.role === 'Admin' || user.role === 'GM' ? `
                <!-- Admin Settings -->
                <div class="settings-section">
                    <h3>👑 Setări Admin</h3>
                    <label class="setting-item">
                        <span>Mod debug</span>
                        <input type="checkbox" id="debug-mode" ${user.settings?.debugMode ? 'checked' : ''} onchange="saveSettings()">
                    </label>
                    <label class="setting-item">
                        <span>Show all events</span>
                        <input type="checkbox" id="show-all-events" ${user.settings?.showAllEvents !== false ? 'checked' : ''} onchange="saveSettings()">
                    </label>
                </div>
            ` : ''}
            
            <!-- About -->
            <div class="settings-section">
                <h3>ℹ️ Despre</h3>
                <p>SuperParty v7.0</p>
                <p>© 2024 SuperParty. All rights reserved.</p>
                <button class="btn btn-outline" onclick="window.open('https://superparty.ro', '_blank')">
                    🌐 Website
                </button>
            </div>
            
            <!-- Logout -->
            <div class="settings-section">
                <button class="btn btn-danger btn-block" onclick="confirmLogout()">
                    🚪 Deconectare
                </button>
            </div>
        </div>
    `;
}

function toggleDarkMode() {
    const enabled = document.getElementById('dark-mode').checked;
    document.body.classList.toggle('dark-mode', enabled);
    saveSettings();
}

async function saveSettings() {
    const settings = {
        darkMode: document.getElementById('dark-mode')?.checked,
        pushNotifications: document.getElementById('push-notifications')?.checked,
        emailNotifications: document.getElementById('email-notifications')?.checked,
        soundNotifications: document.getElementById('sound-notifications')?.checked,
        language: document.getElementById('language')?.value,
        debugMode: document.getElementById('debug-mode')?.checked,
        showAllEvents: document.getElementById('show-all-events')?.checked
    };
    
    try {
        const response = await API.updateUserSettings(settings);
        if (response.success) {
            AppState.user.settings = settings;
            showToast('✅ Setări salvate!', 'success');
        }
    } catch (error) {
        showToast('❌ Eroare la salvare', 'error');
    }
}

function confirmLogout() {
    if (confirm('Sigur vrei să te deconectezi?')) {
        logout();
    }
}

// Export
window.renderPage = renderPage;
window.sendBroadcast = sendBroadcast;
