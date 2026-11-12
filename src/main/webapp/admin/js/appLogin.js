document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const togglePasswordBtn = document.getElementById('toggle-password-btn');
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');

    const loginBtnHTML = loginBtn.innerHTML; // para restaurarlo después

    // TOGGLE MOSTRAR / OCULTAR CONTRASEÑA (igual que antes)
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

        const icon = togglePasswordBtn.querySelector('i');
        icon.classList.toggle('fa-eye', !isPassword);
        icon.classList.toggle('fa-eye-slash', isPassword);
        togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    // PROCESAR INICIO DE SESIÓN
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorAlert.classList.add('hidden');

        const username = usernameInput.value.trim();
        const password = passwordInput.value; // sin trim: los espacios pueden ser parte de la clave

        if (!username || !password) {
            showError('Por favor completa los campos de usuario y contraseña.');
            return;
        }

        setLoading(true);

        try {
            const r = await fetch('/EmbraguesJG/api/login', {
                method: 'POST',
                body: new URLSearchParams({ username, pass: password })
            });

            if (r.status === 401) {
                showError('Usuario o contraseña incorrectos.');
                passwordInput.value = '';
                passwordInput.focus();
                return;
            }
            if (!r.ok) throw new Error(`Error HTTP ${r.status}`);

            const user = await r.json();
            sessionStorage.setItem('userName', user.name); // opcional, para mostrarlo en la UI
            window.location.href = 'servicios.html';

        } catch (err) {
            console.error(err);
            showError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(loading) {
        loginBtn.disabled = loading;
        loginBtn.innerHTML = loading
            ? `<i class="fa-solid fa-circle-notch fa-spin text-sm"></i><span>Iniciando sesión...</span>`
            : loginBtnHTML;
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorAlert.classList.remove('hidden');
    }
});