/**
 * EduCore Academy - Admin Panel Management Script
 * Pure Vanilla JavaScript (Zero frameworks, zero dummy data)
 * Course Model: Course Name, Duration, Description
 */

// ==========================================================================
// 1. Storage Configuration & Utilities
// ==========================================================================
const STORAGE_KEYS = {
  COURSES: 'educore_academy_courses',
  STUDENTS: 'educore_academy_students',
  AUTH_TOKEN: 'educore_academy_auth_token',
  SESSION: 'educore_admin_session',
  ACADEMY_PROFILE: 'pixelsetu_academy_profile'
};

const INDIAN_STATES_DISTRICTS = {
  "Andhra Pradesh": ["Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang", "Itanagar"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tamulpur", "Tinsukia", "Udalguri", "West Karbi Anglong", "Bajali"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran (Motihari)", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda (Bihar Sharif)", "Nawada", "Patna", "Purnia", "Rohtas (Sasaram)", "Saharsa", "Samastipur", "Saran (Chhapra)", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali (Hajipur)", "West Champaran (Bettiah)"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar (Jagdalpur)", "Bemetara", "Bijapur", "Bilaspur", "Dantewada (South Bastar)", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham (Kawardha)", "Kanker (North Bastar)", "Khairagarh-Chhuikhadan-Gandai", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chouki", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Sarangarh-Bilaigarh", "Sukma", "Surajpur", "Surguja (Ambikapur)"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha (Palanpur)", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda (Nadiad)", "Kutch (Bhuj)", "Mahisagar", "Mehsana", "Morbi", "Narmada (Rajpipla)", "Navsari", "Panchmahal (Godhra)", "Patan", "Porbandar", "Rajkot", "Sabarkantha (Himmatnagar)", "Surat", "Surendranagar", "Tapi (Vyara)", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra (Dharamshala)", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur (Nahan)", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum (Jamshedpur)", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu (Medininagar)", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum (Chaibasa)"],
  "Karnataka": ["Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada (Mangaluru)", "Davangere", "Dharwad (Hubballi)", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu (Madikeri)", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada (Karwar)", "Vijayapura", "Yadgir", "Vijayanagara"],
  "Kerala": ["Alappuzha", "Ernakulam (Kochi)", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Maihar", "Mandla", "Mandsaur", "Morena", "Mauganj", "Narmadapuram", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Pandhurna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad (Chhatrapati Sambhaji Nagar)", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad (Dharashiv)", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["Eastern West Khasi Hills", "East Garo Hills", "East Jaintia Hills", "East Khasi Hills (Shillong)", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills (Tura)", "West Jaintia Hills (Jowai)", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
  "Nagaland": ["Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Debagarh", "Dhenkanal", "Gajapati", "Ganjam (Berhampur)", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khurda (Bhubaneswar)", "Koraput", "Malkangiri", "Mayurbhanj (Baripada)", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur (Sonepur)", "Sundargarh (Rourkela)"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Shahid Bhagat Singh Nagar (Nawanshahr)", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Didwana-Kuchaman", "Dholpur", "Dudu", "Dungarpur", "Ganganagar", "Gangapur City", "Hanumangarh", "Jaipur", "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Jodhpur Rural", "Karauli", "Kekri", "Khairthal-Tijara", "Kota", "Kotputli-Behror", "Nagaur", "Neem Ka Thana", "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore", "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Tonk", "Udaipur"],
  "Sikkim": ["Gangtok", "Gyalshing", "Pakyong", "Mangan", "Namchi", "Soreng"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari (Nagercoil)", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris (Ooty)", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai (Ambassa)", "Gomati (Udaipur)", "Khowai", "North Tripura (Dharmanagar)", "Sepahijala (Bishramganj)", "South Tripura (Belonia)", "Unakoti (Kailashahar)", "West Tripura (Agartala)"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar (Noida)", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar (Rudrapur)", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum (Suri)", "Cooch Behar", "Dakshin Dinajpur (Balurghat)", "Darjeeling", "Hooghly (Chinsurah)", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda (English Bazar)", "Murshidabad (Baharampur)", "Nadia (Krishnanagar)", "North 24 Parganas (Barasat)", "Paschim Bardhaman (Asansol)", "Paschim Medinipur (Midnapore)", "Purba Bardhaman (Bardhaman)", "Purba Medinipur (Tamluk)", "Purulia", "South 24 Parganas (Alipore)", "Uttar Dinajpur (Raiganj)"],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep (Kavaratti)"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

// Gradient palette for student avatar circles
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5, #7c3aed)',
  'linear-gradient(135deg, #0ea5e9, #2563eb)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #be185d)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #14b8a6, #0f766e)'
];

function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}


// ==========================================================================
// 2. State & Storage Management
// ==========================================================================
class AcademyStore {
  constructor(ownerEmail = 'dasprantik76@gmail.com') {
    this.ownerEmail = (ownerEmail || 'dasprantik76@gmail.com').toLowerCase().trim();
    this.courses = [];
    this.students = [];
    this.init();
  }

  getStorageKey(baseKey) {
    return `${baseKey}_${this.ownerEmail}`;
  }

  init() {
    const rawCourses = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.COURSES));
    const rawStudents = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.STUDENTS));

    if (rawCourses) {
      try {
        this.courses = JSON.parse(rawCourses) || [];
      } catch (e) {
        this.courses = [];
      }
    } else {
      this.courses = [];
    }

    if (rawStudents) {
      try {
        this.students = JSON.parse(rawStudents) || [];
      } catch (e) {
        this.students = [];
      }
    } else {
      this.students = [];
    }
  }

  // Asynchronously synchronize with MongoDB Multi-Tenant Cloud Storage (/api/data)
  async fetchCloudData(onLoadedCallback) {
    try {
      const response = await fetch(`/api/data?ownerEmail=${encodeURIComponent(this.ownerEmail)}`, { cache: 'no-store' });
      if (!response.ok) return false;
      const json = await response.json();
      if (json && json.success && json.data) {
        const { profile, courses, students, authToken } = json.data;

        if (Array.isArray(courses) && courses.length > 0) {
          this.courses = courses;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
        } else if (this.courses.length > 0) {
          this.syncToCloud('save_courses', { courses: this.courses });
        }

        if (Array.isArray(students)) {
          this.students = students;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.STUDENTS), JSON.stringify(this.students));
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
        } else if (this.students.length > 0) {
          this.syncToCloud('save_students', { students: this.students });
        }

        if (profile) {
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.ACADEMY_PROFILE), JSON.stringify(profile));
        } else {
          const localProfile = this.getAcademyProfile();
          if (localProfile) this.syncToCloud('save_profile', { profile: localProfile });
        }

        if (authToken && authToken.code && authToken.expiresAt && Date.now() < authToken.expiresAt) {
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.AUTH_TOKEN), JSON.stringify(authToken));
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(authToken));
        }

        if (typeof onLoadedCallback === 'function') {
          onLoadedCallback();
        }
        return true;
      }
    } catch (e) {
      console.info('[AcademyStore] Operating in local storage caching for', this.ownerEmail);
    }
    return false;
  }

  async syncToCloud(action, payload) {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          payload: {
            ...payload,
            ownerEmail: this.ownerEmail
          }
        })
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  save() {
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.STUDENTS), JSON.stringify(this.students));
  }

  clearAllData() {
    this.courses = [];
    this.students = [];
    this.save();
    this.syncToCloud('clear_all', {});
  }

  // Academy Profile (Universal SaaS Multi-Owner Setup)
  getAcademyProfile() {
    const raw = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.ACADEMY_PROFILE));
    if (!raw) {
      if (this.ownerEmail.includes('poulami')) {
        return {
          academyName: 'Poulami Dance Academy',
          ownerName: 'Poulami',
          email: this.ownerEmail,
          phone: '9876543211',
          slug: 'poulami'
        };
      }
      return {
        academyName: 'Diganta Computer Centre',
        ownerName: 'Prantik Das',
        email: this.ownerEmail,
        phone: '9876543210',
        slug: 'prantik'
      };
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  saveAcademyProfile(profile) {
    const updated = { ...profile, ownerEmail: this.ownerEmail };
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.ACADEMY_PROFILE), JSON.stringify(updated));
    this.syncToCloud('save_profile', { profile: updated });
  }

  // Authentication Token (6-Digit OTP, 5-Hour Expiry)
  getOrGenerateAuthToken(forceNew = false) {
    const AUTH_DURATION = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    if (!forceNew) {
      const raw = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.AUTH_TOKEN));
      if (raw) {
        try {
          const token = JSON.parse(raw);
          if (token && token.code && token.expiresAt && Date.now() < token.expiresAt) {
            return token;
          }
        } catch (e) {}
      }
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = {
      code: randomCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + AUTH_DURATION,
      ownerEmail: this.ownerEmail
    };
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.AUTH_TOKEN), JSON.stringify(token));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(token));
    this.syncToCloud('save_auth_token', { token });
    return token;
  }

  // Student Operations
  getAllStudents() {
    return this.students;
  }

  getStudentById(id) {
    return this.students.find(s => s.id === id);
  }

  addStudent(studentData) {
    const newId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent = {
      id: newId,
      ...studentData
    };
    this.students.unshift(newStudent);
    this.save();
    this.syncToCloud('add_student', { student: newStudent });
    return newStudent;
  }

  updateStudent(id, updatedData) {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students[index] = {
        ...this.students[index],
        ...updatedData
      };
      this.save();
      this.syncToCloud('update_student', { studentId: id, updatedData });
      return this.students[index];
    }
    return null;
  }

  bulkUpdateStudents(studentIds, updateFields) {
    const idSet = new Set(studentIds);
    this.students = this.students.map(student => {
      if (idSet.has(student.id)) {
        return { ...student, ...updateFields };
      }
      return student;
    });
    this.save();
    this.syncToCloud('bulk_update_students', { studentIds: Array.from(studentIds), updateFields });
  }

  deleteStudent(id) {
    this.students = this.students.filter(s => s.id !== id);
    this.save();
    this.syncToCloud('delete_student', { studentId: id });
  }

  // Course Operations (3 Fields: Title/Name, Duration, Description)
  getAllCourses() {
    return this.courses;
  }

  getCourseById(id) {
    return this.courses.find(c => c.id === id);
  }

  addCourse(courseData) {
    const newId = `CRS-${Math.floor(100 + Math.random() * 900)}`;
    const newCourse = {
      id: newId,
      title: courseData.title,
      duration: courseData.duration,
      description: courseData.description
    };
    this.courses.unshift(newCourse);
    this.save();
    this.syncToCloud('add_course', { course: newCourse });
    return newCourse;
  }

  updateCourse(id, updatedData) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses[index] = {
        ...this.courses[index],
        ...updatedData
      };
      this.save();
      this.syncToCloud('save_courses', { courses: this.courses });
      return this.courses[index];
    }
    return null;
  }

  deleteCourse(id) {
    this.courses = this.courses.filter(c => c.id !== id);
    // Un-enroll deleted course from any students who had it
    this.students.forEach(student => {
      if (Array.isArray(student.enrolledCourseIds)) {
        student.enrolledCourseIds = student.enrolledCourseIds.filter(courseId => courseId !== id);
      }
    });
    this.save();
    this.syncToCloud('delete_course', { courseId: id });
  }

  getCourseEnrollmentCount(courseId) {
    return this.students.filter(s => Array.isArray(s.enrolledCourseIds) && s.enrolledCourseIds.includes(courseId)).length;
  }

  getStats() {
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(s => s.status === 'Active').length;
    const totalCourses = this.courses.length;

    return {
      totalStudents,
      activeStudents,
      totalCourses
    };
  }
}

// Resolve Active Session Owner Email for Tenant Partitioning
let activeAdminEmail = 'dasprantik76@gmail.com';
try {
  const sessionData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || '{}');
  if (sessionData?.email) {
    activeAdminEmail = sessionData.email.toLowerCase().trim();
  }
} catch (e) {}

// Global Store Instance for Active Multi-Tenant Owner
const store = new AcademyStore(activeAdminEmail);


// ==========================================================================
// 3. UI Controller & Rendering
// ==========================================================================
class UIController {
  constructor() {
    // Check Authentication Session Gate
    const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!rawSession) {
      window.location.href = 'login.html';
      return;
    }

