import { padNumber } from './pad';

export const formatDateTime = (date) => (
  `${formatDate(date)} ${formatTime(date)}`
);
export const formatDate = (date) => (
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`
);
export const formatTime = (date) => (
  `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`
);
