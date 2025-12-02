// ═══════════════════════════════════════════════════════════════
// API.JS - Comunicare cu backend prin JSONP
// ═══════════════════════════════════════════════════════════════

/**
 * JSONP API CALL - Universal function to bypass CORS
 * 
 * @param {string} action - Acțiunea de executat pe backend
 * @param {object} params - Parametri pentru acțiune
 * @param {function} callback - Funcție callback cu rezultatul
 */
function apiCall(action, params, callback) {
    const callbackName = 'jsonpCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    window[callbackName] = function(data) {
        console.log(`✅ JSONP [${action}]:`, data);
        delete window[callbackName];
        const scripts = document.querySelectorAll(`script[data-callback="${callbackName}"]`);
        scripts.forEach(s => s.remove());
        if (callback) callback(data);
    };
    
    const queryParams = new URLSearchParams({
        action: action,
        callback: callbackName,
        _: Date.now(),
        ...params
    });
    
    const script = document.createElement('script');
    script.setAttribute('data-callback', callbackName);
    script.src = `${BACKEND_URL}?${queryParams.toString()}`;
    
    script.onerror = function() {
        console.error(`❌ JSONP [${action}] failed`);
        delete window[callbackName];
        if (callback) callback({ success: false, error: 'Network error' });
    };
    
    document.body.appendChild(script);
}

/**
 * API Call special pentru chat (folosește același endpoint)
 * 
 * @param {object} params - Parametri chat
 * @param {function} callback - Funcție callback cu rezultatul
 */
function chatApiCall(params, callback) {
    apiCall('chat', params, callback);
}

/**
 * API Call special pentru dovezi poze
 * 
 * @param {object} params - Parametri dovezi
 * @param {function} callback - Funcție callback cu rezultatul
 */
function doveziApiCall(params, callback) {
    apiCall('uploadDovezi', params, callback);
}
