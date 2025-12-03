// ═══════════════════════════════════════════════════════════
// SUPERPARTY v7.0 - API.JS - JSONP VERSION (NO CORS!)
// Backend integration cu toate cele 31 fișiere .gs
// ═══════════════════════════════════════════════════════════

// API Configuration
const API_CONFIG = {
    baseURL: 'https://script.google.com/macros/s/AKfycbxpV3NKZJLzNe5tTGX5TlUVnAQc1j6z82kPz7QkzartJpFfdPgvvg0T84ay1Ljlrxk/exec',
    timeout: 30000,
    retries: 3
};

// API Object
const API = {
    
    // AUTHENTICATION
    async login(email, password) {
        return await apiCall('login', { email: email, password: password });
    },
    
    async verifySession(sessionToken, userId) {
        return await apiCall('verifySession', { sessionToken: sessionToken, userId: userId });
    },
    
    async register(userData) {
        return await apiCall('register', userData);
    },
    
    async forgotPassword(email) {
        return await apiCall('forgotPassword', { email: email });
    },
    
    // USER PROFILE
    async getUserProfile() {
        return await apiCall('getUserProfile');
    },
    
    async updateUserProfile(updates) {
        return await apiCall('updateUserProfile', updates);
    },
    
    async changeEmail(newEmail, cod) {
        return await apiCall('changeEmail', { newEmail: newEmail, cod: cod });
    },
    
    async changeCod(newCod) {
        return await apiCall('changeCod', { newCod: newCod });
    },
    
    // PERFORMANCE DASHBOARD
    async getPerformanceDashboard() {
        return await apiCall('getPerformanceDashboard');
    },
    
    async getRankings() {
        return await apiCall('getRankings');
    },
    
    async getTeamStats() {
        return await apiCall('getTeamStats');
    },
    
    // EVENIMENTE
    async getEvents(filters = {}) {
        return await apiCall('getEvents', filters);
    },
    
    async getEvent(eventId) {
        return await apiCall('getEvent', { eventId: eventId });
    },
    
    async createEvent(eventData) {
        return await apiCall('createEvent', eventData);
    },
    
    async updateEvent(eventId, updates) {
        return await apiCall('updateEvent', { eventId: eventId, updates: updates });
    },
    
    async archiveEvent(eventId) {
        return await apiCall('archiveEvent', { eventId: eventId });
    },
    
    async bulkArchiveEvents(eventIds) {
        return await apiCall('bulkArchiveEvents', { eventIds: eventIds });
    },
    
    async getArchivedEvents(filters = {}) {
        return await apiCall('getArchivedEvents', filters);
    },
    
    // ROLURI
    async getRoles(eventId) {
        return await apiCall('getRoles', { eventId: eventId });
    },
    
    async assignRole(eventId, roleData) {
        return await apiCall('assignRole', { eventId: eventId, roleData: roleData });
    },
    
    async updateRole(roleId, updates) {
        return await apiCall('updateRole', { roleId: roleId, updates: updates });
    },
    
    // DOVEZI
    async uploadDovada(eventId, tipDovada, file) {
        const formData = new FormData();
        formData.append('action', 'uploadDovada');
        formData.append('eventId', eventId);
        formData.append('tipDovada', tipDovada);
        formData.append('file', file);
        return await apiCallWithFile(formData);
    },
    
    async getDovezi(eventId) {
        return await apiCall('getDovezi', { eventId: eventId });
    },
    
    async validateDovada(dovadaId) {
        return await apiCall('validateDovada', { dovadaId: dovadaId });
    },
    
    // ÎNCASARE
    async registerIncasare(eventId, incasareData) {
        return await apiCall('registerIncasare', { eventId: eventId, incasareData: incasareData });
    },
    
    async getIncasare(eventId) {
        return await apiCall('getIncasare', { eventId: eventId });
    },
    
    // FACTURĂ WORKFLOW
    async submitDateFirma(facturaId, firmaData) {
        return await apiCall('submitDateFirma', { facturaId: facturaId, firmaData: firmaData });
    },
    
    async uploadDovadaFactura(facturaId, file, nrFactura) {
        const formData = new FormData();
        formData.append('action', 'uploadDovadaFactura');
        formData.append('facturaId', facturaId);
        formData.append('nrFactura', nrFactura);
        formData.append('file', file);
        return await apiCallWithFile(formData);
    },
    
    async uploadDovadaPlata(facturaId, file) {
        const formData = new FormData();
        formData.append('action', 'uploadDovadaPlata');
        formData.append('facturaId', facturaId);
        formData.append('file', file);
        return await apiCallWithFile(formData);
    },
    
    async getFacturi(filters = {}) {
        return await apiCall('getFacturi', filters);
    },
    
    async getFacturaTasks(facturaId) {
        return await apiCall('getFacturaTasks', { facturaId: facturaId });
    },
    
    // NOTIFICATIONS & INBOX
    async getNotifications(options = {}) {
        return await apiCall('getNotifications', options);
    },
    
    async markNotificationAsRead(notificationId) {
        return await apiCall('markNotificationAsRead', { notificationId: notificationId });
    },
    
    async markAllNotificationsAsRead() {
        return await apiCall('markAllNotificationsAsRead');
    },
    
    async acknowledgeNotification(notificationId) {
        return await apiCall('acknowledgeNotification', { notificationId: notificationId });
    },
    
    async acknowledgeAllNotifications() {
        return await apiCall('acknowledgeAllNotifications');
    },
    
    async deleteNotification(notificationId) {
        return await apiCall('deleteNotification', { notificationId: notificationId });
    },
    
    // ADMIN - BROADCAST
    async sendBroadcastMessage(messageData) {
        return await apiCall('sendBroadcastMessage', messageData);
    },
    
    async getBroadcastStats(notificationId) {
        return await apiCall('getBroadcastStats', { notificationId: notificationId });
    },
    
    // ADMIN - USERS
    async getAllUsers(filters = {}) {
        return await apiCall('getAllUsers', filters);
    },
    
    async createUser(userData) {
        return await apiCall('createUser', userData);
    },
    
    async updateUser(userId, updates) {
        return await apiCall('updateUser', { userId: userId, updates: updates });
    },
    
    async deleteUser(userId) {
        return await apiCall('deleteUser', { userId: userId });
    },
    
    // ADMIN - REPORTS
    async getAdminReports(reportType, filters = {}) {
        return await apiCall('getAdminReports', { reportType: reportType, filters: filters });
    },
    
    async exportReport(reportType, format = 'csv') {
        return await apiCall('exportReport', { reportType: reportType, format: format });
    },
    
    // CHAT (AI INTEGRATION)
    async sendChatMessage(message) {
        return await apiCall('sendChatMessage', { message: message });
    },
    
    async getChatHistory(limit = 50) {
        return await apiCall('getChatHistory', { limit: limit });
    },
    
    // CLIENT IDENTIFICATION
    async identifyClient(phone) {
        return await apiCall('identifyClient', { phone: phone });
    },
    
    async getClientHistory(phone) {
        return await apiCall('getClientHistory', { phone: phone });
    },
    
    async getClientPredictions(phone) {
        return await apiCall('getClientPredictions', { phone: phone });
    }
};

