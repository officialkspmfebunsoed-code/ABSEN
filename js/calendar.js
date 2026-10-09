/**
 * Interactive Calendar Component - KSPM
 * Menampilkan kalender visual kehadiran, jadwal sesi piket, dan pemilihan tanggal
 */

class AttendanceCalendar {
  static instances = {};

  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.instanceId = 'cal_' + Math.random().toString(36).substring(2, 9);
    AttendanceCalendar.instances[this.instanceId] = this;

    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth(); // 0-indexed
    this.selectedDate = options.defaultSelectedDate || (window.getTodayString ? window.getTodayString(0) : new Date().toISOString().split('T')[0]);
    this.options = Object.assign({
      onDateClick: null,
      onDateSelect: null,
      showControls: true,
      compact: false,
      emptyMode: false, // true = render kalender kosong tanpa memuat data (ringan)
      deptName: null    // filter data per departemen
    }, options);

    this.monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    this.dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.fetchMonthData();
  }

  async fetchMonthData() {
    if (!window.AttendanceDB) return;
    const yStr = this.currentYear;
    const mStr = String(this.currentMonth + 1).padStart(2, '0');
    const start = `${yStr}-${mStr}-01`;
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const end = `${yStr}-${mStr}-${daysInMonth}`;
    await window.AttendanceDB.fetchDataRange(start, end);
    this.render();
  }

  async prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.render();
    await this.fetchMonthData();
  }

  async nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.render();
    await this.fetchMonthData();
  }

  async goToToday() {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();
    this.selectedDate = window.getTodayString ? window.getTodayString(0) : now.toISOString().split('T')[0];
    this.render();
    if (this.options.onDateSelect) {
      this.options.onDateSelect(this.selectedDate);
    }
    await this.fetchMonthData();
  }

  selectDate(dateStr) {
    this.selectedDate = dateStr;
    this.render();
    if (this.options.onDateSelect) {
      this.options.onDateSelect(dateStr);
    }
  }

  /**
   * Klasifikasi status item monitoring -> 'hadir' | 'izin' | 'alpa' | 'pending' | 'libur'
   * pending = terjadwal tapi belum lewat (hari ini / mendatang), tidak dihitung alpa.
   */
  static classifyItem(item, dateStr, todayStr) {
    if (item.category === 'pengganti' && item.isWalkIn) return 'pengganti';
    const st = String(item.status || '').toUpperCase();
    if (st === 'BEBAS_TUGAS') return 'libur';
    if (st.includes('IZIN') || st === 'SAKIT') return 'izin';
    if (st === 'SELESAI' || st === 'SELESAI_PIKET' || st === 'SEDANG_BERTUGAS' || st === 'HADIR' || st === 'TEPAT_WAKTU') return 'hadir';
    if (item.isWalkIn || item.hasAttended) return 'hadir';
    return dateStr < todayStr ? 'alpa' : 'pending';
  }

  render(useCache = false) {
    if (!this.container) {
      this.container = document.getElementById(this.containerId);
      if (!this.container) return;
    }

    const cacheKey = `${this.currentYear}-${this.currentMonth}`;
    let statsMap = {};
    if (!this.options.emptyMode && window.AttendanceDB) {
      if (useCache && this._cache && this._cache.key === cacheKey) {
        statsMap = this._cache.statsMap;
      } else {
        statsMap = window.AttendanceDB.getMonthCalendarStats(this.currentYear, this.currentMonth + 1);
        this._cache = { key: cacheKey, statsMap };
      }
    }
    const monthData = {};
    const todayStr = window.getTodayString ? window.getTodayString(0) : new Date().toISOString().split('T')[0];

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const startingDay = (firstDay === 0) ? 6 : firstDay - 1; // 0 = Senin, 6 = Minggu
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    let html = `
      <div class="calendar-wrapper w-full select-none">
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2 sm:gap-3">
            <h3 class="text-sm sm:text-base md:text-lg font-black text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
              <i data-feather="calendar" class="w-4 h-4 text-red-500"></i>
              <span>${this.monthNames[this.currentMonth]} ${this.currentYear}</span>
            </h3>
            <button onclick="AttendanceCalendar.instances['${this.instanceId}'].goToToday()" class="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-400 dark:hover:bg-red-900/60 transition">
              Hari Ini
            </button>
          </div>

          <div class="flex items-center gap-1">
            <button onclick="AttendanceCalendar.instances['${this.instanceId}'].prevMonth()" class="p-1.5 sm:p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#181d26] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition" title="Bulan Sebelumnya">
              <i data-feather="chevron-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
            </button>
            <button onclick="AttendanceCalendar.instances['${this.instanceId}'].nextMonth()" class="p-1.5 sm:p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#181d26] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition" title="Bulan Berikutnya">
              <i data-feather="chevron-right" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
            </button>
          </div>
        </div>

        <!-- Legend / Keterangan Warna (Tanpa Terlambat) -->
        ${this.options.showLegend === false ? '' : `<div class="flex items-center gap-3 sm:gap-5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 flex-wrap bg-gray-100/70 dark:bg-[#181d26] p-2 sm:p-2.5 rounded-xl border border-gray-200/80 dark:border-gray-800">
          <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span> <span>Sudah Piket / Selesai</span></div>
          <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span> <span>Izin Piket</span></div>
          <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span> <span>Belum Piket (Alpa)</span></div>
          <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span> <span>Hari Libur (Bebas Tugas)</span></div>
        </div>`}

        <!-- Day Names Grid (7 cols) -->
        <div class="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5 text-center text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          ${this.dayNames.map(d => `<div class="py-1">${d}</div>`).join('')}
        </div>

        <!-- Calendar Days Grid -->
        <div class="grid grid-cols-7 gap-1 sm:gap-1.5">
    `;

    // Blank cells before first day
    for (let i = 0; i < startingDay; i++) {
      html += `<div class="bg-gray-50/20 dark:bg-gray-900/20 rounded-xl min-h-[48px] sm:min-h-[64px] md:min-h-[76px] opacity-20 border border-dashed border-gray-200 dark:border-gray-800"></div>`;
    }

    // Actual day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let dayData = statsMap[dateStr] || { totalScheduled: 0, hadir: 0, alpa: 0, izin: 0, monitoringList: [], isHoliday: false, holidayName: null };
      if (dayData.totalScheduled === undefined) dayData.totalScheduled = dayData.total || 0;

      // Filter untuk Monitoring per Departemen / per Orang
      if (this.options.deptName || this.options.empId) {
        const list = (dayData.monitoringList || []).filter(x =>
          this.options.empId ? x.empId === this.options.empId : x.dept === this.options.deptName);
        let hadir = 0, izin = 0, alpa = 0, pengganti = 0;
        let isReplaced = false;
        let schedList = list.filter(x => {
          const c = AttendanceCalendar.classifyItem(x, dateStr, todayStr);
          return c !== 'pengganti' && c !== 'libur';
        });
        list.forEach(x => {
          const c = AttendanceCalendar.classifyItem(x, dateStr, todayStr);
          if (c === 'hadir') {
            hadir++;
            if (x.isReplaced) isReplaced = true;
          }
          else if (c === 'izin') izin++;
          else if (c === 'alpa') alpa++;
          else if (c === 'pengganti') pengganti++;
        });
        dayData = { ...dayData, totalScheduled: schedList.length, hadir, izin, alpa, pengganti, isReplaced, monitoringList: list };
      }
      monthData[dateStr] = dayData;

      const isToday = dateStr === todayStr;
      const isSelected = dateStr === this.selectedDate;

      let statusBadge = '';
      let indicators = '';

      if (dayData.isHoliday) {
        statusBadge = `<span class="inline-block text-[8px] sm:text-[9px] px-1 py-0.2 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-extrabold" title="${dayData.holidayName || 'Hari Libur'}">Libur</span>`;
      } else if (this.options.empId && dayData.totalScheduled > 0) {
        // Mode personal: label kata yang jelas
        const base = 'inline-block text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-md font-extrabold';
        if (dayData.alpa > 0) statusBadge = `<span class="${base} bg-red-600 text-white">Alpa</span>`;
        else if (dayData.izin > 0 && dayData.hadir === 0) statusBadge = `<span class="${base} bg-blue-600 text-white">Izin</span>`;
        else if (dayData.hadir > 0) {
          if (dayData.isReplaced) {
            statusBadge = `<span class="${base} bg-blue-600 text-white">Diganti</span>`;
          } else {
            statusBadge = `<span class="${base} bg-emerald-600 text-white">Hadir</span>`;
          }
        }
        else statusBadge = `<span class="${base} bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100">Jadwal</span>`;
      } else if (this.options.empId && dayData.pengganti > 0) {
        statusBadge = `<span class="inline-block text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-md font-extrabold bg-amber-600 text-white">Pengganti</span>`;
      } else if (dayData.totalScheduled > 0) {
        indicators = '<div class="flex items-center justify-center gap-1 mt-0.5 sm:mt-1 flex-wrap">';
        if (dayData.hadir > 0) indicators += `<span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 flex-shrink-0" title="${dayData.hadir} Hadir"></span>`;
        if (dayData.alpa > 0) indicators += `<span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" title="${dayData.alpa} Belum Absen"></span>`;
        if (dayData.izin > 0) indicators += `<span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 flex-shrink-0" title="${dayData.izin} Izin"></span>`;
        indicators += '</div>';

        if (dayData.alpa > 0) {
          statusBadge = `<span class="hidden sm:inline-block text-[9px] px-1 py-0.2 rounded bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 font-bold">${dayData.alpa} Alpa</span>`;
        } else if (dayData.hadir > 0) {
          statusBadge = `<span class="hidden sm:inline-block text-[9px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 font-bold">${dayData.hadir}/${dayData.totalScheduled}</span>`;
        } else {
          statusBadge = `<span class="hidden sm:inline-block text-[9px] px-1 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">${dayData.totalScheduled}</span>`;
        }
      }

      let cellClasses = 'calendar-day-cell cursor-pointer p-1 sm:p-2 rounded-xl sm:rounded-2xl border transition-all flex flex-col justify-between min-h-[48px] sm:min-h-[64px] md:min-h-[76px] ';
      if (isSelected) {
        cellClasses += 'ring-2 ring-red-500 border-red-500 bg-red-500/10 shadow-md ';
      } else if (isToday) {
        cellClasses += 'border-red-400/60 bg-red-50/50 dark:bg-red-950/20 ';
      } else if (dayData.isHoliday) {
        cellClasses += 'border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/15 hover:bg-rose-100/40 ';
      } else {
        cellClasses += 'bg-white dark:bg-[#141822] hover:bg-gray-50 dark:hover:bg-[#181e2b] border-gray-200 dark:border-gray-800 ';
      }

      html += `
        <div onclick="AttendanceCalendar.instances['${this.instanceId}'].handleDayClick('${dateStr}')"
             class="${cellClasses}" ${dayData.isHoliday ? `title="Hari Libur: ${dayData.holidayName}"` : ''}>
          <div class="flex items-center justify-between">
            <span class="text-[11px] sm:text-xs font-bold ${isToday ? 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] sm:text-[10px]' : (dayData.isHoliday ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-gray-800 dark:text-gray-200')}">
              ${day}
            </span>
            ${dayData.totalScheduled > 0 && !dayData.isHoliday && !this.options.empId ? `<span class="text-[8px] sm:text-[9px] text-gray-400 font-medium font-mono">${dayData.totalScheduled}p</span>` : ''}
          </div>

          <div class="my-0.5 text-center">
            ${statusBadge}
            ${indicators}
          </div>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    if (window.feather) {
      window.feather.replace();
    }

    if (typeof this.options.onRender === 'function') {
      this.options.onRender({ year: this.currentYear, month: this.currentMonth, monthData, emptyMode: !!this.options.emptyMode });
    }
  }

  handleDayClick(dateStr) {
    this.selectedDate = dateStr;
    this.render(true);

    if (this.options.onDateSelect) {
      this.options.onDateSelect(dateStr);
    } else if (this.options.onDateClick) {
      this.options.onDateClick(dateStr);
    }
  }
}

window.AttendanceCalendar = AttendanceCalendar;
