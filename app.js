// --- EMAILJS CONFIGURATION ---
// 1. Sign up at https://www.emailjs.com/
// 2. Create an Email Service (e.g., Gmail)
// 3. Create an Email Template
// 4. Copy your Public Key, Service ID, and Template ID here:
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'e256tO1Gj8TchS_kU', // Found in Account > Public Key
    SERVICE_ID: 'service_fkkz3xn', // Found in Email Services
    TEMPLATE_ID: 'template_20moi3' // Found in Email Templates
};

// --- PAYSTACK CONFIGURATION ---
const PAYSTACK_PUBLIC_KEY = 'pk_test_2bb26297bc62eac90fce93b6b024958e4e909cae'; // Your Paystack Public Key

// --- NOTIFICATION SYSTEM ---
class NotificationManager {
    static init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }
    
    static show(message, type = 'success') {
        this.init();
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
}
window.NotificationManager = NotificationManager;



// --- AUTHENTICATION MODULE ---
const auth = {
    register: (name, email, phone, password, role = 'user') => {
        // Validation
        if (!name || !email || !password) {
            return { success: false, message: 'Please fill in all required fields' };
        }

        // Check if user exists
        const storageKey = role === 'user' ? 'gasUsers' : 'gasVendors';
        const entities = JSON.parse(localStorage.getItem(storageKey)) || [];
        if (entities.find(e => e.email === email)) {
            return { success: false, message: 'Email already registered. Please Login.' };
        }

        // Create Entity
        const newEntity = {
            id: (role === 'user' ? 'u_' : 'v_') + Math.random().toString(36).substr(2, 9),
            name,
            email,
            phone,
            password, // In a real app, hash this!
            role,
            joined: new Date().toLocaleDateString()
        };

        entities.push(newEntity);
        localStorage.setItem(storageKey, JSON.stringify(entities));

        // Auto Login
        localStorage.setItem('currentUser', JSON.stringify(newEntity));
        return { success: true, role };
    },

    login: (email, password) => {
        const emberAccounts = JSON.parse(localStorage.getItem('emberGasAccounts')) || [];
        const users = JSON.parse(localStorage.getItem('gasUsers')) || [];
        const vendors = JSON.parse(localStorage.getItem('gasVendors')) || [];

        const allAccounts = [...emberAccounts, ...users, ...vendors];
        const matched = allAccounts.find(a => a.email && a.email.toLowerCase() === email.toLowerCase() && a.password === password);

        if (matched) {
            const role = (matched.role || 'customer').toLowerCase();
            const activeUser = { ...matched, role: role === 'user' ? 'customer' : role };
            localStorage.setItem('currentUser', JSON.stringify(activeUser));
            return { success: true, role: activeUser.role };
        } else {
            return { success: false, message: 'Invalid Email or Password' };
        }
    },

    logout: () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const name = user ? user.name : 'User';
        localStorage.removeItem('currentUser');
        if (window.NotificationManager) {
            NotificationManager.show(`Logged out ${name} successfully!`, 'success');
        }
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    },

    deleteAccountPermanently: async () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user || !user.email) {
            if (window.NotificationManager) NotificationManager.show('No active user session found.', 'error');
            return;
        }

        const confirmMsg = `⚠️ PERMANENT ACCOUNT DELETION\n\nAre you sure you want to PERMANENTLY DELETE your account (${user.email})?\n\nThis will remove your user profile, wallet balance, and order history from our database. This action CANNOT be undone!`;
        
        if (!confirm(confirmMsg)) return;

        if (window.NotificationManager) {
            NotificationManager.show(`Deleting account ${user.email} permanently...`, 'success');
        }

        // Send request to backend API to remove from MongoDB database
        try {
            const hosts = Array.from(new Set([
                `http://${window.location.hostname || '127.0.0.1'}:5000`,
                'http://127.0.0.1:5000',
                'http://localhost:5000'
            ]));

            for (const host of hosts) {
                try {
                    await fetch(host + '/api/auth/delete-account', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.email })
                    });
                    break;
                } catch (e) {}
            }
        } catch (err) {
            console.warn('Backend delete sync note:', err.message);
        }

        // Clean up local account registry
        const accounts = JSON.parse(localStorage.getItem('emberGasAccounts') || '[]');
        const filtered = accounts.filter(a => a.email?.toLowerCase() !== user.email.toLowerCase());
        localStorage.setItem('emberGasAccounts', JSON.stringify(filtered));

        // Wipe user wallet balance & transaction history
        const wallets = JSON.parse(localStorage.getItem('emberGasWallets') || '{}');
        delete wallets[user.email];
        localStorage.setItem('emberGasWallets', JSON.stringify(wallets));
        localStorage.removeItem(`ember_tx_${user.email}`);
        localStorage.removeItem('currentUser');

        if (window.NotificationManager) {
            NotificationManager.show('🗑️ Account permanently deleted. Redirecting to home...', 'success');
        }

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    },

    checkSession: () => {
        // Enforce strict route access guard
        if (typeof AuthGuard !== 'undefined') {
            const allowed = AuthGuard.enforceSession();
            if (!allowed) return;
        }

        const user = JSON.parse(localStorage.getItem('currentUser'));
        const authLink = document.getElementById('authLink');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        if (authLink) {
            if (user) {
                const initials = user.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'EG';
                authLink.innerHTML = `
                    <div onclick="if(typeof openProfileModal==='function'){ openProfileModal(); } else { window.location.href='dashboard.html'; }" 
                         title="My Account Profile"
                         style="display: flex; align-items: center; gap: 6px; background: rgba(0, 177, 79, 0.12); border: 1.5px solid rgba(0, 177, 79, 0.35); padding: 5px 12px; border-radius: 20px; cursor: pointer; transition: all 0.2s ease;">
                        <div style="width: 26px; height: 26px; border-radius: 50%; background: #00B14F; color: #fff; font-weight: 900; font-size: 0.78rem; display: flex; align-items: center; justify-content: center;">${initials}</div>
                        <span style="font-size: 0.82rem; font-weight: 800; color: #00B14F;">${user.name ? user.name.split(' ')[0] : 'Account'}</span>
                    </div>
                `;
            } else {
                authLink.innerHTML = `
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <a href="login.html" class="nav-btn-secondary nav-desktop-links" style="padding: 7px 14px; border-radius: 10px; border: 1px solid #E5E7EB; background: #F3F4F6; color: #111827; text-decoration: none; font-size: 0.85rem; font-weight: 700;">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In
                        </a>
                    </div>
                `;
            }
        }

        // --- Navbar Highlighting ---
        const navLinks = document.querySelectorAll('.nav-links a, .side-menu-link');
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('highlight');
            } else {
                link.classList.remove('highlight');
            }
        });

        // Auto-fill order form if on index page
        const orderForm = document.getElementById('gasOrderForm');
        if (user && orderForm) {
            if (orderForm.fullName) orderForm.fullName.value = user.name;
            if (orderForm.email) orderForm.email.value = user.email;
            if (orderForm.phone) orderForm.phone.value = user.phone;
        }
    }
};

