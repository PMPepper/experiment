//still a little wobble in ETAs
export default function getResearchETA(fromDate, cost, progress, researchRate) {
  if(researchRate <= 0 || (cost - progress) <= 0) {
    return null;//research will never complete
  }

  const days = Math.ceil((cost - progress) / researchRate);

  //now add days to 'current date'
  const date = new Date(fromDate);
  date.setUTCHours(0, 0, 0, 0);//set to start of day
  date.setUTCDate(date.getUTCDate() + days);

  return date;
}
