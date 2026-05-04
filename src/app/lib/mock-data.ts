import { Application, User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    tckn: '12345678901',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@university.edu.tr',
    roles: ['student']
  },
  {
    id: 'u2',
    tckn: '98765432109',
    firstName: 'Ayşe',
    lastName: 'Demir',
    email: 'ayse.demir@university.edu.tr',
    roles: ['oidb']
  },
  {
    id: 'u3',
    tckn: '11122233344',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    email: 'mehmet.kaya@university.edu.tr',
    roles: ['ydyo']
  },
  {
    id: 'u4',
    tckn: '55566677788',
    firstName: 'Fatma',
    lastName: 'Öztürk',
    email: 'fatma.ozturk@university.edu.tr',
    roles: ['ygk']
  },
  {
    id: 'u5',
    tckn: '99988877766',
    firstName: 'Ali',
    lastName: 'Şahin',
    email: 'ali.sahin@university.edu.tr',
    roles: ['dean']
  },
  {
    id: 'u6',
    tckn: '44433322211',
    firstName: 'Zeynep',
    lastName: 'Arslan',
    email: 'zeynep.arslan@university.edu.tr',
    roles: ['board']
  },
  {
    id: 'u7',
    tckn: '11111111111',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@university.edu.tr',
    roles: ['admin']
  }
];

export const mockApplications: Application[] = [
  {
    id: 'APP2025001',
    studentId: 'u1',
    studentName: 'Ahmet Yılmaz',
    tckn: '12345678901',
    currentProgram: 'Computer Engineering - Bilkent University',
    targetProgram: 'Computer Engineering',
    targetSemester: 3,
    gpa: 3.45,
    osymScore: 485.234,
    status: 'academic_evaluation',
    submittedAt: new Date('2025-11-01'),
    documents: [
      {
        id: 'd1',
        type: 'transcript',
        fileName: 'APP2025001_Transcript_12345678901.pdf',
        uploadedAt: new Date('2025-11-01'),
        verified: true
      },
      {
        id: 'd2',
        type: 'osym_result',
        fileName: 'APP2025001_OSYM_12345678901.pdf',
        uploadedAt: new Date('2025-11-01'),
        verified: true
      },
      {
        id: 'd3',
        type: 'language_proof',
        fileName: 'APP2025001_Language_12345678901.pdf',
        uploadedAt: new Date('2025-11-01'),
        verified: true
      }
    ],
    timeline: [
      {
        status: 'submitted',
        timestamp: new Date('2025-11-01T10:00:00'),
        actor: 'Ahmet Yılmaz'
      },
      {
        status: 'intake_verification',
        timestamp: new Date('2025-11-02T09:00:00'),
        actor: 'ÖİDB Officer'
      },
      {
        status: 'language_evaluation',
        timestamp: new Date('2025-11-03T14:00:00'),
        actor: 'YDYO'
      },
      {
        status: 'academic_evaluation',
        timestamp: new Date('2025-11-05T11:00:00'),
        actor: 'YGK'
      }
    ],
    languageStatus: 'successful',
    academicScore: 87.5,
    rank: 3
  },
  {
    id: 'APP2025002',
    studentId: 'u1',
    studentName: 'Elif Kara',
    tckn: '22233344455',
    currentProgram: 'Electrical Engineering - ODTÜ',
    targetProgram: 'Electrical Engineering',
    targetSemester: 5,
    gpa: 2.95,
    osymScore: 458.123,
    status: 'intake_verification',
    submittedAt: new Date('2025-11-10'),
    documents: [
      {
        id: 'd4',
        type: 'transcript',
        fileName: 'APP2025002_Transcript_22233344455.pdf',
        uploadedAt: new Date('2025-11-10'),
        verified: false
      }
    ],
    timeline: [
      {
        status: 'submitted',
        timestamp: new Date('2025-11-10T15:30:00'),
        actor: 'Elif Kara'
      },
      {
        status: 'intake_verification',
        timestamp: new Date('2025-11-11T09:00:00'),
        actor: 'ÖİDB Officer'
      }
    ]
  },
  {
    id: 'APP2025003',
    studentId: 'u1',
    studentName: 'Can Yıldız',
    tckn: '66677788899',
    currentProgram: 'Industrial Engineering - Koç University',
    targetProgram: 'Industrial Engineering',
    targetSemester: 3,
    gpa: 3.72,
    osymScore: 492.567,
    status: 'approved',
    submittedAt: new Date('2025-10-25'),
    documents: [
      {
        id: 'd5',
        type: 'transcript',
        fileName: 'APP2025003_Transcript_66677788899.pdf',
        uploadedAt: new Date('2025-10-25'),
        verified: true
      },
      {
        id: 'd6',
        type: 'osym_result',
        fileName: 'APP2025003_OSYM_66677788899.pdf',
        uploadedAt: new Date('2025-10-25'),
        verified: true
      },
      {
        id: 'd7',
        type: 'language_proof',
        fileName: 'APP2025003_Language_66677788899.pdf',
        uploadedAt: new Date('2025-10-25'),
        verified: true
      }
    ],
    timeline: [
      {
        status: 'submitted',
        timestamp: new Date('2025-10-25T12:00:00'),
        actor: 'Can Yıldız'
      },
      {
        status: 'intake_verification',
        timestamp: new Date('2025-10-26T09:00:00'),
        actor: 'ÖİDB Officer'
      },
      {
        status: 'language_evaluation',
        timestamp: new Date('2025-10-27T10:00:00'),
        actor: 'YDYO'
      },
      {
        status: 'academic_evaluation',
        timestamp: new Date('2025-10-28T14:00:00'),
        actor: 'YGK'
      },
      {
        status: 'dean_review',
        timestamp: new Date('2025-10-30T09:00:00'),
        actor: "Dean's Office"
      },
      {
        status: 'board_review',
        timestamp: new Date('2025-11-01T10:00:00'),
        actor: 'Faculty Board'
      },
      {
        status: 'approved',
        timestamp: new Date('2025-11-05T16:00:00'),
        actor: 'Faculty Board'
      }
    ],
    languageStatus: 'successful',
    academicScore: 92.3,
    rank: 1,
    finalDecision: 'admitted'
  }
];

export const departmentQuotas = {
  'Computer Engineering': { asil: 5, yedek: 3 },
  'Electrical Engineering': { asil: 4, yedek: 2 },
  'Industrial Engineering': { asil: 6, yedek: 4 },
  'Mechanical Engineering': { asil: 5, yedek: 3 }
};
