// ═══════════════════════════════════════════════════════════
// SUPERPARTY v7.0 - UTILS.JS
// Helper functions - date, currency, validation, etc
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// DATE & TIME HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Format date (Romanian format)
 */
function formatDate(date, options = {}) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
    };
    
    return date.toLocaleDateString('ro-RO', defaultOptions);
}

/**
 * Format date with time
 */
function formatDateTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleString('ro-RO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format time only
 */
function formatTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleTimeString('ro-RO', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Get time ago (relative time)
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
    const diffWeeks = Math.floor(diffMs / (86400000 * 7));
    const diffMonths = Math.floor(diffMs / (86400000 * 30));
    
    if (diffMins < 1) return 'Acum';
    if (diffMins === 1) return '1 minut';
    if (diffMins < 60) return `${diffMins} minute`;
    if (diffHours === 1) return '1 oră';
    if (diffHours < 24) return `${diffHours} ore`;
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays} zile`;
    if (diffWeeks === 1) return '1 săptămână';
    if (diffWeeks < 4) return `${diffWeeks} săptămâni`;
    if (diffMonths === 1) return '1 lună';
    if (diffMonths < 12) return `${diffMonths} luni`;
    
    return formatDate(date);
}

/**
 * Get day name (Luni, Marți, etc)
 */
function getDayName(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    return days[date.getDay()];
}

/**
 * Get month name
 */
function getMonthName(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const months = [
        'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
        'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];
    return months[date.getMonth()];
}

/**
 * Is today
 */
function isToday(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

/**
 * Is yesterday
 */
function isYesterday(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
}

// ═══════════════════════════════════════════════════════════
// CURRENCY HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Format currency (RON)
 */
function formatCurrency(amount, options = {}) {
    const defaultOptions = {
        style: 'currency',
        currency: 'RON',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        ...options
    };
    
    return new Intl.NumberFormat('ro-RO', defaultOptions).format(amount);
}

/**
 * Format number with separators
 */
function formatNumber(number, decimals = 0) {
    return new Intl.NumberFormat('ro-RO', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

/**
 * Parse currency string to number
 */
function parseCurrency(currencyString) {
    if (typeof currencyString === 'number') return currencyString;
    
    // Remove all non-numeric characters except minus and decimal separator
    const cleaned = currencyString.replace(/[^\d,-]/g, '');
    const normalized = cleaned.replace(',', '.');
    
    return parseFloat(normalized) || 0;
}

// ═══════════════════════════════════════════════════════════
// STRING HELPERS
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
 * Capitalize first letter
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate string
 */
function truncate(str, maxLength, suffix = '...') {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    
    return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Slugify string
 */
function slugify(str) {
    if (!str) return '';
    
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ═══════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Validate email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone (Romanian)
 */
function isValidPhone(phone) {
    // Remove spaces, dashes, etc
    const cleaned = phone.replace(/\D/g, '');
    
    // Romanian phone numbers: 10 digits starting with 07
    const phoneRegex = /^07\d{8}$/;
    return phoneRegex.test(cleaned);
}

/**
 * Format phone (Romanian)
 */
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
    }
    
    return phone;
}

/**
 * Validate password strength
 */
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        valid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
    };
}

// ═══════════════════════════════════════════════════════════
// LOCAL STORAGE HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Save to localStorage
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to storage:', error);
        return false;
    }
}

/**
 * Load from localStorage
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from storage:', error);
        return defaultValue;
    }
}

/**
 * Remove from localStorage
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from storage:', error);
        return false;
    }
}

/**
 * Clear all localStorage
 */
function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════
// MOBILE DETECTION
// ═══════════════════════════════════════════════════════════

/**
 * Check if mobile device
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if iOS
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Check if Android
 */
function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

/**
 * Check if standalone (PWA)
 */
function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

// ═══════════════════════════════════════════════════════════
// FILE HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Compress image before upload
 */
async function compressImage(file, maxWidth = 1920, maxHeight = 1920, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = height * (maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = width * (maxHeight / height);
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    }));
                }, 'image/jpeg', quality);
            };
            
            img.onerror = reject;
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Get file extension
 */
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * Is image file
 */
function isImageFile(filename) {
    const ext = getFileExtension(filename);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
}

// ═══════════════════════════════════════════════════════════
// ARRAY HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Group array by key
 */
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

/**
 * Sort array by key
 */
function sortBy(array, key, order = 'asc') {
    return array.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
}

/**
 * Remove duplicates
 */
function unique(array, key = null) {
    if (key) {
        return array.filter((item, index, self) => 
            index === self.findIndex(t => t[key] === item[key])
        );
    }
    
    return [...new Set(array)];
}

// ═══════════════════════════════════════════════════════════
// ASYNC HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Sleep/delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ═══════════════════════════════════════════════════════════
// CLIPBOARD HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Copy to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// ═══════════════════════════════════════════════════════════
// RANDOM HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Generate random ID
 */
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate random color
 */
function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════

// Export all functions to global scope
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatTime = formatTime;
window.getTimeAgo = getTimeAgo;
window.getDayName = getDayName;
window.getMonthName = getMonthName;
window.isToday = isToday;
window.isYesterday = isYesterday;

window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.parseCurrency = parseCurrency;

window.getInitials = getInitials;
window.capitalize = capitalize;
window.truncate = truncate;
window.slugify = slugify;

window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
window.formatPhone = formatPhone;
window.validatePassword = validatePassword;

window.saveToStorage = saveToStorage;
window.loadFromStorage = loadFromStorage;
window.removeFromStorage = removeFromStorage;
window.clearStorage = clearStorage;

window.isMobile = isMobile;
window.isIOS = isIOS;
window.isAndroid = isAndroid;
window.isStandalone = isStandalone;

window.formatFileSize = formatFileSize;
window.compressImage = compressImage;
window.getFileExtension = getFileExtension;
window.isImageFile = isImageFile;

window.groupBy = groupBy;
window.sortBy = sortBy;
window.unique = unique;

window.sleep = sleep;
window.debounce = debounce;
window.throttle = throttle;

window.copyToClipboard = copyToClipboard;

window.generateId = generateId;
window.randomColor = randomColor;
