/**
 * Attendance Database & State Management (LocalStorage synced)
 * Sistem Manajemen Data Presensi & Jadwal Piket - KSPM (Kelompok Studi Pasar Modal)
 * Universitas Jenderal Soedirman
 */

const DB_KEYS = {
  EMPLOYEES: 'kspm_members_v4',
  SCHEDULES: 'kspm_schedules_v4',
  ATTENDANCE: 'kspm_attendance_v4',
  SHIFTS: 'kspm_shifts_v4',
  HOLIDAYS: 'kspm_holidays_v4'
};

// Data Hari Libur Nasional & Kampus Default
const DEFAULT_HOLIDAYS = [
  { id: 'HOL-001', date: '2026-08-17', name: 'Hari Kemerdekaan RI', description: 'Libur Nasional Kemerdekaan Republik Indonesia' },
  { id: 'HOL-002', date: '2026-05-01', name: 'Hari Buruh Internasional', description: 'Libur Nasional Hari Buruh' },
  { id: 'HOL-003', date: '2026-05-28', name: 'Hari Raya Idul Adha', description: 'Libur Nasional Hari Raya Keagamaan' },
  { id: 'HOL-004', date: '2026-09-23', name: 'Dies Natalis Unsoed', description: 'Hari Libur / Perayaan Dies Natalis Kampus' }
];

// Sesi Piket KSPM (07:00 - 12:00 & 12:00 - 18:00, Bebas jam kehadiran minimal 2 jam)
const DEFAULT_SHIFTS = [
  { id: 'shift_pagi', name: 'Sesi Pagi', start: '07:00', end: '12:00', icon: 'sun', minHours: 2, desc: 'Bebas jam kehadiran (Minimal 2 Jam)' },
  { id: 'shift_siang', name: 'Sesi Siang', start: '12:00', end: '18:00', icon: 'cloud', minHours: 2, desc: 'Bebas jam kehadiran (Minimal 2 Jam)' }
];

// Data Departemen / Divisi Resmi KSPM (Sesuai Struktur Organisasi)
const DEFAULT_DEPARTMENTS = [
  'Director & Vice Director',
  'Secretary',
  'Finance',
  'Human Resource Management',
  'Project Management',
  'Research Analyst',
  'Public Relations',
  'Media & Technology'
];

// Data 33 Pengurus & Anggota Resmi KSPM
const DEFAULT_EMPLOYEES = [
  // BPH (Director & Vice Director)
  { id: 'KSPM-001', name: 'Muhammad Adi Nugroho', role: 'Director', dept: 'Director & Vice Director', avatar: 'MN', color: 'from-red-600 to-rose-700', email: 'muhammad.adi.nugroho@unsoed.ac.id', phone: '0812-1001-0001' },
  { id: 'KSPM-002', name: 'Ridha Aulia', role: 'Vice Director', dept: 'Director & Vice Director', avatar: 'RA', color: 'from-rose-600 to-pink-700', email: 'ridha.aulia@unsoed.ac.id', phone: '0812-1001-0002' },

  // Secretary
  { id: 'KSPM-003', name: 'Mira Rossa Canina', role: 'Leader Secretary', dept: 'Secretary', avatar: 'MC', color: 'from-indigo-600 to-purple-600', email: 'mira.rossa.canina@unsoed.ac.id', phone: '0813-2002-0003' },
  { id: 'KSPM-004', name: 'Finna Erlinda', role: 'Staff Secretary', dept: 'Secretary', avatar: 'FE', color: 'from-indigo-500 to-blue-600', email: 'finna.erlinda@unsoed.ac.id', phone: '0813-2002-0004' },

  // Finance
  { id: 'KSPM-005', name: 'Neva Cantika Sumbodo', role: 'Leader Finance', dept: 'Finance', avatar: 'NS', color: 'from-emerald-600 to-teal-700', email: 'neva.cantika.sumbodo@unsoed.ac.id', phone: '0821-3003-0005' },
  { id: 'KSPM-006', name: 'Fidela Prastika Salsabila', role: 'Staff Finance', dept: 'Finance', avatar: 'FP', color: 'from-teal-600 to-emerald-600', email: 'fidela.prastika.salsabila@unsoed.ac.id', phone: '0821-3003-0006' },

  // Human Resource Management
  { id: 'KSPM-007', name: 'Nadira Syifa Artanti', role: 'Leader Human Resource Management', dept: 'Human Resource Management', avatar: 'NA', color: 'from-blue-600 to-cyan-600', email: 'nadira.syifa.artanti@unsoed.ac.id', phone: '0856-4004-0007' },
  { id: 'KSPM-008', name: 'Benawa Kalam Ma\'wa', role: 'Staff Human Resource Management', dept: 'Human Resource Management', avatar: 'BM', color: 'from-cyan-600 to-blue-600', email: 'benawa.kalam.mawa@unsoed.ac.id', phone: '0856-4004-0008' },
  { id: 'KSPM-009', name: 'Elmira Firzana Ghaisani', role: 'Staff Human Resource Management', dept: 'Human Resource Management', avatar: 'EG', color: 'from-sky-600 to-indigo-600', email: 'elmira.firzana.ghaisani@unsoed.ac.id', phone: '0856-4004-0009' },
  { id: 'KSPM-010', name: 'Bakian Benzena Wardiansyah', role: 'Staff Human Resource Management', dept: 'Human Resource Management', avatar: 'BW', color: 'from-blue-700 to-teal-600', email: 'bakian.benzena.wardiansyah@unsoed.ac.id', phone: '0856-4004-0010' },
  { id: 'KSPM-011', name: 'Mashara Raka Wicaksana', role: 'Staff Human Resource Management', dept: 'Human Resource Management', avatar: 'MW', color: 'from-indigo-600 to-cyan-600', email: 'mashara.raka.wicaksana@unsoed.ac.id', phone: '0856-4004-0011' },

  // Project Management
  { id: 'KSPM-012', name: 'Alfio Fiqih Saputra', role: 'Leader Project Management', dept: 'Project Management', avatar: 'AS', color: 'from-amber-600 to-orange-600', email: 'alfio.fiqih.saputra@unsoed.ac.id', phone: '0877-5005-0012' },
  { id: 'KSPM-013', name: 'Ari Dwi C', role: 'Staff Project Management', dept: 'Project Management', avatar: 'AC', color: 'from-orange-600 to-amber-600', email: 'ari.dwi.c@unsoed.ac.id', phone: '0877-5005-0013' },
  { id: 'KSPM-014', name: 'Violetta Maylita Saffana', role: 'Staff Project Management', dept: 'Project Management', avatar: 'VS', color: 'from-yellow-600 to-orange-600', email: 'violetta.maylita.saffana@unsoed.ac.id', phone: '0877-5005-0014' },
  { id: 'KSPM-015', name: 'Eka Setya Ramadhan', role: 'Staff Project Management', dept: 'Project Management', avatar: 'ER', color: 'from-amber-700 to-red-600', email: 'eka.setya.ramadhan@unsoed.ac.id', phone: '0877-5005-0015' },
  { id: 'KSPM-016', name: 'Safira Yunindya Putri', role: 'Staff Project Management', dept: 'Project Management', avatar: 'SP', color: 'from-orange-500 to-rose-600', email: 'safira.yunindya.putri@unsoed.ac.id', phone: '0877-5005-0016' },
  { id: 'KSPM-017', name: 'Febrianto', role: 'Staff Project Management', dept: 'Project Management', avatar: 'FB', color: 'from-amber-600 to-yellow-600', email: 'febrianto@unsoed.ac.id', phone: '0877-5005-0017' },
  { id: 'KSPM-018', name: 'Naisya Sherra Maksum', role: 'Staff Project Management', dept: 'Project Management', avatar: 'NM', color: 'from-rose-500 to-amber-600', email: 'naisya.sherra.maksum@unsoed.ac.id', phone: '0877-5005-0018' },

  // Research Analyst
  { id: 'KSPM-019', name: 'Aditya Rayhandi', role: 'Leader Research Analyst', dept: 'Research Analyst', avatar: 'AR', color: 'from-violet-600 to-purple-700', email: 'aditya.rayhandi@unsoed.ac.id', phone: '0896-6006-0019' },
  { id: 'KSPM-020', name: 'Devano Kefanya Reihand Alvaro', role: 'Staff Research Analyst', dept: 'Research Analyst', avatar: 'DA', color: 'from-purple-600 to-indigo-700', email: 'devano.kefanya.reihand.alvaro@unsoed.ac.id', phone: '0896-6006-0020' },
  { id: 'KSPM-021', name: 'Alfaritzy Putra Januar', role: 'Staff Research Analyst', dept: 'Research Analyst', avatar: 'AJ', color: 'from-violet-700 to-blue-700', email: 'alfaritzy.putra.januar@unsoed.ac.id', phone: '0896-6006-0021' },
  { id: 'KSPM-022', name: 'Athaya Nasywa Brilian Nazwir', role: 'Staff Research Analyst', dept: 'Research Analyst', avatar: 'AN', color: 'from-fuchsia-600 to-purple-600', email: 'athaya.nasywa.brilian.nazwir@unsoed.ac.id', phone: '0896-6006-0022' },

  // Public Relations
  { id: 'KSPM-023', name: 'Evelyn Helena Rastika', role: 'Leader Public Relations', dept: 'Public Relations', avatar: 'ER', color: 'from-pink-600 to-rose-600', email: 'evelyn.helena.rastika@unsoed.ac.id', phone: '0812-7007-0023' },
  { id: 'KSPM-024', name: 'Annaba Wulandara', role: 'Staff Public Relations', dept: 'Public Relations', avatar: 'AW', color: 'from-rose-600 to-pink-500', email: 'annaba.wulandara@unsoed.ac.id', phone: '0812-7007-0024' },
  { id: 'KSPM-025', name: 'Melisa', role: 'Staff Public Relations', dept: 'Public Relations', avatar: 'ML', color: 'from-pink-500 to-purple-500', email: 'melisa@unsoed.ac.id', phone: '0812-7007-0025' },
  { id: 'KSPM-026', name: 'Muhammad Hasby Nabil Ayyasy', role: 'Staff Public Relations', dept: 'Public Relations', avatar: 'MA', color: 'from-rose-700 to-red-600', email: 'muhammad.hasby.nabil.ayyasy@unsoed.ac.id', phone: '0812-7007-0026' },
  { id: 'KSPM-027', name: 'Fatma Ayu Lestari', role: 'Staff Public Relations', dept: 'Public Relations', avatar: 'FL', color: 'from-fuchsia-600 to-pink-600', email: 'fatma.ayu.lestari@unsoed.ac.id', phone: '0812-7007-0027' },
  { id: 'KSPM-028', name: 'Mohammad Raffi Ramadhan', role: 'Staff Public Relations', dept: 'Public Relations', avatar: 'MR', color: 'from-pink-600 to-indigo-600', email: 'mohammad.raffi.ramadhan@unsoed.ac.id', phone: '0812-7007-0028' },

  // Media & Technology
  { id: 'KSPM-029', name: 'Adjani Putri Anelis', role: 'Leader Media & Technology', dept: 'Media & Technology', avatar: 'AA', color: 'from-orange-600 to-red-600', email: 'adjani.putri.anelis@unsoed.ac.id', phone: '0857-8008-0029' },
  { id: 'KSPM-030', name: 'Zulfikar Alkindi', role: 'Staff Media & Technology', dept: 'Media & Technology', avatar: 'ZA', color: 'from-amber-600 to-orange-700', email: 'zulfikar.alkindi@unsoed.ac.id', phone: '0857-8008-0030' },
  { id: 'KSPM-031', name: 'Muhammad Abdur Rosyid', role: 'Staff Media & Technology', dept: 'Media & Technology', avatar: 'MR', color: 'from-red-600 to-orange-600', email: 'muhammad.abdur.rosyid@unsoed.ac.id', phone: '0857-8008-0031' },
  { id: 'KSPM-032', name: 'Naswa Alia', role: 'Staff Media & Technology', dept: 'Media & Technology', avatar: 'NA', color: 'from-orange-500 to-amber-500', email: 'naswa.alia@unsoed.ac.id', phone: '0857-8008-0032' },
  { id: 'KSPM-033', name: 'Balqis Ghaliya Zafirah', role: 'Staff Media & Technology', dept: 'Media & Technology', avatar: 'BZ', color: 'from-amber-600 to-rose-600', email: 'balqis.ghaliya.zafirah@unsoed.ac.id', phone: '0857-8008-0033' }
];

