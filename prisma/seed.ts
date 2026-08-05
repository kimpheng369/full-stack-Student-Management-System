import { PrismaClient, Role, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with authentic Khmer names...');

  // Reset database tables
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // Password hashes
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const teacherPasswordHash = await bcrypt.hash('teacher123', 10);
  const studentPasswordHash = await bcrypt.hash('student123', 10);

  // 1. Create Admin User (Khmer Name)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Sovannara Chea (ជា សុវណ្ណារ៉ា)',
      email: 'admin@school.edu',
      password: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`👤 Created Khmer Admin: ${adminUser.name}`);

  // 2. Create Departments
  const deptData = [
    { name: 'Computer Science & Software (វិទ្យាសាស្ត្រកុំព្យូទ័រ)', code: 'CS' },
    { name: 'Business Administration (គ្រប់គ្រងពាណិជ្ជកម្ម)', code: 'BA' },
    { name: 'Electrical & Automation (វិស្វកម្មអគ្គិសនី)', code: 'EE' },
    { name: 'Mechanical Engineering (វិស្វកម្មមេកានិច)', code: 'ME' },
    { name: 'Health Sciences & Nursing (វិទ្យាសាស្ត្រសុខាភិបាល)', code: 'HS' },
  ];

  const departments = [];
  for (const d of deptData) {
    const created = await prisma.department.create({ data: d });
    departments.push(created);
  }
  console.log(`🏛️ Created ${departments.length} Departments.`);

  // 3. Create Classes
  const classData = [
    { className: 'CS-101 (Freshman)', year: 2026, deptIdx: 0 },
    { className: 'CS-201 (Sophomore)', year: 2025, deptIdx: 0 },
    { className: 'CS-301 (Junior)', year: 2024, deptIdx: 0 },
    { className: 'BA-101 (Freshman)', year: 2026, deptIdx: 1 },
    { className: 'BA-201 (Sophomore)', year: 2025, deptIdx: 1 },
    { className: 'EE-101 (Freshman)', year: 2026, deptIdx: 2 },
    { className: 'EE-201 (Sophomore)', year: 2025, deptIdx: 2 },
    { className: 'ME-101 (Freshman)', year: 2026, deptIdx: 3 },
    { className: 'ME-201 (Sophomore)', year: 2025, deptIdx: 3 },
    { className: 'HS-101 (Freshman)', year: 2026, deptIdx: 4 },
  ];

  const classes = [];
  for (const c of classData) {
    const created = await prisma.class.create({
      data: {
        className: c.className,
        year: c.year,
        departmentId: departments[c.deptIdx].id,
      },
    });
    classes.push(created);
  }
  console.log(`🏫 Created ${classes.length} Classes.`);

  // 4. Create 10 Teachers with authentic Khmer Names
  const teacherKhmerNames = [
    'Dr. Sokha Chan (ចាន់ សុខា)',
    'Prof. Bopha Heng (ហេង បុប្ផា)',
    'Dr. Sovann Chea (ជា សុវណ្ណ)',
    'Prof. Srey Nary Pich (ពេជ្រ ស្រីណារី)',
    'Dr. Dara Vong (វង្ស តារា)',
    'Prof. Rithy Keo (កែវ រិទ្ធី)',
    'Dr. Kosal Ung (អ៊ុង កុសល)',
    'Prof. Chanthou Meng (ម៉េង ច័ន្ទថូ)',
    'Dr. Veasna Sam (សំ វាសនា)',
    'Prof. Kunthea Tep (ទេព គន្ធា)'
  ];

  const teachers = [];
  for (let i = 0; i < 10; i++) {
    const email = `teacher${i + 1}@school.edu`;
    const user = await prisma.user.create({
      data: {
        name: teacherKhmerNames[i],
        email,
        password: teacherPasswordHash,
        role: Role.TEACHER,
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        teacherId: `TCH-2026-${(i + 1).toString().padStart(3, '0')}`,
        userId: user.id,
        name: teacherKhmerNames[i],
        email,
        phone: `+855 12 ${(200 + i).toString()}-${(100 + i).toString()}`,
        departmentId: departments[i % departments.length].id,
      },
    });
    teachers.push(teacher);
  }
  console.log(`👨‍🏫 Created ${teachers.length} Khmer Teachers.`);

  // 5. Create 20 Subjects
  const subjectList = [
    { name: 'Data Structures & Algorithms (រចនាសម្ព័ន្ធទិន្នន័យ)', code: 'CS201', deptIdx: 0 },
    { name: 'Web Application Development (ការអភិវឌ្ឍគេហទំព័រ)', code: 'CS302', deptIdx: 0 },
    { name: 'Database Management Systems (ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យ)', code: 'CS205', deptIdx: 0 },
    { name: 'Artificial Intelligence Basics (បច្ចេកវិទ្យាបញ្ញាសិប្បនិម្មិត)', code: 'CS401', deptIdx: 0 },

    { name: 'Principles of Marketing (គោលការណ៍ទីផ្សារ)', code: 'BA102', deptIdx: 1 },
    { name: 'Financial Accounting (គណនេយ្យហិរញ្ញវត្ថុ)', code: 'BA201', deptIdx: 1 },
    { name: 'Organizational Behavior (ប្រព្រឹត្តិកម្មអង្គភាព)', code: 'BA304', deptIdx: 1 },
    { name: 'Corporate Finance (ហិរញ្ញវត្ថុសហគ្រាស)', code: 'BA310', deptIdx: 1 },

    { name: 'Circuit Analysis (ការវិភាគសៀគ្វី)', code: 'EE101', deptIdx: 2 },
    { name: 'Digital Logic Design (ការរចនាតក្កវិទ្យាឌីជីថល)', code: 'EE202', deptIdx: 2 },
    { name: 'Signals and Systems (សញ្ញានិងប្រព័ន្ធ)', code: 'EE303', deptIdx: 2 },
    { name: 'Electromagnetics (អគ្គិសនីម៉ាញេទិច)', code: 'EE308', deptIdx: 2 },

    { name: 'Engineering Statics (ស្តាទិចវិស្វកម្ម)', code: 'ME101', deptIdx: 3 },
    { name: 'Thermodynamics I (ទែម៉ូឌីណាមិច I)', code: 'ME203', deptIdx: 3 },
    { name: 'Fluid Mechanics (មេកានិចរាវ)', code: 'ME301', deptIdx: 3 },
    { name: 'Heat Transfer (ការផ្ទេរកំដៅ)', code: 'ME305', deptIdx: 3 },

    { name: 'Human Anatomy & Physiology (កាយវិភាគសាស្ត្រមនុស្ស)', code: 'HS101', deptIdx: 4 },
    { name: 'Introduction to Public Health (សុខភាពសាធារណៈ)', code: 'HS202', deptIdx: 4 },
    { name: 'Medical Terminology (ពាក្យបច្ចេកទេសវេជ្ជសាស្ត្រ)', code: 'HS105', deptIdx: 4 },
    { name: 'Biostatistics (ជីវសถិតិ)', code: 'HS301', deptIdx: 4 },
  ];

  const subjects = [];
  for (let i = 0; i < subjectList.length; i++) {
    const s = subjectList[i];
    const created = await prisma.subject.create({
      data: {
        subjectName: s.name,
        code: s.code,
        departmentId: departments[s.deptIdx].id,
        teacherId: teachers[i % teachers.length].id,
      },
    });
    subjects.push(created);
  }
  console.log(`📚 Created ${subjects.length} Subjects.`);

  // 6. Create 100 Students with Khmer First Names & Surnames
  const khmerFirstNames = [
    'Sokha', 'Bopha', 'Dara', 'Sovann', 'Srey', 'Rithy', 'Chanthou', 'Veasna', 'Kunthea', 'Pich',
    'Kosal', 'Sophal', 'Meng', 'Vandy', 'Vireak', 'Sreysor', 'Narith', 'Visal', 'Makara', 'Bora',
    'Sothea', 'Rathana', 'Phalla', 'Khemara', 'Sarith', 'Sambath', 'Channary', 'Sophea', 'Bunna', 'Mony'
  ];

  const khmerSurnames = [
    'Chan', 'Heng', 'Chea', 'Keo', 'Ung', 'Meng', 'Sam', 'Tep', 'Vong', 'Khuon',
    'Lim', 'Nguon', 'Kong', 'Ly', 'San', 'Ouk', 'Ros', 'Chhay', 'Kim', 'Prom',
    'Chhim', 'Soeun', 'Meas', 'Khun', 'Hem', 'Pen', 'Mao', 'Sar', 'Thorn', 'Yem'
  ];

  const khmerStreets = ['Norodom Blvd', 'Monivong Blvd', 'Kampuchea Krom Blvd', 'Sihanouk Blvd', 'Charles de Gaulle Blvd', 'Street 271', 'Street 63', 'Street 51'];
  const khmerCities = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampot', 'Kandal', 'Kampong Cham', 'Takeo'];

  const students = [];
  for (let i = 0; i < 100; i++) {
    const fName = khmerFirstNames[i % khmerFirstNames.length];
    const lName = khmerSurnames[(i * 3) % khmerSurnames.length];
    const gender = i % 2 === 0 ? 'Male' : 'Female';
    const email = `student${i + 1}@school.edu`;
    const studentId = `STU-2026-${(i + 1).toString().padStart(4, '0')}`;
    const targetClass = classes[i % classes.length];
    const targetDeptId = targetClass.departmentId;

    const fullName = `${lName} ${fName}`; // In Cambodia, Surname comes first

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: studentPasswordHash,
        role: Role.STUDENT,
      },
    });

    const student = await prisma.student.create({
      data: {
        studentId,
        userId: user.id,
        firstName: fName,
        lastName: lName,
        gender,
        birthday: `200${(i % 5) + 2}-0${(i % 9) + 1}-15`,
        phone: `+855 12 ${(300 + i).toString()}-${(1000 + i).toString()}`,
        email,
        address: `#${10 + i}, ${khmerStreets[i % khmerStreets.length]}, ${khmerCities[i % khmerCities.length]}, Cambodia`,
        avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567) % 100000000}?auto=format&fit=crop&w=250&q=80`,
        departmentId: targetDeptId,
        classId: targetClass.id,
      },
    });
    students.push(student);
  }
  console.log(`🎓 Created ${students.length} Khmer Students.`);

  // 7. Create Attendance Records
  console.log('📅 Generating Attendance Records...');
  const attendanceStatuses = [
    AttendanceStatus.PRESENT,
    AttendanceStatus.PRESENT,
    AttendanceStatus.PRESENT,
    AttendanceStatus.PRESENT,
    AttendanceStatus.LATE,
    AttendanceStatus.ABSENT,
    AttendanceStatus.EXCUSED,
  ];

  const today = new Date();
  let totalAttendanceCount = 0;

  for (let i = 0; i < 30; i++) {
    const student = students[i];
    const deptSubjects = subjects.filter(s => s.departmentId === student.departmentId);

    for (const subj of deptSubjects) {
      for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOffset);
        date.setHours(9, 0, 0, 0);

        const status = attendanceStatuses[(i + dayOffset + subj.subjectName.length) % attendanceStatuses.length];

        await prisma.attendance.create({
          data: {
            studentId: student.id,
            subjectId: subj.id,
            date,
            status,
          },
        });
        totalAttendanceCount++;
      }
    }
  }
  console.log(`✅ Generated ${totalAttendanceCount} Attendance Records.`);

  // 8. Create Grade Records
  console.log('📊 Generating Grade Records...');
  let totalGradeCount = 0;

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const deptSubjects = subjects.filter(s => s.departmentId === student.departmentId);

    for (const subj of deptSubjects) {
      const assignment = Number((70 + (i * 7 + subj.code.length) % 30).toFixed(1));
      const quiz = Number((65 + (i * 5 + subj.code.length) % 35).toFixed(1));
      const midterm = Number((60 + (i * 11 + subj.code.length) % 40).toFixed(1));
      const finalExam = Number((65 + (i * 13 + subj.code.length) % 35).toFixed(1));

      const total = Number(((assignment * 0.2) + (quiz * 0.2) + (midterm * 0.3) + (finalExam * 0.3)).toFixed(1));

      let letterGrade = 'F';
      let gpa = 0.0;
      if (total >= 90) { letterGrade = 'A'; gpa = 4.0; }
      else if (total >= 85) { letterGrade = 'A-'; gpa = 3.7; }
      else if (total >= 80) { letterGrade = 'B+'; gpa = 3.3; }
      else if (total >= 75) { letterGrade = 'B'; gpa = 3.0; }
      else if (total >= 70) { letterGrade = 'B-'; gpa = 2.7; }
      else if (total >= 65) { letterGrade = 'C+'; gpa = 2.3; }
      else if (total >= 60) { letterGrade = 'C'; gpa = 2.0; }
      else if (total >= 55) { letterGrade = 'D'; gpa = 1.0; }

      await prisma.grade.create({
        data: {
          studentId: student.id,
          subjectId: subj.id,
          assignment,
          quiz,
          midterm,
          finalExam,
          total,
          letterGrade,
          gpa,
        },
      });
      totalGradeCount++;
    }
  }
  console.log(`✅ Generated ${totalGradeCount} Khmer Grade Records.`);

  console.log('🎉 Seed process completed successfully!');
  console.log('\n--- Login Credentials ---');
  console.log('🔑 Admin:   email: admin@school.edu   | password: admin123');
  console.log('🔑 Teacher: email: teacher1@school.edu | password: teacher123');
  console.log('🔑 Student: email: student1@school.edu | password: student123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
