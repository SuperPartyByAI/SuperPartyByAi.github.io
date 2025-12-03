// ═══════════════════════════════════════════════════════════
// SUPERPARTY v7.0 - API.JS
// Backend integration cu toate cele 31 fișiere .gs
// ═══════════════════════════════════════════════════════════

// API Configuration
const API_CONFIG = {
    baseURL: 'https://script.google.com/macros/s/AKfycbxpV3NKZJLzNe5tTGX5TlUVnAQc1j6z82kPz7QkzartJpFfdPgvvg0T84ay1Ljlrxk/exec',
    timeout: 30000, // 30 seconds
    retries: 3
};

// API Object
const API = {
    
    // ═══════════════════════════════════════════════════════════
    // AUTHENTICATION
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Login
     */
    async login(email, password) {
        return await apiCall('login', {
            email: email,
            password: password
        });
    },
    
    /**
     * Verify session
     */
    async verifySession(sessionToken, userId) {
        return await apiCall('verifySession', {
            sessionToken: sessionToken,
            userId: userId
        });
    },
    
    /**
     * Register new user
     */
    async register(userData) {
        return await apiCall('register', userData);
    },
    
    // ═══════════════════════════════════════════════════════════
    // USER PROFILE
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Get user profile
     */
    async getUserProfile() {
        return await apiCall('getUserProfile');
    },
    
    /**
     * Update user profile
     */
    async updateUserProfile(updates) {
        return await apiCall('updateUserProfile', updates);
    },
    
    /**
     * Change email
     */
    async changeEmail(newEmail, cod) {
        return await apiCall('changeEmail', {
            newEmail: newEmail,
            cod: cod
        });
    },
    
    /**
     * Change cod
     */
    async changeCod(newCod) {
        return await apiCall('changeCod', {
            newCod: newCod
        });
    },
    
    // ═══════════════════════════════════════════════════════════
    // PERFORMANCE DASHBOARD
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Get performance dashboard (cu toate comparațiile)
     */
    async getPerformanceDashboard() {
        return await apiCall('getPerformanceDashboard');
    },
    
    /**
     * Get rankings (traineri + operatori)
     */
    async getRankings() {
        return await apiCall('getRankings');
    },
    
    /**
     * Get team stats (pentru traineri)
     */
    async getTeamStats() {
        return await apiCall('getTeamStats');
    },
    
    // ═══════════════════════════════════════════════════════════
    // EVENIMENTE
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Get evenimente (cu filtre)
     */
    async getEvents(filters = {}) {
        return await apiCall('getEvents', filters);
    },
    
    /**
     * Get eveniment by ID
     */
    async getEvent(eventId) {
        return await apiCall('getEvent', { eventId: eventId });
    },
    
    /**
     * Create eveniment
     */
    async createEvent(eventData) {
        return await apiCall('createEvent', eventData);
    },
    
    /**
     * Update eveniment
     */
    async updateEvent(eventId, updates) {
        return await apiCall('updateEvent', {
            eventId: eventId,
            updates: updates
        });
    },
    
    /**
     * Archive eveniment (prin chat command sau UI)
     */
    async archiveEvent(eventId) {
        return await apiCall('archiveEvent', { eventId: eventId });
    },
    
    /**
     * Bulk archive evenimente
     */
    async bulkArchiveEvents(eventIds) {
        return await apiCall('bulkArchiveEvents', { eventIds: eventIds });
    },
    
    /**
     * Get archived events
     */
    async getArchivedEvents(filters = {}) {
        return await apiCall('getArchivedEvents', filters);
    },
    
    // ═══════════════════════════════════════════════════════════
    // ROLURI
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Get roluri pentru eveniment
     */
    async getRoles(eventId) {
        return await apiCall('getRoles', { eventId: eventId });
    },
    
    /**
     * Assign rol
     */
    async assignRole(eventId, roleData) {
        return await apiCall('assignRole', {
            eventId: eventId,
            roleData: roleData
        });
    },
    
    /**
     * Update rol
     */
    async updateRole(roleId, updates) {
        return await apiCall('updateRole', {
            roleId: roleId,
            updates: updates
        });
    },
    
    // ═══════════════════════════════════════════════════════════
    // DOVEZI
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Upload dovadă
     */
    async uploadDovada(eventId, tipDovada, file) {
        const formData = new FormData();
        formData.append('action', 'uploadDovada');
        formData.append('eventId', eventId);
        formData.append('tipDovada', tipDovada);
        formData.append('file', file);
        
        return await apiCallWithFile(formData);
    },
    
    /**
     * Get dovezi pentru eveniment
     */
    async getDovezi(eventId) {
        return await apiCall('getDovezi', { eventId: eventId });
    },
    
    /**
     * Validate dovadă cu AI
     */
    async validateDovada(dovadaId) {
        return await apiCall('validateDovada', { dovadaId: dovadaId });
    },
    
    // ═══════════════════════════════════════════════════════════
    // ÎNCASARE
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Register încasare (5 modalități)
     */
    async registerIncasare(eventId, incasareData) {
        return await apiCall('registerIncasare', {
            eventId: eventId,
            incasareData: incasareData
        });
    },
    
    /**
     * Get încasare pentru eveniment
     */
    async getIncasare(eventId) {
        return await apiCall('getIncasare', { eventId: eventId });
    },
    
    // ═══════════════════════════════════════════════════════════
    // FACTURĂ WORKFLOW
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Submit date firmă (Step 1)
     */
    async submitDateFirma(facturaId, firmaData) {
        return await apiCall('submitDateFirma', {
            facturaId: facturaId,
            firmaData: firmaData
        });
    },
    
    /**
     * Upload dovadă factură (Step 2)
     */
    async uploadDovadaFactura(facturaId, file, nrFactura) {
        const formData = new FormData();
        formData.append('action', 'uploadDovadaFactura');
        formData.append('facturaId', facturaId);
        formData.append('nrFactura', nrFactura);
        formData.append('file', file);
        
        return await apiCallWithFile(formData);
    },
    
    /**
     * Upload dovadă plată (Step 3)
     */
    async uploadDovadaPlata(facturaId, file) {
        const formData = new FormData();
        formData.append('action', 'uploadDovadaPlata');
        formData.append('facturaId', facturaId);
        formData.append('file', file);
        
        return await apiCallWithFile(formData);
    },
    
    /**
     * Get facturi (cu tasks)
     */
    async getFacturi(filters = {}) {
        return await apiCall('getFacturi', filters);
    },
    
    /**
     * Get factura tasks
     */
    async getFacturaTasks(facturaId) {
        return await apiCall('getFacturaTasks', { facturaId: facturaId });
    },
    
    // ═══════════════════════════════════════════════════════════
    // NOTIFICATIONS & INBOX
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Get notifications
     */
    async getNotifications(options = {}) {
        return await apiCall('getNotifications', options);
    },
    
    /**
     * Mark notification as read
     */
    async markNotificationAsRead(notificationId) {
        return await apiCall('markNotificationAsRead', {
            notificationId: notificationId
        });
    },
    
    /**
     * Mark all notifications as read
     */
    async markAllNotificationsAsRead() {
        return await apiCall('markAllNotificationsAsRead');
    },
    
    /**
     * Acknowledge notification (Am luat la cunoștință)
     */
    async acknowledgeNotification(notificationId) {
        return await apiCall('acknowledgeNotification', {
            notificationId: notificationId
        });
    },
    
    /**
     * Acknowledge all notifications
     */
    async acknowledgeAllNotifications() {
        return await apiCall('acknowledgeAllNotifications');
    },
    
    /**
     * Delete notification
     */
    async deleteNotification(notificationId) {
        return await apiCall('deleteNotification', {
            notificationId: notificationId
        });
    },
    
    // ═══════════════════════════════════════════════════════════
    // ADMIN - BROADCAST
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Send broadcast message (Admin)
     */
    async sendBroadcastMessage(messageData) {
        return await apiCall('sendBroadcastMessage', messageData);
    },
    
    /**
     * Get broadcast stats
     */
    async getBroadcastStats(notificationId) {
        return await apiCall('getBroadcastStats', {
            notificationId: notificationId
        });
    },
    
    // ═══════════════════════════════════════════════════════════
    // ADMIN - USERS
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Get all users (Admin)
     */
    async getAllUsers(filters = {}) {
        return await apiCall('getAllUsers', filters);
    },
    
    /**
     * Create user (Admin)
     */
    async createUser(userData) {
        return await apiCall('createUser', userData);
    },
    
    /**
     * Update user (Admin)
     */
    async updateUser(userId, updates) {
        return await apiCall('updateUser', {
            userId: userId,
            updates: updates
        });
    },
    
    /**
     * Delete user (Admin)
     */
    async deleteUser(userId) {
        return await apiCall('deleteUser', { userId: userId });
    },
    
    // ═══════════════════════════════════════════════════════════
    // ADMIN - REPORTS
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Get admin reports
     */
    async getAdminReports(reportType, filters = {}) {
        return await apiCall('getAdminReports', {
            reportType: reportType,
            filters: filters
        });
    },
    
    /**
     * Export report (CSV/Excel)
     */
    async exportReport(reportType, format = 'csv') {
        return await apiCall('exportReport', {
            reportType: reportType,
            format: format
        });
    },
    
    // ═══════════════════════════════════════════════════════════
    // CHAT (AI INTEGRATION)
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Send chat message
     */
    async sendChatMessage(message) {
        return await apiCall('sendChatMessage', {
            message: message
        });
    },
    
    /**
     * Get chat history
     */
    async getChatHistory(limit = 50) {
        return await apiCall('getChatHistory', { limit: limit });
    },
    
    // ═══════════════════════════════════════════════════════════
    // CLIENT IDENTIFICATION
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Identify client (telefon = CNP)
     */
    async identifyClient(phone) {
        return await apiCall('identifyClient', { phone: phone });
    },
    
    /**
     * Get client history
     */
    async getClientHistory(phone) {
        return await apiCall('getClientHistory', { phone: phone });
    },
    
    /**
     * Get client predictions (aniversare, next purchase)
     */
    async getClientPredictions(phone) {
        return await apiCall('getClientPredictions', { phone: phone });
    }
};

