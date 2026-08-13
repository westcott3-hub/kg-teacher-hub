
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
// K1A = อ.1A (Gary), K1B = อ.1B (Sevara)
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
      {sub:"Integration",   teacher:"T. Sevara"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"English",       teacher:"T. Sevara"},
      {sub:"Math",          teacher:"T. Sevara"}
    ],
    Tuesday:[
      null,
      {sub:"Integration",   teacher:"T. Sevara"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"STREAMSS",      teacher:"T. Sevara"},
      {sub:"English",       teacher:"T. Sevara"},
      {sub:"Math",          teacher:"T. Sevara"}
    ],
    Wednesday:[
      null,
      {sub:"Integration",   teacher:"T. Sevara"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"STREAMSS",      teacher:"T. Sevara"},
      {sub:"Phonics",       teacher:"T. Sevara"},
      {sub:"Science",       teacher:"T. Sevara"}
    ],
    Thursday:[
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Play & Learn",  teacher:"T. Sevara"},
      null,
      {sub:"Phonics",       teacher:"T. Sevara"},
      {sub:"Science",       teacher:"T. Sevara"},
      {sub:"Integration",   teacher:"T. Sevara"}
    ],
    Friday:[
      {sub:"STREAMSS",      teacher:"T. Sevara"},
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Play & Learn",  teacher:"T. Sevara"},
      {sub:"Integration",   teacher:"T. Sevara"}
    ]
  },
    // ── KG1 IEP ───────────────────────────────────────────────────────────────
  "K1/1":{
    Monday:[
      {sub:"English",       teacher:"T. Taylinn"},
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      null,
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Math",          teacher:"T. Jussill"}
    ],
    Tuesday:[
      {sub:"English",       teacher:"T. Taylinn"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
      null
    ],
    Thursday:[
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      null,
      {sub:"Play & Learn",  teacher:"T. Lhen"}
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
      {sub:"English",       teacher:"T. Taylinn"},
      null,
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"English",       teacher:"T. Taylinn"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
      null,
      null,
      null
    ]
  },
  "K1/3":{
    Monday:[
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"English",       teacher:"T. Taylinn"},
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
      {sub:"English",       teacher:"T. Taylinn"}
    ],
    Wednesday:[
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      null,
      null,
      {sub:"Play & Learn",  teacher:"T. Lhen"}
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
      null,
      null
    ]
  },
    // ── KG2 MLP ───────────────────────────────────────────────────────────────
  K2A:{
    Monday:[
      {sub:"English",       teacher:"T. JC"},
      {sub:"Science",       teacher:"T. Yana"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      null,
      {sub:"Phonics",       teacher:"T. Taylinn"},
      {sub:"Integration",   teacher:"T. Taylinn"}
    ],
    Tuesday:[
      {sub:"English",       teacher:"T. JC"},
      {sub:"Phonics",       teacher:"T. Taylinn"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      null,
      null,
      {sub:"STREAMSS",      teacher:"T. Lana"}
    ],
    Wednesday:[
      {sub:"Math",          teacher:"T. Yana"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
      null,
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Integration",   teacher:"T. Taylinn"}
    ],
    Thursday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"T. Taylinn"},
      {sub:"Math",          teacher:"T. Yana"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null
    ],
    Friday:[
      {sub:"Integration",   teacher:"T. Taylinn"},
      {sub:"Science",       teacher:"T. Yana"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"T. Taylinn"}
    ]
  },
  K2B:{
    Monday:[
      {sub:"Science",       teacher:"T. Yana"},
      {sub:"English",       teacher:"T. JC"},
      null,
      {sub:"Phonics",       teacher:"T. Taylinn"},
      {sub:"Integration",   teacher:"T. JC"},
      {sub:"Play & Learn",  teacher:"T. Jayne"}
    ],
    Tuesday:[
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"English",       teacher:"T. JC"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
      null,
      {sub:"Phonics",       teacher:"T. Taylinn"},
      {sub:"Integration",   teacher:"T. JC"}
    ],
    Wednesday:[
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Math",          teacher:"T. Yana"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      {sub:"Integration",   teacher:"T. JC"}
    ],
    Thursday:[
      {sub:"Math",          teacher:"T. Yana"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
      null,
      {sub:"Integration",   teacher:"T. JC"},
      {sub:"Chinese",       teacher:"Li Yan"}
    ],
    Friday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Science",       teacher:"T. Yana"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
      null
    ],
    Tuesday:[
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Math",          teacher:"T. Jussill"},
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Science",       teacher:"T. Yana"},
      null
    ],
    Tuesday:[
      {sub:"STREAMSS",      teacher:"T. Lana"},
      null,
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"English",       teacher:"T. JC"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Integration",   teacher:"T. Jayne"}
    ],
    Wednesday:[
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Math",          teacher:"T. Yana"},
      {sub:"Phonics",       teacher:"T. Taylinn"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      null
    ],
    Thursday:[
      null,
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"Math",          teacher:"T. Yana"},
      {sub:"Phonics",       teacher:"T. Taylinn"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Integration",   teacher:"T. Jayne"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"T. Jayne"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"T. Jayne"},
      {sub:"Science",       teacher:"T. Yana"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      null
    ]
  },
  K3B:{
    Monday:[
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      null,
      {sub:"Science",       teacher:"T. Yana"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"T. Yana"},
      null,
      {sub:"English",       teacher:"T. JC"}
    ],
    Tuesday:[
      null,
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"English",       teacher:"T. JC"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Integration",   teacher:"T. Yana"},
      {sub:"Skill Building",teacher:"มิสมยุรา"}
    ],
    Wednesday:[
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      {sub:"Phonics",       teacher:"T. Taylinn"},
      null,
      {sub:"Math",          teacher:"T. Yana"},
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"Integration",   teacher:"T. Yana"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"}
    ],
    Thursday:[
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      {sub:"Play & Learn",  teacher:"T. Jayne"},
      {sub:"Math",          teacher:"T. Yana"},
      {sub:"Phonics",       teacher:"T. Taylinn"},
      {sub:"Integration",   teacher:"T. Yana"}
    ],
    Friday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Science",       teacher:"T. Yana"},
      {sub:"Movement",      teacher:"มิสกาญธิรา"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null,
      {sub:"Integration",   teacher:"T. Yana"}
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
      null,
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Outdoor",       teacher:"ม.ณัฐพงศ์"},
      {sub:"Love Reading",  teacher:"มิสนพวรรณ"},
      null
    ],
    Wednesday:[
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"Skill Building",teacher:"มิสมยุรา"},
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"},
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
      {sub:"Play & Learn",  teacher:"T. Lhen"}
    ],
    Wednesday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Play & Learn",  teacher:"T. Lhen"},
      {sub:"Music",         teacher:"ม.อัครินทร์"},
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      null,
      null
    ],
    Thursday:[
      null,
      null,
      {sub:"Swimming",      teacher:"นิราภร"},
      null,
      {sub:"Science",       teacher:"T. Daisy"},
      {sub:"English",       teacher:"T. Jayne"},
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
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ],
    Tuesday:[
      null,
      {sub:"English",       teacher:"T. Janet"},
      {sub:"English",       teacher:"T. Taylinn"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ],
    Wednesday:[
      null,
      {sub:"English",       teacher:"T. Janet"},
      null,
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ],
    Thursday:[
      {sub:"English",       teacher:"T. Taylinn"},
      {sub:"English",       teacher:"T. Janet"},
      null,
      {sub:"English",       teacher:"T. Janet"},
      null,
      null
    ],
    Friday:[
      {sub:"STREAMSS",      teacher:"T. Lana"},
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
      {sub:"STREAMSS",      teacher:"T. Lana"},
      {sub:"Chinese",       teacher:"Li Yan"},
      null,
      {sub:"English",       teacher:"T. Janet"},
      null
    ],
    Tuesday:[
      {sub:"English",       teacher:"T. Janet"},
      {sub:"STREAMSS",      teacher:"T. Lana"},
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
      {sub:"STREAMSS",      teacher:"T. Lana"},
      null,
      null,
      {sub:"English",       teacher:"T. Janet"},
      null
    ],
    Friday:[
      {sub:"English",       teacher:"T. Janet"},
      null,
      {sub:"STREAMSS",      teacher:"T. Lana"},
      null,
      {sub:"English",       teacher:"T. Janet"},
      null
    ]
  }
};
// Help assignments — teacher supports another class for specific periods
// Source: รวม sheet S1/2026
const TIMETABLE_HELP={
  "T. Daisy":{
    Monday:[{period:"P5",cls:"K1/2",sub:"Integration"}],
    Tuesday:[{period:"P6",cls:"K1/2",sub:"Math"}],
    Wednesday:[{period:"P6",cls:"K1/2",sub:"Love Reading"}],
    Thursday:[],
    Friday:[{period:"P6",cls:"K1/2",sub:"STREAMSS"}]
  },
  "T. Jussill":{
    Monday:[],
    Tuesday:[],
    Wednesday:[{period:"P4",cls:"K2/2",sub:"Integration"}],
    Thursday:[{period:"P4",cls:"K2/2",sub:"Love Reading"}],
    Friday:[{period:"P5",cls:"K2/2",sub:"STREAMSS"},{period:"P6",cls:"K2/2",sub:"STREAMSS"}]
  },
  "T. Lhen":{
    Monday:[],
    Tuesday:[{period:"P1",cls:"K3/4",sub:"Integration"}],
    Wednesday:[],
    Thursday:[{period:"P1",cls:"K3/4",sub:"STREAMSS"}],
    Friday:[{period:"P6",cls:"K3/4",sub:"Outdoor"},{period:"P7",cls:"K3/4",sub:"Skill Building"}]
  },
  "T. Taylinn":{
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

// Gary's duty weeks — Screening position, Rota 3 (weeks 4,8,12,16,20 — shifted +1 wk after Aug 2026 holiday)
const GARY_DUTY_WEEKS=new Set([4,8,12,16,20]);

// Full duty rota — all positions for all 4 teams
const MORNING_DUTY_ROTA=[
  {
    rota:1,
    weeks:[2,6,10,14,18],
    positions:[
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Arparat**","Miss Niraporn","Miss Siriporn","T. Lana","T. Taylinn"]},
      {pos:"บันได",staff:["Miss Soonan"]},
      {pos:"ใต้ต้นไทร",staff:["Miss Nopwan"]},
      {pos:"วอกเวย์",staff:["Mr. Natthapong"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Arpornphan**","T. Yana"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Sasinee","Miss Srassaya","Miss Phornthip"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["T. Lhen","Mr. Akkarin","T. Jussill"]}
  },
  {
    rota:2,
    weeks:[3,7,11,15,19],
    positions:[
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Wiphawadee**","Miss Sirikarn**","Miss Thipsudar","Miss Thanjira"]},
      {pos:"บันได",staff:["Miss Yuphin"]},
      {pos:"ใต้ต้นไทร",staff:["T. Lhen"]},
      {pos:"วอกเวย์",staff:["T. Jussill"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Rungtiva","T. Sevara"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Ariyaporn","Miss Srassaya (Joy)","Miss Paphawarin"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["Miss Mayura","Miss Nopwan"]}
  },
  {
    rota:3,
    weeks:[4,8,12,16,20],
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
    weeks:[5,9,13,17,21],
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
  Monday:   ["T. Lhen","Mr. Akkarin","T. Jussill"],
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

// ── ASSEMBLY ROTAS ────────────────────────────────────────────────────────────
// Morning Talk — two alternating weekly line-ups (Mon–Fri).
// Anchor: shifted +1 week after Aug 2026 holiday (was 2026-07-06).
const MORNING_TALK_ANCHOR="2026-07-13";
const MORNING_TALK_ROTA=[
  {label:"1st week",Monday:"T. Gary",Tuesday:"T. Sevara + New Teacher",Wednesday:"T. Tata",Thursday:"T. Taylinn",Friday:"Li Yan"},
  {label:"2nd week",Monday:"T. JC",Tuesday:"T. Daisy",Wednesday:"T. Jayne",Thursday:"T. Lhen",Friday:"T. Yana"}
];
// Wednesday Story at assembly — foreign-teacher rotation.
// Anchor: shifted +1 week after Aug 2026 holiday (was 2026-07-08).
const STORY_ANCHOR="2026-07-15";
const STORY_ROTA=["T. Jayne","T. Yana","T. Gary","T. Sevara","T. Taylinn","T. JC"];

// Monday 00:00 of the week containing date d
function mondayOf(d){
  const dt=new Date(d.getFullYear(),d.getMonth(),d.getDate());
  dt.setDate(dt.getDate()-((dt.getDay()+6)%7));
  return dt;
}
// 0 = "1st week" line-up, 1 = "2nd week" line-up, for the week containing d
function getMorningTalkWeekIdx(d){
  const anchor=mondayOf(new Date(MORNING_TALK_ANCHOR+"T00:00:00"));
  const wk=Math.round((mondayOf(d||new Date())-anchor)/604800000);
  return ((1+wk)%2+2)%2;
}
// Morning Talk line-up object for the week containing d
function getMorningTalkWeek(d){return MORNING_TALK_ROTA[getMorningTalkWeekIdx(d)];}
// Storyteller for the Wednesday of the week containing d
function getStoryTellerFor(d){
  const anchor=new Date(STORY_ANCHOR+"T00:00:00");
  const wed=mondayOf(d||new Date());wed.setDate(wed.getDate()+2);
  const wk=Math.round((wed-anchor)/604800000);
  return {teacher:STORY_ROTA[((wk%6)+6)%6],date:wed};
}
// Next upcoming Wednesday storyteller (today if it's Wednesday)
function getNextStory(){
  const today=new Date();const t0=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  let s=getStoryTellerFor(t0);
  if(s.date<t0){const n=new Date(t0);n.setDate(n.getDate()+7);s=getStoryTellerFor(n);}
  return s;
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
      {date:"2026-07-25",label:"Holiday",type:"holiday"},
      {date:"2026-07-26",label:"Holiday",type:"holiday"},
      {date:"2026-07-27",label:"Additional Holiday",type:"holiday"},
      {date:"2026-07-28",label:"Holiday – His Majesty King Rama X's Birthday",type:"holiday"},
      {date:"2026-07-29",label:"Substitution Holiday – Asalha Bucha Day",type:"holiday"},
      {date:"2026-07-30",label:"Buddhist Lent Day Holiday",type:"holiday"},
      {date:"2026-07-31",label:"Additional Holiday",type:"holiday"}
    ],
    events:[
      {date:"2026-07-18",label:"Working Day – Make-up Class",type:"event"}
    ]
  },
  "2026-08":{
    name:"August 2026",
    holidays:[
      {date:"2026-08-01",label:"Holiday",type:"holiday"},
      {date:"2026-08-02",label:"Holiday",type:"holiday"},
      {date:"2026-08-12",label:"Mother's Day Holiday",type:"holiday"}
    ],
    events:[
      {date:"2026-08-03",label:"Classes Resume",type:"event"},
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
    // Sem 1 — Units 1-4 (weeks 1-16), review 17-18, exams 19-20
    {unit:1,topic:"Hello!",vocab:"Characters, clothes, colours, nature, objects, school, toys",structs:"I'm (Kim). I like books. Colour/Paint it (purple)."},
    {unit:1,topic:"Hello! — colours",vocab:"Black, grey, orange, purple, white",structs:"Colour/Paint it (purple). Draw (a butterfly)."},
    {unit:1,topic:"Hello! — language review",vocab:"Characters, clothes, colours",structs:"I'm (Kim). I'm a (girl). I like books."},
    {unit:1,topic:"Hello! — Review",vocab:"Full Unit 1 vocabulary",structs:"Review: I'm (Kim). I like books. Colour/Paint (purple)."},
    {unit:2,topic:"My Family — relatives",vocab:"Aunt, uncle, cousin, grandma, grandpa",structs:"Who's that? He's my (grandpa). She's my (grandma)."},
    {unit:2,topic:"My Family — describing",vocab:"Funny, old, short, tall, young",structs:"He's/She's (old). He isn't/She isn't (young)."},
    {unit:2,topic:"My Family — language",vocab:"Aunt, uncle, cousin, grandma, grandpa, funny, old, short, tall, young",structs:"Who's that? He's my (grandpa). She's (old)."},
    {unit:2,topic:"My Family — Review",vocab:"Full Unit 2 vocabulary",structs:"Review: family members & descriptions"},
    {unit:3,topic:"My Home — rooms",vocab:"Bathroom, bedroom, dining room, kitchen, living room",structs:"Where's (Kim)? She's in the (kitchen)."},
    {unit:3,topic:"My Home — actions",vocab:"Cooking, eating, playing, sleeping, washing",structs:"What's she/he doing? She's/He's (sleeping)."},
    {unit:3,topic:"My Home — language",vocab:"Rooms & actions",structs:"Where's (Kim)? She's in the (kitchen). What's he doing? He's (sleeping)."},
    {unit:3,topic:"My Home — Review",vocab:"Full Unit 3 vocabulary",structs:"Review: rooms & actions at home"},
    {unit:4,topic:"My Body — parts",vocab:"Fingers, head, neck, shoulders, toes",structs:"She's/He's got (a neck)."},
    {unit:4,topic:"My Body — hair",vocab:"Blonde, curly, long, short, straight",structs:"She's/He's got (long) hair."},
    {unit:4,topic:"My Body — language",vocab:"Body parts & hair",structs:"She's/He's got (a neck). She's got (long) hair."},
    {unit:4,topic:"My Body — Review",vocab:"Full Unit 4 vocabulary",structs:"Review: body parts & hair descriptions"},
    null,null,null,null,
    // Sem 2 — Units 5-9 (weeks 21-38), review 37-38, exams 39-40
    {unit:5,topic:"Outdoors — weather",vocab:"Cold, hot, rainy, sunny, windy",structs:"What's the weather like? It's (hot)."},
    {unit:5,topic:"Outdoors — clothes",vocab:"Boots, jumper, raincoat, sandals, sunglasses",structs:"I'm wearing a (raincoat)."},
    {unit:5,topic:"Outdoors — language",vocab:"Weather & clothes",structs:"What's the weather like? It's (hot). I'm wearing a (raincoat)."},
    {unit:5,topic:"Outdoors — Review",vocab:"Full Unit 5 vocabulary",structs:"Review: weather & clothes"},
    {unit:6,topic:"Animals — farm animals",vocab:"Chicken, cow, goat, horse, sheep",structs:"It's a (horse). It's got a (long) (neck)."},
    {unit:6,topic:"Animals — actions",vocab:"Fly, jump, run, swim, walk",structs:"A (horse) can/can't (jump)."},
    {unit:6,topic:"Animals — language",vocab:"Farm animals & actions",structs:"It's a (horse). A (horse) can/can't (jump)."},
    {unit:6,topic:"Animals — Review",vocab:"Full Unit 6 vocabulary",structs:"Review: farm animals & actions"},
    {unit:7,topic:"My Favourite Food — food",vocab:"Burger, lolly, mango, orange, pear",structs:"Can I have (a pear), please?"},
    {unit:7,topic:"My Favourite Food — meals",vocab:"Bread, cheese, chips, eggs, fish",structs:"Do you like (fish)? Yes, I do. / No, I don't."},
    {unit:7,topic:"My Favourite Food — language",vocab:"Food & meals vocabulary",structs:"Can I have (a pear)? Do you like (fish)?"},
    {unit:7,topic:"My Favourite Food — Review",vocab:"Full Unit 7 vocabulary",structs:"Review: favourite food"},
    {unit:8,topic:"My Senses — senses",vocab:"Feel, hear, see, smell, taste",structs:"Can you (see) (the rain)? Yes, I can."},
    {unit:8,topic:"My Senses — nature",vocab:"Bee, grass, leaf, lemon, watermelon",structs:"What can you (hear)?"},
    {unit:8,topic:"My Senses — language",vocab:"Senses & nature vocabulary",structs:"Can you (see) (the rain)? What can you (hear)?"},
    {unit:8,topic:"My Senses — Review",vocab:"Full Unit 8 vocabulary",structs:"Review: the five senses"},
    {unit:9,topic:"Holidays! — beach",vocab:"Beach, sea, boats, kites, shells",structs:"How many (boats) can you see?"},
    {unit:9,topic:"Holidays! — activities",vocab:"Making sandcastles, taking photos, eating ice cream",structs:"I'm (playing with shells)."},
    null,null,null,null,
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
    // Sem 1 — Units 1-4 (weeks 1-16), review 17-18, exams 19-20
    {unit:1,topic:"Me! — introductions",vocab:"Name; numbers 1–20; review letter sounds",structs:"Hello! What's your name? I'm (Kim). How old are you? I'm (eight)."},
    {unit:1,topic:"Me! — emotions",vocab:"Angry, bored, excited, scared, sleepy, surprised",structs:"I'm (bored). He isn't/She isn't (bored)."},
    {unit:1,topic:"Me! — language",vocab:"Name, numbers, emotions",structs:"What's your name? I'm (Kim). How old are you? I'm (bored)."},
    {unit:1,topic:"Me! — Review",vocab:"Full Unit 1 vocabulary",structs:"Review: introductions & emotions"},
    {unit:2,topic:"My Day — morning routine",vocab:"Wake up, wash my face, get dressed, have breakfast, brush my hair, brush my teeth",structs:"I (wake up) in the morning."},
    {unit:2,topic:"My Day — evening routine",vocab:"Go to bed, have a bath, listen to a story, play with friends",structs:"We (play with friends) after school. We don't (have a bath)."},
    {unit:2,topic:"My Day — language",vocab:"Daily routine vocabulary",structs:"I (wake up) in the morning. We don't (have a bath)."},
    {unit:2,topic:"My Day — Review",vocab:"Full Unit 2 vocabulary",structs:"Review: daily routines"},
    {unit:3,topic:"My Home — chores",vocab:"Make the bed, pick up the toys, set the table, sweep the floor, wash the clothes, wash the dishes",structs:"He/She (washes the dishes). I (sweep the floor)."},
    {unit:3,topic:"My Home — furniture",vocab:"Bed, bookcase, cupboard, lamp, rug, toy box",structs:"It's (under/in/on/next to) the (bed)."},
    {unit:3,topic:"My Home — language",vocab:"Chores & furniture",structs:"I (sweep the floor). It's (under) the (bed)."},
    {unit:3,topic:"My Home — Review",vocab:"Full Unit 3 vocabulary",structs:"Review: chores & furniture"},
    {unit:4,topic:"My Sports — sports",vocab:"Badminton, baseball, basketball, football, hockey, tennis",structs:"They're playing (football)."},
    {unit:4,topic:"My Sports — actions",vocab:"Bouncing, catching, hitting, kicking, rolling, throwing",structs:"She's (throwing) a ball."},
    {unit:4,topic:"My Sports — language",vocab:"Sports & ball actions",structs:"They're playing (football). She's (throwing) a ball."},
    {unit:4,topic:"My Sports — Review",vocab:"Full Unit 4 vocabulary",structs:"Review: sports & actions"},
    null,null,null,null,
    // Sem 2 — Units 5-9 (weeks 21-38), exams 39-40
    {unit:5,topic:"My Free Time — hobbies",vocab:"Cooking dinner, drawing, listening to music, playing video games, reading books, watching TV",structs:"I like (reading books)."},
    {unit:5,topic:"My Free Time — activities",vocab:"Go roller skating, go swimming, play a board game, play outside",structs:"Let's (go swimming)! Can I (come and play)?"},
    {unit:5,topic:"My Free Time — language",vocab:"Hobbies & activities",structs:"I like (reading books). Let's (go swimming)!"},
    {unit:5,topic:"My Free Time — Review",vocab:"Full Unit 5 vocabulary",structs:"Review: hobbies & free time"},
    {unit:6,topic:"My Food — treats",vocab:"Cake, chocolate, crisps, grapes, pineapple, sweets",structs:"Would you like some (chocolate)? I'd like some (sweets), please."},
    {unit:6,topic:"My Food — meals",vocab:"Beans, cereal, fruit, meat, rice, vegetables",structs:"I have (meat and rice) for (lunch)."},
    {unit:6,topic:"My Food — language",vocab:"Food & meals",structs:"Would you like some (chocolate)? I have (meat and rice) for (lunch)."},
    {unit:6,topic:"My Food — Review",vocab:"Full Unit 6 vocabulary",structs:"Review: food & meals"},
    {unit:7,topic:"Animals — wild animals 1",vocab:"Crocodile, elephant, hippo, monkey, snake, tiger",structs:"There are (three monkeys). There are (lots of snakes)."},
    {unit:7,topic:"Animals — wild animals 2",vocab:"Duck, giraffe, lizard, parrot, spider, zebra",structs:"They've got (long necks). They are (fast)."},
    {unit:7,topic:"Animals — language",vocab:"Wild animals & descriptions",structs:"There are (three monkeys). They've got (long necks)."},
    {unit:7,topic:"Animals — Review",vocab:"Full Unit 7 vocabulary",structs:"Review: wild animals"},
    {unit:8,topic:"Plants — what plants need",vocab:"Garden, plants, rain, seeds, soil, sun",structs:"What do plants need? Plants need (sun)."},
    {unit:8,topic:"Plants — describing",vocab:"Beautiful, clean, dirty, new, old, ugly",structs:"What beautiful flowers!"},
    {unit:8,topic:"Plants — language",vocab:"Plants & descriptions",structs:"What do plants need? Plants need (sun). What beautiful flowers!"},
    {unit:8,topic:"Plants — Review",vocab:"Full Unit 8 vocabulary",structs:"Review: plants"},
    {unit:9,topic:"My Town — places",vocab:"Hospital, playground, restaurant, school, shop, supermarket",structs:"Where are you going? I'm going to the supermarket."},
    {unit:9,topic:"My Town — jobs",vocab:"Doctor, farmer, nurse, shop assistant, teacher, waiter",structs:"Where does (a teacher) work?"},
    null,null,null,null,
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
    // Semester 1 — Units 1–4
    1:"Unit 1 — My Friends: greetings, Hello, I'm (Pippa)",
    2:"Unit 1 — My Friends: classroom objects, book, crayon, pencil",
    3:"Unit 1 — My Friends: What's this? It's a (pencil)",
    4:"Unit 1 — My Friends: Review",
    5:"Unit 2 — My Family: brother, sister, daddy, mummy",
    6:"Unit 2 — My Family: boy, girl, man, woman",
    7:"Unit 2 — My Family: She's the (mummy). He's my (brother).",
    8:"Unit 2 — My Family: Review",
    9:"Unit 3 — My Toys: ball, doll, teddy, train",
    10:"Unit 3 — My Toys: colours: blue, brown, red, yellow",
    11:"Unit 3 — My Toys: It's a (ball). It's (red).",
    12:"Unit 3 — My Toys: Review",
    13:"Unit 4 — My Body: ears, eyes, mouth, nose",
    14:"Unit 4 — My Body: arms, feet, hands, legs",
    15:"Unit 4 — My Body: Touch your (nose). Colour the (arms).",
    16:"Unit 4 — My Body: Review",
    17:"Semester 1 Review — Units 1–4",
    18:"Semester 1 Review — Units 1–4",
    19:"Semester 1 Exams",
    20:"Semester 1 Exams",
    // Semester 2 — Units 5–9
    21:"Unit 5 — Food: apples, bananas, biscuits, sandwiches",
    22:"Unit 5 — Food: juice, milk, water",
    23:"Unit 5 — Food: I like (apples). I don't like (juice).",
    24:"Unit 5 — Food: Review",
    25:"Unit 6 — Animals: cat, dog, fish, rabbit",
    26:"Unit 6 — Animals: on, under — chair, table",
    27:"Unit 6 — Animals: Where's the (cat)? It's (under) the (chair).",
    28:"Unit 6 — Animals: Review",
    29:"Unit 7 — Clothes: hat, jacket, shoes, socks",
    30:"Unit 7 — Clothes: dress, skirt, trousers, T-shirt",
    31:"Unit 7 — Clothes: (Put on/Take off) your (hat). I've got (a dress).",
    32:"Unit 7 — Clothes: Review",
    33:"Unit 8 — Transport: bike, bus, car, van",
    34:"Unit 8 — Transport: drive a car, jump, ride a bike, run",
    35:"Unit 8 — Transport: I can see a (car). I can (ride a bike).",
    36:"Unit 8 — Transport: Review",
    37:"Unit 9 — The Park: bird, flower, frog, tree",
    38:"Unit 9 — The Park: butterflies, caterpillars, ladybirds, worms",
    39:"Semester 2 Exams",
    40:"Semester 2 Exams"
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

// Pippa and Pop unit number by school week (40 week year, Option A)
// Sem 1 weeks 1-20: Units 1-4 (weeks 1-16 = 4 weeks each), review weeks 17-18, exams weeks 19-20
// Sem 2 weeks 21-40: Units 5-8 (weeks 21-36 = 4 weeks each), Unit 9 (weeks 37-38 = 2 weeks), exams weeks 39-40
const PP_UNIT_FOR_WEEK={
   1:1, 2:1, 3:1, 4:1,
   5:2, 6:2, 7:2, 8:2,
   9:3,10:3,11:3,12:3,
  13:4,14:4,15:4,16:4,
  17:null,18:null,          // Sem 1 review
  19:null,20:null,          // Sem 1 exams
  21:5,22:5,23:5,24:5,
  25:6,26:6,27:6,28:6,
  29:7,30:7,31:7,32:7,
  33:8,34:8,35:8,36:8,
  37:9,38:9,                // Unit 9 — 2 weeks only before exams
  39:null,40:null           // Sem 2 exams
};
function getPPUnitForWeek(weekNum){return PP_UNIT_FOR_WEEK[weekNum]||null;}
function getPPUnitForWeek(weekNum){return PP_UNIT_FOR_WEEK[weekNum]||null;}

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
  {pos:"Front Gate",  staff:"Miss Sunisa, Miss Thitichaya, T. Lana, Mr. Eakchai, T. Yana"},
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
  {label:"Slides",          icon:"📽️", color:"#f97316"},
  {label:"Video",           icon:"🎬", color:"#ec4899"},
  {label:"Student Book",    icon:"📖", color:"#3b82f6"},
  {label:"Workbook",        icon:"📝", color:"#10b981"},
  {label:"Story",           icon:"📚", color:"#8b5cf6"},
  {label:"Story (Role Play)",icon:"🎭",color:"#7c3aed"},
  {label:"Chant",           icon:"🎵", color:"#f59e0b"},
  {label:"Phonics",         icon:"🔤", color:"#06b6d4"},
  {label:"Doc",             icon:"📄", color:"#3b82f6"},
  {label:"Sheet",           icon:"📊", color:"#10b981"},
  {label:"Audio",           icon:"🎵", color:"#8b5cf6"},
  {label:"Image",           icon:"🖼️", color:"#06b6d4"},
  {label:"PDF",             icon:"📋", color:"#ef4444"},
  {label:"Link",            icon:"🔗", color:"#64748b"},
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
  // ── MLP · K3 ──────────────────────────────────────────────────────────────
  {id:31, prog:"MLP",level:"K3",name:"Oxford Phonics World 3 – Flipbook",     url:"https://online.flipbuilder.com/jivyr/gfri/",embedSrc:"https://online.flipbuilder.com/jivyr/gfri/", subject:"Phonics",  type:"Slides", note:"Oxford Phonics World 3 interactive flipbook"},
  // ── IEP · K1 ──────────────────────────────────────────────────────────────
  {id:36, prog:"IEP",level:"K1",name:"Super Safari Pupils Book 1 – Flipbook",url:"https://online.flipbuilder.com/sdtta/slkt/",embedSrc:"https://online.flipbuilder.com/sdtta/slkt/",subject:"English",type:"Slides",note:"Super Safari Student Book Level 1 – interactive flipbook"},
  {id:37, prog:"IEP",level:"K1",name:"Super Safari Workbook 1 – Flipbook",   url:"https://online.flipbuilder.com/sdtta/lpsw/",embedSrc:"https://online.flipbuilder.com/sdtta/lpsw/",subject:"English",type:"Slides",note:"Super Safari Workbook Level 1 – interactive flipbook"},
  // ── IEP · K2 ──────────────────────────────────────────────────────────────
  {id:20, prog:"IEP",level:"K2",name:"Super Safari SB Level 2 – Flipbook",  url:"https://online.flipbuilder.com/sdtta/nyep/",embedSrc:"https://online.flipbuilder.com/sdtta/nyep/", subject:"English", type:"Slides", note:"Super Safari Student Book Level 2 – interactive flipbook"},
  {id:21, prog:"IEP",level:"K2",name:"Super Safari WB Level 2 – Flipbook",  url:"https://online.flipbuilder.com/sdtta/ciat/",embedSrc:"https://online.flipbuilder.com/sdtta/ciat/", subject:"English", type:"Slides", note:"Super Safari Workbook Level 2 – interactive flipbook"},
  // ── IEP · K3 ──────────────────────────────────────────────────────────────
  {id:22, prog:"IEP",level:"K3",name:"Super Safari WB Level 3 – Flipbook",  url:"https://online.flipbuilder.com/sdtta/imbf/",embedSrc:"https://online.flipbuilder.com/sdtta/imbf/", subject:"English", type:"Slides", note:"Super Safari Workbook Level 3 – interactive flipbook"},
  {id:23, prog:"IEP",level:"K3",name:"Super Safari SB Level 3 – Flipbook",  url:"https://online.flipbuilder.com/sdtta/ijpc/",embedSrc:"https://online.flipbuilder.com/sdtta/ijpc/", subject:"English", type:"Slides", note:"Super Safari Student Book Level 3 – interactive flipbook"},
  // ── MLP · Pippa and Pop Video Playlists ──────────────────────────────────
  {id:50,prog:"MLP",level:"K1",name:"Pippa and Pop 1 – Video Playlist",     url:"https://www.youtube.com/playlist?list=PLEIU4ngvgW-TbMBTp0WMRbnI6hYHgtZ1V",embedSrc:"https://www.youtube.com/embed/videoseries?list=PLEIU4ngvgW-TbMBTp0WMRbnI6hYHgtZ1V",subject:"English",type:"Video",note:"49 videos — stories, songs and chants"},
  {id:51,prog:"MLP",level:"K2",name:"Pippa and Pop 2 – Video Playlist",     url:"https://www.youtube.com/playlist?list=PLEIU4ngvgW-QyoLJbnf9oWkHLQ45s6tZb",embedSrc:"https://www.youtube.com/embed/videoseries?list=PLEIU4ngvgW-QyoLJbnf9oWkHLQ45s6tZb",subject:"English",type:"Video",note:"53 videos — stories, songs and chants"},
  // ── MLP · Pippa and Pop Individual Videos (IDs 100–236) ─────────────────


  {id:100,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Student's Book - Unit 1: My friends.",url:"https://www.youtube.com/watch?v=qEgwmGEHgbg",embedSrc:"https://www.youtube.com/embed/qEgwmGEHgbg",subject:"English",type:"Student Book",note:"U1 · My friends"},
  {id:101,prog:"MLP",level:"K1",name:"Pippa & Pop 1 - Workbook - Unit 1: My friend",url:"https://www.youtube.com/watch?v=8S27HzMNiiw",embedSrc:"https://www.youtube.com/embed/8S27HzMNiiw",subject:"English",type:"Workbook",note:"U1 · Workbook"},
  {id:102,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 1: Story - Duck's friend",url:"https://www.youtube.com/watch?v=Jk6n1f5G3Uc",embedSrc:"https://www.youtube.com/embed/Jk6n1f5G3Uc",subject:"English",type:"Story",note:"U1 · Duck's friend"},
  {id:103,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 1: Story - Duck's friend (Role play)",url:"https://www.youtube.com/watch?v=Tro6NdDEMkM",embedSrc:"https://www.youtube.com/embed/Tro6NdDEMkM",subject:"English",type:"Story (Role Play)",note:"U1 · Story (Role Play)"},
  {id:104,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 1: The pencil chant",url:"https://www.youtube.com/watch?v=c4IHEUyKAuQ",embedSrc:"https://www.youtube.com/embed/c4IHEUyKAuQ",subject:"English",type:"Chant",note:"U1 · The pencil chant"},
  {id:105,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Student's Book - Unit 2: My family.",url:"https://www.youtube.com/watch?v=YRlMQ4JuLu4",embedSrc:"https://www.youtube.com/embed/YRlMQ4JuLu4",subject:"English",type:"Student Book",note:"U2 · My family"},
  {id:106,prog:"MLP",level:"K1",name:"Pippa & Pop 1- Workbook - Unit 2: My family",url:"https://www.youtube.com/watch?v=TrffiBPXD6Q",embedSrc:"https://www.youtube.com/embed/TrffiBPXD6Q",subject:"English",type:"Workbook",note:"U2 · Workbook"},
  {id:107,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 2: Story - The big carrot",url:"https://www.youtube.com/watch?v=9kTGQxKgStc",embedSrc:"https://www.youtube.com/embed/9kTGQxKgStc",subject:"English",type:"Story",note:"U2 · The big carrot"},
  {id:108,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 2: Story - The big carrot (Role play)",url:"https://www.youtube.com/watch?v=N2Vl7VhD46M",embedSrc:"https://www.youtube.com/embed/N2Vl7VhD46M",subject:"English",type:"Story (Role Play)",note:"U2 · Story (Role Play)"},
  {id:109,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 2: The boy and girl chant",url:"https://www.youtube.com/watch?v=zEY0saeX1O8",embedSrc:"https://www.youtube.com/embed/zEY0saeX1O8",subject:"English",type:"Chant",note:"U2 · The boy and girl chant"},
  {id:110,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Student's Book - Unit 3: My toys.",url:"https://www.youtube.com/watch?v=GeP2MfExRws",embedSrc:"https://www.youtube.com/embed/GeP2MfExRws",subject:"English",type:"Student Book",note:"U3 · My toys"},
  {id:111,prog:"MLP",level:"K1",name:"Pippa & Pop 1 - Workbook - Unit 3: My toys",url:"https://www.youtube.com/watch?v=UySRR-_zxtA",embedSrc:"https://www.youtube.com/embed/UySRR-_zxtA",subject:"English",type:"Workbook",note:"U3 · Workbook"},
  {id:112,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 3: Story - Big Teddy, Small Teddy",url:"https://www.youtube.com/watch?v=3j-fZqSaIXw",embedSrc:"https://www.youtube.com/embed/3j-fZqSaIXw",subject:"English",type:"Story",note:"U3 · Big Teddy, Small Teddy"},
  {id:113,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 3: Story - Big Teddy, Small Teddy (Role play)",url:"https://www.youtube.com/watch?v=0u2vWwR2IAU",embedSrc:"https://www.youtube.com/embed/0u2vWwR2IAU",subject:"English",type:"Story (Role Play)",note:"U3 · Story (Role Play)"},
  {id:114,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 3: The colors chant",url:"https://www.youtube.com/watch?v=defrWx5HXeY",embedSrc:"https://www.youtube.com/embed/defrWx5HXeY",subject:"English",type:"Chant",note:"U3 · The colors chant"},
  {id:115,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Student's Book - Unit 4: My body.",url:"https://www.youtube.com/watch?v=8w0WtHTDCq0",embedSrc:"https://www.youtube.com/embed/8w0WtHTDCq0",subject:"English",type:"Student Book",note:"U4 · My body"},
  {id:116,prog:"MLP",level:"K1",name:"Pippa & Pop 1 - Workbook - Unit 4: My body",url:"https://www.youtube.com/watch?v=W1ccJhgjO1o",embedSrc:"https://www.youtube.com/embed/W1ccJhgjO1o",subject:"English",type:"Workbook",note:"U4 · Workbook"},
  {id:117,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 4: Story - Bunny's family",url:"https://www.youtube.com/watch?v=XIOeLDgXYTo",embedSrc:"https://www.youtube.com/embed/XIOeLDgXYTo",subject:"English",type:"Story",note:"U4 · Bunny's family"},
  {id:118,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 4: Story - Bunny's family (Role play)",url:"https://www.youtube.com/watch?v=EwfpnWpDEQA",embedSrc:"https://www.youtube.com/embed/EwfpnWpDEQA",subject:"English",type:"Story (Role Play)",note:"U4 · Story (Role Play)"},
  {id:119,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 4: The robot chant",url:"https://www.youtube.com/watch?v=vgWBFg3jaRg",embedSrc:"https://www.youtube.com/embed/vgWBFg3jaRg",subject:"English",type:"Chant",note:"U4 · The robot chant"},
  {id:120,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Student's Book - Unit 5: Food.",url:"https://www.youtube.com/watch?v=7G69fShW_LM",embedSrc:"https://www.youtube.com/embed/7G69fShW_LM",subject:"English",type:"Student Book",note:"U5 · Food"},
  {id:121,prog:"MLP",level:"K1",name:"Pippa & Pop 1 - Workbook - Unit 5: Food.",url:"https://www.youtube.com/watch?v=teaRsX0q8YY",embedSrc:"https://www.youtube.com/embed/teaRsX0q8YY",subject:"English",type:"Workbook",note:"U5 · Workbook"},
  {id:122,prog:"MLP",level:"K1",name:"Pippa & Pop 1: Unit 5 - sound a",url:"https://www.youtube.com/watch?v=VRy-vknISlo",embedSrc:"https://www.youtube.com/embed/VRy-vknISlo",subject:"English",type:"Phonics",note:"U5 · sound a"},
  {id:123,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 5: Story - Picky Peter",url:"https://www.youtube.com/watch?v=uJxBoF1ZDFs",embedSrc:"https://www.youtube.com/embed/uJxBoF1ZDFs",subject:"English",type:"Story",note:"U5 · Picky Peter"},
  {id:124,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 5: Story - Picky Peter (Role play)",url:"https://www.youtube.com/watch?v=6bGeWb_m8OI",embedSrc:"https://www.youtube.com/embed/6bGeWb_m8OI",subject:"English",type:"Story (Role Play)",note:"U5 · Story (Role Play)"},
  {id:125,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 5: The food chant",url:"https://www.youtube.com/watch?v=-f8-3JgiwIE",embedSrc:"https://www.youtube.com/embed/-f8-3JgiwIE",subject:"English",type:"Chant",note:"U5 · The food chant"},
  {id:126,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Student's Book - Unit 6: Animals.",url:"https://www.youtube.com/watch?v=Xnwp4EcR77Y",embedSrc:"https://www.youtube.com/embed/Xnwp4EcR77Y",subject:"English",type:"Student Book",note:"U6 · Animals"},
  {id:127,prog:"MLP",level:"K1",name:"Pippa & Pop 1- Workbook - Unit 6: Animals",url:"https://www.youtube.com/watch?v=5m-z5xGVVEk",embedSrc:"https://www.youtube.com/embed/5m-z5xGVVEk",subject:"English",type:"Workbook",note:"U6 · Workbook"},
  {id:128,prog:"MLP",level:"K1",name:"Pippa & Pop 1: Unit 6 - sound e",url:"https://www.youtube.com/watch?v=G6aMdWyyzSM",embedSrc:"https://www.youtube.com/embed/G6aMdWyyzSM",subject:"English",type:"Phonics",note:"U6 · sound e"},
  {id:129,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 6: Story - Emma's new cat",url:"https://www.youtube.com/watch?v=dVrsqNDtQSo",embedSrc:"https://www.youtube.com/embed/dVrsqNDtQSo",subject:"English",type:"Story",note:"U6 · Emma's new cat"},
  {id:130,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 6: Story - Emma's new cat (Role play)",url:"https://www.youtube.com/watch?v=HLDnO07-t-4",embedSrc:"https://www.youtube.com/embed/HLDnO07-t-4",subject:"English",type:"Story (Role Play)",note:"U6 · Story (Role Play)"},
  {id:131,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 6: The Where's the cat? chant",url:"https://www.youtube.com/watch?v=6std5u_OI8Y",embedSrc:"https://www.youtube.com/embed/6std5u_OI8Y",subject:"English",type:"Chant",note:"U6 · The Where's the cat? chant"},
  {id:132,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Student's Book - Unit 7: Clothes",url:"https://www.youtube.com/watch?v=_qgf3HXUJQ8",embedSrc:"https://www.youtube.com/embed/_qgf3HXUJQ8",subject:"English",type:"Student Book",note:"U7 · Clothes"},
  {id:133,prog:"MLP",level:"K1",name:"Pippa & Pop 1 - Workbook - Unit 7: Clothes.",url:"https://www.youtube.com/watch?v=cBFPYSuQbYU",embedSrc:"https://www.youtube.com/embed/cBFPYSuQbYU",subject:"English",type:"Workbook",note:"U7 · Workbook"},
  {id:134,prog:"MLP",level:"K1",name:"Pippa & Pop 1: Unit 7 - sound i",url:"https://www.youtube.com/watch?v=Ty0Aa5kx8DA",embedSrc:"https://www.youtube.com/embed/Ty0Aa5kx8DA",subject:"English",type:"Phonics",note:"U7 · sound i"},
  {id:135,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 7: Story - Tommy's T-shirt",url:"https://www.youtube.com/watch?v=FZOWvEdFQug",embedSrc:"https://www.youtube.com/embed/FZOWvEdFQug",subject:"English",type:"Story",note:"U7 · Tommy's T-shirt"},
  {id:136,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 7: Story - Tommy's T-shirt (Role play)",url:"https://www.youtube.com/watch?v=Uk585zWgxkA",embedSrc:"https://www.youtube.com/embed/Uk585zWgxkA",subject:"English",type:"Story (Role Play)",note:"U7 · Story (Role Play)"},
  {id:137,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 7: The clothes chant",url:"https://www.youtube.com/watch?v=JG3VgAMnzUs",embedSrc:"https://www.youtube.com/embed/JG3VgAMnzUs",subject:"English",type:"Chant",note:"U7 · The clothes chant"},
  {id:138,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Student's Book - Unit 8: Transportation",url:"https://www.youtube.com/watch?v=9VBe_GTxxaA",embedSrc:"https://www.youtube.com/embed/9VBe_GTxxaA",subject:"English",type:"Student Book",note:"U8 · Transportation"},
  {id:139,prog:"MLP",level:"K1",name:"Pippa & Pop1 - Workbook - Unit 8: Transportation.",url:"https://www.youtube.com/watch?v=CWwMuwJHYDQ",embedSrc:"https://www.youtube.com/embed/CWwMuwJHYDQ",subject:"English",type:"Workbook",note:"U8 · Workbook"},
  {id:140,prog:"MLP",level:"K1",name:"Pippa & Pop 1: Unit 8 - sound o",url:"https://www.youtube.com/watch?v=e66AbzLPrm0",embedSrc:"https://www.youtube.com/embed/e66AbzLPrm0",subject:"English",type:"Phonics",note:"U8 · sound o"},
  {id:141,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 8: Story - The hare and tortoise",url:"https://www.youtube.com/watch?v=Zt7wO9yIA7Q",embedSrc:"https://www.youtube.com/embed/Zt7wO9yIA7Q",subject:"English",type:"Story",note:"U8 · The hare and tortoise"},
  {id:142,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 8: Story - The hare and the tortoise (Role play)",url:"https://www.youtube.com/watch?v=9O4_BnXHyBU",embedSrc:"https://www.youtube.com/embed/9O4_BnXHyBU",subject:"English",type:"Story (Role Play)",note:"U8 · Story (Role Play)"},
  {id:143,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 8: The I can chant",url:"https://www.youtube.com/watch?v=xiKmk-J5NbM",embedSrc:"https://www.youtube.com/embed/xiKmk-J5NbM",subject:"English",type:"Chant",note:"U8 · The I can chant"},
  {id:144,prog:"MLP",level:"K1",name:"Pippa & Pop 1- Workbook - Unit 9: The park.",url:"https://www.youtube.com/watch?v=dMQAdDaGsp8",embedSrc:"https://www.youtube.com/embed/dMQAdDaGsp8",subject:"English",type:"Workbook",note:"U9 · Workbook"},
  {id:145,prog:"MLP",level:"K1",name:"Pippa & Pop 1: Unit 9 - sound u",url:"https://www.youtube.com/watch?v=TCBMm0qBY-U",embedSrc:"https://www.youtube.com/embed/TCBMm0qBY-U",subject:"English",type:"Phonics",note:"U9 · sound u"},
  {id:146,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 9: Story - Penny in the park",url:"https://www.youtube.com/watch?v=g4Z3COjVSvU",embedSrc:"https://www.youtube.com/embed/g4Z3COjVSvU",subject:"English",type:"Story",note:"U9 · Penny in the park"},
  {id:147,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 9: Story - Penny in the park (Role play)",url:"https://www.youtube.com/watch?v=1z-PLzh_z-Q",embedSrc:"https://www.youtube.com/embed/1z-PLzh_z-Q",subject:"English",type:"Story (Role Play)",note:"U9 · Story (Role Play)"},
  {id:148,prog:"MLP",level:"K1",name:"Pippa and Pop 1 - Unit 9: The bugs chant",url:"https://www.youtube.com/watch?v=US3JzBjBHGo",embedSrc:"https://www.youtube.com/embed/US3JzBjBHGo",subject:"English",type:"Chant",note:"U9 · The bugs chant"},
  {id:149,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Student Book - Unit 1: Hello!",url:"https://www.youtube.com/watch?v=bBXs2bYQwh8",embedSrc:"https://www.youtube.com/embed/bBXs2bYQwh8",subject:"English",type:"Student Book",note:"U1 · Hello!"},
  {id:150,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Workbook - Unit 1: Hello!",url:"https://www.youtube.com/watch?v=DzcSmfUz80o",embedSrc:"https://www.youtube.com/embed/DzcSmfUz80o",subject:"English",type:"Workbook",note:"U1 · Workbook"},
  {id:151,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 1 - Story: The colorful chameleon",url:"https://www.youtube.com/watch?v=J6juYzidJHc",embedSrc:"https://www.youtube.com/embed/J6juYzidJHc",subject:"English",type:"Story",note:"U1 · : The colorful chameleon"},
  {id:152,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 1: Story - The colourful chameleon (Role play)",url:"https://www.youtube.com/watch?v=KU1nll8EO2o",embedSrc:"https://www.youtube.com/embed/KU1nll8EO2o",subject:"English",type:"Story (Role Play)",note:"U1 · Story (Role Play)"},
  {id:153,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 1: The color it purple chant",url:"https://www.youtube.com/watch?v=wEzQdbs6nlU",embedSrc:"https://www.youtube.com/embed/wEzQdbs6nlU",subject:"English",type:"Chant",note:"U1 · The color it purple chant"},
  {id:154,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Student's book - Unit 2: My family",url:"https://www.youtube.com/watch?v=c1H7o8_dF-w",embedSrc:"https://www.youtube.com/embed/c1H7o8_dF-w",subject:"English",type:"Student Book",note:"U2 · My family"},
  {id:155,prog:"MLP",level:"K2",name:"Pippa Pop 2 - Workbook - Unit 2: My family.",url:"https://www.youtube.com/watch?v=3NUKHKH7w48",embedSrc:"https://www.youtube.com/embed/3NUKHKH7w48",subject:"English",type:"Workbook",note:"U2 · Workbook"},
  {id:156,prog:"MLP",level:"K2",name:"Pippa & Pop 2: Unit 2 - sounds d, m",url:"https://www.youtube.com/watch?v=TkjyfMY3gwo",embedSrc:"https://www.youtube.com/embed/TkjyfMY3gwo",subject:"English",type:"Phonics",note:"U2 · sounds d, m"},
  {id:157,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 2 - Story: Anna's baby brother",url:"https://www.youtube.com/watch?v=nZuBSytuQWs",embedSrc:"https://www.youtube.com/embed/nZuBSytuQWs",subject:"English",type:"Story",note:"U2 · : Anna's baby brother"},
  {id:158,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 2: Story - Anna's baby brother (Role play)",url:"https://www.youtube.com/watch?v=kQ7x_RTXd08",embedSrc:"https://www.youtube.com/embed/kQ7x_RTXd08",subject:"English",type:"Story (Role Play)",note:"U2 · Story (Role Play)"},
  {id:159,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 2: The he's funny chant",url:"https://www.youtube.com/watch?v=rQLOkL5hB5g",embedSrc:"https://www.youtube.com/embed/rQLOkL5hB5g",subject:"English",type:"Chant",note:"U2 · The he's funny chant"},
  {id:160,prog:"MLP",level:"K2",name:"Pippa And Pop2 - Student Book - Unit 3: My Home",url:"https://www.youtube.com/watch?v=YJiue8MCKI8",embedSrc:"https://www.youtube.com/embed/YJiue8MCKI8",subject:"English",type:"Student Book",note:"U3 · My Home"},
  {id:161,prog:"MLP",level:"K2",name:"Pippa and pop 2 -  Workbook - Unit 3 ; My home",url:"https://www.youtube.com/watch?v=5donThuECA8",embedSrc:"https://www.youtube.com/embed/5donThuECA8",subject:"English",type:"Workbook",note:"U3 · Workbook"},
  {id:162,prog:"MLP",level:"K2",name:"Pippa & Pop 2: Unit 3 - sounds b, k",url:"https://www.youtube.com/watch?v=JPdBl0Pthic",embedSrc:"https://www.youtube.com/embed/JPdBl0Pthic",subject:"English",type:"Phonics",note:"U3 · sounds b, k"},
  {id:163,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 3 - Story: Hide and seek",url:"https://www.youtube.com/watch?v=_jGCx3lJQIQ",embedSrc:"https://www.youtube.com/embed/_jGCx3lJQIQ",subject:"English",type:"Story",note:"U3 · : Hide and seek"},
  {id:164,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 3: Story - Hide and seek (Role play)",url:"https://www.youtube.com/watch?v=8p-JQH7krW0",embedSrc:"https://www.youtube.com/embed/8p-JQH7krW0",subject:"English",type:"Story (Role Play)",note:"U3 · Story (Role Play)"},
  {id:165,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 3: What's he doing? chant",url:"https://www.youtube.com/watch?v=cg9qm74FL7Y",embedSrc:"https://www.youtube.com/embed/cg9qm74FL7Y",subject:"English",type:"Chant",note:"U3 · What's he doing? chant"},
  {id:166,prog:"MLP",level:"K2",name:"Pippa and Pop 2: Student Book - Unit 4: My body",url:"https://www.youtube.com/watch?v=iWpkUJbjLOU",embedSrc:"https://www.youtube.com/embed/iWpkUJbjLOU",subject:"English",type:"Student Book",note:"U4 · My body"},
  {id:167,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Work book - Unit 4: My body",url:"https://www.youtube.com/watch?v=KJ0JcHgQXfM",embedSrc:"https://www.youtube.com/embed/KJ0JcHgQXfM",subject:"English",type:"Workbook",note:"U4 · Workbook"},
  {id:168,prog:"MLP",level:"K2",name:"Pippa & Pop 2: Unit 4 - sounds t, n",url:"https://www.youtube.com/watch?v=nu22n2pIGK0",embedSrc:"https://www.youtube.com/embed/nu22n2pIGK0",subject:"English",type:"Phonics",note:"U4 · sounds t, n"},
  {id:169,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 4 - Story: Milo's shadow",url:"https://www.youtube.com/watch?v=jEeW1q7RCDo",embedSrc:"https://www.youtube.com/embed/jEeW1q7RCDo",subject:"English",type:"Story",note:"U4 · : Milo's shadow"},
  {id:170,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 4: Story - Milo's shadow",url:"https://www.youtube.com/watch?v=ol16sLc9vFE",embedSrc:"https://www.youtube.com/embed/ol16sLc9vFE",subject:"English",type:"Story",note:"U4 · Milo's shadow"},
  {id:171,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 4: The she has straight hair chant",url:"https://www.youtube.com/watch?v=rNDPoyWIkGw",embedSrc:"https://www.youtube.com/embed/rNDPoyWIkGw",subject:"English",type:"Chant",note:"U4 · The she has straight hair chant"},
  {id:172,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Student book -  Unit 5: Outdoors.",url:"https://www.youtube.com/watch?v=BGg9oQL0ebQ",embedSrc:"https://www.youtube.com/embed/BGg9oQL0ebQ",subject:"English",type:"Student Book",note:"U5 · Outdoors"},
  {id:173,prog:"MLP",level:"K2",name:"Workbook Pippa and pop 2 - Workbook - Unit 5: Outdoor.",url:"https://www.youtube.com/watch?v=XW1jC3uTeYY",embedSrc:"https://www.youtube.com/embed/XW1jC3uTeYY",subject:"English",type:"Workbook",note:"U5 · Workbook"},
  {id:174,prog:"MLP",level:"K2",name:"Pippa & Pop 2: Unit 5 - sounds s, h",url:"https://www.youtube.com/watch?v=KYyDtFYiQZo",embedSrc:"https://www.youtube.com/embed/KYyDtFYiQZo",subject:"English",type:"Phonics",note:"U5 · sounds s, h"},
  {id:175,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 5 - Story: Rainy day fun",url:"https://www.youtube.com/watch?v=OosKOeJRZfQ",embedSrc:"https://www.youtube.com/embed/OosKOeJRZfQ",subject:"English",type:"Story",note:"U5 · : Rainy day fun"},
  {id:176,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 5: Story - Rainy day fun (Role play)",url:"https://www.youtube.com/watch?v=feLFF7fiJEo",embedSrc:"https://www.youtube.com/embed/feLFF7fiJEo",subject:"English",type:"Story (Role Play)",note:"U5 · Story (Role Play)"},
  {id:177,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 5: The sunglasses chant",url:"https://www.youtube.com/watch?v=lups6QsJv5k",embedSrc:"https://www.youtube.com/embed/lups6QsJv5k",subject:"English",type:"Chant",note:"U5 · The sunglasses chant"},
  {id:178,prog:"MLP",level:"K2",name:"Pippa and Pop 2 -  Student book - Unit 6: Animals",url:"https://www.youtube.com/watch?v=U298w7v7MBA",embedSrc:"https://www.youtube.com/embed/U298w7v7MBA",subject:"English",type:"Student Book",note:"U6 · Animals"},
  {id:179,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Workbook - Unit 6: Animals",url:"https://www.youtube.com/watch?v=Z2sDW3oi1FE",embedSrc:"https://www.youtube.com/embed/Z2sDW3oi1FE",subject:"English",type:"Workbook",note:"U6 · Workbook"},
  {id:180,prog:"MLP",level:"K2",name:"Pippa & Pop 2: Unit 6 - sounds c, g",url:"https://www.youtube.com/watch?v=VOZGHJ1Tnbw",embedSrc:"https://www.youtube.com/embed/VOZGHJ1Tnbw",subject:"English",type:"Phonics",note:"U6 · sounds c, g"},
  {id:181,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 6 - Story: Stubborn goats!",url:"https://www.youtube.com/watch?v=DqE9ApRj7LY",embedSrc:"https://www.youtube.com/embed/DqE9ApRj7LY",subject:"English",type:"Story",note:"U6 · : Stubborn goats!"},
  {id:182,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 6: Story - Stubbom goats (Role play)",url:"https://www.youtube.com/watch?v=vmESc_-HHyk",embedSrc:"https://www.youtube.com/embed/vmESc_-HHyk",subject:"English",type:"Story (Role Play)",note:"U6 · Story (Role Play)"},
  {id:183,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 6: The amazing animals chant",url:"https://www.youtube.com/watch?v=Iw_vQ3N1G3c",embedSrc:"https://www.youtube.com/embed/Iw_vQ3N1G3c",subject:"English",type:"Chant",note:"U6 · The amazing animals chant"},
  {id:184,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Student book - Unit 7: My favorite food.",url:"https://www.youtube.com/watch?v=38f2mD8rVL4",embedSrc:"https://www.youtube.com/embed/38f2mD8rVL4",subject:"English",type:"Student Book",note:"U7 · My favorite food"},
  {id:185,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Work book - Unit 7: My favorite food.",url:"https://www.youtube.com/watch?v=2-DBeDCZ7GA",embedSrc:"https://www.youtube.com/embed/2-DBeDCZ7GA",subject:"English",type:"Workbook",note:"U7 · Workbook"},
  {id:186,prog:"MLP",level:"K2",name:"Pippa & Pop 2: Unit 7 - sounds f, l, p",url:"https://www.youtube.com/watch?v=X9_AKjWxEFk",embedSrc:"https://www.youtube.com/embed/X9_AKjWxEFk",subject:"English",type:"Phonics",note:"U7 · sounds f, l, p"},
  {id:187,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 7 - Story: Pea soup",url:"https://www.youtube.com/watch?v=oq5cVKUYOVk",embedSrc:"https://www.youtube.com/embed/oq5cVKUYOVk",subject:"English",type:"Story",note:"U7 · : Pea soup"},
  {id:188,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 7: Story - Pea soup (Role play)",url:"https://www.youtube.com/watch?v=j8FiBe1DxXo",embedSrc:"https://www.youtube.com/embed/j8FiBe1DxXo",subject:"English",type:"Story (Role Play)",note:"U7 · Story (Role Play)"},
  {id:189,prog:"MLP",level:"K2",name:"Pippa and Pop2 - Unit 7: The Do you like fries? chant",url:"https://www.youtube.com/watch?v=8zEhLCsrrHA",embedSrc:"https://www.youtube.com/embed/8zEhLCsrrHA",subject:"English",type:"Chant",note:"U7 · The Do you like fries? chant"},
  {id:190,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Student book - Unit 8: My senses.",url:"https://www.youtube.com/watch?v=gOgXFJLE_oI",embedSrc:"https://www.youtube.com/embed/gOgXFJLE_oI",subject:"English",type:"Student Book",note:"U8 · My senses"},
  {id:191,prog:"MLP",level:"K2",name:"Work book Pippa and Pop 2 - Work book - Unit 8: My senses.",url:"https://www.youtube.com/watch?v=8RRuauCU0w8",embedSrc:"https://www.youtube.com/embed/8RRuauCU0w8",subject:"English",type:"Workbook",note:"U8 · Workbook"},
  {id:192,prog:"MLP",level:"K2",name:"Pippa & Pop 2: Unit 8 - sounds j, z",url:"https://www.youtube.com/watch?v=_tY2jNnddIY",embedSrc:"https://www.youtube.com/embed/_tY2jNnddIY",subject:"English",type:"Phonics",note:"U8 · sounds j, z"},
  {id:193,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 8 - Story: A wonderful day",url:"https://www.youtube.com/watch?v=lnckVxH2PME",embedSrc:"https://www.youtube.com/embed/lnckVxH2PME",subject:"English",type:"Story",note:"U8 · : A wonderful day"},
  {id:194,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 8: Story - A wonderful day (Role play)",url:"https://www.youtube.com/watch?v=S6gx07BU2yk",embedSrc:"https://www.youtube.com/embed/S6gx07BU2yk",subject:"English",type:"Story (Role Play)",note:"U8 · Story (Role Play)"},
  {id:195,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 8: The I can hear a bee chant",url:"https://www.youtube.com/watch?v=wXJcqbMedxU",embedSrc:"https://www.youtube.com/embed/wXJcqbMedxU",subject:"English",type:"Chant",note:"U8 · The I can hear a bee chant"},
  {id:196,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Student book - Unit 9: Holiday!",url:"https://www.youtube.com/watch?v=r0hTbo99m94",embedSrc:"https://www.youtube.com/embed/r0hTbo99m94",subject:"English",type:"Student Book",note:"U9 · Holiday!"},
  {id:197,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Workbook - Unit 9: Holiday.",url:"https://www.youtube.com/watch?v=C0fdR-1r_7Y",embedSrc:"https://www.youtube.com/embed/C0fdR-1r_7Y",subject:"English",type:"Workbook",note:"U9 · Workbook"},
  {id:198,prog:"MLP",level:"K2",name:"Pippa & Pop 2: Unit 9 - sounds v, w, y",url:"https://www.youtube.com/watch?v=E5SH1YIBeiM",embedSrc:"https://www.youtube.com/embed/E5SH1YIBeiM",subject:"English",type:"Phonics",note:"U9 · sounds v, w, y"},
  {id:199,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 9 - Story: You can do it, Sam!",url:"https://www.youtube.com/watch?v=x9CHo_XrntQ",embedSrc:"https://www.youtube.com/embed/x9CHo_XrntQ",subject:"English",type:"Story",note:"U9 · : You can do it, Sam!"},
  {id:200,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 9: Story - You can do it, Sam (Role play)",url:"https://www.youtube.com/watch?v=04fOM44G95s",embedSrc:"https://www.youtube.com/embed/04fOM44G95s",subject:"English",type:"Story (Role Play)",note:"U9 · Story (Role Play)"},
  {id:201,prog:"MLP",level:"K2",name:"Pippa and Pop 2 - Unit 9: The swimming chant",url:"https://www.youtube.com/watch?v=heq3kE4TGqg",embedSrc:"https://www.youtube.com/embed/heq3kE4TGqg",subject:"English",type:"Chant",note:"U9 · The swimming chant"},
  {id:202,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Student's book - Unit 1: Me !",url:"https://www.youtube.com/watch?v=YgvIyJVexYw",embedSrc:"https://www.youtube.com/embed/YgvIyJVexYw",subject:"English",type:"Student Book",note:"U1 · Me !"},
  {id:203,prog:"MLP",level:"K3",name:"Pippa And Pop 3 - Wordbook - Unit 1:Me!",url:"https://www.youtube.com/watch?v=2D4QQAmOn4M",embedSrc:"https://www.youtube.com/embed/2D4QQAmOn4M",subject:"English",type:"Workbook",note:"U1 · Workbook"},
  {id:204,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 1: Story - Jane's name (Role play)",url:"https://www.youtube.com/watch?v=2sC1VKAGeDs",embedSrc:"https://www.youtube.com/embed/2sC1VKAGeDs",subject:"English",type:"Story (Role Play)",note:"U1 · Story (Role Play)"},
  {id:205,prog:"MLP",level:"K3",name:"Pippa and Pop 3 -  Student's Book - Unit 2: My day.",url:"https://www.youtube.com/watch?v=OfHiK9xBG5A",embedSrc:"https://www.youtube.com/embed/OfHiK9xBG5A",subject:"English",type:"Student Book",note:"U2 · My day"},
  {id:206,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Workbook - Unit 2: My day.",url:"https://www.youtube.com/watch?v=5iujt9y7Ry4",embedSrc:"https://www.youtube.com/embed/5iujt9y7Ry4",subject:"English",type:"Workbook",note:"U2 · Workbook"},
  {id:207,prog:"MLP",level:"K3",name:"Pippa & Pop 3: Unit 2 - sound sh",url:"https://www.youtube.com/watch?v=PwPJZMSYwEw",embedSrc:"https://www.youtube.com/embed/PwPJZMSYwEw",subject:"English",type:"Phonics",note:"U2 · sound sh"},
  {id:208,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 2: Story - Brush your hair, Leo (Role play)",url:"https://www.youtube.com/watch?v=_j_54ks23nU",embedSrc:"https://www.youtube.com/embed/_j_54ks23nU",subject:"English",type:"Story (Role Play)",note:"U2 · Story (Role Play)"},
  {id:209,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Student Book - Unit 3: My Home.",url:"https://www.youtube.com/watch?v=6QtQB5tc-6k",embedSrc:"https://www.youtube.com/embed/6QtQB5tc-6k",subject:"English",type:"Student Book",note:"U3 · My Home"},
  {id:210,prog:"MLP",level:"K3",name:"Pippa and Pop 3 -  Workbook - Unit 3: My home.",url:"https://www.youtube.com/watch?v=snWqcBZl9zg",embedSrc:"https://www.youtube.com/embed/snWqcBZl9zg",subject:"English",type:"Workbook",note:"U3 · Workbook"},
  {id:211,prog:"MLP",level:"K3",name:"Pippa & Pop 3: Unit 3 - sound ck",url:"https://www.youtube.com/watch?v=FPxGhn67EGw",embedSrc:"https://www.youtube.com/embed/FPxGhn67EGw",subject:"English",type:"Phonics",note:"U3 · sound ck"},
  {id:212,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 3: Story - Goldilocks and the three bear (Role play)",url:"https://www.youtube.com/watch?v=RoY4NNDf1nc",embedSrc:"https://www.youtube.com/embed/RoY4NNDf1nc",subject:"English",type:"Story (Role Play)",note:"U3 · Story (Role Play)"},
  {id:213,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Student Book - Unit 4: My sports.",url:"https://www.youtube.com/watch?v=AZU3B7Xjhmo",embedSrc:"https://www.youtube.com/embed/AZU3B7Xjhmo",subject:"English",type:"Student Book",note:"U4 · My sports"},
  {id:214,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Workbook - Unit 4: My sports.",url:"https://www.youtube.com/watch?v=ZnIr5iI1qQ0",embedSrc:"https://www.youtube.com/embed/ZnIr5iI1qQ0",subject:"English",type:"Workbook",note:"U4 · Workbook"},
  {id:215,prog:"MLP",level:"K3",name:"Pippa & Pop 3: Unit 4 - sound ng",url:"https://www.youtube.com/watch?v=X8yRYDcHjoc",embedSrc:"https://www.youtube.com/embed/X8yRYDcHjoc",subject:"English",type:"Phonics",note:"U4 · sound ng"},
  {id:216,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 4: Story - A sport for Grace (Role play)",url:"https://www.youtube.com/watch?v=id52abjDYXQ",embedSrc:"https://www.youtube.com/embed/id52abjDYXQ",subject:"English",type:"Story (Role Play)",note:"U4 · Story (Role Play)"},
  {id:217,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Student Book - Unit 5: My free time.",url:"https://www.youtube.com/watch?v=sVi9XBFwwXQ",embedSrc:"https://www.youtube.com/embed/sVi9XBFwwXQ",subject:"English",type:"Student Book",note:"U5 · My free time"},
  {id:218,prog:"MLP",level:"K3",name:"Pippa and Pop 3  - Workbook - Unit 5: My free time.",url:"https://www.youtube.com/watch?v=6ToNkdLbhis",embedSrc:"https://www.youtube.com/embed/6ToNkdLbhis",subject:"English",type:"Workbook",note:"U5 · Workbook"},
  {id:219,prog:"MLP",level:"K3",name:"Pippa & Pop 3: Unit 5 - sound oo",url:"https://www.youtube.com/watch?v=XQb1e_Oh-vs",embedSrc:"https://www.youtube.com/embed/XQb1e_Oh-vs",subject:"English",type:"Phonics",note:"U5 · sound oo"},
  {id:220,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 5: Story - Jacks love reading (Role play)",url:"https://www.youtube.com/watch?v=9ppfHsvEtKA",embedSrc:"https://www.youtube.com/embed/9ppfHsvEtKA",subject:"English",type:"Story (Role Play)",note:"U5 · Story (Role Play)"},
  {id:221,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Student Book - Unit 6: My food.",url:"https://www.youtube.com/watch?v=EJuwLhe8dVk",embedSrc:"https://www.youtube.com/embed/EJuwLhe8dVk",subject:"English",type:"Student Book",note:"U6 · My food"},
  {id:222,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Workbook - Unit 6: My food.",url:"https://www.youtube.com/watch?v=dge4Bs2RYts",embedSrc:"https://www.youtube.com/embed/dge4Bs2RYts",subject:"English",type:"Workbook",note:"U6 · Workbook"},
  {id:223,prog:"MLP",level:"K3",name:"Pippa & Pop 3: Unit 6 - sound ch",url:"https://www.youtube.com/watch?v=9_POGoPFYOg",embedSrc:"https://www.youtube.com/embed/9_POGoPFYOg",subject:"English",type:"Phonics",note:"U6 · sound ch"},
  {id:224,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 6: Story - Share, Ricky Raccoon (Role play)",url:"https://www.youtube.com/watch?v=uInV5Lc1ci8",embedSrc:"https://www.youtube.com/embed/uInV5Lc1ci8",subject:"English",type:"Story (Role Play)",note:"U6 · Story (Role Play)"},
  {id:225,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Student book - Unit 7: Animals.",url:"https://www.youtube.com/watch?v=BlUp6JjeDEw",embedSrc:"https://www.youtube.com/embed/BlUp6JjeDEw",subject:"English",type:"Student Book",note:"U7 · Animals"},
  {id:226,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Workbook - Unit 7: Animals.",url:"https://www.youtube.com/watch?v=t_LIdhK1nwg",embedSrc:"https://www.youtube.com/embed/t_LIdhK1nwg",subject:"English",type:"Workbook",note:"U7 · Workbook"},
  {id:227,prog:"MLP",level:"K3",name:"Pippa & Pop 3: Unit 7 - sound th",url:"https://www.youtube.com/watch?v=91lOgTX8Xtc",embedSrc:"https://www.youtube.com/embed/91lOgTX8Xtc",subject:"English",type:"Phonics",note:"U7 · sound th"},
  {id:228,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 7: Story - The mouse and the lion (Role play)",url:"https://www.youtube.com/watch?v=nF6PdALfUmw",embedSrc:"https://www.youtube.com/embed/nF6PdALfUmw",subject:"English",type:"Story (Role Play)",note:"U7 · Story (Role Play)"},
  {id:229,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Workbook - Unit 8: Plants.",url:"https://www.youtube.com/watch?v=0LXZu1LbtpY",embedSrc:"https://www.youtube.com/embed/0LXZu1LbtpY",subject:"English",type:"Workbook",note:"U8 · Workbook"},
  {id:230,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Student Book - Unit 8: Plants.",url:"https://www.youtube.com/watch?v=TFBSlfXM0hw",embedSrc:"https://www.youtube.com/embed/TFBSlfXM0hw",subject:"English",type:"Student Book",note:"U8 · Plants"},
  {id:231,prog:"MLP",level:"K3",name:"Pippa & Pop 3: Unit 8 - sounds ee, ea",url:"https://www.youtube.com/watch?v=Iys7XgYA4a8",embedSrc:"https://www.youtube.com/embed/Iys7XgYA4a8",subject:"English",type:"Phonics",note:"U8 · sounds ee, ea"},
  {id:232,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 8: Story - Sophia's garden (Role play)",url:"https://www.youtube.com/watch?v=Q-I0i5wV7Gk",embedSrc:"https://www.youtube.com/embed/Q-I0i5wV7Gk",subject:"English",type:"Story (Role Play)",note:"U8 · Story (Role Play)"},
  {id:233,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Workbook - Unit 9: My town.",url:"https://www.youtube.com/watch?v=vledfgm5MbQ",embedSrc:"https://www.youtube.com/embed/vledfgm5MbQ",subject:"English",type:"Workbook",note:"U9 · Workbook"},
  {id:234,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Student Book - Unit 9: My town.",url:"https://www.youtube.com/watch?v=DQ7R13bE8kw",embedSrc:"https://www.youtube.com/embed/DQ7R13bE8kw",subject:"English",type:"Student Book",note:"U9 · My town"},
  {id:235,prog:"MLP",level:"K3",name:"Pippa & Pop 3: Unit 9 - sound ay",url:"https://www.youtube.com/watch?v=F9-cFsFsShE",embedSrc:"https://www.youtube.com/embed/F9-cFsFsShE",subject:"English",type:"Phonics",note:"U9 · sound ay"},
  {id:236,prog:"MLP",level:"K3",name:"Pippa and Pop 3 - Unit 9: Story -  Big city cat and small town cat (Role play)",url:"https://www.youtube.com/watch?v=T1v4C5QfV20",embedSrc:"https://www.youtube.com/embed/T1v4C5QfV20",subject:"English",type:"Story (Role Play)",note:"U9 · Story (Role Play)"},
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
  {id:"yulia",      name:"T. Sevara",      full:"T. Sevara",       classes:["K1B"],                                                                          color:"#7c3aed", prog:"MLP"},
  {id:"inessa",      name:"T. Taylinn",      full:"T. Taylinn",       classes:["K2A","K2B","K3A","K3B","K1/1","K1/2","K1/3","N1","N2"],                        color:"#0891b2", prog:"Both"},
  {id:"iana",        name:"T. Yana",        full:"T. Yana",         classes:["K2A","K2B","K3A","K3B","N1","N2"],                                              color:"#059669", prog:"MLP"},
  {id:"jayne",       name:"T. Jayne",       full:"T. Jayne",        classes:["K2A","K2B","K3A","K3B","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4","N1","N2"], color:"#d97706", prog:"Both"},
  {id:"newteacher",  name:"T. JC",          full:"T. JC",  classes:["K2A","K2B","K3A","K3B","K2/1","K2/2","K2/3","N1","N2"],                        color:"#be185d", prog:"Both"},
  {id:"svitlana",    name:"T. Lana",    full:"T. Lana",     classes:["K2A","K2B","K3A","K3B","N1","N2"],                                              color:"#9333ea", prog:"MLP"},
  {id:"janet",       name:"T. Janet",       full:"T. Janet",        classes:["N1","N2"],                                                                      color:"#16a34a", prog:"Nursery"},
  // IEP teachers
  {id:"jussill",     name:"T. Jussill",     full:"T. Jussill",      classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"],         color:"#0e7490", prog:"IEP"},
  {id:"daisy",       name:"T. Daisy",       full:"T. Daisy",        classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"],         color:"#e11d48", prog:"IEP"},
  {id:"shirley",     name:"T. Lhen",        full:"T. Lhen",         classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"],         color:"#9d174d", prog:"IEP"},
];