    try {
      this.session = JSON.parse(rawSession);
      const userEmail = (this.session?.email || '').toLowerCase().trim();
      const ALLOWED_ADMINS = ['poulami.13thmay@gmail.com', 'dasprantik76@gmail.com'];
      if (!this.session || this.session.provider !== 'google' || !ALLOWED_ADMINS.includes(userEmail)) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        window.location.href = 'login.html';
        return;
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      window.location.href = 'login.html';
      return;
    }

    // Ensure store is set for this session's owner email
    store.ownerEmail = this.session.email.toLowerCase().trim();
    store.init();

    this.currentView = 'dashboard';
    this.confirmCallback = null;

    // Filter states
    this.studentSearchQuery = '';
    this.studentCourseFilterVal = 'all';
    this.studentStatusFilterVal = 'all';
    this.courseSearchQuery = '';
    this.selectedStudentIds = new Set();

    this.cacheDOMElements();
    this.bindEvents();
    this.render();
    this.startAuthCountdownTimer();
    this.checkOnboarding();
    this.updatePublicSiteLink();

    // Synchronize with Multi-Tenant MongoDB cloud storage in background
    store.fetchCloudData(() => {
      this.populateCourseFilterDropdown();
      this.populateCourseDropdownInStudentModal();
      this.render();
      this.updatePublicSiteLink();
    });