// ═══════════════════════════════════════════════════════════
// CORE API CALL FUNCTION
// ═══════════════════════════════════════════════════════════

/**
 * Make API call to backend
 */
async function apiCall(action, data = {}, retryCount = 0) {
    try {
        // Add session token dacă există
        if (AppState.user && AppState.user.sessionToken) {
            data.sessionToken = AppState.user.sessionToken;
            data.userId = AppState.user.userId;
        }
        
        // Build request
        const requestData = {
            action: action,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        console.log('API Call:', action, data);
        
        // Make fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
        
        const response = await fetch(API_CONFIG.baseURL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        console.log('API Response:', action, result);
        
        return result;
        
    } catch (error) {
        console.error('API Error:', action, error);
        
        // Retry logic
        if (retryCount < API_CONFIG.retries && 
            (error.name === 'AbortError' || error.message.includes('fetch'))) {
            
            console.log(`Retrying API call (${retryCount + 1}/${API_CONFIG.retries})...`);
            await sleep(1000 * (retryCount + 1)); // Exponential backoff
            return await apiCall(action, data, retryCount + 1);
        }
        
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

/**
 * Make API call with file upload
 */
async function apiCallWithFile(formData, retryCount = 0) {
    try {
        // Add session token
        if (AppState.user && AppState.user.sessionToken) {
            formData.append('sessionToken', AppState.user.sessionToken);
            formData.append('userId', AppState.user.userId);
        }
        
        console.log('API Call with file:', formData.get('action'));
        
        // Make fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout * 2); // Longer timeout for files
        
        const response = await fetch(API_CONFIG.baseURL, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        console.log('API Response:', result);
        
        return result;
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Retry logic
        if (retryCount < API_CONFIG.retries && 
            (error.name === 'AbortError' || error.message.includes('fetch'))) {
            
            console.log(`Retrying API call (${retryCount + 1}/${API_CONFIG.retries})...`);
            await sleep(2000 * (retryCount + 1));
            return await apiCallWithFile(formData, retryCount + 1);
        }
        
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Sleep helper
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Set API base URL (pentru development/production)
 */
function setAPIBaseURL(url) {
    API_CONFIG.baseURL = url;
    console.log('API Base URL set to:', url);
}

// Export
window.API = API;
window.setAPIBaseURL = setAPIBaseURL;
