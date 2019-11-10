
export default function getETA(fromDate, cost, progress, rate) {
  if(rate <= 0 || (cost - progress) <= 0) {
    return null;//will never complete
  }

  const days = Math.ceil((cost - progress) / rate);

  //now add days to 'current date'
  const date = new Date(fromDate);
  date.setUTCHours(0, 0, 0, 0);//set to start of day
  date.setUTCDate(date.getUTCDate() + days);

  return date;
}
