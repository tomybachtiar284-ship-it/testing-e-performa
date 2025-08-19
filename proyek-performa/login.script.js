// login.script.js

document.addEventListener('DOMContentLoaded', () => {
    // PERINGATAN: Ini tidak aman untuk produksi!
    // Kredensial sebaiknya diverifikasi di server.
    // Untuk demo, kita tetap gunakan ini.
    const NAMA_PENGGUNA_VALID = 'admin';
    const KATA_SANDI_VALID = '12345';

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const togglePassword = document.getElementById('toggle-password');

    // Fungsi untuk menampilkan/menyembunyikan password
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Fungsi untuk menonaktifkan tombol dan menampilkan spinner
    function setButtonLoading(isLoading) {
        if (isLoading) {
            loginButton.disabled = true;
            loginButton.querySelector('.button-text').style.opacity = '0';
            loginButton.querySelector('.loading-spinner').style.display = 'inline-block';
        } else {
            loginButton.disabled = false;
            loginButton.querySelector('.button-text').style.opacity = '1';
            loginButton.querySelector('.loading-spinner').style.display = 'none';
        }
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Mencegah form refresh halaman

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Validasi dasar frontend
        if (!username || !password) {
            errorMessage.textContent = 'Harap isi semua field.';
            return;
        }

        setButtonLoading(true);
        errorMessage.textContent = ''; // Bersihkan pesan error sebelumnya

        try {
            // Simulasi penundaan jaringan kecil untuk UX yang lebih baik
            await new Promise(resolve => setTimeout(resolve, 600));

            // Verifikasi kredensial (di frontend untuk demo)
            if (username === NAMA_PENGGUNA_VALID && password === KATA_SANDI_VALID) {
                // Jika login berhasil
                errorMessage.textContent = '';
                // Simpan status login di sessionStorage
                sessionStorage.setItem('statusLogin', 'true');
                // Arahkan ke halaman utama aplikasi
                window.location.href = 'index.html';
            } else {
                // Jika login gagal
                errorMessage.textContent = 'Nama pengguna atau kata sandi salah!';
                // Guncang form untuk indikasi error
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            errorMessage.textContent = 'Terjadi kesalahan saat login. Silakan coba lagi.';
        } finally {
            setButtonLoading(false);
        }
    });
});
