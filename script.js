/* Reset dan Pengaturan Dasar */
* {
    margin: 1;
    padding: 1;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
body {
    background-color: #f4f6f9;
    color: #334155;
    line-height: 1.5;
}
.container {
    display: flex;
    min-height: 100vh;
}
/* --- Sidebar --- */
.sidebar {
    width: 260px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto; /* Memungkinkan konten di dalam sidebar untuk digulir jika terlalu panjang */
    background: linear-gradient(180deg, #3469a4 0%, #1a3b5d 100%);
    color: #e0e0e0;
    padding: 15px;
    box-shadow: 3px 0 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.sidebar .logo {
    text-align: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.sidebar .logo-img {
    width: 150px;
    height: auto;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 2px solid #3b82f6;
}
.sidebar .logo h1 {
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 5px;
}
.sidebar .logo p {
    font-size: 11px;
    color: #a9c1d9;
    font-weight: 300;
}
.sidebar .menu {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.sidebar .menu ul {
    list-style: none;
    margin-top: 0;
}
.sidebar .menu ul li a {
    display: block;
    padding: 10px 15px;
    color: #e0e0e0;
    text-decoration: none;
    border-radius: 6px;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    border-left: 3px solid transparent;
}
.sidebar .menu ul li a:hover {
    background: rgba(26, 59, 93, 0.7);
    color: #ffffff;
    border-left: 3px solid #4ade80;
}
.sidebar .menu ul li a.active {
    background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
    color: #0d2847;
    font-weight: 600;
    border-left: 3px solid #16a34a;
}
.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 15px 10px;
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
#logout-btn {
    width: 85%;
    margin: 15px auto;
    display: block;
    background: #dc2626;
    color: white;
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
}
/* --- Main Content --- */
.main-content {
    flex: 1;
    margin-left: 260px;
    padding: 25px;
    background: #ffffff;
    position: relative;
    z-index: 1;
}
.main-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('images/background-dashboard.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    opacity: 0.2;
    z-index: -1;
}
.content-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #eef2f7;
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}
.content-header h2 {
    color: #0d2847;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
}
.header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}
.nav-buttons {
    display: flex;
    gap: 5px;
}
.btn-nav {
    background-color: #e2e8f0;
    color: #475569;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}
.btn-nav:hover {
    background-color: #cbd5e1;
    color: #1e293b;
}
.btn-nav:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}
.btn-primary, .btn-secondary, .btn-success, .btn-delete, .btn-danger-outline {
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
    line-height: 1.2;
}
.btn-primary {
    background: linear-gradient(135deg, #1a3b5d 0%, #2c5382 100%);
    color: white;
}
.btn-secondary {
    background-color: #64748b;
    color: white;
}
.btn-success {
    background-color: #16a34a;
    color: white;
}
.btn-delete {
    background: #dc2626;
    color: white;
}
.btn-danger-outline {
    background: none;
    border: 1px solid #dc2626;
    color: #dc2626;
    padding: 8px 16px;
}
/* ===== TABEL KARYAWAN ===== */
.action-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
    background: #f8fafc;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.employee-table-container {
    overflow: auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    margin-top: 15px;
    border: 1px solid #e2e8f0;
}
.employee-table {
    width: 100%;
    border-collapse: collapse;
}
.employee-table thead {
    position: sticky;
    top: 0;
    background: #e2e8f0;
    z-index: 10;
}
.employee-table th,
.employee-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    font-size: 13px;
}
.employee-table th {
    color: #475569;
    text-transform: uppercase;
    font-weight: 600;
}
.employee-table td {
    color: #334155;
    font-weight: 500;
}
.employee-table tr:hover td {
    background-color: #f1f5f9;
}
.employee-table .actions {
    display: flex;
    gap: 8px;
    justify-content: center;
}
.btn-edit, .btn-delete-action, .btn-barcode {
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.btn-edit { background: #f59e0b; }
.btn-delete-action { background: #dc2626; }
.btn-barcode { background: #8b5cf6; }
.regu-group {
    margin-bottom: 20px;
}
.regu-header {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    padding-bottom: 8px;
    margin-bottom: 10px;
    border-bottom: 2px solid #cbd5e1;
}
/* Style untuk Halaman Equipment Data */
.equipment-options {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
}
.equipment-btn {
    flex: 1;
    padding: 20px;
    font-size: 18px;
    font-weight: 600;
    border: 2px solid #0d2847;
    background-color: #ffffff;
    color: #0d2847;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-transform: uppercase;
    transition: all 0.3s ease;
}
.equipment-btn:hover, .equipment-btn.active {
    background-color: #0d2847;
    color: #ffffff;
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
}
.equipment-content-display {
    padding: 20px;
    background-color: #f8fafc;
    border-radius: 8px;
    min-height: 30vh;
    border: 1px solid #e2e8f0;
}
.maintenance-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 15px;
    background-color: #eef2f7;
    border-radius: 8px;
    margin-bottom: 15px;
}
.maintenance-btn {
    flex-grow: 1;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid #94a3b8;
    background-color: #ffffff;
    color: #475569;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s ease;
}
.maintenance-btn:hover, .maintenance-btn.active {
    background-color: #1a3b5d;
    color: #ffffff;
    border-color: #1a3b5d;
}
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    padding: 1vh 1vw;
    backdrop-filter: blur(3px);
}
.modal-content {
    position: relative;
    margin: auto;
    max-width: 100%;
}
.modal-content.form-modal {
    max-width: 450px;
    background-color: #1a3b5d;
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin: 5vh auto;
}
.form-modal h3 {
    color: #ffffff;
    margin-bottom: 15px;
    text-align: center;
    font-size: 20px;
    border-bottom: 1px solid #2c5382;
    padding-bottom: 10px;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #a9c1d9;
    font-size: 13px;
}
.form-group input, .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #3b82f6;
    border-radius: 4px;
    font-size: 14px;
    background-color: #0d2847;
    color: white;
}
#form-photo-preview {
    width: 80px;
    height: 100px;
    object-fit: cover;
    border: 1px solid #3b82f6;
    border-radius: 4px;
    display: block;
    margin-top: 8px;
}
#save-button {
    width: 100%;
    padding: 10px;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
}
/* --- Dasbor Monitoring & Rekapitulasi --- */
.modal-xl .modal-content {
    background: linear-gradient(135deg, #1d5ea8 0%, #1a3b5d 100%);
    border-radius: 8px;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-height: 97vh;
    width: 100%;
    max-width: 1800px;
    margin: auto;
    overflow-y: auto;
}
.monitoring-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    flex-wrap: wrap;
    gap: 10px;
}
.monitoring-header h3 { margin: 0; font-size: 18px; }
.header-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 5;
    font-size: 13px;
}
.header-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}
.monitoring-body { display: flex; flex-direction: column; gap: 15px; }
.monitoring-details { display: flex; gap: 15px; align-items: center; }
.details-company-logo img { width: 60px; height: 60px; object-fit: contain; }
.details-header { flex: 1; text-align: center; }
.details-header span { font-size: 11px; color: #a9c1d9; }
.details-header p { font-size: 16px; font-weight: 600; }
.details-photo-frame { flex-shrink: 0; }
.details-photo-frame img { width: 200px; height: 200px; object-fit: cover; border-radius: 8px; }
.monitoring-info-stats { display: flex; gap: 15px; flex-wrap: wrap; }
.info-grid, .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; flex: 1; }
.info-item, .stat-box { padding: 10px; border-radius: 8px; text-align: center; background: rgba(255,255,255,0.05); }
.info-item span, .stat-box span { display: block; font-size: 12px; margin-bottom: 3px; }
.info-item p, .stat-box p { font-size: 20px; font-weight: 600; }
.scan-input-area { display: flex; gap: 8px; margin-bottom: 15px; }
.scan-input-area input { flex: 1; padding: 10px; border: none; border-radius: 4px; font-size: 14px; background-color: #d1d5db; color: #333; }
.scan-input-area button { padding: 10px 15px; background: #4ade80; color: #0d2847; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 14px; }
.monitoring-table { width: 100%; border-collapse: collapse; }
.monitoring-table th, .monitoring-table td { padding: 10px; text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 13px; }
.monitoring-table th { font-size: 11px; text-transform: uppercase; }
.monitoring-table td { color: #ffffff; }
.k3-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
.k3-box { padding: 15px; border-radius: 8px; text-align: center; position: relative; }
.k3-box span { display: block; font-size: 13px; font-weight: 600; margin-bottom: 3px; }
.k3-box p { font-size: 24px; font-weight: 700; }
.k3-box.yellow { background: #ffc107; color: #0d2847; }
.k3-box.red { background: #dc3545; color: #ffffff; }
.k3-box.blue { background: #0dcaf0; color: #ffffff; }
.k3-box.orange { background: #fd7e14; color: #ffffff; }
[data-status="masuk"] { color: #22c55e; font-weight: 600; }
[data-status="keluar"] { color: #ef4444; font-weight: 600; }
.log-keterangan { font-weight: bold; color: #f59e0b; }
.schedule-controls { display: flex; gap: 8px; align-items: center; }
.schedule-controls select { padding: 6px; border-radius: 4px; border: 1px solid #ccc; font-size: 13px; }
.schedule-table-container { overflow: auto; background-color: #ffffff; padding: 8px; border-radius: 8px; margin-top: 10px; max-height: 60vh; }
.schedule-table { width: 100%; border-collapse: collapse; color: #333; }
.schedule-table th, .schedule-table td { border: 1px solid #ddd; padding: 6px; text-align: center; min-width: 100px; font-size: 12px; }
.schedule-table th { background-color: #f2f2f2; font-weight: 600; position: sticky; top: 0; z-index: 1; }
.schedule-table td.date-cell { font-weight: bold; background-color: #f8f9fa; position: sticky; left: 0; z-index: 1;}
.schedule-select { width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px; }
.schedule-select option[value="Pagi"] { background-color: #a7f3d0; }
.schedule-select option[value="Sore"] { background-color: #fde68a; }
.schedule-select option[value="Malam"] { background-color: #a5b4fc; }
.schedule-select option[value="Libur"] { background-color: #fecaca; }
.modal-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10000;
    background: #0d2847;
    padding: 0;
}
.modal-fullscreen .modal-content {
    width: 100%;
    height: 100%;
    max-width: none;
    margin: 0;
    border-radius: 0;
}
@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
.k3-box span {
    animation: blink 1.5s infinite;
}
.modal-xl .modal-content .details-company-logo img {
    width: 300px !important;
    height: 80px !important;
    object-fit: contain;
    border-radius: 4px;
}
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #eef2f7;
}
.dashboard-header h2 {
    color: #0d2847;
    font-size: 24px;
    margin: 0;
}
.summary-container {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 15px;
    margin: 15px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.summary-placeholder {
    color: #64748b;
    font-size: 16px;
    text-align: center;
}
.summary-content {
    text-align: center;
    width: 100%;
}
.summary-content h3 {
    color: #0d2847;
    margin-bottom: 15px;
    font-size: 20px;
}
.summary-content p {
    font-size: 16px;
    margin: 8px 0;
    color: #334155;
}
.summary-content strong {
    color: #1a3b5d;
}
.options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
    margin-top: 15px;
}
.option-btn {
    padding: 12px;
    border: none;
    border-radius: 6px;
    background: #e2e8f0;
    color: #334155;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    font-weight: 600;
}
.option-btn:hover {
    background: #1a3b5d;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
#optionsModal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    padding: 1vh 1vw;
    backdrop-filter: blur(3px);
}
#optionsModal .modal-content {
    max-width: 500px;
    margin: auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    color: #334155;
}
.hr-dashboard-container {
    width: 100%;
    padding: 0;
    background-color: transparent;
    border: none;
    box-shadow: none;
}
.hr-dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 15px;
}
.kpi-card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 15px;
    border: 1px solid #eef2f7;
}
.kpi-card .icon {
    font-size: 24px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
}
.kpi-card .icon.total-emp { background-color: #3B82F6; }
.kpi-card .icon.active-today { background-color: #10B981; }
.kpi-card .icon.safety-score { background-color: #F59E0B; }
.kpi-card .info .number {
    font-size: 24px;
    font-weight: 700;
    color: #1E293B;
}
.kpi-card .info .label {
    font-size: 13px;
    color: #64748B;
}
.kpi-card .icon.active-shift {
    background-color: #6366F1;
}
.chart-wrapper {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eef2f7;
}
.chart-wrapper h3 {
    font-size: 16px;
    color: #1E293B;
    margin-bottom: 15px;
}
.chart-container {
    position: relative;
    height: 250px;
    width: 100%;
}
.hr-main-content-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 15px;
    margin-top: 15px;
}
.activity-feed, .video-container {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #eef2f7;
}
.activity-feed h3, .video-container h3 {
    font-size: 16px;
    color: #1E293B;
    margin-bottom: 15px;
    border-bottom: 1px solid #eef2f7;
    padding-bottom: 10px;
}
.activity-feed ul {
    list-style: none;
    max-height: 300px;
    overflow-y: auto;
}
.activity-feed li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eef2f7;
}
.activity-feed li:last-child {
    border-bottom: none;
}
.activity-feed .detail .name {
    font-weight: 600;
    color: #334155;
    font-size: 13px;
}
.activity-feed .detail .time {
    font-size: 11px;
    color: #64748B;
}
.activity-feed .status {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 10px;
    font-weight: 600;
}
.status.masuk { background-color: #d1fae5; color: #059669; }
.status.keluar { background-color: #fee2e2; color: #dc2626; }
.video-wrapper {
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: #000;
    border-radius: 8px;
    overflow: hidden;
}
.video-wrapper video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
#hr-fullscreen-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 10;
    background-color: #e2e8f0;
    color: #475569;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}
.hr-dashboard-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 5000;
    background-color: #f4f6f9;
    padding: 20px;
    overflow-y: auto;
}
.activity-feed .status-wrapper {
    display: flex;
    gap: 5px;
    align-items: center;
}
.activity-feed .keterangan-status {
    background-color: #fde68a;
    color: #b45309;
}
.k3-stats-dashboard {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eef2f7;
}
.k3-stats-dashboard h3 {
    font-size: 16px;
    color: #1E293B;
    margin-bottom: 15px;
}
.k3-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}
.k3-card {
    color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}
.k3-card span {
    display: block;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 5px;
    text-transform: uppercase;
}
.k3-card p {
    font-size: 20px;
    font-weight: 700;
}
.bottom-widgets {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}
.bottom-widgets > .k3-stats-dashboard {
    flex: 1;
}
.bottom-widgets > .chart-wrapper {
    flex: 0 0 300px;
}
.k3-card.yellow { background-color: #f59e0b; }
.k3-card.red { background-color: #ef4444; }
.k3-card.blue { background-color: #3b82f6; }
.k3-card.orange { background-color: #f97316; }
.marquee-container {
    width: 100%;
    background-color: #fde047;
    color: #0e0d0d;
    padding: 10px 0;
    margin-bottom: 15px;
    border-radius: 8px;
    overflow: hidden;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(6, 170, 235, 0.1);
}
.marquee-container p {
    display: inline-block;
    padding-left: 100%;
    animation: scroll-left 30s linear infinite;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 16px;
}
@keyframes scroll-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
}
.profile-link {
    text-decoration: none;
    display: block;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}
.profile-link:hover {
    background-color: rgba(255, 255, 255, 0.05);
}
.profile-picture-section {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}
#profile-pic-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e2e8f0;
}
.picture-buttons {
    display: flex;
    gap: 8px;
}
.btn-delete-outline {
    background: none;
    border: 1px solid #dc2626;
    color: #dc2626;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
}
.form-actions {
    margin-top: 20px;
    text-align: right;
}
#save-profile-btn {
    background-color: #0d2847;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
}
.hidden {
    display: none !important;
}
/* ===== STYLE KALKULATOR CO-FIRING ===== */
.kalkulator-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid #e2e8f0;
}
.kalkulator-container h1 {
    text-align: center;
    color: #0d2847;
    margin-bottom: 8px;
    font-size: 24px;
}
.kalkulator-container p.deskripsi {
    text-align: center;
    color: #64748b;
    margin-bottom: 20px;
    font-size: 14px;
}
.kalkulator-container .form-section {
    margin-bottom: 1.2em;
    border-top: 1px solid #eef2f7;
    padding-top: 0.8em;
}
.kalkulator-container .form-section h3 {
    color: #1a3b5d;
    font-size: 16px;
    margin-bottom: 1em;
}
.kalkulator-container .input-group {
    margin-bottom: 1em;
}
.kalkulator-container .input-group label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #475569;
    font-size: 13px;
}
.kalkulator-container .input-group input, .kalkulator-container .input-group select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-size: 14px;
    background-color: #f8fafc;
}
.kalkulator-container .input-group input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}
.hasil-container {
    padding: 20px;
    background-color: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}
.hasil-container h2 {
    text-align: center;
    margin-bottom: 15px;
    font-size: 20px;
}
.hasil-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eef2f7;
    font-size: 14px;
}
.hasil-item:last-child {
    border-bottom: none;
}
.hasil-item p {
    margin: 0;
    font-weight: 600;
    color: #334155;
}
.hasil-item span {
    font-size: 1.2rem;
    font-weight: 700;
    color: #0d2847;
}
.hasil-item.highlight {
    background-color: #e6f7f0;
    padding: 8px 12px;
    margin: 5px -12px;
    border-radius: 6px;
}
.hasil-item.highlight p {
    color: #065f46;
}
.hasil-item.highlight span {
    color: #10b981;
}
.parameter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}
#blok-beban-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.blok-beban-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #f8fafc;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}
.blok-beban-item .input-group {
    flex: 1;
    margin-bottom: 0;
}
.blok-beban-item .input-group label {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 3px;
}
.blok-nomor {
    font-weight: 600;
    color: #475569;
    min-width: 40px;
    font-size: 14px;
}
.btn-hapus-blok {
    background-color: #fee2e2;
    color: #ef4444;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    transition: all 0.2s ease;
}
.btn-hapus-blok:hover {
    background-color: #ef4444;
    color: white;
}
.rincian-body {
    padding: 10px;
    background-color: #ffffff;
    color: #334155;
    max-height: 70vh;
    overflow-y: auto;
}
.rincian-section {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}
.rincian-section h4 {
    color: #0d2847;
    margin-bottom: 10px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    font-size: 16px;
}
.rincian-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}
.calc-step {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eef2f7;
    flex-wrap: wrap;
    gap: 8px;
}
.calc-step:last-child {
    border-bottom: none;
}
.calc-step p {
    margin: 0;
    font-size: 12px;
}
.calc-formula, .calc-result {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    font-weight: 600;
    text-align: right;
}
.calc-result {
    color: #16a34a;
    background-color: #e6f7f0;
    padding: 4px 8px;
    border-radius: 4px;
    min-width: 80px;
    text-align: right;
}
.rincian-section.final-results .calc-result {
    color: #0d2847;
    background-color: #e2e8f0;
    font-size: 14px;
}
@media (max-width: 992px) {
    .rincian-grid {
        grid-template-columns: 1fr;
    }
}
.parameter-grid-bahan-bakar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    align-items: end;
}
.pemisah-bahan-bakar {
    border: none;
    border-top: 1px dashed #cbd5e1;
    margin: 15px 0;
}
.unit-selector {
    display: flex;
    gap: 15px;
    padding: 8px;
    margin-bottom: 8px;
}
.unit-option {
    display: flex;
    align-items: center;
    gap: 6px;
}
.unit-option label {
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: #334155;
}
.unit-option input[type="radio"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
}
.submenu-bar {
    display: flex;
    gap: 8px;
    border-bottom: 2px solid #e2e8f0;
    margin-bottom: 20px;
}
.submenu-btn {
    border: none;
    background: none;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border-bottom: 3px solid transparent;
    display: flex;
    align-items: center;
    gap: 6px;
}
.submenu-btn:hover {
    color: #e92b0a;
}
.submenu-btn.active {
    color: #0d2847;
    border-bottom-color: #0d2847;
}
.re-content-section {
    animation: fadeIn 0.5s;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
.notepad-container {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    margin-top: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.notepad-container h4 {
    color: #0d2847;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}
.notepad-textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 14px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    resize: vertical;
    margin-bottom: 10px;
}
.notepad-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}
.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #11d4ba;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(221, 8, 8, 0.15);
    font-size: 14px;
    font-weight: 600;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.5s, bottom 0.5s, visibility 0.5s;
}
.toast.show {
    visibility: visible;
    opacity: 1;
    bottom: 30px;
}
.blinking-info-container {
    background-color: #fde047;
    color: #1e3a8a;
    padding: 10px;
    border-radius: 10px;
    margin-top: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}
.blinking-info-container .fas {
    font-size: 1.8em;
}
.blinking-text {
    font-size: 1.2em;
    font-weight: bold;
    animation: blinker 1s linear infinite;
}
@keyframes blinker {
    50% { opacity: 0; }
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.icon-spin {
    animation: spin 1s linear infinite;
}
.btn-secondary {
    transition: all 0.2s ease;
}
.btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
/* ===== TOOLTIP BARU UNTUK KALKULATOR ===== */
.tooltip-container {
    position: relative;
    display: inline-block;
}
.tooltip-container .tooltip-text {
    visibility: hidden;
    width: 250px;
    background-color: #0d2847;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -125px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
}
.tooltip-container .tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #0d2847 transparent transparent transparent;
}
.tooltip-container:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}
.fa-info-circle {
    color: #3b82f6;
    cursor: help;
}

/* Penyesuaian jarak pada menu sidebar */
.sidebar .menu ul li a {
    margin-bottom: 4px;
}
.profile-container {
    padding: 15px 10px;
    margin-top: 10px;
}
.sidebar .logo {
    margin-bottom: 10px;
    padding-bottom: 10px;
}

/* Jarak antar form-section di kalkulator */
.kalkulator-container .form-section {
    margin-bottom: 1.2em;
    padding-top: 0.8em;
}
/* Jarak antar item di hasil kalkulasi */
.hasil-item {
    padding: 8px 0;
}
/* Style untuk menu submenu di Renewable Energy */
.submenu-btn {
    padding: 10px 12px;
    font-size: 13px;
}
/* Style untuk modal form secara umum */
.modal-content.form-modal {
    margin: 5vh auto;
}
/* Styling untuk tombol di Catatan & Log Perubahan */
.catatan-item {
    position: relative;
    padding-right: 120px; /* Memberi ruang untuk tombol */
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: #f9fafc;
}
.catatan-teks {
    font-size: 14px;
    margin-bottom: 5px;
    color: #334155;
}
.catatan-tanggal {
    font-size: 12px;
    color: #64748b;
    font-style: italic;
}
.catatan-actions {
    position: absolute;
    top: 15px;
    right: 10px;
    display: flex;
    gap: 5px;
}
.btn-edit-note, .btn-delete-note {
    font-size: 11px;
    padding: 5px 8px;
    border-radius: 4px;
    font-weight: 600;
}
.btn-edit-note {
    background-color: #f59e0b;
    color: white;
    border: none;
}
.btn-delete-note {
    background-color: #dc2626;
    color: white;
    border: none;
}
/* Gaya untuk sub-menu Master Data */
.action-bar-sub {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    padding: 10px;
    background: #eef2f7;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.table-container {
    overflow-x: auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    border: 1px solid #e2e8f0;
}
.data-table {
    width: 100%;
    border-collapse: collapse;
}
.data-table th, .data-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
}
.data-table th {
    background-color: #f1f5f9;
    color: #475569;
    text-transform: uppercase;
    font-weight: 600;
}
.data-table tr:hover td {
    background-color: #f8fafc;
}
.data-table .actions {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    justify-content: center;
}
.data-table .btn-edit, .data-table .btn-delete {
    padding: 6px 10px;
    font-size: 12px;
}

/* Modal Form untuk Barang */
#itemFormModal .modal-content {
    max-width: 500px;
}
#save-item-button {
    background-color: #22c55e;
}
/* Perubahan pada Modal Detail Barang */
#itemDetailModal .modal-content {
    background-color: #1a3b5d; /* Warna latar belakang modal yang lebih gelap */
    color: #ffffff; /* Warna teks utama menjadi putih */
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

#item-detail-title {
    color: #ffffff;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #3b82f6; /* Garis bawah biru untuk judul */
    padding-bottom: 10px;
}

.detail-section h4 {
    color: #4ade80; /* Warna hijau cerah untuk sub-judul */
    font-size: 18px;
    margin-top: 25px;
    margin-bottom: 10px;
}

.detail-section p {
    margin: 5px 0;
    font-size: 14px;
    color: #e0e0e0; /* Perbaikan: Mengatur warna teks data menjadi lebih terang */
}

.detail-section strong {
    color: #a9c1d9; /* Perbaikan: Mengatur warna label menjadi abu-abu terang */
    display: inline-block;
    min-width: 150px; /* Jarak yang konsisten antar label */
}

/* Gaya untuk tabel di dalam modal detail */
#itemDetailModal .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

#itemDetailModal .data-table th,
#itemDetailModal .data-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid rgba(238, 235, 235, 0.937); /* Garis pemisah yang lebih halus */
    font-size: 13px;
    color: #e0e0e0;
}

#itemDetailModal .data-table th {
    background-color: rgba(255, 255, 255, 0.05); /* Latar belakang header tabel */
    color: #a9c1d9;
    text-transform: uppercase;
}

#itemDetailModal .data-table tr:hover td {
    background-color: rgba(255, 255, 255, 0.03); /* Efek hover ringan */
}

#item-detail-content .log-table-wrapper > p {
    color: #a9c1d9 !important;
    font-style: italic;
    text-align: center;
    padding: 20px;
}
/* Gaya untuk tombol close (X) pada modal */
.modal-content .close-button {
    color: #ffffff; /* Mengubah warna ikon X menjadi putih terang */
    opacity: 1; /* Memastikan opacity penuh agar tidak transparan */
    font-size: 30px; /* Membuat ukuran X sedikit lebih besar */
    font-weight: bold; /* Membuat X lebih tebal */
    text-shadow: none;
    position: absolute; /* Memungkinkan penempatan yang akurat */
    right: 20px; /* Jarak dari sisi kanan */
    top: 15px; /* Jarak dari sisi atas */
    cursor: pointer;
}

