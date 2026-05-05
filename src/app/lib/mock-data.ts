import { Application, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    tckn: '12345678901',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@student.edu.tr',
    roles: ['student']
  },
  {
    id: '2',
    tckn: '98765432109',
    firstName: 'Mehmet',
    lastName: 'Demir',
    email: 'mehmet.demir@admin.edu.tr',
    roles: ['oidb']
  },
  {
    id: '3',
    tckn: '11111111111',
    firstName: 'Ayşe',
    lastName: 'Kaya',
    email: 'ayse.kaya@ydyo.edu.tr',
    roles: ['ydyo']
  },
  {
    id: '4',
    tckn: '22222222222',
    firstName: 'Fatma',
    lastName: 'Şahin',
    email: 'fatma.sahin@ygk.edu.tr',
    roles: ['ygk']
  },
  {
    id: '5',
    tckn: '33333333333',
    firstName: 'Ali',
    lastName: 'Öztürk',
    email: 'ali.ozturk@dean.edu.tr',
    roles: ['dean']
  },
  {
    id: '6',
    tckn: '44444444444',
    firstName: 'Zeynep',
    lastName: 'Yıldız',
    email: 'zeynep.yildiz@board.edu.tr',
    roles: ['board']
  }
];

export const mockApplications: Application[] = [
  {
    id: 'APP2025001',
    studentId: '1',
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
      { status: 'submitted', timestamp: new Date('2025-11-01T10:00:00'), actor: 'Ahmet Yılmaz' },
      { status: 'intake_verification', timestamp: new Date('2025-11-02T09:00:00'), actor: 'ÖİDB Officer' },
      { status: 'language_evaluation', timestamp: new Date('2025-11-03T14:00:00'), actor: 'YDYO' },
      { status: 'academic_evaluation', timestamp: new Date('2025-11-05T11:00:00'), actor: 'YGK' }
    ],
    languageStatus: 'successful',
    academicScore: 87.5,
    rank: 3
  },
  {
    id: 'APP2025002',
    studentId: '101',
    studentName: 'Elif Kara',
    tckn: '22233344455',
    currentProgram: 'Electrical Engineering - ODTÜ',
    targetProgram: 'Electrical Engineering',
    targetSemester: 5,
    gpa: 2.95,
    osymScore: 458.123,
    status: 'language_evaluation',
    submittedAt: new Date('2025-11-10'),
    documents: [
      {
        id: 'd4',
        type: 'transcript',
        fileName: 'APP2025002_Transcript_22233344455.pdf',
        uploadedAt: new Date('2025-11-10'),
        verified: true
      },
      {
        id: 'd4b',
        type: 'language_proof',
        fileName: 'APP2025002_Language_22233344455.pdf',
        uploadedAt: new Date('2025-11-10'),
        verified: false
      }
    ],
    timeline: [
      { status: 'submitted', timestamp: new Date('2025-11-10T15:30:00'), actor: 'Elif Kara' },
      { status: 'intake_verification', timestamp: new Date('2025-11-11T09:00:00'), actor: 'ÖİDB Officer' },
      { status: 'language_evaluation', timestamp: new Date('2025-11-12T10:00:00'), actor: 'ÖİDB Officer' }
    ]
  },
  {
    id: 'APP2025003',
    studentId: '1',
    studentName: 'Ahmet Yılmaz',
    tckn: '12345678901',
    currentProgram: 'Computer Engineering - Bilkent University',
    targetProgram: 'Industrial Engineering',
    targetSemester: 5,
    gpa: 3.72,
    osymScore: 492.567,
    status: 'approved',
    submittedAt: new Date('2025-10-25'),
    documents: [
      {
        id: 'd5',
        type: 'transcript',
        fileName: 'APP2025003_Transcript_12345678901.pdf',
        uploadedAt: new Date('2025-10-25'),
        verified: true
      },
      {
        id: 'd6',
        type: 'osym_result',
        fileName: 'APP2025003_OSYM_12345678901.pdf',
        uploadedAt: new Date('2025-10-25'),
        verified: true
      },
      {
        id: 'd7',
        type: 'language_proof',
        fileName: 'APP2025003_Language_12345678901.pdf',
        uploadedAt: new Date('2025-10-25'),
        verified: true
      }
    ],
    timeline: [
      { status: 'submitted', timestamp: new Date('2025-10-25T12:00:00'), actor: 'Ahmet Yılmaz' },
      { status: 'intake_verification', timestamp: new Date('2025-10-26T09:00:00'), actor: 'ÖİDB Officer' },
      { status: 'language_evaluation', timestamp: new Date('2025-10-27T10:00:00'), actor: 'YDYO' },
      { status: 'academic_evaluation', timestamp: new Date('2025-10-28T14:00:00'), actor: 'YGK' },
      { status: 'dean_review', timestamp: new Date('2025-10-30T09:00:00'), actor: "Dean's Office" },
      { status: 'board_review', timestamp: new Date('2025-11-01T10:00:00'), actor: 'Faculty Board' },
      { status: 'approved', timestamp: new Date('2025-11-05T16:00:00'), actor: 'Faculty Board' }
    ],
    languageStatus: 'successful',
    academicScore: 92.3,
    rank: 1,
    finalDecision: 'admitted'
  },
  {
    id: 'APP2025004',
    studentId: '102',
    studentName: 'Zeynep Kara',
    tckn: '33344455566',
    currentProgram: 'Computer Engineering - ITU',
    targetProgram: 'Computer Engineering',
    targetSemester: 3,
    gpa: 3.20,
    osymScore: 471.890,
    status: 'language_evaluation',
    submittedAt: new Date('2025-11-12'),
    documents: [
      {
        id: 'd8',
        type: 'transcript',
        fileName: 'APP2025004_Transcript_33344455566.pdf',
        uploadedAt: new Date('2025-11-12'),
        verified: true
      },
      {
        id: 'd9',
        type: 'language_proof',
        fileName: 'APP2025004_Language_33344455566.pdf',
        uploadedAt: new Date('2025-11-12'),
        verified: false
      }
    ],
    timeline: [
      { status: 'submitted', timestamp: new Date('2025-11-12T10:00:00'), actor: 'Zeynep Kara' },
      { status: 'intake_verification', timestamp: new Date('2025-11-13T09:00:00'), actor: 'ÖİDB Officer' },
      { status: 'language_evaluation', timestamp: new Date('2025-11-13T15:00:00'), actor: 'ÖİDB Officer' }
    ]
  }
];

export const departmentQuotas = {
  'Computer Engineering': { asil: 5, yedek: 3 },
  'Electrical Engineering': { asil: 4, yedek: 2 },
  'Industrial Engineering': { asil: 6, yedek: 4 },
  'Mechanical Engineering': { asil: 5, yedek: 3 }
};
