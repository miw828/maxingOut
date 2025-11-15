
export interface Profile {
  hobbies: string;
  enjoys: string;
  major: string;
  minor: string;
  goals: string;
}

export interface ClubRecommendation {
  clubName: string;
  reason: string;
}

export interface User {
  email: string;
  password?: string; // Stored only on registration, not retrieved
  profile?: Profile;
  recommendations?: ClubRecommendation[];
}

export interface Review {
  id: string;
  professor: string;
  courseLoad: string;
  hasExam: boolean;
  isAttendanceMandatory: boolean;
  rating: number; // 1 to 5
}

export interface Course {
  id: string;
  name: string;
  code: string;
  reviews: Review[];
}

export enum AuthView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  COURSE_CATALOG = 'COURSE_CATALOG',
}
