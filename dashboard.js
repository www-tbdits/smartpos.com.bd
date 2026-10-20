// --- ১. ডাবল সিকিউরিটি চেক ---
const targetRedirectLink = 'index.html';
const isLogged = sessionStorage.getItem('tbdits_logged_in');
const loggedInUser = JSON.parse(sessionStorage.getItem('tbdits_user') || 'null');

if (!isLogged || !loggedInUser) {
    window.location.replace(targetRedirectLink);
}

// --- ২. পেজ ভিজিবল করা ---
document.body.style.display = 'flex';

const userDisplay = document.getElementById('userDisplay');
if (loggedInUser && loggedInUser.username) {
    userDisplay.textContent = loggedInUser.username;
}

const userProfileBtn = document.getElementById('userProfileBtn');
const userDropdownMenu = document.getElementById('userDropdownMenu');

userProfileBtn.onclick = (e) => {
    e.stopPropagation();
    userDropdownMenu.classList.toggle('show');
};

window.onclick = () => {
    if (userDropdownMenu.classList.contains('show')) {
        userDropdownMenu.classList.remove('show');
    }
};

// সম্পূর্ণ সেশন ক্লিয়ার করে লগআউট করা
function handleLogout() {
    sessionStorage.removeItem('tbdits_active_windows');
    sessionStorage.removeItem('tbdits_logged_in');
    sessionStorage.removeItem('tbdits_user');
    window.location.replace(targetRedirectLink);
}

document.getElementById('dropdownLogoutBtn').onclick = handleLogout;

document.getElementById('changePasswordBtn').onclick = () => {
    alert("Password change feature can be linked here!");
};

// --- ৩. ফিচার লিস্ট ও গ্রিড রেন্ডারিং ---
const features = [
    { id: 'reports', label: 'Sales Reports', icon: 'bx bxs-file', link: 'reports.html' },
    { id: 'sales', label: 'Sales of Point', icon: 'bx bxs-cart', link: 'CloudPOS.html' },
    { id: 'customers', label: 'Customers', icon: 'bx bxs-user', link: 'customers.html' },
    { id: 'products', label: 'Products', icon: 'bx bxs-box', link: 'products.html' },
    { id: 'user-permission', label: 'User Control', icon: 'bx bxs-user-check', link: 'UserControl.html' },
    { id: 'inventory', label: 'Inventory', icon: 'bx bxs-data', link: 'inventory.html' },
    { id: 'help', label: 'Help', icon: 'bx bxs-help-circle', link: 'help.html' },
    { id: 'logout', label: 'Logout', icon: 'bx bxs-log-out-circle' }
];

const iconGrid = document.getElementById('iconGrid');
const popupManager = document.getElementById('popupManager');
const minimizedDock = document.getElementById('minimizedDock');

// Admin role dynamic check
const isFullAccess = loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.username === 'jems');

if (isFullAccess) {
    iconGrid.classList.add('full-access');
} else {
    iconGrid.classList.add('partial-access');
}

let activeWindowsState = JSON.parse(sessionStorage.getItem('tbdits_active_windows')) || {};

iconGrid.innerHTML = '';
features.forEach(f => {
    if (f.label !== 'Logout' && !isFullAccess && (!loggedInUser || !loggedInUser.permissions || !loggedInUser.permissions.includes(f.label))) return;

    const card = document.createElement('div');
    card.className = 'icon-card';
    card.innerHTML = `<i class='${f.icon}'></i><span>${f.label}</span>`;
    card.onclick = () => {
        if (f.id === 'logout') {
            handleLogout();
        } else if (f.link) {
            openPopup(f.id, f.label, f.link, 'open');
        }
    };
    iconGrid.appendChild(card);
});

const openWindows = {};

function saveState() {
    const stateObj = {};
    for (let id in openWindows) {
        stateObj[id] = {
            label: openWindows[id].label,
            link: openWindows[id].link,
            status: openWindows[id].status
        };
    }
    sessionStorage.setItem('tbdits_active_windows', JSON.stringify(stateObj));
}

