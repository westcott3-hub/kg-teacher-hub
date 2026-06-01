
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
const SCHOOL_LOGO="data:image/png;base64,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";

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
// K1A = อ.1A (Gary), K1B = อ.1B (Iuliia)
// K2A = อ.2A, K2B = อ.2B
// K3A = อ.3A, K3B = อ.3B (อนุบาล 3 MLP — 7 periods per day)
// Periods for อนุบาล 1: P1 08:30-09:10, P2 09:10-09:50, P3 10:10-10:50,
//   break 09:50-10:10, P4 13:10-13:50, P5 14:00-14:40, P6 14:40-15:20
const TIMETABLE={
  // ── KG1 MLP ───────────────────────────────────────────────────────────────
  K1A:{
    Monday:[
      {sub:"Integration",   teacher:"Gary"},
      {sub:"Integration",   teacher:"Gary"},
      {sub:"English",       teacher:"Gary"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Math",          teacher:"Gary"}
    ],
    Tuesday:[
      {sub:"Integration",   teacher:"Gary"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"Gary"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"English",       teacher:"Gary"},
      {sub:"Math",          teacher:"Gary"}
    ],
    Wednesday:[
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"Gary"},
      {sub:"Integration",   teacher:"Gary"},
      {sub:"Play & Learn",  teacher:"Gary"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Phonics",       teacher:"Gary"}
    ],
    Thursday:[
      {sub:"Play & Learn",  teacher:"Gary"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"Gary"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Science",       teacher:"Gary"},
      {sub:"Integration",   teacher:"Gary"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"Gary"},
      {sub:"Integration",   teacher:"Gary"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Science",       teacher:"Gary"},
      {sub:"Phonics",       teacher:"Gary"},
      {sub:"STREAMSS",      teacher:""}
    ]
  },
  K1B:{
    Monday:[
      {sub:"Integration",   teacher:"Iuliia"},
      {sub:"Integration",   teacher:"Iuliia"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"English",       teacher:"Iuliia"},
      {sub:"Math",          teacher:"Iuliia"}
    ],
    Tuesday:[
      {sub:"Integration",   teacher:"Iuliia"},
      {sub:"Integration",   teacher:"Iuliia"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"English",       teacher:"Iuliia"},
      {sub:"Math",          teacher:"Iuliia"}
    ],
    Wednesday:[
      {sub:"Integration",   teacher:"Iuliia"},
      {sub:"Integration",   teacher:"Iuliia"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Phonics",       teacher:"Iuliia"},
      {sub:"Science",       teacher:"Iuliia"}
    ],
    Thursday:[
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Play & Learn",  teacher:"Iuliia"},
      {sub:"Integration",   teacher:"Iuliia"},
      {sub:"Phonics",       teacher:"Iuliia"},
      {sub:"Science",       teacher:"Iuliia"},
      {sub:"Integration",   teacher:"Iuliia"}
    ],
    Friday:[
      {sub:"STREAMSS",      teacher:""},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"Iuliia"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Play & Learn",  teacher:"Iuliia"},
      {sub:"Integration",   teacher:"Iuliia"}
    ]
  },

  // ── KG1 IEP ───────────────────────────────────────────────────────────────
  "K1/1":{
    Monday:[
      {sub:"English",       teacher:"Inessa"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Math",          teacher:"Jussill"}
    ],
    Tuesday:[
      {sub:"English",       teacher:"Inessa"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Movement",      teacher:"กาญธิรา"}
    ],
    Wednesday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"STREAMSS",      teacher:""}
    ],
    Thursday:[
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Play & Learn",  teacher:"Shirley"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ]
  },
  "K1/2":{
    Monday:[
      {sub:"Science",       teacher:"Daisy"},
      {sub:"English",       teacher:"Inessa"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Chinese",       teacher:"Li Yan"}
    ],
    Tuesday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Math",          teacher:"Jussill"}
    ],
    Wednesday:[
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"English",       teacher:"Inessa"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Love Reading",  teacher:"นพวรรณ"}
    ],
    Thursday:[
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ],
    Friday:[
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""}
    ]
  },
  "K1/3":{
    Monday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"English",       teacher:"Inessa"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ],
    Tuesday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"Inessa"}
    ],
    Wednesday:[
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Play & Learn",  teacher:"Shirley"}
    ],
    Thursday:[
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Love Reading",  teacher:"นพวรรณ"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""}
    ]
  },

  // ── KG2 MLP ───────────────────────────────────────────────────────────────
  K2A:{
    Monday:[
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Science",       teacher:"Iana"},
      {sub:"Play & Learn",  teacher:"Jayne"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Phonics",       teacher:"Inessa"},
      {sub:"Integration",   teacher:"Inessa"}
    ],
    Tuesday:[
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Phonics",       teacher:"Inessa"},
      {sub:"Play & Learn",  teacher:"Jayne"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""}
    ],
    Wednesday:[
      {sub:"Math",          teacher:"Iana"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Integration",   teacher:"Inessa"}
    ],
    Thursday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"Inessa"},
      {sub:"Math",          teacher:"Iana"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"Inessa"},
      {sub:"Science",       teacher:"Iana"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"Inessa"}
    ]
  },
  K2B:{
    Monday:[
      {sub:"Science",       teacher:"Iana"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Phonics",       teacher:"Inessa"},
      {sub:"Integration",   teacher:"New Teacher"},
      {sub:"Play & Learn",  teacher:"Jayne"}
    ],
    Tuesday:[
      {sub:"Play & Learn",  teacher:"Jayne"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Phonics",       teacher:"Inessa"},
      {sub:"Integration",   teacher:"New Teacher"}
    ],
    Wednesday:[
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Math",          teacher:"Iana"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"New Teacher"}
    ],
    Thursday:[
      {sub:"Math",          teacher:"Iana"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"New Teacher"},
      {sub:"Chinese",       teacher:"Li Yan"}
    ],
    Friday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Science",       teacher:"Iana"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"New Teacher"}
    ]
  },

  // ── KG2 IEP ───────────────────────────────────────────────────────────────
  "K2/1":{
    Monday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Tuesday:[
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Wednesday:[
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Thursday:[
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ],
    Friday:[
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ]
  },
  "K2/2":{
    Monday:[
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Science",       teacher:"Daisy"}
    ],
    Tuesday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Wednesday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Movement",      teacher:"กาญธิรา"}
    ],
    Thursday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""}
    ],
    Friday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ]
  },
  "K2/3":{
    Monday:[
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ],
    Tuesday:[
      {sub:"Science",       teacher:"Daisy"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Wednesday:[
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""}
    ],
    Thursday:[
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Friday:[
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ]
  },

  // ── KG3 MLP ───────────────────────────────────────────────────────────────
  K3A:{
    Monday:[
      {sub:"Integration",   teacher:"Jayne"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Science",       teacher:"Iana"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Tuesday:[
      {sub:"STREAMSS",      teacher:""},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"Jayne"}
    ],
    Wednesday:[
      {sub:"STREAMSS",      teacher:""},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Math",          teacher:"Iana"},
      {sub:"Phonics",       teacher:"Inessa"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Thursday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Play & Learn",  teacher:"Jayne"},
      {sub:"Math",          teacher:"Iana"},
      {sub:"Phonics",       teacher:"Inessa"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Integration",   teacher:"Jayne"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"Jayne"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"Jayne"},
      {sub:"Science",       teacher:"Iana"},
      {sub:"Play & Learn",  teacher:"Jayne"},
      {sub:"Skill Building",teacher:"มยุรา"}
    ]
  },
  K3B:{
    Monday:[
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Science",       teacher:"Iana"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"Iana"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"English",       teacher:"New Teacher"}
    ],
    Tuesday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"English",       teacher:"New Teacher"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Integration",   teacher:"Iana"},
      {sub:"Skill Building",teacher:"มยุรา"}
    ],
    Wednesday:[
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Phonics",       teacher:"Inessa"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Math",          teacher:"Iana"},
      {sub:"Play & Learn",  teacher:"Jayne"},
      {sub:"Integration",   teacher:"Iana"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"}
    ],
    Thursday:[
      {sub:"STREAMSS",      teacher:""},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Play & Learn",  teacher:"Jayne"},
      {sub:"Math",          teacher:"Iana"},
      {sub:"Phonics",       teacher:"Inessa"},
      {sub:"Integration",   teacher:"Iana"}
    ],
    Friday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Science",       teacher:"Iana"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"Iana"},
      {sub:"Integration",   teacher:"Iana"}
    ]
  },

  // ── KG3 IEP ───────────────────────────────────────────────────────────────
  "K3/1":{
    Monday:[
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"Jayne"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Skill Building",teacher:"มยุรา"}
    ],
    Tuesday:[
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Wednesday:[
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"English",       teacher:"Jayne"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Thursday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Friday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ]
  },
  "K3/2":{
    Monday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"Jayne"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Movement",      teacher:"กาญธิรา"}
    ],
    Tuesday:[
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Skill Building",teacher:"มยุรา"}
    ],
    Wednesday:[
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"Jayne"},
      {sub:"Math",          teacher:"Jussill"}
    ],
    Thursday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"STREAMSS",      teacher:""}
    ],
    Friday:[
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ]
  },
  "K3/3":{
    Monday:[
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Tuesday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"English",       teacher:"Jayne"},
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Wednesday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"English",       teacher:"Jayne"}
    ],
    Thursday:[
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Science",       teacher:"Daisy"}
    ],
    Friday:[
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""},
      {sub:"Skill Building",teacher:"มยุรา"}
    ]
  },
  "K3/4":{
    Monday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Outdoor",       teacher:"ณัฐพงศ์"},
      {sub:"Movement",      teacher:"กาญธิรา"},
      {sub:"Math",          teacher:"Jussill"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Integration",   teacher:"ประจำชั้น"}
    ],
    Tuesday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Love Reading",  teacher:"นพวรรณ"},
      {sub:"Skill Building",teacher:"มยุรา"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"English",       teacher:"Jayne"},
      {sub:"Play & Learn",  teacher:"Shirley"}
    ],
    Wednesday:[
      {sub:"Chinese",       teacher:"Li Yan"},
      {sub:"Play & Learn",  teacher:"Shirley"},
      {sub:"Music",         teacher:"อัครินทร์"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""}
    ],
    Thursday:[
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
    ],
    Friday:[
      {sub:"English",       teacher:"Jayne"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Swimming",      teacher:"นิราภร"},
      {sub:"Integration",   teacher:"ประจำชั้น"},
      {sub:"Science",       teacher:"Daisy"},
      {sub:"STREAMSS",      teacher:""},
      {sub:"STREAMSS",      teacher:""}
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

// Helper — returns correct PERIODS/BREAKS for the selected class
function getPeriodsForCls(cls){
  if(cls==="K3A"||cls==="K3B"||cls.startsWith("KG3"))return PERIODS_K3;
  if(cls==="K2A"||cls==="K2B"||cls.startsWith("KG2"))return PERIODS_K2;
  return PERIODS_K1;
}
function getBreaksForCls(cls){
  if(cls==="K3A"||cls==="K3B"||cls.startsWith("KG3"))return BREAKS_K3;
  if(cls==="K2A"||cls==="K2B"||cls.startsWith("KG2"))return BREAKS_K2;
  return BREAKS_K1;
}
// Get the right timetable object for a class (MLP vs IEP)
function getTimetableForCls(cls){
  return cls.startsWith("KG")?TIMETABLE_IEP:TIMETABLE;
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
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Arparat**","Miss Niraporn","Miss Siriporn","Ms. Svitlana","Ms. Inessa"]},
      {pos:"บันได",staff:["Miss Soonan"]},
      {pos:"ใต้ต้นไทร",staff:["Miss Nopwan"]},
      {pos:"วอกเวย์",staff:["Mr. Natthapong"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Arpornphan**","Ms. Iana"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Sasinee","Miss Srassaya","Miss Phornthip"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["Ms. Shirley","Mr. Akkarin","Ms. Jussill"]}
  },
  {
    rota:2,
    weeks:[2,6,10,14,18],
    positions:[
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Wiphawadee**","Miss Sirikarn**","Miss Thipsudar","Miss Thanjira"]},
      {pos:"บันได",staff:["Miss Yuphin"]},
      {pos:"ใต้ต้นไทร",staff:["Ms. Shirley"]},
      {pos:"วอกเวย์",staff:["Ms. Jussill"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Rungtiva","Ms. Iuliia"]},
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
      {pos:"วอกเวย์",staff:["Ms. Daisy"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Benjawan**","Mr. Gary"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Somsuarn","Miss Srassaya (Benz)"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["Mr. Natthapong","Miss Niraporn"]}
  },
  {
    rota:4,
    weeks:[4,8,12,16,20],
    positions:[
      {pos:"ประตูหน้าตึกยอห์น",staff:["Miss Anchapha","Miss Sunisa**","Miss Phannasorn","Ms. Jayne"]},
      {pos:"บันได",staff:["Miss Kanthira"]},
      {pos:"ใต้ต้นไทร",staff:["Mr. Akkarin"]},
      {pos:"วอกเวย์",staff:["Miss Phanumas"]},
      {pos:"คัดกรองประตูสนาม",staff:["Miss Aemwika**","New Teacher K2B"]},
      {pos:"รับส่งเด็กประตูสนาม",staff:["Miss Yada","Miss Ananya","Miss Thapanee"]}
    ],
    lateduty:{pos:"ประตูหน้าตึกยอห์น",staff:["Mr. Natthapong","Miss Kanthira"]}
  }
];

// Late duty (07:55-08:25) per day of week
const LATE_DUTY_BY_DAY={
  Monday:   ["Ms. Shirley","Mr. Akkarin","Ms. Jussill"],
  Tuesday:  ["Miss Mayura","Miss Nopwan"],
  Wednesday:["Miss Kanthira","Ms. Li Yan"],
  Thursday: ["Mr. Natthapong","Miss Niraporn"],
  Friday:   ["Ms. Daisy","Mr. Chalermphon"]
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
      {date:"2026-06-20",label:"Academic Excellence Awards Ceremony",type:"event"}
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

// Per-subject per-week topic mapping — sourced from K1/K2/K3 Course Outline spreadsheets
// Math for K2/K3 is not yet in the spreadsheets so those keys are omitted.
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
function getWeekTopic(subject,weekNum,cls){
  if(!weekNum||!subject)return null;
  const isK2=cls==='K2A'||cls==='K2B'||cls==='K2/1'||cls==='K2/2'||cls==='K2/3';
  const isK3=cls==='K3A'||cls==='K3B'||cls==='K3/1'||cls==='K3/2'||cls==='K3/3'||cls==='K3/4';
  const prefix=isK3?'K3 ':isK2?'K2 ':null;
  // Try class-specific prefixed key first
  if(prefix){
    const prefKey=prefix+subject;
    if(WEEK_TOPICS[prefKey]&&WEEK_TOPICS[prefKey][weekNum])return WEEK_TOPICS[prefKey][weekNum];
    // Also try "Play & Learn" normalisation (spreadsheet uses "Play & Learn", timetable uses "Play")
    if(subject==='Play & Learn'||subject==='Play'){
      const plKey=prefix+'Play & Learn';
      if(WEEK_TOPICS[plKey]&&WEEK_TOPICS[plKey][weekNum])return WEEK_TOPICS[plKey][weekNum];
    }
  }
  // Exact match (K1 keys)
  if(WEEK_TOPICS[subject]&&WEEK_TOPICS[subject][weekNum])return WEEK_TOPICS[subject][weekNum];
  // Play & Learn normalisation for K1
  if(subject==='Play'&&WEEK_TOPICS['Play & Learn']&&WEEK_TOPICS['Play & Learn'][weekNum])
    return WEEK_TOPICS['Play & Learn'][weekNum];
  // Substring fallback
  for(const key of Object.keys(WEEK_TOPICS)){
    if(!key.startsWith('K2 ')&&!key.startsWith('K3 ')&&subject.includes(key)&&WEEK_TOPICS[key][weekNum])
      return WEEK_TOPICS[key][weekNum];
  }
  return null;
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
  {pos:"Front Gate",  staff:"Miss Sunisa, Miss Thitichaya, Ms. Svitlana, Mr. Eakchai, Ms. Iana"},
  {pos:"Staircase",   staff:"Miss Phakawan, Miss Noppawan, Mr. Thawatchai, Ms. Jussill"},
  {pos:"Walkway",     staff:"Miss Noppawan, Ms. Daisy, Ms. Li Yan, Miss Kanthira"},
  {pos:"Screening",   staff:"Miss Sirinun, Miss Phonthip, Miss Sunanta, Mr. Gary"},
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
const DEFAULT_RESOURCES=[
  {id:4,  name:"K1 English Lesson Slides",          url:ONEDRIVE_SRC,embedSrc:ONEDRIVE_SRC,                                                                                                                                         subject:"English", type:"Slides", note:"K1 English - OneDrive PowerPoint"},
  {id:10, name:"K1 English Lesson Plans",            url:"https://drive.google.com/drive/folders/1fCgym7iO_VX3Zk4aCIor0Iir-_KkS9f5?usp=sharing&view=grid",                                                                               subject:"English", type:"Doc",    note:"K1 English lesson plans folder — Google Drive"},
  {id:6,  name:"Pippa & Pop L1 – Activity Book",     url:"https://drive.google.com/file/d/1eodJgCS5sLCWS5M4HCSz4FkgCLrOWhU-/view",embedSrc:"https://drive.google.com/file/d/1eodJgCS5sLCWS5M4HCSz4FkgCLrOWhU-/preview",         subject:"English", type:"PDF",    note:"Cambridge Pippa and Pop Level 1 – full activity book (Units 1–9)"},
  {id:7,  name:"Pippa & Pop L1 – Colouring Worksheet",url:"https://drive.google.com/file/d/1MnqTlPuEncYcH8RB-8MWzK1qgyHKfBqh/view",embedSrc:"https://drive.google.com/file/d/1MnqTlPuEncYcH8RB-8MWzK1qgyHKfBqh/preview",       subject:"English", type:"PDF",    note:"Character colouring sheets: Pippa, Pop, Kim, Dan, Tinks"},
  {id:8,  name:"Pippa & Pop L1 – Mini Flashcards",   url:"https://drive.google.com/file/d/1gOeMbMqg7RbblOD6BeVz_b8D4x7euUOu/view",embedSrc:"https://drive.google.com/file/d/1gOeMbMqg7RbblOD6BeVz_b8D4x7euUOu/preview",         subject:"English", type:"PDF",    note:"Cut-out flashcards for Units 1–9 vocabulary"},
  {id:9,  name:"Pippa & Pop L1 – Word Cards",        url:"https://drive.google.com/file/d/1TLI2mmd9GuoU3QTLUqWqg3L1bPLMIsBS/view",embedSrc:"https://drive.google.com/file/d/1TLI2mmd9GuoU3QTLUqWqg3L1bPLMIsBS/preview",         subject:"English", type:"PDF",    note:"Cut-out word cards for Units 1–9"},
  {id:5,  name:"Phonics World 1 – Flipbook",           url:"https://online.flipbuilder.com/xtrvf/dsfl/",embedSrc:"https://online.flipbuilder.com/xtrvf/dsfl/",                                                                       subject:"Phonics",  type:"Slides", note:"Phonics World 1 interactive flipbook"},
  {id:11, name:"Oxford Phonics World 1 – Flashcards",  url:"https://drive.google.com/file/d/1S__dFtPYzvgXsrVCsMmpSAYSB__Qg4hM/view",embedSrc:"https://drive.google.com/file/d/1S__dFtPYzvgXsrVCsMmpSAYSB__Qg4hM/preview",                                subject:"Phonics",  type:"PDF",    note:"A–Z flashcards: 4 picture cards per letter"},
  {id:1,  name:"KG1 Math Songs Playlist",            url:"https://drive.google.com/drive/folders/",                                                                                                                                  subject:"Math",    type:"Video",  note:"Counting & number songs"},
  {id:12, name:"Doodle Town 1 – Student Book",       url:"https://drive.google.com/file/d/1CsF3wTZvBjBfMdrTqrudn8S5f7_eGv6T/view",embedSrc:"https://drive.google.com/file/d/1CsF3wTZvBjBfMdrTqrudn8S5f7_eGv6T/preview",         subject:"Math",    type:"PDF",    note:"Doodle Town 1 student book — Math"},
  {id:2,  name:"Phonics Flashcards Set A",           url:"https://docs.google.com/presentation/",                                                                                                                                   subject:"Phonics",  type:"Slides", note:"Letters A-M"},
  {id:3,  name:"Science Activity Book 2",             url:"https://drive.google.com/file/d/1ppEOE04Yf_vul-79NbetE5Ru-u79y8D5/view",embedSrc:"https://drive.google.com/file/d/1ppEOE04Yf_vul-79NbetE5Ru-u79y8D5/preview",subject:"Science",type:"PDF",note:"Science House K1 activity book"},
  {id:13, name:"Science Pupils Book 2",               url:"https://drive.google.com/file/d/1KINDBTTnfLcwxUWET-A05HcN7-Rrxcgh/view",embedSrc:"https://drive.google.com/file/d/1KINDBTTnfLcwxUWET-A05HcN7-Rrxcgh/preview",subject:"Science",type:"PDF",note:"Science House K1 pupils book"},
];

// Foreign teachers — each gets their own tab
const TEACHERS=[
  // MLP teachers
  {id:"gary",        name:"T. Gary",        full:"Gary",         classes:["K1A"],                                          color:"#2563eb", prog:"MLP"},
  {id:"iuliia",      name:"T. Iuliia",      full:"Iuliia",       classes:["K1B"],                                          color:"#7c3aed", prog:"MLP"},
  {id:"inessa",      name:"T. Inessa",      full:"Inessa",       classes:["K2A","K2B","K3A","K3B","K1/1","K1/2","K1/3"],color:"#0891b2", prog:"Both"},
  {id:"iana",        name:"T. Iana",        full:"Iana",         classes:["K2A","K2B","K3A","K3B"],                        color:"#059669", prog:"MLP"},
  {id:"jayne",       name:"T. Jayne",       full:"Jayne",        classes:["K2A","K2B","K3A","K3B","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"], color:"#d97706", prog:"Both"},
  {id:"newteacher",  name:"T. New",         full:"New Teacher",  classes:["K2A","K2B","K3A","K3B","K2/1","K2/2","K2/3"],color:"#be185d", prog:"Both"},
  // IEP teachers
  {id:"jussill",     name:"T. Jussill",     full:"Jussill",      classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"], color:"#0e7490", prog:"IEP"},
  {id:"daisy",       name:"T. Daisy",       full:"Daisy",        classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"], color:"#7c3aed", prog:"IEP"},
  {id:"shirley",     name:"T. Shirley",     full:"Shirley",      classes:["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"], color:"#9d174d", prog:"IEP"},
];
