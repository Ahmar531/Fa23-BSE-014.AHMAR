import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

const FORCE_MOCK = true; // Temporary fix to bypass broken Vercel Supabase integration

// Check if using placeholder or real client
const isRealConfigured = !FORCE_MOCK && supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseAnonKey && !supabaseAnonKey.includes('placeholder');

let realSupabase = null;
if (isRealConfigured) {
  try {
    realSupabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn("Failed to initialize real Supabase client:", e);
  }
}

// ==========================================
// MOCK DATABASE & FALLBACK IMPLEMENTATION
// ==========================================
const SEED_DOCTORS = [
  { id: 'doc-1', user_id: 'usr-doc-1', specialization: 'Cardiologist', treatment_type: 'Allopathic', city: 'Lahore', consultation_fee: 2000, experience_years: 12, rating: 4.9, bio: 'Specialist in heart conditions and preventive cardiology.', is_approved: true, is_available: true },
  { id: 'doc-2', user_id: 'usr-doc-2', specialization: 'General Physician', treatment_type: 'Homeopathic', city: 'Karachi', consultation_fee: 1200, experience_years: 8, rating: 4.7, bio: 'Experienced homeopathic practitioner for chronic diseases.', is_approved: true, is_available: true },
  { id: 'doc-3', user_id: 'usr-doc-3', specialization: 'Dermatologist', treatment_type: 'Herbal', city: 'Islamabad', consultation_fee: 1800, experience_years: 10, rating: 4.8, bio: 'Natural skincare and herbal remedies for all skin conditions.', is_approved: true, is_available: true },
  { id: 'doc-4', user_id: 'usr-doc-4', specialization: 'Neurologist', treatment_type: 'Allopathic', city: 'Lahore', consultation_fee: 3000, experience_years: 15, rating: 4.6, bio: 'Specializing in brain, spine, and nervous system health.', is_approved: true, is_available: true }
];

const SEED_USERS = [
  { id: 'usr-doc-1', email: 'ayesha@doctor.com', full_name: 'Dr. Ayesha Khan', phone: '0300-1112223', role: 'doctor', created_at: new Date().toISOString() },
  { id: 'usr-doc-2', email: 'hamid@doctor.com', full_name: 'Dr. Hamid Ali', phone: '0300-4445556', role: 'doctor', created_at: new Date().toISOString() },
  { id: 'usr-doc-3', email: 'sadia@doctor.com', full_name: 'Dr. Sadia Noor', phone: '0300-7778889', role: 'doctor', created_at: new Date().toISOString() },
  { id: 'usr-doc-4', email: 'bilal@doctor.com', full_name: 'Dr. Bilal Ahmed', phone: '0300-9990001', role: 'doctor', created_at: new Date().toISOString() },
  { id: 'usr-patient', email: 'patient@patient.com', full_name: 'Muhammad Ahmed', phone: '0333-1234567', role: 'patient', created_at: new Date().toISOString() },
  { id: 'usr-assistant', email: 'assistant@assistant.com', full_name: 'Zahid Malik', phone: '0321-7654321', role: 'assistant', created_at: new Date().toISOString() },
  { id: 'usr-admin', email: 'admin@admin.com', full_name: 'Admin Hub', phone: '0300-0000000', role: 'admin', created_at: new Date().toISOString() },
  { id: 'usr-superadmin', email: 'superadmin@superadmin.com', full_name: 'Super Admin Control', phone: '0300-9999999', role: 'super_admin', created_at: new Date().toISOString() }
];

const getLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing localStorage for', key, e);
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage.setItem failed:', e);
  }
};

const getDB = () => ({
  users: getLocalStorage('dh_users', SEED_USERS) || SEED_USERS,
  doctors: getLocalStorage('dh_doctors', SEED_DOCTORS) || SEED_DOCTORS,
  clinics: getLocalStorage('dh_clinics', [
    { id: 'clinic-1', doctor_id: 'usr-doc-1', name: 'Metro Heart Center', address: 'Jail Road, Gulberg', city: 'Lahore', schedule: 'Mon-Fri 4PM-8PM', fee: 2000 },
    { id: 'clinic-2', doctor_id: 'usr-doc-2', name: 'Ali Homeo Clinic', address: 'Clifton Block 5', city: 'Karachi', schedule: 'Tue-Sat 2PM-6PM', fee: 1200 }
  ]) || [],
  appointments: getLocalStorage('dh_appointments', []) || [],
  payments: getLocalStorage('dh_payments', []) || [],
  medical_history: getLocalStorage('dh_medical_history', []) || [],
  prescriptions: getLocalStorage('dh_prescriptions', []) || [],
  messages: getLocalStorage('dh_messages', []) || []
});

