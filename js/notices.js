// ══════════════════════════════════════════════════════════════════════════════
// SCHOOL NOTICES — pulled from the "MLP Kindergarten" and "ACS Foreign Teachers"
// LINE groups. Maintained by the daily LINE → dashboard run.
// Rules for this file:
//  • English only (translate any Thai first).
//  • Work info only: no student names, phone numbers, bank/account numbers,
//    salary/deduction details or anything personal. The repo and site are PUBLIC.
//  • Each notice: id (unique, never reused), posted (YYYY-MM-DD), src ("HR" |
//    "KG office"), cat ("action" | "rule" | "event" | "info" | "ref"), title,
//    body (plain text; "\n" = new line), until (YYYY-MM-DD, optional — hidden
//    after this date), link (optional https URL), pin (optional, shows first).
//  • Expired notices can stay; they are filtered out automatically.
// ══════════════════════════════════════════════════════════════════════════════

const NOTICES_UPDATED="2026-11-26";

const NOTICES=[
  {id:14,posted:"2026-11-25",src:"HR",cat:"action",until:"2026-12-19",pin:true,
   title:"Staff Christmas Party moved to Sat 19 Dec (evening)",
   body:"The Annual Staff Christmas Party has moved from Friday 18 December to Saturday 19 December 2026, in the evening. 16 December is now a holiday (Royal Cremation Ceremony of the Queen Mother), so 18 December is a normal teaching day.\n• Going? Send HR your table seating list (8–9 people per table) by Monday 30 November.\n• Can't go because of existing plans? Send HR a letter with proof (e.g. a ticket or travel booking for 19 December) by Friday 27 November. Letters are reviewed for the Christmas gift after school resumes in January."},

  {id:15,posted:"2026-11-25",src:"KG office",cat:"action",until:"2027-03-08",
   title:"Classroom observation: bring your lesson plan",
   body:"On the day of your classroom observation, have your lesson plan ready and bring it for review."},

  {id:1,posted:"2026-11-24",src:"KG office",cat:"action",until:"2026-12-19",
   title:"Flying out on 19 December?",
   body:"If you have already booked a flight departing on 19 December 2026, send a screenshot or photo of your booking confirmation to the KG office."},

  {id:2,posted:"2026-11-17",src:"KG office",cat:"action",until:"2026-12-31",
   title:"Building Staff Welfare Fund: 300 THB by 31 Dec",
   body:"Each teacher is asked to contribute 300 THB to the building's staff fund (used for celebrations, condolences and other staff activities). Transfer to the building treasurer by 31 December 2026. The QR code is in the MLP Kindergarten LINE group (17 Nov)."},

  {id:3,posted:"2026-11-13",src:"HR",cat:"info",until:"2026-12-31",
   title:"Health check-up results ready",
   body:"If you did the Annual Health Check-up in October, collect your results from the HR office."},

  {id:4,posted:"2026-07-17",src:"HR",cat:"rule",pin:true,
   title:"Leave requests: SWIS only",
   body:"Paper leave forms stopped on 20 July 2026. All leave goes through SWIS.\n• Submit in advance or on the day. Your Head of Department approves, then HR.\n• Deadline: 3 days after the leave date. After that the system closes the request.\n• Sick leave of more than 2 days in a row needs a medical certificate.\n• How: Management → Teacher Attendance → Leave Request / History → New Request → fill in type, dates and reason → Submit Request → Confirm Submit.\nMonthly attendance counts towards your Annual Evaluation. HR posts the attendance record in the ACS Foreign Teachers group, so check yours."},

  {id:5,posted:"2026-09-05",src:"HR",cat:"rule",pin:true,
   title:"Weekly dress code",
   body:"See the table below. One-off changes for events are announced in the LINE groups."},

  {id:6,posted:"2026-10-01",src:"HR",cat:"rule",
   title:"ID cards, slippers and jeans",
   body:"Wear your staff ID card at all times on school premises. Slippers and denim jeans are not permitted."},

  {id:7,posted:"2026-08-27",src:"KG office",cat:"rule",
   title:"Smart Classrooms: switch off after class",
   body:"After your lesson, turn off the air conditioner, the lights and the screen/display, and check the room before you leave."},

  {id:8,posted:"2026-09-07",src:"KG office",cat:"info",until:"2026-12-31",
   title:"Smart Classroom 3 closed until December",
   body:"Smart Classroom 3 is unavailable until December. K3B has moved to the upper floor for now."},

  {id:9,posted:"2026-08-20",src:"HR",cat:"info",
   title:"Teachers' Cafeteria: Sakda Building",
   body:"Teachers now eat in the new Teachers' Cafeteria in the Sakda Building. The outside area is for students only."},

  {id:10,posted:"2026-10-19",src:"HR",cat:"info",
   title:"Aerobic dance for teachers",
   body:"Every Tuesday and Thursday, 16:30–18:00, John Mary Building. Open to all teachers."},

  {id:11,posted:"2026-09-24",src:"HR",cat:"event",until:"2027-03-13",
   title:"Annual Field Trip: 11–13 March 2027",
   body:"Sand Dunes Chaolao Beach Resort, Chanthaburi. For staff who have passed probation. Registration closed on 25 Sep. If you don't go, those days don't count as working days."},

  {id:12,posted:"2026-10-01",src:"HR",cat:"info",until:"2027-03-31",
   title:"KSP 7-module registration",
   body:"Registration for the Teachers' Council (KSP) 7 modules is open (Round 1, FY 2027). Useful if you're renewing your teaching licence.",
   link:"https://ksp-7module.one.th/"},

  {id:13,posted:"2026-08-27",src:"KG office",cat:"ref",until:"2027-03-08",
   title:"MLP exam format (Semester 1)",
   body:"Used for the Semester 1 exams. Check with the KG office for any Semester 2 changes.\n• 6 parts × 10 questions: Listening, Writing, Reading, Speaking, Phonics, Math.\n• Black-and-white line drawings only.\n• Headings and instructions in TH SarabunPSK 18 pt bold.\n• Keep content and difficulty right for the level."}
];

// Standing weekly dress code (HR, from 7 Sep 2026). Shown on Today and in Notices.
const DRESS_CODE={
  Monday:   {wear:"School uniform",note:"Women: skirt only"},
  Tuesday:  {wear:"School uniform",note:"Women: skirt or trousers"},
  Wednesday:{wear:"Polite casual: collared shirt / dress",note:"Women: skirt only"},
  Thursday: {wear:"ACS Sport Shirt + black trousers",note:""},
  Friday:   {wear:"125th Anniversary St. Gabriel shirt + black trousers",note:""}
};
const DRESS_CODE_FALLBACK="No uniform or school shirt yet? Wear polite casual. Women: black skirt or black trousers.";