.modal-content .close-button:hover,
.modal-content .close-button:focus {
    color: #4ade80; /* Mengubah warna X saat di-hover/fokus */
    opacity: 0.8;
}
.input-with-button {
    display: flex;
    gap: 8px;
}
.input-with-button input {
    flex: 1;
}
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f4f8; /* Warna latar belakang yang lebih lembut */
    color: #334155; /* Warna teks utama yang gelap dan profesional */
}

.container {
    background-color: #ffffff; /* Latar belakang kontainer utama putih bersih */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Tambahkan bayangan lembut */
    border-radius: 12px;
}

.sidebar {
    background: linear-gradient(180deg, #0d2847 0%, #1a3a60 100%); /* Gradasi vertikal yang elegan */
    color: #e2e8f0;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
}

.main-content {
    background-color: #f0f4f8;
}
/* Perbaiki tombol agar lebih seragam dan modern */
.btn-primary, .btn-secondary, .btn-success, .btn-delete {
    padding: 10px 18px;
    border: none;
    border-radius: 8px; /* Tepi yang lebih membulat */
    font-weight: 600; /* Teks tebal untuk visibilitas */
    cursor: pointer;
    transition: all 0.3s ease; /* Transisi halus saat interaksi */
    text-transform: uppercase;
    font-size: 14px;
}

.btn-primary {
    background-color: #0d2847;
    color: #fff;
}

.btn-primary:hover {
    background-color: #1a3a60;
}

/* Perbaiki gaya tabel */
.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden; /* Penting untuk border-radius */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-table th, .data-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.data-table th {
    background-color: #eef2f6;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
}

/* Perbaiki form input */
.input-group input, .input-group select, .input-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 1em;
    background-color: #f8fafc;
    transition: border-color 0.3s ease;
}

.input-group input:focus, .input-group select:focus, .input-group textarea:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
/* Perbaiki bilah navigasi */
.sidebar .menu a {
    padding: 12px 20px;
    border-radius: 8px;
    margin: 8px 0;
    transition: background-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    gap: 12px;
}

.sidebar .menu a:hover,
.sidebar .menu a.active {
    background-color: rgba(255, 255, 255, 0.1); /* Latar belakang transparan saat hover */
    color: #fff;
    font-weight: 600;
}

/* Perbaiki card di dasbor */
.kpi-card {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 5px solid #3b82f6; /* Tambahkan aksen warna */
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
