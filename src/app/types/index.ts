export type UserRole = 
  | 'student' 
  | 'oidb' 
  | 'ydyo' 
  | 'ygk' 
  | 'dean' 
  | 'board' 
  | 'admin';

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'intake_verification'
  | 'returned_for_correction'
  | 'language_evaluation'
  | 'academic_evaluation'
  | 'dean_review'
  | 'board_review'
  | 'approved'
  | 'rejected'
  | 'waitlisted';

export interface User {
  id: string;
  tckn: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  tckn: string;
  currentProgram: string;
  targetProgram: string;
  targetSemester: 3 | 5;
  gpa: number;
  osymScore: number;
  status: ApplicationStatus;
  submittedAt?: Date;
  documents: ApplicationDocument[];
  timeline: TimelineEvent[];
  languageStatus?: 'pending' | 'successful' | 'unsuccessful' | 'exempt';
  academicScore?: number;
  rank?: number;
  finalDecision?: 'admitted' | 'waitlisted' | 'rejected';
  waitlistRank?: number;
  returnReasons?: string[];
  appealText?: string;
  appealStatus?: 'pending' | 'approved' | 'rejected';
}

export interface ApplicationDocument {
  id: string;
  type: 'transcript' | 'osym_result' | 'curriculum' | 'student_certificate' | 'language_proof' | 'course_contents';
  fileName: string;
  uploadedAt: Date;
  verified: boolean;
  url?: string;
}

export interface TimelineEvent {
  status: ApplicationStatus;
  timestamp: Date;
  actor?: string;
  note?: string;
}

export interface IntibakEntry {
  previousCourse: string;
  previousCredit: number;
  equivalentCourse: string;
  equivalentCredit: number;
  status: 'approved' | 'rejected' | 'pending';
}
