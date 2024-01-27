import { ZodError } from 'zod';

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const formatEarthDate = (date: Date) => {
  return (
    [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(
      '-',
    ) +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
};

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError) => {
  const { issues } = error;
  if (issues.length) {
    const currentIssue = issues[0];
    const { path, message } = currentIssue;
    const pathString = path.join('.');

    return `${pathString}: ${message}`;
  }
};
