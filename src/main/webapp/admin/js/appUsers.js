import { User } from './User.js'

// --- ESTADO GLOBAL ---
let usersStore = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;
let searchFilter = '';

async function loadUsersFromDB() {
    try {
        const r = await fetch('/EmbraguesJG/api/user');
        if (!r.ok) throw new Error(`Error HTTP ${r.status}`);

        const parsed = await r.json();
        return parsed.map(item => new User(item.id, item.name, item.username, item.email, item.pass, item.role_id, item.image, item.is_active));
    } catch (e) {
        console.error("Error al leer de base de datos:", e);
    }
}

// --- ELEMENTOS DOM ---
document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const searchInput = document.getElementById('search-input');
    const totalUsers = document.getElementById('total-services');
    const totalActiveUsers = document.getElementById('total-active-services');
    const totalInactiveUsers = document.getElementById('total-inactive-services');
    const currentDate = document.getElementById('current-date');
    const today = new Date();

    const tableBody = document.getElementById('services-table-body');
    const mobileContainer = document.getElementById('services-mobile-container');
    const paginationInfo = document.getElementById('pagination-info');
    const paginationControls = document.getElementById('pagination-controls');

    const serviceModal = document.getElementById('service-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const openCreateModalBtn = document.getElementById('open-create-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const modalTitle = document.getElementById('modal-title');
    const submitModalBtn = document.getElementById('submit-modal-btn');
    
    const userIdInput = document.getElementById('user-id');
    const serviceNameInput = document.getElementById('name-input');
    const usernameInput = document.getElementById('username-input');
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('pass-input');
    const userRoleSelect = document.getElementById('user-role-select');
    const userStatusSelect = document.getElementById('service-status-select');
    const userForm = document.getElementById('service-form');
    const userName = document.getElementById('userName');

    // --- NAVEGACIÓN MOBILE ---
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        sidebarBackdrop.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        sidebarBackdrop.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
    if (openSidebarBtn) openSidebarBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    // --- RENDERIZADO Y PAGINACIÓN ---
    function renderUI() {
        totalUsers.innerHTML = usersStore.length;
        totalActiveUsers.innerHTML = usersStore.filter(s => s.is_active).length;
        totalInactiveUsers.innerHTML = usersStore.filter(s => !s.is_active).length;
        currentDate.innerHTML = today.toLocaleDateString();
        userName.innerHTML = sessionStorage.getItem('userName');

        // 1. Filtrado
        const filteredUsers = usersStore.filter(s => {
            const term = searchFilter.toLowerCase();
            return s.name.toLowerCase().includes(term) || 
                    s.username.toLowerCase().includes(term) ||
                    s.email.toLowerCase().includes(term);
        });

        // 2. Cálculos Paginación
        const totalItems = filteredUsers.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
        
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
        const pageUsers = filteredUsers.slice(startIndex, endIndex);

        // 3. Renderizar Tabla Escritorio
        tableBody.innerHTML = '';
        if (pageUsers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-8 text-slate-400">
                        No se encontraron usuarios registrados.
                    </td>
                </tr>`;
        } else {
            pageUsers.forEach(user => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50/60 transition-colors";
                tr.innerHTML = `
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(user.name)}</div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(user.username)}</div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(user.email)}</div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(user.getRoleName())}</div>
                    </td>
                    <td class="py-4 px-6 text-center">
                        ${user.is_active ? `
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Activo
                            </span>` : `
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                Inactivo
                            </span>`}
                    </td>
                    <td class="py-4 px-6 text-right">
                        <div class="flex items-center justify-end gap-1">
                            <button onclick="onEditUser(${user.id})" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors touch-target" title="Editar">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button onclick="onDeleteUser(${user.id})" class="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors touch-target" title="Eliminar">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }

        // 4. Renderizar Cards Móviles
        mobileContainer.innerHTML = '';
        if (pageUsers.length === 0) {
            mobileContainer.innerHTML = `<div class="p-6 text-center text-slate-400 text-sm">No hay usuarios que mostrar.</div>`;
        } else {
            pageUsers.forEach(user => {
                const card = document.createElement('div');
                card.className = "p-4 space-y-3";
                card.innerHTML = `
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <h3 class="font-semibold text-slate-900 text-sm">${escapeHtml(user.name)}</h3>
                            <span class="inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-medium border">
                                ${escapeHtml(user.getRoleName())}
                            </span>
                        </div>
                        ${user.is_active ? `
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 shrink-0">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Activo
                            </span>` : `
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 shrink-0">
                                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Inactivo
                            </span>`}
                    </div>
                    <p class="text-xs text-slate-500 line-clamp-2">${escapeHtml(user.email)}</p>
                    <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                        <button onclick="onEditUser(${user.id})" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg touch-target">
                            <i class="fa-regular fa-pen-to-square"></i> Editar
                        </button>
                        <button onclick="onDeleteUser(${user.id})" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg touch-target">
                            <i class="fa-regular fa-trash-can"></i> Eliminar
                        </button>
                    </div>
                `;
                mobileContainer.appendChild(card);
            });
        }

        // 5. Actualizar Texto de Paginación
        const startDisplay = totalItems > 0 ? startIndex + 1 : 0;
        paginationInfo.innerHTML = `Mostrando <span class="text-slate-800 font-semibold">${startDisplay}-${endIndex}</span> de <span class="text-slate-800 font-semibold">${totalItems}</span> usuarios`;

        // 6. Controles Paginación
        paginationControls.innerHTML = '';

        // Botón Anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = `w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors touch-target ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''}`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left text-xs"></i>`;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderUI();
            }
        });
        paginationControls.appendChild(prevBtn);

        // Botones numéricos de página
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors touch-target ${i === currentPage ? 'bg-brand-orange text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderUI();
            });
            paginationControls.appendChild(pageBtn);
        }

        // Botón Siguiente
        const nextBtn = document.createElement('button');
        nextBtn.className = `w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors touch-target ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : ''}`;
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.innerHTML = `<i class="fa-solid fa-chevron-right text-xs"></i>`;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderUI();
            }
        });
        paginationControls.appendChild(nextBtn);
    }

    // Sanitizador HTML
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[m]);
    }

    // --- LÓGICA DE EDITAR / ELIMINAR USUARIOS (Globales) ---
    window.onEditUser = function(id) {
        const service = usersStore.find(s => s.id === id);
        if (service) {
            openModal(true, service);
        }
    };

    window.onDeleteUser = async function(id) {
        const proceed = confirm("Estas seguro de que quieres eliminar este usuario?");
         if (!proceed) {
            console.log("Deletion cancelled.");
        } else {
            const r = await fetch(`/EmbraguesJG/api/user?id=${id}`, { method: "DELETE" });
            if (!r.ok) throw new Error(`Error HTTP ${r.status}`);

            usersStore = usersStore.filter(s => s.id !== id);
            renderUI();
        }
    };

    // --- MANEJO DEL MODAL ---
    function openModal(isEdit = false, user = null) {
        if (isEdit && user) {
            modalTitle.textContent = 'Editar Usuario';
            submitModalBtn.textContent = 'Guardar Cambios';
            userIdInput.value = user.id;
            serviceNameInput.value = user.name;
            usernameInput.value = user.username;
            emailInput.value = user.email;
            userRoleSelect.value = user.role_id;
            userStatusSelect.value = user.is_active ? "true" : "false";
        } else {
            modalTitle.textContent = 'Nuevo Usuario';
            submitModalBtn.textContent = 'Crear Usuario';
            userForm.reset();
            userIdInput.value = '';
        }

        serviceModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        serviceNameInput.focus();
    }

    function closeModal() {
        serviceModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    if (openCreateModalBtn) openCreateModalBtn.addEventListener('click', () => openModal(false));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // SUBMIT DEL FORMULARIO
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const idVal = userIdInput.value;
            const nameVal = serviceNameInput.value.trim();
            const usernameVal = usernameInput.value.trim();
            const emailVal = emailInput.value.trim();
            const passVal = passInput.value.trim();
            const roleIdVal = Number(userRoleSelect.value);
            const isActiveVal = userStatusSelect.value === "true";

            if (idVal) {
                // EDITAR
                const targetId = Number(idVal);
                const r = await fetch('/EmbraguesJG/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: Number(idVal),
                        name: nameVal,
                        username: usernameVal,
                        email: emailVal,
                        pass: passVal,
                        role_id: roleIdVal,
                        is_active: isActiveVal
                    })
                });
                if (!r.ok) throw new Error(`Error HTTP ${r.status}`);

                const idx = usersStore.findIndex(s => s.id === targetId);
                if (idx !== -1) {
                    usersStore[idx].name = nameVal;
                    usersStore[idx].username = usernameVal;
                    usersStore[idx].email = emailVal;
                    usersStore[idx].pass = passVal;
                    usersStore[idx].role_id = roleIdVal;
                    usersStore[idx].is_active = isActiveVal;
                }
            } else {
                // CREAR NUEVO
                const r = await fetch('/EmbraguesJG/api/user', {
                    method: "POST",
                    body: new URLSearchParams({name: nameVal, username: usernameVal, email: emailVal, pass: passVal, role_id: roleIdVal, is_active: isActiveVal})
                });
                if (!r.ok) throw new Error(`Error HTTP ${r.status}`);

                usersStore = await loadUsersFromDB();
                currentPage = 1;
            }

            renderUI();
            closeModal();
        });
    }

    // EVENTO BÚSQUEDA
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchFilter = e.target.value;
            currentPage = 1; // reset a pág 1
            renderUI();
        });
    }

    // TECLA ESCAPE
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!serviceModal.classList.contains('hidden')) closeModal();
            else if (sidebar && !sidebar.classList.contains('-translate-x-full')) closeSidebar();
        }
    });

    // CERRAR SESIÓN
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch('/EmbraguesJG/api/logout', { method: 'POST' });
        sessionStorage.clear();
        window.location.href = 'index.html';
    });

    // RENDER INICIAL
    usersStore = await loadUsersFromDB();
    renderUI();
});
