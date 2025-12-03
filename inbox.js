// ═══════════════════════════════════════════════════════════
// SUPERPARTY v7.0 - INBOX.JS
// Notification inbox cu acknowledge system
// Mobile-optimized cu swipe gestures
// ═══════════════════════════════════════════════════════════

// Inbox State
const InboxState = {
    notifications: [],
    currentFilter: 'all',
    loading: false
};

// ═══════════════════════════════════════════════════════════
// LOAD NOTIFICATION PANEL
// ═══════════════════════════════════════════════════════════

/**
 * Load notification panel (când se deschide)
 */
async function loadNotificationPanel() {
    console.log('Loading notification panel...');
    
    // Show loading
    showInboxLoading();
    
    try {
        // Load notifications
        const response = await API.getNotifications({
            includeAcknowledged: false
        });
        
        if (response.success) {
            InboxState.notifications = response.notifications || [];
            
            // Update counts
            updateNotificationCounts(response);
            
            // Render notifications
            renderNotifications(InboxState.currentFilter);
        } else {
            showToast('Eroare la încărcarea notificărilor', 'error');
        }
        
    } catch (error) {
        console.error('Error loading notifications:', error);
        showToast('Eroare la încărcarea notificărilor', 'error');
    }
    
    // Setup filter buttons
    setupNotificationFilters();
    
    // Setup action buttons
    setupNotificationActions();
}

/**
 * Show inbox loading
 */
function showInboxLoading() {
    const container = document.getElementById('notification-list');
    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; padding: 40px;">
            <div class="loading-spinner"></div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════
// RENDER NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

/**
 * Render notifications cu filter
 */
function renderNotifications(filter = 'all') {
    InboxState.currentFilter = filter;
    
    const container = document.getElementById('notification-list');
    
    // Filter notifications
    let filtered = InboxState.notifications;
    
    if (filter === 'unread') {
        filtered = filtered.filter(n => !n.Read);
    } else if (filter === 'urgent') {
        filtered = filtered.filter(n => n.Priority === 'urgent');
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.Created_At) - new Date(a.Created_At));
    
    // Render
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-tertiary);">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>Nicio notificare</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(notif => renderNotificationItem(notif)).join('');
    
    // Setup swipe gestures
    setupSwipeGestures();
    
    // Setup click handlers
    setupNotificationClickHandlers();
}

/**
 * Render notification item
 */
