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
  BATCHES: 'educore_academy_batches',
  MESSAGES: 'educore_academy_messages',
  AUTH_TOKEN: 'educore_academy_auth_token',
  SESSION: 'educore_admin_session',
  ACADEMY_PROFILE: 'pixelsetu_academy_profile'
};

const DEFAULT_COMPUTER_COURSES = [
  { id: 'CRS-101', title: 'Diploma in Computer Applications (DCA)', duration: '6 Months', description: 'Comprehensive fundamentals of computer operations, MS Office suite, Internet basics, and database concepts.', createdAt: '2026-01-06T09:00:00.000Z' },
  { id: 'CRS-102', title: 'Full Stack Web Development', duration: '1 Year', description: 'Modern front-end and back-end web development with HTML5, CSS3, JavaScript, Node.js, and databases.', createdAt: '2026-01-05T09:00:00.000Z' },
  { id: 'CRS-103', title: 'Post Graduate Diploma in Computer Applications (PGDCA)', duration: '1 Year', description: 'Advanced programming concepts, system architecture, database administration, and project implementation.', createdAt: '2026-01-04T09:00:00.000Z' },
  { id: 'CRS-104', title: 'Certificate in Office Automation', duration: '3 Months', description: 'Practical training in Word, Excel, PowerPoint, email, document formatting, and everyday office productivity.', createdAt: '2026-01-03T09:00:00.000Z' },
  { id: 'CRS-105', title: 'Tally Prime with GST', duration: '4 Months', description: 'Learn computerized accounting, inventory management, GST invoicing, taxation reports, and payroll using Tally Prime.', createdAt: '2026-01-02T09:00:00.000Z' },
  { id: 'CRS-106', title: 'Graphic Design Fundamentals', duration: '6 Months', description: 'Build creative design skills through typography, image editing, branding, social media graphics, and print layouts.', createdAt: '2026-01-01T09:00:00.000Z' }
];
const COURSE_SEED_VERSION = '1';

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

function getInboxIconSvg() {
  return `<svg viewBox="0 0 512 512" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M 38.5 76.0 L 39.0 75.5 L 472.0 75.5 L 473.0 76.5 L 477.0 76.5 L 478.0 77.5 L 481.0 77.5 L 484.0 79.5 L 486.0 79.5 L 490.0 82.5 L 491.0 82.5 L 493.0 84.5 L 494.0 84.5 L 502.5 93.0 L 502.5 94.0 L 506.5 99.0 L 506.5 101.0 L 509.5 106.0 L 509.5 109.0 L 510.5 110.0 L 510.5 114.0 L 511.5 115.0 L 511.5 396.0 L 510.5 397.0 L 510.5 401.0 L 509.5 402.0 L 509.5 405.0 L 504.5 415.0 L 502.5 417.0 L 502.5 418.0 L 494.0 426.5 L 493.0 426.5 L 491.0 428.5 L 481.0 433.5 L 478.0 433.5 L 477.0 434.5 L 473.0 434.5 L 472.0 435.5 L 39.0 435.5 L 38.0 434.5 L 34.0 434.5 L 33.0 433.5 L 28.0 432.5 L 20.0 428.5 L 17.0 425.5 L 16.0 425.5 L 8.5 418.0 L 8.5 417.0 L 4.5 412.0 L 4.5 410.0 L 1.5 405.0 L 1.5 402.0 L 0.5 401.0 L 0.5 397.0 L 0.0 396.0 L 0.0 115.0 L 0.5 114.0 L 0.5 110.0 L 1.5 109.0 L 1.5 106.0 L 4.5 101.0 L 4.5 99.0 L 6.5 97.0 L 8.5 93.0 L 16.0 85.5 L 17.0 85.5 L 23.0 80.5 L 25.0 80.5 L 30.0 77.5 L 33.0 77.5 L 34.0 76.5 L 38.5 76.0 Z M 51.5 106.0 L 52.0 105.5 L 459.0 105.5 L 459.5 106.0 L 265.0 300.5 L 261.0 302.5 L 250.0 302.5 L 246.0 300.5 L 51.5 106.0 Z M 29.5 127.0 L 30.0 126.5 L 158.5 255.0 L 158.5 256.0 L 30.0 384.5 L 29.5 384.0 L 29.5 127.0 Z M 480.5 127.0 L 481.0 126.5 L 481.5 127.0 L 481.5 384.0 L 481.0 384.5 L 352.5 256.0 L 352.5 255.0 L 480.5 127.0 Z M 178.5 278.0 L 181.0 277.5 L 181.5 279.0 L 223.0 320.5 L 224.0 320.5 L 231.0 326.5 L 239.0 330.5 L 241.0 330.5 L 242.0 331.5 L 245.0 331.5 L 246.0 332.5 L 265.0 332.5 L 266.0 331.5 L 269.0 331.5 L 270.0 330.5 L 272.0 330.5 L 280.0 326.5 L 286.0 321.5 L 287.0 321.5 L 331.0 277.5 L 332.0 277.5 L 459.5 405.0 L 459.0 405.5 L 52.0 405.5 L 51.5 405.0 L 178.5 278.0 Z"/></svg>`;
}


// ==========================================================================
// 2. State & Storage Management
// ==========================================================================
class AcademyStore {
  constructor(academySlug = 'prantik') {
    this.ownerEmail = (academySlug || 'prantik').toLowerCase().trim();
    this.courses = [];
    this.students = [];
    this.messages = [];
    this.batches = [];
    this.init();
  }

  getStorageKey(baseKey) {
    return `${baseKey}_${this.ownerEmail}`;
  }

