import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateNextReviewDate(level: number, isCorrect: boolean): Date {
  const now = new Date()
  
  if (!isCorrect) {
    // Nếu sai, quay về level 1
    return new Date(now.getTime() + 24 * 60 * 60 * 1000) // 1 ngày
  }
  
  // Nếu đúng, tăng level và tính ngày ôn tập tiếp theo
  const intervals = {
    1: 1,    // 1 ngày
    2: 3,    // 3 ngày
    3: 7,    // 1 tuần
    4: 14,   // 2 tuần
    5: 30,   // 1 tháng
    6: 60    // 2 tháng
  }
  
  const days = intervals[level as keyof typeof intervals] || 1
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
}

export function getLevelName(level: number): string {
  const levelNames = {
    1: "Mới học",
    2: "Đang học",
    3: "Thuộc cơ bản",
    4: "Thuộc tốt",
    5: "Thuộc rất tốt",
    6: "Thuộc hoàn toàn"
  }
  
  return levelNames[level as keyof typeof levelNames] || "Mới học"
} 