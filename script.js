// ===============================================
//         KODE SCRIPT.JS (FINAL & LENGKAP)
// ===============================================
document.addEventListener('DOMContentLoaded', function () {
    Chart.register(ChartDataLabels);

    // --- ELEMEN DOM ---
    const menuLinks = document.querySelectorAll('.sidebar .menu ul li a');
    const pageTitle = document.getElementById('page-title');
    const contentBody = document.getElementById('content-body');
    const employeeFormModal = document.getElementById('employeeFormModal');
    const employeeForm = document.getElementById('employee-form');
    const formTitle = document.getElementById('form-title');
    const formPhotoInput = document.getElementById('form-photo');
    const formPhotoPreview = document.getElementById('form-photo-preview');
    const monitoringModal = document.getElementById('monitoringModal');
    const clockElement = document.getElementById('real-time-clock');
    const monitoringLogBody = document.getElementById('monitoring-log-body');
    const detailsPhoto = document.getElementById('details-photo');
    const detailsName = document.getElementById('details-name');
    const detailsNid = document.getElementById('details-nid');
    const detailsPosition = document.getElementById('details-position');
    const detailsStatus = document.getElementById('details-status');
    const statPlnNps = document.getElementById('stat-pln-nps');
    const statMkp = document.getElementById('stat-mkp');
    const statMkpIc = document.getElementById('stat-mkp-ic');
    const statSecurity = document.getElementById('stat-security');
    const statVisitor = document.getElementById('stat-visitor');
    const nidScannerInput = document.getElementById('nid-scanner-input');
    const scanButton = document.getElementById('scan-button');
    const monitoringFooter = document.querySelector('.monitoring-footer');
    const toggleFullscreenBtn = document.getElementById('toggle-fullscreen-btn');
    const detailsCompanyLogoImg = document.getElementById('details-company-logo-img');
    const recapModal = document.getElementById('recapModal');
    const recapLogBody = document.getElementById('recap-log-body');
    const downloadRecapBtn = document.getElementById('download-recap-btn');
    const clearRecapBtn = document.getElementById('clear-recap-btn');
    const closeButtons = document.querySelectorAll('.close-button');
    const refreshBtn = document.getElementById('refresh-btn');
    const shiftScheduleModal = document.getElementById('shiftScheduleModal');
    const shiftTimesModal = document.getElementById('shiftTimesModal');
    const navBackBtn = document.getElementById('nav-back-btn');
    const navForwardBtn = document.getElementById('nav-forward-btn');


    // --- STATE APLIKASI ---
    let employees = [];
    let companies = [];
    let recapLog = [];
    let monitoringLog = [];
    let monthlySchedule = {};
    let shiftRules = {};
    let clockInterval = null;
    let isFullscreen = false;
    let currentPageName = '';
    let notepadContent = '';
    let newProfilePicData = null;
    let dataUntukRincian = {};
    let dokumenTerkait = [];
    let catatanReferensi = [];
    const lateSound = new Audio('sounds/terlambat.mp3');
    const scanSound = new Audio('sounds/masuk.mp3');
    const companyLogos = { "PT PLN NPS": "images/imagespln_nps.png", "PT MKP": "images/imagesmkp.png", "MKP IC": "images/imagesmkp_ic.png", "SECURITY": "images/scrt.png", "Visitor": "images/visitor.png" };
    
    // --- DATABASE KECIL UNTUK BAHAN BAKAR & UNIT ---
    const dataUnitPembangkit = {
        'Unit 1': { efisiensi: 35 },
        'Unit 2': { efisiensi: 38 }
    };
    const dataBatuBara = {
        'Sub-Bituminous (Umum)': { kalor: 5500, harga: 900000, karbon: 60 },
        'Lignite': { kalor: 4500, harga: 750000, karbon: 55 },
        'Bituminous': { kalor: 6500, harga: 1100000, karbon: 70 }
    };
    const dataBiomassa = {
        'Woodchip': { kalor: 4200, harga: 1200000 },
        'Cangkang Sawit': { kalor: 4800, harga: 1350000 },
        'Sekam Padi': { kalor: 3500, harga: 800000 }
    };

    // --- FUNGSI MANAJEMEN DATA ---
    function saveEmployees() { localStorage.setItem('employees', JSON.stringify(employees)); }
    function saveRecapLog() { localStorage.setItem('recapLog', JSON.stringify(recapLog)); }
    function saveCompanies() { localStorage.setItem('companies', JSON.stringify(companies)); }
    function saveNotepadContent() { localStorage.setItem('notepadContent', notepadContent); }
    function loadNotepadContent() { notepadContent = localStorage.getItem('notepadContent') || 'PENGUMUMAN PENTING UNTUK SELURUH KARYAWAN.'; }
    function saveK3Stats() {
        const k3Stats = {
            'k3-jam-hilang': document.getElementById('k3-jam-hilang')?.textContent || '0',
            'k3-kecelakaan': document.getElementById('k3-kecelakaan')?.textContent || 'NIHIL',
            'k3-jam-lalu': document.getElementById('k3-jam-lalu')?.textContent || '0',
            'k3-jam-total': document.getElementById('k3-jam-total')?.textContent || '0',
        };
        localStorage.setItem('k3Stats', JSON.stringify(k3Stats));
    }
    function saveSchedule() { localStorage.setItem('monthlySchedule', JSON.stringify(monthlySchedule)); }
    function saveShiftRules() { localStorage.setItem('shiftRules', JSON.stringify(shiftRules)); }
    function saveDokumen() { localStorage.setItem('dokumenTerkait', JSON.stringify(dokumenTerkait)); }
    function loadDokumen() { dokumenTerkait = JSON.parse(localStorage.getItem('dokumenTerkait')) || []; }
    function saveCatatan() { localStorage.setItem('catatanReferensi', JSON.stringify(catatanReferensi)); }
    function loadCatatan() { catatanReferensi = JSON.parse(localStorage.getItem('catatanReferensi')) || []; }

    function loadShiftRules() {
        try {
            const savedRules = JSON.parse(localStorage.getItem('shiftRules'));
            if (savedRules) {
                const defaultRules = { 'Pagi': { start: { hour: 7, minute: 30 }, end: { hour: 15, minute: 30 } }, 'Sore': { start: { hour: 15, minute: 30 }, end: { hour: 23, minute: 30 } }, 'Malam': { start: { hour: 23, minute: 30 }, end: { hour: 7, minute: 30 } }, 'Daytime': { start: { hour: 8, minute: 0 }, end: { hour: 16, minute: 0 } } };
                let isValid = Object.keys(defaultRules).every(shift => savedRules[shift] && savedRules[shift].start && savedRules[shift].end);
                if (isValid) { shiftRules = savedRules; } else { console.warn("Data shiftRules di localStorage tidak valid, menggunakan default."); shiftRules = defaultRules; saveShiftRules(); }
            } else {
                shiftRules = { 'Pagi': { start: { hour: 7, minute: 30 }, end: { hour: 15, minute: 30 } }, 'Sore': { start: { hour: 15, minute: 30 }, end: { hour: 23, minute: 30 } }, 'Malam': { start: { hour: 23, minute: 30 }, end: { hour: 7, minute: 30 } }, 'Daytime': { start: { hour: 8, minute: 0 }, end: { hour: 16, minute: 0 } } };
                saveShiftRules();
            }
        } catch (e) {
            console.error("Gagal memuat shiftRules:", e);
            shiftRules = { 'Pagi': { start: { hour: 7, minute: 30 }, end: { hour: 15, minute: 30 } }, 'Sore': { start: { hour: 15, minute: 30 }, end: { hour: 23, minute: 30 } }, 'Malam': { start: { hour: 23, minute: 30 }, end: { hour: 7, minute: 30 } }, 'Daytime': { start: { hour: 8, minute: 0 }, end: { hour: 16, minute: 0 } } };
        }
    }
    function loadData() {
        try {
            employees = JSON.parse(localStorage.getItem('employees')) || [];
            recapLog = JSON.parse(localStorage.getItem('recapLog')) || [];
            companies = JSON.parse(localStorage.getItem('companies')) || ["PT PLN NPS", "PT MKP", "PT MKP IC", "Security", "Visitor"];
            monitoringLog = JSON.parse(localStorage.getItem('monitoringLog')) || [];
            monthlySchedule = JSON.parse(localStorage.getItem('monthlySchedule')) || {};
        } catch (e) {
            console.error("Gagal memuat data:", e);
            employees = []; recapLog = []; companies = ["PT PLN NPS", "PT MKP", "PT MKP IC", "Security", "Visitor"]; monitoringLog = []; monthlySchedule = {};
        }
        loadShiftRules();
        loadNotepadContent();
        loadDokumen();
        loadCatatan();
        if (employees.length === 0) {
            employees = [
                { nid: "9120034APN", name: "RAFLI", position: "SECURITY", company: "Security", photoUrl: "", inOutStatus: 'Keluar', regu: 'A' },
                { nid: "9120035BPN", name: "ANDI WIJAYA", position: "STAFF HR", company: "PT PLN NPS", photoUrl: "", inOutStatus: 'Keluar', regu: 'Daytime' }
            ];
            saveEmployees();
        }
        saveCompanies();
    }

    // --- FUNGSI MODAL ---
    function openModal(modalElement) { if (modalElement) { modalElement.style.display = 'block'; document.body.classList.add('modal-open'); } }
    function closeModal(modalElement = null) { if (modalElement) { modalElement.style.display = 'none'; } else { document.querySelectorAll('.modal').forEach(modal => { modal.style.display = 'none'; }); } document.body.classList.remove('modal-open'); if (clockInterval) { clearInterval(clockInterval); clockInterval = null; } }

    // --- FUNGSI-FUNGSI APLIKASI ---
    function loadUserProfile() {
        const profileName = sessionStorage.getItem('namaAkun') || 'Pengguna';
        const profilePictureUrl = sessionStorage.getItem('fotoProfil') || `https://placehold.co/40x40/cccccc/333?text=${profileName.charAt(0)}`;
        const nameElement = document.getElementById('profile-name');
        const pictureElement = document.getElementById('profile-picture');
        if (nameElement) nameElement.textContent = profileName;
        if (pictureElement) pictureElement.src = profilePictureUrl;
    }

    function openEditProfileModal() {
        const modal = document.getElementById('editProfileModal');
        if (!modal) return;
        const currentName = sessionStorage.getItem('namaAkun');
        const currentPic = sessionStorage.getItem('fotoProfil');
        document.getElementById('form-edit-name').value = currentName;
        document.getElementById('profile-pic-preview').src = currentPic;
        newProfilePicData = null;
        openModal(modal);
    }

    function setupEditProfileListeners() {
        const uploadBtn = document.getElementById('upload-pic-btn');
        const fileInput = document.getElementById('new-profile-pic-input');
        const form = document.getElementById('edit-profile-form');
        const preview = document.getElementById('profile-pic-preview');

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => fileInput.click());
        }
        if (fileInput) {
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.src = e.target.result;
                        newProfilePicData = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const newName = document.getElementById('form-edit-name').value;
                sessionStorage.setItem('namaAkun', newName);
                if (newProfilePicData) {
                    sessionStorage.setItem('fotoProfil', newProfilePicData);
                }
                loadUserProfile();
                closeModal(document.getElementById('editProfileModal'));
                alert('Profil berhasil diperbarui!');
            });
        }
    }

    function renderCompanyOptions() { const companySelect = document.getElementById('form-company'); if (companySelect) { companySelect.innerHTML = '<option value="">Pilih Company</option>' + companies.map(company => `<option value="${company}">${company}</option>`).join(''); } }

    function toggleNotepad() {
        const notepadContainer = document.getElementById('notepad-container');
        if (!notepadContainer) return;
        const isHidden = notepadContainer.style.display === 'none';
        if (isHidden) {
            notepadContainer.style.display = 'block';
            const notepadTextarea = document.getElementById('notepad-textarea');
            const saveBtn = document.getElementById('save-notepad-btn');
            notepadTextarea.value = notepadContent;
            saveBtn.onclick = function () {
                notepadContent = notepadTextarea.value;
                saveNotepadContent();
                alert('Catatan berhasil disimpan!');
                notepadContainer.style.display = 'none';
                const blinkingTextElement = document.getElementById('blinking-text');
                if (blinkingTextElement && currentPageName === 'DASHBOARD') {
                    blinkingTextElement.textContent = notepadContent.toUpperCase();
                }
            };
        } else {
            notepadContainer.style.display = 'none';
        }
    }

    function renderEmployeeManagementPage() {
        contentBody.innerHTML = `
            <div class="action-bar">
                <button class="btn-secondary" data-action="open-monitoring"><i class="fas fa-chart-line"></i> Buka Monitoring</button>
                <button class="btn-success" data-action="open-recap"><i class="fas fa-list"></i> Rekapitulasi</button>
                <button id="btn-show-list" class="btn-primary" style="background: #0d2847; border-color: #fff;"><i class="fas fa-list-alt"></i> Manajemen Karyawan</button>
                <button class="btn-primary" data-action="open-schedule-manager"><i class="fas fa-calendar-alt"></i> Atur Jadwal Shift</button>
                <button class="btn-primary" data-action="toggle-notepad" style="background-color: #f59e0b;"><i class="fas fa-sticky-note"></i> Catatan Informasi</button>
            </div>
            <div id="notepad-container" class="notepad-container" style="display: none;">
                <h4><i class="fas fa-book-open"></i> Catatan & Informasi Penting</h4>
                <textarea id="notepad-textarea" class="notepad-textarea" placeholder="Tulis catatan atau ringkasan penting di sini..."></textarea>
                <button id="save-notepad-btn" class="btn-success"><i class="fas fa-save"></i> Simpan Catatan</button>
            </div>
            <div id="employee-table-wrapper" style="display: none;"></div>
        `;
        const btnShowList = document.getElementById('btn-show-list');
        if (btnShowList) {
            btnShowList.addEventListener('click', () => {
                const tableWrapper = document.getElementById('employee-table-wrapper');
                if (!tableWrapper) return;
                if (tableWrapper.style.display === 'none' || tableWrapper.innerHTML === '') {
                    tableWrapper.style.display = 'block';
                    const groupedEmployees = employees.reduce((acc, emp) => {
                        (acc[emp.regu || 'Daytime'] = acc[emp.regu || 'Daytime'] || []).push(emp);
                        return acc;
                    }, {});
                    let contentHTML = `
                        <div class="action-bar" style="justify-content: flex-start;">
                            <button class="btn-primary" data-action="add-employee"><i class="fas fa-plus"></i> Tambah Karyawan</button>
                            <button class="btn-primary" data-action="manage-companies"><i class="fas fa-cog"></i> Kelola PT</button>
                            <input type="file" id="excel-importer" style="display:none" accept=".xlsx, .xls">
                            <button class="btn-primary" onclick="document.getElementById('excel-importer').click()"><i class="fas fa-file-import"></i> Impor dari Excel</button>
                            <button class="btn-success" data-action="download-template"><i class="fas fa-file-download"></i> Download Template</button>
                            <button class="btn-delete" data-action="delete-all" style="margin-left: auto;"><i class="fas fa-trash-alt"></i> Hapus Semua</button>
                        </div>`;
                    if (employees.length > 0) {
                        ['Daytime', 'A', 'B', 'C', 'D'].forEach(regu => {
                            if (groupedEmployees[regu] && groupedEmployees[regu].length > 0) {
                                contentHTML += `
                                    <div class="regu-group">
                                        <h3 class="regu-header">Kelompok: ${regu}</h3>
                                        <div class="employee-table-container">
                                            <table class="employee-table">
                                                <thead>
                                                    <tr>
                                                        <th>NID</th>
                                                        <th>Nama</th>
                                                        <th>Jobtitle</th>
                                                        <th>Company</th>
                                                        <th>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${groupedEmployees[regu].map(emp => `
                                                        <tr>
                                                            <td>${emp.nid}</td>
                                                            <td>${emp.name}</td>
                                                            <td>${emp.position}</td>
                                                            <td>${emp.company}</td>
                                                            <td class="actions">
                                                                <button class="btn-edit" data-action="edit-employee" data-nid="${emp.nid}"><i class="fas fa-edit"></i> Edit</button>
                                                                <button class="btn-delete" data-action="delete-employee" data-nid="${emp.nid}"><i class="fas fa-trash"></i> Hapus</button>
                                                                <button class="btn-barcode" data-action="download-barcode" data-nid="${emp.nid}" data-name="${emp.name}"><i class="fas fa-qrcode"></i> Barcode</button>
                                                            </td>
                                                        </tr>
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>`;
                            }
                        });
                    } else {
                        contentHTML += `<p style="text-align: center; margin-top: 20px; color: #64748b;">Belum ada data karyawan.</p>`;
                    }
                    tableWrapper.innerHTML = contentHTML;
                    const excelImporter = document.getElementById('excel-importer');
                    if (excelImporter) {
                        excelImporter.addEventListener('change', handleExcelImport);
                    }
                } else {
                    tableWrapper.style.display = 'none';
                }
            });
        }
    }

    function renderMonitoringLog() { if (monitoringLogBody) { monitoringLogBody.innerHTML = monitoringLog.slice(0).reverse().map(log => `<tr><td>${new Date(log.timestamp).toLocaleTimeString('id-ID', { hour12: false })}</td><td>${log.name}</td><td>${log.nid}</td><td>${log.position}</td><td>${log.company}</td><td data-status="${log.status.toLowerCase()}">${log.status}</td><td class="log-keterangan">${log.keterangan || '-'}</td></tr>`).join(''); } }
    function openEmployeeForm(employeeData = null) {
        employeeForm.reset();
        document.getElementById('employee-index').value = employeeData ? employees.findIndex(e => e.nid === employeeData.nid) : '';
        formPhotoInput.value = '';
        renderCompanyOptions();
        if (employeeData) {
            formTitle.textContent = 'Edit Karyawan';
            document.getElementById('form-nid').value = employeeData.nid;
            document.getElementById('form-name').value = employeeData.name;
            document.getElementById('form-position').value = employeeData.position;
            document.getElementById('form-company').value = employeeData.company;
            document.getElementById('form-regu').value = employeeData.regu || 'Daytime';
            formPhotoPreview.src = employeeData.photoUrl || 'https://placehold.co/100x120/cccccc/333?text=Preview';
        } else {
            formTitle.textContent = 'Tambah Karyawan';
            formPhotoPreview.src = 'https://placehold.co/100x120/cccccc/333?text=Preview';
        }
        openModal(employeeFormModal);
    }
    function handleEmployeeFormSubmit(event) {
        event.preventDefault();
        const index = document.getElementById('employee-index').value;
        const photoUrl = formPhotoPreview.src.startsWith('data:image') ? formPhotoPreview.src : (index !== '' && employees[index] ? employees[index].photoUrl : '');
        const employeeData = { nid: document.getElementById('form-nid').value.trim().toUpperCase(), name: document.getElementById('form-name').value.trim().toUpperCase(), position: document.getElementById('form-position').value.trim().toUpperCase(), company: document.getElementById('form-company').value, regu: document.getElementById('form-regu').value, photoUrl, inOutStatus: (index !== '' && employees[index]) ? employees[index].inOutStatus : 'Keluar' };
        if (index === '' && employees.some(emp => emp.nid === employeeData.nid)) { return alert(`NID "${employeeData.nid}" sudah ada.`); }
        if (index !== '') { employees[index] = employeeData; } else { employees.push(employeeData); }
        saveEmployees();
        closeModal(employeeFormModal);
        const tableWrapper = document.getElementById('employee-table-wrapper');
        if (tableWrapper && tableWrapper.style.display !== 'none') {
            tableWrapper.innerHTML = '';
            document.getElementById('btn-show-list').click();
        }
    }
    function manageCompanies() {
        const companyList = companies.map((c, i) => `${i + 1}. ${c}`).join('\n');
        const action = prompt(`Daftar Perusahaan:\n${companyList}\nKetik 'T' untuk TAMBAH, atau 'H' untuk HAPUS:`);
        if (!action) return;
        if (action.trim().toUpperCase() === 'T') { const newCompany = prompt("Masukkan nama PT baru:"); if (newCompany && newCompany.trim()) { companies.push(newCompany.trim()); saveCompanies(); alert(`PT "${newCompany}" berhasil ditambahkan.`); } }
        else if (action.trim().toUpperCase() === 'H') { const index = parseInt(prompt("Masukkan nomor PT yang akan dihapus:")) - 1; if (!isNaN(index) && index >= 0 && index < companies.length) { if (confirm(`Yakin ingin menghapus PT "${companies[index]}"?`)) { companies.splice(index, 1); saveCompanies(); alert(`PT berhasil dihapus.`); } } else { alert("Nomor PT tidak valid."); } }
    }
    function handleExcelImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                let importedCount = 0;
                json.forEach(row => {
                    const upperCaseRow = Object.fromEntries(Object.entries(row).map(([k, v]) => [String(k).toUpperCase(), v]));
                    if (upperCaseRow.NID && upperCaseRow.NAMA && upperCaseRow.JOBTITLE && upperCaseRow.COMPANY && upperCaseRow.REGU) { const nid = String(upperCaseRow.NID).toUpperCase(); if (!employees.some(emp => emp.nid === nid)) { employees.push({ nid, name: String(upperCaseRow.NAMA).toUpperCase(), position: String(upperCaseRow.JOBTITLE).toUpperCase(), company: String(upperCaseRow.COMPANY), regu: String(upperCaseRow.REGU), photoUrl: '', inOutStatus: 'Keluar' }); importedCount++; } }
                });
                if (importedCount > 0) { saveEmployees(); navigateTo('HUMAN RESOURCE PERFORMANCE'); alert(`${importedCount} data karyawan berhasil diimpor!`); } else { alert("Tidak ada data baru. Pastikan format kolom: NID, NAMA, JOBTITLE, COMPANY, REGU."); }
            } catch (error) { alert("Gagal memproses file."); console.error(error); }
        };
        reader.readAsArrayBuffer(file);
    }
    function downloadExcelTemplate() { const ws = XLSX.utils.json_to_sheet([{ NID: "CONTOH123", NAMA: "NAMA KARYAWAN", JOBTITLE: "POSISI JABATAN", COMPANY: "PT PLN NPS", REGU: "A" }]); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Template Data Karyawan"); XLSX.writeFile(wb, "Template_Impor_Karyawan.xlsx"); }
    function downloadBarcode(nid, name) { try { const qr = qrcode(0, 'L'); qr.addData(nid); qr.make(); const link = document.createElement("a"); link.href = qr.createDataURL(8, 8); link.download = `qrcode-${name.replace(/ /g, '_')}-${nid}.png`; link.click(); } catch (e) { console.error("Error membuat QR Code:", e); } }
    function updateClock() { if (clockElement) clockElement.textContent = new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\./g, ':'); }
    function updateEmployeeDetails(employee) { if (detailsPhoto) { detailsPhoto.src = employee.photoUrl || `https://placehold.co/300x400/cccccc/333?text=${employee.name.split(' ')[0]}`; detailsName.textContent = employee.name; detailsNid.textContent = employee.nid; detailsPosition.textContent = employee.position; detailsStatus.textContent = employee.inOutStatus.toUpperCase(); detailsCompanyLogoImg.src = companyLogos[employee.company] || 'https://placehold.co/100x100/ffffff/333?text=Logo'; } }
    function updateManpowerStats() { if (statPlnNps) { const count = companies.reduce((acc, company) => ({ ...acc, [company]: 0 }), {}); employees.forEach(emp => { if (emp.inOutStatus === 'Masuk' && count[emp.company] !== undefined) count[emp.company]++; }); statPlnNps.textContent = count["PT PLN NPS"] || 0; statMkp.textContent = count["PT MKP"] || 0; statMkpIc.textContent = count["PT MKP IC"] || 0; statSecurity.textContent = count["Security"] || 0; statVisitor.textContent = count["Visitor"] || 0; } }
    function addLogEntry(employee, status, keterangan = '-') {
        const newLogEntry = { timestamp: new Date().toISOString(), name: employee.name, nid: employee.nid, position: employee.position, company: employee.company, status, keterangan };
        monitoringLog.unshift(newLogEntry);
        renderMonitoringLog();
        localStorage.setItem('monitoringLog', JSON.stringify(monitoringLog));
        if (monitoringLog.length >= 5) { recapLog.unshift(...monitoringLog); saveRecapLog(); monitoringLog = []; localStorage.removeItem('monitoringLog'); }
    }
    function processScan() {
        if (!nidScannerInput) return;
        const nidToFind = nidScannerInput.value.trim().toUpperCase();
        if (!nidToFind) return;
        const employee = employees.find(emp => emp.nid.toUpperCase() === nidToFind);
        if (!employee) { nidScannerInput.value = ""; nidScannerInput.focus(); return alert(`Error: Karyawan dengan NID "${nidToFind}" tidak ditemukan.`); }
        scanSound.play();
        const newStatus = employee.inOutStatus === 'Masuk' ? 'Keluar' : 'Masuk';
        employee.inOutStatus = newStatus;
        let keterangan = '-';
        if (newStatus === 'Masuk') {
            const now = new Date();
            const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const employeeRegu = employee.regu || 'Daytime';
            const shiftForToday = (employeeRegu === 'Daytime') ? 'Daytime' : (monthlySchedule[todayKey] ? monthlySchedule[todayKey][employeeRegu] : '');
            if (shiftForToday && shiftForToday !== 'Libur' && shiftRules[shiftForToday]) { const rule = shiftRules[shiftForToday].start; if ((now.getHours() * 60 + now.getMinutes()) > (rule.hour * 60 + rule.minute)) { keterangan = 'Terlambat'; lateSound.play(); } } else { keterangan = (shiftForToday === 'Libur') ? 'Hari Libur' : 'Jadwal Belum Diatur'; }
        }
        updateEmployeeDetails(employee);
        addLogEntry(employee, newStatus, keterangan);
        updateManpowerStats();
        saveEmployees();
        nidScannerInput.value = "";
        nidScannerInput.focus();
    }
    function openMonitoringDashboard() { openModal(monitoringModal); updateClock(); updateManpowerStats(); if (clockInterval) clearInterval(clockInterval); clockInterval = setInterval(updateClock, 1000); if (nidScannerInput) nidScannerInput.focus(); }
    function renderRecapTable() { if (recapLogBody) { recapLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); recapLogBody.innerHTML = recapLog.map(log => `<tr><td>${new Date(log.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })}</td><td>${log.name}</td><td>${log.nid}</td><td>${log.position}</td><td>${log.company}</td><td>${log.status}</td><td class="log-keterangan">${log.keterangan || '-'}</td></tr>`).join(''); } }
    function openRecapModal() { renderRecapTable(); openModal(recapModal); }
    function downloadRecapExcel() { if (recapLog.length === 0) return; const dataForExcel = recapLog.map(log => ({ Waktu: new Date(log.timestamp).toLocaleString('id-ID'), Nama: log.name, NID: log.nid, Jobtitle: log.position, Company: log.company, Status: log.status, Keterangan: log.keterangan || '-' })); const ws = XLSX.utils.json_to_sheet(dataForExcel); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Rekap Aktivitas"); XLSX.writeFile(wb, `Rekap_Aktivitas_${new Date().toISOString().slice(0, 10)}.xlsx`); }
    function clearRecapData() { if ((recapLog.length > 0 || monitoringLog.length > 0) && confirm("Yakin ingin menghapus SEMUA data rekapitulasi DAN log monitoring?")) { recapLog = []; saveRecapLog(); monitoringLog = []; if (monitoringLogBody) monitoringLogBody.innerHTML = ''; localStorage.removeItem('monitoringLog'); employees.forEach(emp => emp.inOutStatus = 'Keluar'); saveEmployees(); navigateTo('HUMAN RESOURCE PERFORMANCE'); alert("Data rekapitulasi dan log monitoring telah dihapus."); } }
    function toggleFullscreen() { isFullscreen = !isFullscreen; if (monitoringModal) { monitoringModal.classList.toggle('modal-fullscreen', isFullscreen); toggleFullscreenBtn.innerHTML = isFullscreen ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>'; } }
    function openShiftScheduleManager(targetMonth, targetYear) {
        if (!shiftScheduleModal) return;
        const now = new Date();
        const month = targetMonth !== undefined ? targetMonth : now.getMonth();
        const year = targetYear !== undefined ? targetYear : now.getFullYear();
        const monthSelect = document.getElementById('month-select');
        const yearSelect = document.getElementById('year-select');
        yearSelect.innerHTML = Array.from({ length: 5 }, (_, i) => year - 2 + i).map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`).join('');
        monthSelect.innerHTML = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((name, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${name}</option>`).join('');
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let tableHTML = `<thead><tr><th>Tanggal</th><th>Regu A</th><th>Regu B</th><th>Regu C</th><th>Regu D</th></tr></thead><tbody>`;
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const scheduleForDay = monthlySchedule[dateKey] || {};
            tableHTML += `<tr><td class="date-cell">${day}</td>` + ['A', 'B', 'C', 'D'].map(regu => `<td><select class="schedule-select" data-date="${dateKey}" data-regu="${regu}">${['Pagi', 'Sore', 'Malam', 'Libur'].map(shift => `<option value="${shift}" ${(scheduleForDay[regu] || 'Pagi') === shift ? 'selected' : ''}>${shift}</option>`).join('')}</select></td>`).join('') + `</tr>`;
        }
        document.getElementById('schedule-table').innerHTML = tableHTML + `</tbody>`;
        monthSelect.onchange = () => openShiftScheduleManager(parseInt(monthSelect.value), parseInt(yearSelect.value));
        yearSelect.onchange = () => openShiftScheduleManager(parseInt(monthSelect.value), parseInt(yearSelect.value));
        openModal(shiftScheduleModal);
    }
    function openShiftTimesManager() {
        if (!shiftTimesModal) return;
        Object.entries(shiftRules).forEach(([shiftName, rule]) => {
            const name = shiftName.toLowerCase();
            document.getElementById(`${name}-start-hour`).value = String(rule.start.hour).padStart(2, '0');
            document.getElementById(`${name}-start-minute`).value = String(rule.start.minute).padStart(2, '0');
            document.getElementById(`${name}-end-hour`).value = String(rule.end.hour).padStart(2, '0');
            document.getElementById(`${name}-end-minute`).value = String(rule.end.minute).padStart(2, '0');
        });
        openModal(shiftTimesModal);
    }

    function updateActiveShiftDisplay() {
        const displayElement = document.getElementById('active-shift-display');
        if (!displayElement) return;
        const now = new Date();
        const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const scheduleForToday = monthlySchedule[todayKey];
        let activeRegu = null;
        if (scheduleForToday) {
            for (const regu of ['A', 'B', 'C', 'D']) {
                const shiftName = scheduleForToday[regu];
                if (shiftName && shiftName !== 'Libur') {
                    const rule = shiftRules[shiftName];
                    const startTime = new Date();
                    startTime.setHours(rule.start.hour, rule.start.minute, 0, 0);
                    const endTime = new Date();
                    endTime.setHours(rule.end.hour, rule.end.minute, 0, 0);
                    if (endTime < startTime) {
                        const yesterday = new Date(now);
                        yesterday.setDate(now.getDate() - 1);
                        const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
                        const scheduleForYesterday = monthlySchedule[yesterdayKey];
                        if (now < endTime) {
                            if (scheduleForYesterday && scheduleForYesterday[regu] === shiftName) {
                                activeRegu = regu;
                                break;
                            }
                        } else if (now >= startTime) {
                            activeRegu = regu;
                            break;
                        }
                    } else {
                        if (now >= startTime && now < endTime) {
                            activeRegu = regu;
                            break;
                        }
                    }
                }
            }
        }
        const numberElement = displayElement.querySelector('.number');
        if (numberElement) {
            if (activeRegu) {
                numberElement.textContent = `REGU ${activeRegu}`;
            } else {
                numberElement.textContent = 'ISTIRAHAT';
            }
        }
    }

    // --- FUNGSI-FUNGSI BARU UNTUK RENEWABLE ENERGY ---
    function setupRenewableEnergyTabs() {
        const submenuBtns = document.querySelectorAll('.submenu-btn');
        const contentSections = document.querySelectorAll('.re-content-section');

        submenuBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                submenuBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const targetId = this.dataset.target;
                contentSections.forEach(section => {
                    section.style.display = (section.id === targetId) ? 'block' : 'none';
                });
            });
        });

        // ### CATATAN: Dulu ada rincianModal.querySelector di sini.
        // ### Itu sudah tidak dibutuhkan karena tombol close modal Anda
        // ### sudah ditangani secara global oleh event listener untuk .close-button
        
        setupKalkulatorFluktuatifListeners();
        setupReferensiListeners();
    }
    
    function setupKalkulatorFluktuatifListeners() {
        const tambahBtn = document.getElementById('tambah-blok-btn');
        const hitungBtn = document.getElementById('hitung-fluktuatif-btn');
        const container = document.getElementById('blok-beban-container');
        const rincianBtn = document.getElementById('lihat-rincian-btn');
        
        const jenisBatubaraSelect = document.getElementById('jenis-batubara');
        const jenisBiomassaSelect = document.getElementById('jenis-biomassa');
        const kalorBatubaraInput = document.getElementById('kalorBatubara');
        const hargaBatubaraInput = document.getElementById('hargaBatubara');
        const karbonBatubaraInput = document.getElementById('karbonBatubara');
        const kalorBiomassaInput = document.getElementById('kalorBiomassa');
        const hargaBiomassaInput = document.getElementById('hargaBiomassa');
        const unitRadios = document.querySelectorAll('input[name="unit-pembangkit"]');
        const efisiensiInput = document.getElementById('efisiensi');

        if (tambahBtn) {
            tambahBtn.addEventListener('click', tambahBlokBeban);
        }
        if (hitungBtn) {
            hitungBtn.addEventListener('click', hitungFluktuatif);
        }
        if(rincianBtn){
            rincianBtn.addEventListener('click', tampilkanRincianPerhitungan);
        }
        if (container) {
            container.addEventListener('click', function(e) {
                if (e.target && (e.target.classList.contains('btn-hapus-blok') || e.target.parentElement.classList.contains('btn-hapus-blok'))) {
                    e.target.closest('.blok-beban-item').remove();
                }
            });
            
            if(container.children.length === 0) {
                tambahBlokBeban();
            }
        }

        if(unitRadios.length > 0){
                 unitRadios.forEach(radio => {
                    radio.addEventListener('change', function() {
                        const selectedUnitData = dataUnitPembangkit[this.value];
                        if (selectedUnitData) {
                            efisiensiInput.value = selectedUnitData.efisiensi;
                        }
                    });
                });
                document.querySelector('input[name="unit-pembangkit"]:checked').dispatchEvent(new Event('change'));
        }

        if(jenisBatubaraSelect && jenisBiomassaSelect){
            for(const jenis in dataBatuBara){
                jenisBatubaraSelect.options[jenisBatubaraSelect.options.length] = new Option(jenis, jenis);
            }
            for(const jenis in dataBiomassa){
                jenisBiomassaSelect.options[jenisBiomassaSelect.options.length] = new Option(jenis, jenis);
            }
            
            jenisBatubaraSelect.addEventListener('change', function(){
                const selectedData = dataBatuBara[this.value];
                if(selectedData){
                    kalorBatubaraInput.value = selectedData.kalor;
                    hargaBatubaraInput.value = selectedData.harga;
                    karbonBatubaraInput.value = selectedData.karbon;
                }
            });
            
            jenisBiomassaSelect.addEventListener('change', function(){
                const selectedData = dataBiomassa[this.value];
                if(selectedData){
                    kalorBiomassaInput.value = selectedData.kalor;
                    hargaBiomassaInput.value = selectedData.harga;
                }
            });

            jenisBatubaraSelect.dispatchEvent(new Event('change'));
            jenisBiomassaSelect.dispatchEvent(new Event('change'));
        }
    }

    function tambahBlokBeban() {
        const container = document.getElementById('blok-beban-container');
        const newBlock = document.createElement('div');
        newBlock.classList.add('blok-beban-item');
        
        const blockNumber = container.children.length + 1;

        newBlock.innerHTML = `
            <span class="blok-nomor">Blok ${blockNumber}</span>
            <div class="input-group">
                <label>Beban Rata-rata (MW)</label>
                <input type="number" class="input-beban" placeholder="Contoh: 6">
            </div>
            <div class="input-group">
                <label>Jam Operasi (per Tahun)</label>
                <input type="number" class="input-jam" placeholder="Contoh: 4000">
            </div>
            <button type="button" class="btn-hapus-blok" title="Hapus Blok Ini">&times;</button>
        `;
        container.appendChild(newBlock);
    }

    function hitungFluktuatif() {
        function formatAngka(angka, desimal = 0) {
            return new Intl.NumberFormat('id-ID', { maximumFractionDigits: desimal }).format(angka);
        }
        function formatRupiah(angka) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
        }

        const rincianBtn = document.getElementById('lihat-rincian-btn');
        
        const efisiensi = parseFloat(document.getElementById('efisiensi').value) / 100;
        const persenCoFiring = parseFloat(document.getElementById('persenCoFiring').value) / 100;
        const karbonBatubara = parseFloat(document.getElementById('karbonBatubara').value) / 100;
        const kalorBatubara = parseFloat(document.getElementById('kalorBatubara').value);
        const kalorBiomassa = parseFloat(document.getElementById('kalorBiomassa').value);
        const hargaBatubara = parseFloat(document.getElementById('hargaBatubara').value);
        const hargaBiomassa = parseFloat(document.getElementById('hargaBiomassa').value);
        
        if (isNaN(efisiensi) || isNaN(persenCoFiring) || isNaN(karbonBatubara) || isNaN(kalorBatubara) || isNaN(kalorBiomassa) || isNaN(hargaBatubara) || isNaN(hargaBiomassa)) {
            alert("Mohon isi semua field di 'Parameter Umum' & 'Data Bahan Bakar' dengan angka yang valid.");
            return;
        }

        let totalJamOperasi = 0;
        let totalKebutuhanBiomassaTon = 0;
        let totalPenguranganCo2Ton = 0;
        let totalBiayaBaseline = 0;
        let totalBiayaCofiring = 0;

        const blokBebanItems = document.querySelectorAll('.blok-beban-item');
        if (blokBebanItems.length === 0) {
            alert("Mohon tambahkan minimal satu blok beban.");
            return;
        }
        
        const blokPertama = blokBebanItems[0];
        const bebanMwBlokPertama = parseFloat(blokPertama.querySelector('.input-beban').value);
        const jamOperasiBlokPertama = parseFloat(blokPertama.querySelector('.input-jam').value);

        if(isNaN(bebanMwBlokPertama) || isNaN(jamOperasiBlokPertama)){
            alert("Mohon isi data pada Blok 1 untuk menampilkan rincian.");
            if(rincianBtn) rincianBtn.style.display = 'none';
        } else {
             dataUntukRincian = {
                bebanMw: bebanMwBlokPertama,
                jamOperasi: jamOperasiBlokPertama,
                efisiensi, persenCoFiring, karbonBatubara, kalorBatubara, kalorBiomassa, hargaBatubara, hargaBiomassa
            };
        }

        for (const blok of blokBebanItems) {
            const bebanMw = parseFloat(blok.querySelector('.input-beban').value);
            const jamOperasi = parseFloat(blok.querySelector('.input-jam').value);

            if (isNaN(bebanMw) || isNaN(jamOperasi) || bebanMw <= 0 || jamOperasi <= 0) {
                alert("Mohon isi semua field 'Beban' dan 'Jam Operasi' di setiap blok dengan angka positif.");
                if(rincianBtn) rincianBtn.style.display = 'none';
                return;
            }

            const energiListrik_MWh = bebanMw;
            const energiListrik_kkal = energiListrik_MWh * 860000;
            const energiPanasInput_kkal = energiListrik_kkal / efisiensi;
            const massaBatuBaraBaseline_kg_jam = energiPanasInput_kkal / kalorBatubara;
            const biayaBaseline_jam = (massaBatuBaraBaseline_kg_jam / 1000) * hargaBatubara;
            const energiDariBiomassa_kkal = energiPanasInput_kkal * persenCoFiring;
            const energiDariBatubara_kkal = energiPanasInput_kkal * (1 - persenCoFiring);
            const massaBiomassa_kg_jam = energiDariBiomassa_kkal / kalorBiomassa;
            const massaBatubaraCofiring_kg_jam = energiDariBatubara_kkal / kalorBatubara;
            const biayaCofiring_jam = ((massaBatubaraCofiring_kg_jam / 1000) * hargaBatubara) + ((massaBiomassa_kg_jam / 1000) * hargaBiomassa);
            const emisiBaseline_kg_jam = massaBatuBaraBaseline_kg_jam * karbonBatubara * (44 / 12);
            const emisiCofiring_kg_jam = massaBatubaraCofiring_kg_jam * karbonBatubara * (44 / 12);
            const penguranganCo2_kg_jam = emisiBaseline_kg_jam - emisiCofiring_kg_jam;

            totalJamOperasi += jamOperasi;
            totalKebutuhanBiomassaTon += (massaBiomassa_kg_jam * jamOperasi) / 1000;
            totalPenguranganCo2Ton += (penguranganCo2_kg_jam * jamOperasi) / 1000;
            totalBiayaBaseline += biayaBaseline_jam * jamOperasi;
            totalBiayaCofiring += biayaCofiring_jam * jamOperasi;
        }

        document.getElementById('totalJamOperasi').innerText = formatAngka(totalJamOperasi);
        document.getElementById('totalKebutuhanBiomassa').innerText = formatAngka(totalKebutuhanBiomassaTon, 1);
        document.getElementById('totalPenguranganCo2').innerText = formatAngka(totalPenguranganCo2Ton, 1);
        document.getElementById('totalBiayaBaseline').innerText = formatRupiah(totalBiayaBaseline);
        document.getElementById('totalBiayaCofiring').innerText = formatRupiah(totalBiayaCofiring);
        document.getElementById('totalSelisihBiaya').innerText = formatRupiah(totalBiayaCofiring - totalBiayaBaseline);
        
        document.getElementById('hasilKalkulasi').style.display = 'block';
        if (rincianBtn && !isNaN(dataUntukRincian.bebanMw)) {
            rincianBtn.style.display = 'block';
        }
    }

    // =====================================================================
    // ### MULAI PERUBAHAN: FUNGSI tampilkanRincianPerhitungan DIGANTI ###
    // =====================================================================
    function tampilkanRincianPerhitungan() {
        if (!dataUntukRincian || isNaN(dataUntukRincian.bebanMw)) {
            alert("Data untuk rincian tidak valid. Jalankan perhitungan terlebih dahulu.");
            return;
        }

        function formatAngka(angka, desimal = 1) {
            return new Intl.NumberFormat('id-ID', { maximumFractionDigits: desimal, minimumFractionDigits: desimal }).format(angka);
        }
        function formatRupiah(angka) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
        }

        const data = dataUntukRincian;

        // Perhitungan
        const energiListrik_kkal = data.bebanMw * 860000;
        const energiPanasInput_kkal = energiListrik_kkal / data.efisiensi;
        const massaBatuBaraBaseline_kg_jam = energiPanasInput_kkal / data.kalorBatubara;
        const biayaBaseline_jam = (massaBatuBaraBaseline_kg_jam / 1000) * data.hargaBatubara;
        const emisiBaseline_kg_jam = massaBatuBaraBaseline_kg_jam * data.karbonBatubara * (44 / 12);
        const energiDariBiomassa_kkal = energiPanasInput_kkal * data.persenCoFiring;
        const energiDariBatubara_kkal = energiPanasInput_kkal * (1 - data.persenCoFiring);
        const massaBiomassa_kg_jam = energiDariBiomassa_kkal / data.kalorBiomassa;
        const massaBatubaraCofiring_kg_jam = energiDariBatubara_kkal / data.kalorBatubara;
        const biayaCofiring_jam = ((massaBatubaraCofiring_kg_jam / 1000) * data.hargaBatubara) + ((massaBiomassa_kg_jam / 1000) * data.hargaBiomassa);
        const emisiCofiring_kg_jam = massaBatubaraCofiring_kg_jam * data.karbonBatubara * (44 / 12);
        const kebutuhanBiomassa_ton_thn = (massaBiomassa_kg_jam * data.jamOperasi) / 1000;
        const penguranganCo2_ton_thn = ((emisiBaseline_kg_jam - emisiCofiring_kg_jam) * data.jamOperasi) / 1000;
        const totalMassaCo_jam = massaBiomassa_kg_jam + massaBatubaraCofiring_kg_jam;
        const persenMassaBiomassa = totalMassaCo_jam > 0 ? (massaBiomassa_kg_jam / totalMassaCo_jam) * 100 : 0;

        // Fungsi untuk mengisi teks dengan aman
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value;
        };

        // Mengisi data ke Modal
        setText('rincian-modal-title', `Rincian Perhitungan (untuk Beban ${data.bebanMw} MW)`);

        // Bagian 1
        setText('detail-beban-1', data.bebanMw);
        setText('detail-energi-listrik', formatAngka(energiListrik_kkal, 0));
        setText('detail-energi-listrik-2', formatAngka(energiListrik_kkal, 0));
        setText('detail-efisiensi', data.efisiensi * 100);
        setText('detail-energi-panas', formatAngka(energiPanasInput_kkal, 0));

        // Bagian 2
        setText('detail-energi-panas-2', formatAngka(energiPanasInput_kkal, 0));
        setText('detail-kalor-bb-1', formatAngka(data.kalorBatubara, 0));
        setText('detail-baseline-massa', formatAngka(massaBatuBaraBaseline_kg_jam));
        setText('detail-baseline-massa-2', formatAngka(massaBatuBaraBaseline_kg_jam));
        setText('detail-baseline-massa-3', formatAngka(massaBatuBaraBaseline_kg_jam));
        setText('detail-harga-bb', formatRupiah(data.hargaBatubara));
        setText('detail-baseline-biaya', formatRupiah(biayaBaseline_jam));
        setText('detail-karbon-bb-1', data.karbonBatubara * 100);
        setText('detail-baseline-emisi', formatAngka(emisiBaseline_kg_jam));

        // Bagian 3
        setText('detail-persen-cofiring-1', data.persenCoFiring * 100);
        setText('detail-persen-cofiring-2', data.persenCoFiring * 100);
        setText('detail-energi-panas-3', formatAngka(energiPanasInput_kkal, 0));
        setText('detail-co-energi-bio', formatAngka(energiDariBiomassa_kkal, 0));
        setText('detail-persen-bb', 100 - (data.persenCoFiring * 100));
        setText('detail-energi-panas-4', formatAngka(energiPanasInput_kkal, 0));
        setText('detail-co-energi-bb', formatAngka(energiDariBatubara_kkal, 0));
        setText('detail-co-energi-bio-2', formatAngka(energiDariBiomassa_kkal, 0));
        setText('detail-kalor-bio', formatAngka(data.kalorBiomassa, 0));
        setText('detail-co-massa-bio', formatAngka(massaBiomassa_kg_jam));
        setText('detail-co-energi-bb-2', formatAngka(energiDariBatubara_kkal, 0));
        setText('detail-kalor-bb-2', formatAngka(data.kalorBatubara, 0));
        setText('detail-co-massa-bb', formatAngka(massaBatubaraCofiring_kg_jam));
        setText('detail-co-biaya-total', formatRupiah(biayaCofiring_jam));
        setText('detail-co-massa-bb-2', formatAngka(massaBatubaraCofiring_kg_jam));
        setText('detail-karbon-bb-2', data.karbonBatubara * 100);
        setText('detail-co-emisi', formatAngka(emisiCofiring_kg_jam));

        // Bagian 4
        setText('detail-final-kebutuhan-bio', `${formatAngka(kebutuhanBiomassa_ton_thn)} ton/tahun`);
        setText('detail-final-pengurangan-co2', `${formatAngka(penguranganCo2_ton_thn)} ton CO2/tahun`);
        setText('detail-final-persen-energi', formatAngka(data.persenCoFiring * 100, 2));
        setText('detail-final-persen-massa', formatAngka(persenMassaBiomassa, 2));
        
        // Buka Modal yang benar (yang ada di index.html)
        openModal(document.getElementById('rincianPerhitunganModal'));
    }
    // =====================================================================
    // ### AKHIR PERUBAHAN ###
    // =====================================================================
    
    function setupReferensiListeners() {
        const tambahDokumenBtn = document.getElementById('tambah-dokumen-btn');
        const simpanCatatanBtn = document.getElementById('simpan-catatan-btn');
        const dokumenForm = document.getElementById('dokumen-form');
        const tabelDokumenBody = document.getElementById('tabel-dokumen-body');

        if (tambahDokumenBtn) {
            tambahDokumenBtn.addEventListener('click', () => {
                dokumenForm.reset();
                openModal(document.getElementById('tambahDokumenModal'));
            });
        }

        if (dokumenForm) {
            dokumenForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const fileInput = document.getElementById('form-dokumen-file');
                const deskripsiInput = document.getElementById('form-dokumen-deskripsi');

                if (fileInput.files.length > 0) {
                    const newDoc = {
                        namaFile: fileInput.files[0].name,
                        deskripsi: deskripsiInput.value,
                        tanggal: new Date().toISOString()
                    };
                    dokumenTerkait.push(newDoc);
                    saveDokumen();
                    renderTabelDokumen();
                    closeModal(document.getElementById('tambahDokumenModal'));
                } else {
                    alert('Silakan pilih file terlebih dahulu.');
                }
            });
        }

        if (simpanCatatanBtn) {
            simpanCatatanBtn.addEventListener('click', function() {
                const textarea = document.getElementById('catatan-baru-textarea');
                if(textarea.value.trim() !== ''){
                    const newCatatan = {
                        teks: textarea.value.trim(),
                        timestamp: new Date().toISOString()
                    };
                    catatanReferensi.push(newCatatan);
                    saveCatatan();
                    renderCatatan();
                    textarea.value = '';
                }
            });
        }

        if (tabelDokumenBody) {
             tabelDokumenBody.addEventListener('click', function(e){
                if(e.target.closest('.btn-delete')){
                    const index = e.target.closest('.btn-delete').dataset.index;
                    if(confirm(`Yakin ingin menghapus dokumen "${dokumenTerkait[index].namaFile}"?`)){
                        dokumenTerkait.splice(index, 1);
                        saveDokumen();
                        renderTabelDokumen();
                    }
                }
            });
        }

        renderTabelDokumen();
        renderCatatan();
    }

    function renderTabelDokumen() {
        const tbody = document.getElementById('tabel-dokumen-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (dokumenTerkait.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada dokumen.</td></tr>';
            return;
        }
        dokumenTerkait.forEach((doc, index) => {
            const row = `
                <tr>
                    <td>${doc.namaFile}</td>
                    <td>${doc.deskripsi}</td>
                    <td>${new Date(doc.tanggal).toLocaleDateString('id-ID')}</td>
                    <td class="actions" style="justify-content:flex-start;">
                        <a href="dokumen/${doc.namaFile}" target="_blank" class="btn-barcode"><i class="fas fa-eye"></i> Lihat</a>
                        <button class="btn-delete" data-index="${index}"><i class="fas fa-trash"></i> Hapus</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }
    
    function renderCatatan() {
        const container = document.getElementById('catatan-display-container');
        if (!container) return;
        container.innerHTML = '';
        if (catatanReferensi.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#64748b;">Belum ada catatan.</p>';
            return;
        }
        [...catatanReferensi].reverse().forEach(catatan => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('catatan-item');
            const formattedDate = new Date(catatan.timestamp).toLocaleString('id-ID', {dateStyle: 'full', timeStyle: 'short'});
            noteElement.innerHTML = `
                <p class="catatan-teks">${catatan.teks.replace(/\n/g, '<br>')}</p>
                <p class="catatan-tanggal">Dicatat pada: ${formattedDate}</p>
            `;
            container.appendChild(noteElement);
        });
    }


    // --- NAVIGASI UTAMA ---
    function navigateTo(pageName, addToHistory = true) {
        currentPageName = pageName;
        const oldBtn = document.getElementById('show-options-btn');
        if (oldBtn) oldBtn.remove();
        pageTitle.textContent = pageName;
        menuLinks.forEach(l => l.classList.remove('active'));
        
        const activeLink = document.querySelector(`.sidebar .menu a[data-page="${pageName}"]`);
        if (activeLink) activeLink.classList.add('active');

        if (pageName === 'DASHBOARD') {
            const headerActions = document.querySelector('.content-header .header-actions');
            if (!document.getElementById('show-options-btn')) {
                headerActions.insertAdjacentHTML('beforeend', `
                    <button id="show-options-btn" class="btn-primary">PILIH OPSI DASHBOARD</button>
                `);
            }
            contentBody.innerHTML = `
                <div id="summary-container" class="summary-container">
                    <p class="summary-placeholder">Pilih opsi di atas untuk melihat summary.</p>
                </div>
                <div id="optionsModal" class="modal">
                    <div class="modal-content form-modal">
                        <span class="close-button">&times;</span>
                        <h3>Pilih Opsi Dashboard</h3>
                        <div class="options-grid">
                            ${Array.from(menuLinks).filter(link => link.dataset.page !== 'DASHBOARD' && link.dataset.page !== 'TOOLS' && link.dataset.page !== 'WAREHOUSE & INVENTORY' && link.dataset.page !== 'REFERENSI DAN DATABASE').map(link => `<button class="option-btn" data-summary="${link.dataset.page.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}">${link.dataset.page}</button>`).join('')}
                        </div>
                    </div>
                </div>`;

            function openOptionsModal() { openModal(document.getElementById('optionsModal')); }
            function closeModalFunc() { closeModal(document.getElementById('optionsModal')); }

            function showSummary(summaryType) {
                const container = document.getElementById('summary-container');
                let content = '';
                if (!container) return;
                const formattedSummaryType = summaryType.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                switch (formattedSummaryType) {
                    case 'human-resource-performance':
                        const totalEmployees = employees.length;
                        const activeToday = employees.filter(emp => emp.inOutStatus === 'Masuk').length;
                        const attendancePercentage = totalEmployees > 0 ? ((activeToday / totalEmployees) * 100).toFixed(1) : 0;
                        const combinedLog = [...monitoringLog, ...recapLog];
                        const recentActivities = combinedLog.slice(0, 5);
                        const recentActivitiesHTML = recentActivities.length > 0 ? recentActivities.map(log => `<li><div class="detail"><div class="name">${log.name}</div><div class="time">${new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div></div><div class="status-wrapper">${log.keterangan && log.keterangan !== '-' ? `<span class="status keterangan-status">${log.keterangan}</span>` : ''}<span class="status ${log.status.toLowerCase()}">${log.status}</span></div></li>`).join('') : '<li>Tidak ada aktivitas terbaru.</li>';
                        content = `
                        <div class="hr-dashboard-container">
                            <button id="hr-fullscreen-btn" title="Toggle Fullscreen"><i class="fas fa-expand"></i></button>
                            <div class="marquee-container"><p>SELAMAT DATANG DI PT PLN NUSANTARA POWER SERVICE UNIT PLTU AMPANA, UTAMAKAN KESELAMATAN DAN KESEHATAN KERJA (K3) DALAM SETIAP AKTIVITAS ANDA.</p></div>
                            <div class="hr-dashboard-grid">
                                <div class="kpi-card">
                                    <div class="icon total-emp"><i class="fas fa-users"></i></div>
                                    <div class="info">
                                        <div class="number">${totalEmployees}</div>
                                        <div class="label">Total Karyawan Terdaftar</div>
                                    </div>
                                </div>
                                <div class="kpi-card" id="active-shift-display">
                                    <div class="icon active-shift"><i class="fas fa-clock"></i></div>
                                    <div class="info">
                                        <div class="number">ISTIRAHAT</div>
                                        <div class="label">Regu Bertugas Saat Ini</div>
                                    </div>
                                </div>
                                <div class="kpi-card">
                                    <div class="icon active-today"><i class="fas fa-user-check"></i></div>
                                    <div class="info">
                                        <div class="number">${activeToday}</div>
                                        <div class="label">Jumlah Hadir Hari Ini</div>
                                    </div>
                                </div>
                                <div class="kpi-card">
                                    <div class="icon attendance-percent"><i class="fas fa-chart-pie"></i></div>
                                    <div class="info">
                                        <div class="number">${attendancePercentage}%</div>
                                        <div class="label">Persentase Kehadiran</div>
                                    </div>
                                </div>
                                <div class="kpi-card">
                                    <div class="icon safety-score"><i class="fas fa-shield-alt"></i></div>
                                    <div class="info">
                                        <div class="number">98.5%</div>
                                        <div class="label">Skor Keselamatan</div>
                                    </div>
                                </div>
                            </div>
                            <div class="hr-main-content-grid">
                                <div class="activity-feed">
                                    <h3><i class="fas fa-history"></i> Aktivitas Terkini</h3>
                                    <ul>${recentActivitiesHTML}</ul>
                                    <div class="bottom-widgets">
                                        <div class="k3-stats-dashboard">
                                            <h3><i class="fas fa-hard-hat"></i> Data Statistik K3</h3>
                                            <div class="k3-grid">
                                                <div class="k3-card yellow"><span>Jam Kerja Hilang</span><p id="d-k3-jam-hilang">0</p></div>
                                                <div class="k3-card red"><span>Kecelakaan Berat & Ringan</span><p id="d-k3-kecelakaan">NIHIL</p></div>
                                                <div class="k3-card blue"><span>Jam Kerja Bulan Lalu</span><p id="d-k3-jam-lalu">0</p></div>
                                                <div class="k3-card orange"><span>Total Jam Kerja</span><p id="d-k3-jam-total">0</p></div>
                                            </div>
                                        </div>
                                        <div class="chart-wrapper">
                                            <h3><i class="fas fa-chart-pie"></i> Komposisi Karyawan</h3>
                                            <div class="chart-container">
                                                <canvas id="employeeCompositionChart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="video-container">
                                    <h3><i class="fas fa-video"></i> PLTU AMPANA </h3>
                                    <div class="video-wrapper"><video src="videos/PLTUAMPANA.mp4" autoplay loop muted playsinline>Browser Anda tidak mendukung tag video.</video></div>
                                    <div class="blinking-info-container">
                                        <i class="fas fa-triangle-exclamation"></i>
                                        <p id="blinking-text" class="blinking-text"></p>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                        break;
                    case 'equipment-management':
                        navigateTo('EQUIPMENT MANAGEMENT');
                        break;
                    default:
                        const title = summaryType.replace(/-/g, ' ').toUpperCase();
                        content = `<div class="summary-content"><h3>${title}</h3><p>Data untuk modul ini belum tersedia.</p></div>`;
                }
                if (summaryType !== 'equipment-management') {
                    container.innerHTML = content;
                }
                closeModalFunc();
                const chartCanvas = document.getElementById('employeeCompositionChart');
                if (chartCanvas) {
                    const companyCounts = employees.reduce((acc, employee) => {
                        acc[employee.company] = (acc[employee.company] || 0) + 1;
                        return acc;
                    }, {});
                    const labels = Object.keys(companyCounts);
                    const data = Object.values(companyCounts);
                    new Chart(chartCanvas, {
                        type: 'doughnut',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Jumlah Karyawan',
                                data: data,
                                backgroundColor: [
                                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6',
                                ],
                                hoverOffset: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    align: 'center',
                                    labels: {
                                        padding: 20
                                    }
                                },
                                title: {
                                    display: false,
                                    text: 'Komposisi Karyawan per Perusahaan'
                                },
                                datalabels: {
                                    formatter: (value, context) => {
                                        return value;
                                    },
                                    color: '#fff',
                                    font: {
                                        weight: 'bold',
                                        size: 16,
                                    }
                                }
                            }
                        }
                    });
                }
                updateActiveShiftDisplay();
                setInterval(updateActiveShiftDisplay, 60000);
                const blinkingTextElement = document.getElementById('blinking-text');
                if (blinkingTextElement) {
                    blinkingTextElement.textContent = notepadContent.toUpperCase();
                }
                if (formattedSummaryType === 'human-resource-performance') {
                    const fullscreenBtn = document.getElementById('hr-fullscreen-btn');
                    const dashboardContainer = document.getElementById('summary-container');
                    if (fullscreenBtn && dashboardContainer) {
                        fullscreenBtn.addEventListener('click', () => {
                            dashboardContainer.classList.toggle('hr-dashboard-fullscreen');
                            const icon = fullscreenBtn.querySelector('i');
                            const isFullscreen = dashboardContainer.classList.contains('hr-dashboard-fullscreen');
                            icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
                            fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen';
                        });
                    }
                    const savedK3Stats = JSON.parse(localStorage.getItem('k3Stats'));
                    if (savedK3Stats) {
                        const jamHilangEl = document.getElementById('d-k3-jam-hilang');
                        const kecelakaanEl = document.getElementById('d-k3-kecelakaan');
                        const jamLaluEl = document.getElementById('d-k3-jam-lalu');
                        const jamTotalEl = document.getElementById('d-k3-jam-total');
                        if (jamHilangEl) jamHilangEl.textContent = savedK3Stats['k3-jam-hilang'] || '0';
                        if (kecelakaanEl) kecelakaanEl.textContent = savedK3Stats['k3-kecelakaan'] || 'NIHIL';
                        if (jamLaluEl) jamLaluEl.textContent = savedK3Stats['k3-jam-lalu'] || '0';
                        if (jamTotalEl) jamTotalEl.textContent = savedK3Stats['k3-jam-total'] || '0';
                    }
                }
            }
            setTimeout(() => {
                const showOptionsBtn = document.getElementById('show-options-btn');
                const optionsModal = document.getElementById('optionsModal');
                if (showOptionsBtn) showOptionsBtn.addEventListener('click', openOptionsModal);
                if (optionsModal) {
                    optionsModal.querySelector('.close-button').addEventListener('click', closeModalFunc);
                    optionsModal.querySelectorAll('.option-btn').forEach(btn => btn.addEventListener('click', () => showSummary(btn.dataset.summary)));
                    window.addEventListener('click', (event) => { if (event.target === optionsModal) closeModalFunc(); });
                }
            }, 0);
        } else if (pageName === 'HUMAN RESOURCE PERFORMANCE') {
            renderEmployeeManagementPage();
        } else if (pageName === 'EQUIPMENT MANAGEMENT') {
            contentBody.innerHTML = `
                <div class="equipment-options">
                    <button class="equipment-btn" data-content="operasi">
                        <i class="fas fa-play-circle"></i> OPERASI
                    </button>
                    <button class="equipment-btn" data-content="pemeliharaan">
                        <i class="fas fa-tools"></i> PEMELIHARAAN
                    </button>
                </div>
                <div id="equipment-content-display" class="equipment-content-display">
                     <p style="text-align:center; color:#64748b;">Pilih salah satu opsi di atas.</p>
                </div>
            `;
            const mainButtonsContainer = document.querySelector('.equipment-options');
            const displayArea = document.getElementById('equipment-content-display');
            document.querySelectorAll('.equipment-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const contentToShow = this.dataset.content;
                    history.pushState({ page: pageName, sub: contentToShow }, '', `#${pageName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}/${contentToShow}`);

                    if (contentToShow === 'operasi') {
                        mainButtonsContainer.classList.add('hidden');
                        displayArea.innerHTML = '<h3>Konten Operasi</h3><p>Area ini akan menampilkan data dan informasi terkait operasi peralatan.</p>';
                    } else if (contentToShow === 'pemeliharaan') {
                        mainButtonsContainer.classList.add('hidden');
                        displayArea.innerHTML = `
                            <div class="maintenance-options">
                                <button class="maintenance-btn" data-maintenance="mekanik"><i class="fas fa-cogs"></i> Mekanik</button>
                                <button class="maintenance-btn" data-maintenance="elektrik"><i class="fas fa-bolt"></i> Elektrik</button>
                                <button class="maintenance-btn" data-maintenance="instrument-control"><i class="fas fa-tachometer-alt"></i> Instrument Control</button>
                                <button class="maintenance-btn" data-maintenance="common"><i class="fas fa-network-wired"></i> Common</button>
                                <button class="maintenance-btn" data-maintenance="pendukung"><i class="fas fa-toolbox"></i> Pendukung Teknik</button>
                            </div>
                            <div id="maintenance-content" class="equipment-content-display" style="margin-top:20px;">
                                 <p style="text-align:center; color:#64748b;">Pilih salah satu sub-menu pemeliharaan di atas.</p>
                            </div>
                        `;
                        const maintenanceBtns = document.querySelectorAll('.maintenance-btn');
                        const maintenanceContent = document.getElementById('maintenance-content');
                        function showMaintenanceContent(maintButton) {
                            maintenanceBtns.forEach(btn => btn.classList.remove('active'));
                            maintButton.classList.add('active');
                            const maintenanceType = maintButton.dataset.maintenance;
                            if (maintenanceType === 'mekanik') {
                                maintenanceContent.innerHTML = `
                                    <div class="maintenance-options category-level">
                                        <button class="maintenance-btn category-btn" data-category="boiler"><i class="fas fa-fire"></i> Boiler</button>
                                        <button class="maintenance-btn category-btn" data-category="turbine"><i class="fas fa-fan"></i> Turbine</button>
                                        <button class="maintenance-btn category-btn" data-category="rotating"><i class="fas fa-sync-alt"></i> Rotating Equipment</button>
                                        <button class="maintenance-btn category-btn" data-category="fuel"><i class="fas fa-gas-pump"></i> Sistem Bahan Bakar</button>
                                        <button class="maintenance-btn category-btn" data-category="ash"><i class="fas fa-recycle"></i> Sistem Penanganan Abu</button>
                                        <button class="maintenance-btn category-btn" data-category="cooling"><i class="fas fa-wind"></i> Sistem Pendingin</button>
                                        <button class="maintenance-btn category-btn" data-category="lifting"><i class="fas fa-crane"></i> Peralatan Angkat</button>
                                    </div>
                                    <div id="category-content-display" class="equipment-content-display" style="margin-top:20px;">
                                        <p style="text-align:center; color:#64748b;">Pilih kategori di atas untuk melihat daftar peralatan.</p>
                                    </div>
                                `;
                                document.querySelectorAll('.category-btn').forEach(catButton => {
                                    catButton.addEventListener('click', function () {
                                        const categoryType = this.dataset.category;
                                        history.pushState({ page: pageName, sub: contentToShow, sub2: maintenanceType, sub3: categoryType }, '', `#${pageName.toLowerCase().replace(/ /g, '-')}/${contentToShow}/${maintenanceType}/${categoryType}`);
                                        maintButton.parentElement.classList.add('hidden');
                                        catButton.parentElement.classList.add('hidden');
                                        document.getElementById('category-content-display').innerHTML = `<h3>Daftar Peralatan untuk Kategori: ${categoryType.toUpperCase()}</h3><p>Tabel data akan ditampilkan di sini...</p>`;
                                    });
                                });
                            } else {
                                maintenanceContent.innerHTML = `<h3>Data untuk: ${maintenanceType.toUpperCase()}</h3><p>Tabel atau konten akan ditampilkan di sini.</p>`;
                                maintButton.parentElement.classList.add('hidden');
                            }
                        }
                        maintenanceBtns.forEach(maintButton => {
                            maintButton.addEventListener('click', function () {
                                const maintenanceType = this.dataset.maintenance;
                                history.pushState({ page: pageName, sub: contentToShow, sub2: maintenanceType }, '', `#${pageName.toLowerCase().replace(/ /g, '-')}/${contentToShow}/${maintenanceType}`);
                                showMaintenanceContent(this);
                            });
                        });
                    }
                });
            });
        }
        else if (pageName === 'TOOLS') {
            contentBody.innerHTML = `<p>Konten untuk halaman <strong>${pageName}</strong> sedang dalam pengembangan.</p>`;
        }
        else if (pageName === 'REFERENSI DAN DATABASE') {
            // Logika ini akan mengarahkan ke halaman RE, lalu mengklik tab yang benar
            navigateTo('RENEWABLE ENERGY'); 
            setTimeout(() => {
                const refButton = document.querySelector('.submenu-btn[data-target="referensi-content"]');
                if (refButton) refButton.click();
            }, 0);
        }
        else if (pageName === 'RENEWABLE ENERGY') {
            contentBody.innerHTML = `
                <div class="submenu-bar">
                    <button class="submenu-btn active" data-target="smart-cofiring-content"><i class="fas fa-cogs"></i> Smart Co-firing</button>
                    <button class="submenu-btn" data-target="referensi-content"><i class="fas fa-book-open"></i> Referensi & Database</button>
                    <button class="submenu-btn" data-target="dokumen-content"><i class="fas fa-file-pdf"></i> Dokumen Pendukung</button>
                </div>

                <div id="smart-cofiring-content" class="re-content-section">
                    <div class="kalkulator-container">
                        <h1>"Smart Co-firing"</h1>
                        <p class="deskripsi">Perhitungan Efisiensi Operasi co-firing dengan keandalan pembangkit.</p>
                        
                        <div class="form-section">
                            <h3>Pilih Unit Pembangkit</h3>
                            <div class="unit-selector">
                                <div class="unit-option">
                                    <input type="radio" id="unit1" name="unit-pembangkit" value="Unit 1" checked>
                                    <label for="unit1">Unit #1</label>
                                </div>
                                <div class="unit-option">
                                    <input type="radio" id="unit2" name="unit-pembangkit" value="Unit 2">
                                    <label for="unit2">Unit #2</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>1. Parameter Umum & Asumsi</h3>
                            <div class="parameter-grid">
                                <div class="input-group">
                                    <label for="efisiensi">Efisiensi Rata-rata PLTU (%)</label>
                                    <input type="number" id="efisiensi" required>
                                </div>
                                <div class="input-group">
                                    <label for="persenCoFiring">Target Persentase Co-firing (% Energi)</label>
                                    <input type="number" id="persenCoFiring" required>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>2. Data Bahan Bakar & Ekonomi</h3>
                            <div class="parameter-grid-bahan-bakar">
                                 <div class="input-group">
                                    <label for="jenis-batubara">Jenis Batu Bara</label>
                                    <select id="jenis-batubara"></select>
                                </div>
                                 <div class="input-group">
                                    <label for="kalorBatubara">Nilai Kalor (kkal/kg)</label>
                                    <input type="number" id="kalorBatubara" required>
                                </div>
                                <div class="input-group">
                                    <label for="hargaBatubara">Harga (Rp/ton)</label>
                                    <input type="number" id="hargaBatubara" required>
                                </div>
                                <div class="input-group">
                                    <label for="karbonBatubara">Kandungan Karbon (%)</label>
                                    <input type="number" step="0.1" id="karbonBatubara" required>
                                </div>
                            </div>
                            <hr class="pemisah-bahan-bakar">
                            <div class="parameter-grid-bahan-bakar">
                                 <div class="input-group">
                                    <label for="jenis-biomassa">Jenis Biomassa</label>
                                    <select id="jenis-biomassa"></select>
                                </div>
                                <div class="input-group">
                                    <label for="kalorBiomassa">Nilai Kalor (kkal/kg)</label>
                                    <input type="number" id="kalorBiomassa" required>
                                </div>
                                <div class="input-group">
                                    <label for="hargaBiomassa">Harga (Rp/ton)</label>
                                    <input type="number" id="hargaBiomassa" required>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>3. Profil Beban Operasi (Blok Beban)</h3>
                            <div id="blok-beban-container"></div>
                            <button type="button" id="tambah-blok-btn" class="btn-secondary" style="margin-top: 15px;"><i class="fas fa-plus"></i> Tambah Blok Beban</button>
                        </div>
                        
                        <button type="button" id="hitung-fluktuatif-btn" class="btn-primary" style="width:100%; font-size: 1.2rem; padding: 15px;"><i class="fas fa-calculator"></i> HITUNG TOTAL DAMPAK TAHUNAN</button>
                        <button type="button" id="lihat-rincian-btn" class="btn-success" style="width:100%; margin-top: 15px; display:none;"><i class="fas fa-table"></i> Lihat Rincian Perhitungan (Blok 1)</button>
                
                        <div id="hasilKalkulasi" class="hasil-container" style="display:none; margin-top: 30px;">
                            <h2>Hasil Akumulasi Tahunan</h2>
                            <div class="hasil-item">
                                <p>Total Jam Operasi</p>
                                <span id="totalJamOperasi">0</span> jam/tahun
                            </div>
                            <div class="hasil-item highlight">
                                <p>Kebutuhan Biomassa Tahunan</p>
                                <span id="totalKebutuhanBiomassa">0</span> ton/tahun
                            </div>
                            <div class="hasil-item highlight">
                                <p>Pengurangan Emisi CO2 Tahunan</p>
                                <span id="totalPenguranganCo2">0</span> ton CO2/tahun
                            </div>
                            <div class="hasil-item">
                                <p>Total Biaya (Baseline)</p>
                                <span id="totalBiayaBaseline">Rp 0</span>
                            </div>
                            <div class="hasil-item">
                                <p>Total Biaya (Co-firing)</p>
                                <span id="totalBiayaCofiring">Rp 0</span>
                            </div>
                             <div class="hasil-item highlight">
                                <p>Selisih Biaya Tahunan</p>
                                <span id="totalSelisihBiaya">Rp 0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="referensi-content" class="re-content-section" style="display:none;">
                     <div class="referensi-container">
                        <h1>Referensi dan Database Perhitungan</h1>
                        <p class="deskripsi">Halaman ini berisi acuan, standar, dan catatan operasional terkait co-firing.</p>
                        <div class="referensi-section">
                            <h3><i class="fas fa-calculator"></i> Rumus Perhitungan Utama</h3>
                            <div class="rumus-box">
                                <h4>1. Kebutuhan Energi Panas Input (kkal/jam)</h4>
                                <p class="rumus-formula">Energi Panas = (Beban MW × 860.000) / Efisiensi PLTU</p>
                            </div>
                            <div class="rumus-box">
                                <h4>2. Kebutuhan Massa Bahan Bakar (kg/jam)</h4>
                                <p class="rumus-formula">Massa = Energi Panas / Nilai Kalor Bahan Bakar</p>
                            </div>
                            <div class="rumus-box">
                                <h4>3. Emisi CO2 dari Batu Bara (kg/jam)</h4>
                                <p class="rumus-formula">Emisi CO2 = Massa Batu Bara × % Karbon × (44 / 12)</p>
                            </div>
                        </div>
                         <div class="referensi-section">
                            <h3><i class="fas fa-sticky-note"></i> Catatan & Log Perubahan</h3>
                            <div id="catatan-display-container"></div>
                            <textarea id="catatan-baru-textarea" class="notepad-textarea" placeholder="Tulis catatan baru di sini..."></textarea>
                            <button id="simpan-catatan-btn" class="btn-success" style="margin-top:10px;"><i class="fas fa-save"></i> Simpan Catatan Baru</button>
                        </div>
                    </div>
                </div>

                <div id="dokumen-content" class="re-content-section" style="display:none;">
                    <div class="referensi-container">
                        <h1>Dokumen dan Regulasi Pendukung</h1>
                        <p class="deskripsi">Pustaka untuk dokumen standar (SOP, regulasi, data teknis).</p>
                        
                        <div class="referensi-section">
                            <h3><i class="fas fa-file-alt"></i> Pustaka Dokumen</h3>
                            <p><strong>Penting:</strong> Letakkan file fisik (PDF, Word, Excel) di dalam folder "dokumen" di proyek Anda agar link berfungsi.</p>
                            <div class="employee-table-container" style="margin-top:15px;">
                                <table class="employee-table">
                                    <thead>
                                        <tr>
                                            <th>Nama File</th>
                                            <th>Deskripsi</th>
                                            <th>Tanggal</th>
                                            <th style="text-align:center;">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tabel-dokumen-body"></tbody>
                                </table>
                            </div>
                            <button id="tambah-dokumen-btn" class="btn-primary" style="margin-top:15px;"><i class="fas fa-plus"></i> Tambah Dokumen</button>
                        </div>
                    </div>
                </div>

                `;
            setupRenewableEnergyTabs();
        }
        else {
            contentBody.innerHTML = `<p>Konten untuk halaman <strong>${pageName}</strong> sedang dalam pengembangan.</p>`;
        }

        if (addToHistory && !['RENEWABLE ENERGY', 'REFERENSI DAN DATABASE'].includes(pageName)) {
            history.pushState({ page: pageName }, '', `#${pageName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`);
        } else if (addToHistory) {
            history.pushState({ page: pageName }, '', `#renewable-energy`);
        }
    }

    // --- EVENT LISTENERS GLOBAL ---
    menuLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.dataset.page); }); });
    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page) {
            navigateTo(event.state.page, false);
        }
    });

    if (navBackBtn) navBackBtn.addEventListener('click', () => history.back());
    if (navForwardBtn) navForwardBtn.addEventListener('click', () => history.forward());

    closeButtons.forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal'))));
    formPhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) { const reader = new FileReader(); reader.onload = (event) => { formPhotoPreview.src = event.target.result; }; reader.readAsDataURL(file); }
    });
    contentBody.addEventListener('click', (e) => {
        const targetButton = e.target.closest('button');
        if (!targetButton) return;
        const { action, nid, name } = targetButton.dataset;
        switch (action) {
            case 'open-monitoring': openMonitoringDashboard(); break;
            case 'open-recap': openRecapModal(); break;
            case 'add-employee': openEmployeeForm(); break;
            case 'edit-employee': openEmployeeForm(employees.find(e => e.nid === nid)); break;
            case 'delete-employee':
                if (confirm(`Yakin ingin menghapus karyawan dengan NID ${nid}?`)) { employees = employees.filter(e => e.nid !== nid); saveEmployees(); navigateTo('HUMAN RESOURCE PERFORMANCE'); }
                break;
            case 'delete-all':
                if (confirm("Lanjutkan menghapus semua daftar karyawan?")) {
                    employees = [];
                    saveEmployees();
                    alert("Semua data karyawan berhasil dihapus.");
                    const tableWrapper = document.getElementById('employee-table-wrapper');
                    if (tableWrapper) {
                        tableWrapper.innerHTML = '';
                        document.getElementById('btn-show-list').click();
                    }
                }
                break;
            case 'download-barcode': downloadBarcode(nid, name); break;
            case 'manage-companies': manageCompanies(); break;
            case 'download-template': downloadExcelTemplate(); break;
            case 'open-schedule-manager': openShiftScheduleManager(); break;
            case 'toggle-notepad': toggleNotepad(); break;
        }
    });

    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openEditProfileModal();
        });
    }

    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    if (saveScheduleBtn) { saveScheduleBtn.addEventListener('click', () => { document.querySelectorAll('.schedule-select').forEach(select => { const { date, regu } = select.dataset; if (!monthlySchedule[date]) monthlySchedule[date] = {}; monthlySchedule[date][regu] = select.value; }); saveSchedule(); alert('Jadwal berhasil disimpan!'); closeModal(shiftScheduleModal); }); }

    const openShiftTimesBtn = document.getElementById('open-shift-times-btn');
    if (openShiftTimesBtn) { openShiftTimesBtn.addEventListener('click', openShiftTimesManager); }

    const shiftTimesForm = document.getElementById('shift-times-form');
    if (shiftTimesForm) { shiftTimesForm.addEventListener('submit', (e) => { e.preventDefault(); ['Pagi', 'Sore', 'Malam', 'Daytime'].forEach(shift => { const name = shift.toLowerCase(); shiftRules[shift].start = { hour: parseInt(document.getElementById(`${name}-start-hour`).value), minute: parseInt(document.getElementById(`${name}-start-minute`).value) }; shiftRules[shift].end = { hour: parseInt(document.getElementById(`${name}-end-hour`).value), minute: parseInt(document.getElementById(`${name}-end-minute`).value) }; }); saveShiftRules(); alert('Jam kerja berhasil disimpan!'); closeModal(shiftTimesModal); }); }

    if (downloadRecapBtn) downloadRecapBtn.addEventListener('click', downloadRecapExcel);
    if (clearRecapBtn) clearRecapBtn.addEventListener('click', clearRecapData);
    if (toggleFullscreenBtn) toggleFullscreenBtn.addEventListener('click', toggleFullscreen);

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('icon-spin');
            refreshBtn.disabled = true;
            setTimeout(() => {
                navigateTo(currentPageName, false);
                icon.classList.remove('icon-spin');
                refreshBtn.disabled = false;
            }, 1000);
        });
    }

    if (employeeForm) employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
    if (scanButton) scanButton.addEventListener('click', processScan);
    if (nidScannerInput) nidScannerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processScan(); });
    if (monitoringFooter) monitoringFooter.addEventListener('click', (e) => { const editButton = e.target.closest('.k3-edit-btn'); if (editButton) { const targetId = editButton.dataset.target; const pElement = document.getElementById(targetId); const newValue = prompt(`Masukkan nilai baru untuk "${pElement.previousElementSibling.textContent}":`, pElement.textContent); if (newValue !== null && newValue.trim() !== "") { pElement.textContent = newValue.trim().toUpperCase(); saveK3Stats(); } } });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) { logoutBtn.addEventListener('click', () => { sessionStorage.clear(); alert("Anda telah berhasil logout."); window.location.href = 'login.html'; }); }

    // INISIALISASI APLIKASI
    loadData();
    history.replaceState({ page: 'DASHBOARD' }, '', '#dashboard');
    navigateTo('DASHBOARD', false);
    loadUserProfile();
    setupEditProfileListeners();
});