// Helper Tanggal YYYY-MM-DD
function getTodayString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeCloudDate(rawDate) {
  if (!rawDate) return getTodayString(0);
  const str = String(rawDate).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return getTodayString(0);
    // Konversi offset UTC Google Sheets ke Waktu Indonesia Barat (WIB / GMT+7)
    const wib = new Date(d.getTime() + (7 * 3600 * 1000) + (d.getTimezoneOffset() * 60 * 1000));
    const y = wib.getUTCFullYear();
    const m = String(wib.getUTCMonth() + 1).padStart(2, '0');
    const day = String(wib.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch (e) {
    return str.substring(0, 10);
  }
}

function normalizeCloudTime(rawTime) {
  if (!rawTime) return '00:00';
  const str = String(rawTime).trim();
  if (/^\d{2}:\d{2}$/.test(str)) return str;
  if (/^\d{2}:\d{2}:\d{2}/.test(str)) return str.substring(0, 5);
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str.substring(0, 5);
    const wib = new Date(d.getTime() + (7 * 3600 * 1000) + (d.getTimezoneOffset() * 60 * 1000));
    const h = String(wib.getUTCHours()).padStart(2, '0');
    const min = String(wib.getUTCMinutes()).padStart(2, '0');
    return `${h}:${min}`;
  } catch (e) {
    return str.substring(0, 5);
  }
}

const SUPABASE_CONFIG = {
  URL: 'https://kkkkqrgbxaphjizuumzp.supabase.co',
  ANON_KEY: 'sb_secret_1-o_HEFkiRSa9cR-5p00LA_UD7hj2n8',
  AUTO_SYNC: true
};