// --- STRICT AUTHENTICATION GUARD CLASS ---
class AuthGuard {
    static getProtectedPages() {
        return ['dashboard.html', 'seller_dashboard.html', 'refiller_dashboard.html', 'track.html', 'admin.html'];
    }

    // Maps each page to the ONLY roles allowed to access it
    static getPageRoles() {
        return {
            'dashboard.html':           ['customer', 'user'],
            'seller_dashboard.html':    ['vendor', 'seller'],
            'refiller_dashboard.html':  ['refiller', 'rider'],
            'admin.html':               ['admin'],
            'track.html':               ['customer', 'user', 'vendor', 'seller', 'refiller', 'rider', 'admin']
        };
    }

    static enforceSession() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        if (this.getProtectedPages().includes(currentPath)) {
            if (!user) {
                sessionStorage.setItem('redirectAfterLogin', currentPath);
                window.location.href = `login.html?auth_required=true&redirect=${encodeURIComponent(currentPath)}`;
                return false;
            }

            // ── ROLE-BASED PAGE ACCESS GUARD ──────────────────────────
            const allowedRoles = this.getPageRoles()[currentPath] || [];
            const userRole = (user.role || 'customer').toLowerCase();
            if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
                // Determine correct dashboard for this user
                const correctDash = {
                    customer: 'dashboard.html',
                    vendor:   'seller_dashboard.html',
                    seller:   'seller_dashboard.html',
                    refiller: 'refiller_dashboard.html',
                    rider:    'refiller_dashboard.html',
                    admin:    'admin.html'
                }[userRole] || 'dashboard.html';

                if (window.NotificationManager) {
                    NotificationManager.show(`⛔ Access Denied — this portal is not for ${userRole} accounts. Redirecting to your dashboard...`, 'error');
                }
                setTimeout(() => { window.location.href = correctDash; }, 1200);
                return false;
            }
            // ─────────────────────────────────────────────────────────
        }
        return true;
    }

    static requireAuth(actionCallback) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            if (window.NotificationManager) {
                NotificationManager.show('Please create an account or log in first!', 'error');
            }
            setTimeout(() => {
                window.location.href = 'login.html?auth_required=true';
            }, 800);
            return false;
        }
        if (typeof actionCallback === 'function') {
            actionCallback(user);
        }
        return true;
    }
}
window.AuthGuard = AuthGuard;

