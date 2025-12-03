/**
 * SUPERPARTY CONFIG v7.0
 * Configurare centralizată pentru frontend
 */

const SUPERPARTY_CONFIG = {
    // Backend URL - ACTUALIZEAZĂ AICI LA DEPLOYMENT NOU
    BACKEND_URL: 'https://script.google.com/macros/s/AKfycbxpV3NKZJLzNe5tTGX5TlUVnAQc1j6z82kPz7QkzartJpFfdPgvvg0T84ay1Ljlrxk/exec',
    
    // Parole (pentru referință - NU le schimba dacă nu e nevoie)
    ADMIN_PASSWORD: 'Adminandrei209512!',
    GM_PASSWORD: 'Gmandrei209512!',
    
    // Versiune
    VERSION: '7.0',
    
    // Features activate
    FEATURES: {
        CHAT_AI: true,
        DOVEZI_SYSTEM: true,
        PERFORMANCE_DASHBOARD: true,
        ADMIN_CHAT: true
    },
    
    // Debug mode
    DEBUG: true  // ← ACTIVAT pentru development!
};

// Log confirmare
console.log('✅ SuperParty v7.0 Config loaded');
console.log('📡 Backend:', SUPERPARTY_CONFIG.BACKEND_URL);
console.log('🔧 Features:', SUPERPARTY_CONFIG.FEATURES);

// Export pentru module (dacă folosești)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPERPARTY_CONFIG;
}