const AttendanceDB = {
  _syncPromise: null,
  _realtimeClient: null,

  getHeaders() {
    return {
      'apikey': SUPABASE_CONFIG.ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
      'Content-Type': 'application/json'
    };
  },

  async postToSupabase(table, row) {
    if (!SUPABASE_CONFIG.URL || !SUPABASE_CONFIG.ANON_KEY) return null;
    try {
      const response = await fetch(`${SUPABASE_CONFIG.URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(row)
      });
      return { status: response.ok ? 'success' : 'error' };
    } catch (err) {
      console.warn(`Post to Supabase [${table}] error:`, err);
      return null;
    }
  },

  async deleteFromSupabase(table, filterQuery) {
    if (!SUPABASE_CONFIG.URL || !SUPABASE_CONFIG.ANON_KEY) return null;
    try {
      await fetch(`${SUPABASE_CONFIG.URL}/rest/v1/${table}?${filterQuery}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return { status: 'success' };
    } catch (err) {
      console.warn(`Delete from Supabase [${table}] error:`, err);
      return null;
    }
  },

  // --- LIGHTNING-FAST SUPABASE REALTIME CLOUD SYNCHRONIZATION (~30-50ms) ---
  async syncFromCloud() {
    if (!SUPABASE_CONFIG.URL || !SUPABASE_CONFIG.ANON_KEY) return null;
    if (this._syncPromise) return this._syncPromise;

    this._syncPromise = (async () => {
      try {
        const headers = {
          'apikey': SUPABASE_CONFIG.ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_CONFIG.ANON_KEY}`
        };

        const [empRes, attRes, schRes, holRes, setRes] = await Promise.all([
          fetch(`${SUPABASE_CONFIG.URL}/rest/v1/employees?select=*`, { headers }),
          fetch(`${SUPABASE_CONFIG.URL}/rest/v1/attendance?select=*&order=date.desc,time.desc&limit=2000`, { headers }),
          fetch(`${SUPABASE_CONFIG.URL}/rest/v1/schedules?select=*`, { headers }),
          fetch(`${SUPABASE_CONFIG.URL}/rest/v1/holidays?select=*`, { headers }),
          fetch(`${SUPABASE_CONFIG.URL}/rest/v1/settings?select=*`, { headers })
        ]);

        if (empRes.ok) {
          const employees = await empRes.json();
          if (Array.isArray(employees) && employees.length > 0) {
            const empMap = new Map();
            DEFAULT_EMPLOYEES.forEach(e => empMap.set(e.id, e));
            employees.forEach(e => {
              if (e && e.id) {
                const existing = empMap.get(e.id) || {};
                empMap.set(e.id, { ...existing, ...e });
              }
            });
            localStorage.setItem(DB_KEYS.EMPLOYEES, JSON.stringify(Array.from(empMap.values())));
          }
        }

        if (attRes.ok) {
          const attendance = await attRes.json();
          if (Array.isArray(attendance)) {
            const localLogs = JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || '[]');
            const logMap = new Map();

            attendance.forEach(l => {
              if (l && l.id) {
                const item = {
                  id: l.id,
                  empId: l.emp_id || l.empId,
                  name: l.name,
                  date: normalizeCloudDate(l.date),
                  time: normalizeCloudTime(l.time),
                  type: l.type,
                  category: l.category || 'biasa',
                  replacedDate: l.replaced_date || l.replacedDate || null,
                  reason: l.reason || '',
                  status: l.status,
                  shiftId: l.shift_id || l.shiftId,
                  location: l.location || '',
                  photo: l.photo || '',
                  notes: l.notes || ''
                };
                logMap.set(item.id, item);
              }
            });

            localLogs.forEach(l => {
              if (l && l.id) {
                l.date = normalizeCloudDate(l.date);
                l.time = normalizeCloudTime(l.time);
                logMap.set(l.id, l);
              }
            });

            const mergedLogs = Array.from(logMap.values());
            mergedLogs.sort((a, b) => (b.date + ' ' + b.time).localeCompare(a.date + ' ' + a.time));
            localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(mergedLogs));
          }
        }

        if (schRes.ok) {
          const schedules = await schRes.json();
          if (Array.isArray(schedules)) {
            const schMap = new Map();
            schedules.forEach(s => {
              if (s && s.id) {
                const item = {
                  id: s.id,
                  empId: s.emp_id || s.empId,
                  date: normalizeCloudDate(s.date),
                  shiftId: s.shift_id || s.shiftId,
                  category: s.category || 'biasa',
                  replacedDate: s.replaced_date || s.replacedDate || null,
                  notes: s.notes || ''
                };
                schMap.set(item.id, item);
              }
            });
            localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify(Array.from(schMap.values())));
          }
        }

        if (holRes.ok) {
          const holidays = await holRes.json();
          if (Array.isArray(holidays) && holidays.length > 0) {
            holidays.forEach(h => {
              h.date = normalizeCloudDate(h.date);
            });
            localStorage.setItem(DB_KEYS.HOLIDAYS, JSON.stringify(holidays));
          }
        }

        if (setRes.ok) {
          const settings = await setRes.json();
          if (Array.isArray(settings) && settings.length > 0) {
            const pauseSetting = settings.find(s => s.key === 'SYSTEM_PAUSED');
            const reasonSetting = settings.find(s => s.key === 'SYSTEM_PAUSE_REASON');
            if (pauseSetting) {
              localStorage.setItem('kspm_system_paused', JSON.stringify({
                isPaused: pauseSetting.value === 'TRUE',
                reason: reasonSetting ? reasonSetting.value : 'Masa Libur Perkuliahan'
              }));
            }
          }
        }

        return { status: 'success' };
      } catch (err) {
        console.warn('Supabase sync offline or error:', err);
      } finally {
        this._syncPromise = null;
      }
      return null;
    })();

    return this._syncPromise;
  },

  initRealtime() {
    if (typeof supabase !== 'undefined' && supabase.createClient && !this._realtimeClient) {
      try {
        this._realtimeClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
        this._realtimeClient
          .channel('kspm_attendance_realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => {
            this.syncFromCloud().then(() => {
              if (window.calendarInstance) window.calendarInstance.render();
              if (typeof renderMonitoringView === 'function') renderMonitoringView();
              if (typeof onCalendarDateSelected === 'function' && typeof activeSelectedDate !== 'undefined') onCalendarDateSelected(activeSelectedDate);
            });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => {
            this.syncFromCloud().then(() => {
              if (window.calendarInstance) window.calendarInstance.render();
              if (typeof renderMonitoringView === 'function') renderMonitoringView();
              if (typeof onCalendarDateSelected === 'function' && typeof activeSelectedDate !== 'undefined') onCalendarDateSelected(activeSelectedDate);
            });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
            this.syncFromCloud().then(() => {
              if (typeof checkHomeSystemPauseState === 'function') checkHomeSystemPauseState();
              if (typeof updateSystemPauseUI === 'function') updateSystemPauseUI();
              if (typeof checkSystemPauseState === 'function') checkSystemPauseState();
            });
          })
          .subscribe();
      } catch (e) {
        console.warn('Realtime init error:', e);
      }
    }
  },

  init() {
    if (!localStorage.getItem(DB_KEYS.SHIFTS)) {
      localStorage.setItem(DB_KEYS.SHIFTS, JSON.stringify(DEFAULT_SHIFTS));
    }
    if (!localStorage.getItem(DB_KEYS.EMPLOYEES)) {
      localStorage.setItem(DB_KEYS.EMPLOYEES, JSON.stringify(DEFAULT_EMPLOYEES));
    }
    if (!localStorage.getItem(DB_KEYS.SCHEDULES)) {
      localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.ATTENDANCE)) {
      localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.HOLIDAYS)) {
      localStorage.setItem(DB_KEYS.HOLIDAYS, JSON.stringify(DEFAULT_HOLIDAYS));
    }

    // Auto-sync in background from Supabase (30-50ms)
    if (SUPABASE_CONFIG.AUTO_SYNC) {
      this.syncFromCloud();
      this.initRealtime();
    }
  },

  // Reset total basis data ke kondisi awal bersih
  resetDatabase() {
    localStorage.setItem(DB_KEYS.EMPLOYEES, JSON.stringify(DEFAULT_EMPLOYEES));
    localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.SHIFTS, JSON.stringify(DEFAULT_SHIFTS));
    localStorage.setItem(DB_KEYS.HOLIDAYS, JSON.stringify(DEFAULT_HOLIDAYS));
  },

  // --- MANAJEMEN HARI LIBUR NASIONAL & KAMPUS ---
  getHolidays() {
    const data = localStorage.getItem(DB_KEYS.HOLIDAYS);
    return data ? JSON.parse(data) : DEFAULT_HOLIDAYS;
  },

  isHoliday(dateStr) {
    const holidays = this.getHolidays();
    return holidays.find(h => h.date === dateStr) || null;
  },

  addHoliday({ date, name, description = '' }) {
    const holidays = this.getHolidays();
    const existingIdx = holidays.findIndex(h => h.date === date);
    const newHoliday = {
      id: 'HOL-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      date,
      name,
      description
    };
    if (existingIdx >= 0) {
      holidays[existingIdx] = newHoliday;
    } else {
      holidays.push(newHoliday);
    }
    localStorage.setItem(DB_KEYS.HOLIDAYS, JSON.stringify(holidays));
    this.postToSupabase('holidays', {
      id: newHoliday.id,
      date: newHoliday.date,
      name: newHoliday.name,
      description: newHoliday.description || ''
    });
    return newHoliday;
  },

  deleteHoliday(id) {
    let holidays = this.getHolidays();
    holidays = holidays.filter(h => h.id !== id);
    localStorage.setItem(DB_KEYS.HOLIDAYS, JSON.stringify(holidays));
    this.deleteFromSupabase('holidays', `id=eq.${id}`);
    return holidays;
  },

  getShifts() {
    const data = localStorage.getItem(DB_KEYS.SHIFTS);
    return data ? JSON.parse(data) : DEFAULT_SHIFTS;
  },

  getDepartments() {
    return DEFAULT_DEPARTMENTS;
  },

  getEmployees() {
    const data = localStorage.getItem(DB_KEYS.EMPLOYEES);
    const custom = data ? JSON.parse(data) : [];
    const empMap = new Map();
    // Basis resmi permanen: seluruh 33 pengurus KSPM
    DEFAULT_EMPLOYEES.forEach(e => empMap.set(e.id, e));
    if (Array.isArray(custom)) {
      custom.forEach(e => {
        if (e && e.id) {
          const existing = empMap.get(e.id) || {};
          empMap.set(e.id, { ...existing, ...e });
        }
      });
    }
    return Array.from(empMap.values());
  },

  getEmployeesByDept(deptName) {
    const all = this.getEmployees();
    return all.filter(e => e.dept === deptName);
  },

  getEmployeeById(id) {
    const employees = this.getEmployees();
    return employees.find(e => e.id === id);
  },

  addEmployee(empData) {
    const employees = this.getEmployees();
    const newId = 'KSPM-' + String(employees.length + 1).padStart(3, '0');
    const colors = [
      'from-blue-600 to-indigo-600',
      'from-emerald-600 to-teal-600',
      'from-purple-600 to-indigo-600',
      'from-amber-600 to-orange-600',
      'from-rose-600 to-pink-600'
    ];
    const initials = empData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const newEmp = {
      id: newId,
      name: empData.name,
      role: empData.role || 'Staff Anggota',
      dept: empData.dept || DEFAULT_DEPARTMENTS[0],
      avatar: initials,
      color: colors[Math.floor(Math.random() * colors.length)],
      email: `${empData.name.toLowerCase().replace(/\s+/g, '.')}@unsoed.ac.id`,
      phone: '08' + Math.floor(1000000000 + Math.random() * 9000000000)
    };

    employees.push(newEmp);
    localStorage.setItem(DB_KEYS.EMPLOYEES, JSON.stringify(employees));
    this.postToSupabase('employees', newEmp);
    return newEmp;
  },

  deleteEmployee(id) {
    let employees = this.getEmployees();
    employees = employees.filter(e => e.id !== id);
    localStorage.setItem(DB_KEYS.EMPLOYEES, JSON.stringify(employees));
    this.deleteFromSupabase('employees', `id=eq.${id}`);
    return employees;
  },

  // --- HELPER METRIK PENGHITUNGAN 1 SESI PIKET VALID (1 Sesi = 1 Masuk + 1 Pulang Minimal 2 Jam) ---
  countCompletedSessions(empId, logs, startDate = null, endDate = null) {
    let filteredLogs = logs.filter(l => l.empId === empId);
    if (startDate && endDate) {
      filteredLogs = filteredLogs.filter(l => l.date >= startDate && l.date <= endDate);
    }
    const dates = Array.from(new Set(filteredLogs.map(l => l.date)));
    let completedCount = 0;

    dates.forEach(d => {
      const dayLogs = filteredLogs.filter(l => l.date === d);
      const hasMasuk = dayLogs.some(l => l.type === 'MASUK');
      const hasPulang = dayLogs.some(l => l.type === 'PULANG');
      const isSelesai = dayLogs.some(l => l.status === 'SELESAI' || l.status === 'HADIR');

      // 1 Sesi Piket Sah = Ada Absen Masuk & Pulang Lengkap atau Status Selesai
      if ((hasMasuk && hasPulang) || isSelesai) {
        completedCount++;
      }
    });

    return completedCount;
  },

  hasCompletedSessionOnDate(empId, logs, targetDate) {
    const dayLogs = logs.filter(l => l.empId === empId && l.date === targetDate);
    const hasMasuk = dayLogs.some(l => l.type === 'MASUK');
    const hasPulang = dayLogs.some(l => l.type === 'PULANG');
    const isSelesai = dayLogs.some(l => l.status === 'SELESAI' || l.status === 'HADIR');
    return (hasMasuk && hasPulang) || isSelesai;
  },

  // --- PERHITUNGAN DURASI WAKTU NYATA & POIN KEAKTIFAN (SUKARELA/MAIN VS PENGGANTI) ---
  calculateLogDurationMinutes(timeMasuk, timePulang) {
    if (!timeMasuk || timeMasuk === '-' || !timePulang || timePulang === '-') return 0;
    try {
      const [hM, mM] = timeMasuk.split(':').map(Number);
      const [hP, mP] = timePulang.split(':').map(Number);
      const diff = (hP * 60 + mP) - (hM * 60 + mM);
      return (isNaN(diff) || diff <= 0) ? 0 : diff;
    } catch (e) {
      return 0;
    }
  },

  formatDurationMinutes(totalMinutes) {
    if (!totalMinutes || totalMinutes <= 0) return '0 Jam';
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0 && m > 0) return `${h} Jam ${m} Menit`;
    if (h > 0) return `${h} Jam`;
    return `${m} Menit`;
  },

  getMemberActivityDetails(empId, startDate = null, endDate = null) {
    let logs = this.getAttendanceLogs().filter(l => l.empId === empId);
    if (startDate && endDate) {
      logs = logs.filter(l => l.date >= startDate && l.date <= endDate);
    }

    let totalMainMinutes = 0;
    let totalPenggantiSessions = 0;
    let totalWajibSessions = 0;

    const dates = Array.from(new Set(logs.map(l => l.date)));
    dates.forEach(d => {
      const dayLogs = logs.filter(l => l.date === d);
      const masukLog = dayLogs.find(l => l.type === 'MASUK');
      const pulangLog = dayLogs.find(l => l.type === 'PULANG');
      const category = masukLog?.category || pulangLog?.category || 'biasa';

      if (category === 'sukarela') {
        // Piket Sukarela / Main: Dihitung murni durasi waktu nyata (jam & menit aktual)
        if (masukLog && pulangLog) {
          totalMainMinutes += this.calculateLogDurationMinutes(masukLog.time, pulangLog.time);
        }
      } else if (category === 'pengganti') {
        // Piket Pengganti: Dihitung standar 2 jam per sesi sah
        if ((masukLog && pulangLog) || dayLogs.some(l => l.status === 'SELESAI' || l.status === 'HADIR')) {
          totalPenggantiSessions++;
        }
      } else {
        // Piket Reguler Terjadwal
        if ((masukLog && pulangLog) || dayLogs.some(l => l.status === 'SELESAI' || l.status === 'HADIR')) {
          totalWajibSessions++;
        }
      }
    });

    const totalPenggantiHours = totalPenggantiSessions * 2;
    const totalWajibHours = totalWajibSessions * 2;
    const totalMainHours = (totalMainMinutes / 60).toFixed(1);

    return {
      totalMainMinutes,
      totalMainFormatted: this.formatDurationMinutes(totalMainMinutes),
      totalMainHours: parseFloat(totalMainHours),
      totalPenggantiSessions,
      totalPenggantiHours,
      totalWajibSessions,
      totalWajibHours,
      totalHoursCombined: (totalWajibHours + totalPenggantiHours + (totalMainMinutes / 60)).toFixed(1)
    };
  },

  getTopActiveMembers(limit = 5, yearMonth = null) {
    const employees = this.getEmployees();
    let logs = this.getAttendanceLogs();
    let schedules = this.getSchedules();

    let startDate = null;
    let endDate = null;

    if (yearMonth) {
      const [yStr, mStr] = yearMonth.split('-');
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10);
      const days = new Date(y, m, 0).getDate();
      startDate = `${yStr}-${mStr}-01`;
      endDate = `${yStr}-${mStr}-${String(days).padStart(2, '0')}`;

      logs = logs.filter(l => l.date >= startDate && l.date <= endDate);
      schedules = schedules.filter(s => s.date >= startDate && s.date <= endDate);
    }

    const memberStats = employees.map(emp => {
      const empLogs = logs.filter(l => l.empId === emp.id);
      const empSchedules = schedules.filter(s => s.empId === emp.id);
      
      // 1 Sesi Sah = Lengkap Masuk & Pulang
      const hadirCount = this.countCompletedSessions(emp.id, empLogs, startDate, endDate);
      const izinCount = empLogs.filter(l => l.type === 'IZIN' || l.status === 'IZIN').length;
      
      let alpaCount = 0;
      empSchedules.forEach(sch => {
        const hasSession = this.hasCompletedSessionOnDate(emp.id, empLogs, sch.date);
        const hasIzin = empLogs.some(l => l.date === sch.date && (l.type === 'IZIN' || l.status === 'IZIN'));
        if (!hasSession && !hasIzin) alpaCount++;
      });

      const totalSlots = empSchedules.length > 0 ? empSchedules.length : 8;
      const ratePercent = totalSlots > 0 ? Math.min(100, Math.round((hadirCount / totalSlots) * 100)) : 100;

      return {
        ...emp,
        hadirCount,
        izinCount,
        alpaCount,
        totalSlots,
        ratePercent
      };
    });

    memberStats.sort((a, b) => b.hadirCount - a.hadirCount || b.ratePercent - a.ratePercent);
    return memberStats.slice(0, limit);
  },

  getSchedules(dateStr = null) {
    const data = localStorage.getItem(DB_KEYS.SCHEDULES);
    const schedules = data ? JSON.parse(data) : [];
    if (dateStr) {
      return schedules.filter(s => s.date === dateStr);
    }
    return schedules;
  },

  addSchedule(scheduleData) {
    const schedules = this.getSchedules();
    const newSchedule = {
      id: 'SCH-' + Date.now().toString(36).toUpperCase(),
      empId: scheduleData.empId,
      date: scheduleData.date,
      shiftId: scheduleData.shiftId,
      category: scheduleData.category || 'biasa',
      replacedDate: scheduleData.replacedDate || null,
      notes: scheduleData.notes || ''
    };

    const existingIdx = schedules.findIndex(s => s.empId === newSchedule.empId && s.date === newSchedule.date);
    if (existingIdx >= 0) {
      schedules[existingIdx] = newSchedule;
    } else {
      schedules.push(newSchedule);
    }

    localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify(schedules));
    this.postToSupabase('schedules', {
      id: newSchedule.id,
      emp_id: newSchedule.empId,
      date: newSchedule.date,
      shift_id: newSchedule.shiftId,
      category: newSchedule.category,
      replaced_date: newSchedule.replacedDate || null,
      notes: newSchedule.notes || ''
    });
    return newSchedule;
  },

  deleteSchedule(scheduleId) {
    let schedules = this.getSchedules();
    schedules = schedules.filter(s => s.id !== scheduleId);
    localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify(schedules));
    this.deleteFromSupabase('schedules', `id=eq.${scheduleId}`);
  },

  deleteScheduleByEmpAndDate(empId, dateStr) {
    let schedules = this.getSchedules();
    const toDelete = schedules.filter(s => s.empId === empId && s.date === dateStr);
    schedules = schedules.filter(s => !(s.empId === empId && s.date === dateStr));
    localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify(schedules));
    if (toDelete.length > 0) {
      toDelete.forEach(s => this.deleteFromSupabase('schedules', `id=eq.${s.id}`));
    }
    this.deleteFromSupabase('schedules', `emp_id=eq.${empId}&date=eq.${dateStr}`);
    return schedules;
  },

  clearAllSchedules() {
    localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify([]));
    this.deleteFromSupabase('schedules', 'id=not.is.null');
    return [];
  },

  addBatchSchedules(scheduleList) {
    const schedules = this.getSchedules();
    const rowsToPost = [];
    let count = 0;
    scheduleList.forEach(item => {
      const newSchedule = {
        id: 'SCH-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase(),
        empId: item.empId,
        date: item.date,
        shiftId: item.shiftId,
        category: item.category || 'biasa',
        replacedDate: item.replacedDate || null,
        notes: item.notes || ''
      };
      const existingIdx = schedules.findIndex(s => s.empId === newSchedule.empId && s.date === newSchedule.date);
      if (existingIdx >= 0) {
        schedules[existingIdx] = newSchedule;
      } else {
        schedules.push(newSchedule);
      }
      rowsToPost.push({
        id: newSchedule.id,
        emp_id: newSchedule.empId,
        date: newSchedule.date,
        shift_id: newSchedule.shiftId,
        category: newSchedule.category,
        replaced_date: newSchedule.replacedDate || null,
        notes: newSchedule.notes || ''
      });
      count++;
    });
    localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify(schedules));
    if (rowsToPost.length > 0) {
      this.postToSupabase('schedules', rowsToPost);
    }
    return count;
  },

  addRecurringWeeklySchedule({ daysOfWeek, shiftId, empIds, startDate = null, endDate = null, notes = '' }) {
    const now = new Date();
    const start = startDate ? new Date(startDate + 'T00:00:00') : new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let end;
    if (endDate) {
      end = new Date(endDate + 'T23:59:59');
    } else {
      end = new Date(start);
      end.setMonth(end.getMonth() + 6); // 6 bulan ke depan (1 Semester)
    }

    const targetDates = [];
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay(); // 0 = Minggu, 1 = Senin, 2 = Selasa, ...
      if (daysOfWeek.includes(day)) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, '0');
        const d = String(current.getDate()).padStart(2, '0');
        targetDates.push(`${y}-${m}-${d}`);
      }
      current.setDate(current.getDate() + 1);
    }

    const batchList = [];
    empIds.forEach(empId => {
      targetDates.forEach(dateStr => {
        batchList.push({
          empId,
          date: dateStr,
          shiftId,
          category: 'biasa',
          replacedDate: null,
          notes: notes || 'Jadwal Rutin Piket Mingguan'
        });
      });
    });

    return this.addBatchSchedules(batchList);
  },

  getWeeklyRosterMap() {
    const summary = this.getWeeklyRosterSummary();
    const map = {};
    for (let d = 0; d < 7; d++) {
      map[d] = {
        shift_pagi: (summary[d]?.shift_pagi || []).map(m => m.empId),
        shift_siang: (summary[d]?.shift_siang || []).map(m => m.empId)
      };
    }
    return map;
  },

  saveFullWeeklyRoster(rosterMap, { durationMonths = 6, startDate = null, notes = 'Jadwal Piket Rutin' } = {}) {
    const now = new Date();
    const start = startDate ? new Date(startDate + 'T00:00:00') : new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const end = new Date(start);
    end.setMonth(end.getMonth() + parseInt(durationMonths, 10));

    const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
    const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

    let schedules = this.getSchedules();
    const idsToDelete = [];
    schedules = schedules.filter(s => {
      if (s.date >= startStr && s.date <= endStr && (!s.category || s.category === 'biasa')) {
        idsToDelete.push(s.id);
        return false;
      }
      return true;
    });

    localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify(schedules));
    if (idsToDelete.length > 0) {
      idsToDelete.forEach(id => this.deleteFromSupabase('schedules', `id=eq.${id}`));
    }

    const batchList = [];
    const current = new Date(start);
    while (current <= end) {
      const dayIdx = current.getDay();
      const dayConfig = rosterMap[dayIdx];

      if (dayConfig) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, '0');
        const d = String(current.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        const pagiMembers = dayConfig.shift_pagi || [];
        pagiMembers.forEach(empId => {
          batchList.push({
            empId,
            date: dateStr,
            shiftId: 'shift_pagi',
            category: 'biasa',
            replacedDate: null,
            notes: notes ? `${notes} (Sesi Pagi)` : 'Jadwal Piket Rutin (Sesi Pagi)'
          });
        });

        const siangMembers = dayConfig.shift_siang || [];
        siangMembers.forEach(empId => {
          batchList.push({
            empId,
            date: dateStr,
            shiftId: 'shift_siang',
            category: 'biasa',
            replacedDate: null,
            notes: notes ? `${notes} (Sesi Siang)` : 'Jadwal Piket Rutin (Sesi Siang)'
          });
        });
      }

      current.setDate(current.getDate() + 1);
    }

    if (batchList.length > 0) {
      return this.addBatchSchedules(batchList);
    }
    return 0;
  },

  // --- MATRIKS JADWAL RESMI KSPM 2026 (SESUAI DOKUMEN & FOTO RESMI GALERI INVESTASI) ---
  getOfficialKspmRoster2026() {
    return {
      1: { // SENIN
        shift_pagi: ['KSPM-004', 'KSPM-009', 'KSPM-013', 'KSPM-015', 'KSPM-021'], // Finna Erlinda, Elmira Firzana Ghaisani, Ari Dwi C, Eka Setya Ramadhan, Alfaritzy Putra Januar
        shift_siang: ['KSPM-022', 'KSPM-030', 'KSPM-031', 'KSPM-033'] // Athaya Nasywa B. N., Zulfikar Alkindi, M. Abdur Rosyid, Balqis Ghaliya Zafirah
      },
      2: { // SELASA
        shift_pagi: ['KSPM-010', 'KSPM-014', 'KSPM-032', 'KSPM-028', 'KSPM-020'], // Bakian Benzena W., Violetta Maylita Saffana, Naswa Alia, Mohammad Raffi R., Devano Kefanya R. A.
        shift_siang: ['KSPM-011', 'KSPM-006', 'KSPM-017', 'KSPM-024', 'KSPM-027'] // Mashara Raka W., Fidela Prastika Salsabila, Febrianto, Annaba Wulandara, Fatma Ayu Lestari
      },
      3: { // RABU
        shift_pagi: ['KSPM-008', 'KSPM-016', 'KSPM-021', 'KSPM-031', 'KSPM-026'], // Benawa Kalam Ma'wa, Safira Yunindya Putri, Alfaritzy Putra Januar, M. Abdur Rosyid, M. Hasby Nabil Ayyasy
        shift_siang: ['KSPM-004', 'KSPM-006', 'KSPM-009', 'KSPM-018', 'KSPM-025'] // Finna Erlinda, Fidela Prastika Salsabila, Elmira Firzana Ghaisani, Naisya Sherra Maksum, Melisa
      },
      4: { // KAMIS
        shift_pagi: ['KSPM-013', 'KSPM-024', 'KSPM-030', 'KSPM-025', 'KSPM-018'], // Ari Dwi C, Annaba Wulandara, Zulfikar Alkindi, Melisa, Naisya Sherra Maksum
        shift_siang: ['KSPM-017', 'KSPM-010', 'KSPM-014', 'KSPM-020', 'KSPM-022'] // Febrianto, Bakian Benzena W., Violetta Maylita Saffana, Devano Kefanya R. A., Athaya Nasywa B. N.
      },
      5: { // JUMAT
        shift_pagi: ['KSPM-008', 'KSPM-011', 'KSPM-015', 'KSPM-026', 'KSPM-033'], // Benawa Kalam Ma'wa, Mashara Raka W., Eka Setya Ramadhan, M. Hasby Nabil Ayyasy, Balqis Ghaliya Zafirah
        shift_siang: ['KSPM-016', 'KSPM-027', 'KSPM-028', 'KSPM-032'] // Safira Yunindya Putri, Fatma Ayu Lestari, Mohammad Raffi R., Naswa Alia
      },
      6: { shift_pagi: [], shift_siang: [] }, // SABTU
      0: { shift_pagi: [], shift_siang: [] }  // MINGGU
    };
  },

  applyOfficialKspmRoster2026({ durationMonths = 6, startDate = null } = {}) {
    const roster = this.getOfficialKspmRoster2026();
    return this.saveFullWeeklyRoster(roster, {
      durationMonths,
      startDate,
      notes: 'Jadwal Resmi Galeri Investasi KSPM 2026'
    });
  },

  fuzzyMatchEmployee(rawName) {
    if (!rawName || rawName.trim().length < 2) return null;
    const clean = rawName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const employees = this.getEmployees();

    for (const emp of employees) {
      const empClean = emp.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (empClean === clean || empClean.includes(clean) || clean.includes(empClean)) {
        return emp;
      }
    }

    let bestMatch = null;
    let highestScore = 0;
    const words = clean.split(/\s+/).filter(w => w.length > 0);

    employees.forEach(emp => {
      const empWords = emp.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 0);
      let matchCount = 0;
      words.forEach(w => {
        if (w.length > 2 && empWords.some(ew => ew.startsWith(w) || w.startsWith(ew))) {
          matchCount += 2;
        } else if (w.length >= 1 && empWords.some(ew => ew.startsWith(w))) {
          matchCount += 1;
        }
      });
      const score = matchCount / (empWords.length + words.length);
      if (score > highestScore && score >= 0.25) {
        highestScore = score;
        bestMatch = emp;
      }
    });

    return bestMatch;
  },

  getWeeklyRosterSummary() {
    const schedules = this.getSchedules();
    const employees = this.getEmployees();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const summary = {};

    for (let d = 0; d < 7; d++) {
      summary[d] = {
        dayIndex: d,
        dayName: dayNames[d],
        shift_pagi: [],
        shift_siang: []
      };
    }

    const pairMap = new Map();

    schedules.forEach(s => {
      if (!s.date) return;
      const dateObj = new Date(s.date + 'T00:00:00');
      const dayIdx = dateObj.getDay();
      const shiftId = s.shiftId || 'shift_pagi';
      const key = `${s.empId}_${dayIdx}_${shiftId}`;

      if (!pairMap.has(key)) {
        pairMap.set(key, true);
        const emp = employees.find(e => e.id === s.empId) || { id: s.empId, name: s.empId, dept: 'KSPM', avatar: 'KP', color: 'from-gray-600 to-gray-700' };
        if (summary[dayIdx] && summary[dayIdx][shiftId]) {
          summary[dayIdx][shiftId].push({
            empId: emp.id,
            name: emp.name,
            dept: emp.dept,
            avatar: emp.avatar,
            color: emp.color,
            shiftId: shiftId,
            dayIndex: dayIdx
          });
        }
      }
    });

    return summary;
  },

  deleteWeeklyRosterMember(empId, dayIndex, shiftId = null) {
    const schedules = this.getSchedules();
    const idsToDelete = [];
    const remaining = [];

    schedules.forEach(s => {
      const dateObj = new Date(s.date + 'T00:00:00');
      const dayIdx = dateObj.getDay();
      if (s.empId === empId && dayIdx === dayIndex && (!shiftId || s.shiftId === shiftId)) {
        idsToDelete.push(s.id);
      } else {
        remaining.push(s);
      }
    });

    localStorage.setItem(DB_KEYS.SCHEDULES, JSON.stringify(remaining));
    if (idsToDelete.length > 0) {
      idsToDelete.forEach(id => this.deleteFromSupabase('schedules', `id=eq.${id}`));
    }
    return idsToDelete.length;
  },

  getAttendanceLogs(dateStr = null) {
    const data = localStorage.getItem(DB_KEYS.ATTENDANCE);
    let logs = data ? JSON.parse(data) : [];

    if (dateStr) {
      return logs.filter(l => l.date === dateStr);
    }
    return logs;
  },

  clearAttendanceLogs() {
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify([]));
    this.deleteFromSupabase('attendance', 'id=not.is.null');
    return [];
  },

  deleteAttendanceLog(logId) {
    let logs = this.getAttendanceLogs();
    logs = logs.filter(l => l.id !== logId);
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(logs));
    this.deleteFromSupabase('attendance', `id=eq.${logId}`);
    return logs;
  },

  deleteAttendanceByEmpAndDate(empId, dateStr) {
    let logs = this.getAttendanceLogs();
    logs = logs.filter(l => !(l.empId === empId && l.date === dateStr));
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(logs));
    this.deleteFromSupabase('attendance', `emp_id=eq.${empId}&date=eq.${dateStr}`);
    return logs;
  },

  deleteDailyAttendance(dateStr) {
    let logs = this.getAttendanceLogs();
    logs = logs.filter(l => l.date !== dateStr);
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(logs));
    this.deleteFromSupabase('attendance', `date=eq.${dateStr}`);
    return logs;
  },

  async uploadPhotoToGoogleDrive(logId, photoBase64, name, dept, type, date, time) {
    if (!photoBase64 || !photoBase64.startsWith('data:image')) return null;
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbxuM8NODZ9hMWMJ57G_-078DhkZ_wanj4hm_0it49qx8mFGOzPBa1TTCx93k1eHVrm_Bg/exec';
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'uploadPhoto',
          id: logId,
          photo: photoBase64,
          name: name,
          dept: dept || 'KSPM',
          type: type || 'MASUK',
          date: date,
          time: time || '00:00'
        })
      });
      const result = await response.json();
      if (result && result.status === 'success') {
        const photoUrl = result.photoUrl || '';
        const folderUrl = result.folderUrl || result.photoUrl || '';

        // 1. Update di LocalStorage
        const logs = this.getAttendanceLogs();
        const target = logs.find(l => l.id === logId);
        if (target) {
          if (photoUrl) target.photo = photoUrl;
          if (folderUrl) target.driveFolder = folderUrl;
          localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(logs));
        }

        // 2. Update di Supabase Database (Hanya simpan link Drive singkat, sangat ringan!)
        await fetch(`${SUPABASE_CONFIG.URL}/rest/v1/attendance?id=eq.${logId}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_CONFIG.ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photo: photoUrl,
            notes: (target && target.notes ? target.notes : 'Presensi Piket Terverifikasi') + (folderUrl ? ` [DriveFolder: ${folderUrl}]` : '')
          })
        });
        return { photoUrl, folderUrl };
      }
    } catch (e) {
      console.warn('Google Drive photo upload failed (preserved locally):', e);
    }
    return null;
  },

  // --- KONFIGURASI GEOFENCING LOKASI PIKET ("Galeri Investasi Unsoed") ---
  GEOFENCE: {
    NAME: 'Galeri Investasi Unsoed',
    LATITUDE: -7.403280,
    LONGITUDE: 109.246801,
    RADIUS_METERS: 100 // Radius toleransi piket 100 meter di sekitar Galeri Investasi FEB Unsoed
  },

  calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius bumi dalam meter
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  },

  checkLocationGeofence(lat, lng) {
    if (lat === null || lng === null || isNaN(Number(lat)) || isNaN(Number(lng))) {
      return {
        isInside: true,
        distanceMeters: 0,
        label: this.GEOFENCE.NAME,
        formattedString: `${this.GEOFENCE.NAME} [${this.GEOFENCE.LATITUDE}, ${this.GEOFENCE.LONGITUDE}]`
      };
    }
    const dist = this.calculateDistanceMeters(Number(lat), Number(lng), this.GEOFENCE.LATITUDE, this.GEOFENCE.LONGITUDE);
    const isInside = dist <= this.GEOFENCE.RADIUS_METERS;
    const label = isInside ? this.GEOFENCE.NAME : `Luar Area (${dist}m)`;
    const formattedString = isInside 
      ? `${this.GEOFENCE.NAME} (${dist}m) [${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}]`
      : `Luar Galeri Investasi (${dist}m) [${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}]`;

    return {
      isInside,
      distanceMeters: dist,
      label,
      formattedString
    };
  },

  // --- ATURAN VALIDASI BATAS WAKTU 1 BULAN (31 HARI) PIKET PENGGANTI ---
  validateReplacementDate(replacedDateStr, referenceDateStr = null) {
    if (!replacedDateStr) {
      return { valid: false, message: 'Tanggal piket yang digantikan harus dipilih.' };
    }
    const refDateStr = referenceDateStr || getTodayString(0);
    const refDate = new Date(refDateStr + 'T00:00:00');
    const repDate = new Date(replacedDateStr + 'T00:00:00');

    if (isNaN(repDate.getTime())) {
      return { valid: false, message: 'Format tanggal yang digantikan tidak valid.' };
    }

    if (repDate >= refDate) {
      return {
        valid: false,
        daysDiff: 0,
        message: 'Tanggal yang digantikan harus terjadi sebelum hari ini (maksimal 1 bulan yang lalu).'
      };
    }

    const diffTime = refDate.getTime() - repDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Maksimal 1 bulan kalender (31 hari)
    if (diffDays > 31) {
      return {
        valid: false,
        daysDiff: diffDays,
        message: `Piket Pengganti hanya dapat menggantikan jadwal maksimal 1 bulan (31 hari) yang lalu. Tanggal ${replacedDateStr} sudah berlalu ${diffDays} hari yang lalu dan telah kedaluwarsa.`
      };
    }

    return {
      valid: true,
      daysDiff: diffDays,
      message: `Valid (${diffDays} hari yang lalu - dalam rentang 1 bulan).`
    };
  },

  // Mengambil daftar jadwal Alfa / Izin anggota dalam 31 hari terakhir yang eligible untuk digantikan
  getEligibleReplacementSchedules(empId, referenceDateStr = null) {
    if (!empId) return [];
    const refDateStr = referenceDateStr || getTodayString(0);
    const refDate = new Date(refDateStr + 'T00:00:00');

    const minDate = new Date(refDate);
    minDate.setDate(minDate.getDate() - 31);
    const minDateStr = minDate.toISOString().substring(0, 10);

    const maxDate = new Date(refDate);
    maxDate.setDate(maxDate.getDate() - 1);
    const maxDateStr = maxDate.toISOString().substring(0, 10);

    const allSchedules = this.getSchedules();
    const allLogs = this.getAttendanceLogs();
    const shifts = this.getShifts();

    // Jadwal anggota dalam rentang 31 hari terakhir
    const memberSchedules = allSchedules.filter(s => 
      s.empId === empId && s.date >= minDateStr && s.date <= maxDateStr
    );

    // Tanggal yang SUDAH pernah digantikan oleh log pengganti lain
    const alreadyReplacedDates = new Set(
      allLogs
        .filter(l => l.empId === empId && (l.category === 'pengganti' || (l.category === 'sukarela' && l.replacedDate)) && l.replacedDate)
        .map(l => l.replacedDate)
    );

    const eligibleList = [];

    memberSchedules.forEach(sch => {
      if (alreadyReplacedDates.has(sch.date)) return;

      const schDateObj = new Date(sch.date + 'T00:00:00');
      const daysAgo = Math.floor((refDate.getTime() - schDateObj.getTime()) / (1000 * 60 * 60 * 24));
      const shift = shifts.find(s => s.id === sch.shiftId) || { name: 'Sesi Pagi', start: '07:00', end: '12:00' };

      const dateLogs = allLogs.filter(l => l.empId === empId && l.date === sch.date);
      const isCompleted = this.hasCompletedSessionOnDate(empId, allLogs, sch.date);
      const isIzin = dateLogs.some(l => l.type === 'IZIN' || l.status === 'IZIN');

      // Jika tidak hadir (Alfa) atau Izin, maka tanggal ini eligible untuk diganti!
      if (!isCompleted || isIzin) {
        eligibleList.push({
          date: sch.date,
          shiftId: sch.shiftId,
          shiftName: shift.name,
          shiftTime: `${shift.start} - ${shift.end}`,
          status: isIzin ? 'IZIN' : 'ALPA',
          statusLabel: isIzin ? 'Izin Terdaftar' : 'Belum Piket (Alfa)',
          daysAgo: daysAgo
        });
      }
    });

    eligibleList.sort((a, b) => b.date.localeCompare(a.date));
    return eligibleList;
  },

  recordAttendance({ empId, name, date = null, type = 'MASUK', category = 'biasa', replacedDate = null, reason = '', shiftId = null, photo = '', location = '', notes = '' }) {
    const logs = this.getAttendanceLogs();
    const employees = this.getEmployees();
    const shifts = this.getShifts();

    let employee = employees.find(e => e.id === empId);
    if (!employee) {
      employee = { id: empId, name: name || 'Anggota ' + empId, dept: 'KSPM' };
    }

    const now = new Date();
    const recordDate = date || getTodayString(0);
    const recordTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let assignedShiftId = shiftId;
    if (!assignedShiftId) {
      const currentHour = now.getHours();
      assignedShiftId = (currentHour < 12) ? 'shift_pagi' : 'shift_siang';
    }

    // Validasi batas 1 bulan untuk piket pengganti
    if ((category === 'pengganti' || (category === 'sukarela' && replacedDate)) && replacedDate) {
      const valResult = this.validateReplacementDate(replacedDate, recordDate);
      if (!valResult.valid) {
        console.warn(`[AttendanceDB] Validasi Batas Penggantian Ditolak: ${valResult.message}`);
        throw new Error(valResult.message);
      }
    }

    let finalStatus = 'HADIR';
    if (type === 'IZIN' || category === 'izin') {
      finalStatus = 'IZIN';
    } else if (type === 'PULANG') {
      finalStatus = 'SELESAI';
    } else {
      finalStatus = 'SEDANG_BERTUGAS';
    }

    let defaultNotes = 'Presensi Piket Terverifikasi';
    if (category === 'pengganti' && replacedDate) {
      defaultNotes = `Piket Pengganti (Mengganti piket tanggal ${replacedDate})`;
    } else if (category === 'sukarela') {
      if (replacedDate) {
        defaultNotes = `Piket Sukarela/Main (Mengganti piket tanggal ${replacedDate})`;
      } else {
        defaultNotes = 'Piket Sukarela / Main (Masuk Tanpa Jadwal)';
      }
    } else if (category === 'izin' && reason) {
      defaultNotes = `Izin Piket: ${reason}`;
    }

    // Validasi Wajib: Tidak bisa melakukan Presensi Pulang jika belum pernah ada Presensi Masuk di tanggal yang sama
    if (type === 'PULANG') {
      const hasMasuk = logs.some(l => l.empId === empId && l.date === recordDate && l.type === 'MASUK');
      if (!hasMasuk) {
        const errMsg = `Presensi Pulang ditolak: ${employee.name} belum melakukan Presensi Masuk (Berangkat) pada tanggal ${recordDate}.`;
        console.warn(`[AttendanceDB] ${errMsg}`);
        throw new Error(errMsg);
      }
    }

    const logId = 'ATT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const rawPhoto = photo || '';
    const newLog = {
      id: logId,
      empId: empId,
      name: employee.name,
      date: recordDate,
      time: recordTime,
      type: type, // 'MASUK' | 'PULANG' | 'IZIN'
      category: category || 'biasa',
      replacedDate: replacedDate,
      reason: reason,
      status: finalStatus,
      shiftId: assignedShiftId,
      location: location || 'Galeri Investasi Unsoed',
      photo: rawPhoto.startsWith('http') ? rawPhoto : '',
      notes: notes || defaultNotes
    };

    logs.unshift(newLog);
    try {
      localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(logs));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Kirim langsung ke Supabase Realtime Database (~30ms)
    this.postToSupabase('attendance', {
      id: newLog.id,
      emp_id: newLog.empId,
      name: newLog.name,
      date: newLog.date,
      time: newLog.time,
      type: newLog.type,
      category: newLog.category,
      replaced_date: newLog.replacedDate || null,
      reason: newLog.reason || '',
      status: newLog.status,
      shift_id: newLog.shiftId,
      location: newLog.location,
      photo: rawPhoto.startsWith('http') ? rawPhoto : '',
      notes: newLog.notes
    });

    // Upload foto ke Google Drive secara Asynchronous (Non-Blocking) dengan penamaan rapi
    if (rawPhoto && rawPhoto.startsWith('data:image')) {
      this.uploadPhotoToGoogleDrive(newLog.id, rawPhoto, newLog.name, employee.dept, newLog.type, newLog.date, newLog.time);
    }

    return newLog;
  },

  getDailyMonitoring(dateStr = null) {
    const targetDate = dateStr || getTodayString(0);
    const employees = this.getEmployees();
    const schedules = this.getSchedules(targetDate);
    const logs = this.getAttendanceLogs(targetDate);
    const shifts = this.getShifts();

    const holidayInfo = this.isHoliday(targetDate);

    const isDatePassed = targetDate < getTodayString(0);

    const monitoringList = [];
    let countHadir = 0;
    let countIzin = 0;
    let countAlpa = 0;

    schedules.forEach(schedule => {
      const emp = employees.find(e => e.id === schedule.empId) || {
        id: schedule.empId,
        name: 'Pengurus ' + schedule.empId,
        role: 'Anggota KSPM',
        dept: 'KSPM',
        avatar: 'KP',
        color: 'from-gray-600 to-gray-700'
      };

      const shift = shifts.find(s => s.id === schedule.shiftId) || shifts[0];
      const empLogs = logs.filter(l => l.empId === schedule.empId);
      
      const masukLog = empLogs.find(l => l.type === 'MASUK');
      const pulangLog = empLogs.find(l => l.type === 'PULANG');
      const izinLog = empLogs.find(l => l.type === 'IZIN');
      const activeLog = masukLog || pulangLog || izinLog;

      let currentStatus = 'TIDAK_HADIR';
      let timeMasuk = masukLog ? masukLog.time : '-';
      let timePulang = pulangLog ? pulangLog.time : '-';
      let notes = schedule.notes || '-';
      let photo = masukLog ? masukLog.photo : (pulangLog ? pulangLog.photo : (izinLog ? izinLog.photo : null));
      let location = masukLog ? masukLog.location : (pulangLog ? pulangLog.location : '-');
      const attendanceId = masukLog ? masukLog.id : (pulangLog ? pulangLog.id : (izinLog ? izinLog.id : null));
      const attendanceIds = empLogs.map(l => l.id);

      let driveFolder = masukLog?.driveFolder || pulangLog?.driveFolder || (photo && photo.includes('drive.google.com') ? photo : null);
      if (!driveFolder && (masukLog?.notes || pulangLog?.notes)) {
        const combinedNotes = (masukLog?.notes || '') + ' ' + (pulangLog?.notes || '');
        const match = combinedNotes.match(/\[DriveFolder:\s*(https:\/\/[^\]]+)\]/);
        if (match) driveFolder = match[1];
      }

      if (holidayInfo) {
        currentStatus = 'BEBAS_TUGAS';
        notes = `Hari Libur: ${holidayInfo.name}`;
      } else if (izinLog) {
        currentStatus = 'IZIN';
        notes = izinLog.reason || izinLog.notes || 'Izin piket terverifikasi';
        countIzin++;
      } else if (pulangLog) {
        currentStatus = 'SELESAI';
        countHadir++;
      } else if (masukLog) {
        currentStatus = 'SEDANG_BERTUGAS';
        countHadir++;
      } else {
        currentStatus = 'TIDAK_HADIR';
        countAlpa++;
      }

      monitoringList.push({
        scheduleId: schedule.id,
        empId: emp.id,
        name: emp.name,
        role: emp.role,
        dept: emp.dept,
        avatar: emp.avatar,
        color: emp.color,
        shift: shift,
        category: activeLog?.category || schedule.category || 'biasa',
        replacedDate: activeLog?.replacedDate || schedule.replacedDate || null,
        status: currentStatus,
        timeMasuk: timeMasuk,
        timePulang: timePulang,
        photo: photo,
        location: location,
        notes: notes,
        attendanceId: attendanceId,
        attendanceIds: attendanceIds,
        driveFolder: driveFolder,
        hasAttended: !!(masukLog || pulangLog || izinLog)
      });
    });

    // Cek apakah ada anggota yang absen tanpa jadwal (Piket Sukarela / Main / Walk-in / Pengganti)
    logs.forEach(log => {
      const alreadyInList = monitoringList.some(item => item.empId === log.empId);
      if (!alreadyInList) {
        const emp = employees.find(e => e.id === log.empId) || {
          id: log.empId,
          name: log.name,
          role: 'Anggota KSPM',
          dept: 'KSPM',
          avatar: 'KP',
          color: 'from-gray-600 to-gray-700'
        };
        const shift = shifts.find(s => s.id === log.shiftId) || shifts[0];

        if (log.type === 'IZIN') {
          countIzin++;
        } else {
          countHadir++;
        }

        let driveFolder = log.driveFolder || (log.photo && log.photo.includes('drive.google.com') ? log.photo : null);
        if (!driveFolder && log.notes) {
          const match = log.notes.match(/\[DriveFolder:\s*(https:\/\/[^\]]+)\]/);
          if (match) driveFolder = match[1];
        }

        let autoCategory = log.category;
        if (!autoCategory || autoCategory === 'biasa') {
          autoCategory = log.replacedDate ? 'pengganti' : 'sukarela';
        }

        let autoNotes = log.notes;
        if (!autoNotes) {
          if (autoCategory === 'pengganti' && log.replacedDate) {
            autoNotes = `Piket Pengganti (Mengganti tanggal ${log.replacedDate})`;
          } else {
            autoNotes = 'Piket Sukarela / Main';
          }
        }

        monitoringList.push({
          scheduleId: null,
          empId: emp.id,
          name: emp.name,
          role: emp.role,
          dept: emp.dept,
          avatar: emp.avatar,
          color: emp.color,
          shift: shift,
          category: autoCategory,
          replacedDate: log.replacedDate,
          status: log.status,
          timeMasuk: log.type === 'MASUK' ? log.time : '-',
          timePulang: log.type === 'PULANG' ? log.time : '-',
          photo: log.photo,
          location: log.location,
          notes: autoNotes,
          attendanceId: log.id,
          attendanceIds: [log.id],
          driveFolder: driveFolder,
          hasAttended: true,
          isWalkIn: true
        });
      }
    });

    return {
      date: targetDate,
      isHoliday: !!holidayInfo,
      holiday: holidayInfo,
      counts: {
        totalScheduled: schedules.length,
        hadir: countHadir,
        izin: countIzin,
        alpa: holidayInfo ? 0 : countAlpa
      },
      monitoringList: monitoringList
    };
  },

  getMonthCalendarStats(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const statsMap = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, '0');
      const monthStr = String(month).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      const daily = this.getDailyMonitoring(dateStr);
      const hol = this.isHoliday(dateStr);

      statsMap[dateStr] = {
        date: dateStr,
        total: daily.counts.totalScheduled,
        hadir: daily.counts.hadir,
        alpa: daily.counts.alpa,
        izin: daily.counts.izin,
        monitoringList: daily.monitoringList,
        isHoliday: !!hol,
        holidayName: hol ? hol.name : null
      };
    }

    return statsMap;
  },

  getDivisionPerformanceStats(startDate = null, endDate = null, yearMonth = null) {
    const depts = this.getDepartments();
    const employees = this.getEmployees();
    const schedules = this.getSchedules();
    const attendanceLogs = this.getAttendanceLogs();

    if (yearMonth && !startDate && !endDate) {
      const [yStr, mStr] = yearMonth.split('-');
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10);
      const days = new Date(y, m, 0).getDate();
      startDate = `${yStr}-${mStr}-01`;
      endDate = `${yStr}-${mStr}-${String(days).padStart(2, '0')}`;
    }

    return depts.map(deptName => {
      const deptMembers = employees.filter(e => e.dept === deptName);
      const memberIds = new Set(deptMembers.map(m => m.id));

      let deptSchedules = schedules.filter(s => memberIds.has(s.empId));
      if (startDate && endDate) {
        deptSchedules = deptSchedules.filter(s => s.date >= startDate && s.date <= endDate);
      }

      let deptLogs = attendanceLogs.filter(l => memberIds.has(l.empId));
      if (startDate && endDate) {
        deptLogs = deptLogs.filter(l => l.date >= startDate && l.date <= endDate);
      }

      const totalMembers = deptMembers.length;
      let totalHadirSesi = 0;
      let totalIzin = 0;
      let totalAlpa = 0;
      let activeMembersCount = 0; // Anggota yang rajin/aktif piket (memiliki sesi hadir sah)
      let quotaFulfilledCount = 0; // Anggota yang telah memenuhi kuota bulanan (min. 8 sesi)

      deptMembers.forEach(emp => {
        const empLogs = deptLogs.filter(l => l.empId === emp.id);
        const empSchedules = deptSchedules.filter(s => s.empId === emp.id);

        const empCompletedSessions = this.countCompletedSessions(emp.id, empLogs, startDate, endDate);
        totalHadirSesi += empCompletedSessions;

        const empIzin = empLogs.filter(l => l.type === 'IZIN' || l.status === 'IZIN').length;
        totalIzin += empIzin;

        empSchedules.forEach(sch => {
          const hasSession = this.hasCompletedSessionOnDate(emp.id, empLogs, sch.date);
          const hasIzin = empLogs.some(l => l.date === sch.date && (l.type === 'IZIN' || l.status === 'IZIN'));
          if (!hasSession && !hasIzin) totalAlpa++;
        });

        // Anggota dianggap aktif/rajin jika memiliki minimal 1 sesi hadir sah
        if (empCompletedSessions > 0) {
          activeMembersCount++;
        }
        if (empCompletedSessions >= 8) {
          quotaFulfilledCount++;
        }
      });

      // Keaktifan Departemen diukur dari persentase anggota yang rajin piket
      const activeMemberPercent = totalMembers > 0 ? Math.round((activeMembersCount / totalMembers) * 100) : 0;
      const avgSessionsPerMember = totalMembers > 0 ? (totalHadirSesi / totalMembers).toFixed(1) : '0';
      const totalSlots = deptSchedules.length;

      // Skor Gabungan Keaktifan Departemen (Weighted Activity Index)
      const activityScore = (activeMemberPercent * 100) + (totalHadirSesi * 10);

      return {
        deptName,
        memberCount: totalMembers,
        activeMembersCount,
        activeMemberPercent,
        avgSessionsPerMember,
        quotaFulfilledCount,
        totalSlots,
        hadirCount: totalHadirSesi,
        izinCount: totalIzin,
        alpaCount: totalAlpa,
        ratePercent: activeMemberPercent, // Keaktifan Utama = % Anggota yang Rajin Piket!
        activityScore
      };
    });
  },

  getFilteredAttendanceReport({ startDate = null, endDate = null, dept = 'ALL', status = 'ALL' } = {}) {
    const employees = this.getEmployees();
    const schedules = this.getSchedules();
    const logs = this.getAttendanceLogs();

    let allDates = new Set();
    schedules.forEach(s => {
      if ((!startDate || s.date >= startDate) && (!endDate || s.date <= endDate)) {
        allDates.add(s.date);
      }
    });
    logs.forEach(l => {
      if ((!startDate || l.date >= startDate) && (!endDate || l.date <= endDate)) {
        allDates.add(l.date);
      }
    });

    const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));
    const reportRows = [];

    sortedDates.forEach(dateStr => {
      const daily = this.getDailyMonitoring(dateStr);
      daily.monitoringList.forEach(item => {
        if (dept !== 'ALL' && item.dept !== dept) return;
        if (status !== 'ALL' && item.status !== status) return;

        reportRows.push({
          date: dateStr,
          empId: item.empId,
          name: item.name,
          dept: item.dept,
          role: item.role,
          shiftName: item.shift.name,
          shiftTime: `${item.shift.start} - ${item.shift.end}`,
          category: item.category,
          replacedDate: item.replacedDate || null,
          status: item.status,
          timeMasuk: item.timeMasuk,
          timePulang: item.timePulang,
          photo: item.photo || '',
          location: item.location,
          notes: item.notes
        });
      });
    });

    return reportRows;
  },

  getMemberWeeklyRekap({ yearMonth = null, startDate = null, endDate = null, dept = 'ALL', search = '' } = {}) {
    let employees = this.getEmployees();
    const logs = this.getAttendanceLogs();

    if (dept && dept !== 'ALL') {
      employees = employees.filter(e => e.dept === dept);
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      employees = employees.filter(e => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
    }

    const today = getTodayString(0);
    const targetYM = yearMonth || today.substring(0, 7);
    const [yearStr, monthStr] = targetYM.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    const daysInMonth = new Date(year, month, 0).getDate();

    const formatD = (d) => `${yearStr}-${monthStr}-${String(d).padStart(2, '0')}`;

    const weekRanges = [
      { week: 1, label: 'Minggu 1', start: formatD(1), end: formatD(7), target: 2 },
      { week: 2, label: 'Minggu 2', start: formatD(8), end: formatD(14), target: 2 },
      { week: 3, label: 'Minggu 3', start: formatD(15), end: formatD(21), target: 2 },
      { week: 4, label: 'Minggu 4', start: formatD(22), end: formatD(daysInMonth), target: 2 }
    ];

    return employees.map(emp => {
      const empLogs = logs.filter(l => l.empId === emp.id);

      const weeksData = weekRanges.map(w => {
        let wLogs = empLogs.filter(l => l.date >= w.start && l.date <= w.end);
        if (startDate && endDate) {
          wLogs = wLogs.filter(l => l.date >= startDate && l.date <= endDate);
        }

        // 1 Sesi Sah = 1 Masuk + 1 Pulang Lengkap
        const hadirCount = this.countCompletedSessions(emp.id, wLogs);
        const izinCount = wLogs.filter(l => l.type === 'IZIN' || l.status === 'IZIN').length;
        
        // Sesi yang sedang berjalan (sudah Masuk tapi belum Pulang)
        const datesInWeek = Array.from(new Set(wLogs.map(l => l.date)));
        let ongoingCount = 0;
        datesInWeek.forEach(d => {
          const dLogs = wLogs.filter(l => l.date === d);
          const hasMasuk = dLogs.some(l => l.type === 'MASUK');
          const hasPulang = dLogs.some(l => l.type === 'PULANG');
          const isSelesai = dLogs.some(l => l.status === 'SELESAI' || l.status === 'HADIR');
          if (hasMasuk && !hasPulang && !isSelesai) {
            ongoingCount++;
          }
        });

        const target = w.target;
        const extra = Math.max(0, hadirCount - target);
        const missing = Math.max(0, target - hadirCount);
        const isComplete = hadirCount >= target;

        return {
          week: w.week,
          label: w.label,
          range: `${w.start.substring(8)} - ${w.end.substring(8)}`,
          hadirCount,
          ongoingCount,
          izinCount,
          target,
          extra,
          missing,
          isComplete
        };
      });

      const totalHadir = weeksData.reduce((acc, w) => acc + w.hadirCount, 0);
      const totalOngoing = weeksData.reduce((acc, w) => acc + (w.ongoingCount || 0), 0);
      const totalIzin = weeksData.reduce((acc, w) => acc + w.izinCount, 0);
      const totalTarget = 8;
      const totalExtra = Math.max(0, totalHadir - totalTarget);
      const totalMissing = Math.max(0, totalTarget - totalHadir);
      const completionRate = Math.min(100, Math.round((totalHadir / totalTarget) * 100));
      const isQuotaFulfilled = totalHadir >= totalTarget;

      return {
        ...emp,
        weeks: weeksData,
        totalHadir,
        totalOngoing,
        totalIzin,
        totalTarget,
        totalExtra,
        totalMissing,
        completionRate,
        isQuotaFulfilled
      };
    });
  },

  isSystemPaused() {
    try {
      const data = localStorage.getItem('kspm_system_paused');
      if (!data) return false;
      const parsed = JSON.parse(data);
      return !!parsed.isPaused;
    } catch (e) {
      return false;
    }
  },

  getSystemPauseInfo() {
    try {
      const data = localStorage.getItem('kspm_system_paused');
      if (!data) return { isPaused: false, reason: '', pausedAt: null };
      return JSON.parse(data);
    } catch (e) {
      return { isPaused: false, reason: '', pausedAt: null };
    }
  },

  setSystemPaused(paused, reason = 'Masa Libur Perkuliahan') {
    const pauseData = {
      isPaused: !!paused,
      reason: reason || 'Masa Libur Perkuliahan',
      pausedAt: paused ? new Date().toISOString() : null
    };
    localStorage.setItem('kspm_system_paused', JSON.stringify(pauseData));
    this.postToSupabase('settings', [
      { key: 'SYSTEM_PAUSED', value: paused ? 'TRUE' : 'FALSE' },
      { key: 'SYSTEM_PAUSE_REASON', value: reason || 'Masa Libur Perkuliahan' }
    ]);
    return pauseData;
  },

  // --- FITUR INGAT IDENTITAS SAYA ---
  getSavedIdentity() {
    try {
      const data = localStorage.getItem('kspm_saved_identity');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveIdentity(dept, empId) {
    localStorage.setItem('kspm_saved_identity', JSON.stringify({ dept, empId }));
  },

  clearSavedIdentity() {
    localStorage.removeItem('kspm_saved_identity');
  }
};

// Export ke window
window.AttendanceDB = AttendanceDB;
window.getTodayString = getTodayString;

// Inisialisasi awal saat script dimuat
AttendanceDB.init();