// --- WALLET MANAGER ---
const WalletManager = {
    getBalance(email) {
        const wallets = JSON.parse(localStorage.getItem('emberGasWallets') || '{}');
        return wallets[email] || 0;
    },

    setBalance(email, amount) {
        const wallets = JSON.parse(localStorage.getItem('emberGasWallets') || '{}');
        wallets[email] = amount;
        localStorage.setItem('emberGasWallets', JSON.stringify(wallets));
    },

    topUp(email, amount) {
        const current = this.getBalance(email);
        const newBal = current + amount;
        this.setBalance(email, newBal);

        // Log transaction
        const txKey = `ember_tx_${email}`;
        const txList = JSON.parse(localStorage.getItem(txKey) || '[]');
        txList.unshift({
            type: 'TOPUP',
            amount: amount,
            balanceAfter: newBal,
            date: new Date().toISOString(),
            ref: 'WALL-' + Math.random().toString(36).substring(2, 10).toUpperCase()
        });
        localStorage.setItem(txKey, JSON.stringify(txList.slice(0, 50)));
        return newBal;
    },

    deduct(email, amount) {
        const current = this.getBalance(email);
        if (current < amount) return { success: false, message: 'Insufficient wallet balance' };
        const newBal = current - amount;
        this.setBalance(email, newBal);

        const txKey = `ember_tx_${email}`;
        const txList = JSON.parse(localStorage.getItem(txKey) || '[]');
        txList.unshift({
            type: 'DEBIT',
            amount: amount,
            balanceAfter: newBal,
            date: new Date().toISOString(),
            ref: 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase()
        });
        localStorage.setItem(txKey, JSON.stringify(txList.slice(0, 50)));
        return { success: true, newBalance: newBal };
    },

    getTransactions(email) {
        return JSON.parse(localStorage.getItem(`ember_tx_${email}`) || '[]');
    },

    // Opens the wallet top-up modal
    openTopUpModal() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            if (window.NotificationManager) NotificationManager.show('Please log in to top up your wallet.', 'error');
            return;
        }

        // Remove old modal if exists
        const old = document.getElementById('walletTopUpModal');
        if (old) old.remove();

        const balance = this.getBalance(user.email);
        const modal = document.createElement('div');
        modal.id = 'walletTopUpModal';
        modal.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
            z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
        `;
        modal.innerHTML = `
            <div style="background: #FFFFFF; border-radius: 24px; padding: 32px 28px; max-width: 420px; width: 100%; box-shadow: 0 25px 60px rgba(0,0,0,0.2); position: relative; animation: slideUp 0.3s ease;">
                <button onclick="document.getElementById('walletTopUpModal').remove()" style="position: absolute; top: 16px; right: 16px; background: #F3F4F6; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1rem; color: #374151;"><i class="fa-solid fa-xmark"></i></button>

                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="width: 60px; height: 60px; background: #E6F7ED; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; font-size: 1.6rem; color: #00B14F;">
                        <i class="fa-solid fa-wallet"></i>
                    </div>
                    <h3 style="font-size: 1.4rem; font-weight: 800; color: #111827; margin: 0 0 4px;">Top Up Wallet</h3>
                    <div style="font-size: 0.9rem; color: #6B7280;">Current Balance: <strong style="color: #00B14F;">₦${balance.toLocaleString()}</strong></div>
                </div>

                <!-- Quick Amount Presets -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px;">
                    ${[2000, 5000, 10000, 20000, 50000, 100000].map(amt => `
                        <button onclick="document.getElementById('topUpAmount').value = ${amt}; document.querySelectorAll('.topup-preset').forEach(b => b.style.background = '#F3F4F6'); this.style.background='#E6F7ED'; this.style.borderColor='#00B14F';" class="topup-preset"
                            style="background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 12px; padding: 10px; font-weight: 800; font-size: 0.88rem; cursor: pointer; color: #374151; transition: all 0.2s;">
                            ₦${amt.toLocaleString()}
                        </button>
                    `).join('')}
                </div>

                <div style="margin-bottom: 18px;">
                    <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #374151; margin-bottom: 6px;">Or Enter Custom Amount</label>
                    <input id="topUpAmount" type="number" min="100" max="1000000" placeholder="e.g. 15000"
                        style="width: 100%; padding: 14px 16px; border: 1.5px solid #D1D5DB; border-radius: 14px; font-size: 1rem; font-weight: 700; color: #111827; outline: none; box-sizing: border-box;"
                        onfocus="this.style.borderColor='#00B14F'" onblur="this.style.borderColor='#D1D5DB'">
                </div>

                <div style="display: flex; gap: 10px;">
                    <button onclick="WalletManager._processTopUp()" style="flex: 1; background: #00B14F; color: white; border: none; padding: 14px; border-radius: 14px; font-size: 1rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="fa-solid fa-bolt"></i> Fund Wallet
                    </button>
                </div>

                <p style="font-size: 0.76rem; color: #9CA3AF; text-align: center; margin-top: 14px;">
                    <i class="fa-solid fa-shield-halved" style="color: #00B14F;"></i> Secured via Paystack — Your funds are 100% safe
                </p>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    },

    _processTopUp() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const amountInput = document.getElementById('topUpAmount');
        const amount = parseInt(amountInput.value);

        if (!amount || amount < 100) {
            if (window.NotificationManager) NotificationManager.show('Please enter a valid amount (min ₦100)', 'error');
            return;
        }

        // Use Paystack inline if available, otherwise simulate
        if (typeof PaystackPop !== 'undefined' && window.PAYSTACK_PUBLIC_KEY) {
            const handler = PaystackPop.setup({
                key: window.PAYSTACK_PUBLIC_KEY,
                email: user.email,
                amount: amount * 100, // kobo
                currency: 'NGN',
                ref: 'EMBER_' + Date.now(),
                metadata: { custom_fields: [{ display_name: 'Wallet Top-Up', variable_name: 'topup', value: user.name }] },
                callback: (response) => {
                    const newBal = WalletManager.topUp(user.email, amount);
                    document.getElementById('walletTopUpModal').remove();
                    if (window.NotificationManager) NotificationManager.show(`✅ Wallet funded! ₦${amount.toLocaleString()} added. New balance: ₦${newBal.toLocaleString()}`, 'success');
                    WalletManager.refreshDisplay();
                },
                onClose: () => { if (window.NotificationManager) NotificationManager.show('Payment cancelled.', 'error'); }
            });
            handler.openIframe();
        } else {
            // Simulation mode (dev/demo)
            const newBal = WalletManager.topUp(user.email, amount);
            document.getElementById('walletTopUpModal').remove();
            if (window.NotificationManager) NotificationManager.show(`✅ ₦${amount.toLocaleString()} added to wallet! New balance: ₦${newBal.toLocaleString()}`, 'success');
            WalletManager.refreshDisplay();
        }
    },

    refreshDisplay() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return;
        const bal = this.getBalance(user.email);
        const el = document.getElementById('walletBal');
        if (el) el.innerText = bal.toLocaleString();
    }
};
window.WalletManager = WalletManager;


