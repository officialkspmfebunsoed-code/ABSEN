const SUPABASE_URL = 'https://kkkkqrgbxaphjizuumzp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rBFfkW_aA6D8BCslLFWT6w_1A4hCkHw'; 

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

const WEEKLY_ROSTER = {
  1: { // Senin
    shift_pagi: [
      "Finna Erlinda", "Elmira Firzana Ghaisani", "Ari Dwi C", "Eka Setya Ramadhan", 
      "Alfaritzy Putra Januar", "Nurhayati", "Naya Dinda Irfani", "Galang Raya Rambo A.", "Nurul Homsatun"
    ],
    shift_siang: [
      "Athaya Nasywa B. N.", "Zulfikar Alkindi", "M. Abdur Rosyid", "Balqis Ghaliya Zafirah", 
      "Putro Aji Satrio", "Reza Rizki Saputra", "Nadiya Kautsar Uzmud", "Lili Purwati"
    ]
  },
  2: { // Selasa
    shift_pagi: [
      "Bakian Benzena W.", "Violetta Maylita Saffana", "Naswa Alia", "Mohammad Raffi R.", 
      "Devano Kefanya R. A.", "Sofiyah Karimah", "Rahma Wibawanty", "Eka Vina Saputri", "M. Nur Al-Fadhl"
    ],
    shift_siang: [
      "Mashara Raka W.", "Fidela Prastika Salsabila", "Febrianto", "Annaba Wulandara", 
      "Fatma Ayu Lestari", "Samuel Partogi", "Galang Raya Rambo A.", "Nasywa Putri Khalila", "Hanisah Aurelia Faustine"
    ]
  },
  3: { // Rabu
    shift_pagi: [
      "Benawa Kalam Ma'wa", "Safira Yunindya Putri", "Alfaritzy Putra Januar", "M. Abdur Rosyid", 
      "M. Hasby Nabil Ayyasy", "Reza Rizki Saputra", "Cyrilla Ivani Elysia H.", "M. Hanif Al Fatih", "Aulia Fitriana Kholifah"
    ],
    shift_siang: [
      "Finna Erlinda", "Fidela Prastika Salsabila", "Elmira Firzana Ghaisani", "Naisya Sherra Maksum", 
      "Melisa", "Sofiyah Karimah", "Mufiida Annaura", "Rahma Wibawanty", "Aisha Rasendriya P."
    ]
  },
  4: { // Kamis
    shift_pagi: [
      "Ari Dwi C", "Annaba Wulandara", "Zulfikar Alkindi", "Melisa", 
      "Naisya Sherra Maksum", "Putro Aji Satrio", "Hanisah Aurelia Faustine", "Nadiya Kautsar Uzmud", "Lili Purwati"
    ],
    shift_siang: [
      "Febrianto", "Bakian Benzena W.", "Violetta Maylita Saffana", "Devano Kefanya R. A.", 
      "Athaya Nasywa B. N.", "Aulia Fitriana Kholifah", "M. Nur Al-Fadhl", "Naya Dinda Irfani", "Nurhayati"
    ]
  },
  5: { // Jumat
    shift_pagi: [
      "Benawa Kalam Ma'wa", "Mashara Raka W.", "Eka Setya Ramadhan", "M. Hasby Nabil Ayyasy", 
      "Balqis Ghaliya Zafirah", "Samuel Partogi", "Aisha Rasendriya P.", "Nasywa Putri Khalila", "Mufiida Annaura"
    ],
    shift_siang: [
      "Safira Yunindya Putri", "Fatma Ayu Lestari", "Mohammad Raffi R.", "Naswa Alia", 
      "Cyrilla Ivani Elysia H.", "M. Hanif Al Fatih", "Nurul Homsatun", "Eka Vina Saputri"
    ]
  }
};

async function seedSchedules() {
  console.log("Fetching employees mapping...");
  let employees = [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/employees?select=id,name`, { headers });
    if (!res.ok) throw new Error("Failed to fetch employees: " + res.status);
    employees = await res.json();
  } catch (err) {
    console.error("Error fetching employees:", err);
    return;
  }
  
  const empMap = {};
  employees.forEach(e => {
    empMap[e.name.toLowerCase().trim()] = e.id;
  });

  function findEmpId(rawName) {
    let search = rawName.toLowerCase().trim();
    if (search.startsWith('m. ')) {
      search = search.replace('m. ', 'muhammad ');
    }
    if (empMap[search]) return empMap[search];
    // try partial matching
    for (const e of employees) {
      if (e.name.toLowerCase().includes(search) || search.includes(e.name.toLowerCase().split(' ')[0])) {
         return e.id;
      }
    }
    console.warn(`Could not map name: ${rawName}`);
    return null;
  }

  // Set start date to today
  const startDateStr = new Date().toISOString().split('T')[0];
  const startDate = new Date(startDateStr); // e.g. Oct 8
  const endDate = new Date('2027-01-31'); 
  
  console.log(`Deleting existing schedules from ${startDateStr} onwards...`);
  try {
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/schedules?date=gte.${startDateStr}`, {
      method: 'DELETE',
      headers
    });
    if (!delRes.ok) console.error("Error deleting old schedules:", await delRes.text());
  } catch(e) {
    console.error("Delete error:", e);
  }

  console.log("Generating new schedules...");
  const payloads = [];
  
  let curr = new Date(startDate);
  while(curr <= endDate) {
    const day = curr.getDay(); // 0 = Sunday, 1 = Monday ... 5 = Friday
    
    if (WEEKLY_ROSTER[day]) {
      const dateStr = curr.toISOString().split('T')[0];
      
      for (const name of WEEKLY_ROSTER[day].shift_pagi) {
        const empId = findEmpId(name);
        if (empId) {
          payloads.push({
            id: 'sch_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
            emp_id: empId,
            date: dateStr,
            shift_id: 'shift_pagi',
            category: 'biasa'
          });
        }
      }
      
      for (const name of WEEKLY_ROSTER[day].shift_siang) {
        const empId = findEmpId(name);
        if (empId) {
          payloads.push({
            id: 'sch_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
            emp_id: empId,
            date: dateStr,
            shift_id: 'shift_siang',
            category: 'biasa'
          });
        }
      }
    }
    curr.setDate(curr.getDate() + 1);
  }

  console.log(`Total schedules to insert: ${payloads.length}`);
  
  const batchSize = 1000;
  for (let i = 0; i < payloads.length; i += batchSize) {
    const batch = payloads.slice(i, i + batchSize);
    console.log(`Inserting batch ${i} to ${i + batch.length}...`);
    try {
      const insRes = await fetch(`${SUPABASE_URL}/rest/v1/schedules`, {
        method: 'POST',
        headers: {
            ...headers,
            'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(batch)
      });
      if (!insRes.ok) console.error("Error inserting batch:", await insRes.text());
    } catch(e) {
      console.error("Insert error:", e);
    }
  }
  
  console.log("Done!");
}

seedSchedules();
