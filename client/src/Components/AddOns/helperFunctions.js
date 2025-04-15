export function todaysDate() {
  const today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10) { dd='0'+dd; };
  if(mm<10) { mm='0'+mm; };
  const todaysDate = yyyy + '-' + mm + '-' + dd;
  return todaysDate;
}