  init() {
    const rawCourses = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.COURSES));
    const rawStudents = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.STUDENTS));
    const rawMessages = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.MESSAGES));
    const rawBatches = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.BATCHES));

    if (rawCourses) {
      try {
        this.courses = JSON.parse(rawCourses) || [];
      } catch (e) {
        this.courses = [];
      }
    } else {
      this.courses = this.ownerEmail.includes('poulami') ? [] : DEFAULT_COMPUTER_COURSES.map(course => ({ ...course }));
      if (this.courses.length > 0) {
        localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
      }
    }

    const seedVersionKey = this.getStorageKey('educore_course_seed_version');
    if (!this.ownerEmail.includes('poulami') && localStorage.getItem(seedVersionKey) !== COURSE_SEED_VERSION) {
      const existingIds = new Set(this.courses.map(course => course.id));
      DEFAULT_COMPUTER_COURSES.forEach(course => {
        if (!existingIds.has(course.id)) this.courses.push({ ...course });
      });
      localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
      localStorage.setItem(seedVersionKey, COURSE_SEED_VERSION);
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

    if (rawMessages) {
      try {
        this.messages = JSON.parse(rawMessages) || [];
      } catch (e) {
        this.messages = [];
      }
    }
    try { this.batches = JSON.parse(rawBatches || '[]') || []; } catch { this.batches = []; }

    // Ensure historical/existing records have createdAt timestamps for accurate New to Old sorting
    const baseTime = new Date('2026-01-01T00:00:00.000Z').getTime();
    if (Array.isArray(this.courses)) {
      this.courses = this.courses.map((c, idx) => {
        if (!c.createdAt) return { ...c, createdAt: new Date(baseTime + (this.courses.length - idx) * 60000).toISOString() };
        return c;
      });
    }
    if (Array.isArray(this.batches)) {
      this.batches = this.batches.map((b, idx) => {
        if (!b.createdAt) return { ...b, createdAt: new Date(baseTime + (this.batches.length - idx) * 60000).toISOString() };
        return b;
      });
    }
    if (Array.isArray(this.messages)) {
      this.messages = this.messages.map((m, idx) => {
        if (!m.createdAt) return { ...m, createdAt: new Date(baseTime + (this.messages.length - idx) * 60000).toISOString() };
        return m;
      });
    }
  }

  // Asynchronously synchronize with MongoDB Multi-Tenant Cloud Storage (/api/data)
  async fetchCloudData(onLoadedCallback) {
    try {
      const response = await fetch(`/api/data?academy=${encodeURIComponent(this.ownerEmail)}&admin=1`, { cache: 'no-store' });
      if (!response.ok) return false;
      const json = await response.json();
      if (json && json.success && json.data) {
        const { profile, courses, students, messages, batches, authToken } = json.data;

        if (Array.isArray(courses)) {
          this.courses = courses;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
        }

        if (Array.isArray(students)) {
          this.students = students;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.STUDENTS), JSON.stringify(this.students));
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
        } else if (this.students.length > 0) {
          this.syncToCloud('save_students', { students: this.students });
        }

        if (Array.isArray(messages)) {
          this.messages = messages;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.MESSAGES), JSON.stringify(this.messages));
        }
        if (Array.isArray(batches)) {
          this.batches = batches;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.BATCHES), JSON.stringify(this.batches));
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
            academySlug: this.ownerEmail
          }
        })
      });
      if (!response.ok) return false;
      return await response.json().catch(() => false);
    } catch (e) {
      return false;
    }
  }

  save() {
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.STUDENTS), JSON.stringify(this.students));
  }

  getAllMessages() {
    return [...this.messages].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }

  getAllBatches() {
    return [...this.batches].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }

  async saveBatch(batch) {
    const result = await this.syncToCloud('save_batch', { batch });
    if (!result?.success || !result.batch) throw new Error('Batch could not be saved.');
    const index = this.batches.findIndex(item => item.id === result.batch.id);
    if (index >= 0) this.batches[index] = result.batch;
    else this.batches.unshift(result.batch);
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.BATCHES), JSON.stringify(this.batches));
    return result.batch;
  }

  async deleteBatch(batchId) {
    this.batches = this.batches.filter(item => item.id !== batchId);
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.BATCHES), JSON.stringify(this.batches));
    await this.syncToCloud('delete_batch', { batchId });
  }

  markMessageRead(messageId) {
    const message = this.messages.find(item => item.id === messageId);
    if (!message || message.isRead) return;
    message.isRead = true;
    message.readAt = new Date().toISOString();
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.MESSAGES), JSON.stringify(this.messages));
    this.syncToCloud('mark_message_read', { messageId });
  }

  deleteMessage(messageId) {
    this.messages = this.messages.filter(item => item.id !== messageId);
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.MESSAGES), JSON.stringify(this.messages));
    this.syncToCloud('delete_message', { messageId });
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
        email: 'swarupkhan1@gmail.com',
        phone: '9733894742',
        secondaryPhone: '9733894742',
        whatsapp: '9733894742',
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

  async addStudent(studentData) {
    const result = await this.syncToCloud('add_student', { student: studentData });
    if (!result?.success || !result?.student) throw new Error('The student ID could not be generated.');
    const newStudent = result.student;
    this.students.unshift(newStudent);
    this.save();
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
    return [...this.courses].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
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
      description: courseData.description,
      createdAt: new Date().toISOString()
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

// All OAuth-approved administrators manage the configured academy.
const activeAcademySlug = window.ADMIN_PORTAL_CONFIG?.adminAcademySlug || 'prantik';
const store = new AcademyStore(activeAcademySlug);


// ==========================================================================
// 3. UI Controller & Rendering
// ==========================================================================
class UIController {
  constructor() {
    // Check Authentication Session Gate
    const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!rawSession) {
      window.location.href = 'index.html';
      return;
    }

    try {
      this.session = JSON.parse(rawSession);
      const userEmail = (this.session?.email || '').toLowerCase().trim();
      if (!this.session || this.session.provider !== 'google' || !userEmail) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        window.location.href = 'index.html';
        return;
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      window.location.href = 'index.html';
      return;
    }

    // Keep storage and cloud requests scoped to the configured academy.
    store.ownerEmail = activeAcademySlug;
    store.init();

    this.currentView = 'dashboard';
    this.confirmCallback = null;

    // Filter states
    this.studentSearchQuery = '';
    this.studentCourseFilterVal = 'all';
    this.studentStatusFilterVal = 'all';
    this.courseSearchQuery = '';
    this.selectedStudentIds = new Set();
    this.completionStudentIds = new Set();
    this.editingBatchId = null;
    this.editingBatchStudentIds = new Set();
    this.editingBatchMemberIds = new Set();
    this.editBatchSearchQuery = '';

    this.cacheDOMElements();
    this.populateCompletionPeriodSelectors();
    this.bindEvents();
    this.render();
    this.startAuthCountdownTimer();
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
    return 'pixelsetu.com';
  }

  getPublicUrlForSlug(slug) {
    const configuredSites = window.ADMIN_PORTAL_CONFIG?.publicSites || {};
    return configuredSites[slug]
      || window.ADMIN_PORTAL_CONFIG?.defaultPublicSiteUrl
      || 'https://diganta.pixelsetu.com';
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
    this.pageTitleIcon = document.getElementById('pageTitleIcon');
    this.studentCountBadge = document.getElementById('studentCountBadge');
    this.courseCountBadge = document.getElementById('courseCountBadge');
    this.inboxUnreadBadge = document.getElementById('inboxUnreadBadge');

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
    this.statTotalCourses = document.getElementById('statTotalCourses');
    this.dashboardInboxList = document.getElementById('dashboardInboxList');
    this.btnViewInbox = document.getElementById('btnViewInbox');

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

    this.batchActionMenu = document.getElementById('batchActionMenu');
    this.btnCreateBatch = document.getElementById('btnCreateBatch');
    this.batchActionDropdown = document.getElementById('batchActionDropdown');
    this.btnCreateNewBatch = document.getElementById('btnCreateNewBatch');
    this.btnAddToExistingBatch = document.getElementById('btnAddToExistingBatch');
    this.btnBulkMarkCompleted = document.getElementById('btnBulkMarkCompleted');
    this.bulkMarkCompletedLabel = document.getElementById('bulkMarkCompletedLabel');
    this.btnAddStudent = document.getElementById('btnAddStudent');
    this.selectAllStudentsCheckbox = document.getElementById('selectAllStudentsCheckbox');
    this.studentsTableBody = document.getElementById('studentsTableBody');
    this.studentsEmptyState = document.getElementById('studentsEmptyState');
    this.studentFilteredCount = document.getElementById('studentFilteredCount');
    this.studentTotalCount = document.getElementById('studentTotalCount');
    this.studentSelectionCount = document.getElementById('studentSelectionCount');
    this.btnResetStudentFilters = document.getElementById('btnResetStudentFilters');

    // Course View Elements
    this.courseSearchInput = document.getElementById('courseSearchInput');
    this.btnClearCourseSearch = document.getElementById('btnClearCourseSearch');
    this.btnAddCourse = document.getElementById('btnAddCourse');
    this.coursesGrid = document.getElementById('coursesGrid');
    this.coursesEmptyState = document.getElementById('coursesEmptyState');
    this.btnResetCourseFilters = document.getElementById('btnResetCourseFilters');

    // Inbox Elements
    this.inboxList = document.getElementById('inboxList');
    this.inboxEmptyState = document.getElementById('inboxEmptyState');
    this.btnRefreshInbox = document.getElementById('btnRefreshInbox');
    this.batchCountBadge = document.getElementById('batchCountBadge');
    this.batchesGrid = document.getElementById('batchesGrid');
    this.batchesEmptyState = document.getElementById('batchesEmptyState');
    this.batchSearchInput = document.getElementById('batchSearchInput');
    this.btnClearBatchSearch = document.getElementById('btnClearBatchSearch');
    this.btnResetBatchFilters = document.getElementById('btnResetBatchFilters');
    this.batchesEmptyTitle = document.getElementById('batchesEmptyTitle');
    this.batchesEmptyDesc = document.getElementById('batchesEmptyDesc');
    this.batchSearchQuery = '';
    this.btnAddBatch = document.getElementById('btnAddBatch');
    this.btnEmptyCreateBatch = document.getElementById('btnEmptyCreateBatch');

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
    this.btnDeleteStudentModal = document.getElementById('btnDeleteStudentModal');

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
    this.btnDeleteStudentFromDetails = document.getElementById('btnDeleteStudentFromDetails');
    this.currentViewingStudentId = null;
    this.completingBatchId = null;

    // Modals - Batch Management
    this.batchModal = document.getElementById('batchModal');
    this.batchForm = document.getElementById('batchForm');
    this.batchModalTitle = document.getElementById('batchModalTitle');
    this.batchStudentCount = document.getElementById('batchStudentCount');
    this.batchNameGroup = document.getElementById('batchNameGroup');
    this.batchNameInput = document.getElementById('batchNameInput');
    this.existingBatchGroup = document.getElementById('existingBatchGroup');
    this.existingBatchDropdown = document.getElementById('existingBatchDropdown');
    this.existingBatchTrigger = document.getElementById('existingBatchTrigger');
    this.existingBatchMenu = document.getElementById('existingBatchMenu');
    this.existingBatchDisplay = document.getElementById('existingBatchDisplay');
    this.existingBatchSelect = document.getElementById('existingBatchSelect');
    this.batchStudentSelectionGroup = document.getElementById('batchStudentSelectionGroup');
    this.createBatchSelectionCount = document.getElementById('createBatchSelectionCount');
    this.createBatchStudentSearch = document.getElementById('createBatchStudentSearch');
    this.createBatchStudentList = document.getElementById('createBatchStudentList');
    this.createBatchEmptyState = document.getElementById('createBatchEmptyState');
    this.createBatchSelectedStudentIds = new Set();
    this.createBatchSearchQuery = '';
    this.saveBatchLabel = document.getElementById('saveBatchLabel');
    this.btnCloseBatchModal = document.getElementById('btnCloseBatchModal');
    this.btnCancelBatchModal = document.getElementById('btnCancelBatchModal');
    this.batchModalMode = 'create';

    // Modal - Edit Batch Students
    this.editBatchModal = document.getElementById('editBatchModal');
    this.editBatchForm = document.getElementById('editBatchForm');
    this.editBatchName = document.getElementById('editBatchName');
    this.editBatchStudentSearch = document.getElementById('editBatchStudentSearch');
    this.editBatchSelectionCount = document.getElementById('editBatchSelectionCount');
    this.editBatchStudentList = document.getElementById('editBatchStudentList');
    this.editBatchEmptyState = document.getElementById('editBatchEmptyState');
    this.editBatchStatusDropdown = document.getElementById('editBatchStatusDropdown');
    this.editBatchStatusTrigger = document.getElementById('editBatchStatusTrigger');
    this.editBatchStatusMenu = document.getElementById('editBatchStatusMenu');
    this.editBatchStatusDisplay = document.getElementById('editBatchStatusDisplay');
    this.editBatchStatus = document.getElementById('editBatchStatus');
    this.btnCloseEditBatchModal = document.getElementById('btnCloseEditBatchModal');
    this.btnCancelEditBatch = document.getElementById('btnCancelEditBatch');
    this.btnDeleteBatch = document.getElementById('btnDeleteBatch');

    // Modals - Course Completion
    this.completionModal = document.getElementById('completionModal');
    this.completionForm = document.getElementById('completionForm');
    this.completionModalTitle = document.getElementById('completionModalTitle');
    this.completionStudentCount = document.getElementById('completionStudentCount');
    this.completionStartMonthDropdown = document.getElementById('completionStartMonthDropdown');
    this.completionStartMonthTrigger = document.getElementById('completionStartMonthTrigger');
    this.completionStartMonthMenu = document.getElementById('completionStartMonthMenu');
    this.completionStartMonthDisplay = document.getElementById('completionStartMonthDisplay');
    this.completionStartMonth = document.getElementById('completionStartMonth');
    this.completionStartYearDropdown = document.getElementById('completionStartYearDropdown');
    this.completionStartYearTrigger = document.getElementById('completionStartYearTrigger');
    this.completionStartYearMenu = document.getElementById('completionStartYearMenu');
    this.completionStartYearDisplay = document.getElementById('completionStartYearDisplay');
    this.completionStartYear = document.getElementById('completionStartYear');
    this.completionEndMonthDropdown = document.getElementById('completionEndMonthDropdown');
    this.completionEndMonthTrigger = document.getElementById('completionEndMonthTrigger');
    this.completionEndMonthMenu = document.getElementById('completionEndMonthMenu');
    this.completionEndMonthDisplay = document.getElementById('completionEndMonthDisplay');
    this.completionEndMonth = document.getElementById('completionEndMonth');
    this.completionEndYearDropdown = document.getElementById('completionEndYearDropdown');
    this.completionEndYearTrigger = document.getElementById('completionEndYearTrigger');
    this.completionEndYearMenu = document.getElementById('completionEndYearMenu');
    this.completionEndYearDisplay = document.getElementById('completionEndYearDisplay');
    this.completionEndYear = document.getElementById('completionEndYear');
    this.completionIssueDate = document.getElementById('completionIssueDate');
    this.completionGrade = document.getElementById('completionGrade');
    this.btnCloseCompletionModal = document.getElementById('btnCloseCompletionModal');
    this.btnCancelCompletion = document.getElementById('btnCancelCompletion');

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

  populateCompletionPeriodSelectors() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthOptions = monthNames.map((name, index) =>
      `<li class="custom-select-option" data-value="${String(index + 1).padStart(2, '0')}" role="option">${name}</li>`
    ).join('');
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from(
      { length: 11 },
      (_, index) => currentYear + 5 - index
    ).map(year => `<li class="custom-select-option" data-value="${year}" role="option">${year}</li>`).join('');

    this.completionStartMonthMenu.innerHTML = monthOptions;
    this.completionEndMonthMenu.innerHTML = monthOptions;
    this.completionStartYearMenu.innerHTML = yearOptions;
    this.completionEndYearMenu.innerHTML = yearOptions;

    [
      [this.completionStartMonthDropdown, this.completionStartMonthTrigger, this.completionStartMonthMenu, this.completionStartMonthDisplay, this.completionStartMonth],
      [this.completionStartYearDropdown, this.completionStartYearTrigger, this.completionStartYearMenu, this.completionStartYearDisplay, this.completionStartYear],
      [this.completionEndMonthDropdown, this.completionEndMonthTrigger, this.completionEndMonthMenu, this.completionEndMonthDisplay, this.completionEndMonth],
      [this.completionEndYearDropdown, this.completionEndYearTrigger, this.completionEndYearMenu, this.completionEndYearDisplay, this.completionEndYear]
    ].forEach(([container, trigger, menu, display, input]) => {
      this.setupAdminDropdown(container, trigger, menu, display, input, () => {
        trigger.classList.remove('input-error');
        this.validateCompletionPeriodSelection();
      });
    });
  }

  getCompletionPeriodValue(monthSelect, yearSelect) {
    return monthSelect.value && yearSelect.value ? `${yearSelect.value}-${monthSelect.value}` : '';
  }

  validateCompletionPeriodSelection() {
    const startMonth = this.getCompletionPeriodValue(this.completionStartMonth, this.completionStartYear);
    const endMonth = this.getCompletionPeriodValue(this.completionEndMonth, this.completionEndYear);
    if (startMonth && endMonth && endMonth < startMonth) {
      this.setAdminDropdownValue(this.completionEndMonthDropdown, this.completionEndMonthMenu, this.completionEndMonthDisplay, this.completionEndMonth, '', 'Month');
    }
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
      if (['dashboard', 'students', 'courses', 'inbox'].includes(hash)) {
        this.switchView(hash, false);
      }
    });

    // Mobile Sidebar controls
    this.btnSidebarToggle.addEventListener('click', () => this.openSidebar());
    this.btnCloseSidebar.addEventListener('click', () => this.closeSidebar());
    this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());

    // Dashboard shortcuts
    this.btnViewInbox?.addEventListener('click', () => this.switchView('inbox'));
    if (this.btnRefreshInbox) {
      this.btnRefreshInbox.addEventListener('click', async () => {
        this.btnRefreshInbox.disabled = true;
        await store.fetchCloudData(() => this.render());
        this.btnRefreshInbox.disabled = false;
      });
    }
    
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
            if (window.google?.accounts?.id) {
              window.google.accounts.id.disableAutoSelect();
            }
            window.location.href = 'index.html';
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
        if (this.adminStudentStatusFilterDropdown) {
          this.adminStudentStatusFilterDropdown.classList.toggle('is-filtered', val !== 'all');
        }
        if (this.adminStudentStatusFilterTrigger) {
          this.adminStudentStatusFilterTrigger.title = val === 'all' ? 'Filter by Status' : `Status: ${val}`;
        }
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
      if (this.adminStudentStatusFilterDropdown) {
        this.adminStudentStatusFilterDropdown.classList.remove('is-filtered');
      }
      if (this.adminStudentStatusFilterTrigger) {
        this.adminStudentStatusFilterTrigger.title = 'Filter by Status';
      }
      this.btnClearStudentSearch.style.display = 'none';
      this.renderStudentsView();
    });

    // Bulk Mark Completed Handler
    if (this.btnBulkMarkCompleted) {
      this.btnBulkMarkCompleted.addEventListener('click', () => this.handleBulkMarkCompleted());
    }

    if (this.btnCreateBatch && this.batchActionMenu) {
      this.btnCreateBatch.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !this.batchActionMenu.classList.contains('open');
        this.closeAllAdminDropdowns(this.batchActionMenu);
        this.batchActionMenu.classList.toggle('open', willOpen);
        this.btnCreateBatch.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) this.btnCreateNewBatch?.focus();
      });
    }

    this.batchesGrid?.addEventListener('click', (e) => {
      const button = e.target.closest('[data-batch-action]');
      if (!button) return;
      const batch = store.getAllBatches().find(item => item.id === button.dataset.batchId);
      if (!batch) return;
      if (button.dataset.batchAction === 'edit') {
        this.openEditBatchModal(batch.id);
      }
      if (button.dataset.batchAction === 'complete') {
        const batchStudentIds = (batch.studentIds || []).filter(id => store.getStudentById(id));
        this.handleBulkMarkCompleted(batch.id, batchStudentIds);
      }
      if (button.dataset.batchAction === 'download-certs') {
        this.downloadBatchCertificatesZip(batch.id);
      }
    });

    [this.btnCreateNewBatch, this.btnAddToExistingBatch].forEach((option, index) => {
      option?.addEventListener('click', async (e) => {
        e.stopPropagation();
        this.batchActionMenu?.classList.remove('open');
        this.btnCreateBatch?.setAttribute('aria-expanded', 'false');
        this.btnCreateBatch?.focus();
        if (index === 0) await this.handleCreateNewBatch();
        else await this.handleAddToExistingBatch();
      });
    });

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

      this.studentsTableBody.addEventListener('click', (e) => {
        const nameBlock = e.target.closest('.student-meta-cell');
        if (nameBlock) {
          const row = nameBlock.closest('tr');
          const checkbox = row ? row.querySelector('.student-row-checkbox') : null;
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            const studentId = checkbox.getAttribute('data-student-id');
            if (checkbox.checked) {
              this.selectedStudentIds.add(studentId);
            } else {
              this.selectedStudentIds.delete(studentId);
            }
            this.updateBulkActionState();
          }
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

    // Batch Search Handler
    if (this.batchSearchInput) {
      this.batchSearchInput.addEventListener('input', (e) => {
        this.batchSearchQuery = e.target.value.trim().toLowerCase();
        if (this.btnClearBatchSearch) {
          this.btnClearBatchSearch.style.display = this.batchSearchQuery ? 'block' : 'none';
        }
        this.renderBatchesView();
      });
    }

    if (this.btnClearBatchSearch) {
      this.btnClearBatchSearch.addEventListener('click', () => {
        if (this.batchSearchInput) this.batchSearchInput.value = '';
        this.batchSearchQuery = '';
        this.btnClearBatchSearch.style.display = 'none';
        this.renderBatchesView();
      });
    }

    if (this.btnResetBatchFilters) {
      this.btnResetBatchFilters.addEventListener('click', () => {
        if (this.batchSearchInput) this.batchSearchInput.value = '';
        this.batchSearchQuery = '';
        if (this.btnClearBatchSearch) this.btnClearBatchSearch.style.display = 'none';
        this.renderBatchesView();
      });
    }

    if (this.btnAddBatch) {
      this.btnAddBatch.addEventListener('click', () => this.openCreateBatchModal());
    }

    if (this.btnEmptyCreateBatch) {
      this.btnEmptyCreateBatch.addEventListener('click', () => this.openCreateBatchModal());
    }

    if (this.createBatchStudentSearch) {
      this.createBatchStudentSearch.addEventListener('input', (e) => {
        this.createBatchSearchQuery = e.target.value.trim().toLowerCase();
        this.renderCreateBatchStudentList();
      });
    }

    if (this.createBatchStudentList) {
      this.createBatchStudentList.addEventListener('change', (e) => {
        const checkbox = e.target.closest('.create-batch-student-checkbox');
        if (checkbox) {
          const studentId = checkbox.dataset.studentId;
          if (checkbox.checked) {
            this.createBatchSelectedStudentIds.add(studentId);
          } else {
            this.createBatchSelectedStudentIds.delete(studentId);
          }
          if (this.createBatchSelectionCount) {
            this.createBatchSelectionCount.textContent = `${this.createBatchSelectedStudentIds.size} selected`;
          }
        }
      });
    }

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

    window.addEventListener('resize', () => {
      if (this.portaledMenu) this.closeAllAdminDropdowns();
    }, { passive: true });

    window.addEventListener('scroll', () => {
      if (this.portaledMenu) this.closeAllAdminDropdowns();
    }, { passive: true });

    document.querySelectorAll('.modal-body, .table-responsive').forEach(el => {
      el.addEventListener('scroll', () => {
        if (this.portaledMenu) this.closeAllAdminDropdowns();
      }, { passive: true });
    });

    // Form Submissions
    this.studentForm.addEventListener('submit', (e) => this.handleStudentFormSubmit(e));
    this.courseForm.addEventListener('submit', (e) => this.handleCourseFormSubmit(e));

    // Modal Close Buttons
    this.btnCloseStudentModal.addEventListener('click', () => this.closeModal(this.studentModal));
    this.btnCancelStudentModal.addEventListener('click', () => this.closeModal(this.studentModal));
    this.btnDeleteStudentModal?.addEventListener('click', () => {
      const studentId = this.studentIdInput.value;
      if (!studentId) return;
      this.closeModal(this.studentModal);
      this.confirmDeleteStudent(studentId);
    });

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
    this.btnDeleteStudentFromDetails?.addEventListener('click', () => {
      const studentId = this.currentViewingStudentId;
      if (!studentId) return;
      this.closeModal(this.studentDetailsModal);
      this.confirmDeleteStudent(studentId);
    });

    this.completionForm.addEventListener('submit', (e) => this.handleCompletionSubmit(e));
    [this.completionStartMonth, this.completionStartYear, this.completionEndMonth, this.completionEndYear]
      .forEach(select => select.addEventListener('change', () => this.validateCompletionPeriodSelection()));
    this.btnCloseCompletionModal.addEventListener('click', () => this.closeModal(this.completionModal));
    this.btnCancelCompletion.addEventListener('click', () => this.closeModal(this.completionModal));
    this.btnCloseBatchModal?.addEventListener('click', () => this.closeModal(this.batchModal));
    this.btnCancelBatchModal?.addEventListener('click', () => this.closeModal(this.batchModal));
    this.batchForm?.addEventListener('submit', (e) => this.handleBatchFormSubmit(e));
    this.setupAdminDropdown(
      this.existingBatchDropdown,
      this.existingBatchTrigger,
      this.existingBatchMenu,
      this.existingBatchDisplay,
      this.existingBatchSelect,
      () => this.existingBatchTrigger.classList.remove('input-error')
    );
    this.btnCloseEditBatchModal?.addEventListener('click', () => this.closeModal(this.editBatchModal));
    this.btnCancelEditBatch?.addEventListener('click', () => this.closeModal(this.editBatchModal));
    this.btnDeleteBatch?.addEventListener('click', () => {
      const batchId = this.editingBatchId;
      const batch = store.getAllBatches().find(item => item.id === batchId);
      if (!batch) return;
      this.promptConfirmation({
        title: 'Delete Batch?',
        message: `Are you sure you want to delete the batch "${batch.name}"? This action cannot be undone.`,
        action: async () => {
          this.closeModal(this.editBatchModal);
          await store.deleteBatch(batchId);
          this.render();
          this.showToast('Batch Deleted', `Batch "${batch.name}" has been deleted.`, 'info');
        }
      });
    });
    this.editBatchForm?.addEventListener('submit', (e) => this.handleEditBatchSubmit(e));
    this.setupAdminDropdown(
      this.editBatchStatusDropdown,
      this.editBatchStatusTrigger,
      this.editBatchStatusMenu,
      this.editBatchStatusDisplay,
      this.editBatchStatus
    );
    this.editBatchStudentSearch?.addEventListener('input', (e) => {
      this.editBatchSearchQuery = e.target.value.trim().toLowerCase();
      this.renderEditBatchStudentList();
    });
    this.editBatchStudentList?.addEventListener('change', (e) => {
      const checkbox = e.target.closest('.batch-edit-student-checkbox');
      if (!checkbox) return;
      if (checkbox.checked) this.editingBatchStudentIds.add(checkbox.dataset.studentId);
      else this.editingBatchStudentIds.delete(checkbox.dataset.studentId);
      this.renderEditBatchStudentList();
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
    if (this.durationUnitDropdown) {
      this.durationUnitDropdown.classList.add('has-value');
    }
    if (this.durationUnitTrigger) {
      this.durationUnitTrigger.classList.add('has-value');
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

    const headerConfig = {
      dashboard: {
        icon: '<i class="fa-solid fa-chart-pie"></i>',
        theme: 'theme-dashboard',
        title: 'Dashboard Overview',
        subtitle: 'Monitor key metrics, student enrollments, and recent activity'
      },
      students: {
        icon: '<i class="fa-solid fa-user-graduate"></i>',
        theme: 'theme-dashboard',
        title: 'Student Management',
        subtitle: 'Register, track progress, and manage enrolled learners'
      },
      courses: {
        icon: '<i class="fa-solid fa-desktop"></i>',
        theme: 'theme-dashboard',
        title: 'Course Management',
        subtitle: 'Curate academy courses, durations, and syllabus details'
      },
      batches: {
        icon: '<i class="fa-solid fa-layer-group"></i>',
        theme: 'theme-dashboard',
        title: 'Batch Management',
        subtitle: 'Organize students and process batch certificates'
      },
      inbox: {
        icon: '<svg viewBox="0 0 512 512" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M 237.5 43.0 L 238.0 42.5 L 273.0 42.5 L 274.0 43.5 L 283.0 43.5 L 284.0 44.5 L 290.0 44.5 L 291.0 45.5 L 295.0 45.5 L 296.0 46.5 L 300.0 46.5 L 301.0 47.5 L 305.0 47.5 L 306.0 48.5 L 309.0 48.5 L 310.0 49.5 L 312.0 49.5 L 313.0 50.5 L 316.0 50.5 L 317.0 51.5 L 319.0 51.5 L 320.0 52.5 L 322.0 52.5 L 323.0 53.5 L 325.0 53.5 L 326.0 54.5 L 331.0 55.5 L 334.0 57.5 L 336.0 57.5 L 341.0 60.5 L 343.0 60.5 L 359.0 68.5 L 361.0 70.5 L 366.0 72.5 L 368.0 74.5 L 369.0 74.5 L 371.0 76.5 L 372.0 76.5 L 374.0 78.5 L 378.0 80.5 L 381.0 83.5 L 385.0 85.5 L 396.0 95.5 L 397.0 95.5 L 415.5 114.0 L 415.5 115.0 L 421.5 121.0 L 421.5 122.0 L 430.5 133.0 L 430.5 134.0 L 438.5 145.0 L 440.5 150.0 L 442.5 152.0 L 450.5 168.0 L 450.5 170.0 L 453.5 175.0 L 453.5 177.0 L 455.5 180.0 L 455.5 182.0 L 456.5 183.0 L 456.5 185.0 L 457.5 186.0 L 457.5 188.0 L 458.5 189.0 L 458.5 191.0 L 460.5 195.0 L 460.5 198.0 L 462.5 202.0 L 462.5 206.0 L 463.5 207.0 L 463.5 210.0 L 464.5 211.0 L 465.5 220.0 L 466.5 221.0 L 466.5 228.0 L 467.5 229.0 L 467.5 237.0 L 468.5 238.0 L 468.5 273.0 L 467.5 274.0 L 467.5 282.0 L 466.5 283.0 L 466.5 290.0 L 465.5 291.0 L 464.5 300.0 L 463.5 301.0 L 463.5 304.0 L 462.5 305.0 L 462.5 309.0 L 460.5 313.0 L 460.5 316.0 L 459.5 317.0 L 459.5 319.0 L 458.5 320.0 L 458.5 322.0 L 457.5 323.0 L 457.5 325.0 L 456.5 326.0 L 455.5 331.0 L 450.5 341.0 L 450.5 343.0 L 442.5 359.0 L 440.5 361.0 L 436.5 369.0 L 434.5 371.0 L 434.5 372.0 L 432.5 374.0 L 430.5 378.0 L 427.5 381.0 L 427.5 382.0 L 424.5 385.0 L 424.5 386.0 L 421.5 389.0 L 421.5 390.0 L 415.5 396.0 L 415.5 397.0 L 397.0 415.5 L 396.0 415.5 L 390.0 421.5 L 389.0 421.5 L 378.0 430.5 L 377.0 430.5 L 369.0 436.5 L 366.0 437.5 L 364.0 439.5 L 361.0 440.5 L 359.0 442.5 L 343.0 450.5 L 341.0 450.5 L 336.0 453.5 L 334.0 453.5 L 331.0 455.5 L 329.0 455.5 L 328.0 456.5 L 326.0 456.5 L 325.0 457.5 L 323.0 457.5 L 322.0 458.5 L 320.0 458.5 L 316.0 460.5 L 313.0 460.5 L 309.0 462.5 L 306.0 462.5 L 305.0 463.5 L 301.0 463.5 L 300.0 464.5 L 296.0 464.5 L 295.0 465.5 L 291.0 465.5 L 290.0 466.5 L 284.0 466.5 L 283.0 467.5 L 274.0 467.5 L 273.0 468.5 L 75.0 468.5 L 74.0 467.5 L 69.0 466.5 L 65.0 463.5 L 64.0 463.5 L 61.0 460.5 L 60.0 460.5 L 54.5 454.0 L 51.5 448.0 L 51.5 446.0 L 50.5 445.0 L 50.5 440.0 L 49.5 439.0 L 49.5 434.0 L 50.5 433.0 L 50.5 429.0 L 51.5 428.0 L 51.5 426.0 L 53.5 423.0 L 53.5 421.0 L 60.5 408.0 L 60.5 406.0 L 67.5 393.0 L 67.5 391.0 L 73.5 379.0 L 73.5 368.0 L 72.5 367.0 L 72.5 365.0 L 70.5 361.0 L 68.5 359.0 L 60.5 343.0 L 60.5 341.0 L 57.5 336.0 L 57.5 334.0 L 55.5 331.0 L 55.5 329.0 L 54.5 328.0 L 54.5 326.0 L 53.5 325.0 L 53.5 323.0 L 52.5 322.0 L 52.5 320.0 L 50.5 316.0 L 50.5 313.0 L 49.5 312.0 L 49.5 310.0 L 48.5 309.0 L 48.5 306.0 L 47.5 305.0 L 47.5 301.0 L 46.5 300.0 L 45.5 291.0 L 44.5 290.0 L 44.5 284.0 L 43.5 283.0 L 43.5 275.0 L 42.5 274.0 L 42.5 238.0 L 43.5 237.0 L 43.5 228.0 L 44.5 227.0 L 44.5 221.0 L 45.5 220.0 L 45.5 216.0 L 46.5 215.0 L 47.5 206.0 L 48.5 205.0 L 48.5 202.0 L 50.5 198.0 L 50.5 195.0 L 51.5 194.0 L 51.5 192.0 L 52.5 191.0 L 52.5 189.0 L 53.5 188.0 L 53.5 186.0 L 54.5 185.0 L 55.5 180.0 L 57.5 177.0 L 57.5 175.0 L 60.5 170.0 L 60.5 168.0 L 68.5 152.0 L 70.5 150.0 L 72.5 145.0 L 74.5 143.0 L 74.5 142.0 L 76.5 140.0 L 76.5 139.0 L 78.5 137.0 L 80.5 133.0 L 83.5 130.0 L 85.5 126.0 L 95.5 115.0 L 95.5 114.0 L 114.0 95.5 L 115.0 95.5 L 121.0 89.5 L 122.0 89.5 L 133.0 80.5 L 134.0 80.5 L 145.0 72.5 L 150.0 70.5 L 152.0 68.5 L 168.0 60.5 L 170.0 60.5 L 180.0 55.5 L 182.0 55.5 L 183.0 54.5 L 185.0 54.5 L 186.0 53.5 L 188.0 53.5 L 189.0 52.5 L 191.0 52.5 L 195.0 50.5 L 198.0 50.5 L 202.0 48.5 L 206.0 48.5 L 207.0 47.5 L 210.0 47.5 L 211.0 46.5 L 215.0 46.5 L 216.0 45.5 L 220.0 45.5 L 221.0 44.5 L 228.0 44.5 L 229.0 43.5 L 237.0 43.5 L 237.5 43.0 Z M 191.5 192 h 43 a 20.5 20.5 0 0 1 20.5 20.5 a 20.5 20.5 0 0 1 -20.5 20.5 h -43 a 20.5 20.5 0 0 1 -20.5 -20.5 a 20.5 20.5 0 0 1 20.5 -20.5 Z M 191.5 278 h 128 a 20.5 20.5 0 0 1 20.5 20.5 a 20.5 20.5 0 0 1 -20.5 20.5 h -128 a 20.5 20.5 0 0 1 -20.5 -20.5 a 20.5 20.5 0 0 1 20.5 -20.5 Z"/></svg>',
        theme: 'theme-dashboard',
        title: 'Inbox',
        subtitle: 'Messages received from your public website'
      },
      personalisation: {
        icon: '<i class="fa-solid fa-sliders"></i>',
        theme: 'theme-dashboard',
        title: 'Personalisation',
        subtitle: 'Customize your public website branding and settings'
      }
    };

    const config = headerConfig[viewName] || headerConfig.dashboard;
    if (this.pageTitle) this.pageTitle.textContent = config.title;
    if (this.pageSubtitle) this.pageSubtitle.textContent = config.subtitle;
    if (this.pageTitleIcon) {
      this.pageTitleIcon.className = `page-title-icon ${config.theme}`;
      this.pageTitleIcon.innerHTML = config.icon;
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
    this.renderBatchesView();
    this.renderInboxView();
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
    const unreadMessages = store.getAllMessages().filter(message => !message.isRead).length;
    if (this.inboxUnreadBadge) {
      this.inboxUnreadBadge.textContent = unreadMessages;
      this.inboxUnreadBadge.style.display = unreadMessages > 0 ? '' : 'none';
    }

    // Dashboard Metric Cards (2 Cards)
    this.statTotalStudents.textContent = stats.totalStudents;
    this.statTotalCourses.textContent = stats.totalCourses;
  }

  // ==========================================================================
  // Render Dashboard
  // ==========================================================================
  renderDashboardView() {
    const messages = store.getAllMessages().slice(0, 3);
    if (this.dashboardInboxList) {
      this.dashboardInboxList.innerHTML = messages.length ? messages.map(item => `
        <button type="button" class="dashboard-inbox-item${item.isRead ? '' : ' unread'}" onclick="window.app.switchView('inbox')">
          <span class="inbox-sender-avatar">${getInboxIconSvg()}</span>
          <span class="dashboard-inbox-content">
            <strong>${escapeHtml(item.name || 'Website Visitor')}</strong>
            <span>${escapeHtml(item.message || '')}</span>
          </span>
          <span class="dashboard-inbox-meta">
            ${item.isRead ? '' : '<b>New</b>'}
            <time>${escapeHtml(formatMessageDate(item.createdAt))}</time>
          </span>
        </button>
      `).join('') : `
        <div class="dashboard-inbox-empty">
          <i class="fa-regular fa-envelope-open"></i>
          <span>No website messages yet.</span>
        </div>`;
    }

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
            <div class="student-meta-cell" title="Click to select student">
              <div class="student-name-box">
                <strong>${escapeHtml(student.name)}</strong>
              </div>
            </div>
          </td>
          <td>
            <span class="student-id-cell">${escapeHtml(student.id)}</span>
          </td>
          <td>${formatDate(student.joinDate)}</td>
          <td>
            <span class="badge ${getStatusBadgeClass(student.status)}">
              ${getStatusBadgeIcon(student.status)} ${escapeHtml(student.status)}
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
            <p class="course-desc" title="${escapeHtml(course.description || '')}">${escapeHtml(course.description || 'No description provided.')}</p>
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

  renderBatchesView() {
    const batches = store.getAllBatches();
    if (this.batchCountBadge) this.batchCountBadge.textContent = batches.length;
    if (!this.batchesGrid || !this.batchesEmptyState) return;

    let filteredBatches = batches;
    if (this.batchSearchQuery) {
      filteredBatches = batches.filter(batch => {
        const nameMatch = (batch.name || '').toLowerCase().includes(this.batchSearchQuery);
        const statusMatch = (batch.status || '').toLowerCase().includes(this.batchSearchQuery);
        const dateMatch = formatDate(batch.createdAt).toLowerCase().includes(this.batchSearchQuery);
        const studentMatch = (batch.studentIds || []).some(id => {
          const s = store.getStudentById(id);
          return s && (
            (s.name || '').toLowerCase().includes(this.batchSearchQuery) ||
            (s.regNo || '').toLowerCase().includes(this.batchSearchQuery)
          );
        });
        return nameMatch || statusMatch || dateMatch || studentMatch;
      });
    }

    if (filteredBatches.length === 0) {
      this.batchesGrid.innerHTML = '';
      this.batchesEmptyState.style.display = 'flex';
      if (this.batchesEmptyTitle && this.batchesEmptyDesc) {
        if (this.batchSearchQuery) {
          this.batchesEmptyTitle.textContent = 'No Batches Found';
          this.batchesEmptyDesc.textContent = 'No batches match your search keywords.';
          if (this.btnResetBatchFilters) this.btnResetBatchFilters.style.display = 'inline-flex';
          if (this.btnEmptyCreateBatch) this.btnEmptyCreateBatch.style.display = 'none';
        } else {
          this.batchesEmptyTitle.textContent = 'No Batches Yet';
          this.batchesEmptyDesc.textContent = 'Create your first batch to organize students and issue certificates.';
          if (this.btnResetBatchFilters) this.btnResetBatchFilters.style.display = 'none';
          if (this.btnEmptyCreateBatch) this.btnEmptyCreateBatch.style.display = 'inline-flex';
        }
      }
      return;
    }

    this.batchesEmptyState.style.display = 'none';
    this.batchesGrid.innerHTML = filteredBatches.map(batch => {
      const members = (batch.studentIds || []).map(id => store.getStudentById(id)).filter(Boolean);
      const isCompleted = batch.status === 'Completed';
      return `<article class="batch-card">
        <div class="batch-card-header">
          <div class="batch-card-title-group">
            <h3 title="${escapeHtml(batch.name)}">${escapeHtml(batch.name)}</h3>
            <div class="batch-card-submeta">
              <span class="batch-created-date">Created on ${formatDate(batch.createdAt)}</span>
            </div>
          </div>
          <div class="batch-card-header-actions">
            <button class="btn btn-secondary btn-sm batch-edit-icon-button" data-batch-action="edit" data-batch-id="${escapeHtml(batch.id)}" title="Edit batch" aria-label="Edit batch"><i class="fa-regular fa-pen-to-square"></i></button>
          </div>
        </div>
        <div class="batch-card-body">
          <div class="batch-stat-center">
            <div class="batch-stat-number">${members.length}</div>
            <div class="batch-stat-label">Student${members.length === 1 ? '' : 's'}</div>
            <span class="badge ${getStatusBadgeClass(isCompleted ? 'Completed' : 'Active')} batch-stat-badge">${getStatusBadgeIcon(isCompleted ? 'Completed' : 'Active')} ${isCompleted ? 'Completed' : 'Active'}</span>
          </div>
        </div>
        <div class="batch-card-footer">
          ${isCompleted ? `
            <button type="button" class="btn btn-secondary btn-sm batch-download-btn" data-batch-action="download-certs" data-batch-id="${escapeHtml(batch.id)}" ${!members.length ? 'disabled title="No students in this batch"' : 'title="Download all certificates in ZIP format"'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><line x1="12" y1="3" x2="12" y2="15"></line><polyline points="6 10 12 16 18 10"></polyline><line x1="4" y1="21" x2="20" y2="21"></line></svg> Download All Certificates
            </button>
          ` : `
            <button class="btn btn-success btn-sm batch-complete-btn" data-batch-action="complete" data-batch-id="${escapeHtml(batch.id)}" ${!members.length ? 'disabled title="No students in this batch"' : 'title="Mark batch as completed"'}>
              <i class="fa-solid fa-certificate"></i> Mark as Completed
            </button>
          `}
        </div>
      </article>`;
    }).join('');
  }

  openEditBatchModal(batchId) {
    const batch = store.getAllBatches().find(item => item.id === batchId);
    if (!batch) return;
    this.editingBatchId = batch.id;
    this.editingBatchStudentIds = new Set((batch.studentIds || []).filter(id => store.getStudentById(id)));
    this.editingBatchMemberIds = new Set(this.editingBatchStudentIds);
    this.editBatchSearchQuery = '';
    this.editBatchStudentSearch.value = '';
    this.editBatchName.textContent = batch.name;
    this.setAdminDropdownValue(
      this.editBatchStatusDropdown,
      this.editBatchStatusMenu,
      this.editBatchStatusDisplay,
      this.editBatchStatus,
      batch.status === 'Completed' ? 'Completed' : 'Active',
      'Active'
    );
    this.renderEditBatchStudentList();
    this.openModal(this.editBatchModal);
    window.setTimeout(() => this.editBatchStudentSearch.focus(), 100);
  }

  renderEditBatchStudentList() {
    const query = this.editBatchSearchQuery;
    const students = store.getAllStudents().filter(student => {
      if (!this.editingBatchMemberIds.has(student.id)) return false;
      if (!query) return true;
      return String(student.name || student.fullName || '').toLowerCase().includes(query)
        || String(student.id || '').toLowerCase().includes(query);
    });
    this.editBatchSelectionCount.textContent = `${this.editingBatchStudentIds.size} selected`;
    this.editBatchEmptyState.hidden = students.length > 0;
    this.editBatchStudentList.hidden = students.length === 0;
    this.editBatchStudentList.innerHTML = students.map(student => {
      const name = student.name || student.fullName || 'Unnamed Student';
      return `<label class="batch-edit-student-option">
        <input type="checkbox" class="custom-table-checkbox batch-edit-student-checkbox" data-student-id="${escapeHtml(student.id)}" ${this.editingBatchStudentIds.has(student.id) ? 'checked' : ''}>
        <span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(student.id)}</small></span>
      </label>`;
    }).join('');
  }

  async handleEditBatchSubmit(e) {
    e.preventDefault();
    const batch = store.getAllBatches().find(item => item.id === this.editingBatchId);
    if (!batch) return this.closeModal(this.editBatchModal);
    const studentIds = Array.from(this.editingBatchStudentIds);
    if (!studentIds.length) {
      this.showToast('Students Required', 'Keep at least one student in the batch.', 'error');
      return;
    }
    try {
      const shouldComplete = this.editBatchStatus.value === 'Completed' && batch.status !== 'Completed';
      await store.saveBatch({ ...batch, studentIds, status: shouldComplete ? 'Active' : this.editBatchStatus.value });
      this.closeModal(this.editBatchModal);
      this.editingBatchId = null;
      this.editingBatchStudentIds.clear();
      this.editingBatchMemberIds.clear();
      if (shouldComplete) {
        this.handleBulkMarkCompleted(batch.id, studentIds);
        return;
      }
      this.renderBatchesView();
      this.showToast('Batch Updated', `${batch.name} now has ${studentIds.length} student${studentIds.length === 1 ? '' : 's'}.`, 'success');
    } catch (error) {
      this.showToast('Batch Not Updated', error.message, 'error');
    }
  }

  openCreateBatchModal(initialStudentIds = []) {
    this.batchModalMode = 'create';
    this.batchForm.reset();
    this.batchModalTitle.textContent = 'Create New Batch';
    this.batchNameGroup.hidden = false;
    this.existingBatchGroup.hidden = true;
    if (this.batchStudentSelectionGroup) this.batchStudentSelectionGroup.hidden = false;
    this.batchNameInput.required = true;
    this.saveBatchLabel.textContent = 'Create Batch';

    const preselected = Array.isArray(initialStudentIds) && initialStudentIds.length
      ? initialStudentIds
      : Array.from(this.selectedStudentIds || []);
    this.createBatchSelectedStudentIds = new Set(preselected);
    this.createBatchSearchQuery = '';
    if (this.createBatchStudentSearch) this.createBatchStudentSearch.value = '';
    this.renderCreateBatchStudentList();

    this.openModal(this.batchModal);
    setTimeout(() => this.batchNameInput.focus(), 100);
  }

  renderCreateBatchStudentList() {
    if (!this.createBatchStudentList) return;
    const query = this.createBatchSearchQuery;
    const students = store.getAllStudents().filter(student => {
      if (!query) return true;
      const name = String(student.name || student.fullName || '').toLowerCase();
      const id = String(student.id || student.regNo || '').toLowerCase();
      const course = String(student.course || student.courseName || '').toLowerCase();
      return name.includes(query) || id.includes(query) || course.includes(query);
    });

    if (this.createBatchSelectionCount) {
      this.createBatchSelectionCount.textContent = `${this.createBatchSelectedStudentIds.size} selected`;
    }

    if (this.createBatchEmptyState) {
      this.createBatchEmptyState.hidden = students.length > 0;
    }
    this.createBatchStudentList.hidden = students.length === 0;

    this.createBatchStudentList.innerHTML = students.map(student => {
      const name = student.name || student.fullName || 'Unnamed Student';
      const reg = student.regNo || student.id || '';
      const course = student.course || '';
      const isChecked = this.createBatchSelectedStudentIds.has(student.id);
      return `<label class="batch-edit-student-option">
        <input type="checkbox" class="custom-table-checkbox create-batch-student-checkbox" data-student-id="${escapeHtml(student.id)}" ${isChecked ? 'checked' : ''}>
        <span>
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(reg)}${course ? ` • ${escapeHtml(course)}` : ''}</small>
        </span>
      </label>`;
    }).join('');
  }

  handleCreateNewBatch() {
    this.openCreateBatchModal(Array.from(this.selectedStudentIds));
  }

  handleAddToExistingBatch() {
    const studentIds = Array.from(this.selectedStudentIds);
    const batches = store.getAllBatches().filter(batch => String(batch.status || 'Active').toLowerCase() !== 'completed');
    if (!studentIds.length) return this.showToast('Select Students', 'Select one or more students to add.', 'error');
    if (!batches.length) return this.showToast('No Active Batch', 'Create a new batch first.', 'error');
    this.batchModalMode = 'existing';
    this.batchForm.reset();
    this.batchModalTitle.textContent = 'Add to Existing Batch';
    this.batchNameGroup.hidden = true;
    this.existingBatchGroup.hidden = false;
    if (this.batchStudentSelectionGroup) this.batchStudentSelectionGroup.hidden = true;
    this.batchNameInput.required = false;
    this.existingBatchMenu.innerHTML = batches.map(batch => `<li class="custom-select-option" data-value="${escapeHtml(batch.id)}" role="option">${escapeHtml(batch.name)} (${(batch.studentIds || []).length} students)</li>`).join('');
    this.setAdminDropdownValue(this.existingBatchDropdown, this.existingBatchMenu, this.existingBatchDisplay, this.existingBatchSelect, '', 'Choose an active batch');
    this.existingBatchTrigger.classList.remove('input-error');
    this.saveBatchLabel.textContent = 'Add Students';
    this.openModal(this.batchModal);
    setTimeout(() => this.existingBatchTrigger.focus(), 100);
  }

  async handleBatchFormSubmit(e) {
    e.preventDefault();
    const existing = this.batchModalMode === 'existing';
    if (existing) {
      const studentIds = Array.from(this.selectedStudentIds);
      if (!studentIds.length) return this.closeModal(this.batchModal);
      const batch = store.getAllBatches().find(item => item.id === this.existingBatchSelect.value);
      if (!batch) {
        this.existingBatchTrigger.classList.add('input-error');
        this.existingBatchTrigger.focus();
        return;
      }
      try {
        const saved = await store.saveBatch({
          ...batch,
          studentIds: [...new Set([...(batch.studentIds || []), ...studentIds])]
        });
        this.closeModal(this.batchModal);
        this.selectedStudentIds.clear();
        this.render();
        this.switchView('batches');
        this.showToast('Students Added', `Students were added to ${saved.name}.`, 'success');
      } catch (error) {
        this.showToast('Students Not Added', error.message, 'error');
      }
    } else {
      const name = this.batchNameInput.value.trim();
      if (!name) return this.batchForm.reportValidity();
      const studentIds = Array.from(this.createBatchSelectedStudentIds);
      try {
        const saved = await store.saveBatch({ name, studentIds, status: 'Active' });
        this.closeModal(this.batchModal);
        this.selectedStudentIds.clear();
        this.createBatchSelectedStudentIds.clear();
        this.render();
        this.switchView('batches');
        this.showToast('Batch Created', `${saved.name} was created successfully.`, 'success');
      } catch (error) {
        this.showToast('Batch Not Created', error.message, 'error');
      }
    }
  }

  renderInboxView() {
    if (!this.inboxList || !this.inboxEmptyState) return;
    const messages = store.getAllMessages();
    this.inboxEmptyState.style.display = messages.length === 0 ? 'block' : 'none';
    this.inboxList.style.display = messages.length === 0 ? 'none' : 'grid';
    this.inboxList.innerHTML = messages.map(item => `
      <article class="inbox-message-card${item.isRead ? '' : ' unread'}">
        <div class="inbox-message-header">
          <div class="inbox-sender">
            <span class="inbox-sender-avatar">${getInboxIconSvg()}</span>
            <div>
              <h3>${escapeHtml(item.name || 'Website Visitor')}</h3>
              <a href="tel:${escapeHtml(item.phone || '')}"><i class="fa-solid fa-phone"></i> ${escapeHtml(item.phone || '')}</a>
            </div>
          </div>
          <div class="inbox-message-meta">
            ${item.isRead ? '<span class="inbox-read-status">Read</span>' : '<span class="inbox-unread-status">New</span>'}
            <time>${escapeHtml(formatMessageDate(item.createdAt))}</time>
          </div>
        </div>
        ${item.course ? `<div class="inbox-course"><i class="fa-solid fa-book-open"></i> Interested in: ${escapeHtml(item.course)}</div>` : ''}
        <p class="inbox-message-text">${escapeHtml(item.message || '')}</p>
        <div class="inbox-message-actions">
          ${item.isRead ? '' : `<button type="button" class="btn btn-outline btn-sm" onclick="window.app.markInboxMessageRead('${escapeHtml(item.id)}')"><i class="fa-regular fa-envelope-open"></i> Mark as Read</button>`}
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.app.confirmDeleteInboxMessage('${escapeHtml(item.id)}')"><i class="fa-regular fa-trash-can"></i> Delete</button>
        </div>
      </article>
    `).join('');
  }

  markInboxMessageRead(messageId) {
    store.markMessageRead(messageId);
    this.render();
  }

  confirmDeleteInboxMessage(messageId) {
    this.promptConfirmation({
      title: 'Delete Message?',
      message: 'This message will be permanently removed from the inbox.',
      action: () => {
        store.deleteMessage(messageId);
        this.render();
        this.showToast('Message Deleted', 'The inbox message was removed.', 'info');
      }
    });
  }

  // ==========================================================================
  // Custom Dropdown Helpers for Admin Student Form
  // ==========================================================================
  setupAdminDropdown(container, trigger, menu, display, hiddenInput, onChangeCallback) {
    if (!container || !trigger || !menu || !hiddenInput) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = container.classList.contains('open');

      if (wasOpen) {
        this.closeAllAdminDropdowns();
        return;
      }

      this.closeAllAdminDropdowns();

      const isStudentModal = Boolean(container.closest('#studentModal'));
      const isTableDropdown = Boolean(container.closest('.table-responsive') || container.closest('.data-table') || container.classList.contains('th-minimal-dropdown'));

      if (isStudentModal || isTableDropdown) {
        // Open below the trigger and portal to body to avoid clipping by modal bodies, table scrollbars, or empty states
        const triggerRect = trigger.getBoundingClientRect();
        this.portaledMenu = menu;
        this.portaledOriginalParent = container;
        this.portaledNextSibling = menu.nextSibling;

        const maxAvailableBelow = window.innerHeight - triggerRect.bottom - 12;

        menu.classList.add('portal-select-menu');
        menu.style.top = `${triggerRect.bottom + 4}px`;

        if (container.classList.contains('th-minimal-dropdown')) {
          menu.style.minWidth = '145px';
          menu.style.width = 'max-content';
          const menuWidth = 155;
          if (triggerRect.left + menuWidth > window.innerWidth - 16) {
            menu.style.left = `${Math.max(8, triggerRect.right - menuWidth)}px`;
          } else {
            menu.style.left = `${triggerRect.left}px`;
          }
        } else {
          menu.style.left = `${triggerRect.left}px`;
          menu.style.width = `${triggerRect.width}px`;
          menu.style.minWidth = '';
        }

        menu.style.maxHeight = `${Math.max(140, Math.min(240, maxAvailableBelow))}px`;
        document.body.appendChild(menu);

        container.classList.remove('drop-up');
        container.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        // Measure trigger position and scroll parent boundaries to decide drop-down vs drop-up
        const triggerRect = trigger.getBoundingClientRect();
        const scrollParent = container.closest('.modal-body') || document.body;
        const parentRect = scrollParent.getBoundingClientRect();

        const spaceBelow = parentRect.bottom - triggerRect.bottom;
        const spaceAbove = triggerRect.top - parentRect.top;
        const viewportBelow = window.innerHeight - triggerRect.bottom;
        const viewportAbove = triggerRect.top;

        // Open upwards if space below is tight (< 230px) and there is more room above
        const shouldDropUp = (spaceBelow < 230 || viewportBelow < 230) && (spaceAbove > spaceBelow || viewportAbove > viewportBelow);

        container.classList.toggle('drop-up', shouldDropUp);
        container.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
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

      container.classList.remove('open', 'drop-up');
      trigger.setAttribute('aria-expanded', 'false');
      this.closeAllAdminDropdowns();

      if (typeof onChangeCallback === 'function') {
        onChangeCallback(value);
      }
    });
  }

  closeAllAdminDropdowns(except = null) {
    if (this.portaledMenu && this.portaledOriginalParent && this.portaledOriginalParent !== except) {
      if (this.portaledMenu.parentElement === document.body) {
        this.portaledOriginalParent.insertBefore(this.portaledMenu, this.portaledNextSibling || null);
      }
      this.portaledMenu.classList.remove('portal-select-menu');
      this.portaledMenu.style.top = '';
      this.portaledMenu.style.left = '';
      this.portaledMenu.style.width = '';
      this.portaledMenu.style.minWidth = '';
      this.portaledMenu.style.maxHeight = '';
      this.portaledMenu = null;
      this.portaledOriginalParent = null;
      this.portaledNextSibling = null;
    }

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
      this.adminStudentStatusFilterDropdown,
      this.completionStartMonthDropdown,
      this.completionStartYearDropdown,
      this.completionEndMonthDropdown,
      this.completionEndYearDropdown,
      this.existingBatchDropdown,
      this.editBatchStatusDropdown,
      this.batchActionMenu
    ];
    all.forEach(dropdown => {
      if (dropdown && dropdown !== except) {
        dropdown.classList.remove('open', 'drop-up');
        const trigger = dropdown.querySelector('.custom-select-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (dropdown === this.batchActionMenu) this.btnCreateBatch?.setAttribute('aria-expanded', 'false');
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
      if (this.btnDeleteStudentModal) this.btnDeleteStudentModal.style.display = 'inline-flex';
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
      if (this.btnDeleteStudentModal) this.btnDeleteStudentModal.style.display = 'none';
    }

    this.openModal(this.studentModal);
  }

  async handleStudentFormSubmit(e) {
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
      try {
        const newStudent = await store.addStudent(payload);
        this.showToast('Student Added', `${newStudent.name} (ID: ${newStudent.id}) registered successfully.`, 'success');
      } catch (error) {
        this.showToast('Registration Error', error.message || 'The student could not be added.', 'error');
        return;
      }
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
        <div class="profile-avatar-large${student.photoUrl ? ' has-photo' : ''}" style="background: ${gradient}">
          ${student.photoUrl ? `<img src="${escapeHtml(student.photoUrl)}" alt="Passport photo of ${escapeHtml(student.name)}" onerror="this.hidden=true; this.nextElementSibling.hidden=false; this.parentElement.classList.remove('has-photo')">` : ''}
          <span${student.photoUrl ? ' hidden' : ''}>${initials}</span>
        </div>
        <div class="profile-info">
          <h3>${escapeHtml(student.name)}</h3>
          <p>Student Identifier: <strong>${escapeHtml(student.id)}</strong></p>
          <span class="badge ${getStatusBadgeClass(student.status)}">
            ${getStatusBadgeIcon(student.status)} ${escapeHtml(student.status)}
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
          <span class="value">${escapeHtml(formatAadhar(student.aadhar))}</span>
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
        this.selectedStudentIds.delete(studentId);
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
    this.closeAllAdminDropdowns();
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
        this.bulkMarkCompletedLabel.textContent = 'Mark as Completed';
      }
    }

    if (this.studentSelectionCount) {
      const selectedCount = this.selectedStudentIds.size;
      this.studentSelectionCount.textContent = selectedCount;
      this.studentSelectionCount.hidden = selectedCount === 0;
    }

    if (this.btnCreateBatch) {
      const hasSelectedStudents = this.selectedStudentIds.size > 0;
      this.btnCreateBatch.disabled = !hasSelectedStudents;
      if (!hasSelectedStudents) {
        this.batchActionMenu?.classList.remove('open');
        this.btnCreateBatch.setAttribute('aria-expanded', 'false');
      }
    }
  }

  handleBulkMarkCompleted(batchId = null, studentIds = null) {
    this.completionStudentIds = new Set(studentIds || this.selectedStudentIds);
    const selectedCount = this.completionStudentIds.size;
    if (selectedCount === 0) return;

    this.completingBatchId = batchId;
    this.completionForm.reset();
    [
      [this.completionStartMonthDropdown, this.completionStartMonthMenu, this.completionStartMonthDisplay, this.completionStartMonth, 'Month', this.completionStartMonthTrigger],
      [this.completionStartYearDropdown, this.completionStartYearMenu, this.completionStartYearDisplay, this.completionStartYear, 'Year', this.completionStartYearTrigger],
      [this.completionEndMonthDropdown, this.completionEndMonthMenu, this.completionEndMonthDisplay, this.completionEndMonth, 'Month', this.completionEndMonthTrigger],
      [this.completionEndYearDropdown, this.completionEndYearMenu, this.completionEndYearDisplay, this.completionEndYear, 'Year', this.completionEndYearTrigger]
    ].forEach(([container, menu, display, input, label, trigger]) => {
      this.setAdminDropdownValue(container, menu, display, input, '', label);
      trigger.classList.remove('input-error');
    });
    this.completionModalTitle.textContent = selectedCount === 1 ? 'Complete Student Course' : 'Complete Student Courses';
    this.completionStudentCount.textContent = selectedCount === 1
      ? 'Enter the certificate details for the selected student.'
      : `These certificate details will be applied to all ${selectedCount} selected students.`;
    this.openModal(this.completionModal);
    window.setTimeout(() => this.completionStartMonthTrigger.focus(), 100);
  }

  async handleCompletionSubmit(e) {
    e.preventDefault();
    const studentIds = Array.from(this.completionStudentIds);
    if (studentIds.length === 0) {
      this.closeModal(this.completionModal);
      return;
    }

    const startMonth = this.getCompletionPeriodValue(this.completionStartMonth, this.completionStartYear);
    const endMonth = this.getCompletionPeriodValue(this.completionEndMonth, this.completionEndYear);
    const issueDate = this.completionIssueDate.value;
    const grade = this.completionGrade.value.trim();
    if (!startMonth || !endMonth) {
      const missingSelectors = [
        [this.completionStartMonth, this.completionStartMonthTrigger],
        [this.completionStartYear, this.completionStartYearTrigger],
        [this.completionEndMonth, this.completionEndMonthTrigger],
        [this.completionEndYear, this.completionEndYearTrigger]
      ].filter(([input]) => !input.value);
      missingSelectors.forEach(([, trigger]) => trigger.classList.add('input-error'));
      missingSelectors[0]?.[1].focus();
      return;
    }
    if (!issueDate || !grade) {
      this.completionForm.reportValidity();
      return;
    }
    if (endMonth < startMonth) {
      this.showToast('Invalid Course Duration', 'The ending month must be the same as or later than the starting month.', 'error');
      this.completionEndMonthTrigger.focus();
      return;
    }

    store.bulkUpdateStudents(studentIds, {
      status: 'Completed',
      certificateCourseStartDate: `${startMonth}-01`,
      certificateCourseEndDate: `${endMonth}-01`,
      certificateIssueDate: issueDate,
      completionDate: `${endMonth}-01`,
      grade
    });
    const completedFromBatch = Boolean(this.completingBatchId);
    if (completedFromBatch) {
      const batch = store.getAllBatches().find(item => item.id === this.completingBatchId);
      if (batch) await store.saveBatch({ ...batch, status: 'Completed', completedAt: new Date().toISOString(), certificateIssueDate: issueDate, grade });
    }
    this.completingBatchId = null;
    this.completionStudentIds.clear();
    this.closeModal(this.completionModal);
    this.showToast('Course Completed', `Successfully marked ${studentIds.length} student(s) as Completed. Certificates are now available.`, 'success');
    if (!completedFromBatch) this.selectedStudentIds.clear();
    this.render();
  }

  async generateStudentCertificatePng(student, course, batch, templateImg) {
    const canvas = document.createElement('canvas');
    canvas.width = 3722;
    canvas.height = 2480;
    const ctx = canvas.getContext('2d');

    // Draw base certificate background
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

    // Set scaling transform from 1920x1280 design space to 3722x2480 output
    ctx.setTransform(canvas.width / 1920, 0, 0, canvas.height / 1280, 0, 0);

    const PHOTO_BOX = { x: 1525, y: 649, width: 227, height: 268 };
    const QR_BOX = { x: 390, y: 1058, size: 124 };

    // Serial & Issue Date
    const serial = student.certificateSerial || student.id || '';
    drawCertField(ctx, serial, 284, 533, 481, 34, 'left', 400);

    const issueDateStr = student.certificateIssueDate || batch.certificateIssueDate || new Date().toISOString().slice(0, 10);
    drawCertField(ctx, formatDate(issueDateStr), 1640, 533, 200, 34, 'left', 400);

    // Student Name & Father's Name
    const studentName = student.name || student.fullName || '';
    drawCertField(ctx, studentName, 860, 642, 605);
    drawCertField(ctx, student.fatherName || '', 442, 704, 514);

    // Course Title & Duration
    const courseTitle = course?.title || student.courseName || '';
    const courseDuration = course?.duration || student.courseDuration || '';
    drawCertField(ctx, courseTitle, 355, 765, 1055);
    drawCertField(ctx, courseDuration, 583, 901, 326);

    // Course Period
    const startDate = student.certificateCourseStartDate || student.startDate;
    const endDate = student.certificateCourseEndDate || student.endDate || student.completionDate;
    const period = [formatMonthYear(startDate), formatMonthYear(endDate)].filter(Boolean).join(' - ');
    drawCertField(ctx, period, 1007, 901, 437, 33);

    // Grade
    const grade = student.grade || batch.grade || 'A';
    drawCertField(ctx, grade, 706, 962, 252);

    // Student Photo (with border)
    if (student.photoUrl) {
      try {
        const photo = await loadCertificateImage(student.photoUrl);
        const scale = Math.max(PHOTO_BOX.width / photo.width, PHOTO_BOX.height / photo.height);
        const sw = PHOTO_BOX.width / scale;
        const sh = PHOTO_BOX.height / scale;
        ctx.drawImage(
          photo,
          (photo.width - sw) / 2,
          Math.max(0, (photo.height - sh) * 0.3),
          sw,
          sh,
          PHOTO_BOX.x,
          PHOTO_BOX.y,
          PHOTO_BOX.width,
          PHOTO_BOX.height
        );
        ctx.save();
        ctx.strokeStyle = '#168bbb';
        ctx.lineWidth = 3;
        ctx.strokeRect(
          PHOTO_BOX.x + 1.5,
          PHOTO_BOX.y + 1.5,
          PHOTO_BOX.width - 3,
          PHOTO_BOX.height - 3
        );
        ctx.restore();
      } catch (err) {
        console.warn('Could not load student photo for certificate:', err);
      }
    }

    // Verification QR Code
    if (window.QRious && student.id) {
      try {
        const qrCanvas = document.createElement('canvas');
        const verificationUrl = new URL(window.location.origin);
        verificationUrl.searchParams.set('certificate', student.id);
        verificationUrl.searchParams.set('academy', student.academySlug || window.ADMIN_CONFIG?.academySlug || 'prantik');
        verificationUrl.hash = 'certificate';
        new window.QRious({
          element: qrCanvas,
          value: verificationUrl.href,
          size: 512,
          level: 'H',
          foreground: '#111111',
          background: '#ffffff'
        });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(QR_BOX.x - 5, QR_BOX.y - 5, QR_BOX.size + 10, QR_BOX.size + 10);
        ctx.drawImage(qrCanvas, QR_BOX.x, QR_BOX.y, QR_BOX.size, QR_BOX.size);
      } catch (err) {
        console.warn('Could not render QR code on certificate:', err);
      }
    }

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }

  async downloadBatchCertificatesZip(batchId) {
    const batch = store.getAllBatches().find(b => b.id === batchId);
    if (!batch) return;
    if (batch.status !== 'Completed') {
      this.showToast('Batch Not Completed', 'Please mark this batch as completed before downloading certificates.', 'warning');
      return;
    }
    const members = (batch.studentIds || []).map(id => store.getStudentById(id)).filter(Boolean);
    if (!members.length) {
      this.showToast('No Students', 'This batch does not have any students to generate certificates for.', 'warning');
      return;
    }

    if (typeof window.JSZip === 'undefined') {
      this.showToast('ZIP Library Loading', 'Compression library is loading. Please try again in a few seconds.', 'info');
      return;
    }

    const btn = document.querySelector(`[data-batch-action="download-certs"][data-batch-id="${CSS.escape(batchId)}"]`);
    const originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i>`;
    }

    try {
      let templateImg;
      try {
        templateImg = await loadCertificateImage('assets/diganta-certificate-template.jpg');
      } catch (e) {
        templateImg = await loadCertificateImage('https://ik.imagekit.io/d3ycnoiwd/academy/student-certificate/diganta-certificate-template.jpg');
      }

      const zip = new window.JSZip();
      let completedCount = 0;

      for (const student of members) {
        completedCount++;
        const course = store.getCourseById(student.courseId);
        const pngBlob = await this.generateStudentCertificatePng(student, course, batch, templateImg);
        if (pngBlob) {
          const safeName = (student.name || student.fullName || 'student').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
          const safeId = String(student.id || '').replace(/[^a-zA-Z0-9_-]/g, '-');
          zip.file(`Certificate-${safeId}-${safeName}.png`, pngBlob);
        }
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const safeBatchName = (batch.name || 'batch').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
      const filename = `${safeBatchName}-Certificates.zip`;

      const downloadUrl = URL.createObjectURL(zipBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

      this.showToast('Download Complete', `Successfully downloaded ${completedCount} certificate(s) in ZIP format.`, 'success');
    } catch (error) {
      console.error('[Download Batch Certificates Error]:', error);
      this.showToast('Download Error', 'Failed to generate certificates ZIP. Check browser console.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    }
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
      const remainingPercent = Math.max(0, Math.min(100, percent));
      this.authProgressFill.style.width = `${remainingPercent}%`;
      this.authProgressFill.parentElement?.setAttribute('aria-valuenow', String(Math.round(remainingPercent)));
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

function getStatusBadgeIcon(status) {
  return status === 'Completed'
    ? '<i class="fa-solid fa-check" style="font-size: 10px;"></i>'
    : '<i class="fa-solid fa-circle" style="font-size: 6px;"></i>';
}

const DISPLAY_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function formatDate(dateString) {
  if (!dateString) return '—';
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString) ? `${dateString}T00:00:00` : dateString;
  const date = new Date(normalizedDate);
  if (Number.isNaN(date.getTime())) return '—';
  return `${date.getDate()} ${DISPLAY_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

function formatMonthYear(dateString) {
  if (!dateString) return '';
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString) ? `${dateString}T00:00:00` : dateString;
  const date = new Date(normalizedDate);
  if (Number.isNaN(date.getTime())) return '';
  return `${DISPLAY_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function loadCertificateImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image: ' + url));
    img.src = url;
  });
}

function drawCertField(ctx, value, x, y, width, size = 37, align = 'center', weight = 500) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return;
  ctx.save();
  ctx.fillStyle = '#111111';
  let currentSize = size;
  do {
    ctx.font = `${weight} ${currentSize--}px "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
  } while (ctx.measureText(text).width > width - 12 && currentSize > 15);
  ctx.textAlign = align;
  const textX = align === 'left' ? x : x + width / 2;
  ctx.fillText(text, textX, y, width - 12);
  ctx.restore();
}

function formatMessageDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return `${date.getDate()} ${DISPLAY_MONTHS[date.getMonth()]}, ${date.getFullYear()}, ${time}`;
}

function formatAadhar(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 12);
  if (!digits) return '—';
  return (digits.match(/.{1,4}/g) || []).join('-');
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
  if (['students', 'courses', 'batches', 'inbox'].includes(initialHash)) {
    app.switchView(initialHash, false);
  }
});
