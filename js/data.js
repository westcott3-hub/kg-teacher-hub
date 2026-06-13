
// ── FIREBASE ──────────────────────────────────────────────────────────────────
const firebaseConfig={
  apiKey:"AIzaSyCgG5KCnG38X242n0xqL1pMR_OsE8yqL0Q",
  authDomain:"kg1-teacher-hub.firebaseapp.com",
  projectId:"kg1-teacher-hub",
  storageBucket:"kg1-teacher-hub.firebasestorage.app",
  messagingSenderId:"607498007531",
  appId:"1:607498007531:web:ebd783b3d7169225b05fae"
};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth();
const db=firebase.firestore();

// ── SCHOOL LOGO ───────────────────────────────────────────────────────────────
const SCHOOL_LOGO="/logo.png";

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];

// Thai lucky colours by day
const THAI_DAY_COLORS={
  Monday:   {bg:"#fde047",text:"#713f12",light:"#fef9c3",border:"#eab308"},
  Tuesday:  {bg:"#f9a8d4",text:"#831843",light:"#fdf2f8",border:"#ec4899"},
  Wednesday:{bg:"#86efac",text:"#14532d",light:"#f0fdf4",border:"#22c55e"},
  Thursday: {bg:"#fdba74",text:"#7c2d12",light:"#fff7ed",border:"#f97316"},
  Friday:   {bg:"#93c5fd",text:"#1e3a8a",light:"#eff6ff",border:"#3b82f6"},
  Saturday: {bg:"#c4b5fd",text:"#3b0764",light:"#f5f3ff",border:"#8b5cf6"},
  Sunday:   {bg:"#fca5a5",text:"#7f1d1d",light:"#fef2f2",border:"#ef4444"}
};
function todayDayColors(){
  const day=todayDayName();
  return THAI_DAY_COLORS[day]||{bg:"#e2e8f0",text:"#1e3a5f",light:"#f8fafc",border:"#94a3b8"};
}