// --- END-TO-END UNIFIED ORDER STATE MANAGER ---
class OrderStateManager {
    static getActiveOrder() {
        const stored = localStorage.getItem('activeEmberGasOrder');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.status !== 'COMPLETED' && parsed.status !== 'CANCELLED') {
                    return parsed;
                }
            } catch(e) {}
        }
        return null;
    }

    static saveActiveOrder(orderObj) {
        localStorage.setItem('activeEmberGasOrder', JSON.stringify(orderObj));
    }

    static createOrder(cylinderSize, serviceType, address, amount) {
        const user = JSON.parse(localStorage.getItem('currentUser')) || {};
        const calculatedAmount = amount || (parseFloat(cylinderSize) * 1100);
        const newOrder = {
            id: 'EG-' + Math.floor(1000 + Math.random() * 9000),
            customerName: user.name || 'Valued Customer',
            userEmail: user.email || 'customer@embergas.ng',
            customerPhone: user.phone || '08031122334',
            address: address || '14 Bode Thomas St, Surulere, Lagos',
            cylinderSize: cylinderSize + (String(cylinderSize).includes('kg') ? '' : ' kg'),
            size: parseFloat(cylinderSize) || 12.5,
            serviceType: serviceType || 'Cylinder Refill Only',
            amount: calculatedAmount,
            total: calculatedAmount,
            status: 'PLACED',
            vendorName: 'Grace LPG Depot Hub',
            riderName: null,
            etaMins: 25,
            createdAt: new Date().toISOString()
        };
        this.saveActiveOrder(newOrder);

        // ── Sync to global shared orders list (used by vendor dashboard) ──
        const ordersList = JSON.parse(localStorage.getItem('emberGasOrders') || '[]');
        // Remove stale entry with same id if any, then prepend
        const filtered = ordersList.filter(o => o.id !== newOrder.id);
        filtered.unshift(newOrder);
        localStorage.setItem('emberGasOrders', JSON.stringify(filtered.slice(0, 100)));

        return newOrder;
    }

    static updateOrderStatus(newStatus) {
        const order = this.getActiveOrder();
        order.status = newStatus;
        this.saveActiveOrder(order);

        // ── Sync status back to shared orders list ──
        const ordersList = JSON.parse(localStorage.getItem('emberGasOrders') || '[]');
        const idx = ordersList.findIndex(o => o.id === order.id);
        if (idx !== -1) {
            ordersList[idx] = { ...ordersList[idx], ...order };
            localStorage.setItem('emberGasOrders', JSON.stringify(ordersList));
        }
        return order;
    }

    static updateStatus(newStatus) {
        return this.updateOrderStatus(newStatus);
    }
}
window.OrderStateManager = OrderStateManager;

// --- WHATSAPP & SMS INSTANT NOTIFICATION ENGINE ---
class WhatsAppNotificationEngine {
    static sendVendorOrderDispatch(order) {
        const o = order || OrderStateManager.getActiveOrder();
        const msg = `🔥 *EMBERGAS NEW REFILL ORDER #${o.id}*\n` +
                    `-----------------------------------------\n` +
                    `👤 *Customer:* ${o.customerName} (${o.customerPhone})\n` +
                    `📍 *Address:* ${o.address}\n` +
                    `🛢️ *Cylinder:* ${o.cylinderSize} Refill\n` +
                    `💰 *Total Amount:* ₦${o.amount.toLocaleString()}\n` +
                    `🏪 *Target Depot:* ${o.vendorName}\n` +
                    `-----------------------------------------\n` +
                    `👉 *Action Required:* Please confirm station dispatch.`;
        window.open(`https://wa.me/2348031122334?text=${encodeURIComponent(msg)}`, '_blank');
    }

    static sendCustomerRefillConfirmation(order) {
        const o = order || OrderStateManager.getActiveOrder();
        const msg = `✅ *EMBERGAS REFILL CONFIRMED #${o.id}*\n` +
                    `-----------------------------------------\n` +
                    `Hello ${o.customerName}, your ${o.cylinderSize} gas refill has been verified & filled on digital scales at ${o.vendorName}.\n` +
                    `🏍️ *Rider Assigned:* ${o.riderName}\n` +
                    `⏱️ *Estimated Delivery:* ~${o.etaMins} Mins\n` +
                    `-----------------------------------------\n` +
                    `📍 *Track Live Location:* https://embergas.ng/track.html`;
        window.open(`https://wa.me/${o.customerPhone.replace(/^0/, '234')}?text=${encodeURIComponent(msg)}`, '_blank');
    }

    static sendRiderArrivalAlert(order) {
        const o = order || OrderStateManager.getActiveOrder();
        const msg = `🔔 *EMBERGAS RIDER ARRIVAL ALERT #${o.id}*\n` +
                    `-----------------------------------------\n` +
                    `Hello ${o.customerName}, your delivery rider *${o.riderName}* has arrived at your address: *${o.address}*.\n` +
                    `Please prepare your cylinder swap.`;
        window.open(`https://wa.me/${o.customerPhone.replace(/^0/, '234')}?text=${encodeURIComponent(msg)}`, '_blank');
    }
}
window.WhatsAppNotificationEngine = WhatsAppNotificationEngine;

// Expose auth to window immediately
window.auth = auth;


