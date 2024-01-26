import { padTo2Digits } from '.';

const daysInAlienMonths = [44, 42, 48, 40, 48, 44, 40, 44, 42, 40, 40, 42, 44, 48, 42, 40, 44, 38];
const alienBaseSecond = 90;
const alienBaseMinute = 90;
const alienBaseHour = 36;
const alienBaseMouth = 18;
const alienTotalDays = daysInAlienMonths.reduce(function (acr, cur) {
  return acr + cur;
}, 0);
const alienEpochYear = 2804;
const alienEpochSecond = 88;
const alienEpochMinute = 2;
const alientEpochHour = 2;
const alientEpochDay = 31;
const alientEpochMonth = 18;
const alientHourTotalSeconds = alienBaseMinute * alienBaseSecond;
const alientDayTotalSeconds = alienBaseHour * alienBaseMinute * alienBaseSecond;
const alienYearTotalSeconds = alienTotalDays * alientDayTotalSeconds;
const alienBaseMonthTotalSeconds =
  daysInAlienMonths.slice(0, alientEpochMonth - 1).reduce((acc, cur) => acc + cur, 0) *
  alientDayTotalSeconds;
const alienBaseDayTotalSeconds = alientEpochDay * alientDayTotalSeconds;
const alienBaseHourTotalSeconds = alientEpochHour * alientHourTotalSeconds;
const alienBaseMinuteTotalSeconds = alienEpochMinute * alienBaseSecond;
const alienBaseTotalSeconds =
  alienBaseMonthTotalSeconds +
  alienBaseDayTotalSeconds +
  alienBaseHourTotalSeconds +
  alienBaseMinuteTotalSeconds +
  alienEpochSecond;

type AlienTime = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function earthTimeToAlienTime(): AlienTime {
  // UTC+8 timezone '1970-01-01T08:00:00'
  const earthTime = Math.floor(new Date().getTime() / 500);
  const alienTime = earthTime + alienBaseTotalSeconds;
  const year = Math.floor(alienTime / alienYearTotalSeconds);
  let day = Math.floor((alienTime % alienYearTotalSeconds) / alientDayTotalSeconds);
  let month = 1;
  for (let i = 0; i < daysInAlienMonths.length; i++) {
    if (day - daysInAlienMonths[i] > 0) {
      month += 1;
      day -= daysInAlienMonths[i];
    } else {
      break;
    }
  }
  const hour = Math.floor(
    ((alienTime % alienYearTotalSeconds) % alientDayTotalSeconds) / alientHourTotalSeconds,
  );
  const minute = Math.floor(
    (((alienTime % alienYearTotalSeconds) % alientDayTotalSeconds) % alientHourTotalSeconds) /
      alienBaseMinute,
  );
  const second =
    (((alienTime % alienYearTotalSeconds) % alientDayTotalSeconds) % alientHourTotalSeconds) %
    alienBaseMinute;

  return {
    year: year + alienEpochYear,
    month: month,
    day: day,
    hours: hour,
    minutes: minute,
    seconds: second,
  };
}

function alienTimeToEarthTime(alienTime: AlienTime) {
  const alienSeconds =
    (alienTime.year - alienEpochYear) * alienYearTotalSeconds +
    daysInAlienMonths.slice(0, alienTime.month - 1).reduce((acc, cur) => acc + cur, 0) *
      alientDayTotalSeconds +
    alienTime.day * alientDayTotalSeconds +
    alienTime.hours * alientHourTotalSeconds +
    alienTime.minutes * alienBaseSecond +
    alienTime.seconds;
  const earthTimeMilliseconds = (alienSeconds - alienBaseTotalSeconds) * 500;

  const earthTime = new Date(earthTimeMilliseconds);
  // Adjust to UTC+8 timezone
  // earthTime.setHours(earthTime.getHours() - 8);
  // console.log(earthTime.toLocaleString())

  return earthTime;
}

function formatAlienDate({ year, month, day, hours, minutes, seconds }: AlienTime) {
  return {
    date: `${year}-${padTo2Digits(month)}-${padTo2Digits(day)}`,
    time: `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`,
  };
}

export { alienTimeToEarthTime, earthTimeToAlienTime, formatAlienDate };
