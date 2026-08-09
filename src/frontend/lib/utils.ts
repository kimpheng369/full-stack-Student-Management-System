import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateGrade(assignment: number, quiz: number, midterm: number, finalExam: number) {
  // Weights: Assignment 20%, Quiz 20%, Midterm 30%, Final Exam 30%
  const total = Number(
    (
      (assignment * 0.2) +
      (quiz * 0.2) +
      (midterm * 0.3) +
      (finalExam * 0.3)
    ).toFixed(1)
  );

  let letterGrade = 'F';
  let gpa = 0.0;

  if (total >= 90) {
    letterGrade = 'A';
    gpa = 4.0;
  } else if (total >= 85) {
    letterGrade = 'A-';
    gpa = 3.7;
  } else if (total >= 80) {
    letterGrade = 'B+';
    gpa = 3.3;
  } else if (total >= 75) {
    letterGrade = 'B';
    gpa = 3.0;
  } else if (total >= 70) {
    letterGrade = 'B-';
    gpa = 2.7;
  } else if (total >= 65) {
    letterGrade = 'C+';
    gpa = 2.3;
  } else if (total >= 60) {
    letterGrade = 'C';
    gpa = 2.0;
  } else if (total >= 55) {
    letterGrade = 'D';
    gpa = 1.0;
  } else {
    letterGrade = 'F';
    gpa = 0.0;
  }

  const isPass = total >= 60;

  return {
    total,
    letterGrade,
    gpa,
    isPass,
  };
}

export function formatDate(dateStr: string | Date) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