    // Auto-refresh data when switching back to this browser tab
    window.addEventListener('focus', () => {
      store.fetchCloudData(() => {
        this.render();
      });
    });
  }

  getRootDomain() {
    const hostname = window.location.hostname.toLowerCase();
    const parts = hostname.split('.');
    if (parts.length >= 2 && !hostname.includes('localhost') && !hostname.endsWith('.vercel.app')) {
      return parts.slice(-2).join('.');
    }
    return 'prantikphotography.com';
  }

  getPublicUrlForSlug(slug) {
    const hostname = window.location.hostname.toLowerCase();
    const parts = hostname.split('.');
    if (parts.length >= 2 && !hostname.includes('localhost') && !hostname.endsWith('.vercel.app')) {
      const rootDomain = parts.slice(-2).join('.');
      return `https://${slug}.${rootDomain}`;
    }
    return `${window.location.origin}/?academy=${encodeURIComponent(slug)}`;
  }

  updatePublicSiteLink() {
    const profile = store.getAcademyProfile();
    const slug = profile?.slug || (this.session?.email?.includes('poulami') ? 'poulami' : 'prantik');
    const publicUrl = this.getPublicUrlForSlug(slug);

    const btnViewPublicSite = document.getElementById('btnViewPublicSite');
    if (btnViewPublicSite) {
      btnViewPublicSite.href = publicUrl;
    }

    if (this.dashboardFullUrlText) {
      this.dashboardFullUrlText.textContent = publicUrl;
    }
    if (this.dashboardPublicLinkDisplay) {
      this.dashboardPublicLinkDisplay.href = publicUrl;
    }
  }

  cacheDOMElements() {
    // Navigation & Views
    this.navItems = document.querySelectorAll('.nav-item');
    this.views = document.querySelectorAll('.view-section');
    this.pageTitle = document.getElementById('pageTitle');
    this.pageSubtitle = document.getElementById('pageSubtitle');
    this.studentCountBadge = document.getElementById('studentCountBadge');
    this.courseCountBadge = document.getElementById('courseCountBadge');

    // Sidebar Mobile Toggle & User Profile
    this.sidebar = document.getElementById('sidebar');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
    this.btnSidebarToggle = document.getElementById('btnSidebarToggle');
    this.btnCloseSidebar = document.getElementById('btnCloseSidebar');
    this.btnClearAllData = document.getElementById('btnClearAllData');
    this.sidebarAcademyName = document.getElementById('sidebarAcademyName');
    this.sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
    this.sidebarUserName = document.getElementById('sidebarUserName');
    this.sidebarUserEmail = document.getElementById('sidebarUserEmail');
    this.btnLogout = document.getElementById('btnLogout');

    // Dashboard Elements
    this.statTotalStudents = document.getElementById('statTotalStudents');
    this.statActiveStudentsCount = document.getElementById('statActiveStudentsCount');
    this.statTotalCourses = document.getElementById('statTotalCourses');
    this.statActiveCoursesCount = document.getElementById('statActiveCoursesCount');
    this.recentStudentsTableBody = document.getElementById('recentStudentsTableBody');
    this.btnViewAllStudents = document.getElementById('btnViewAllStudents');

    // Authentication Code Elements
    this.authCodeDigits = document.getElementById('authCodeDigits');
    this.authCountdownTimer = document.getElementById('authCountdownTimer');
    this.authProgressFill = document.getElementById('authProgressFill');
    this.btnGenerateNewAuthCode = document.getElementById('btnGenerateNewAuthCode');
    this.btnCopyAuthCode = document.getElementById('btnCopyAuthCode');

    // Student View Elements
    this.studentSearchInput = document.getElementById('studentSearchInput');
    this.btnClearStudentSearch = document.getElementById('btnClearStudentSearch');
    this.adminStudentCourseFilterDropdown = document.getElementById('adminStudentCourseFilterDropdown');
    this.adminStudentCourseFilterTrigger = document.getElementById('adminStudentCourseFilterTrigger');
    this.adminStudentCourseFilterDisplay = document.getElementById('adminStudentCourseFilterDisplay');
    this.adminStudentCourseFilterMenu = document.getElementById('adminStudentCourseFilterMenu');
    this.studentCourseFilter = document.getElementById('studentCourseFilter');

    this.adminStudentStatusFilterDropdown = document.getElementById('adminStudentStatusFilterDropdown');
    this.adminStudentStatusFilterTrigger = document.getElementById('adminStudentStatusFilterTrigger');
    this.adminStudentStatusFilterDisplay = document.getElementById('adminStudentStatusFilterDisplay');
    this.adminStudentStatusFilterMenu = document.getElementById('adminStudentStatusFilterMenu');
    this.studentStatusFilter = document.getElementById('studentStatusFilter');

    this.btnBulkMarkCompleted = document.getElementById('btnBulkMarkCompleted');
    this.bulkMarkCompletedLabel = document.getElementById('bulkMarkCompletedLabel');
    this.btnAddStudent = document.getElementById('btnAddStudent');
    this.selectAllStudentsCheckbox = document.getElementById('selectAllStudentsCheckbox');
    this.studentsTableBody = document.getElementById('studentsTableBody');
    this.studentsEmptyState = document.getElementById('studentsEmptyState');
    this.studentFilteredCount = document.getElementById('studentFilteredCount');
    this.studentTotalCount = document.getElementById('studentTotalCount');
    this.btnResetStudentFilters = document.getElementById('btnResetStudentFilters');

    // Course View Elements
    this.courseSearchInput = document.getElementById('courseSearchInput');
    this.btnClearCourseSearch = document.getElementById('btnClearCourseSearch');
    this.btnAddCourse = document.getElementById('btnAddCourse');
    this.coursesGrid = document.getElementById('coursesGrid');
    this.coursesEmptyState = document.getElementById('coursesEmptyState');
    this.btnResetCourseFilters = document.getElementById('btnResetCourseFilters');

    // Modals - Student (Full fields aligned with registration portal)
    this.studentModal = document.getElementById('studentModal');
    this.studentForm = document.getElementById('studentForm');
    this.studentModalTitle = document.getElementById('studentModalTitle');
    this.studentIdInput = document.getElementById('studentId');
    this.studentNameInput = document.getElementById('studentName');
    this.studentDobInput = document.getElementById('studentDob');
    this.studentFatherNameInput = document.getElementById('studentFatherName');
    this.studentMotherNameInput = document.getElementById('studentMotherName');
    this.studentAadharInput = document.getElementById('studentAadhar');
    this.studentAadharError = document.getElementById('studentAadharError');
    this.adminStudentGenderDropdown = document.getElementById('adminStudentGenderDropdown');
    this.adminStudentGenderTrigger = document.getElementById('adminStudentGenderTrigger');
    this.adminStudentGenderDisplay = document.getElementById('adminStudentGenderDisplay');
    this.adminStudentGenderMenu = document.getElementById('adminStudentGenderMenu');
    this.studentGenderInput = document.getElementById('studentGender');

    this.adminStudentMaritalStatusDropdown = document.getElementById('adminStudentMaritalStatusDropdown');
    this.adminStudentMaritalStatusTrigger = document.getElementById('adminStudentMaritalStatusTrigger');
    this.adminStudentMaritalStatusDisplay = document.getElementById('adminStudentMaritalStatusDisplay');
    this.adminStudentMaritalStatusMenu = document.getElementById('adminStudentMaritalStatusMenu');
    this.studentMaritalStatusInput = document.getElementById('studentMaritalStatus');

    this.adminStudentCategoryDropdown = document.getElementById('adminStudentCategoryDropdown');
    this.adminStudentCategoryTrigger = document.getElementById('adminStudentCategoryTrigger');
    this.adminStudentCategoryDisplay = document.getElementById('adminStudentCategoryDisplay');
    this.adminStudentCategoryMenu = document.getElementById('adminStudentCategoryMenu');
    this.studentCategoryInput = document.getElementById('studentCategory');

    this.adminStudentReligionDropdown = document.getElementById('adminStudentReligionDropdown');
    this.adminStudentReligionTrigger = document.getElementById('adminStudentReligionTrigger');
    this.adminStudentReligionDisplay = document.getElementById('adminStudentReligionDisplay');
    this.adminStudentReligionMenu = document.getElementById('adminStudentReligionMenu');
    this.studentReligionInput = document.getElementById('studentReligion');

    this.studentPhoneInput = document.getElementById('studentPhone');
    this.studentPhoneError = document.getElementById('studentPhoneError');
    this.studentEmailInput = document.getElementById('studentEmail');

    this.adminStudentStateDropdown = document.getElementById('adminStudentStateDropdown');
    this.adminStudentStateTrigger = document.getElementById('adminStudentStateTrigger');
    this.adminStudentStateDisplay = document.getElementById('adminStudentStateDisplay');
    this.adminStudentStateMenu = document.getElementById('adminStudentStateMenu');
    this.studentStateInput = document.getElementById('studentState');

    this.adminStudentDistrictDropdown = document.getElementById('adminStudentDistrictDropdown');
    this.adminStudentDistrictTrigger = document.getElementById('adminStudentDistrictTrigger');
    this.adminStudentDistrictDisplay = document.getElementById('adminStudentDistrictDisplay');
    this.adminStudentDistrictMenu = document.getElementById('adminStudentDistrictMenu');
    this.studentDistrictInput = document.getElementById('studentDistrict');

    this.studentPinCodeInput = document.getElementById('studentPinCode');
    this.studentPinCodeError = document.getElementById('studentPinCodeError');

    this.adminStudentQualificationDropdown = document.getElementById('adminStudentQualificationDropdown');
    this.adminStudentQualificationTrigger = document.getElementById('adminStudentQualificationTrigger');
    this.adminStudentQualificationDisplay = document.getElementById('adminStudentQualificationDisplay');
    this.adminStudentQualificationMenu = document.getElementById('adminStudentQualificationMenu');
    this.studentQualificationInput = document.getElementById('studentQualification');

    this.studentAddressInput = document.getElementById('studentAddress');

    this.adminStudentCourseDropdown = document.getElementById('adminStudentCourseDropdown');
    this.adminStudentCourseTrigger = document.getElementById('adminStudentCourseTrigger');
    this.adminStudentCourseDisplay = document.getElementById('adminStudentCourseDisplay');
    this.adminStudentCourseMenu = document.getElementById('adminStudentCourseMenu');
    this.studentCourseInput = document.getElementById('studentCourse');

    this.adminStudentStatusDropdown = document.getElementById('adminStudentStatusDropdown');
    this.adminStudentStatusTrigger = document.getElementById('adminStudentStatusTrigger');
    this.adminStudentStatusDisplay = document.getElementById('adminStudentStatusDisplay');
    this.adminStudentStatusMenu = document.getElementById('adminStudentStatusMenu');
    this.studentStatusSelect = document.getElementById('studentStatus');

    this.btnCloseStudentModal = document.getElementById('btnCloseStudentModal');
    this.btnCancelStudentModal = document.getElementById('btnCancelStudentModal');

    // Modals - Course (Only 3 Inputs: Title/Name, Duration, Description)
    this.courseModal = document.getElementById('courseModal');
    this.courseForm = document.getElementById('courseForm');
    this.courseModalTitle = document.getElementById('courseModalTitle');
    this.courseIdInput = document.getElementById('courseId');
    this.courseTitleInput = document.getElementById('courseTitle');
    this.courseDurationValueInput = document.getElementById('courseDurationValue');
    this.durationUnitDropdown = document.getElementById('durationUnitDropdown');
    this.durationUnitTrigger = document.getElementById('durationUnitTrigger');
    this.durationUnitDisplay = document.getElementById('durationUnitDisplay');
    this.durationUnitMenu = document.getElementById('durationUnitMenu');
    this.courseDurationUnitInput = document.getElementById('courseDurationUnit');
    this.courseDescriptionInput = document.getElementById('courseDescription');
    this.btnCloseCourseModal = document.getElementById('btnCloseCourseModal');
    this.btnCancelCourseModal = document.getElementById('btnCancelCourseModal');

    // Modals - Student Details
    this.studentDetailsModal = document.getElementById('studentDetailsModal');
    this.studentDetailsContent = document.getElementById('studentDetailsContent');
    this.btnCloseDetailsModal = document.getElementById('btnCloseDetailsModal');
    this.btnCloseDetailsBtn = document.getElementById('btnCloseDetailsBtn');
    this.btnEditFromDetails = document.getElementById('btnEditFromDetails');
    this.currentViewingStudentId = null;

    // Modals - Confirmation
    this.confirmModal = document.getElementById('confirmModal');
    this.confirmTitle = document.getElementById('confirmTitle');
    this.confirmMessage = document.getElementById('confirmMessage');
    this.btnExecuteConfirm = document.getElementById('btnExecuteConfirm');
    this.btnCancelConfirm = document.getElementById('btnCancelConfirm');
    this.btnCloseConfirmModal = document.getElementById('btnCloseConfirmModal');

    // Dashboard Public Portal Widgets
    this.dashboardFullUrlText = document.getElementById('dashboardFullUrlText');
    this.dashboardPublicLinkDisplay = document.getElementById('dashboardPublicLinkDisplay');
    this.btnCopyPublicUrl = document.getElementById('btnCopyPublicUrl');
    this.btnOpenSubdomainSettings = document.getElementById('btnOpenSubdomainSettings');

    // Modals - Academy Settings
    this.btnEditAcademySettings = document.getElementById('btnEditAcademySettings');
    this.academySettingsModal = document.getElementById('academySettingsModal');
    this.academySettingsForm = document.getElementById('academySettingsForm');
    this.settingsAcademyName = document.getElementById('settingsAcademyName');
    this.settingsOwnerName = document.getElementById('settingsOwnerName');
    this.settingsSubdomainSlug = document.getElementById('settingsSubdomainSlug');
    this.settingsSubdomainSuffix = document.getElementById('settingsSubdomainSuffix');
    this.btnCloseAcademySettingsModal = document.getElementById('btnCloseAcademySettingsModal');
    this.btnCancelAcademySettings = document.getElementById('btnCancelAcademySettings');

    // Modals - Onboarding Setup
    this.onboardingModal = document.getElementById('onboardingModal');
    this.onboardingForm = document.getElementById('onboardingForm');
    this.onboardingAcademyName = document.getElementById('onboardingAcademyName');
    this.onboardingOwnerName = document.getElementById('onboardingOwnerName');
    this.onboardingSubdomainSlug = document.getElementById('onboardingSubdomainSlug');
    this.onboardingSubdomainSuffix = document.getElementById('onboardingSubdomainSuffix');
    // Personalisation View Elements
    this.navPersonalisation = document.getElementById('nav-personalisation');
    this.viewPersonalisation = document.getElementById('view-personalisation');
    this.btnPersonalisationPreviewLive = document.getElementById('btnPersonalisationPreviewLive');
    this.btnSavePersonalisationTop = document.getElementById('btnSavePersonalisationTop');
    this.personalisationForm = document.getElementById('personalisationForm');
    this.persSubdomainSlug = document.getElementById('persSubdomainSlug');
    this.persFullUrlPreview = document.getElementById('persFullUrlPreview');
    this.btnPersCopyLink = document.getElementById('btnPersCopyLink');
    this.persAcademyName = document.getElementById('persAcademyName');
    this.persCategory = document.getElementById('persCategory');
    this.persHeroTagline = document.getElementById('persHeroTagline');
    this.persOwnerName = document.getElementById('persOwnerName');
    this.persHeroDesc = document.getElementById('persHeroDesc');
    this.persPhone = document.getElementById('persPhone');
    this.persSecondaryPhone = document.getElementById('persSecondaryPhone');
    this.persEmail = document.getElementById('persEmail');
    this.persAddress = document.getElementById('persAddress');
    this.persPinCode = document.getElementById('persPinCode');
    this.persAboutHeadline = document.getElementById('persAboutHeadline');
    this.persAboutStory = document.getElementById('persAboutStory');
    this.persHighlight1 = document.getElementById('persHighlight1');
    this.persHighlight2 = document.getElementById('persHighlight2');
    this.persHighlight3 = document.getElementById('persHighlight3');
    this.persHighlight4 = document.getElementById('persHighlight4');
    this.btnSavePersonalisation = document.getElementById('btnSavePersonalisation');

    this.toastContainer = document.getElementById('toastContainer');
  }

  bindEvents() {
    // Copy Public Link Button
    if (this.btnCopyPublicUrl) {
      this.btnCopyPublicUrl.addEventListener('click', () => {
        const profile = store.getAcademyProfile();
        const slug = profile?.slug || (this.session?.email?.includes('poulami') ? 'poulami' : 'prantik');
        const url = this.getPublicUrlForSlug(slug);

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link Copied!', 'Your public admissions link has been copied to your clipboard.', 'success');
          }).catch(() => {
            prompt('Copy your public website link:', url);
          });
        } else {
          prompt('Copy your public website link:', url);
        }
      });
    }

    // Personalisation Subdomain Slug Auto-Cleaner & Live URL Update
    if (this.persSubdomainSlug) {
      this.persSubdomainSlug.addEventListener('input', (e) => {
        const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        e.target.value = clean;
        if (this.persFullUrlPreview) {
          this.persFullUrlPreview.textContent = this.getPublicUrlForSlug(clean || 'slug');
        }
        if (this.btnPersonalisationPreviewLive) {
          this.btnPersonalisationPreviewLive.href = this.getPublicUrlForSlug(clean || 'slug');
        }
      });
    }

    if (this.btnPersCopyLink) {
      this.btnPersCopyLink.addEventListener('click', () => {
        const rawSlug = (this.persSubdomainSlug?.value || '').trim() || 'slug';
        const url = this.getPublicUrlForSlug(rawSlug);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link Copied!', 'Your public admissions link has been copied to clipboard.', 'success');
          }).catch(() => {
            prompt('Copy your public website link:', url);
          });
        } else {
          prompt('Copy your public website link:', url);
        }
      });
    }

    if (this.personalisationForm) {
      this.personalisationForm.addEventListener('submit', (e) => this.handleSavePersonalisation(e));
    }

    if (this.btnSavePersonalisationTop) {
      this.btnSavePersonalisationTop.addEventListener('click', () => {
        if (this.personalisationForm) this.personalisationForm.requestSubmit();
      });
    }

    if (this.btnOpenSubdomainSettings) {
      this.btnOpenSubdomainSettings.addEventListener('click', () => this.openAcademySettingsModal());
    }

    // Subdomain Slug Cleaners (lowercase, alphanumeric, hyphens only)
    if (this.settingsSubdomainSlug) {
      this.settingsSubdomainSlug.addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      });
    }
    if (this.onboardingSubdomainSlug) {
      this.onboardingSubdomainSlug.addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      });
    }

    // Academy Settings Handlers
    if (this.btnEditAcademySettings) {
      this.btnEditAcademySettings.addEventListener('click', () => this.openAcademySettingsModal());
    }
    if (this.btnCloseAcademySettingsModal) {
      this.btnCloseAcademySettingsModal.addEventListener('click', () => this.closeAcademySettingsModal());
    }
    if (this.btnCancelAcademySettings) {
      this.btnCancelAcademySettings.addEventListener('click', () => this.closeAcademySettingsModal());
    }
    if (this.academySettingsForm) {
      this.academySettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const academyName = this.settingsAcademyName.value.trim();
        const ownerName = this.settingsOwnerName.value.trim();
        let slug = (this.settingsSubdomainSlug?.value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

        if (!academyName || !ownerName) {
          this.showToast('Required Fields', 'Please enter both Academy Name and Owner Name.', 'error');
          return;
        }

        const currentProfile = store.getAcademyProfile() || {};
        if (!slug) {
          slug = currentProfile.slug || (this.session?.email?.includes('poulami') ? 'poulami' : 'prantik');
        }

        const updatedProfile = {
          ...currentProfile,
          academyName,
          ownerName,
          slug,
          updatedAt: Date.now()
        };
        store.saveAcademyProfile(updatedProfile);

        if (this.session) {
          this.session.name = ownerName;
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.session));
        }

        this.closeAcademySettingsModal();
        this.render();
        this.updatePublicSiteLink();
        this.showToast('Settings Saved', `Academy details & subdomain (${slug}) updated successfully!`, 'success');
      });
    }

    // Onboarding Form Submit (One-Time Setup)
    if (this.onboardingForm) {
      this.onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const academyName = this.onboardingAcademyName.value.trim();
        const ownerName = this.onboardingOwnerName.value.trim();
        let slug = (this.onboardingSubdomainSlug?.value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

        if (!academyName || !ownerName) {
          this.showToast('Required Fields', 'Please fill in both Academy Name and Owner Name.', 'error');
          return;
        }

        if (!slug) {
          slug = academyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'academy';
        }

        const profile = {
          academyName,
          ownerName,
          slug,
          configuredAt: Date.now()
        };
        store.saveAcademyProfile(profile);

        if (this.session) {
          this.session.name = ownerName;
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.session));
        }

        this.closeOnboardingModal();
        this.render();
        this.updatePublicSiteLink();
        this.showToast('Setup Complete', `Welcome to ${academyName}! Your subdomain (${slug}) is live.`, 'success');
      });
    }

    // Navigation Tab Switching
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        this.switchView(view);
        this.closeSidebar();
      });
    });

    // Hash change handler for browser back/forward
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'students', 'courses', 'personalisation'].includes(hash)) {
        this.switchView(hash, false);
      }
    });

    // Mobile Sidebar controls
    this.btnSidebarToggle.addEventListener('click', () => this.openSidebar());
    this.btnCloseSidebar.addEventListener('click', () => this.closeSidebar());
    this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());

    // Dashboard shortcuts
    this.btnViewAllStudents.addEventListener('click', () => this.switchView('students'));
    
    // Authentication Code Actions
    if (this.btnGenerateNewAuthCode) {
      this.btnGenerateNewAuthCode.addEventListener('click', () => {
        const token = store.getOrGenerateAuthToken(true);
        this.renderAuthCode();
        this.showToast('New Code Generated', `Security OTP: ${token.code}`, 'success');
      });
    }

    if (this.btnCopyAuthCode) {
      this.btnCopyAuthCode.addEventListener('click', () => {
        const token = store.getOrGenerateAuthToken();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(token.code).then(() => {
            this.btnCopyAuthCode.classList.add('copied');
            this.btnCopyAuthCode.innerHTML = '<i class="fa-solid fa-check"></i>';
            this.showToast('Code Copied', `${token.code} copied to clipboard!`, 'info');
            setTimeout(() => {
              this.btnCopyAuthCode.classList.remove('copied');
              this.btnCopyAuthCode.innerHTML = '<i class="fa-regular fa-copy"></i>';
            }, 2000);
          }).catch(() => {
            this.showToast('Code', `Code: ${token.code}`, 'info');
          });
        } else {
          this.showToast('Code', `Code: ${token.code}`, 'info');
        }
      });
    }

    if (this.btnLogout) {
      this.btnLogout.addEventListener('click', () => {
        this.promptConfirmation({
          title: 'Sign Out?',
          message: 'Are you sure you want to sign out of the administrator portal?',
          action: () => {
            localStorage.removeItem(STORAGE_KEYS.SESSION);
            window.location.href = 'login.html';
          }
        });
      });
    }

    if (this.btnClearAllData) {
      this.btnClearAllData.addEventListener('click', () => {
        this.promptConfirmation({
          title: 'Clear All Data?',
          message: 'Are you sure you want to permanently clear all student records and courses? This cannot be undone.',
          action: () => {
            store.clearAllData();
            this.render();
            this.showToast('Data Cleared', 'All student and course records have been cleared.', 'info');
          }
        });
      });
    }

    // Add Buttons inside respective view toolbars
    if (this.btnAddStudent) {
      this.btnAddStudent.addEventListener('click', () => this.openStudentModal());
    }
    this.btnAddCourse.addEventListener('click', () => this.openCourseModal());

    // Student Filter & Search Handlers
    this.studentSearchInput.addEventListener('input', (e) => {
      this.studentSearchQuery = e.target.value.trim().toLowerCase();
      this.btnClearStudentSearch.style.display = this.studentSearchQuery ? 'block' : 'none';
      this.renderStudentsView();
    });

    this.btnClearStudentSearch.addEventListener('click', () => {
      this.studentSearchInput.value = '';
      this.studentSearchQuery = '';
      this.btnClearStudentSearch.style.display = 'none';
      this.renderStudentsView();
    });

    // Setup Toolbar Filter Custom Dropdowns (opens right below)
    this.setupAdminDropdown(
      this.adminStudentCourseFilterDropdown,
      this.adminStudentCourseFilterTrigger,
      this.adminStudentCourseFilterMenu,
      this.adminStudentCourseFilterDisplay,
      this.studentCourseFilter,
      (val) => {
        this.studentCourseFilterVal = val;
        this.renderStudentsView();
      }
    );

    this.setupAdminDropdown(
      this.adminStudentStatusFilterDropdown,
      this.adminStudentStatusFilterTrigger,
      this.adminStudentStatusFilterMenu,
      this.adminStudentStatusFilterDisplay,
      this.studentStatusFilter,
      (val) => {
        this.studentStatusFilterVal = val;
        this.renderStudentsView();
      }
    );

    this.btnResetStudentFilters.addEventListener('click', () => {
      this.studentSearchInput.value = '';
      this.studentSearchQuery = '';
      this.setAdminDropdownValue(
        this.adminStudentCourseFilterDropdown,
        this.adminStudentCourseFilterMenu,
        this.adminStudentCourseFilterDisplay,
        this.studentCourseFilter,
        'all',
        'All Courses'
      );
      this.studentCourseFilterVal = 'all';
      this.setAdminDropdownValue(
        this.adminStudentStatusFilterDropdown,
        this.adminStudentStatusFilterMenu,
        this.adminStudentStatusFilterDisplay,
        this.studentStatusFilter,
        'all',
        'All Statuses'
      );
      this.studentStatusFilterVal = 'all';
      this.btnClearStudentSearch.style.display = 'none';
      this.renderStudentsView();
    });

    // Bulk Mark Completed Handler
    if (this.btnBulkMarkCompleted) {
      this.btnBulkMarkCompleted.addEventListener('click', () => this.handleBulkMarkCompleted());
    }

    // Select All Checkbox Handler
    if (this.selectAllStudentsCheckbox) {
      this.selectAllStudentsCheckbox.addEventListener('change', (e) => this.handleSelectAllStudents(e.target.checked));
    }

    // Individual Student Row Checkbox Delegation
    if (this.studentsTableBody) {
      this.studentsTableBody.addEventListener('change', (e) => {
        const checkbox = e.target.closest('.student-row-checkbox');
        if (checkbox) {
          const studentId = checkbox.getAttribute('data-student-id');
          if (checkbox.checked) {
            this.selectedStudentIds.add(studentId);
          } else {
            this.selectedStudentIds.delete(studentId);
          }
          this.updateBulkActionState();
        }
      });
    }

    // Course Search Handler
    this.courseSearchInput.addEventListener('input', (e) => {
      this.courseSearchQuery = e.target.value.trim().toLowerCase();
      this.btnClearCourseSearch.style.display = this.courseSearchQuery ? 'block' : 'none';
      this.renderCoursesView();
    });

    this.btnClearCourseSearch.addEventListener('click', () => {
      this.courseSearchInput.value = '';
      this.courseSearchQuery = '';
      this.btnClearCourseSearch.style.display = 'none';
      this.renderCoursesView();
    });

    this.btnResetCourseFilters.addEventListener('click', () => {
      this.courseSearchInput.value = '';
      this.courseSearchQuery = '';
      this.btnClearCourseSearch.style.display = 'none';
      this.renderCoursesView();
    });

    // Setup Admin Student Form Custom Dropdowns (opens right below)
    this.setupAdminDropdown(this.adminStudentGenderDropdown, this.adminStudentGenderTrigger, this.adminStudentGenderMenu, this.adminStudentGenderDisplay, this.studentGenderInput);
    this.setupAdminDropdown(this.adminStudentMaritalStatusDropdown, this.adminStudentMaritalStatusTrigger, this.adminStudentMaritalStatusMenu, this.adminStudentMaritalStatusDisplay, this.studentMaritalStatusInput);
    this.setupAdminDropdown(this.adminStudentCategoryDropdown, this.adminStudentCategoryTrigger, this.adminStudentCategoryMenu, this.adminStudentCategoryDisplay, this.studentCategoryInput);
    this.setupAdminDropdown(this.adminStudentReligionDropdown, this.adminStudentReligionTrigger, this.adminStudentReligionMenu, this.adminStudentReligionDisplay, this.studentReligionInput);
    this.initAdminStateAndDistrictDropdowns();
    this.setupAdminDropdown(this.adminStudentQualificationDropdown, this.adminStudentQualificationTrigger, this.adminStudentQualificationMenu, this.adminStudentQualificationDisplay, this.studentQualificationInput);
    this.setupAdminDropdown(this.adminStudentCourseDropdown, this.adminStudentCourseTrigger, this.adminStudentCourseMenu, this.adminStudentCourseDisplay, this.studentCourseInput);
    this.setupAdminDropdown(this.adminStudentStatusDropdown, this.adminStudentStatusTrigger, this.adminStudentStatusMenu, this.adminStudentStatusDisplay, this.studentStatusSelect);

    // Auto Capitalization of Name Initials Everywhere
    applyAutoCapitalization(this.studentNameInput);
    applyAutoCapitalization(this.studentFatherNameInput);
    applyAutoCapitalization(this.studentMotherNameInput);
    applyAutoCapitalization(this.settingsAcademyName);
    applyAutoCapitalization(this.settingsOwnerName);
    applyAutoCapitalization(this.onboardingAcademyName);
    applyAutoCapitalization(this.onboardingOwnerName);

    // Strict 12-digit Aadhar Validation
    setupAadharInputValidation(this.studentAadharInput, this.studentAadharError);

    // Strict 10-digit Mobile Number Validation
    setupPhoneInputValidation(this.studentPhoneInput, this.studentPhoneError);

    // Strict 6-digit Pin Code Validation
    setupPinCodeInputValidation(this.studentPinCodeInput, this.studentPinCodeError);

    // Date inputs has-value styling
    if (this.studentDobInput) {
      ['input', 'change'].forEach(evt => {
        this.studentDobInput.addEventListener(evt, () => {
          this.studentDobInput.classList.toggle('has-value', Boolean(this.studentDobInput.value));
        });
      });
    }

    // Custom Duration Unit Dropdown Toggle & Selection
    if (this.durationUnitTrigger) {
      this.durationUnitTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllAdminDropdowns(this.durationUnitDropdown);
        const isOpen = this.durationUnitDropdown.classList.toggle('open');
        this.durationUnitTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    if (this.durationUnitMenu) {
      this.durationUnitMenu.querySelectorAll('.custom-select-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = option.getAttribute('data-value');
          this.setDurationUnit(val);
          this.durationUnitDropdown.classList.remove('open');
          this.durationUnitTrigger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Close all custom dropdowns when clicking anywhere else in the document
    document.addEventListener('click', (e) => {
      this.closeAllAdminDropdowns();
    });

    // Form Submissions
    this.studentForm.addEventListener('submit', (e) => this.handleStudentFormSubmit(e));
    this.courseForm.addEventListener('submit', (e) => this.handleCourseFormSubmit(e));

    // Modal Close Buttons
    this.btnCloseStudentModal.addEventListener('click', () => this.closeModal(this.studentModal));
    this.btnCancelStudentModal.addEventListener('click', () => this.closeModal(this.studentModal));

    this.btnCloseCourseModal.addEventListener('click', () => this.closeModal(this.courseModal));
    this.btnCancelCourseModal.addEventListener('click', () => this.closeModal(this.courseModal));

    this.btnCloseDetailsModal.addEventListener('click', () => this.closeModal(this.studentDetailsModal));
    this.btnCloseDetailsBtn.addEventListener('click', () => this.closeModal(this.studentDetailsModal));
    this.btnEditFromDetails.addEventListener('click', () => {
      this.closeModal(this.studentDetailsModal);
      if (this.currentViewingStudentId) {
        this.openStudentModal(this.currentViewingStudentId);
      }
    });

    this.btnCloseConfirmModal.addEventListener('click', () => this.closeModal(this.confirmModal));
    this.btnCancelConfirm.addEventListener('click', () => this.closeModal(this.confirmModal));
    this.btnExecuteConfirm.addEventListener('click', () => {
      if (typeof this.confirmCallback === 'function') {
        this.confirmCallback();
      }
      this.closeModal(this.confirmModal);
    });
  }

  setDurationUnit(unit) {
    const cleanUnit = (unit === 'Years' || unit === 'Year') ? 'Years' : 'Months';
    if (this.courseDurationUnitInput) {
      this.courseDurationUnitInput.value = cleanUnit;
    }
    if (this.durationUnitDisplay) {
      this.durationUnitDisplay.textContent = cleanUnit;
    }
    if (this.durationUnitMenu) {
      this.durationUnitMenu.querySelectorAll('.custom-select-option').forEach(opt => {
        const isSelected = opt.getAttribute('data-value') === cleanUnit;
        opt.classList.toggle('selected', isSelected);
        opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
    }
  }

  openSidebar() {
    this.sidebar.classList.add('open');
    this.sidebarOverlay.classList.add('active');
  }

  closeSidebar() {
    this.sidebar.classList.remove('open');
    this.sidebarOverlay.classList.remove('active');
  }

  switchView(viewName, updateHash = true) {
    this.currentView = viewName;
    if (updateHash) {
      window.location.hash = viewName;
    }

    this.navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.views.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    if (viewName === 'dashboard') {
      const profile = store.getAcademyProfile();
      this.pageTitle.textContent = 'Dashboard Overview';
      this.pageSubtitle.textContent = profile?.academyName ? `Academy Management Portal • ${profile.academyName}` : 'Welcome to Academy by PixelSetu';
    } else if (viewName === 'students') {
      this.pageTitle.textContent = 'Student Management';
      this.pageSubtitle.textContent = 'Register, track progress, and manage enrolled learners';
    } else if (viewName === 'courses') {
      this.pageTitle.textContent = 'Course Management';
      this.pageSubtitle.textContent = 'Curate academy courses, durations, and syllabus details';
    } else if (viewName === 'personalisation') {
      this.pageTitle.textContent = 'Website Personalisation';
      this.pageSubtitle.textContent = 'Manage public subdomain, branding, contact details, and academy story';
      this.populatePersonalisationForm();
    }

    this.render();
    store.fetchCloudData(() => {
      this.render();
    });
  }

  populatePersonalisationForm() {
    const profile = store.getAcademyProfile() || {};
    const defaultSlug = this.session?.email?.includes('poulami') ? 'poulami' : 'prantik';
    const slug = profile.slug || defaultSlug;

    if (this.persSubdomainSlug) this.persSubdomainSlug.value = slug;
    if (this.persFullUrlPreview) this.persFullUrlPreview.textContent = this.getPublicUrlForSlug(slug);
    if (this.btnPersonalisationPreviewLive) this.btnPersonalisationPreviewLive.href = this.getPublicUrlForSlug(slug);

    if (this.persAcademyName) this.persAcademyName.value = profile.academyName || '';
    if (this.persCategory) this.persCategory.value = profile.category || '';
    if (this.persHeroTagline) this.persHeroTagline.value = profile.tagline || 'Admissions & Registrations Open 2026';
    if (this.persOwnerName) this.persOwnerName.value = profile.ownerName || this.session?.name || '';
    if (this.persHeroDesc) this.persHeroDesc.value = profile.heroDesc || profile.about || 'Empowering learners with industry-standard courses and certified training.';
    if (this.persPhone) this.persPhone.value = profile.phone || '';
    if (this.persSecondaryPhone) this.persSecondaryPhone.value = profile.secondaryPhone || profile.whatsapp || '';
    if (this.persEmail) this.persEmail.value = profile.email || this.session?.email || '';
    if (this.persAddress) this.persAddress.value = profile.address || '';
    if (this.persPinCode) this.persPinCode.value = profile.pincode || '';
    if (this.persAboutHeadline) this.persAboutHeadline.value = profile.aboutHeadline || `Welcome to ${profile.academyName || 'Our Academy'}`;
    if (this.persAboutStory) this.persAboutStory.value = profile.aboutStory || profile.about || 'Premier professional training academy offering certified courses with modern practical laboratory sessions.';

    // Highlights
    const highlights = Array.isArray(profile.aboutHighlights) ? profile.aboutHighlights : [];
    if (this.persHighlight1) this.persHighlight1.value = highlights[0] || 'Certified Expert & Industry-Experienced Faculty';
    if (this.persHighlight2) this.persHighlight2.value = highlights[1] || '100% Practical Hands-on Lab Sessions';
    if (this.persHighlight3) this.persHighlight3.value = highlights[2] || 'Recognized Government & Industry Certifications';
    if (this.persHighlight4) this.persHighlight4.value = highlights[3] || 'Comprehensive Career Guidance & Placement Assistance';
  }

  async handleSavePersonalisation(e) {
    if (e) e.preventDefault();

    const rawSlug = (this.persSubdomainSlug?.value || '').trim();
    const sanitizedSlug = rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
    if (!sanitizedSlug) {
      this.showToast('Invalid Subdomain', 'Please provide a valid subdomain (e.g. prantik, my-academy).', 'error');
      return;
    }

    const academyName = this.persAcademyName?.value.trim();
    if (!academyName) {
      this.showToast('Required Field', 'Please enter your Academy Brand Name.', 'error');
      return;
    }

    const highlights = [
      this.persHighlight1?.value.trim(),
      this.persHighlight2?.value.trim(),
      this.persHighlight3?.value.trim(),
      this.persHighlight4?.value.trim()
    ].filter(Boolean);

    const updatedProfile = {
      ...store.getAcademyProfile(),
      slug: sanitizedSlug,
      academyName: academyName,
      category: this.persCategory?.value.trim() || '',
      tagline: this.persHeroTagline?.value.trim() || '',
      ownerName: this.persOwnerName?.value.trim() || '',
      heroDesc: this.persHeroDesc?.value.trim() || '',
      phone: this.persPhone?.value.trim() || '',
      secondaryPhone: this.persSecondaryPhone?.value.trim() || '',
      whatsapp: this.persSecondaryPhone?.value.trim() || '',
      email: this.persEmail?.value.trim() || '',
      address: this.persAddress?.value.trim() || '',
      pincode: this.persPinCode?.value.trim() || '',
      aboutHeadline: this.persAboutHeadline?.value.trim() || '',
      aboutStory: this.persAboutStory?.value.trim() || '',
      about: this.persHeroDesc?.value.trim() || this.persAboutStory?.value.trim() || '',
      aboutHighlights: highlights,
      updatedAt: Date.now()
    };

    store.saveAcademyProfile(updatedProfile);
    this.updatePublicSiteLink();
    this.populatePersonalisationForm();
    this.render();

    this.showToast('Personalisation Published!', `Your updates and live subdomain (${sanitizedSlug}) are now synced live to the public portal.`, 'success');
  }

  render() {
    this.renderUserProfile();
    this.populateCourseFilterDropdown();
    this.renderBadgesAndStats();
    this.renderDashboardView();
    this.renderStudentsView();
    this.renderCoursesView();
  }

  renderUserProfile() {
    const profile = store.getAcademyProfile();
    const academyName = profile?.academyName || 'Academy';
    const ownerName = profile?.ownerName || this.session?.name || 'Admin Portal';

    if (this.sidebarAcademyName) {
      this.sidebarAcademyName.textContent = academyName;
    }
    if (this.sidebarUserName) {
      this.sidebarUserName.textContent = ownerName;
    }
    if (this.sidebarUserEmail) {
      this.sidebarUserEmail.textContent = this.session?.email || 'admin@pixelsetu.com';
    }
    if (this.sidebarUserAvatar) {
      if (this.session && this.session.avatar) {
        this.sidebarUserAvatar.innerHTML = `<img src="${escapeHtml(this.session.avatar)}" alt="${escapeHtml(ownerName)}" referrerpolicy="no-referrer">`;
      } else {
        this.sidebarUserAvatar.textContent = getInitials(ownerName);
      }
    }
  }

  populateCourseFilterDropdown() {
    const currentVal = this.studentCourseFilter ? this.studentCourseFilter.value : 'all';
    const courses = store.getAllCourses();
    
    if (this.adminStudentCourseFilterMenu) {
      let html = '<li class="custom-select-option" data-value="all" role="option">All Courses</li>';
      courses.forEach(course => {
        html += `<li class="custom-select-option" data-value="${escapeHtml(course.id)}" role="option">${escapeHtml(course.title)} (${escapeHtml(course.duration)})</li>`;
      });
      this.adminStudentCourseFilterMenu.innerHTML = html;
      
      const selectedCourse = courses.find(c => c.id === currentVal);
      const label = selectedCourse ? `${selectedCourse.title} (${selectedCourse.duration})` : 'All Courses';
      this.setAdminDropdownValue(
        this.adminStudentCourseFilterDropdown,
        this.adminStudentCourseFilterMenu,
        this.adminStudentCourseFilterDisplay,
        this.studentCourseFilter,
        currentVal || 'all',
        label
      );
    }
  }

  renderBadgesAndStats() {
    const stats = store.getStats();
    
    // Sidebar Badges
    this.studentCountBadge.textContent = stats.totalStudents;
    this.courseCountBadge.textContent = stats.totalCourses;

    // Dashboard Metric Cards (2 Cards)
    this.statTotalStudents.textContent = stats.totalStudents;
    this.statActiveStudentsCount.textContent = stats.activeStudents;
    this.statTotalCourses.textContent = stats.totalCourses;
    this.statActiveCoursesCount.textContent = stats.totalCourses;
  }

  // ==========================================================================
  // Render Dashboard
  // ==========================================================================
  renderDashboardView() {
    const students = store.getAllStudents();
    const courses = store.getAllCourses();

    // 1. Recent 5 Students Table
    const recentStudents = students.slice(0, 5);
    if (recentStudents.length === 0) {
      this.recentStudentsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2.5rem 1rem;">
            <i class="fa-solid fa-user-graduate" style="font-size: 1.5rem; color: var(--text-subtle); margin-bottom: 0.5rem; display: block;"></i>
            No students registered yet. Students register directly via the public portal.
          </td>
        </tr>
      `;
    } else {
      this.recentStudentsTableBody.innerHTML = recentStudents.map(student => {
        const initials = getInitials(student.name);
        const gradient = getAvatarGradient(student.name);
        const enrolledCourseNames = (student.enrolledCourseIds || []).map(cid => {
          const c = courses.find(item => item.id === cid);
          return c ? `<span class="badge-course-tag">${escapeHtml(c.title)}</span>` : '';
        }).join('');

        return `
          <tr>
            <td>
              <div class="student-meta-cell">
                <div class="student-avatar" style="background: ${gradient}">${initials}</div>
                <div class="student-name-box">
                  <strong>${escapeHtml(student.name)}</strong>
                  <span>ID: ${escapeHtml(student.id)}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="contact-email">${escapeHtml(student.email)}</span>
            </td>
            <td>
              ${enrolledCourseNames || '<span style="color: var(--text-subtle); font-size: 0.75rem;">None</span>'}
            </td>
            <td>${formatDate(student.joinDate)}</td>
            <td>
              <span class="badge ${getStatusBadgeClass(student.status)}">
                <i class="fa-solid fa-circle" style="font-size: 6px;"></i> ${escapeHtml(student.status)}
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 2. Render Authentication Code OTP Card
    this.renderAuthCode();
  }

  // ==========================================================================
  // Render Students View
  // ==========================================================================
  renderStudentsView() {
    const allStudents = store.getAllStudents();
    const allCourses = store.getAllCourses();

    if (this.studentTotalCount) this.studentTotalCount.textContent = allStudents.length;

    // Filter Logic
    const filteredStudents = allStudents.filter(student => {
      const query = this.studentSearchQuery;
      const matchesSearch = !query ||
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.phone.toLowerCase().includes(query);

      const matchesCourse = this.studentCourseFilterVal === 'all' ||
        (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(this.studentCourseFilterVal));

      const matchesStatus = this.studentStatusFilterVal === 'all' ||
        student.status === this.studentStatusFilterVal;

      return matchesSearch && matchesCourse && matchesStatus;
    });

    if (this.studentFilteredCount) this.studentFilteredCount.textContent = filteredStudents.length;

    if (filteredStudents.length === 0) {
      this.studentsTableBody.innerHTML = '';
      this.studentsEmptyState.style.display = 'flex';
      this.updateBulkActionState(filteredStudents);
      return;
    }

    this.studentsEmptyState.style.display = 'none';

    this.studentsTableBody.innerHTML = filteredStudents.map(student => {
      const initials = getInitials(student.name);
      const gradient = getAvatarGradient(student.name);
      const isChecked = this.selectedStudentIds.has(student.id);
      
      const enrolledCoursesBadges = (student.enrolledCourseIds || []).map(cid => {
        const c = allCourses.find(item => item.id === cid);
        return c ? `<span class="badge-course-tag" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</span>` : '';
      }).join('');

      return `
        <tr>
          <td style="text-align: center; width: 44px;">
            <input type="checkbox" class="student-row-checkbox custom-table-checkbox" data-student-id="${escapeHtml(student.id)}" ${isChecked ? 'checked' : ''} aria-label="Select student ${escapeHtml(student.name)}">
          </td>
          <td>
            <div class="student-meta-cell">
              <div class="student-avatar" style="background: ${gradient}">${initials}</div>
              <div class="student-name-box">
                <strong>${escapeHtml(student.name)}</strong>
                <span>ID: ${escapeHtml(student.id)}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="contact-cell">
              <span class="contact-email">${escapeHtml(student.email)}</span>
              <span class="contact-phone">${escapeHtml(student.phone)}</span>
            </div>
          </td>
          <td>
            ${enrolledCoursesBadges || '<span style="color: var(--text-subtle); font-size: 0.8125rem;">No courses</span>'}
          </td>
          <td>${formatDate(student.joinDate)}</td>
          <td>
            <span class="badge ${getStatusBadgeClass(student.status)}">
              <i class="fa-solid fa-circle" style="font-size: 6px;"></i> ${escapeHtml(student.status)}
            </span>
          </td>
          <td class="text-right">
            <div class="table-actions">
              <button class="btn-icon view" title="View Profile & Enrollments" onclick="window.app.viewStudentProfile('${student.id}')">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="btn-icon edit" title="Edit Student" onclick="window.app.openStudentModal('${student.id}')">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button class="btn-icon delete" title="Delete Student" onclick="window.app.confirmDeleteStudent('${student.id}')">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    this.updateBulkActionState(filteredStudents);
  }

  // ==========================================================================
  // Render Courses View (Course Name, Duration, Description)
  // ==========================================================================
  renderCoursesView() {
    const allCourses = store.getAllCourses();

    const filteredCourses = allCourses.filter(course => {
      const query = this.courseSearchQuery;
      return !query ||
        course.title.toLowerCase().includes(query) ||
        course.duration.toLowerCase().includes(query) ||
        (course.description && course.description.toLowerCase().includes(query));
    });

    if (filteredCourses.length === 0) {
      this.coursesGrid.innerHTML = '';
      this.coursesEmptyState.style.display = 'flex';
      return;
    }

    this.coursesEmptyState.style.display = 'none';

    this.coursesGrid.innerHTML = filteredCourses.map(course => {
      const enrolledCount = store.getCourseEnrollmentCount(course.id);
      return `
        <div class="course-card">
          <div class="course-card-header">
            <h4 class="course-title" style="margin-bottom: 0;">${escapeHtml(course.title)}</h4>
            <span class="course-duration-badge">
              <i class="fa-regular fa-clock"></i> ${escapeHtml(course.duration)}
            </span>
          </div>
          <div class="course-card-body">
            <p class="course-desc">${escapeHtml(course.description || 'No description provided.')}</p>
          </div>
          <div class="course-card-footer">
            <div class="enrolled-stat">
              <i class="fa-solid fa-user-graduate"></i>
              <span><strong>${enrolledCount}</strong> Enrolled</span>
            </div>
            <div class="table-actions">
              <button class="btn-icon edit" title="Edit Course" onclick="window.app.openCourseModal('${course.id}')">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button class="btn-icon delete" title="Delete Course" onclick="window.app.confirmDeleteCourse('${course.id}')">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // Custom Dropdown Helpers for Admin Student Form
  // ==========================================================================
  setupAdminDropdown(container, trigger, menu, display, hiddenInput, onChangeCallback) {
    if (!container || !trigger || !menu || !hiddenInput) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeAllAdminDropdowns(container);
      const isOpen = container.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });

    menu.addEventListener('click', (e) => {
      const option = e.target.closest('.custom-select-option');
      if (!option) return;

      const value = option.getAttribute('data-value');
      const label = option.textContent.trim();

      hiddenInput.value = value;
      if (display) display.textContent = label;
      container.classList.toggle('has-value', Boolean(value));

      menu.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      container.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');

      if (typeof onChangeCallback === 'function') {
        onChangeCallback(value);
      }
    });
  }

  closeAllAdminDropdowns(except = null) {
    const all = [
      this.durationUnitDropdown,
      this.adminStudentGenderDropdown,
      this.adminStudentMaritalStatusDropdown,
      this.adminStudentCategoryDropdown,
      this.adminStudentReligionDropdown,
      this.adminStudentStateDropdown,
      this.adminStudentDistrictDropdown,
      this.adminStudentQualificationDropdown,
      this.adminStudentCourseDropdown,
      this.adminStudentStatusDropdown,
      this.adminStudentCourseFilterDropdown,
      this.adminStudentStatusFilterDropdown
    ];
    all.forEach(dropdown => {
      if (dropdown && dropdown !== except) {
        dropdown.classList.remove('open');
        const trigger = dropdown.querySelector('.custom-select-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setAdminDropdownValue(container, menu, display, hiddenInput, value, defaultLabel) {
    if (!container || !menu || !display || !hiddenInput) return;
    hiddenInput.value = value || '';
    container.classList.toggle('has-value', Boolean(value));

    let matchedLabel = defaultLabel;
    menu.querySelectorAll('.custom-select-option').forEach(opt => {
      const optVal = opt.getAttribute('data-value');
      if (optVal === value && value) {
        opt.classList.add('selected');
        matchedLabel = opt.textContent.trim();
      } else {
        opt.classList.remove('selected');
      }
    });
    display.textContent = matchedLabel;
  }

  initAdminStateAndDistrictDropdowns() {
    if (!this.adminStudentStateMenu || !this.adminStudentDistrictMenu) return;

    const states = Object.keys(INDIAN_STATES_DISTRICTS).sort();
    this.adminStudentStateMenu.innerHTML = states.map(state => `
      <li class="custom-select-option" data-value="${escapeHtml(state)}" role="option">${escapeHtml(state)}</li>
    `).join('');

    this.setupAdminDropdown(
      this.adminStudentStateDropdown,
      this.adminStudentStateTrigger,
      this.adminStudentStateMenu,
      this.adminStudentStateDisplay,
      this.studentStateInput,
      (selectedState) => {
        this.populateAdminDistricts(selectedState);
      }
    );

    this.setupAdminDropdown(
      this.adminStudentDistrictDropdown,
      this.adminStudentDistrictTrigger,
      this.adminStudentDistrictMenu,
      this.adminStudentDistrictDisplay,
      this.studentDistrictInput
    );
  }

  populateAdminDistricts(selectedState) {
    if (!this.adminStudentDistrictMenu || !this.adminStudentDistrictDisplay || !this.studentDistrictInput) return;

    const districts = INDIAN_STATES_DISTRICTS[selectedState] || [];
    if (districts.length === 0) {
      this.adminStudentDistrictMenu.innerHTML = '<li class="custom-select-option" data-value="" style="color: var(--text-muted); cursor: default;">No districts available</li>';
    } else {
      this.adminStudentDistrictMenu.innerHTML = districts.map(d => `
        <li class="custom-select-option" data-value="${escapeHtml(d)}" role="option">${escapeHtml(d)}</li>
      `).join('');
    }

    this.adminStudentDistrictDisplay.textContent = 'Select District';
    this.studentDistrictInput.value = '';
    this.adminStudentDistrictMenu.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
  }

  populateAdminStudentCourseMenu(courses) {
    if (!this.adminStudentCourseMenu) return;

    if (courses.length === 0) {
      this.adminStudentCourseMenu.innerHTML = '<li class="custom-select-option" style="color: var(--text-muted); pointer-events: none;">No courses created yet</li>';
      if (this.adminStudentCourseDisplay) this.adminStudentCourseDisplay.textContent = 'No courses available';
      if (this.studentCourseInput) this.studentCourseInput.value = '';
    } else {
      let html = '';
      courses.forEach(c => {
        html += `<li class="custom-select-option" data-value="${escapeHtml(c.id)}" role="option">${escapeHtml(c.title)} (${escapeHtml(c.duration)})</li>`;
      });
      this.adminStudentCourseMenu.innerHTML = html;
    }
  }

  // ==========================================================================
  // Student Modals & Actions (Aligned with Public Registration Fields)
  // ==========================================================================
  openStudentModal(studentId = null) {
    this.studentForm.reset();
    if (this.studentAadharInput) this.studentAadharInput.classList.remove('input-error');
    if (this.studentAadharError) this.studentAadharError.style.display = 'none';
    this.studentPhoneInput.classList.remove('input-error');
    if (this.studentPhoneError) this.studentPhoneError.style.display = 'none';
    if (this.studentPinCodeInput) this.studentPinCodeInput.classList.remove('input-error');
    if (this.studentPinCodeError) this.studentPinCodeError.style.display = 'none';

    const courses = store.getAllCourses();
    this.populateAdminStudentCourseMenu(courses);

    if (studentId) {
      const student = store.getStudentById(studentId);
      if (!student) return;

      this.studentModalTitle.textContent = 'Edit Student Details';
      this.studentIdInput.value = student.id;
      this.studentNameInput.value = student.name || '';
      this.studentDobInput.value = student.dob || '';
      if (this.studentFatherNameInput) this.studentFatherNameInput.value = student.fatherName || '';
      if (this.studentMotherNameInput) this.studentMotherNameInput.value = student.motherName || '';
      if (this.studentAadharInput) this.studentAadharInput.value = student.aadhar || '';

      this.setAdminDropdownValue(this.adminStudentGenderDropdown, this.adminStudentGenderMenu, this.adminStudentGenderDisplay, this.studentGenderInput, student.gender || '', 'Select Gender');
      this.setAdminDropdownValue(this.adminStudentMaritalStatusDropdown, this.adminStudentMaritalStatusMenu, this.adminStudentMaritalStatusDisplay, this.studentMaritalStatusInput, student.maritalStatus || '', 'Select Marital Status');
      this.setAdminDropdownValue(this.adminStudentCategoryDropdown, this.adminStudentCategoryMenu, this.adminStudentCategoryDisplay, this.studentCategoryInput, student.category || '', 'Select Category');
      this.setAdminDropdownValue(this.adminStudentReligionDropdown, this.adminStudentReligionMenu, this.adminStudentReligionDisplay, this.studentReligionInput, student.religion || '', 'Select Religion');

      this.studentPhoneInput.value = student.phone || '';
      this.studentEmailInput.value = student.email || '';

      // State & District population
      if (student.state) {
        this.populateAdminDistricts(student.state);
        this.setAdminDropdownValue(this.adminStudentStateDropdown, this.adminStudentStateMenu, this.adminStudentStateDisplay, this.studentStateInput, student.state, student.state);
        if (student.district) {
          this.setAdminDropdownValue(this.adminStudentDistrictDropdown, this.adminStudentDistrictMenu, this.adminStudentDistrictDisplay, this.studentDistrictInput, student.district, student.district);
        }
      } else {
        this.setAdminDropdownValue(this.adminStudentStateDropdown, this.adminStudentStateMenu, this.adminStudentStateDisplay, this.studentStateInput, '', 'Select State');
        this.setAdminDropdownValue(this.adminStudentDistrictDropdown, this.adminStudentDistrictMenu, this.adminStudentDistrictDisplay, this.studentDistrictInput, '', 'Select District');
      }

      if (this.studentPinCodeInput) this.studentPinCodeInput.value = student.pinCode || '';
      this.studentAddressInput.value = student.address || '';

      this.setAdminDropdownValue(this.adminStudentQualificationDropdown, this.adminStudentQualificationMenu, this.adminStudentQualificationDisplay, this.studentQualificationInput, student.qualification || '', 'Select Qualification');

      const enrolledId = (student.enrolledCourseIds && student.enrolledCourseIds[0]) || '';
      const courseObj = courses.find(c => c.id === enrolledId);
      const courseLabel = courseObj ? `${courseObj.title} (${courseObj.duration})` : 'Select Course';
      this.setAdminDropdownValue(this.adminStudentCourseDropdown, this.adminStudentCourseMenu, this.adminStudentCourseDisplay, this.studentCourseInput, enrolledId, courseLabel);
      this.setAdminDropdownValue(this.adminStudentStatusDropdown, this.adminStudentStatusMenu, this.adminStudentStatusDisplay, this.studentStatusSelect, student.status || 'Active', student.status || 'Active');
      if (this.studentDobInput) this.studentDobInput.classList.toggle('has-value', Boolean(this.studentDobInput.value));
    } else {
      this.studentModalTitle.textContent = 'Add New Student';
      this.studentIdInput.value = '';
      this.studentNameInput.value = '';
      this.studentDobInput.value = '';
      if (this.studentDobInput) this.studentDobInput.classList.remove('has-value');
      if (this.studentFatherNameInput) this.studentFatherNameInput.value = '';
      if (this.studentMotherNameInput) this.studentMotherNameInput.value = '';
      if (this.studentAadharInput) this.studentAadharInput.value = '';
      this.setAdminDropdownValue(this.adminStudentGenderDropdown, this.adminStudentGenderMenu, this.adminStudentGenderDisplay, this.studentGenderInput, '', 'Select Gender');
      this.setAdminDropdownValue(this.adminStudentMaritalStatusDropdown, this.adminStudentMaritalStatusMenu, this.adminStudentMaritalStatusDisplay, this.studentMaritalStatusInput, '', 'Select Marital Status');
      this.setAdminDropdownValue(this.adminStudentCategoryDropdown, this.adminStudentCategoryMenu, this.adminStudentCategoryDisplay, this.studentCategoryInput, '', 'Select Category');
      this.setAdminDropdownValue(this.adminStudentReligionDropdown, this.adminStudentReligionMenu, this.adminStudentReligionDisplay, this.studentReligionInput, '', 'Select Religion');
      this.studentPhoneInput.value = '';
      this.studentEmailInput.value = '';
      this.setAdminDropdownValue(this.adminStudentStateDropdown, this.adminStudentStateMenu, this.adminStudentStateDisplay, this.studentStateInput, '', 'Select State');
      this.setAdminDropdownValue(this.adminStudentDistrictDropdown, this.adminStudentDistrictMenu, this.adminStudentDistrictDisplay, this.studentDistrictInput, '', 'Select District');
      if (this.adminStudentDistrictMenu) this.adminStudentDistrictMenu.innerHTML = '';
      if (this.studentPinCodeInput) this.studentPinCodeInput.value = '';
      this.studentAddressInput.value = '';
      this.setAdminDropdownValue(this.adminStudentQualificationDropdown, this.adminStudentQualificationMenu, this.adminStudentQualificationDisplay, this.studentQualificationInput, '', 'Select Qualification');
      this.setAdminDropdownValue(this.adminStudentCourseDropdown, this.adminStudentCourseMenu, this.adminStudentCourseDisplay, this.studentCourseInput, '', 'Select Course');
      this.setAdminDropdownValue(this.adminStudentStatusDropdown, this.adminStudentStatusMenu, this.adminStudentStatusDisplay, this.studentStatusSelect, 'Active', 'Active');
    }

    this.openModal(this.studentModal);
  }

  handleStudentFormSubmit(e) {
    e.preventDefault();

    const id = this.studentIdInput.value;
    const rawName = this.studentNameInput.value.trim();
    const name = toTitleCase(rawName);
    const dob = this.studentDobInput.value;
    const rawFatherName = this.studentFatherNameInput ? this.studentFatherNameInput.value.trim() : '';
    const fatherName = toTitleCase(rawFatherName);
    const rawMotherName = this.studentMotherNameInput ? this.studentMotherNameInput.value.trim() : '';
    const motherName = toTitleCase(rawMotherName);
    const aadhar = this.studentAadharInput ? this.studentAadharInput.value.trim().replace(/\D/g, '') : '';
    const gender = this.studentGenderInput.value.trim();
    const maritalStatus = this.studentMaritalStatusInput.value.trim();
    const category = this.studentCategoryInput.value.trim();
    const religion = this.studentReligionInput.value.trim();
    const phone = this.studentPhoneInput.value.trim().replace(/\D/g, '');
    const email = this.studentEmailInput.value.trim();
    const state = this.studentStateInput.value.trim();
    const district = this.studentDistrictInput.value.trim();
    const pinCode = this.studentPinCodeInput ? this.studentPinCodeInput.value.trim().replace(/\D/g, '') : '';
    const address = this.studentAddressInput.value.trim();
    const qualification = this.studentQualificationInput.value.trim();
    const courseId = this.studentCourseInput.value.trim();
    const status = this.studentStatusSelect.value;

    if (
      !name || !dob || !fatherName || !motherName || !aadhar || !gender ||
      !maritalStatus || !category || !religion || !phone || !email ||
      !state || !district || !pinCode || !qualification || !address || !courseId
    ) {
      this.showToast('Validation Error', 'Please complete all required student fields.', 'error');
      return;
    }

    // Strict 12-Digit Aadhar Number Validation
    if (aadhar.length !== 12 || !/^\d{12}$/.test(aadhar)) {
      if (this.studentAadharInput) this.studentAadharInput.classList.add('input-error');
      if (this.studentAadharError) {
        this.studentAadharError.textContent = 'Please enter a valid 12-digit Aadhar number.';
        this.studentAadharError.style.display = 'block';
      }
      if (this.studentAadharInput) this.studentAadharInput.focus();
      this.showToast('Validation Error', 'Aadhar number must contain exactly 12 digits.', 'error');
      return;
    }

    // Strict 10-Digit Mobile Number Validation
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      this.studentPhoneInput.classList.add('input-error');
      if (this.studentPhoneError) {
        this.studentPhoneError.textContent = 'Please enter a valid 10-digit mobile number.';
        this.studentPhoneError.style.display = 'block';
      }
      this.studentPhoneInput.focus();
      this.showToast('Validation Error', 'Mobile number must contain exactly 10 digits.', 'error');
      return;
    }

    // Strict 6-Digit PIN Code Validation
    if (pinCode.length !== 6 || !/^\d{6}$/.test(pinCode)) {
      if (this.studentPinCodeInput) this.studentPinCodeInput.classList.add('input-error');
      if (this.studentPinCodeError) {
        this.studentPinCodeError.textContent = 'Please enter a valid 6-digit pin code.';
        this.studentPinCodeError.style.display = 'block';
      }
      if (this.studentPinCodeInput) this.studentPinCodeInput.focus();
      this.showToast('Validation Error', 'Pin code must be exactly 6 digits.', 'error');
      return;
    }

    const payload = {
      name,
      dob,
      fatherName,
      motherName,
      aadhar,
      gender,
      maritalStatus,
      category,
      religion,
      phone,
      email,
      state,
      district,
      pinCode,
      address,
      qualification,
      status,
      joinDate: new Date().toISOString().split('T')[0],
      enrolledCourseIds: [courseId]
    };

    if (id) {
      store.updateStudent(id, payload);
      this.showToast('Student Updated', `${name}'s records have been updated.`, 'success');
    } else {
      const newStudent = store.addStudent(payload);
      this.showToast('Student Added', `${newStudent.name} (ID: ${newStudent.id}) registered successfully.`, 'success');
    }

    this.closeModal(this.studentModal);
    this.render();
  }

  viewStudentProfile(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    this.currentViewingStudentId = student.id;
    const courses = store.getAllCourses();
    const initials = getInitials(student.name);
    const gradient = getAvatarGradient(student.name);

    const enrolledCourses = (student.enrolledCourseIds || []).map(cid => {
      const c = courses.find(item => item.id === cid);
      if (!c) return null;
      return `
        <div class="enrolled-course-chip">
          <div>
            <strong>${escapeHtml(c.title)}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
              <span><i class="fa-regular fa-clock"></i> Duration: ${escapeHtml(c.duration)}</span>
            </div>
          </div>
        </div>
      `;
    }).filter(Boolean).join('');

    this.studentDetailsContent.innerHTML = `
      <div class="profile-detail-header">
        <div class="profile-avatar-large" style="background: ${gradient}">
          ${initials}
        </div>
        <div class="profile-info">
          <h3>${escapeHtml(student.name)}</h3>
          <p>Student Identifier: <strong>${escapeHtml(student.id)}</strong></p>
          <span class="badge ${getStatusBadgeClass(student.status)}">
            <i class="fa-solid fa-circle" style="font-size: 6px;"></i> ${escapeHtml(student.status)}
          </span>
        </div>
      </div>

      <div class="profile-meta-grid">
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-user-tie"></i> Father's Name</span>
          <span class="value">${escapeHtml(student.fatherName || '—')}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-person-breastfeeding"></i> Mother's Name</span>
          <span class="value">${escapeHtml(student.motherName || '—')}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-id-card"></i> Aadhar Number</span>
          <span class="value">${escapeHtml(student.aadhar || '—')}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-regular fa-envelope"></i> Email Address</span>
          <span class="value">${escapeHtml(student.email)}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-phone"></i> Mobile Number</span>
          <span class="value">${escapeHtml(student.phone)}</span>
        </div>
        ${student.dob ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-regular fa-calendar"></i> Date of Birth</span>
            <span class="value">${formatDate(student.dob)}</span>
          </div>
        ` : ''}
        ${student.gender ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-venus-mars"></i> Gender</span>
            <span class="value">${escapeHtml(student.gender)}</span>
          </div>
        ` : ''}
        ${student.maritalStatus ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-ring"></i> Marital Status</span>
            <span class="value">${escapeHtml(student.maritalStatus)}</span>
          </div>
        ` : ''}
        ${student.category ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-layer-group"></i> Category</span>
            <span class="value">${escapeHtml(student.category)}</span>
          </div>
        ` : ''}
        ${student.religion ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-hands-praying"></i> Religion</span>
            <span class="value">${escapeHtml(student.religion)}</span>
          </div>
        ` : ''}
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-map-location-dot"></i> State & District</span>
          <span class="value">${escapeHtml(student.district ? `${student.district}, ${student.state}` : (student.state || '—'))}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-map-pin"></i> Pin Code</span>
          <span class="value">${escapeHtml(student.pinCode || '—')}</span>
        </div>
        ${student.qualification ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-award"></i> Highest Qualification</span>
            <span class="value">${escapeHtml(student.qualification)}</span>
          </div>
        ` : ''}
        <div class="profile-meta-card">
          <span class="label"><i class="fa-regular fa-calendar-check"></i> Enrollment Date</span>
          <span class="value">${formatDate(student.joinDate)}</span>
        </div>
      </div>

      ${student.address ? `
        <div style="margin-top: 1rem; padding: 0.875rem 1rem; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: flex; align-items: center; gap: 0.35rem;">
            <i class="fa-solid fa-location-dot"></i> Full Address
          </span>
          <p style="font-size: 0.875rem; color: var(--text-main); margin-top: 0.25rem;">${escapeHtml(student.address)}</p>
        </div>
      ` : ''}

      <div class="enrolled-courses-section" style="margin-top: 1rem;">
        <h4>Enrolled Courses (${(student.enrolledCourseIds || []).length})</h4>
        ${enrolledCourses || '<p style="color: var(--text-muted); font-size: 0.875rem;">No courses currently enrolled.</p>'}
      </div>
    `;

    this.openModal(this.studentDetailsModal);
  }

  confirmDeleteStudent(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    this.promptConfirmation({
      title: 'Delete Student Record?',
      message: `Are you sure you want to delete "${student.name}" (ID: ${student.id})? This action cannot be undone.`,
      action: () => {
        store.deleteStudent(studentId);
        this.render();
        this.showToast('Student Deleted', `${student.name} was removed from the registry.`, 'info');
      }
    });
  }

  // ==========================================================================
  // Course Modals & Actions (Only 3 Fields: Name, Duration, Description)
  // ==========================================================================
  openCourseModal(courseId = null) {
    this.courseForm.reset();
    if (this.durationUnitDropdown) {
      this.durationUnitDropdown.classList.remove('open');
      if (this.durationUnitTrigger) this.durationUnitTrigger.setAttribute('aria-expanded', 'false');
    }

    if (courseId) {
      const course = store.getCourseById(courseId);
      if (!course) return;

      this.courseModalTitle.textContent = 'Edit Course';
      this.courseIdInput.value = course.id;
      this.courseTitleInput.value = course.title;
      
      const parsed = parseDuration(course.duration);
      this.courseDurationValueInput.value = parsed.value;
      this.setDurationUnit(parsed.unit);

      this.courseDescriptionInput.value = course.description || '';
    } else {
      this.courseModalTitle.textContent = 'Add New Course';
      this.courseIdInput.value = '';
      this.courseDurationValueInput.value = '';
      this.setDurationUnit('Months');
    }

    this.openModal(this.courseModal);
  }

  handleCourseFormSubmit(e) {
    e.preventDefault();

    const id = this.courseIdInput.value;
    const title = this.courseTitleInput.value.trim();
    const durationVal = this.courseDurationValueInput.value.trim();
    const durationUnit = this.courseDurationUnitInput ? this.courseDurationUnitInput.value : 'Months';
    const description = this.courseDescriptionInput.value.trim();

    const num = parseFloat(durationVal);
    let unitText = durationUnit;
    if (num === 1) {
      unitText = durationUnit === 'Years' ? 'Year' : 'Month';
    } else {
      unitText = durationUnit === 'Years' ? 'Years' : 'Months';
    }
    const duration = `${durationVal} ${unitText}`;

    const payload = {
      title,
      duration,
      description
    };

    if (id) {
      store.updateCourse(id, payload);
      this.showToast('Course Updated', `"${title}" has been updated.`, 'success');
    } else {
      const newCourse = store.addCourse(payload);
      this.showToast('Course Created', `"${newCourse.title}" was created successfully.`, 'success');
    }

    this.closeModal(this.courseModal);
    this.render();
  }

  confirmDeleteCourse(courseId) {
    const course = store.getCourseById(courseId);
    if (!course) return;

    const enrolledCount = store.getCourseEnrollmentCount(courseId);
    const extraMsg = enrolledCount > 0 
      ? ` Note: ${enrolledCount} student(s) currently enrolled in this course will be automatically un-enrolled.` 
      : '';

    this.promptConfirmation({
      title: 'Delete Course?',
      message: `Are you sure you want to delete "${course.title}"?${extraMsg}`,
      action: () => {
        store.deleteCourse(courseId);
        this.render();
        this.showToast('Course Deleted', `"${course.title}" was removed.`, 'info');
      }
    });
  }

  // ==========================================================================
  // Confirmation Modal & Generic Dialog
  // ==========================================================================
  promptConfirmation({ title, message, action }) {
    this.confirmTitle.textContent = title;
    this.confirmMessage.textContent = message;
    this.confirmCallback = action;
    this.openModal(this.confirmModal);
  }

  openModal(modalElement) {
    modalElement.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalElement) {
    modalElement.classList.remove('open');
    if (document.querySelectorAll('.modal-backdrop.open').length === 0) {
      document.body.style.overflow = '';
    }
  }

  // ==========================================================================
  // Bulk Student Completion & Selection Methods
  // ==========================================================================
  handleSelectAllStudents(isChecked) {
    const allStudents = store.getAllStudents();
    const filteredStudents = allStudents.filter(student => {
      const query = this.studentSearchQuery;
      const matchesSearch = !query ||
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.phone.toLowerCase().includes(query);

      const matchesCourse = this.studentCourseFilterVal === 'all' ||
        (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(this.studentCourseFilterVal));

      const matchesStatus = this.studentStatusFilterVal === 'all' ||
        student.status === this.studentStatusFilterVal;

      return matchesSearch && matchesCourse && matchesStatus;
    });

    if (isChecked) {
      filteredStudents.forEach(s => this.selectedStudentIds.add(s.id));
    } else {
      filteredStudents.forEach(s => this.selectedStudentIds.delete(s.id));
    }

    // Update row checkbox DOM inputs
    if (this.studentsTableBody) {
      const checkboxes = this.studentsTableBody.querySelectorAll('.student-row-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = isChecked;
      });
    }

    this.updateBulkActionState(filteredStudents);
  }

  updateBulkActionState(filteredStudents) {
    if (!filteredStudents) {
      const allStudents = store.getAllStudents();
      filteredStudents = allStudents.filter(student => {
        const query = this.studentSearchQuery;
        const matchesSearch = !query ||
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query) ||
          student.phone.toLowerCase().includes(query);

        const matchesCourse = this.studentCourseFilterVal === 'all' ||
          (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(this.studentCourseFilterVal));

        const matchesStatus = this.studentStatusFilterVal === 'all' ||
          student.status === this.studentStatusFilterVal;

        return matchesSearch && matchesCourse && matchesStatus;
      });
    }

    if (this.selectAllStudentsCheckbox) {
      if (filteredStudents.length === 0) {
        this.selectAllStudentsCheckbox.checked = false;
        this.selectAllStudentsCheckbox.indeterminate = false;
      } else {
        const selectedVisibleCount = filteredStudents.filter(s => this.selectedStudentIds.has(s.id)).length;
        const allSelected = selectedVisibleCount === filteredStudents.length && filteredStudents.length > 0;
        const someSelected = selectedVisibleCount > 0 && selectedVisibleCount < filteredStudents.length;

        this.selectAllStudentsCheckbox.checked = allSelected;
        this.selectAllStudentsCheckbox.indeterminate = someSelected;
      }
    }

    if (this.btnBulkMarkCompleted) {
      const selectedCount = this.selectedStudentIds.size;
      this.btnBulkMarkCompleted.disabled = selectedCount === 0;
      if (this.bulkMarkCompletedLabel) {
        this.bulkMarkCompletedLabel.textContent = selectedCount > 0 
          ? `Mark as Completed (${selectedCount})` 
          : 'Mark as Completed';
      }
    }
  }

  handleBulkMarkCompleted() {
    const selectedCount = this.selectedStudentIds.size;
    if (selectedCount === 0) return;

    this.promptConfirmation({
      title: 'Mark Course as Completed?',
      message: `Are you sure you want to mark ${selectedCount} student(s) as "Completed"? Their academic certificates will instantly become available for verification and download on the public portal.`,
      action: () => {
        store.bulkUpdateStudents(Array.from(this.selectedStudentIds), { status: 'Completed' });
        this.showToast('Course Completed', `Successfully marked ${selectedCount} student(s) as Completed. Certificates are now available.`, 'success');
        this.selectedStudentIds.clear();
        this.render();
      }
    });
  }

  // ==========================================================================
  // Toast Notifications
  // ==========================================================================
  showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
    if (type === 'info') iconClass = 'fa-solid fa-circle-info';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-msg">${escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close alert">&times;</button>
    `;

    this.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', removeToast);
    setTimeout(removeToast, 4000);
  }

  // ==========================================================================
  // Authentication Code (OTP) Timer & Renderer
  // ==========================================================================
  renderAuthCode() {
    if (!this.authCodeDigits || !this.authCountdownTimer) return;
    const token = store.getOrGenerateAuthToken();
    const now = Date.now();
    const remainingMs = Math.max(0, token.expiresAt - now);

    // Render individual 6 digit boxes
    const codeStr = String(token.code).padStart(6, '0');
    this.authCodeDigits.innerHTML = codeStr.split('').map(d => `<span>${escapeHtml(d)}</span>`).join('');

    // Format remaining time (HH:MM:SS)
    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    this.authCountdownTimer.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    if (this.authProgressFill) {
      const AUTH_DURATION = 5 * 60 * 60 * 1000;
      const percent = (remainingMs / AUTH_DURATION) * 100;
      this.authProgressFill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    }

    // When 5-hour countdown expires, automatically generate new 6-digit code
    if (remainingMs <= 0) {
      store.getOrGenerateAuthToken(true);
      this.renderAuthCode();
    }
  }

  startAuthCountdownTimer() {
    if (this.authInterval) clearInterval(this.authInterval);
    this.renderAuthCode();
    this.authInterval = setInterval(() => {
      this.renderAuthCode();
    }, 1000);
  }

  // ==========================================================================
  // Academy Settings Modal Methods
  // ==========================================================================
  openAcademySettingsModal() {
    if (!this.academySettingsModal) return;
    const profile = store.getAcademyProfile();
    const currentSlug = profile?.slug || (this.session?.email?.includes('poulami') ? 'poulami' : 'prantik');
    const rootDomain = this.getRootDomain();

    if (this.settingsAcademyName) {
      this.settingsAcademyName.value = profile?.academyName || '';
    }
    if (this.settingsOwnerName) {
      this.settingsOwnerName.value = profile?.ownerName || this.session?.name || '';
    }
    if (this.settingsSubdomainSlug) {
      this.settingsSubdomainSlug.value = currentSlug;
    }
    if (this.settingsSubdomainSuffix) {
      this.settingsSubdomainSuffix.textContent = `.${rootDomain}`;
    }

    this.openModal(this.academySettingsModal);
    setTimeout(() => {
      if (this.settingsAcademyName) this.settingsAcademyName.focus();
    }, 200);
  }

  closeAcademySettingsModal() {
    if (!this.academySettingsModal) return;
    this.closeModal(this.academySettingsModal);
  }

  // ==========================================================================
  // Onboarding Workflow (One-Time Academy & Owner Setup)
  // ==========================================================================
  checkOnboarding() {
    const profile = store.getAcademyProfile();
    if (!profile || !profile.academyName || !profile.ownerName) {
      this.openOnboardingModal();
    }
  }

  openOnboardingModal() {
    if (!this.onboardingModal) return;
    const rootDomain = this.getRootDomain();
    const defaultSlug = this.session?.email?.includes('poulami') ? 'poulami' : 'prantik';

    if (this.onboardingOwnerName && this.session && this.session.name && this.session.name !== 'Super Administrator') {
      this.onboardingOwnerName.value = this.session.name;
    }
    if (this.onboardingSubdomainSlug) {
      this.onboardingSubdomainSlug.value = defaultSlug;
    }
    if (this.onboardingSubdomainSuffix) {
      this.onboardingSubdomainSuffix.textContent = `.${rootDomain}`;
    }

    this.openModal(this.onboardingModal);
    setTimeout(() => {
      if (this.onboardingAcademyName) this.onboardingAcademyName.focus();
    }, 200);
  }

  closeOnboardingModal() {
    if (!this.onboardingModal) return;
    this.closeModal(this.onboardingModal);
  }
}

// ==========================================================================
// Helper Utility Functions
// ==========================================================================
function getStatusBadgeClass(status) {
  switch (status) {
    case 'Active':
      return 'badge-active';
    case 'Inactive':
      return 'badge-inactive';
    case 'Completed':
      return 'badge-completed';
    default:
      return 'badge-category';
  }
}

function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseDuration(durationStr) {
  if (!durationStr) return { value: '', unit: 'Months' };
  const str = String(durationStr).trim();
  const match = str.match(/^(\d+(?:\.\d+)?)\s*(months?|years?)/i);
  if (match) {
    const val = match[1];
    const rawUnit = match[2].toLowerCase();
    const unit = rawUnit.startsWith('year') ? 'Years' : 'Months';
    return { value: val, unit };
  }
  const numOnly = parseFloat(str);
  if (!isNaN(numOnly)) {
    return { value: numOnly, unit: 'Months' };
  }
  return { value: '', unit: 'Months' };
}

function escapeQuotes(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '""');
}

// ==========================================================================
// Global Formatters & Input Validators
// ==========================================================================
function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
    .join(' ');
}

function applyAutoCapitalization(inputElement) {
  if (!inputElement) return;

  inputElement.addEventListener('input', (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const original = e.target.value;

    // Capitalize first letter of every word
    const capitalized = original.replace(/\b[a-z]/g, char => char.toUpperCase());
    if (capitalized !== original) {
      e.target.value = capitalized;
      if (start !== null && end !== null) {
        e.target.setSelectionRange(start, end);
      }
    }
  });

  inputElement.addEventListener('blur', (e) => {
    if (e.target.value) {
      e.target.value = toTitleCase(e.target.value);
    }
  });
}

function setupPhoneInputValidation(phoneInput, errorElement) {
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    // Filter non-digits and cap at exactly 10 digits
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    e.target.value = val;

    if (val.length > 0 && val.length < 10) {
      phoneInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = `Mobile number must be exactly 10 digits (${val.length}/10 entered).`;
        errorElement.style.display = 'block';
      }
    } else {
      phoneInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });

  phoneInput.addEventListener('blur', (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 0 && val.length !== 10) {
      phoneInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = 'Please enter a valid 10-digit mobile number.';
        errorElement.style.display = 'block';
      }
    } else if (val.length === 10) {
      phoneInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });
}

function setupPinCodeInputValidation(pinInput, errorElement) {
  if (!pinInput) return;

  pinInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 6) val = val.slice(0, 6);
    pinInput.value = val;

    if (val.length > 0 && val.length < 6) {
      pinInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = `Pin code must be exactly 6 digits (${val.length}/6 entered).`;
        errorElement.style.display = 'block';
      }
    } else {
      pinInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });

  pinInput.addEventListener('blur', (e) => {
    const val = pinInput.value.replace(/\D/g, '');
    if (val.length > 0 && val.length !== 6) {
      pinInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = 'Please enter a valid 6-digit pin code.';
        errorElement.style.display = 'block';
      }
    } else if (val.length === 6) {
      pinInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });
}

function setupAadharInputValidation(aadharInput, errorElement) {
  if (!aadharInput) return;

  aadharInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 12) val = val.slice(0, 12);
    aadharInput.value = val;

    if (val.length > 0 && val.length < 12) {
      aadharInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = `Aadhar number must be exactly 12 digits (${val.length}/12 entered).`;
        errorElement.style.display = 'block';
      }
    } else {
      aadharInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });

  aadharInput.addEventListener('blur', (e) => {
    const val = aadharInput.value.replace(/\D/g, '');
    if (val.length > 0 && val.length !== 12) {
      aadharInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = 'Please enter a valid 12-digit Aadhar number.';
        errorElement.style.display = 'block';
      }
    } else if (val.length === 12) {
      aadharInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });
}

// ==========================================================================
// App Initialization
// ==========================================================================
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new UIController();
  window.app = app;
  const initialHash = window.location.hash.replace('#', '');
  if (['students', 'courses'].includes(initialHash)) {
    app.switchView(initialHash, false);
  }
});
