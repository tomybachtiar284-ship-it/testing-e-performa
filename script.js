// ===============================================
//           KODE FINAL SCRIPT.JS (LENGKAP)
// ===============================================
document.addEventListener('DOMContentLoaded', function () {
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
    
    // --- STATE APLIKASI ---
    let employees = [];
    let companies = [];
    let recapLog = [];
    let monitoringLog = [];
    let monthlySchedule = {};
    let shiftRules = {};
    let clockInterval = null;
    let isFullscreen = false;
    const lateSound = new Audio('sounds/terlambat.mp3');
    const scanSound = new Audio('sounds/masuk.mp3');
    const companyLogos = { "PT PLN NPS": "images/imagespln_nps.png", "PT MKP": "images/imagesmkp.png", "MKP IC": "images/imagesmkp_ic.png", "SECURITY": "images/scrt.png", "Visitor": "images/visitor.png" };

    // --- FUNGSI MANAJEMEN DATA ---
    function saveEmployees() { localStorage.setItem('employees', JSON.stringify(employees)); }
    function saveRecapLog() { localStorage.setItem('recapLog', JSON.stringify(recapLog)); }
    function saveCompanies() { localStorage.setItem('companies', JSON.stringify(companies)); }
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
    function renderCompanyOptions() { const companySelect = document.getElementById('form-company'); if(companySelect) { companySelect.innerHTML = '<option value="">Pilih Company</option>' + companies.map(company => `<option value="${company}">${company}</option>`).join(''); } }
    
    function renderEmployeeManagementPage() {
        contentBody.innerHTML = `
            <div class="action-bar">
                <button class="btn-secondary" data-action="open-monitoring"><i class="fas fa-chart-line"></i> Buka Monitoring</button>
                <button class="btn-success" data-action="open-recap"><i class="fas fa-list"></i> Rekapitulasi</button>
                <button id="btn-show-list" class="btn-primary" style="background: #0d2847; border-color: #fff;"><i class="fas fa-list-alt"></i> Manajemen Karyawan</button>
                <button class="btn-primary" data-action="open-schedule-manager"><i class="fas fa-calendar-alt"></i> Atur Jadwal Shift</button>
            </div>
            <div id="employee-table-wrapper" style="display: none;"></div>
        `;
        document.getElementById('btn-show-list').addEventListener('click', () => {
             const tableWrapper = document.getElementById('employee-table-wrapper');
            if (tableWrapper.style.display === 'none' || tableWrapper.innerHTML === '') {
                tableWrapper.style.display = 'block';
                const groupedEmployees = employees.reduce((acc, emp) => { (acc[emp.regu || 'Daytime'] = acc[emp.regu || 'Daytime'] || []).push(emp); return acc; }, {});
                
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
                        if (groupedEmployees[regu]) {
                            contentHTML += `
                                <div class="regu-group">
                                    <h3 class="regu-header">Kelompok: ${regu}</h3>
                                    <div class="employee-table-container">
                                        <table class="employee-table">
                                            <thead><tr><th>NID</th><th>Nama</th><th>Jobtitle</th><th>Company</th><th>Aksi</th></tr></thead>
                                            <tbody>
                                                ${groupedEmployees[regu].map(emp => `<tr><td>${emp.nid}</td><td>${emp.name}</td><td>${emp.position}</td><td>${emp.company}</td><td class="actions"><button class="btn-edit" data-action="edit-employee" data-nid="${emp.nid}"><i class="fas fa-edit"></i> Edit</button><button class="btn-delete" data-action="delete-employee" data-nid="${emp.nid}"><i class="fas fa-trash"></i> Hapus</button><button class="btn-barcode" data-action="download-barcode" data-nid="${emp.nid}" data-name="${emp.name}"><i class="fas fa-qrcode"></i> Barcode</button></td></tr>`).join('')}
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
                if(excelImporter) excelImporter.addEventListener('change', handleExcelImport);
            } else {
                tableWrapper.style.display = 'none';
            }
        });
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
    function updateClock() { if(clockElement) clockElement.textContent = new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\./g, ':'); }
    function updateEmployeeDetails(employee) { if(detailsPhoto) { detailsPhoto.src = employee.photoUrl || `https://placehold.co/300x400/cccccc/333?text=${employee.name.split(' ')[0]}`; detailsName.textContent = employee.name; detailsNid.textContent = employee.nid; detailsPosition.textContent = employee.position; detailsStatus.textContent = employee.inOutStatus.toUpperCase(); detailsCompanyLogoImg.src = companyLogos[employee.company] || 'https://placehold.co/100x100/ffffff/333?text=Logo'; } }
    function updateManpowerStats() { if(statPlnNps) { const count = companies.reduce((acc, company) => ({ ...acc, [company]: 0 }), {}); employees.forEach(emp => { if (emp.inOutStatus === 'Masuk' && count[emp.company] !== undefined) count[emp.company]++; }); statPlnNps.textContent = count["PT PLN NPS"] || 0; statMkp.textContent = count["PT MKP"] || 0; statMkpIc.textContent = count["PT MKP IC"] || 0; statSecurity.textContent = count["Security"] || 0; statVisitor.textContent = count["Visitor"] || 0; } }
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
    function openMonitoringDashboard() { openModal(monitoringModal); updateClock(); updateManpowerStats(); if (clockInterval) clearInterval(clockInterval); clockInterval = setInterval(updateClock, 1000); if(nidScannerInput) nidScannerInput.focus(); }
    function renderRecapTable() { if (recapLogBody) { recapLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); recapLogBody.innerHTML = recapLog.map(log => `<tr><td>${new Date(log.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })}</td><td>${log.name}</td><td>${log.nid}</td><td>${log.position}</td><td>${log.company}</td><td>${log.status}</td><td class="log-keterangan">${log.keterangan || '-'}</td></tr>`).join(''); } }
    function openRecapModal() { renderRecapTable(); openModal(recapModal); }
    function downloadRecapExcel() { if (recapLog.length === 0) return; const dataForExcel = recapLog.map(log => ({ Waktu: new Date(log.timestamp).toLocaleString('id-ID'), Nama: log.name, NID: log.nid, Jobtitle: log.position, Company: log.company, Status: log.status, Keterangan: log.keterangan || '-' })); const ws = XLSX.utils.json_to_sheet(dataForExcel); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Rekap Aktivitas"); XLSX.writeFile(wb, `Rekap_Aktivitas_${new Date().toISOString().slice(0, 10)}.xlsx`); }
    function clearRecapData() { if ((recapLog.length > 0 || monitoringLog.length > 0) && confirm("Yakin ingin menghapus SEMUA data rekapitulasi DAN log monitoring?")) { recapLog = []; saveRecapLog(); monitoringLog = []; if (monitoringLogBody) monitoringLogBody.innerHTML = ''; localStorage.removeItem('monitoringLog'); employees.forEach(emp => emp.inOutStatus = 'Keluar'); saveEmployees(); navigateTo('HUMAN RESOURCE PERFORMANCE'); alert("Data rekapitulasi dan log monitoring telah dihapus."); } }
    function toggleFullscreen() { isFullscreen = !isFullscreen; if(monitoringModal) { monitoringModal.classList.toggle('modal-fullscreen', isFullscreen); toggleFullscreenBtn.innerHTML = isFullscreen ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>'; } }
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
    
    // --- NAVIGASI UTAMA ---
    function navigateTo(pageName) {
        pageTitle.textContent = pageName;
        menuLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar .menu a[data-page="${pageName}"]`);
        if (activeLink) activeLink.classList.add('active');

        if (pageName === 'DASHBOARD') {
            contentBody.innerHTML = `
                <div class="dashboard-header">
                    <h2>Selamat Datang di Dashboard PERFORMA</h2>
                    <button id="show-options-btn" class="btn-primary">Pilih Opsi Dashboard</button>
                </div>
                <div id="summary-container" class="summary-container">
                    <p class="summary-placeholder">Pilih opsi di atas untuk melihat summary.</p>
                </div>
                <div id="optionsModal" class="modal">
                    <div class="modal-content form-modal">
                        <span class="close-button">&times;</span>
                        <h3>Pilih Opsi Dashboard</h3>
                        <div class="options-grid">
                            ${Array.from(menuLinks).filter(link => link.dataset.page !== 'DASHBOARD').map(link => `<button class="option-btn" data-summary="${link.dataset.page.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}">${link.dataset.page}</button>`).join('')}
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
                                    <div class="k3-stats-dashboard">
                                        <h3><i class="fas fa-hard-hat"></i> Data Statistik K3</h3>
                                        <div class="k3-grid">
                                            <div class="k3-card yellow"><span>Jam Kerja Hilang</span><p id="d-k3-jam-hilang">0</p></div>
                                            <div class="k3-card red"><span>Kecelakaan Berat & Ringan</span><p id="d-k3-kecelakaan">NIHIL</p></div>
                                            <div class="k3-card blue"><span>Jam Kerja Bulan Lalu</span><p id="d-k3-jam-lalu">0</p></div>
                                            <div class="k3-card orange"><span>Total Jam Kerja</span><p id="d-k3-jam-total">0</p></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="video-container">
                                    <h3><i class="fas fa-video"></i> PLTU AMPANA </h3>
                                    <div class="video-wrapper"><video src="videos/PLTUAMPANA.mp4" autoplay loop muted playsinline>Browser Anda tidak mendukung tag video.</video></div>
                                </div>
                            </div>
                        </div>`;
                        break;
                    default:
                        const title = summaryType.replace(/-/g, ' ').toUpperCase();
                        content = `<div class="summary-content"><h3>${title}</h3><p>Data untuk modul ini belum tersedia.</p></div>`;
                }
                container.innerHTML = content;
                closeModalFunc();

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
                        if(jamHilangEl) jamHilangEl.textContent = savedK3Stats['k3-jam-hilang'] || '0';
                        if(kecelakaanEl) kecelakaanEl.textContent = savedK3Stats['k3-kecelakaan'] || 'NIHIL';
                        if(jamLaluEl) jamLaluEl.textContent = savedK3Stats['k3-jam-lalu'] || '0';
                        if(jamTotalEl) jamTotalEl.textContent = savedK3Stats['k3-jam-total'] || '0';
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
        } else {
            contentBody.innerHTML = `<p>Konten untuk halaman <strong>${pageName}</strong> sedang dalam pengembangan.</p>`;
        }
    }
    
    // --- EVENT LISTENERS GLOBAL ---
    menuLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.dataset.page); }); });
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
                    if(tableWrapper) {
                        tableWrapper.innerHTML = '';
                        document.getElementById('btn-show-list').click();
                    }
                }
                break;
            case 'download-barcode': downloadBarcode(nid, name); break;
            case 'manage-companies': manageCompanies(); break;
            case 'download-template': downloadExcelTemplate(); break;
            case 'open-schedule-manager': openShiftScheduleManager(); break;
        }
    });

    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    if(saveScheduleBtn) { saveScheduleBtn.addEventListener('click', () => { document.querySelectorAll('.schedule-select').forEach(select => { const { date, regu } = select.dataset; if (!monthlySchedule[date]) monthlySchedule[date] = {}; monthlySchedule[date][regu] = select.value; }); saveSchedule(); alert('Jadwal berhasil disimpan!'); closeModal(shiftScheduleModal); }); }
    
    const openShiftTimesBtn = document.getElementById('open-shift-times-btn');
    if(openShiftTimesBtn) { openShiftTimesBtn.addEventListener('click', openShiftTimesManager); }

    const shiftTimesForm = document.getElementById('shift-times-form');
    if(shiftTimesForm) { shiftTimesForm.addEventListener('submit', (e) => { e.preventDefault(); ['Pagi', 'Sore', 'Malam', 'Daytime'].forEach(shift => { const name = shift.toLowerCase(); shiftRules[shift].start = { hour: parseInt(document.getElementById(`${name}-start-hour`).value), minute: parseInt(document.getElementById(`${name}-start-minute`).value) }; shiftRules[shift].end = { hour: parseInt(document.getElementById(`${name}-end-hour`).value), minute: parseInt(document.getElementById(`${name}-end-minute`).value) }; }); saveShiftRules(); alert('Jam kerja berhasil disimpan!'); closeModal(shiftTimesModal); }); }

    if(downloadRecapBtn) downloadRecapBtn.addEventListener('click', downloadRecapExcel);
    if(clearRecapBtn) clearRecapBtn.addEventListener('click', clearRecapData);
    if(toggleFullscreenBtn) toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
    if(refreshBtn) refreshBtn.addEventListener('click', () => location.reload());
    if(employeeForm) employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
    if(scanButton) scanButton.addEventListener('click', processScan);
    if(nidScannerInput) nidScannerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processScan(); });
    if(monitoringFooter) monitoringFooter.addEventListener('click', (e) => { const editButton = e.target.closest('.k3-edit-btn'); if (editButton) { const targetId = editButton.dataset.target; const pElement = document.getElementById(targetId); const newValue = prompt(`Masukkan nilai baru untuk "${pElement.previousElementSibling.textContent}":`, pElement.textContent); if (newValue !== null && newValue.trim() !== "") { pElement.textContent = newValue.trim().toUpperCase(); saveK3Stats(); } } });
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) { logoutBtn.addEventListener('click', () => { sessionStorage.removeItem('statusLogin'); alert("Anda telah berhasil logout."); window.location.href = 'login.html'; }); }

    // INISIALISASI APLIKASI
    loadData();
    navigateTo('DASHBOARD');
});