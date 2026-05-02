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
