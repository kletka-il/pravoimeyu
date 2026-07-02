export const ROLE = {
  CLIENT: "CLIENT",
  SPECIALIST: "SPECIALIST",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLE)[keyof typeof ROLE];

export const SPECIALIST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;
export type SpecialistStatus =
  (typeof SPECIALIST_STATUS)[keyof typeof SPECIALIST_STATUS];

export const BOOKING_STATUS = {
  NEW: "NEW",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED",
} as const;
export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  NEW: "Новая",
  ACCEPTED: "Принята",
  IN_PROGRESS: "В работе",
  CLOSED: "Закрыта",
  CANCELLED: "Отменена",
};

export const SPECIALIST_STATUS_LABEL: Record<SpecialistStatus, string> = {
  PENDING: "На модерации",
  APPROVED: "Подтверждён",
  REJECTED: "Отклонён",
  SUSPENDED: "Приостановлен",
};

// Базовый «стартовый» размер аудитории для соц. доказательства на главной.
// К нему прибавляется реальное число зарегистрированных пользователей,
// поэтому цифра честно растёт с каждой новой регистрацией. Отдельных
// («фейковых») записей в БД не создаём — это только display-показатель.
export const USERS_BASELINE = 1500;