// ═══════════════════════════════════════════════════════════
// CORE API CALL FUNCTION - JSONP VERSION (NO CORS!)
// ═══════════════════════════════════════════════════════════

async function apiCall(action, data = {}, retryCount = 0) {
    try {
        if (AppState.user && AppState.user.sessionToken) {
            data.sessionToken = AppState.user.sessionToken;
            data.userId = AppState.user.userId;
        }
        
        console.log('🚀 API Call [JSONP]:', action, data);
        
        return await new Promise((resolve, reject) => {
            const callbackName = 'jsonpCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            window[callbackName] = function(response) {
                console.log('✅ API Response:', action, response);
                delete window[callbackName];
                const scripts = document.querySelectorAll('script[data-callback="' + callbackName + '"]');
                scripts.forEach(s => s.remove());
                resolve(response);
            };
            
            const url = new URL(API_CONFIG.baseURL);
            url.searchParams.append('action', action);
            url.searchParams.append('callback', callbackName);
            url.searchParams.append('_', Date.now());
            
            Object.keys(data).forEach(key => {
                const value = data[key];
                if (value !== null && value !== undefined) {
                    url.searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
                }
            });
            
            const script = document.createElement('script');
            script.setAttribute('data-callback', callbackName);
            script.src = url.toString();
            
            script.onerror = function() {
                console.error('❌ JSONP Error:', action);
                delete window[callbackName];
                reject(new Error('Network error - cannot reach backend'));
            };
            
            const timeout = setTimeout(() => {
                console.error('⏱️ JSONP Timeout:', action);
                delete window[callbackName];
                script.remove();
                reject(new Error('Request timeout'));
            }, API_CONFIG.timeout);
            
            const originalCallback = window[callbackName];
            window[callbackName] = function(response) {
                clearTimeout(timeout);
                originalCallback(response);
            };
            
            document.head.appendChild(script);
        });
        
    } catch (error) {
        console.error('API Error:', action, error);
        
        if (retryCount < API_CONFIG.retries) {
            console.log('Retrying API call (' + (retryCount + 1) + '/' + API_CONFIG.retries + ')...');
            await sleep(1000 * (retryCount + 1));
            return await apiCall(action, data, retryCount + 1);
        }
        
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

async function apiCallWithFile(formData, retryCount = 0) {
    try {
        if (AppState.user && AppState.user.sessionToken) {
            formData.append('sessionToken', AppState.user.sessionToken);
            formData.append('userId', AppState.user.userId);
        }
        
        console.log('API Call with file:', formData.get('action'));
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout * 2);
        
        const response = await fetch(API_CONFIG.baseURL, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        return result;
        
    } catch (error) {
        console.error('API Error:', error);
        
        if (retryCount < API_CONFIG.retries && (error.name === 'AbortError' || error.message.includes('fetch'))) {
            console.log('Retrying API call (' + (retryCount + 1) + '/' + API_CONFIG.retries + ')...');
            await sleep(2000 * (retryCount + 1));
            return await apiCallWithFile(formData, retryCount + 1);
        }
        
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setAPIBaseURL(url) {
    API_CONFIG.baseURL = url;
    console.log('API Base URL set to:', url);
}

window.API = API;
window.setAPIBaseURL = setAPIBaseURL;
