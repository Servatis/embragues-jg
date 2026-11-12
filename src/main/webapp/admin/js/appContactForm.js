import { ContactForm } from './ContactForm.js'

// --- ESTADO GLOBAL ---
let recordsStore = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;
let searchFilter = '';

async function loadRecordsFromDB() {
    try {
        const r = await fetch('/EmbraguesJG/api/contact_form');
        if (!r.ok) throw new Error(`Error HTTP ${r.status}`);

        const parsed = await r.json();
        return parsed.map(item => new ContactForm(item.id, item.name, item.phone, item.email, item.service, item.message, item.date));
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
    const currentDate = document.getElementById('current-date');
    const today = new Date();

    const tableBody = document.getElementById('services-table-body');
    const mobileContainer = document.getElementById('services-mobile-container');
    const paginationInfo = document.getElementById('pagination-info');
    const paginationControls = document.getElementById('pagination-controls');

    const recordModal = document.getElementById('service-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalTitle = document.getElementById('modal-title');
    
    const date = document.getElementById('date');
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');
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
        currentDate.innerHTML = today.toLocaleDateString();
        userName.innerHTML = sessionStorage.getItem('userName');

        // 1. Filtrado
        const filteredRecords = recordsStore.filter(s => {
            const term = searchFilter.toLowerCase();
            return s.name.toLowerCase().includes(term) || 
                    s.service.toLowerCase().includes(term) ||
                    s.phone.toLowerCase().includes(term);
        });

        // 2. Cálculos Paginación
        const totalItems = filteredRecords.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
        
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
        const pageRecords = filteredRecords.slice(startIndex, endIndex);

        // 3. Renderizar Tabla Escritorio
        tableBody.innerHTML = '';
        if (pageRecords.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-8 text-slate-400">
                        No se encontraron registros.
                    </td>
                </tr>`;
        } else {
            pageRecords.forEach(record => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50/60 transition-colors";
                tr.innerHTML = `
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(record.date)}</div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(record.name)}</div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(record.phone)}</div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(record.email)}</div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="font-semibold text-slate-900">${escapeHtml(record.service)}</div>
                    </td>
                    <td class="py-4 px-6 text-right">
                        <div class="flex items-center justify-end gap-1">
                            <button onclick="onViewRecord(${record.id})" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors touch-target" title="Ver">
                                <i class="fa-regular fa-eye"></i>
                            </button>
                            <button onclick="onDeleteRecord(${record.id})" class="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors touch-target" title="Eliminar">
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
        if (pageRecords.length === 0) {
            mobileContainer.innerHTML = `<div class="p-6 text-center text-slate-400 text-sm">No hay registros que mostrar.</div>`;
        } else {
            pageRecords.forEach(record => {
                const card = document.createElement('div');
                card.className = "p-4 space-y-3";
                card.innerHTML = `
                    <div class="font-semibold text-slate-900 text-sm py-4 px-6">${escapeHtml(record.date)}</div>
                    <div class="font-semibold text-slate-900 text-sm py-4 px-6">${escapeHtml(record.name)}</div>
                    <div class="font-semibold text-slate-900 text-sm py-4 px-6">${escapeHtml(record.phone)}</div>
                    <div class="font-semibold text-slate-900 text-sm py-4 px-6">${escapeHtml(record.email)}</div>
                    <div class="font-semibold text-slate-900 text-sm py-4 px-6">${escapeHtml(record.service)}</div>
                    <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                        <button onclick="onViewRecord(${record.id})" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg touch-target">
                            <i class="fa-regular fa-pen-to-square"></i> Editar
                        </button>
                        <button onclick="onDeleteRecord(${record.id})" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg touch-target">
                            <i class="fa-regular fa-trash-can"></i> Eliminar
                        </button>
                    </div>
                `;
                mobileContainer.appendChild(card);
            });
        }

        // 5. Actualizar Texto de Paginación
        const startDisplay = totalItems > 0 ? startIndex + 1 : 0;
        paginationInfo.innerHTML = `Mostrando <span class="text-slate-800 font-semibold">${startDisplay}-${endIndex}</span> de <span class="text-slate-800 font-semibold">${totalItems}</span> registros`;

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

    // --- LÓGICA DE EDITAR / ELIMINAR SERVICIOS (Globales) ---
    window.onViewRecord = function(id) {
        const record = recordsStore.find(s => s.id === id);
        if (record) {
            openModal(record);
        }
    };

    window.onDeleteRecord = async function(id) {
        const proceed = confirm("Estas seguro de que quieres eliminar este registro?");
         if (!proceed) {
            console.log("Deletion cancelled.");
        } else {
            const r = await fetch(`/EmbraguesJG/api/contact_form?id=${id}`, { method: "DELETE" });
            if (!r.ok) throw new Error(`Error HTTP ${r.status}`);

            recordsStore = recordsStore.filter(s => s.id !== id);
            renderUI();
        }
    };

    // --- MANEJO DEL MODAL ---
    function openModal(record) {
        date.innerHTML = record.date;
        name.innerHTML = record.name;
        phone.innerHTML = record.phone;
        email.innerHTML = record.email;
        service.innerHTML = record.service;
        message.innerHTML = record.message;

        recordModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
        recordModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

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
            if (!recordModal.classList.contains('hidden')) closeModal();
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
    recordsStore = await loadRecordsFromDB();
    renderUI();
});