document.addEventListener('DOMContentLoaded', () => {
    // Run session check on load
    auth.checkSession();

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }

    // Select DOM elements
    const navbar = document.getElementById('navbar');
    const orderForm = document.getElementById('gasOrderForm');
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const cylinderSize = document.getElementById('cylinderSize');
    const orderType = document.getElementsByName('orderType');
    const summaryProduct = document.getElementById('summaryProduct');
    const summaryTotal = document.getElementById('summaryTotal');
    const prices = {
        '6kg': { refill: 8500, new: 25000 },
        '12.5kg': { refill: 17000, new: 45000 },
        '25kg': { refill: 34000, new: 85000 },
        '50kg': { refill: 68000, new: 160000 }
    };
    const STANDARD_DELIVERY = 2500;
    const EXPRESS_DELIVERY = 5000;

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- PARALLAX SCROLLING LOGIC ---
    const parallaxElements = [
        { el: document.querySelector('.floating-img'), speed: 0.15 },
        { el: document.querySelector('.orb-1'), speed: -0.1 },
        { el: document.querySelector('.orb-2'), speed: 0.2 },
        { el: document.querySelector('.hero-content'), speed: 0.05 }
    ];

    const handleParallax = () => {
        const scrollY = window.pageYOffset;

        parallaxElements.forEach(item => {
            if (item.el) {
                // Move elements based on scroll position and their specific speed
                const yPos = scrollY * item.speed;
                item.el.style.transform = `translateY(${yPos}px)`;

                // Keep existing float animation if it's the image
                if (item.el.classList.contains('floating-img')) {
                    item.el.style.transform = `translateY(${yPos}px) perspective(1000px)`;
                }
            }
        });
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleParallax);
    });

    // Enhanced Mobile Menu Drawer Toggle & Backdrop Handling
    if (menuToggle && navLinks) {
        let backdrop = document.querySelector('.nav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'nav-backdrop';
            document.body.appendChild(backdrop);
        }

        function toggleMobileMenu(forceState) {
            const shouldShow = forceState !== undefined ? forceState : !navLinks.classList.contains('active');
            menuToggle.classList.toggle('active', shouldShow);
            navLinks.classList.toggle('active', shouldShow);
            if (backdrop) backdrop.classList.toggle('active', shouldShow);
        }

        menuToggle.onclick = (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        };

        if (backdrop) {
            backdrop.onclick = (e) => {
                e.stopPropagation();
                toggleMobileMenu(false);
            };
        }

        navLinksItems.forEach(link => {
            link.onclick = () => {
                toggleMobileMenu(false);
            };
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 968) {
                toggleMobileMenu(false);
            }
        });
    }

    // Auto-wrap bare tables with .table-responsive for seamless touch scrolling
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (table.parentElement && !table.parentElement.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });

    // --- GLOBAL ROBUST API FETCH HELPER ---
    async function safeFetchApi(path, options) {
        const hosts = Array.from(new Set([
            '',
            `http://${window.location.hostname || '127.0.0.1'}:5000`,
            'http://127.0.0.1:5000',
            'http://localhost:5000'
        ]));

        let lastError;
        for (const host of hosts) {
            try {
                const targetUrl = host ? (host + path) : path;
                const res = await fetch(targetUrl, options);
                const contentType = res.headers.get('content-type') || '';
                if (res.status === 404 && contentType.includes('text/html') && host === '') {
                    continue;
                }
                if (res.status < 500) return res;
            } catch (err) {
                lastError = err;
            }
        }
        throw lastError || new Error('Server not reachable');
    }
    window.safeFetchApi = safeFetchApi;

    // Helper functions for services
    window.selectService = (type) => {
        const orderSection = document.getElementById('order');
        if (orderSection) {
            orderSection.scrollIntoView({ behavior: 'smooth' });

            // Update radio button
            const refRadio = document.getElementById('typeRefill');
            const newRadio = document.getElementById('typeNew');

            if (refRadio && newRadio) {
                if (type === 'refill') {
                    refRadio.checked = true;
                } else if (type === 'new') {
                    newRadio.checked = true;
                }
            }

            // Trigger price update if selection changed manually
            if (typeof window.updatePrice === 'function') {
                window.updatePrice();
            }
        } else {
            // Redirect to dashboard with hash
            window.location.href = `dashboard.html#order`;
        }
    };

    // Expose updatePrice for external calls
    window.updatePrice = () => {
        if (!cylinderSize || orderType.length === 0) return;

        const size = cylinderSize.value;
        const typeEl = Array.from(orderType).find(r => r.checked);
        const type = typeEl ? typeEl.value : null;

        const speedEl = Array.from(document.getElementsByName('deliverySpeed')).find(r => r.checked);
        const speed = speedEl ? speedEl.value : 'standard';

        const deliveryFee = speed === 'express' ? EXPRESS_DELIVERY : STANDARD_DELIVERY;

        if (size && prices[size] && type) {
            const productPrice = prices[size][type];
            const total = productPrice + deliveryFee;

            if (summaryProduct) summaryProduct.innerText = `₦${productPrice.toLocaleString()}`;
            if (document.getElementById('summaryDelivery')) document.getElementById('summaryDelivery').innerText = `₦${deliveryFee.toLocaleString()}`;
            if (summaryTotal) summaryTotal.innerText = `₦${total.toLocaleString()}`;
        } else {
            if (summaryProduct) summaryProduct.innerText = `₦0`;
            if (document.getElementById('summaryDelivery')) document.getElementById('summaryDelivery').innerText = `₦0`;
            if (summaryTotal) summaryTotal.innerText = `₦0`;
        }
    };

    // Add listeners for delivery speed change
    document.getElementsByName('deliverySpeed').forEach(radio => {
        radio.addEventListener('change', window.updatePrice);
    });

    if (cylinderSize) {
        cylinderSize.addEventListener('change', window.updatePrice);
    }
    if (orderType.length > 0) {
        orderType.forEach(radio => radio.addEventListener('change', window.updatePrice));
    }

    // Form submission
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = orderForm.querySelector('.btn-submit');
            const originalText = submitBtn.querySelector('span').innerText;

            const name = orderForm.fullName.value;
            const email = orderForm.email.value;
            const type = orderForm.orderType.value.toUpperCase();
            const size = orderForm.cylinderSize.value;
            const address = orderForm.address.value;
            const phone = orderForm.phone.value;
            const speed = orderForm.deliverySpeed.value;
            const isSubscription = orderForm.autoRefill ? orderForm.autoRefill.checked : false;
            const refillFreq = isSubscription ? orderForm.refillFrequency.value : 'None';
            const totalText = summaryTotal.innerText;
            const amount = parseInt(totalText.replace('₦', '').replace(/,/g, ''));

            if (!amount || amount <= 0) {
                NotificationManager.show('Please select a valid cylinder size and order type.', 'error');
                return;
            }

            // Simulate loading state
            submitBtn.querySelector('span').innerText = 'Initializing Payment...';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            // --- PAYSTACK INTEGRATION ---
            if (typeof PaystackPop !== 'undefined' && PAYSTACK_PUBLIC_KEY !== 'pk_test_YOUR_PUBLIC_KEY') {
                const handler = PaystackPop.setup({
                    key: PAYSTACK_PUBLIC_KEY,
                    email: email,
                    amount: amount * 100, // Paystack works in Kobo
                    currency: "NGN",
                    metadata: {
                        custom_fields: [
                            { display_name: "Customer Name", variable_name: "customer_name", value: name },
                            { display_name: "Order Type", variable_name: "order_type", value: type },
                            { display_name: "Cylinder Size", variable_name: "cylinder_size", value: size }
                        ]
                    },
                    callback: function (response) {
                        // Payment successful!
                        submitBtn.querySelector('span').innerText = 'Payment Verified! Processing...';
                        processOrder(response.reference);
                    },
                    onClose: function () {
                        submitBtn.querySelector('span').innerText = originalText;
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                        NotificationManager.show('Payment cancelled by user.', 'error');
                    }
                });
                handler.openIframe();
            } else {
                // If no key, fall back to simulation for demo
                // alert('Paystack Public Key not found. Proceeding with simulation...');
                processOrder();
            }

            function processOrder(paymentRef = 'SIMULATED') {
                setTimeout(() => {
                    // Calculate Delivery Date (5 working days)
                    const addBusinessDays = (date, days) => {
                        let result = new Date(date);
                        while (days > 0) {
                            result.setDate(result.getDate() + 1);
                            if (result.getDay() !== 0 && result.getDay() !== 6) {
                                days--;
                            }
                        }
                        return result.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    };
                    const deliveryDate = speed === 'express'
                        ? "Express - Same Day (within 60 mins)"
                        : addBusinessDays(new Date(), 5);

                    // Create Order Record
                    const orderRecord = {
                        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
                        name: name,
                        email: email,
                        type: type,
                        size: size,
                        speed: speed.toUpperCase(),
                        address: address,
                        phone: phone,
                        total: totalText,
                        status: 'Pending',
                        date: new Date().toLocaleString(),
                        deliveryDate: deliveryDate,
                        paymentReference: paymentRef,
                        isSubscription: isSubscription,
                        refillFrequency: refillFreq
                    };

                    // Save to Dashboard History
                    const history = JSON.parse(localStorage.getItem('gasOrders')) || [];
                    history.push(orderRecord);
                    localStorage.setItem('gasOrders', JSON.stringify(history));

                    // --- SEND EMAIL NOTIFICATION ---
                    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                        const templateParams = {
                            order_id: orderRecord.id,
                            customer_name: orderRecord.name,
                            customer_email: orderRecord.email,
                            order_type: orderRecord.type,
                            cylinder_size: orderRecord.size,
                            delivery_address: orderRecord.address,
                            phone_number: orderRecord.phone,
                            total_amount: orderRecord.total,
                            order_date: orderRecord.date,
                            delivery_date: orderRecord.deliveryDate,
                            payment_ref: orderRecord.paymentReference
                        };

                        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
                            .then((response) => {
                                console.log('EMAIL SUCCESS!', response.status, response.text);
                            }, (error) => {
                                console.error('EMAIL FAILED...', error);
                            });
                    }


                    // Populating Receipt with data
                    const rOrderEl = document.getElementById('rOrderId');
                    if (rOrderEl) {
                        document.getElementById('rOrderId').innerText = orderRecord.id;
                        document.getElementById('rDate').innerText = orderRecord.date;
                        document.getElementById('rDelivery').innerText = orderRecord.deliveryDate;
                        document.getElementById('rName').innerText = orderRecord.name;
                        document.getElementById('rType').innerText = orderRecord.type;
                        document.getElementById('rSize').innerText = orderRecord.size;
                        document.getElementById('rAddress').innerText = orderRecord.address;
                        document.getElementById('rPhone').innerText = orderRecord.phone;
                        document.getElementById('rTotal').innerText = orderRecord.total;

                        // Show Modal
                        const orderModal = document.getElementById('orderModal');
                        orderModal.style.display = 'block';

                        // Save Receipt as Image Button in Modal
                        const saveBtn = document.getElementById('downloadPdfBtn');
                        saveBtn.innerHTML = '<i class="fa-solid fa-image"></i> Save to Photo Library';

                        saveBtn.onclick = () => {
                            const element = document.getElementById('receiptTemplate');

                            // Show loading state
                            const originalBtnText = saveBtn.innerHTML;
                            saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
                            saveBtn.disabled = true;

                            if (typeof html2canvas !== 'undefined') {
                                // Capture the element
                                html2canvas(element, {
                                    scale: 3, // High quality
                                    backgroundColor: "#ffffff",
                                    useCORS: true,
                                    logging: false
                                }).then(canvas => {
                                    // Convert to Image Data
                                    const imageData = canvas.toDataURL("image/png");

                                    // Create a download link
                                    const link = document.createElement('a');
                                    link.href = imageData;
                                    link.download = `EmberGas_Receipt_${orderRecord.id}.png`;

                                    // Trigger download
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);

                                    // Restore button
                                    saveBtn.innerHTML = originalBtnText;
                                    saveBtn.disabled = false;
                                }).catch(err => {
                                    console.error('Save error:', err);
                                    saveBtn.innerHTML = originalBtnText;
                                    saveBtn.disabled = false;
                                    NotificationManager.show('Could not save image. Please try taking a screenshot instead.', 'error');
                                });
                            } else {
                                NotificationManager.show("Image saving library not loaded", 'error');
                                saveBtn.innerHTML = originalBtnText;
                                saveBtn.disabled = false;
                            }
                        };


                        // Close Modal logic
                        const closeBtn = document.querySelector('.close-modal');
                        if (closeBtn) {
                            closeBtn.onclick = () => {
                                orderModal.style.display = 'none';
                                if (window.nextStep) window.nextStep(1);
                            };
                        }
                    } else {
                        // Fallback if no modal (e.g. simplified page)
                        NotificationManager.show(`Order Placed! ID: ${orderRecord.id}`, 'success');
                    }

                    // Reset form
                    orderForm.reset();
                    if (window.updatePrice) window.updatePrice();
                    submitBtn.querySelector('span').innerText = originalText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 1000);
            }
        });
    }

    // 3D Tilt Effect for cards
    const cards = document.querySelectorAll('.service-card, .safety-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const speed = 200;
            const increment = target / speed;

            const updateCount = () => {
                const count = +stat.innerText;
                if (count < target) {
                    stat.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    stat.innerText = target + (stat.innerText.includes('%') ? '%' : '+');
                }
            };
            updateCount();
        });
    };

    // --- SIDE NAVIGATION LOGIC (HAMBURGER) ---
    const sideMenuContainer = document.querySelector('.floating-side-menu');
    const sideMenuTrigger = document.getElementById('side-menu-trigger');
    const sideMenuLinks = document.querySelectorAll('.side-menu-link');

    if (sideMenuTrigger && sideMenuContainer) {
        sideMenuTrigger.addEventListener('click', () => {
            sideMenuContainer.classList.toggle('active');
        });

        // Close side menu when clicking a link
        sideMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                sideMenuContainer.classList.remove('active');
            });
        });

        // Close side menu when clicking outside
        window.addEventListener('click', (e) => {
            if (!sideMenuContainer.contains(e.target) && sideMenuContainer.classList.contains('active')) {
                sideMenuContainer.classList.remove('active');
            }
        });
    }

    // Enhanced Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    const children = entry.target.querySelectorAll('.fade-in-up');
                    children.forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.2}s`;
                        child.classList.add('visible');
                    });

                    if (entry.target.classList.contains('stats-section')) {
                        animateStats();
                    }

                    if (entry.target.classList.contains('reveal-on-scroll')) {
                        entry.target.style.transitionDelay = '0.1s';
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);
    }

    // --- AUTOMATIC MOBILE BOTTOM NAVIGATION BAR ---
    function initMobileBottomNav() {
        if (document.getElementById('global-mobile-nav')) return;

        const page = window.location.pathname.split('/').pop() || 'index.html';
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const userRole = (user?.role || 'customer').toLowerCase();
        
        const userDashPage = {
            customer: 'dashboard.html',
            vendor:   'seller_dashboard.html',
            seller:   'seller_dashboard.html',
            refiller: 'refiller_dashboard.html',
            rider:    'refiller_dashboard.html',
            admin:    'admin.html'
        }[userRole] || 'dashboard.html';

        const userDashLabel = {
            customer: 'Refill',
            vendor:   'Vendor',
            admin:    'Admin'
        }[userRole] || 'Refill';

        const mobileNav = document.createElement('nav');
        mobileNav.id = 'global-mobile-nav';
        mobileNav.className = 'mobile-bottom-nav';
        mobileNav.innerHTML = `
            <a href="index.html" class="mobile-nav-item ${page === 'index.html' || page === '' ? 'active' : ''}">
                <i class="fa-solid fa-house"></i>
                <span>Home</span>
            </a>
            <a href="track.html" class="mobile-nav-item ${page === 'track.html' ? 'active' : ''}">
                <i class="fa-solid fa-location-dot"></i>
                <span>Track</span>
            </a>
            <a href="${userDashPage}" class="mobile-nav-item elevated-action ${page === userDashPage ? 'active' : ''}" title="${userDashLabel} Portal">
                <div class="action-circle">
                    <i class="fa-solid ${userRole === 'vendor' ? 'fa-store' : 'fa-fire-flame-curved'}"></i>
                </div>
                <span style="margin-top: 4px; color: var(--primary-color);">${userDashLabel}</span>
            </a>
            <a href="services.html" class="mobile-nav-item ${page === 'services.html' || page === 'accessories.html' ? 'active' : ''}">
                <i class="fa-solid fa-cubes"></i>
                <span>Services</span>
            </a>
            <a href="${userDashPage}" class="mobile-nav-item ${page === 'login.html' || page === 'signup.html' ? 'active' : ''}">
                <i class="fa-solid fa-user"></i>
                <span>Account</span>
            </a>
        `;
        document.body.appendChild(mobileNav);
    }

    // --- AUTOMATIC MOBILE SLIDE DRAWER MENU ---
    function initMobileDrawer() {
        if (document.getElementById('global-drawer-backdrop')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'global-drawer-backdrop';
        backdrop.className = 'drawer-backdrop';
        backdrop.onclick = closeMobileDrawer;

        const drawer = document.createElement('div');
        drawer.id = 'global-mobile-drawer';
        drawer.className = 'mobile-slide-drawer';

        const curUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'EmberGas User', role: 'Customer' };
        const userRole = (curUser.role || 'customer').toLowerCase();

        const userDashPage = {
            customer: 'dashboard.html',
            vendor:   'seller_dashboard.html',
            seller:   'seller_dashboard.html',
            admin:    'admin.html'
        }[userRole] || 'dashboard.html';

        const userDashLabel = {
            customer: 'Refill Gas & Customer Dashboard',
            vendor:   'Vendor Station Operations Hub',
            admin:    'Admin Management Center'
        }[userRole] || 'Refill Gas & Customer Dashboard';

        const path = window.location.pathname.split('/').pop() || 'index.html';

        drawer.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                    <a href="index.html" class="brand-logo" style="font-size: 1.3rem;">
                        <i class="fa-solid fa-fire-flame-curved"></i> EmberGas
                    </a>
                    <button class="drawer-close-btn" onclick="closeMobileDrawer()"><i class="fa-solid fa-xmark"></i></button>
                </div>

                <div style="background: #F8FAFC; padding: 14px; border-radius: 16px; border: 1px solid #E5E7EB; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #00B14F; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; color: #fff;">
                        ${curUser.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight: 800; font-size: 0.95rem; color: #111827;">${curUser.name}</div>
                        <div style="font-size: 0.75rem; color: #00B14F; font-weight: 700; text-transform: uppercase;">${curUser.role || 'Customer'}</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <a href="index.html" class="drawer-link ${path === 'index.html' || path === '' ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a>
                    <a href="${userDashPage}" class="drawer-link ${path === userDashPage ? 'active' : ''}"><i class="fa-solid fa-gauge-high"></i> ${userDashLabel}</a>
                    <a href="track.html" class="drawer-link ${path === 'track.html' ? 'active' : ''}"><i class="fa-solid fa-location-dot"></i> Track Live Delivery</a>
                    <a href="services.html" class="drawer-link ${path === 'services.html' || path === 'accessories.html' ? 'active' : ''}"><i class="fa-solid fa-cubes"></i> Services & Accessories</a>
                    <a href="safety.html" class="drawer-link ${path === 'safety.html' ? 'active' : ''}"><i class="fa-solid fa-shield-heart"></i> Safety Checklist</a>
                </div>
            </div>

            <div style="padding-top: 16px; border-top: 1px solid #E5E7EB; display: flex; flex-direction: column; gap: 10px;">
                ${curUser && localStorage.getItem('currentUser') ? `
                <button onclick="auth.logout()" style="width: 100%; background: #FEE2E2; border: 1px solid #FCA5A5; color: #DC2626; padding: 12px; font-size: 0.9rem; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 800; transition: all 0.2s ease;">
                    <i class="fa-solid fa-right-from-bracket"></i> Log Out (${curUser.name.split(' ')[0]})
                </button>
                <button onclick="auth.deleteAccountPermanently()" style="width: 100%; background: #7F1D1D; border: 1px solid #991B1B; color: #FEE2E2; padding: 10px; font-size: 0.82rem; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; transition: all 0.2s ease;">
                    <i class="fa-solid fa-trash-can"></i> Delete Account Permanently
                </button>
                ` : `
                <a href="login.html" style="display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 13px; font-size: 0.92rem; background: #00B14F; color: white; border-radius: 14px; font-weight: 800; box-shadow: 0 4px 14px rgba(0, 177, 79, 0.25);">
                    <i class="fa-solid fa-right-to-bracket"></i> Sign In / Register Account
                </a>
                `}
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(drawer);
    }

    window.openMobileDrawer = function() {
        initMobileDrawer();
        const backdrop = document.getElementById('global-drawer-backdrop');
        const drawer = document.getElementById('global-mobile-drawer');
        if (backdrop && drawer) {
            backdrop.classList.add('active');
            drawer.classList.add('active');
            document.body.classList.add('drawer-open');
        }
    };

    window.closeMobileDrawer = function() {
        const backdrop = document.getElementById('global-drawer-backdrop');
        const drawer = document.getElementById('global-mobile-drawer');
        if (backdrop && drawer) {
            backdrop.classList.remove('active');
            drawer.classList.remove('active');
            document.body.classList.remove('drawer-open');
        }
    };

    setTimeout(() => {
        initMobileBottomNav();
        initMobileDrawer();
        initGlobalTouchSwipeEngine();
        initDesktopSweepController();
    }, 100);
});

// ── GLOBAL MOBILE SWEEP (TOUCH SWIPE GESTURE CONTROLLER) ─────────────────
function initGlobalTouchSwipeEngine() {
    let startX = 0;
    let startY = 0;

    const pageSequence = [
        { path: 'index.html', name: 'Home' },
        { path: 'dashboard.html', name: 'Customer Dashboard' },
        { path: 'track.html', name: 'Live Tracking' },
        { path: 'services.html', name: 'Gas Services' },
        { path: 'accessories.html', name: 'Accessories Store' },
        { path: 'safety.html', name: 'Safety Guide' }
    ];

    window.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length > 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;

        // Skip input or textarea elements to allow text selection/cursor positioning
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const diffX = endX - startX;
        const diffY = endY - startY;

        // Require substantial horizontal swipe (> 70px) and minimal vertical drift
        if (Math.abs(diffX) > 70 && Math.abs(diffY) < 50) {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            let currentIndex = pageSequence.findIndex(p => p.path === currentPath);
            if (currentIndex === -1) currentIndex = 0;

            if (diffX < 0 && currentIndex < pageSequence.length - 1) {
                // Swipe Left -> Next Page
                const nextPage = pageSequence[currentIndex + 1];
                if (window.NotificationManager) {
                    NotificationManager.show(`Swiped Left: Opening ${nextPage.name}...`, 'success');
                }
                setTimeout(() => { window.location.href = nextPage.path; }, 350);
            } else if (diffX > 0) {
                // Swipe Right -> Previous Page or Open Drawer
                if (currentIndex > 0) {
                    const prevPage = pageSequence[currentIndex - 1];
                    if (window.NotificationManager) {
                        NotificationManager.show(`Swiped Right: Back to ${prevPage.name}...`, 'success');
                    }
                    setTimeout(() => { window.location.href = prevPage.path; }, 350);
                } else if (window.openMobileDrawer) {
                    window.openMobileDrawer();
                }
            }
        }
    }, { passive: true });
}

// ── GLOBAL DESKTOP SWEEP (ACTIVE NAV & KEYBOARD ACCESSIBILITY) ───────────
function initDesktopSweepController() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Highlight current desktop link
    document.querySelectorAll('.nav-desktop-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.style.color = '#00B14F';
            link.style.fontWeight = '800';
        }
    });

    // Keyboard ESC shortcut to close modals and mobile drawers
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (window.closeMobileDrawer) window.closeMobileDrawer();
            document.querySelectorAll('.modal, .otp-overlay').forEach(modal => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
    });
}

