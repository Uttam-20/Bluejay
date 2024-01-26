const fs=require('fs');
const xlsx=require('xlsx');
const {DateTime}=require('luxon');
const { start } = require('repl');
function analyzepath(filepath){
    const employees=[];
    const workbook=xlsx.readFile(filepath);
    const sheetName=workbook.SheetNames[0];
    const sheet=workbook.Sheets[sheetName];
    const rows=xlsx.utils.sheet_to_json(sheet);
    for(const row of rows){
        const name=row['Employee Name'];
        const position=row['Position ID'];
        const t=DateTime.fromMillis(parseInt(row['Time']));
        const p=DateTime.fromMillis(parseInt(row['Time Out']));
       const startdate=t.toFormat('dd-MM-yyyy');
       const startTime=t.toFormat('HH:mm:ss');
       const enddate=p.toFormat('dd-MM-yyyy');
       const endTime=p.toFormat('HH:mm:ss');
       const k=row['Timecard Hours (as Time)'];
        const s1=k[0];
        const hoursworked=parseInt(s1);
       if(checkConsec(employees,name,startdate)){
        console.log(name+' with position ID '+position+' ','has shift for 7 conscutive days.');
       }
       if(1<hoursworked && hoursworked<10){
        console.log(name+' with position ID '+position+' ','has less than 10 hours between shifts');
       }
       if(hoursworked>14){
        console.log(name+' with position ID '+position+' '+'has worked for more than 14 hours in a single shift');
       }
       employees.push({name,startdate});
    }
}
function checkConsec(employees,name,startdate){
    let prevdate=startdate;
     var days=0;
    for(let employee of employees){
        let starterdate=employee.startdate;
        const s1=starterdate[0]+starterdate[1];
        const s2=prevdate[0]+prevdate[1];
        const diff=parseInt(s1)-parseInt(s2);
        if(employee.name===name && diff===1)
          {
            days++;
          }
          if(days===7)
           return true;
           if(employee.name===name && diff>1 && prevdate!=startdate)
           return false;
        prevdate=starterdate;
    }
   const s1=startdate[0]+startdate[1];
     const s2=prevdate[0]+prevdate[1];
    const diff=parseInt(s1)-parseInt(s2);
       if(diff===1 && days===6)
        return true;
  return false;
}
analyzepath('myfile.xls');