function renderNotificationItem(notif) {
    const isUnread = !notif.Read;
    const isUrgent = notif.Priority === 'urgent';
    const requiresAck = notif.Requires_Acknowledge;
    
    const priorityClass = isUrgent ? 'urgent' : (requiresAck ? 'requires-acknowledge' : '');
    const unreadClass = isUnread ? 'unread' : '';
    
    const priorityIcon = getPriorityIcon(notif.Priority);
    const timeAgo = getTimeAgo(notif.Created_At);
    
    return `
        <div class="notification-item ${unreadClass} ${priorityClass}" 
             data-id="${notif.Notification_ID}"
             data-requires-ack="${requiresAck}">
            
            <div class="notification-header">
                <span class="notification-type">
                    <i class="${priorityIcon}"></i>
                    ${getNotificationTypeLabel(notif.Type)}
                </span>
                <span class="notification-time">${timeAgo}</span>
            </div>
            
            <div class="notification-message">${notif.Message}</div>
            
            ${notif.Action_URL ? `
                <a href="${notif.Action_URL}" class="notification-link">
                    <i class="fas fa-external-link-alt"></i> Vezi detalii
                </a>
            ` : ''}
            
            <div class="notification-actions-btns">
                ${requiresAck ? `
                    <button class="btn-acknowledge" data-id="${notif.Notification_ID}">
                        <i class="fas fa-check-circle"></i> Am luat la cunoștință
                    </button>
                ` : `
                    <button class="btn-acknowledge" data-id="${notif.Notification_ID}">
                        <i class="fas fa-check"></i> OK
                    </button>
                `}
                
                <button class="btn-delete" data-id="${notif.Notification_ID}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Get priority icon
 */
function getPriorityIcon(priority) {
    const icons = {
        'urgent': 'fas fa-exclamation-circle',
        'high': 'fas fa-exclamation-triangle',
        'normal': 'fas fa-info-circle',
        'low': 'fas fa-circle'
    };
    return icons[priority] || icons.normal;
}

/**
 * Get notification type label
 */
function getNotificationTypeLabel(type) {
    const labels = {
        'event_start': 'Petrecere',
        'task_reminder': 'Task',
        'payment_blocked': 'Plată',
        'general_announcement': 'Anunț',
        'acknowledge_reminder': 'Reminder',
        'admin_announcement': 'Admin',
        'factura_task': 'Factură',
        'archive_complete': 'Arhivare',
        'payment_released': 'Plată Deblocată'
    };
    return labels[type] || 'Notificare';
}

// ═══════════════════════════════════════════════════════════
// UPDATE COUNTS
// ═══════════════════════════════════════════════════════════

/**
 * Update notification counts
 */
function updateNotificationCounts(data) {
    const all = InboxState.notifications.length;
    const unread = InboxState.notifications.filter(n => !n.Read).length;
    const urgent = InboxState.notifications.filter(n => n.Priority === 'urgent').length;
    
    // Update filter buttons
    document.getElementById('notif-count-all').textContent = all;
    document.getElementById('notif-count-unread').textContent = unread;
    document.getElementById('notif-count-urgent').textContent = urgent;
}

// ═══════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════

/**
 * Setup notification filters
 */
function setupNotificationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Render with filter
            renderNotifications(filter);
        });
    });
}

// ═══════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Setup notification actions (mark all read, acknowledge all)
 */
function setupNotificationActions() {
    // Mark all as read
    document.getElementById('btn-mark-all-read').addEventListener('click', async () => {
        await markAllAsRead();
    });
    
    // Acknowledge all
    document.getElementById('btn-acknowledge-all').addEventListener('click', async () => {
        await acknowledgeAll();
    });
}

/**
 * Setup click handlers pentru notifications
 */
function setupNotificationClickHandlers() {
    // Acknowledge buttons
    const ackButtons = document.querySelectorAll('.btn-acknowledge');
    ackButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const notifId = btn.getAttribute('data-id');
            await acknowledgeNotification(notifId);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const notifId = btn.getAttribute('data-id');
            await deleteNotification(notifId);
        });
    });
    
    // Mark as read când se dă click pe notification
    const notifItems = document.querySelectorAll('.notification-item');
    notifItems.forEach(item => {
        item.addEventListener('click', async () => {
            const notifId = item.getAttribute('data-id');
            await markAsRead(notifId);
        });
    });
}

// ═══════════════════════════════════════════════════════════
// ACKNOWLEDGE
// ═══════════════════════════════════════════════════════════

/**
 * Acknowledge notification
 */
async function acknowledgeNotification(notificationId) {
    try {
        const response = await API.acknowledgeNotification(notificationId);
        
        if (response.success) {
            // Remove from list
            InboxState.notifications = InboxState.notifications.filter(
                n => n.Notification_ID !== notificationId
            );
            
            // Re-render
            renderNotifications(InboxState.currentFilter);
            
            // Update badge
            await loadNotifications();
            
            showToast('✅ Confirmat!', 'success');
        } else {
            showToast('Eroare la confirmare', 'error');
        }
        
    } catch (error) {
        console.error('Error acknowledging notification:', error);
        showToast('Eroare la confirmare', 'error');
    }
}

/**
 * Acknowledge all notifications
 */
async function acknowledgeAll() {
    showModal(
        '❓ Confirmare',
        'Vrei să confirmi TOATE notificările?',
        [
            {
                text: 'Anulează',
                className: 'btn-text'
            },
            {
                text: 'Confirmă Toate',
                className: 'btn-primary',
                action: async () => {
                    try {
                        const response = await API.acknowledgeAllNotifications();
                        
                        if (response.success) {
                            // Clear list
                            InboxState.notifications = [];
                            
                            // Re-render
                            renderNotifications(InboxState.currentFilter);
                            
                            // Update badge
                            await loadNotifications();
                            
                            showToast(`✅ ${response.count || 0} notificări confirmate!`, 'success');
                        } else {
                            showToast('Eroare la confirmare', 'error');
                        }
                        
                    } catch (error) {
                        console.error('Error acknowledging all:', error);
                        showToast('Eroare la confirmare', 'error');
                    }
                }
            }
        ]
    );
}

// ═══════════════════════════════════════════════════════════
// MARK AS READ
// ═══════════════════════════════════════════════════════════

/**
 * Mark notification as read
 */
async function markAsRead(notificationId) {
    try {
        // Find notification
        const notif = InboxState.notifications.find(n => n.Notification_ID === notificationId);
        if (!notif || notif.Read) return;
        
        const response = await API.markNotificationAsRead(notificationId);
        
        if (response.success) {
            // Update local state
            notif.Read = true;
            
            // Update UI
            const element = document.querySelector(`[data-id="${notificationId}"]`);
            if (element) {
                element.classList.remove('unread');
            }
            
            // Update badge
            await loadNotifications();
        }
        
    } catch (error) {
        console.error('Error marking as read:', error);
    }
}

/**
 * Mark all as read
 */
async function markAllAsRead() {
    try {
        const response = await API.markAllNotificationsAsRead();
        
        if (response.success) {
            // Update local state
            InboxState.notifications.forEach(n => n.Read = true);
            
            // Re-render
            renderNotifications(InboxState.currentFilter);
            
            // Update badge
            await loadNotifications();
            
            showToast('✅ Toate marcate ca citite!', 'success');
        } else {
            showToast('Eroare la marcare', 'error');
        }
        
    } catch (error) {
        console.error('Error marking all as read:', error);
        showToast('Eroare la marcare', 'error');
    }
}

// ═══════════════════════════════════════════════════════════
// DELETE
// ═══════════════════════════════════════════════════════════

/**
 * Delete notification
 */
async function deleteNotification(notificationId) {
    try {
        const response = await API.deleteNotification(notificationId);
        
        if (response.success) {
            // Remove from list
            InboxState.notifications = InboxState.notifications.filter(
                n => n.Notification_ID !== notificationId
            );
            
            // Re-render
            renderNotifications(InboxState.currentFilter);
            
            // Update badge
            await loadNotifications();
            
            showToast('🗑️ Șters!', 'success');
        } else {
            showToast('Eroare la ștergere', 'error');
        }
        
    } catch (error) {
        console.error('Error deleting notification:', error);
        showToast('Eroare la ștergere', 'error');
    }
}

// ═══════════════════════════════════════════════════════════
// SWIPE GESTURES (pentru mobile)
// ═══════════════════════════════════════════════════════════

/**
 * Setup swipe gestures pe notificari
 * Swipe left = delete
 * Swipe right = acknowledge
 */
function setupSwipeGestures() {
    const notifItems = document.querySelectorAll('.notification-item');
    
    notifItems.forEach(item => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        item.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        item.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            
            // Apply transform
            if (Math.abs(diffX) > 10) {
                item.style.transform = `translateX(${diffX}px)`;
                item.style.transition = 'none';
            }
        }, { passive: true });
        
        item.addEventListener('touchend', async (e) => {
            if (!isDragging) return;
            
            const diffX = currentX - startX;
            isDragging = false;
            
            // Reset transform
            item.style.transition = 'transform 0.3s ease';
            item.style.transform = '';
            
            // Check swipe direction
            if (Math.abs(diffX) > 100) {
                const notifId = item.getAttribute('data-id');
                
                if (diffX > 0) {
                    // Swipe right = acknowledge
                    await acknowledgeNotification(notifId);
                } else {
                    // Swipe left = delete
                    await deleteNotification(notifId);
                }
            }
        }, { passive: true });
    });
}

// ═══════════════════════════════════════════════════════════
// REFRESH
// ═══════════════════════════════════════════════════════════

/**
 * Refresh notifications
 */
async function refreshNotifications() {
    await loadNotificationPanel();
}

// Export pentru global access
window.loadNotificationPanel = loadNotificationPanel;
window.refreshNotifications = refreshNotifications;