// Semester 1 / 2026 timetable — sourced from ตารางสอน.xlsx (Sheet: ตารางสอน)
// K1A = อ.1A (Gary), K1B = อ.1B (Yulia)
// K2A = อ.2A, K2B = อ.2B
// K3A = อ.3A, K3B = อ.3B (อนุบาล 3 MLP — 7 periods per day)
// Periods for อนุบาล 1: P1 08:30-09:10, P2 09:10-09:50, P3 10:10-10:50,
//   break 09:50-10:10, P4 13:10-13:50, P5 14:00-14:40, P6 14:40-15:20
const TIMETABLE={
  // ── KG1 MLP ───────────────────────────────────────────────────────────────
  K1A:{
    Monday:[
      null,
      {sub:"Integration",   teacher:"T. Gary"},
      {sub:"English",       teacher:"T. Gary"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Math",          teacher:"T. Gary"}
    ],
    Tuesday:[
      null,
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"T. Gary"},
      {sub:"STREAMSS",      teacher:"T. Gary"},
      {sub:"English",       teacher:"T. Gary"},
      {sub:"Math",          teacher:"T. Gary"}
    ],
    Wednesday:[
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      {sub:"Integration",   teacher:"T. Gary"},
      {sub:"Play & Learn",  teacher:"T. Gary"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Phonics",       teacher:"T. Gary"}
    ],
    Thursday:[
      {sub:"Play & Learn",  teacher:"T. Gary"},
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"STREAMSS",      teacher:"T. Gary"},
      {sub:"Science",       teacher:"T. Gary"},
      {sub:"Integration",   teacher:"T. Gary"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"T. Gary"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Science",       teacher:"T. Gary"},
      {sub:"Phonics",       teacher:"T. Gary"},
      {sub:"STREAMSS",      teacher:"T. Gary"}
    ]
  },
  K1B:{
    Monday:[
      null,
      {sub:"Integration",   teacher:"T. Yulia"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"English",       teacher:"T. Yulia"},
      {sub:"Math",          teacher:"T. Yulia"}
    ],
    Tuesday:[
      null,
      {sub:"Integration",   teacher:"T. Yulia"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"STREAMSS",      teacher:"T. Yulia"},
      {sub:"English",       teacher:"T. Yulia"},
      {sub:"Math",          teacher:"T. Yulia"}
    ],
    Wednesday:[
      null,
      {sub:"Integration",   teacher:"T. Yulia"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"STREAMSS",      teacher:"T. Yulia"},
      {sub:"Phonics",       teacher:"T. Yulia"},
      {sub:"Science",       teacher:"T. Yulia"}
    ],
    Thursday:[
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Play & Learn",  teacher:"T. Yulia"},
      null,
      {sub:"Phonics",       teacher:"T. Yulia"},
      {sub:"Science",       teacher:"T. Yulia"},
      {sub:"Integration",   teacher:"T. Yulia"}
    ],
    Friday:[
      {sub:"STREAMSS",      teacher:"T. Yulia"},
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Play & Learn",  teacher:"T. Yulia"},
      {sub:"Integration",   teacher:"T. Yulia"}
    ]
  },
    // ── KG1 IEP ───────────────────────────────────────────────────────────────
  "K1/1":{
    Monday:[
      {sub:"English",       teacher:"T. Inessa"},
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      null,
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Math",          teacher:"T. Jussill"}
    ],
    Tuesday:[
      {sub:"English",       teacher:"T. Inessa"},
      {sub:"Science",       teacher:"T. Daisy"},
      null,
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      {sub:"Movement",      teacher:"มิสกาญธิรา"}
    ],
    Wednesday:[
      null,
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      null,
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null
    ],
    Thursday:[
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      null,
      {sub:"Play & Learn",  teacher:"T. Shirley"}
    ],
    Friday:[
      null,
      null,
      null,
      null,
      null,
      null
    ]
  },
  "K1/2":{
    Monday:[
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"English",       teacher:"T. Inessa"},
      null,
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      {sub:"Chinese",       teacher:"Li Yan"}
    ],
    Tuesday:[
      null,
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      null,
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Math",          teacher:"T. Jussill"}
    ],
    Wednesday:[
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"English",       teacher:"T. Inessa"},
      null,
      null,
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"}
    ],
    Thursday:[
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      null,
      null,
      null,
      null
    ],
    Friday:[
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      null,
      null
    ]
  },
  "K1/3":{
    Monday:[
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"English",       teacher:"T. Inessa"},
      null,
      null,
      null
    ],
    Tuesday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      null,
      {sub:"Math",          teacher:"T. Jussill"},
      null,
      {sub:"English",       teacher:"T. Inessa"}
    ],
    Wednesday:[
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      null,
      null,
      {sub:"Play & Learn",  teacher:"T. Shirley"}
    ],
    Thursday:[
      {sub:"Math",          teacher:"T. Jussill"},
      null,
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      null,
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"}
    ],
    Friday:[
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      null
    ]
  },
    // ── KG2 MLP ───────────────────────────────────────────────────────────────
  K2A:{
    Monday:[
      {sub:"English",       teacher:"T. JC"},
      {sub:"Science",       teacher:"T. Iana"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      null,
      {sub:"Phonics",       teacher:"T. Inessa"},
      {sub:"Integration",   teacher:"T. Inessa"}
    ],
    Tuesday:[
      {sub:"English",       teacher:"T. JC"},
      {sub:"Phonics",       teacher:"T. Inessa"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      null,
      null,
      {sub:"STREAMSS",      teacher:"T. Svitlana"}
    ],
    Wednesday:[
      {sub:"Math",          teacher:"T. Iana"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      null,
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Integration",   teacher:"T. Inessa"}
    ],
    Thursday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"T. Inessa"},
      {sub:"Math",          teacher:"T. Iana"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null
    ],
    Friday:[
      {sub:"Integration",   teacher:"T. Inessa"},
      {sub:"Science",       teacher:"T. Iana"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"T. Inessa"}
    ]
  },
  K2B:{
    Monday:[
      {sub:"Science",       teacher:"T. Iana"},
      {sub:"English",       teacher:"T. JC"},
      null,
      {sub:"Phonics",       teacher:"T. Inessa"},
      {sub:"Integration",   teacher:"T. JC"},
      {sub:"Play & Learn",  teacher:"T. Jayne"}
    ],
    Tuesday:[
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"English",       teacher:"T. JC"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      null,
      {sub:"Phonics",       teacher:"T. Inessa"},
      {sub:"Integration",   teacher:"T. JC"}
    ],
    Wednesday:[
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Math",          teacher:"T. Iana"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      {sub:"Integration",   teacher:"T. JC"}
    ],
    Thursday:[
      {sub:"Math",          teacher:"T. Iana"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      null,
      {sub:"Integration",   teacher:"T. JC"},
      {sub:"Chinese",       teacher:"Li Yan"}
    ],
    Friday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Science",       teacher:"T. Iana"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Integration",   teacher:"T. JC"}
    ]
  },
    // ── KG2 IEP ───────────────────────────────────────────────────────────────
  "K2/1":{
    Monday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null
    ],
    Tuesday:[
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      null
    ],
    Wednesday:[
      {sub:"English",       teacher:"T. JC"},
      {sub:"Chinese",       teacher:"Li Yan"},
      null,
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null
    ],
    Thursday:[
      {sub:"English",       teacher:"T. JC"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      null,
      null,
      null,
      null
    ],
    Friday:[
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      null,
      null,
      null,
      null
    ]
  },
  "K2/2":{
    Monday:[
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      null,
      null,
      {sub:"Science",       teacher:"T. Daisy"}
    ],
    Tuesday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null
    ],
    Wednesday:[
      null,
      {sub:"English",       teacher:"T. JC"},
      {sub:"Chinese",       teacher:"Li Yan"},
      null,
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"}
    ],
    Thursday:[
      null,
      {sub:"English",       teacher:"T. JC"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      null
    ],
    Friday:[
      null,
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      null,
      null,
      null
    ]
  },
  "K2/3":{
    Monday:[
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      {sub:"Math",          teacher:"T. Jussill"},
      null,
      null,
      null,
      null
    ],
    Tuesday:[
      {sub:"Science",       teacher:"T. Daisy"},
      null,
      {sub:"Math",          teacher:"T. Jussill"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      null
    ],
    Wednesday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"English",       teacher:"T. JC"},
      {sub:"Science",       teacher:"T. Daisy"},
      null,
      null
    ],
    Thursday:[
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      null,
      {sub:"English",       teacher:"T. JC"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Chinese",       teacher:"Li Yan"},
      null
    ],
    Friday:[
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      null
    ]
  },
    // ── KG3 MLP ───────────────────────────────────────────────────────────────
  K3A:{
    Monday:[
      {sub:"Integration",   teacher:"T. Jayne"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"English",       teacher:"T. JC"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Science",       teacher:"T. Iana"},
      null
    ],
    Tuesday:[
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      null,
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"English",       teacher:"T. JC"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Integration",   teacher:"T. Jayne"}
    ],
    Wednesday:[
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Math",          teacher:"T. Iana"},
      {sub:"Phonics",       teacher:"T. Inessa"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      null
    ],
    Thursday:[
      null,
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"Math",          teacher:"T. Iana"},
      {sub:"Phonics",       teacher:"T. Inessa"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      {sub:"Integration",   teacher:"T. Jayne"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"T. Jayne"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"T. Jayne"},
      {sub:"Science",       teacher:"T. Iana"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      null
    ]
  },
  K3B:{
    Monday:[
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      {sub:"Science",       teacher:"T. Iana"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"T. Iana"},
      null,
      {sub:"English",       teacher:"T. JC"}
    ],
    Tuesday:[
      null,
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"English",       teacher:"T. JC"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Integration",   teacher:"T. Iana"},
      {sub:"Skill Building",teacher:"มิสมยุรา"}
    ],
    Wednesday:[
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Phonics",       teacher:"T. Inessa"},
      null,
      {sub:"Math",          teacher:"T. Iana"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"Integration",   teacher:"T. Iana"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"}
    ],
    Thursday:[
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"Math",          teacher:"T. Iana"},
      {sub:"Phonics",       teacher:"T. Inessa"},
      {sub:"Integration",   teacher:"T. Iana"}
    ],
    Friday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      {sub:"Science",       teacher:"T. Iana"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      {sub:"Integration",   teacher:"T. Iana"}
    ]
  },
    // ── KG3 IEP ───────────────────────────────────────────────────────────────
  "K3/1":{
    Monday:[
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      null,
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"English",       teacher:"T. Jayne"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      null
    ],
    Tuesday:[
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null
    ],
    Wednesday:[
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      {sub:"English",       teacher:"T. Jayne"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      null
    ],
    Thursday:[
      null,
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      null
    ],
    Friday:[
      null,
      null,
      null,
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      null,
      null
    ]
  },
  "K3/2":{
    Monday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      null,
      {sub:"English",       teacher:"T. Jayne"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      null,
      {sub:"Movement",      teacher:"มิสกาญธิรา"}
    ],
    Tuesday:[
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      null,
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Math",          teacher:"T. Jussill"},
      null,
      null
    ],
    Wednesday:[
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      {sub:"English",       teacher:"T. Jayne"},
      {sub:"Math",          teacher:"T. Jussill"}
    ],
    Thursday:[
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null
    ],
    Friday:[
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      null,
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      null,
      null,
      null
    ]
  },
  "K3/3":{
    Monday:[
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null
    ],
    Tuesday:[
      null,
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"English",       teacher:"T. Jayne"},
      {sub:"Chinese",       teacher:"Li Yan"},
      null
    ],
    Wednesday:[
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      null,
      {sub:"English",       teacher:"T. Jayne"}
    ],
    Thursday:[
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      null,
      null,
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Science",       teacher:"T. Daisy"}
    ],
    Friday:[
      {sub:"Math",          teacher:"T. Jussill"},
      null,
      null,
      null,
      null,
      null,
      null
    ]
  },
  "K3/4":{
    Monday:[
      null,
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null
    ],
    Tuesday:[
      null,
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      null,
      {sub:"English",       teacher:"T. Jayne"},
      {sub:"Play & Learn",  teacher:"T. Shirley"}
    ],
    Wednesday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Play & Learn",  teacher:"T. Shirley"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      null,
      null
    ],
    Thursday:[
      {sub:"English",       teacher:"T. Jayne"},
      null,
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      null,
      null
    ],
    Friday:[
      null,
      null,
      null,
      null,
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      null
    ]
  }
};;


// Period times for KG1 (อนุบาล 1 schedule)
// K1 (อนุบาล 1): long lunch+nap break 10:50–13:10, P4 starts 13:10
const PERIODS_K1=[
  {label:"P1",start:"08:30",end:"09:10"},
  {label:"P2",start:"09:10",end:"09:50"},
  {label:"P3",start:"10:10",end:"10:50"},
  {label:"P4",start:"13:10",end:"13:50"},
  {label:"P5",start:"14:00",end:"14:40"},
  {label:"P6",start:"14:40",end:"15:20"}
];
const BREAKS_K1=[
  {label:"🥛 Milk & Break",start:"09:50",end:"10:10"},
  {label:"🍱 Lunch & Rest",start:"10:50",end:"13:10"},
  {label:"🥛 Milk Break",  start:"13:50",end:"14:00"}
];

// K2 (อนุบาล 2): P4 immediately after P3, long break 11:30–14:00
const PERIODS_K2=[
  {label:"P1",start:"08:30",end:"09:10"},
  {label:"P2",start:"09:10",end:"09:50"},
  {label:"P3",start:"10:10",end:"10:50"},
  {label:"P4",start:"10:50",end:"11:30"},
  {label:"P5",start:"14:00",end:"14:40"},
  {label:"P6",start:"14:40",end:"15:20"}
];
const BREAKS_K2=[
  {label:"🥛 Milk & Break",  start:"09:50",end:"10:10"},
  {label:"🍱 Lunch & Rest",  start:"11:30",end:"14:00"},
  {label:"🥛 Milk Break",    start:"13:50",end:"14:00"}
];

// K3 (อนุบาล 3): 7 periods — P4 follows P3 immediately, P5 at 11:30, long break, P6+P7 afternoon
const PERIODS_K3=[
  {label:"P1",start:"08:30",end:"09:10"},
  {label:"P2",start:"09:10",end:"09:50"},
  {label:"P3",start:"10:10",end:"10:50"},
  {label:"P4",start:"10:50",end:"11:30"},
  {label:"P5",start:"11:30",end:"12:10"},
  {label:"P6",start:"14:00",end:"14:40"},
  {label:"P7",start:"14:40",end:"15:20"}
];
const BREAKS_K3=[
  {label:"🥛 Milk & Break",start:"09:50",end:"10:10"},
  {label:"🍱 Lunch & Rest",start:"12:10",end:"14:00"}
];

// Nursery (Pre School) periods — same times as K1
const PERIODS_NURSERY=[
  {label:"P1",start:"08:30",end:"09:10"},
  {label:"P2",start:"09:10",end:"09:50"},
  {label:"P3",start:"10:10",end:"10:50"},
  {label:"P4",start:"13:10",end:"13:50"},
  {label:"P5",start:"14:00",end:"14:40"},
  {label:"P6",start:"14:40",end:"15:20"}
];
const BREAKS_NURSERY=[
  {label:"🥛 Milk & Break",start:"09:50",end:"10:10"},
  {label:"🍱 Lunch & Rest",start:"10:50",end:"13:10"},
  {label:"🥛 Milk Break",  start:"13:50",end:"14:00"}
];
// Nursery timetable (Pre School 1=N1, Pre School 2=N2) — S1/2026
const TIMETABLE_NURSERY={
  "N1":{
    Monday:[
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ],
    Tuesday:[
      {sub:"English",       teacher:"T. Janet"},
      null,
      {sub:"English",       teacher:"T. Inessa"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ],
    Wednesday:[
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ],
    Thursday:[
      {sub:"English",       teacher:"T. Inessa"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ],
    Friday:[
      {sub:"English",       teacher:"T. JC"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ]
  },
  "N2":{
    Monday:[
      {sub:"English",       teacher:"T. Janet"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      null,
      null,
      {sub:"English",       teacher:"T. Janet"},
      null
    ],
    Tuesday:[
      {sub:"Integration",   teacher:"T. Iana"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      null,
      {sub:"English",       teacher:"T. Janet"},
      null
    ],
    Wednesday:[
      {sub:"English",       teacher:"T. Janet"},
      null,
      null,
      null,
      {sub:"English",       teacher:"T. JC"},
      null
    ],
    Thursday:[
      {sub:"English",       teacher:"T. Janet"},
      {sub:"STREAMSS",      teacher:"T. Svitlana"},
      null,
      null,
      {sub:"English",       teacher:"T. Janet"},
      null
    ],
    Friday:[
      {sub:"English",       teacher:"T. Janet"},
      {sub:"English",       teacher:"T. Inessa"},
      null,
      null,
      {sub:"English",       teacher:"T. Janet"},
      null
    ]
  }
};
// Help assignments — teacher supports another class for specific periods
// Source: รวม sheet S1/2026
const TIMETABLE_HELP={
  "Daisy":{
    Monday:[{period:"P5",cls:"K1/2",sub:"Integration"}],
    Tuesday:[{period:"P6",cls:"K1/2",sub:"Math"}],
    Wednesday:[{period:"P6",cls:"K1/2",sub:"Love Reading"}],
    Thursday:[],
    Friday:[{period:"P6",cls:"K1/2",sub:"STREAMSS"}]
  },
  "Jussill":{
    Monday:[],
    Tuesday:[],
    Wednesday:[{period:"P4",cls:"K2/2",sub:"Integration"}],
    Thursday:[{period:"P4",cls:"K2/2",sub:"Love Reading"}],
    Friday:[{period:"P5",cls:"K2/2",sub:"STREAMSS"},{period:"P6",cls:"K2/2",sub:"STREAMSS"}]
  },
  "Shirley":{
    Monday:[],
    Tuesday:[{period:"P1",cls:"K3/4",sub:"Integration"}],
    Wednesday:[],
    Thursday:[{period:"P1",cls:"K3/4",sub:"English"}],
    Friday:[{period:"P6",cls:"K3/4",sub:"Outdoor"},{period:"P7",cls:"K3/4",sub:"Skill Building"}]
  },
  "Inessa":{
    Monday:[{period:"P1",cls:"K3A",sub:"Integration"}],
    Tuesday:[],Wednesday:[],Thursday:[],Friday:[]
  }
};
// Helper — returns correct PERIODS/BREAKS for the selected class
// Handles MLP, IEP slash-format (K2/1, K3/1 etc), and Nursery (N1/N2)
function getPeriodsForCls(cls){
  if(cls==="N1"||cls==="N2")return PERIODS_NURSERY;
  if(cls==="K3A"||cls==="K3B"||cls.startsWith("K3/"))return PERIODS_K3;
  if(cls==="K2A"||cls==="K2B"||cls.startsWith("K2/"))return PERIODS_K2;
  return PERIODS_K1;
}
function getBreaksForCls(cls){
  if(cls==="N1"||cls==="N2")return BREAKS_NURSERY;
  if(cls==="K3A"||cls==="K3B"||cls.startsWith("K3/"))return BREAKS_K3;
  if(cls==="K2A"||cls==="K2B"||cls.startsWith("K2/"))return BREAKS_K2;
  return BREAKS_K1;
}
// All classes are in TIMETABLE except Nursery
function getTimetableForCls(cls){
  if(cls==="N1"||cls==="N2")return TIMETABLE_NURSERY;
  return TIMETABLE;
}

// Keep backward-compat aliases (used in non-timetable code)
const PERIODS=PERIODS_K1;
const BREAKS=BREAKS_K1;

// Semester 1 / 2026 school weeks
const SCHOOL_WEEKS=[
  {sem:"S1/2026",week:1, start:"2026-05-18",end:"2026-05-22",unit:"Myself"},
  {sem:"S1/2026",week:2, start:"2026-05-25",end:"2026-05-29",unit:"My Body"},
  {sem:"S1/2026",week:3, start:"2026-06-01",end:"2026-06-05",unit:"Good Hygiene"},
  {sem:"S1/2026",week:4, start:"2026-06-08",end:"2026-06-12",unit:"My Family"},
  {sem:"S1/2026",week:5, start:"2026-06-15",end:"2026-06-19",unit:"My Happy School"},
  {sem:"S1/2026",week:6, start:"2026-06-22",end:"2026-06-26",unit:"Playing"},
  {sem:"S1/2026",week:7, start:"2026-06-29",end:"2026-07-03",unit:"Good Kids"},
  {sem:"S1/2026",week:8, start:"2026-07-06",end:"2026-07-10",unit:"My Pride"},
  {sem:"S1/2026",week:9, start:"2026-07-13",end:"2026-07-17",unit:"Saint Louis Marie"},
  {sem:"S1/2026",week:10,start:"2026-07-20",end:"2026-07-24",unit:"God Alone"},
  {sem:"S1/2026",week:11,start:"2026-07-27",end:"2026-07-31",unit:"Emotions & Feelings"},
  {sem:"S1/2026",week:12,start:"2026-08-03",end:"2026-08-07",unit:"Senses"},
  {sem:"S1/2026",week:13,start:"2026-08-10",end:"2026-08-14",unit:"Safety First"},
  {sem:"S1/2026",week:14,start:"2026-08-17",end:"2026-08-21",unit:"Community"},
  {sem:"S1/2026",week:15,start:"2026-08-24",end:"2026-08-28",unit:"Community Helpers"},
  {sem:"S1/2026",week:16,start:"2026-08-31",end:"2026-09-04",unit:"Our Nation"},
  {sem:"S1/2026",week:17,start:"2026-09-07",end:"2026-09-11",unit:"STREAMSS"},
  {sem:"S1/2026",week:18,start:"2026-09-14",end:"2026-09-18",unit:"STREAMSS"},
  {sem:"S1/2026",week:19,start:"2026-09-21",end:"2026-09-25",unit:"Test"},
  {sem:"S1/2026",week:20,start:"2026-09-28",end:"2026-10-02",unit:"Test"}
];

// Morning Duty Rota — sourced from ตารางสอน.xlsx (Sheet: เวร)
// ตารางเวรประจำวัน 07:00–07:55 (4 rotating teams of 6 positions)
// ตารางเวรสาย 07:55–08:25 (at ประตูหน้าตึกยอห์น)

// Gary's duty weeks — Screening position, Rota 3 (weeks 3,7,11,15,19)
const GARY_DUTY_WEEKS=new Set([3,7,11,15,19]);

// Full duty rota — all positions for all 4 teams
const MORNING_DUTY_ROTA=[
  {
    rota:1,
    weeks:[1,5,9,13,17],
    positions:[
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Arparat**","Miss Niraporn","Miss Siriporn","T. Svitlana","T. Inessa"]},
      {pos:"บันได",staff:["Miss Soonan"]},
      {pos:"ใต้ต้นไทร",staff:["Miss Nopwan"]},
      {pos:"วอกเวย์",staff:["Mr. Natthapong"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Arpornphan**","T. Iana"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Sasinee","Miss Srassaya","Miss Phornthip"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["T. Shirley","Mr. Akkarin","T. Jussill"]}
  },
  {
    rota:2,
    weeks:[2,6,10,14,18],
    positions:[
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Wiphawadee**","Miss Sirikarn**","Miss Thipsudar","Miss Thanjira"]},
      {pos:"บันได",staff:["Miss Yuphin"]},
      {pos:"ใต้ต้นไทร",staff:["T. Shirley"]},
      {pos:"วอกเวย์",staff:["T. Jussill"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Rungtiva","T. Yulia"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Ariyaporn","Miss Srassaya (Joy)","Miss Paphawarin"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["Miss Mayura","Miss Nopwan"]}
  },
  {
    rota:3,
    weeks:[3,7,11,15,19],
    positions:[
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Saipratoom","Miss Thitichaya","Miss Sirinan","Mr. Chalermphon"]},
      {pos:"บันได",staff:["Ms. Li Yan"]},
      {pos:"ใต้ต้นไทร",staff:["Miss Mayura**"]},
      {pos:"วอกเวย์",staff:["T. Daisy"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Benjawan**","T. Gary"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Somsuarn","Miss Srassaya (Benz)"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["Mr. Natthapong","Miss Niraporn"]}
  },
  {
    rota:4,
    weeks:[4,8,12,16,20],
    positions:[
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Anchapha","Miss Sunisa**","Miss Phannasorn","T. Jayne"]},
      {pos:"บันได",staff:["Miss Kanthira"]},
      {pos:"ใต้ต้นไทร",staff:["Mr. Akkarin"]},
      {pos:"วอกเวย์",staff:["Miss Phanumas"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Aemwika**","T. JC"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Yada","Miss Ananya","Miss Thapanee"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["Mr. Natthapong","Miss Kanthira"]}
  }
];

// Late duty (07:55-08:25) per day of week
const LATE_DUTY_BY_DAY={
  Monday:   ["T. Shirley","Mr. Akkarin","T. Jussill"],
  Tuesday:  ["Miss Mayura","Miss Nopwan"],
  Wednesday:["Miss Kanthira","Ms. Li Yan"],
  Thursday: ["Mr. Natthapong","Miss Niraporn"],
  Friday:   ["T. Daisy","Mr. Chalermphon"]
};

// Helper — get current rota for a given week number
function getDutyRota(weekNum){
  if(!weekNum)return null;
  return MORNING_DUTY_ROTA.find(r=>r.weeks.includes(weekNum))||null;
}

// Helper — extract foreign (non-Thai) teachers on duty for a rota
// Foreign teachers are identified by Ms./Mr. prefix (not Miss/มิส/ม.)
function getForeignDutyTeachers(rota){
  if(!rota)return[];
  const foreign=new Set();
  rota.positions.forEach(p=>{
    p.staff.forEach(s=>{
      // Ms./Mr. prefix = foreign teacher; Miss = Thai teacher
      if(/^(Ms\.|Mr\.)/.test(s.trim())){
        foreign.add(s.replace(/\*+/g,'').trim());
      }
    });
  });
  // Also check lateduty
  rota.lateduty.staff.forEach(s=>{
    if(/^(Ms\.|Mr\.)/.test(s.trim())){
      foreign.add(s.replace(/\*+/g,'').trim());
    }
  });
  return[...foreign];
}

// ── SCHOOL CALENDAR ───────────────────────────────────────────────────────────
const SCHOOL_CALENDAR={
  "2026-06":{
    name:"June 2026",
    holidays:[
      {date:"2026-06-01",label:"Substitute Holiday – Visakha Bucha Day",type:"holiday"},
      {date:"2026-06-02",label:"Extra Holiday",type:"holiday"},
      {date:"2026-06-03",label:"Her Majesty the Queen's Birthday Holiday",type:"holiday"}
    ],
    events:[
      {date:"2026-06-11",label:"Teacher Appreciation Ceremony",type:"event"},
      {date:"2026-06-20",label:"Academic Excellence Awards Ceremony",type:"event"},
      {date:"2026-06-27",label:"Apple Teacher Seminar",type:"event"}
    ]
  },
  "2026-07":{
    name:"July 2026",
    holidays:[
      {date:"2026-07-28",label:"Holiday – His Majesty King Rama X's Birthday",type:"holiday"},
      {date:"2026-07-29",label:"Substitution Holiday – Asalha Bucha Day",type:"holiday"},
      {date:"2026-07-30",label:"Buddhist Lent Day Holiday",type:"holiday"}
    ],
    events:[]
  },
  "2026-08":{
    name:"August 2026",
    holidays:[
      {date:"2026-08-12",label:"Mother's Day Holiday",type:"holiday"}
    ],
    events:[
      {date:"2026-08-07",label:"ACS Open House 2026 – Kindergarten",type:"event"},
      {date:"2026-08-22",label:"KG Rally Family Tour 2026",type:"event"},
      {date:"2026-08-23",label:"KG Rally Family Tour 2026",type:"event"}
    ]
  },
  "2026-09":{
    name:"September 2026",
    holidays:[],
    events:[
      {date:"2026-09-03",label:"ACS Sport Days",type:"event"},
      {date:"2026-09-04",label:"ACS Sport Days",type:"event"},
      {date:"2026-09-11",label:"MLP English Talent Show",type:"event"},
      {date:"2026-09-30",label:"Annual Health Check Up",type:"event"}
    ]
  },
  "2026-10":{
    name:"October 2026",
    holidays:[
      {date:"2026-10-12",label:"Semester Break",type:"break"},
      {date:"2026-10-13",label:"Semester Break",type:"break"},
      {date:"2026-10-14",label:"Semester Break",type:"break"},
      {date:"2026-10-15",label:"Semester Break",type:"break"},
      {date:"2026-10-16",label:"Semester Break",type:"break"}
    ],
    events:[
      {date:"2026-10-01",label:"Final Examination",type:"exam"},
      {date:"2026-10-02",label:"Final Examination",type:"exam"},
      {date:"2026-10-05",label:"Grading Period – working day",type:"event"},
      {date:"2026-10-06",label:"Grading Period – working day",type:"event"},
      {date:"2026-10-07",label:"Grading Period – working day",type:"event"},
      {date:"2026-10-08",label:"Grading Period – working day",type:"event"},
      {date:"2026-10-18",label:"Grade Release – working day",type:"event"},
      {date:"2026-10-19",label:"Academic Year 2/2026 Opens",type:"event"}
    ]
  }
};

// Get all calendar entries for a date
function getCalendarDay(dateStr){
  const monthKey=dateStr.slice(0,7);
  const month=SCHOOL_CALENDAR[monthKey];
  if(!month)return[];
  return[...(month.holidays||[]),...(month.events||[])].filter(e=>e.date===dateStr);
}

// Check if a date is a holiday/break (no school)
function isSchoolHoliday(dateStr){
  return getCalendarDay(dateStr).some(e=>e.type==="holiday"||e.type==="break");
}

// Per-subject per-week topic mapping — sourced from S1/2026 Course Outlines spreadsheet


// Get topic for current week + subject
// Routes to K2/K3 prefixed keys for those classes, falls back to K1 keys
// K2 MLP Course Outline data — S1/2026
// Applies to K2A and K2B only
// Source: K2_Course_Outline.xlsx
const K2_TOPICS={
  "English":[
    {unit:1,topic:"Hello!",vocab:"Characters, clothes, colours, nature, objects, school, toys. Letter sounds: a, e, i, o, u.",structs:"I/m (Kim). I'm a (girl). I like books."},
    {unit:1,topic:"Hello!",vocab:"Black, grey, orange, purple, white.",structs:"Draw (a butterfly). Color/Paint (purple)."},
    {unit:1,topic:"Review: Hello!",vocab:"Characters, clothes, colours, nature, objects, school, toys. Letter sounds: a, e, i, o, u. Black, grey, orange, purple, white.",structs:"I/m (Kim). I'm a (girl). I like books. Draw (a butterfly). Color/Paint (purple)."},
    {unit:2,topic:"My family",vocab:"Aunt, uncle, cousin, grandma, grandpa. Letter sounds: d, m.",structs:"Who's that? He's my (grandpa). She's my (grandma)."},
    {unit:2,topic:"My family",vocab:"Funny, old, short, tall, young.",structs:"She's/He's/I'm (old). She isn't/He isn't/I'm not (young)."},
    {unit:2,topic:"Review: My family",vocab:"Aunt, uncle, cousin, grandma, grandpa. Letter sounds: d, m. Funny, old, short, tall, young.",structs:"Who's that? He's my (grandpa). She's my (grandma). She's/He's/I'm (old). She isn't/He isn't/I'm not (young)."},
    {unit:3,topic:"My home",vocab:"Bathroom, bedroom, dining room, kitchen, living room. Letter sound: b, k.",structs:"Where's (Kim/Dan/Dan's mummy? She's/He's in the (kitchen)."},
    {unit:3,topic:"My home",vocab:"Cooking, eating, playing, sleeping, washing.",structs:"What's she/he doing? She's/He's (sleeping)."},
    {unit:3,topic:"Review: My home",vocab:"Bathroom, bedroom, dining room, kitchen, living room. Letter sound: b, k.Cooking, eating, playing, sleeping, washing.",structs:"Where's (Kim/Dan/Dan's mummy? She's/He's in the (kitchen).What's she/he doing? She's/He's (sleeping)."},
    {unit:4,topic:"My body",vocab:"Fingers, head, neck, shoulders, toes. Letter sounds: t, n.",structs:"She's/He's/It's got (a neck)."},
    {unit:4,topic:"My body",vocab:"Blondy, curly, long, short, straight, (hair).",structs:"She's/He's/It's got (long) hair. She's/He's/It's got (short) hair."},
    {unit:4,topic:"Review: My body",vocab:"Fingers, head, neck, shoulders, toes. Letter sounds: t, n. Blondy, curly, long, short, straight, (hair).",structs:"She's/He's/It's got (a neck). She's/He's/It's got (long) hair. She's/He's/It's got (short) hair."},
    {unit:5,topic:"Outdoors",vocab:"Cold, hot, rainy, sunny, windy. Letter sound: s, h.",structs:"What's the weather like? It's (hot)."},
    {unit:5,topic:"Outdoors",vocab:"Boots, jumper, raincoat, sandals, sunglasses.",structs:"I'm wearing a (raincoat)."},
    {unit:5,topic:"Review: Outdoors",vocab:"Cold, hot, rainy, sunny, windy. Letter sound: s, h. Boots, jumper, raincoat, sandals, sunglasses.",structs:"What's the weather like? It's (hot). I'm wearing a (raincoat)."},
    {unit:1,topic:"Review: Hello!",vocab:"Characters, clothes, colours, nature, objects, school, toys. Letter sounds: a, e, i, o, u. Black, grey, orange, purple, white.",structs:"I/m (Kim). I'm a (girl). I like books. Draw (a butterfly). Color/Paint (purple)."},
    {unit:2,topic:"Review: My family.",vocab:"Aunt, uncle, cousin, grandma, grandpa. Letter sounds: d, m. Funny, old, short, tall, young.",structs:"Who's that? He's my (grandpa). She's my (grandma). She's/He's/I'm (old). She isn't/He isn't/I'm not (young)."},
    {unit:3,topic:"Review: My home.",vocab:"Bathroom, bedroom, dining room, kitchen, living room. Letter sound: b, k.Cooking, eating, playing, sleeping, washing.",structs:"Where's (Kim/Dan/Dan's mummy? She's/He's in the (kitchen).What's she/he doing? She's/He's (sleeping)."},
    {unit:4,topic:"Review: My body.",vocab:"Fingers, head, neck, shoulders, toes. Letter sounds: t, n. Blondy, curly, long, short, straight, (hair).",structs:"She's/He's/It's got (a neck). She's/He's/It's got (long) hair. She's/He's/It's got (short) hair."},
    {unit:5,topic:"Review: Outdoors.",vocab:"Cold, hot, rainy, sunny, windy. Letter sound: s, h.Boots, jumper, raincoat, sandals, sunglasses.",structs:"What's the weather like? It's (hot). I'm wearing a (raincoat)."},
  ],
  "Math":[
    {unit:1,topic:"Greetings & Classroom Rules",vocab:"Hello, Teacher, School, Bag, Book, Pencil, Sit down, Stand up",structs:"\"Hello, my name is...\" / \"This is my bag.\""},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  "Science":[
    {unit:1,topic:"Things to wear. Clothes",vocab:"Types of clothes and body parts",structs:"Clothes protect us from the sun/ the rain/ the cold."},
    {unit:1,topic:"What are clothes made of?",vocab:"cotton, wool, animal skin",structs:"What are clothes made of? Clothes are made of cotton/wool/animal skin"},
    {unit:1,topic:"Mirror",vocab:"mirror, image",structs:"We can see our image in the mirror.  How does it look like in the mirror?"},
    {unit:2,topic:"My birthday. Water",vocab:"shape, taste, colour, healthy",structs:"Water has no shape of its own. Water has no color or taste. Water helps to keep our body healthy."},
    {unit:2,topic:"Uses of water",vocab:"living things, cook, wash",structs:"Living things need water to live. We use water to cook. We use water to wash things."},
    {unit:2,topic:"Water, ice and steam",vocab:"turn into, become, cold, hot, steam",structs:"Water turns into ice when it becomes very cold. Ice turns into water when it is not cold enough. Water turns into steam when it becomes very hot."},
    {unit:2,topic:"Float and sink",vocab:"float, sink",structs:"Some things float on water. Some things sink in water."},
    {unit:3,topic:"On the farm. Farm animals",vocab:"hen, goose, duck, goat, sheep, turkey, cow, horse",structs:"Hen/ goose/ duck/ goat/ sheep/ turkey/ cow/ horse is a farm animal."},
    {unit:3,topic:"Farm animals and their young",vocab:"duckling, chick, foal, lamb, kid, calf",structs:"Duckling is a young of a duck. Chick is a young of a hen. Foal is a young of a horse. Lamb is a young of a sheep. Kid is a young of a goat. Calf is a young of a cow."},
    {unit:3,topic:"How do animals grow? Animals and their uses",vocab:"give, food, material",structs:"Cows give us milk. Hens give us eggs. Sheep give us wool."},
    {unit:4,topic:"To the beach. Air",vocab:"air, balloon, ball, rubber ring",structs:"Balloon/ ball/ rubber ring is filled with air."},
    {unit:4,topic:"Wind",vocab:"wind, move, strong",structs:"Wind is air that moves. Wind is moving the kite. Wind is strong."},
    {unit:4,topic:"Sea animals",vocab:"dolphin, shark, jellyfish, turtle, squid, starfish, sea horse",structs:"Dolphin/ shark/ jellyfish/ turtle/ squid/ starfish/ sea horse is a sea animal."},
    {unit:4,topic:"Parts of a fish",vocab:"eye, scales, tail, mouth, gill, fin",structs:"Fish has eyes/ scales/ a tail/ a mouth/ a gill/ a fin"},
    {unit:1,topic:"Review unit 1: Things to wear.",vocab:"cotton, wool, animal skin",structs:"Clothes are made of cotton/wool/animal skin."},
    {unit:2,topic:"Review unit 2: My birthday.",vocab:"float, sink",structs:"Some things float on water. Some things sink in water."},
    {unit:3,topic:"Review unit 3: On the farm. Farm animals",vocab:"hen, goose, duck, goat, sheep, turkey, cow, horse",structs:"Hen/ goose/ duck/ goat/ sheep/ turkey/ cow/ horse is a farm animal."},
    {unit:3,topic:"Review unit 3: Farm animals and their young",vocab:"duckling, chick, foal, lamb, kid, calf",structs:"Duckling is a young of a duck. Chick is a young of a hen. Foal is a young of a horse. Lamb is a young of a sheep. Kid is a young of a goat. Calf is a young of a cow."},
    {unit:4,topic:"Review unit 4: To the beach. Air. Wind",vocab:"air, balloon, ball, rubber ring;wind, move, strong",structs:"Balloon/ ball/ rubber ring is filled with air."},
    {unit:4,topic:"Review unit 4: To the beach. Sea animals",vocab:"dolphin, shark, jellyfish, turtle, squid, starfish, sea horse",structs:"Dolphin/ shark/ jellyfish/ turtle/ squid/ starfish/ sea horse is a sea animal."},
  ],
  "Play & Learn":[
    {unit:1,topic:"First Name",vocab:"First name, friend, teacher",structs:"What's your name? My name is ______. I am ______. Hello, I am ______."},
    {unit:2,topic:"My Body / Physical Appearance",vocab:"Eyes, nose, mouth, ears, hair, face",structs:"This is my nose. I have black hair."},
    {unit:3,topic:"Personal Hygiene / Healthy Habits",vocab:"Wash hands, brush teeth, take a bath, clean, healthy",structs:"I brush my teeth everyday. I wash my hands before eating. I am clean."},
    {unit:4,topic:"Family Background",vocab:"Family, mother, father, brother, sister",structs:"This is my mother. I have a brother."},
    {unit:5,topic:"My Happy School",vocab:"School, teacher, student, book, bag",structs:"I go to school. This is my teacher."},
    {unit:6,topic:"Playing",vocab:"Play, toy, ball, blocks, puzzle",structs:"I like to play. This is my toy."},
    {unit:7,topic:"Good Kids",vocab:"Kind, help, share, sorry",structs:"I am kind. I share."},
    {unit:8,topic:"My Pride",vocab:"Proud, brave, calm, strong",structs:"I can do it. I am proud."},
    {unit:9,topic:"Saint Louis Marie",vocab:"Saint, pray, love, help",structs:"He helps people. He prays."},
    {unit:10,topic:"God Alone",vocab:"God, love, pray, church",structs:"God loves me. I pray."},
    {unit:11,topic:"Emotions and Feelings",vocab:"Happy, sad, angry, scared",structs:"I am happy. I am sad."},
    {unit:12,topic:"Senses",vocab:"Red, blue, yellow, green",structs:"It is red. I see blue."},
    {unit:13,topic:"Safety First",vocab:"Safe, stop, careful, help",structs:"Stop. Be careful."},
    {unit:14,topic:"Community",vocab:"Market, hospital, temple, school",structs:"I go to the market. This is a hospital."},
    {unit:15,topic:"Community Helpers",vocab:"Doctor, nurse, teacher, police officer",structs:"She is a doctor. He is a teacher."},
    {unit:16,topic:"Our Nation",vocab:"Thailand, Thai flag, temple, king",structs:"I live in Thailand. This is the Thai flag."},
    null,
    null,
    null,
    null,
  ],
  "Phonics":[
    {unit:1,topic:"Greetings & Classroom Rules",vocab:"Hello, Teacher, School, Bag, Book, Pencil, Sit down, Stand up",structs:"\"Hello, my name is...\" / \"This is my bag.\""},
    {unit:1,topic:"Short \"a\" sound",vocab:"Cat;ant;ax;yak;jam;dam;ram",structs:"I see an ant and an ax."},
    {unit:1,topic:"Short \"a\" sound & story",vocab:"Fan, man, ant, pan, jam, van, dam",structs:"A man with a van is at the dam."},
    {unit:2,topic:"Short \"a\" sound(ad;ag;ap;at)",vocab:"Dad;pad;bag;rag;nap;tap;map;cap",structs:"Is that your cap on the map?"},
    {unit:2,topic:"Short \"a\" sound & story",vocab:"Mad;tag;lap;pat;dad;map;bag",structs:"This is my dad! He has a hat, a bad, and a map."},
    {unit:null,topic:"Short \"a\"(a;am;an;ad;ag;ap;at)",vocab:"Bag, yak, dam, can, cat, rat, map",structs:"A girl with a bag - a man with a map"},
    {unit:null,topic:"Short \"a\"(a;am;an;ad;ag;ap;at)",vocab:"Bag, yak, dam, can, cat, rat, map",structs:"CVC words game"},
    {unit:3,topic:"Short \"e\" sound",vocab:"Vet;web;egg;ten;jet;net;wet",structs:"The vet has ten big eggs"},
    {unit:3,topic:"Short e sound(e;et;en;ed)",vocab:"Hen;pen;red;bed",structs:"The red pen is on the bed"},
    {unit:null,topic:"Short e Story",vocab:"Hen;pen;red;bed",structs:"The red hen is wet"},
    {unit:4,topic:"Short i sound",vocab:"Sip;lip;zip;ink;lid",structs:"I like to sip with my lips"},
    {unit:4,topic:"Short i",vocab:"The kid can use ink",structs:""},
    {unit:null,topic:"Short e & short i sounds",vocab:"Egg;ink;bib;vet;lip;pen;ten",structs:""},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  "Integration":[
    {theme:"Myself",topics:["First name and Last name","Personal background","Human names"],vocab:"nickname (ชื่อเล่น), name (ชื่อจริง), surname (นามสกุล), teacher (คุณครู), friend (เพื่อน)"},
    {theme:"Mybody",topics:["Physical appearance","Human characteristics","Human changes and relationships","Body organs and their functions","Parts of the human body"],vocab:"short (เตี้ย), tall (สูง) thin (ผอม), fat (อ้วน), eye (ตา), nose (จมูก), ear (หู), hair (ผม), head (ศีรษะ), lip (ริมฝีปาก), teeth (ฟัน) neck (คอ), mouth (ปาก), face (ใบหน้า)"},
    {theme:"Good Hygiene",topics:["Personal hygiene","Good health and hygiene habits","Eating healthy and nutritious food","Rest and relaxation","Physical exercise"],vocab:"body (ร่างกาย), healthy (สุขภาพดี), wash hand (ล้างมือ), wash hair (สระ ผม) takes a baht (อาบน ้า), get dressed (แต่งตัว), food (อาหาร), fruit (ผลไม้), milk (นม), fish (ปลา), pork (เนื ้อหมู), beef (เนื ้อวัว), chicken (ไก่), egg (ไข่), bread (ขนมปัง), cake (ขนมเค้ก), bean (ถั ่ว), cherry (เชอร์รี่), apple (แอปเปิ ้ล), banana (กล้วย), grape (องุ ่น), lemon (มะนาว), orange (ส้ม), papaya (มะละกอ), p"},
    {theme:"My Family",topics:["Family background","Being a good member of the family","The child’s immediate family","Family members the child interacts with daily"],vocab:"family (ครอบครัว), father (พ่อ), mother (แม่), son (ลูกชาย), daughter (ลูก สาว), brother (พี่ชายน้องชาย), sister (พี่สาวน้องสาว), uncle (ลุง อา น้า(ช)), aunt (ป้ า น้า อา(ญ)), grandmother (ย่า ยาย), grandfather (ปู่ ตา) nice (หลานสาว), nephew (หลานชาย)"},
    {theme:"My Happy School",topics:["Being a good member of the school","People in school the child is close to","Places in school the child interacts with daily"],vocab:"school (โรงเรียน) teacher (ครู) student (นักเรียน)"},
    {theme:"Playing",topics:["Individual play and self-reliance activities","Cooperative play and working with others"],vocab:"Take care of yourself (ดูแลตัวเอง) play (การเล่น) toy (ของเล่น), together (ร่วมกัน)"},
    {theme:"Good Kids",topics:["Respecting one’s own rights","Respecting the rights of others","Expressing one’s own opinions","Listening to others' opinions"],vocab:""},
    {theme:"My Pride",topics:["Self-regulation","Self-awareness","Self-esteem"],vocab:""},
    {theme:"Saint Louis Marie",topics:["His Biography"],vocab:""},
    {theme:"God Alone",topics:["His Biography","Good manners","Morals"],vocab:""},
    {theme:"Emotions and Feelings",topics:["one’s own emotions and feelings","others’ emotions and feelings","Empathy","Reflecting others' feelings"],vocab:"happy (ดี ใจ) sad (เสียใจ) playful (สนุก) mood (อารมณ์) in love (รัก) angry (โกรธ) shy (อาย) bored (เบื่อ) feeling (ความรู ้สึก)"},
    {theme:"Senses",topics:["Colours of objects around us","Textures of objects around us","Patterns and relationships of objects"],vocab:"red (สีแดง), yellow (สีเหลือง), green (สีเขียว), blue (สีฟ้ า), black (สีด า), white (สี ขาว), orange (สีส้ม), violet (สีม่วง), pink (สีชมพู), brown (สีน ้าตาล), gray (สีเทา), rough (ขรุขระ), smooth (ผิวรื่น), hot (ร้อน), cool (เย็น)/"},
    {theme:"Safety firse",topics:["Protecting oneself from contagious diseases","Protecting oneself from emerging diseases","Personal safety and boundaries with others","Treating others safely and respectfully","Stranger danger Hidden hazards Accidents Disasters"],vocab:"Take care of yourself. (ดูแลตัวเอง), safety (ความปลอดภัย), cautious (ระมัดระวัง)"},
    {theme:"Community",topics:["The child’s immediate community","The community in the child’s daily life","Key places in the community","Community cultural centers"],vocab:"** hospital (โรงพยาบาล), temple (วัด), market (ตลาด), post office (ที่ท าการ ไปรษณีย์), supermarket (ซุปมาร์เก็ต), farm (ไร่นา), port (ท่าเรือ),  airport (สนามบิน)"},
    {theme:"Community Helpers",topics:["People in the child’s close circle","People the child interacts with daily","Community helpers","Personal needs, interests, and abilities"],vocab:"** farmer (ชาวนา), fisherman (ชาวประมง), gardener (คนสวน), carpenter (ช่าง ไม้), merchant (พ่อค้า), fruit seller (คนขายผลไม้), cook (พ่อครัว),  policeman (ต ารวจ), soldier (ทหาร), postman (บุรุษไปรษณีย์), lawyer  (ทนายความ), engineer (วิศวกร), doctor (หมอ), nurse (พยาบาล),  dentist (ทันตแพทย์), pilot (นักบิน), air-hostess (พนักงานต้อนรับ หญิง), guide (มัคคุเทศก์)"},
    {theme:"Our nation",topics:["Religion","Cultural diversity","National symbols of Thailand","Practicing local culture and Thai way of life","Learning resources from other local wisdoms"],vocab:""},
    null,
    null,
    null,
    null,
  ]
};

// K3 MLP Course Outline data — S1/2026
// Applies to K3A and K3B only (not IEP classes K3/1–K3/4)
// Source: K3_Course_Outline.xlsx
const K3_TOPICS={
  "English":[
    {unit:1,topic:"Me! Introdaction.",vocab:"Name, Numbers 1-20. Review letter sounds: b, m, t, g, p, d, k, n, s, h.",structs:"Hello! What's your name? I'm (Kim). How old are you? I'm (five). I like books. What's her/his name? She's (Kim). He's (Dan). How old is he/she? She's/He's (eight)."},
    {unit:1,topic:"Me!",vocab:"Angry, bored, excited, scared, sleepy, surprised.",structs:"He's/She's/I'm bored. He isn't/She isn't/ I'm not (bored)."},
    {unit:2,topic:"My day",vocab:"Brush my hair, brush my teeth, get dressed, have breakfast, wake up, wash my face",structs:"I (wake up) (in the morning/every day)."},
    {unit:2,topic:"My day.",vocab:"Go to bed, have a bath, have dinner, have a snack, listen to a story, play with friends.",structs:"They/We (play with friends) (after school/in the evening). We/They don't (have a bath)."},
    {unit:null,topic:"Review: Me. My Day.",vocab:"Brush my hair, brush my teeth, get dressed, have breakfast, wake up, wash my face.Go to bed, have a bath, have dinner, have a snack, listen to a story, play with friends. Name, Numbers 1-20. Review letter sounds: b, m, t, g, p, d, k, n, s, h. Angry, bored, excited, scared, sleepy, surprised.",structs:"Hello! What's your name? I'm (Kim). How old are you? I'm (five). I like books. What's her/his name? She's (Kim). He's (Dan). How old is he/she? She's/He's (eight). He's/She's/I'm bored. He isn't/She isn't/ I'm not (bored). I (wake up) (in the morning/every day). They/We (play with friends) (after sc"},
    {unit:3,topic:"My home.",vocab:"Make the bed, pick up the toys, set the table, sweep the floor, wash the clothes, wash the dishes.",structs:"He/She (washes the dishes). I (sweep the floor)."},
    {unit:3,topic:"My home.",vocab:"Bed, bookcase, cupboard, lamp, rug, toy box.",structs:"It's (under/in/on/next to) the (bed)."},
    {unit:4,topic:"My sports",vocab:"Badminton, baseball, basketball, football, hockey, tennis. Letter sound (ng).",structs:"They're/She's/He's playing football."},
    {unit:4,topic:"My sports",vocab:"Bouncing, catching, hitting, kicking, rolling, throwing.",structs:"She's/He's/I'm (throwing) a ball."},
    {unit:5,topic:"My free time",vocab:"Cooking dinner, drawing pictures, listening to music, playing video games, reading books, and watching TV. Tetter sound (short oo), (long oo).",structs:"I like (reading books)."},
    {unit:5,topic:"My free time",vocab:"Go roller skating, go swimming, play a board game, play with building blocks, play hide-and-seek, play outside.",structs:"Let's (go swimming)/play a board game/). Can I (come and play?)."},
    {unit:6,topic:"My food",vocab:"Cake, chocolate, crisps, grapes, pineapple, sweets. letter sound (ch).",structs:"Would you like some (chocolate)? Yes, please./No, thank you. I'd like some (sweets), please."},
    {unit:6,topic:"My food",vocab:"Beans, cereal, fruit, meat, rice, vegetable.",structs:"I/We have (meat and rice) for (breakfast/lunch/dinner)."},
    {unit:7,topic:"Animals",vocab:"Crocodile, elephant, hippo, monkey, snake, tiger.",structs:"There's (a monkey). There are (three monkeys). There are (lots of snakes)."},
    {unit:7,topic:"Animals",vocab:"Duck, giraffe, lizard, parrot, spider, zebra.",structs:"They are giraves. They have got long necks/long legs/stripes/ short legs/big feet/long tails/sharp teeth. They are fast."},
    {unit:8,topic:"Plants",vocab:"Garden, plants, rain, seeds, soil, sun, beautiful, clean, dirty, new, old, ugly.",structs:"What do plants need? Plants need (sun/rain/soil). What beautiful flowers. What a dirty nose."},
    {unit:9,topic:"My town",vocab:"Hospital, playground, restaurant, school, shop, supermarket.",structs:"Where are you/we going? I'm/We are going to the supermarket."},
    {unit:9,topic:"My town",vocab:"Doctor, farmer, nurse, shop, assistant, teacher, waiter.",structs:"A teacher works in a school. He/She works on the farm. Where does a teacher work? Does a nurse work in a hospital? Yes, he/she does. No, he/she doesn't."},
    {unit:null,topic:"Review: Topic 3,4,5,6.",vocab:"All the vocabulaty topics 3,4,5,6.",structs:"All the sentence structures topics 3,4,5,6."},
    {unit:null,topic:"Review: Topics 7,8,9.",vocab:"All the vocabulary topics 7.8.9.",structs:"All the sentence structures topics 7,8,9."},
  ],
  "Math":[
    {unit:1,topic:"Greetings & Classroom Rules",vocab:"Hello, Teacher, School, Bag, Book, Pencil, Sit down, Stand up",structs:"\"Hello, my name is...\" / \"This is my bag.\""},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  "Science":[
    {unit:1,topic:"Around town. Wheels.",vocab:"wheels, bike, car, train, truck, motorcycle, train, cart",structs:"Bike/ car/ train/ truck/ motorcycle/ train/ cart has 2/4/6/16 wheels."},
    {unit:1,topic:"Fuel",vocab:"petrol station, fuel, airplane, ship, motorcycle, car",structs:"Airplane/ ship/ motorcycle/ car needs fuel to move."},
    {unit:1,topic:"Light. Shadows.",vocab:"the sun, torch, lamp, candle",structs:"The sun, torch, lamp, candle gives us light."},
    {unit:1,topic:"Review unit 1: Around town.",vocab:"wheels, bike, car, train, truck, motorcycle, train, cart; petrol station, fuel, airplane, ship, motorcycle, car; The sun, torch, lamp, candle",structs:"Bike/ car/ train/ truck/ motorcycle/ train/ cart has 2/4/6/16 wheels. Airplane/ ship/ motorcycle/ car needs fuel to move. The sun, torch, lamp, candle gives us light."},
    {unit:2,topic:"Going shopping. Metal",vocab:"metal, pan, can, key",structs:"Pan/ can/ key is made of metal."},
    {unit:2,topic:"Wood and glass",vocab:"wood, glass, table chair, chopsticks, bottle, jug, bowl",structs:"Table/ chair/ chopsticks is/are made of wood. Bottle/ jug/ bowl is made of glass."},
    {unit:2,topic:"Plastic and rubber",vocab:"plastic, rubber, container, fork, spoon, plate, balloon, wheel, gloves, eraser",structs:"Container/ fork/ spoon/ plate is made of plastic. Balloon/ wheel/ gloves/ eraser is/are made of rubber."},
    {unit:2,topic:"Review unit 2: Going shopping.",vocab:"metal, pan, can, key; wood, glass, table chair, chopsticks, bottle, jug, bowl; plastic, rubber, container, fork, spoon, plate, balloon, wheel, gloves, eraser",structs:"Pan/ can/ key is made of metal. Table/ chair/ chopsticks is/are made of wood. Bottle/ jug/ bowl is made of glass. Container/ fork/ spoon/ plate is made of plastic. Balloon/ wheel/ gloves/ eraser is/are made of rubber."},
    {unit:3,topic:"To the Zoo. Where do animals live?",vocab:"ostrich, elephant, zebra, dolphin, shark, fish, frog, turtle, salamander",structs:"Ostrich/ elephant/ zebra lives on land. Dolphin/ shark/ fish lives in water. Frog/ turtle/ salamander lives on land and in water."},
    {unit:3,topic:"What do animals eat?",vocab:"deer, hippopotamus, giraffe, tiger, lion, crocodile, bear, racoon, chimpanzee",structs:"Deer/ hippopotamus/ giraffe eats plants. Tiger/ lion/ crocodile eats meat. Bear/ racoon/ chimpanzee eats plants and meat."},
    {unit:3,topic:"How do animals move?",vocab:"walk, crawl, hop, fly, swim, slither",structs:"Camels walk. Crabs crawl. Kangaroos hop. Birds fly. Dolphins swim. Snakes slither."},
    {unit:3,topic:"Review unit 3: To the Zoo.",vocab:"ostrich, elephant, zebra, dolphin, shark, fish, frog, turtle, salamander; deer, hippopotamus, giraffe, tiger, lion, crocodile, bear, racoon, chimpanzee; walk, crawl, hop, fly, swim, slither",structs:"Ostrich/ elephant/ zebra lives on land. Dolphin/ shark/ fish lives in water. Frog/ turtle/ salamander lives on land and in water. Deer/ hippopotamus/ giraffe eats plants. Tiger/ lion/ crocodile eats meat. Bear/ racoon/ chimpanzee eats plants and meat. Camels walk. Crabs crawl. Kangaroos hop. Birds f"},
    {unit:4,topic:"People at work. Does it absorb water?",vocab:"absorb, toilet paper, sponge, towel, raincoat, pan, gloves",structs:"Toilet paper/ sponge/ towel absorbs water. Raincoat/ pan/ gloves does not/ do not absorb water."},
    {unit:4,topic:"Does it dissolve in water?",vocab:"dissolve, salt, beans, rice, honey, sugar, flour",structs:"Salt/ honey/ sugar dissolves in water. Beans/ rice/ flour does not/ do not dissolve in water."},
    {unit:4,topic:"Uses of magnets",vocab:"magnet, pencil case,refrigerator, whiteboard",structs:"Magnets help to keep the pencil case shut/ keep the door of the refrigerator shut/ keep the paper on the whiteboard."},
    {unit:4,topic:"Review unit 4: People at work.",vocab:"absorb, toilet paper, sponge, towel, raincoat, pan, gloves; dissolve, salt, beans, rice, honey, sugar, flour; magnet, pencil case,refrigerator, whiteboard",structs:"Toilet paper/ sponge/ towel absorbs water. Raincoat/ pan/ gloves does not/ do not absorb water. Salt/ honey/ sugar dissolves in water. Beans/ rice/ flour does not/ do not dissolve in water. Magnets help to keep the pencil case shut/ keep the door of the refrigerator shut/ keep the paper on the white"},
    {unit:1,topic:"Review unit 1: Around town.",vocab:"wheels, bike, car, train, truck, motorcycle, train, cart; petrol station, fuel, airplane, ship, motorcycle, car; The sun, torch, lamp, candle",structs:"Bike/ car/ train/ truck/ motorcycle/ train/ cart has 2/4/6/16 wheels. Airplane/ ship/ motorcycle/ car needs fuel to move. The sun, torch, lamp, candle gives us light."},
    {unit:2,topic:"Review unit 2: Going shopping.",vocab:"metal, pan, can, key; wood, glass, table chair, chopsticks, bottle, jug, bowl; plastic, rubber, container, fork, spoon, plate, balloon, wheel, gloves, eraser",structs:"Pan/ can/ key is made of metal. Table/ chair/ chopsticks is/are made of wood. Bottle/ jug/ bowl is made of glass. Container/ fork/ spoon/ plate is made of plastic. Balloon/ wheel/ gloves/ eraser is/are made of rubber."},
    {unit:3,topic:"Review unit 3: To the Zoo.",vocab:"ostrich, elephant, zebra, dolphin, shark, fish, frog, turtle, salamander; deer, hippopotamus, giraffe, tiger, lion, crocodile, bear, racoon, chimpanzee; walk, crawl, hop, fly, swim, slither",structs:"Ostrich/ elephant/ zebra lives on land. Dolphin/ shark/ fish lives in water. Frog/ turtle/ salamander lives on land and in water. Deer/ hippopotamus/ giraffe eats plants. Tiger/ lion/ crocodile eats meat. Bear/ racoon/ chimpanzee eats plants and meat. Camels walk. Crabs crawl. Kangaroos hop. Birds f"},
    {unit:4,topic:"Review unit 4: People at work.",vocab:"absorb, toilet paper, sponge, towel, raincoat, pan, gloves; dissolve, salt, beans, rice, honey, sugar, flour; magnet, pencil case,refrigerator, whiteboard",structs:"Toilet paper/ sponge/ towel absorbs water. Raincoat/ pan/ gloves does not/ do not absorb water. Salt/ honey/ sugar dissolves in water. Beans/ rice/ flour does not/ do not dissolve in water. Magnets help to keep the pencil case shut/ keep the door of the refrigerator shut/ keep the paper on the white"},
  ],
  "Play & Learn":[
    {unit:1,topic:"First Name",vocab:"First name, nickname, friend, teacher",structs:"What's your name? My name is ______. I am ______. Hello, I am ______."},
    {unit:2,topic:"My Body / Physical Appearance",vocab:"Eyes, nose, mouth, ears, hair, face, tall, short",structs:"My hair is black. I am tall/short. She has long hair. We are different."},
    {unit:3,topic:"Personal Hygiene / Healthy Habits",vocab:"Wash hands, brush teeth, take a bath, toothbrush, clean, healthy",structs:"I wash my hands. I brush my teeth. I am clean."},
    {unit:4,topic:"Family Background",vocab:"Family, mother, father, brother, sister, grandmother, grandfather, baby, parents",structs:"This is my mother. I have a brother. There are four people in my family."},
    {unit:5,topic:"My Happy School",vocab:"School, classroom, teacher, student, desk, chair, book, bag, rules, library",structs:"I am a good student. I follow classroom rules."},
    {unit:6,topic:"Playing",vocab:"Play, toy, ball, blocks, puzzle, share, together, build",structs:"I like to play. I share my toys."},
    {unit:7,topic:"Good Kids",vocab:"Kind, gentle, help, share, wait, listen, respect, sorry, thank you",structs:"I wait for my turn. I respect my friends. I can say sorry/thank you."},
    {unit:8,topic:"My Pride",vocab:"Proud, brave, calm, careful, independent, confident, strong",structs:"I can do it by myself. I feel proud of myself."},
    {unit:9,topic:"Saint Louis Marie",vocab:"Saint, priest, church, prayer, faith, love, help, God",structs:"Saint Louis Marie loved God. He helped many people."},
    {unit:10,topic:"God Alone",vocab:"God, prayer, faith, love, heart, church, cross",structs:"God is always with me. I pray every day."},
    {unit:11,topic:"Emotions and Feelings",vocab:"Happy, sad, angry, scared, excited, shy, tired, bored, worried",structs:"How do you feel? I feel really happy today."},
    {unit:12,topic:"Senses",vocab:"Red, blue, yellow, green, orange, purple, pink, brown, black, white",structs:"The apple is red. I can see many colors."},
    {unit:13,topic:"Safety First",vocab:"Safe, careful, danger, stranger, hospital, doctor, emergency",structs:"I do not talk to strangers. I ask for help."},
    {unit:14,topic:"Community",vocab:"Market, hospital, temple, post office, supermarket, airport, farm",structs:"My community has many places. The doctor works at the hospital."},
    {unit:15,topic:"Community Helpers",vocab:"Doctor, nurse, teacher, police officer, dentist, farmer, cook, pilot",structs:"A doctor helps sick people. A teacher teaches students."},
    {unit:16,topic:"Our Nation",vocab:"Thailand, Thai flag, king, culture, religion, temple, Thai people",structs:"Thailand is my country. We respect Thai culture."},
    null,
    null,
    null,
    null,
  ],
  "Phonics":[
    {unit:1,topic:"Greetings & Classroom Rules",vocab:"Hello, Teacher, School, Bag, Book, Pencil, Sit down, Stand up",structs:"\"Hello, my name is...\" / \"This is my bag.\""},
    {unit:1,topic:"Magic \"e\" (Long \"a\" sound)",vocab:"Tape;cane;cape;mane",structs:"The man has tape and a cane"},
    {unit:1,topic:"Magic \"e\" (Long \"a\" sound)",vocab:"Gate;wave;skate;cave",structs:"My name is on the cake!"},
    {unit:2,topic:"Magic \"e\"(Long \"I\" sound)",vocab:"Kite;pine;ripe;fine",structs:"My kite is fine in the pine."},
    {unit:2,topic:"Magic \"e\"(Long \"I\" sound)",vocab:"Bike;hike;nine;line",structs:"My name is Mike I ride my bike at nine o clock"},
    {unit:null,topic:"Long a/long i sounds",vocab:"Lake;tape;fine;five;cake",structs:"Do you like your bike?"},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  "Integration":[
    {theme:"Myself",topics:["First name and Last name","Personal background","Human names"],vocab:"nickname (ชื่อเล่น), name (ชื่อจริง), surname (นามสกุล), teacher (คุณครู), friend (เพื่อน)"},
    {theme:"Mybody",topics:["Physical appearance","Human characteristics","Human changes and relationships","Body organs and their functions","Parts of the human body"],vocab:"short (เตี้ย), tall (สูง) thin (ผอม), fat (อ้วน), eye (ตา), nose (จมูก), ear (หู), hair (ผม), head (ศีรษะ), lip (ริมฝีปาก), teeth (ฟัน) neck (คอ), mouth (ปาก), face (ใบหน้า)"},
    {theme:"Good Hygiene",topics:["Personal hygiene","Good health and hygiene habits","Eating healthy and nutritious food","Rest and relaxation","Physical exercise"],vocab:"body (ร่างกาย), healthy (สุขภาพดี), wash hand (ล้างมือ), wash hair (สระ ผม) takes a baht (อาบน ้า), get dressed (แต่งตัว), food (อาหาร), fruit (ผลไม้), milk (นม), fish (ปลา), pork (เนื ้อหมู), beef (เนื ้อวัว), chicken (ไก่), egg (ไข่), bread (ขนมปัง), cake (ขนมเค้ก), bean (ถั ่ว), cherry (เชอร์รี่), apple (แอปเปิ ้ล), banana (กล้วย), grape (องุ ่น), lemon (มะนาว), orange (ส้ม), papaya (มะละกอ), p"},
    {theme:"My Family",topics:["Family background","Being a good member of the family","The child’s immediate family","Family members the child interacts with daily"],vocab:"family (ครอบครัว), father (พ่อ), mother (แม่), son (ลูกชาย), daughter (ลูก สาว), brother (พี่ชายน้องชาย), sister (พี่สาวน้องสาว), uncle (ลุง อา น้า(ช)), aunt (ป้ า น้า อา(ญ)), grandmother (ย่า ยาย), grandfather (ปู่ ตา) nice (หลานสาว), nephew (หลานชาย)"},
    {theme:"My Happy School",topics:["Being a good member of the school","People in school the child is close to","Places in school the child interacts with daily"],vocab:"school (โรงเรียน) teacher (ครู) student (นักเรียน)"},
    {theme:"Playing",topics:["Individual play and self-reliance activities","Cooperative play and working with others"],vocab:"Take care of yourself (ดูแลตัวเอง) play (การเล่น) toy (ของเล่น), together (ร่วมกัน)"},
    {theme:"Good Kids",topics:["Respecting one’s own rights","Respecting the rights of others","Expressing one’s own opinions","Listening to others' opinions"],vocab:""},
    {theme:"My Pride",topics:["Self-regulation","Self-awareness","Self-esteem"],vocab:""},
    {theme:"Saint Louis Marie",topics:["His Biography"],vocab:""},
    {theme:"God Alone",topics:["His Biography","Good manners","Morals"],vocab:""},
    {theme:"Emotions and Feelings",topics:["one’s own emotions and feelings","others’ emotions and feelings","Empathy","Reflecting others' feelings"],vocab:"happy (ดี ใจ) sad (เสียใจ) playful (สนุก) mood (อารมณ์) in love (รัก) angry (โกรธ) shy (อาย) bored (เบื่อ) feeling (ความรู ้สึก)"},
    {theme:"Senses",topics:["Colours of objects around us","Textures of objects around us","Patterns and relationships of objects"],vocab:"red (สีแดง), yellow (สีเหลือง), green (สีเขียว), blue (สีฟ้ า), black (สีด า), white (สี ขาว), orange (สีส้ม), violet (สีม่วง), pink (สีชมพู), brown (สีน ้าตาล), gray (สีเทา), rough (ขรุขระ), smooth (ผิวรื่น), hot (ร้อน), cool (เย็น)/"},
    {theme:"Safety firse",topics:["Protecting oneself from contagious diseases","Protecting oneself from emerging diseases","Personal safety and boundaries with others","Treating others safely and respectfully","Stranger danger Hidden hazards Accidents Disasters"],vocab:"Take care of yourself. (ดูแลตัวเอง), safety (ความปลอดภัย), cautious (ระมัดระวัง)"},
    {theme:"Community",topics:["The child’s immediate community","The community in the child’s daily life","Key places in the community","Community cultural centers"],vocab:"** hospital (โรงพยาบาล), temple (วัด), market (ตลาด), post office (ที่ท าการ ไปรษณีย์), supermarket (ซุปมาร์เก็ต), farm (ไร่นา), port (ท่าเรือ),  airport (สนามบิน)"},
    {theme:"Community Helpers",topics:["People in the child’s close circle","People the child interacts with daily","Community helpers","Personal needs, interests, and abilities"],vocab:"** farmer (ชาวนา), fisherman (ชาวประมง), gardener (คนสวน), carpenter (ช่าง ไม้), merchant (พ่อค้า), fruit seller (คนขายผลไม้), cook (พ่อครัว),  policeman (ต ารวจ), soldier (ทหาร), postman (บุรุษไปรษณีย์), lawyer  (ทนายความ), engineer (วิศวกร), doctor (หมอ), nurse (พยาบาล),  dentist (ทันตแพทย์), pilot (นักบิน), air-hostess (พนักงานต้อนรับ หญิง), guide (มัคคุเทศก์)"},
    {theme:"Our nation",topics:["Religion","Cultural diversity","National symbols of Thailand","Practicing local culture and Thai way of life","Learning resources from other local wisdoms"],vocab:""},
    null,
    null,
    null,
    null,
  ]
};

const WEEK_TOPICS={

  // ── K1 subjects (Phonics = dedicated A–L letter programme) ──────────────
  Phonics:{
    1:"Letter A — apple, ax, ant, alligator",
    2:"Letter B — bear, bird, bed, banana",
    3:"Letter C — cat, cup, car, computer",
    4:"ABC Story & Review — bird, car, apple",
    5:"Letter D — dog, desk, doll, duck",
    6:"Letter E — egg, elbow, envelope, elephant",
    7:"Letter F — fish, fan, farm, fork",
    8:"DEF Story & Review",
    9:"Review 1 — ABCDEF Song & Game",
    10:"Letter G — gorilla, goat, gift, girl",
    11:"Letter H — horse, hat, house, hot dog",
    12:"Letter I — insect, ink, igloo",
    13:"GHI Story & Review",
    14:"Letter J — jet, jam, juice, jacket",
    15:"Letter K — kangaroo, key, king, kite",
    16:"Letter L — lion, lamp, leaf, lemon",
    17:"JKL Story & Review",
    18:"Review 2 — GHIJKL Song & Game",
    19:"Revision & Phonics Activities",
    20:"Final Phonics Assessment"
  },
  Math:{
    1:"Number 1 — trace, color 1 ball",
    2:"Number 2 — boys & girls, count children",
    3:"Numbers 1–2 Activities — count & trace",
    4:"Numbers 1–2 Review",
    5:"Numbers 2–3 — bears, dolls, cars",
    6:"Number 3 — cars, buses, circle toys",
    7:"Numbers 2–3 Activities",
    8:"Numbers 2–3 Review",
    9:"Number 4 — family members, count books",
    10:"Number 4 — balloons, follow numbers",
    11:"Number 4 Activities",
    12:"Numbers 1–4 Review",
    13:"Number 5 — cats, count & color",
    14:"Numbers 1–5 Review — colors & body",
    15:"Number 6 — hop, run, clap, connect dots",
    16:"Numbers 1–6 Review — dog, cat, rabbit",
    17:"STREAMSS Activities",
    18:"STREAMSS Review",
    19:"Midterm Test",
    20:"Final Review & Test"
  },
  English:{
    1:"Unit 1 — Hello! Greetings: Hello, I'm ___",
    2:"Unit 1 — Classroom objects: book, crayon, pencil",
    3:"Unit 2 — Family: brother, sister, daddy, mummy",
    4:"Unit 2 — Family: boy, girl, man, woman",
    5:"Unit 3 — Toys: ball, doll, teddy, train",
    6:"Unit 3 — Colours: blue, brown, red, yellow",
    7:"Review — Units 1–3: Friends, Family, Toys",
    8:"Unit 4 — Body: ears, eyes, mouth, nose",
    9:"Unit 4 — Body: arms, feet, hands, legs",
    10:"Unit 5 — Food: apples, bananas, biscuits — I like ___",
    11:"Unit 5 — Drinks: juice, milk, water — I don't like ___",
    12:"Unit 6 — Animals: cat, dog, fish, rabbit",
    13:"Unit 6 — Prepositions: on, under — chair, table",
    14:"Review — Units 4–6: Body, Food, Animals",
    15:"Consolidation — Units 1–6 vocabulary games",
    16:"Consolidation — Units 1–6 revision & Activity Book",
    17:"Semester 1 Review — All Units 1–6",
    18:"Semester 1 Review — All Units 1–6",
    19:"Test revision",
    20:"Final assessment"
  },
  Science:{
    1:"Unit 1 — Living things: people, animals, plants",
    2:"Unit 1 — What can living things do? grow, move, eat",
    3:"Unit 1 — What do living things need? food, water, air",
    4:"Unit 1 — Non-living things: table, sofa, toy, chair",
    5:"Unit 1 Review — living vs non-living things",
    6:"Unit 2 — Healthy food: fruit, vegetables, milk",
    7:"Unit 2 — Unhealthy food: candy, cake, chips",
    8:"Unit 2 — Where does food come from? plants & animals",
    9:"Unit 2 — What does food do? grow, strong, healthy",
    10:"Unit 2 Review — healthy vs unhealthy food",
    11:"Unit 3 — Sounds: hear, loud, quiet",
    12:"Unit 3 — Birds: eagle, crow, owl, hornbill",
    13:"Unit 3 — Parts of a bird: beak, wings, feathers, legs",
    14:"Unit 3 Review — birds, sounds, wings",
    15:"Review — Units 1–3 Science activities",
    16:"Revision — living things, food, birds",
    17:"STREAMSS Activities",
    18:"STREAMSS Review",
    19:"Science Test — Units 1–3",
    20:"Final Review & Test"
  },
  Integration:{
    1:"Myself — first name, last name, nickname",
    2:"My Body — height, weight, eyes, nose, hair",
    3:"Good Hygiene — wash hands, healthy food, exercise",
    4:"My Family — father, mother, siblings, grandparents",
    5:"My Happy School — teacher, student, school places",
    6:"Playing — individual play, cooperative play, toys",
    7:"Good Kids — rights, opinions, listening to others",
    8:"My Pride — self-regulation, self-awareness, self-esteem",
    9:"Saint Louis Marie — biography",
    10:"God Alone — biography, good manners, morals",
    11:"Emotions & Feelings — happy, sad, angry, empathy",
    12:"Senses — colours, textures, patterns of objects",
    13:"Safety First — disease, personal safety, stranger danger",
    14:"Community — hospital, temple, market, airport",
    15:"Community Helpers — farmer, doctor, policeman, pilot",
    16:"Our Nation — religion, cultural diversity, Thai symbols",
    17:"STREAMSS Activities",
    18:"STREAMSS Review",
    19:"Test",
    20:"Test"
  },
  "Play & Learn":{
    1:"First Name — what's your name, I am ___",
    2:"My Body — eyes, nose, mouth, ears, hair",
    3:"Personal Hygiene — wash hands, brush teeth, take a bath",
    4:"Family Background — mother, father, brother, sister",
    5:"My Happy School — school, teacher, student",
    6:"Playing — play, toy, ball, blocks, puzzle",
    7:"Good Kids — kind, help, share, sorry",
    8:"My Pride — proud, brave, calm, strong",
    9:"Saint Louis Marie — saint, pray, love, help",
    10:"God Alone — God, love, pray, church",
    11:"Emotions & Feelings — happy, sad, angry, scared",
    12:"Senses — colours: red, blue, yellow, green",
    13:"Safety First — safe, stop, careful, help",
    14:"Community — market, hospital, temple, school",
    15:"Community Helpers — doctor, nurse, teacher, police",
    16:"Our Nation — Thailand, Thai flag, temple, king",
    17:"STREAMSS",
    18:"STREAMSS",
    19:"Test",
    20:"Test"
  },

  // ── K2 subjects ───────────────────────────────────────────────────────────
  "K2 English":{
    1:"Unit 1 — Hello! Characters, clothes, colours, letter sounds a/e/i/o/u",
    2:"Unit 1 — Hello! Colours: black, grey, orange, purple, white",
    3:"Review — Unit 1: Hello!",
    4:"Unit 2 — My Family: aunt, uncle, cousin, grandma, grandpa — letter sounds d/m",
    5:"Unit 2 — My Family: funny, old, short, tall, young",
    6:"Review — Unit 2: My Family",
    7:"Unit 3 — My Home: bathroom, bedroom, kitchen, living room — letter sounds b/k",
    8:"Unit 3 — My Home: cooking, eating, playing, sleeping, washing",
    9:"Review — Unit 3: My Home",
    10:"Unit 4 — My Body: fingers, head, neck, shoulders, toes — letter sounds t/n",
    11:"Unit 4 — My Body: curly, long, short, straight hair",
    12:"Review — Unit 4: My Body",
    13:"Unit 5 — Outdoors: cold, hot, rainy, sunny, windy — letter sounds s/h",
    14:"Unit 5 — Outdoors: boots, jumper, raincoat, sandals, sunglasses",
    15:"Review — Unit 5: Outdoors",
    16:"Review — Unit 1: Hello! (consolidation)",
    17:"STREAMSS — Review Unit 2: My Family",
    18:"STREAMSS — Review Unit 3: My Home",
    19:"Test — Review Unit 4: My Body",
    20:"Test — Review Unit 5: Outdoors"
  },
  "K2 Phonics":{
    1:"Greetings & Classroom Rules — hello, teacher, school, bag, book",
    2:"Short 'a' — cat, ant, ax, yak, jam, dam, ram",
    3:"Short 'a' story — fan, man, ant, pan, jam, van",
    4:"Short 'a' (ad/ag/ap/at) — dad, pad, bag, rag, nap, tap, map, cap",
    5:"Short 'a' story — mad, tag, lap, pat, dad, map, bag",
    6:"Review — Short 'a': bag, yak, dam, can, cat, rat, map",
    7:"Review — Short 'a' CVC words game",
    8:"Short 'e' — vet, web, egg, ten, jet, net, wet",
    9:"Short 'e' (et/en/ed) — hen, pen, red, bed",
    10:"Short 'e' story — the red hen is wet",
    11:"Short 'i' — sip, lip, zip, ink, lid",
    12:"Short 'i' — kid, ink (CVC practice)",
    13:"Review — Short 'e' & Short 'i': egg, ink, bib, vet, lip, pen",
    14:"STREAMSS/Review",
    15:"STREAMSS/Review",
    16:"STREAMSS/Review",
    17:"STREAMSS",
    18:"STREAMSS",
    19:"Test",
    20:"Test"
  },
  "K2 Science":{
    1:"Unit 1 — Things to wear: clothes protect from sun, rain, cold",
    2:"Unit 1 — What are clothes made of? cotton, wool, animal skin",
    3:"Unit 1 — Mirror & image",
    4:"Unit 2 — Water: shape, taste, colour, healthy",
    5:"Unit 2 — Uses of water: drink, cook, wash",
    6:"Unit 2 — Water, ice and steam: cold, hot, turns into",
    7:"Unit 2 — Float and sink",
    8:"Unit 3 — Farm animals: hen, goose, duck, goat, sheep, cow, horse",
    9:"Unit 3 — Farm animals & their young: duckling, chick, foal, lamb, calf",
    10:"Unit 3 — How do animals grow? Cows give milk, hens give eggs",
    11:"Unit 4 — Air: balloon, ball, rubber ring filled with air",
    12:"Unit 4 — Wind: air that moves, kite, strong",
    13:"Unit 4 — Sea animals: dolphin, shark, jellyfish, turtle, squid",
    14:"Unit 4 — Parts of a fish: eye, scales, tail, mouth, gill, fin",
    15:"Review — Unit 1: Things to wear",
    16:"Review — Unit 2: Water",
    17:"STREAMSS — Review Unit 3: Farm animals",
    18:"STREAMSS — Review Unit 3: Farm animals & young",
    19:"Test — Review Unit 4: Air & wind",
    20:"Test — Review Unit 4: Sea animals"
  },
  "K2 Integration":{
    1:"Myself — first name, last name, nickname",
    2:"My Body — physical appearance, body parts",
    3:"Good Hygiene — wash hands, healthy food, exercise",
    4:"My Family — father, mother, siblings, grandparents",
    5:"My Happy School — teacher, student, school places",
    6:"Playing — individual & cooperative play, toys",
    7:"Good Kids — rights, opinions, listening to others",
    8:"My Pride — self-regulation, self-awareness, self-esteem",
    9:"Saint Louis Marie — biography",
    10:"God Alone — biography, good manners, morals",
    11:"Emotions & Feelings — happy, sad, angry, empathy",
    12:"Senses — colours, textures, patterns",
    13:"Safety First — personal safety, stranger danger",
    14:"Community — hospital, temple, market, airport",
    15:"Community Helpers — farmer, doctor, policeman, pilot",
    16:"Our Nation — religion, cultural diversity, Thai symbols",
    17:"STREAMSS",
    18:"STREAMSS",
    19:"Test",
    20:"Test"
  },
  "K2 Play & Learn":{
    1:"First Name — what's your name, I am ___",
    2:"My Body — eyes, nose, mouth, ears, hair",
    3:"Personal Hygiene — wash hands, brush teeth, take a bath",
    4:"Family Background — mother, father, brother, sister",
    5:"My Happy School — school, teacher, student",
    6:"Playing — play, toy, ball, blocks, puzzle",
    7:"Good Kids — kind, help, share, sorry",
    8:"My Pride — proud, brave, calm, strong",
    9:"Saint Louis Marie — saint, pray, love, help",
    10:"God Alone — God, love, pray, church",
    11:"Emotions & Feelings — happy, sad, angry, scared",
    12:"Senses — colours: red, blue, yellow, green",
    13:"Safety First — safe, stop, careful, help",
    14:"Community — market, hospital, temple, school",
    15:"Community Helpers — doctor, nurse, teacher, police",
    16:"Our Nation — Thailand, Thai flag, temple, king",
    17:"STREAMSS",
    18:"STREAMSS",
    19:"Test",
    20:"Test"
  },

  // ── K3 subjects ───────────────────────────────────────────────────────────
  "K3 English":{
    1:"Unit 1 — Me! Names, numbers 1–20, letter sounds b/m/t/g/p/d/k/n/s/h",
    2:"Unit 1 — Me! Emotions: angry, bored, excited, scared, sleepy, surprised",
    3:"Unit 2 — My Day: morning routine — wake up, brush teeth, get dressed",
    4:"Unit 2 — My Day: evening routine — go to bed, have a bath, play with friends",
    5:"Review — Units 1–2: Me & My Day",
    6:"Unit 3 — My Home: chores — sweep, wash dishes, make the bed",
    7:"Unit 3 — My Home: furniture & prepositions — bed, bookcase, on/under/next to",
    8:"Unit 4 — My Sports: badminton, football, hockey, tennis — letter sound ng",
    9:"Unit 4 — My Sports: bouncing, catching, kicking, throwing",
    10:"Unit 5 — My Free Time: cooking, drawing, reading, watching TV — short/long oo",
    11:"Unit 5 — My Free Time: go swimming, hide-and-seek, play outside",
    12:"Unit 6 — My Food: cake, chocolate, crisps, grapes — letter sound ch",
    13:"Unit 6 — My Food: beans, cereal, fruit, meat, rice, vegetable",
    14:"Unit 7 — Animals: crocodile, elephant, monkey, snake, tiger",
    15:"Unit 7 — Animals: duck, giraffe, lizard, parrot, zebra",
    16:"Unit 8 — Plants: seeds, soil, sun, rain, garden",
    17:"STREAMSS — Unit 9: My Town: hospital, restaurant, school, supermarket",
    18:"STREAMSS — Unit 9: My Town: doctor, farmer, nurse, teacher, waiter",
    19:"Test — Review Units 3–6",
    20:"Test — Review Units 7–9"
  },
  "K3 Phonics":{
    1:"Greetings & Classroom Rules — hello, teacher, school, bag, book",
    2:"Magic 'e' — Long 'a': tape, cane, cape, mane",
    3:"Magic 'e' — Long 'a': gate, wave, skate, cave",
    4:"Magic 'e' — Long 'i': kite, pine, ripe, fine",
    5:"Magic 'e' — Long 'i': bike, hike, nine, line",
    6:"Review — Long a/i sounds: lake, tape, fine, five, cake",
    7:"STREAMSS/Review",
    8:"STREAMSS/Review",
    9:"STREAMSS/Review",
    10:"STREAMSS/Review",
    11:"STREAMSS/Review",
    12:"STREAMSS/Review",
    13:"STREAMSS/Review",
    14:"STREAMSS/Review",
    15:"STREAMSS/Review",
    16:"STREAMSS/Review",
    17:"STREAMSS",
    18:"STREAMSS",
    19:"Test",
    20:"Test"
  },
  "K3 Science":{
    1:"Unit 1 — Around Town: wheels — bike, car, train, truck",
    2:"Unit 1 — Fuel: petrol station, airplane, ship, motorcycle",
    3:"Unit 1 — Light & Shadows: sun, torch, lamp, candle",
    4:"Review — Unit 1: Around Town",
    5:"Unit 2 — Shopping: Metal — pan, can, key",
    6:"Unit 2 — Wood and glass — table, chair, bottle, jug",
    7:"Unit 2 — Plastic and rubber — container, fork, balloon, eraser",
    8:"Review — Unit 2: Going Shopping — metal, wood, glass, plastic, rubber",
    9:"Unit 3 — Zoo: Where do animals live? land, water, both",
    10:"Unit 3 — What do animals eat? plants, meat, both",
    11:"Unit 3 — How do animals move? walk, crawl, hop, fly, swim, slither",
    12:"Review — Unit 3: To the Zoo",
    13:"Unit 4 — Does it absorb water? toilet paper, sponge, towel, raincoat",
    14:"Unit 4 — Does it dissolve? salt, honey, sugar vs beans, rice",
    15:"Unit 4 — Uses of magnets: pencil case, refrigerator, whiteboard",
    16:"Review — Unit 4: People at Work",
    17:"STREAMSS — Review Unit 1: Around Town",
    18:"STREAMSS — Review Unit 2: Going Shopping",
    19:"Test — Review Unit 3: To the Zoo",
    20:"Test — Review Unit 4: People at Work"
  },
  "K3 Integration":{
    1:"Myself — first name, last name, nickname",
    2:"My Body — physical appearance, body organs and functions",
    3:"Good Hygiene — wash hands, healthy food, exercise",
    4:"My Family — father, mother, siblings, grandparents",
    5:"My Happy School — teacher, student, school places",
    6:"Playing — individual & cooperative play",
    7:"Good Kids — rights, opinions, listening to others",
    8:"My Pride — self-regulation, self-awareness, self-esteem",
    9:"Saint Louis Marie — biography",
    10:"God Alone — biography, good manners, morals",
    11:"Emotions & Feelings — happy, sad, angry, empathy",
    12:"Senses — colours, textures, patterns",
    13:"Safety First — personal safety, stranger danger",
    14:"Community — hospital, temple, market, airport",
    15:"Community Helpers — farmer, doctor, policeman, pilot",
    16:"Our Nation — religion, cultural diversity, Thai symbols",
    17:"STREAMSS",
    18:"STREAMSS",
    19:"Test",
    20:"Test"
  },
  "K3 Play & Learn":{
    1:"First Name — nickname, friend, teacher",
    2:"My Body — eyes, nose, mouth, ears, hair, tall, short",
    3:"Personal Hygiene — wash hands, brush teeth, toothbrush, clean",
    4:"Family Background — mother, father, brother, sister, grandparents",
    5:"My Happy School — classroom, desk, chair, rules, library",
    6:"Playing — share, together, build, blocks, puzzle",
    7:"Good Kids — kind, gentle, wait, listen, respect, sorry, thank you",
    8:"My Pride — proud, brave, calm, independent, confident",
    9:"Saint Louis Marie — saint, priest, church, prayer, faith",
    10:"God Alone — God, prayer, faith, love, heart, cross",
    11:"Emotions & Feelings — happy, sad, angry, scared, excited, shy",
    12:"Senses — colours: red, blue, yellow, green, orange, purple",
    13:"Safety First — safe, careful, danger, stranger, emergency",
    14:"Community — market, hospital, temple, post office, airport",
    15:"Community Helpers — doctor, nurse, teacher, police, pilot",
    16:"Our Nation — Thailand, Thai flag, king, culture, temple",
    17:"STREAMSS",
    18:"STREAMSS",
    19:"Test",
    20:"Test"
  }
};


// Gary's duty weeks (Screening position, rotates every 4 weeks from Week 3)


// Get all calendar entries for a date

function getWeekTopic(subject,weekNum,cls){
  if(!weekNum||!subject)return null;
  const isMLP_K3=cls==='K3A'||cls==='K3B';
  const isK2=cls==='K2A'||cls==='K2B'||cls==='K2/1'||cls==='K2/2'||cls==='K2/3';
  const isK3=cls==='K3A'||cls==='K3B'||cls==='K3/1'||cls==='K3/2'||cls==='K3/3'||cls==='K3/4';

  // K2A/K2B MLP — use K2_TOPICS
  if(cls==='K2A'||cls==='K2B'){
    const normSub=subject==='Play'?'Play & Learn':subject;
    const arr=K2_TOPICS[normSub];
    if(arr){const entry=arr[weekNum-1];if(entry)return entry;}
    return null;
  }
  // K3A/K3B MLP — use K3_TOPICS
  if(isMLP_K3){
    const normSub=subject==='Play'?'Play & Learn':subject;
    const arr=K3_TOPICS[normSub];
    if(arr){const entry=arr[weekNum-1];if(entry)return entry;}
    return null;
  }

  const prefix=isK3?'K3 ':isK2?'K2 ':null;
  if(prefix){
    const prefKey=prefix+subject;
    if(WEEK_TOPICS[prefKey]&&WEEK_TOPICS[prefKey][weekNum])return WEEK_TOPICS[prefKey][weekNum];
    if(subject==='Play & Learn'||subject==='Play'){
      const plKey=prefix+'Play & Learn';
      if(WEEK_TOPICS[plKey]&&WEEK_TOPICS[plKey][weekNum])return WEEK_TOPICS[plKey][weekNum];
    }
  }
  if(WEEK_TOPICS[subject]&&WEEK_TOPICS[subject][weekNum])return WEEK_TOPICS[subject][weekNum];
  if(subject==='Play'&&WEEK_TOPICS['Play & Learn']&&WEEK_TOPICS['Play & Learn'][weekNum])
    return WEEK_TOPICS['Play & Learn'][weekNum];
  for(const key of Object.keys(WEEK_TOPICS)){
    if(!key.startsWith('K2 ')&&!key.startsWith('K3 ')&&subject.includes(key)&&WEEK_TOPICS[key][weekNum])
      return WEEK_TOPICS[key][weekNum];
  }
  return null;
}

// Helper: get compact topic string from a getWeekTopic result (works for both string and K3 object)
function getTopicLabel(topicData,isIntegration){
  if(!topicData)return null;
  if(typeof topicData==='string')return topicData;
  if(isIntegration||topicData.theme){
    return topicData.theme||(topicData.topics&&topicData.topics[0])||null;
  }
  const u=topicData.unit?'U'+topicData.unit+' · ':'';
  return topicData.topic?(u+topicData.topic):null;
}

const SUBJECT_COLORS={
  "Integration":"#2563eb","English":"#7c3aed","Math":"#059669",
  "Science":"#0891b2","Chinese":"#dc2626","Play & Learn":"#f59e0b",
  "Phonics":"#8b5cf6","Swimming":"#06b6d4","Outdoor":"#16a34a",
  "Music":"#ec4899","Love Reading":"#f97316","Skill Building":"#6366f1",
  "Movement":"#14b8a6","STREAMSS":"#64748b","Integration (Thai)":"#b45309"
};
function subColor(sub){
  for(const k of Object.keys(SUBJECT_COLORS))if(sub&&sub.includes(k))return SUBJECT_COLORS[k];
  return "#64748b";
}

const MOODS=[
  {label:"Happy",emoji:"😊",color:"#22c55e"},
  {label:"Energetic",emoji:"⚡",color:"#f59e0b"},
  {label:"Tired",emoji:"😴",color:"#94a3b8"},
  {label:"Sad",emoji:"😢",color:"#3b82f6"},
  {label:"Upset",emoji:"😠",color:"#ef4444"}
];
const EQUIP_ITEMS=["Bag","Water Bottle","Lunch Box","Uniform","PE Kit","Reading Book"];

const BEHAVIOUR_OPTS=[
  {val:"great",    label:"😇 Great",     color:"#22c55e"},
  {val:"ok",       label:"🙂 OK",        color:"#f59e0b"},
  {val:"needs-work",label:"😤 Needs Work",color:"#f97316"},
  {val:"disruptive",label:"😠 Disruptive",color:"#ef4444"}
];
const PARTICIPATION_OPTS=[
  {val:"active",     label:"🙋 Active",     color:"#2563eb"},
  {val:"quiet",      label:"🤫 Quiet",      color:"#94a3b8"},
  {val:"distracted", label:"😵 Distracted", color:"#f59e0b"}
];
const EFFORT_OPTS=[
  {val:"excellent", label:"⭐ Excellent", color:"#22c55e"},
  {val:"good",      label:"👍 Good",      color:"#3b82f6"},
  {val:"average",   label:"😐 Average",   color:"#94a3b8"},
  {val:"low",       label:"😴 Low",       color:"#ef4444"}
];
const STRENGTH_OPTS=[
  "Creative","Kind","Leader","Helper","Focused","Curious",
  "Energetic","Careful","Brave","Friendly","Listener","Hard Worker"
];

const DUTY=[
  {pos:"Front Gate",  staff:"Miss Sunisa, Miss Thitichaya, T. Svitlana, Mr. Eakchai, T. Iana"},
  {pos:"Staircase",   staff:"Miss Phakawan, Miss Noppawan, Mr. Thawatchai, T. Jussill"},
  {pos:"Walkway",     staff:"Miss Noppawan, T. Daisy, Ms. Li Yan, Miss Kanthira"},
  {pos:"Screening",   staff:"Miss Sirinun, Miss Phonthip, Miss Sunanta, T. Gary"},
  {pos:"Drop-off",    staff:"Miss Ananya, Miss Somsuan, Miss Sasina, Miss Nongkran"},
];

const KG1_SCHEDULE=[
  {label:"Period 1",  time:"08:30-09:10",type:"class"},
  {label:"Milk Break",time:"09:50-10:10",type:"break"},
  {label:"Period 2",  time:"09:10-09:50",type:"class"},
  {label:"Period 3",  time:"10:10-10:50",type:"class"},
  {label:"Lunch",     time:"10:50-11:30",type:"break"},
  {label:"Nap Time",  time:"11:30-13:10",type:"rest"},
  {label:"Period 4",  time:"13:10-13:50",type:"class"},
  {label:"Milk Break",time:"13:50-14:00",type:"break"},
  {label:"Period 5",  time:"14:00-14:40",type:"class"},
  {label:"Period 6",  time:"14:40-15:20",type:"class"},
  {label:"Home Time", time:"15:20-15:30",type:"rest"},
];

const TYPE_OPTS=[
  {label:"Slides",icon:"📽️",color:"#f97316"},
  {label:"Video", icon:"🎬",color:"#ec4899"},
  {label:"Doc",   icon:"📄",color:"#3b82f6"},
  {label:"Sheet", icon:"📊",color:"#10b981"},
  {label:"Audio", icon:"🎵",color:"#8b5cf6"},
  {label:"Image", icon:"🖼️",color:"#06b6d4"},
  {label:"PDF",   icon:"📋",color:"#ef4444"},
  {label:"Link",  icon:"🔗",color:"#64748b"},
];
function typeInfo(t){return TYPE_OPTS.find(x=>x.label===t)||TYPE_OPTS[7];}

const SUBJECTS_ALL=["All","English","Math","Science","STREAMSS","Phonics","Chinese","Music","Movement","Outdoor","Play & Learn","Skill Building","Love Reading","Swimming","Integration"];

const ONEDRIVE_SRC="https://1drv.ms/p/c/c7815a9a8eb70b9d/IQRoHp8pKDGNTJBsh_VMCzw5AfB_ROWKAhyt5jjQNtmvjb0?wdAr=1.3580786026200873";

// Seed resources — loaded into Firestore once at boot if Firestore has no resources yet.
// After that Firestore is the single source of truth. Add/remove via the dashboard UI.
// IDs 1, 2, 10 removed (incomplete URLs / lesson plans folder).
const SEED_RESOURCES=[
  // ── MLP · K1 ──────────────────────────────────────────────────────────────
  {id:4,  prog:"MLP",level:"K1",name:"K1 English Lesson Slides",           url:ONEDRIVE_SRC,embedSrc:ONEDRIVE_SRC,                                                                                                                  subject:"English", type:"Slides", note:"K1 English - OneDrive PowerPoint"},
  {id:6,  prog:"MLP",level:"K1",name:"Pippa & Pop L1 – Activity Book",      url:"https://drive.google.com/file/d/1eodJgCS5sLCWS5M4HCSz4FkgCLrOWhU-/view",embedSrc:"https://drive.google.com/file/d/1eodJgCS5sLCWS5M4HCSz4FkgCLrOWhU-/preview",         subject:"English", type:"PDF",    note:"Cambridge Pippa and Pop Level 1 – full activity book (Units 1–9)"},
  {id:7,  prog:"MLP",level:"K1",name:"Pippa & Pop L1 – Colouring Worksheet",url:"https://drive.google.com/file/d/1MnqTlPuEncYcH8RB-8MWzK1qgyHKfBqh/view",embedSrc:"https://drive.google.com/file/d/1MnqTlPuEncYcH8RB-8MWzK1qgyHKfBqh/preview",         subject:"English", type:"PDF",    note:"Character colouring sheets: Pippa, Pop, Kim, Dan, Tinks"},
  {id:8,  prog:"MLP",level:"K1",name:"Pippa & Pop L1 – Mini Flashcards",    url:"https://drive.google.com/file/d/1gOeMbMqg7RbblOD6BeVz_b8D4x7euUOu/view",embedSrc:"https://drive.google.com/file/d/1gOeMbMqg7RbblOD6BeVz_b8D4x7euUOu/preview",         subject:"English", type:"PDF",    note:"Cut-out flashcards for Units 1–9 vocabulary"},
  {id:9,  prog:"MLP",level:"K1",name:"Pippa & Pop L1 – Word Cards",         url:"https://drive.google.com/file/d/1TLI2mmd9GuoU3QTLUqWqg3L1bPLMIsBS/view",embedSrc:"https://drive.google.com/file/d/1TLI2mmd9GuoU3QTLUqWqg3L1bPLMIsBS/preview",         subject:"English", type:"PDF",    note:"Cut-out word cards for Units 1–9"},
  {id:5,  prog:"MLP",level:"K1",name:"Phonics World 1 – Flipbook",          url:"https://online.flipbuilder.com/xtrvf/dsfl/",embedSrc:"https://online.flipbuilder.com/xtrvf/dsfl/",                                                subject:"Phonics",  type:"Slides", note:"Phonics World 1 interactive flipbook"},
  {id:11, prog:"MLP",level:"K1",name:"Oxford Phonics World 1 – Flashcards", url:"https://drive.google.com/file/d/1S__dFtPYzvgXsrVCsMmpSAYSB__Qg4hM/view",embedSrc:"https://drive.google.com/file/d/1S__dFtPYzvgXsrVCsMmpSAYSB__Qg4hM/preview",          subject:"Phonics",  type:"PDF",    note:"A–Z flashcards: 4 picture cards per letter"},
  {id:12, prog:"MLP",level:"K1",name:"Doodle Town 1 – Student Book",        url:"https://drive.google.com/file/d/1CsF3wTZvBjBfMdrTqrudn8S5f7_eGv6T/view",embedSrc:"https://drive.google.com/file/d/1CsF3wTZvBjBfMdrTqrudn8S5f7_eGv6T/preview",         subject:"Math",    type:"PDF",    note:"Doodle Town 1 student book — Math"},
  {id:3,  prog:"MLP",level:"K1",name:"Science Activity Book 2",             url:"https://drive.google.com/file/d/1ppEOE04Yf_vul-79NbetE5Ru-u79y8D5/view",embedSrc:"https://drive.google.com/file/d/1ppEOE04Yf_vul-79NbetE5Ru-u79y8D5/preview",          subject:"Science", type:"PDF",    note:"Science House K1 activity book"},
  {id:13, prog:"MLP",level:"K1",name:"Science Pupils Book 2",               url:"https://drive.google.com/file/d/1KINDBTTnfLcwxUWET-A05HcN7-Rrxcgh/view",embedSrc:"https://drive.google.com/file/d/1KINDBTTnfLcwxUWET-A05HcN7-Rrxcgh/preview",          subject:"Science", type:"PDF",    note:"Science House K1 pupils book"},
  // ── MLP · K2 ──────────────────────────────────────────────────────────────
  {id:30, prog:"MLP",level:"K2",name:"Oxford Phonics World 2 – Student Book", url:"https://online.fliphtml5.com/rerhx/tjdv/",embedSrc:"https://online.fliphtml5.com/rerhx/tjdv/", subject:"Phonics",  type:"Slides", note:"Oxford Phonics World 2 interactive flipbook"},
  {id:32, prog:"MLP",level:"K2",name:"Pippa and Pop 2 – Activity Book",       url:"https://drive.google.com/file/d/1DML2ResaqOtGLwYTqKM4jRVowfe34OHb/view",embedSrc:"https://drive.google.com/file/d/1DML2ResaqOtGLwYTqKM4jRVowfe34OHb/preview", subject:"English", type:"PDF",    note:"Pippa and Pop Level 2 activity book"},
  {id:33, prog:"MLP",level:"K2",name:"Pippa and Pop 2 – Teacher's Book",      url:"https://drive.google.com/file/d/15KVz2xfgRE_vjNX6kJF_fBsgsC_5sC42/view",embedSrc:"https://drive.google.com/file/d/15KVz2xfgRE_vjNX6kJF_fBsgsC_5sC42/preview", subject:"English", type:"PDF",    note:"Pippa and Pop Level 2 teacher's book"},
  // ── MLP · K3 ──────────────────────────────────────────────────────────────
  {id:31, prog:"MLP",level:"K3",name:"Oxford Phonics World 3 – Flipbook",     url:"https://online.flipbuilder.com/jivyr/gfri/",embedSrc:"https://online.flipbuilder.com/jivyr/gfri/", subject:"Phonics",  type:"Slides", note:"Oxford Phonics World 3 interactive flipbook"},
  {id:34, prog:"MLP",level:"K3",name:"Pippa and Pop 3 – Activity Book",       url:"https://drive.google.com/file/d/1DVineIgqipXexEBq8ZECKrVPzDKnMr75/view",embedSrc:"https://drive.google.com/file/d/1DVineIgqipXexEBq8ZECKrVPzDKnMr75/preview", subject:"English", type:"PDF",    note:"Pippa and Pop Level 3 activity book"},
  {id:35, prog:"MLP",level:"K3",name:"Pippa and Pop 3 – Teacher's Book",      url:"https://drive.google.com/file/d/1d2KMIUSV-zKfbbicIBNSAEE567u1pMpg/view",embedSrc:"https://drive.google.com/file/d/1d2KMIUSV-zKfbbicIBNSAEE567u1pMpg/preview", subject:"English", type:"PDF",    note:"Pippa and Pop Level 3 teacher's book"},
  // ── IEP · K1 ──────────────────────────────────────────────────────────────
  {id:36, prog:"IEP",level:"K1",name:"Super Safari Pupils Book 1 – Flipbook",url:"https://online.flipbuilder.com/sdtta/slkt/",embedSrc:"https://online.flipbuilder.com/sdtta/slkt/",subject:"English",type:"Slides",note:"Super Safari Student Book Level 1 – interactive flipbook"},
  {id:37, prog:"IEP",level:"K1",name:"Super Safari Workbook 1 – Flipbook",   url:"https://online.flipbuilder.com/sdtta/lpsw/",embedSrc:"https://online.flipbuilder.com/sdtta/lpsw/",subject:"English",type:"Slides",note:"Super Safari Workbook Level 1 – interactive flipbook"},
  // ── IEP · K2 ──────────────────────────────────────────────────────────────
  {id:20, prog:"IEP",level:"K2",name:"Super Safari SB Level 2 – Flipbook",  url:"https://online.flipbuilder.com/sdtta/nyep/",embedSrc:"https://online.flipbuilder.com/sdtta/nyep/", subject:"English", type:"Slides", note:"Super Safari Student Book Level 2 – interactive flipbook"},
  {id:21, prog:"IEP",level:"K2",name:"Super Safari WB Level 2 – Flipbook",  url:"https://online.flipbuilder.com/sdtta/ciat/",embedSrc:"https://online.flipbuilder.com/sdtta/ciat/", subject:"English", type:"Slides", note:"Super Safari Workbook Level 2 – interactive flipbook"},
  // ── IEP · K3 ──────────────────────────────────────────────────────────────
  {id:22, prog:"IEP",level:"K3",name:"Super Safari WB Level 3 – Flipbook",  url:"https://online.flipbuilder.com/sdtta/imbf/",embedSrc:"https://online.flipbuilder.com/sdtta/imbf/", subject:"English", type:"Slides", note:"Super Safari Workbook Level 3 – interactive flipbook"},
  {id:23, prog:"IEP",level:"K3",name:"Super Safari SB Level 3 – Flipbook",  url:"https://online.flipbuilder.com/sdtta/ijpc/",embedSrc:"https://online.flipbuilder.com/sdtta/ijpc/", subject:"English", type:"Slides", note:"Super Safari Student Book Level 3 – interactive flipbook"},
];

// DEFAULT_RESOURCES is now empty — Firestore is the single source of truth.
// SEED_RESOURCES is used only to seed Firestore on first load if it is empty.
const DEFAULT_RESOURCES=[];

// ── LESSON OBSERVATIONS ───────────────────────────────────────────────────────
// date: ISO date | teacherId: TEACHERS id or null (class-only) | cls: class
// periods: 1-based period numbers observed (empty = whole day / no specific period)
const OBSERVATIONS=[
  {date:"2026-06-15",teacherId:"daisy",    cls:"K1/2", periods:[1]},
  {date:"2026-06-15",teacherId:"shirley",  cls:"K2/2", periods:[2]},
  {date:"2026-06-16",teacherId:null,       cls:"K1/3", periods:[1],  note:"Ms. Li (Chinese)"},
  {date:"2026-06-16",teacherId:"jussill",  cls:"K2/1", periods:[2]},
  {date:"2026-06-22",teacherId:"gary",     cls:"K1A",  periods:[2,3]},
  {date:"2026-06-23",teacherId:"inessa",   cls:"K2A",  periods:[2]},
  {date:"2026-06-24",teacherId:"svitlana", cls:"K2A",  periods:[2]},
  {date:"2026-06-25",teacherId:"jayne",    cls:"K3/4", periods:[1]},
  {date:"2026-06-29",teacherId:"yulia",    cls:"K1B",  periods:[2]},
  {date:"2026-06-29",teacherId:"iana",     cls:"K3B",  periods:[3]},
  {date:"2026-09-04",teacherId:"janet",    cls:"N1",   periods:[]},
  {date:"2026-09-14",teacherId:"newteacher",cls:"K2B", periods:[2],  note:"Date adjusted — original 13 Sep was a Sunday"},
];

// Helper: get observations for a specific date + class
function getObsForDateCls(dateStr,cls){
  return OBSERVATIONS.filter(o=>o.date===dateStr&&o.cls===cls);
}
// Helper: get observations for a specific date + teacher
function getObsForDateTeacher(dateStr,teacherId){
  return OBSERVATIONS.filter(o=>o.date===dateStr&&o.teacherId===teacherId);
}
// Helper: get all obs for a class (any date) — for week grid
function getObsForCls(cls){
  return OBSERVATIONS.filter(o=>o.cls===cls);
}
// Helper: get all obs for a teacher (any date)
function getObsForTeacher(teacherId){
  return OBSERVATIONS.filter(o=>o.teacherId===teacherId);
}
const TEACHERS=[
  // MLP teachers
  {id:"gary",        name:"T. Gary",        full:"T. Gary",         classes:["K1A"],                                                                          color:"#2563eb", prog:"MLP"},
  {id:"yulia",      name:"T. Yulia",      full:"T. Yulia",       classes:["K1B"],                                                                          color:"#7c3aed", prog:"MLP"},
  {id:"inessa",      name:"T. Inessa",      full:"T. Inessa",       classes:["K2A","K2B","K3A","K3B","K1/1","K1/2","K1/3","N1","N2"],                        color:"#0891b2", prog:"Both"},
  {id:"iana",        name:"T. Iana",        full:"T. Iana",         classes:["K2A","K2B","K3A","K3B","N1","N2"],                                              color:"#059669", prog:"MLP"},
  {id:"jayne",       name:"T. Jayne",       full:"T. Jayne",        classes:["K2A","K2B","K3A","K3B","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4","N1","N2"], color:"#d97706", prog:"Both"},
  {id:"newteacher",  name:"T. JC",          full:"T. JC",  classes:["K2A","K2B","K3A","K3B","K2/1","K2/2","K2/3","N1","N2"],                        color:"#be185d", prog:"Both"},
  {id:"svitlana",    name:"T. Svitlana",    full:"T. Svitlana",     classes:["K2A","K2B","K3A","K3B","N1","N2"],                                              color:"#9333ea", prog:"MLP"},
  {id:"janet",       name:"T. Janet",       full:"T. Janet",        classes:["N1","N2"],                                                                      color:"#16a34a", prog:"Nursery"},
  // IEP teachers
  {id:"jussill",     name:"T. Jussill",     full:"T. Jussill",      classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"],         color:"#0e7490", prog:"IEP"},
  {id:"daisy",       name:"T. Daisy",       full:"T. Daisy",        classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"],         color:"#e11d48", prog:"IEP"},
  {id:"shirley",     name:"T. Shirley",     full:"T. Shirley",      classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"],         color:"#9d174d", prog:"IEP"},
];