function openPopup(id, label, link, status = 'open') {
    if (openWindows[id]) {
        openWindows[id].status = status;
        if (status === 'open') {
            openWindows[id].overlay.style.display = 'flex';
            if (openWindows[id].dockItem) {
                openWindows[id].dockItem.remove();
                openWindows[id].dockItem = null;
            }
        } else {
            openWindows[id].overlay.style.display = 'none';
            createDockItem(id);
        }
        saveState();
        return;
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = "position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; justify-content: center; align-items: center;";

    const content = document.createElement('div');
    content.style.cssText = "width: 100%; height: 100%; background: #e4ebf5; position: relative; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.3);";

    const topBar = document.createElement('div');
    topBar.style.cssText = "height: 32px; background: #e4ebf5; border-bottom: 1px solid rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: space-between; padding: 0 15px; box-shadow: 0px 2px 6px rgba(203, 205, 209, 0.4); z-index: 1000;";

    const titleSpan = document.createElement('span');
    titleSpan.textContent = label;
    titleSpan.style.cssText = "font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: #1e3a8a; letter-spacing: 0.5px;";

    const btnGroup = document.createElement('div');
    btnGroup.style.cssText = "display: flex; gap: 6px;";

    const minBtn = document.createElement('button');
    minBtn.innerHTML = "<i class='bx bx-minus'></i>";
    minBtn.title = "Minimize";
    minBtn.style.cssText = "background: #e4ebf5; color: #1e3a8a; border: none; width: 22px; height: 22px; border-radius: 5px; cursor: pointer; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: center; box-shadow: 2px 2px 5px #cbced1, -2px -2px 5px #ffffff; transition: all 0.2s;";
    minBtn.onclick = () => minimizeWindow(id);

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = "<i class='bx bx-x'></i>";
    closeBtn.title = "Close";
    closeBtn.style.cssText = "background: #e4ebf5; color: #ef4444; border: none; width: 22px; height: 22px; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: center; box-shadow: 2px 2px 5px #cbced1, -2px -2px 5px #ffffff; transition: all 0.2s;";
    closeBtn.onclick = () => closeWindow(id);

    btnGroup.appendChild(minBtn);
    btnGroup.appendChild(closeBtn);
    topBar.appendChild(titleSpan);
    topBar.appendChild(btnGroup);

    const iframe = document.fromElement ? null : document.createElement('iframe');
    iframe.src = link;
    iframe.style.cssText = "width:100%; flex: 1; border:none; background: #fff;";

    content.appendChild(topBar);
    content.appendChild(iframe);
    overlay.appendChild(content);
    popupManager.appendChild(overlay);

    openWindows[id] = { overlay: overlay, label: label, link: link, status: status, dockItem: null };

    if (status === 'minimized') {
        overlay.style.display = 'none';
        createDockItem(id);
    } else {
        overlay.style.display = 'flex';
    }
    saveState();
}

function minimizeWindow(id) {
    const win = openWindows[id];
    if (!win) return;

    win.overlay.style.display = 'none';
    win.status = 'minimized';
    createDockItem(id);
    saveState();
}

function createDockItem(id) {
    const win = openWindows[id];
    if (!win) return;

    if (win.dockItem) {
        win.dockItem.remove();
    }

    const dockItem = document.createElement('div');
    dockItem.style.cssText = "pointer-events: auto; background: #e4ebf5; color: #1e3a8a; padding: 8px 14px; border-radius: 10px; box-shadow: 4px 4px 10px #cbced1, -4px -4px 10px #ffffff; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 12px; border: 1px solid rgba(255,255,255,0.8); transition: all 0.2s;";
    dockItem.innerHTML = `<i class='bx bx-window-alt' style="font-size: 15px; color: #275efe;"></i><span>${win.label}</span><i class='bx bx-expand' style="font-size: 13px; color: #627490; margin-left: 3px;"></i>`;

    dockItem.onclick = () => {
        win.overlay.style.display = 'flex';
        win.status = 'open';
        dockItem.remove();
        win.dockItem = null;
        saveState();
    };

    minimizedDock.appendChild(dockItem);
    win.dockItem = dockItem;
}

function closeWindow(id) {
    const win = openWindows[id];
    if (!win) return;

    win.overlay.remove();
    if (win.dockItem) {
        win.dockItem.remove();
    }
    delete openWindows[id];
    saveState();
}

window.addEventListener('DOMContentLoaded', () => {
    if (activeWindowsState) {
        for (let id in activeWindowsState) {
            const item = activeWindowsState[id];
            if (item.status === 'open' || item.status === 'minimized') {
                openPopup(id, item.label, item.link, item.status);
            }
        }
    }
});