const saveDB = (db) => {
  Object.keys(db).forEach(key => {
    setLocalStorage(`dh_${key}`, db[key]);
  });
};

// Simple Mock Auth State
let mockSession = getLocalStorage('dh_session', null);

const mockAuth = {
  getSession: async () => ({ data: { session: mockSession }, error: null }),
  onAuthStateChange: (callback) => {
    const handler = (e) => {
      if (e.detail) {
        callback(e.detail.event, e.detail.session);
      }
    };
    window.addEventListener('dh_auth_change', handler);
    // Only fire SIGNED_IN if a valid session exists; otherwise signal no session
    setTimeout(() => {
      if (mockSession && mockSession.user) {
        callback('SIGNED_IN', mockSession);
      } else {
        callback('SIGNED_OUT', null);
      }
    }, 0);
    return {
      data: {
        subscription: {
          unsubscribe: () => window.removeEventListener('dh_auth_change', handler)
        }
      }
    };
  },
  signUp: async ({ email }) => {
    const db = getDB();
    const existing = db.users.find(u => u.email === email);
    if (existing) return { data: null, error: new Error('User already exists') };

    const newUser = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      email,
      created_at: new Date().toISOString()
    };
    // Note: Actual saving to users table is done in RegisterPage.jsx after signUp
    // We mock that the auth signup creates the user record
    return { data: { user: newUser }, error: null };
  },
  signInWithPassword: async ({ email }) => {
    const db = getDB();
    const user = db.users.find(u => u.email === email);
    if (!user) return { data: null, error: new Error('User not found') };

    mockSession = { user, access_token: 'mock-jwt-token' };
    setLocalStorage('dh_session', mockSession);

    // Dispatch custom event
    const event = new CustomEvent('dh_auth_change', { detail: { event: 'SIGNED_IN', session: mockSession } });
    window.dispatchEvent(event);

    return { data: { user }, error: null };
  },
  signOut: async () => {
    mockSession = null;
    localStorage.removeItem('dh_session');
    const event = new CustomEvent('dh_auth_change', { detail: { event: 'SIGNED_OUT', session: null } });
    window.dispatchEvent(event);
    return { error: null };
  },
  resetPasswordForEmail: async () => {
    return { error: null };
  }
};

class MockQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.orderConfig = null;
    this.limitCount = null;
    this.singleRecord = false;
    this.countMode = null;
    this.action = 'SELECT';
    this.actionData = null;
  }

  select(_fields, options = {}) {
    this.countMode = options?.count || null;
    return this;
  }

  eq(field, value) {
    this.filters.push({ type: 'eq', field, value });
    return this;
  }

  in(field, values) {
    this.filters.push({ type: 'in', field, values });
    return this;
  }

  order(field, { ascending } = { ascending: true }) {
    this.orderConfig = { field, ascending };
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.singleRecord = true;
    return this;
  }

  maybeSingle() {
    this.singleRecord = true;
    return this;
  }

  async executeQuery(type, data = null) {
    const db = getDB();
    let list = db[this.table] || [];

    if (type === 'SELECT') {
      // Resolve joins dynamically
      if (this.table === 'doctors') {
        list = list.map(doc => {
          const u = db.users.find(usr => usr.id === doc.user_id || usr.id === doc.id);
          return { ...doc, users: u };
        });
      } else if (this.table === 'prescriptions') {
        list = list.map(p => {
          const h = db.medical_history.find(mh => mh.id === p.history_id);
          return { ...p, medical_history: h };
        });
      } else if (this.table === 'payments') {
        list = list.map(pay => {
          const a = db.appointments.find(apt => apt.id === pay.appointment_id);
          return { ...pay, appointments: a };
        });
      } else if (this.table === 'medical_history') {
        list = list.map(mh => {
          const prs = db.prescriptions.filter(p => p.history_id === mh.id);
          return { ...mh, prescriptions: prs };
        });
      }

      // Apply filters
      this.filters.forEach(filter => {
        if (filter.type === 'eq') {
          list = list.filter(item => item[filter.field] === filter.value);
        } else if (filter.type === 'in') {
          list = list.filter(item => filter.values.includes(item[filter.field]));
        }
      });

      // Apply ordering
      if (this.orderConfig) {
        const { field, ascending } = this.orderConfig;
        list.sort((a, b) => {
          const valA = a[field];
          const valB = b[field];
          if (valA < valB) return ascending ? -1 : 1;
          if (valA > valB) return ascending ? 1 : -1;
          return 0;
        });
      }

      // Apply limit
      if (this.limitCount !== null) {
        list = list.slice(0, this.limitCount);
      }

      if (this.singleRecord) {
        if (list.length === 0) return { data: null, error: new Error('Record not found'), count: this.countMode ? 0 : null };
        return { data: list[0], error: null };
      }

      return { data: list, error: null, count: this.countMode ? list.length : null };
    }

    if (type === 'INSERT' || type === 'UPSERT') {
      const actualData = type === 'UPSERT' ? data.data : data;
      const recordsToInsert = Array.isArray(actualData) ? actualData : [actualData];
      const inserted = [];

      recordsToInsert.forEach(item => {
        let isUpdate = false;
        if (type === 'UPSERT' && item.id) {
          const existingIndex = db[this.table].findIndex(r => r.id === item.id);
          if (existingIndex !== -1) {
            db[this.table][existingIndex] = { ...db[this.table][existingIndex], ...item };
            inserted.push(db[this.table][existingIndex]);
            isUpdate = true;
          }
        }

        if (!isUpdate) {
          const newItem = {
            id: item.id || (this.table.substring(0,3) + '-' + Math.random().toString(36).substring(2, 9)),
            created_at: new Date().toISOString(),
            ...item
          };
          db[this.table].push(newItem);
          inserted.push(newItem);

          // If insert is into users and role is doctor, create doctor profile automatically
          if (this.table === 'users' && newItem.role === 'doctor') {
            const hasDoc = db.doctors.find(d => d.user_id === newItem.id);
            if (!hasDoc) {
              db.doctors.push({
                id: 'doc-' + Math.random().toString(36).substring(2, 9),
                user_id: newItem.id,
                specialization: 'General Physician',
                treatment_type: 'Allopathic',
                city: 'Lahore',
                consultation_fee: 1000,
                experience_years: 5,
                rating: 4.5,
                bio: 'General practitioner ready to help.',
                is_approved: false,
                is_available: true,
                created_at: new Date().toISOString()
              });
            }
          }
        }
      });

      saveDB(db);
      return { data: this.singleRecord ? inserted[0] : inserted, error: null };
    }

    if (type === 'UPDATE') {
      // Find items that match current filters
      let matchedCount = 0;
      db[this.table] = db[this.table].map(item => {
        let matches = true;
        this.filters.forEach(filter => {
          if (filter.type === 'eq' && item[filter.field] !== filter.value) matches = false;
        });
        if (matches) {
          matchedCount++;
          return { ...item, ...data };
        }
        return item;
      });

      saveDB(db);
      return { data: null, error: matchedCount > 0 ? null : new Error('No records matched') };
    }

    if (type === 'DELETE') {
      let initialLength = db[this.table].length;
      db[this.table] = db[this.table].filter(item => {
        let matches = true;
        this.filters.forEach(filter => {
          if (filter.type === 'eq' && item[filter.field] !== filter.value) matches = false;
        });
        return !matches; // keep if NOT matches
      });

      saveDB(db);
      return { data: null, error: db[this.table].length < initialLength ? null : new Error('No records matched') };
    }
  }

  // Chainable actions trigger execution
  then(onfulfilled, onrejected) {
    return this.executeQuery(this.action, this.actionData).then(onfulfilled, onrejected);
  }

  insert(data) {
    this.action = 'INSERT';
    this.actionData = data;
    return this;
  }

  upsert(data, options) {
    this.action = 'UPSERT';
    this.actionData = { data, options };
    return this;
  }

  update(data) {
    this.action = 'UPDATE';
    this.actionData = data;
    return this;
  }

  delete() {
    this.action = 'DELETE';
    return this;
  }
}

// Storage Mock
const mockStorage = {
  from: () => ({
    upload: async (path) => {
      return { data: { path }, error: null };
    },
    getPublicUrl: (path) => {
      // Generate a nice dummy medical or payment screenshot
      // Since it's mockup, we will return a beautiful placeholder image from Unsplash or static
      const mockImages = [
        'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600'
      ];
      const idx = Math.abs(path.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % mockImages.length;
      return { data: { publicUrl: mockImages[idx] } };
    }
  })
};

// Main Export
export const supabase = isRealConfigured && realSupabase ? realSupabase : {
  auth: mockAuth,
  from: (table) => new MockQueryBuilder(table),
  storage: mockStorage
};

// Export active state helper so components can show banner if they wish
export const isMocked = !isRealConfigured || !realSupabase;
