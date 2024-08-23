import { useState } from 'react'
import './App.css'

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import * as XLSX from 'xlsx';

function App() {
  //["119B-1", "41200-41315"], ["119B-2", "41330-41445"], ["119B-3", "41500-41615"], ["119B-4", "31500-31745"], ["188-1", "11500-11745"], ["188-2", "11800-12045"], ["188-3", "11800-12045"], ["188-4", "21030-21145"], ["188-5", "21500-21745"], ["188-6", "21800-22045"], ["188-7", "31500-31745"], ["188-8", "31800-32045"], ["188-9", "31800-32045"], ["188-80", "11500-11745"], ["188-81", "21800-22045"], ["188-82", "41930-42045"]
  //["Armon", ["11800-12045", "21200-21500", "41200-41500", "11700-12359", "21700-22359", "31700-32359", "41700-42359"]], ["Rohin", ["11230-11615", "21030-21145", "21500-21745", "31230-31615", "41030-41745"]], ["Sagar", ["11030-11145", "11800-12045", "21330-21445", "31030-31145", "41330-41445"]], ["Anushka", ["11330-11445", "11800-12045", "21330-21430", "41330-42359", "21700-22359"]], ["Sarthak", ["11800-12045", "21330-21445", "21800-21915", "31030-31745", "40900-42000"]], ["Krishna", ["21030-21315", "21800-22045", "31500-31745", "41030-41315"]]
  const [errState, setErr] = useState("");
  const [pageState, setPage] = useState(0);
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const classDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Mon/Wed", "Tue/Thur"];
  
  const [professors, setProfessors] = useState([]);
  const [TA, setTA] = useState([]);
  const [profName, setProfName] = useState([]);
  const [classRooms, setClassRooms] = useState([]);

  const [fields, setFields] = useState(0);

  const [secName, setSecName] = useState("");
  const [secDay, setSecDay] = useState("Monday");
  const [secStartTime, setSecStartTime] = useState("10:30");
  const [secEndTime, setSecEndTime] = useState("11:45");
  const [profNameField, setProfNameField] = useState("");
  const [classRoomField, setClassRoomField] = useState("");

  const [taName, setTAName] = useState("");
  const [removeTAField, setRemoveTA] = useState("");
  const [removeProfField, setRemoveProf] = useState("");

  const[taRestrictions, setRestrictions] = useState([]);

  const[assignedClasses, setClasses] = useState([]);

  const [timeRestrictions, setTimeRestrictions] = useState([]);
  const [dayRestricitons, setDayRestrictions] = useState([]);


  const submitProfessor = () => {
    if(secName != "" && secStartTime != "" && secEndTime != "" && secDay != "" && profNameField != "" && classRoomField != ""){
      const cur = [...professors];
      const dayInt = (classDays.indexOf(secDay) + 1).toString()
      let temp =  dayInt + secStartTime + "-" + dayInt + secEndTime;
      temp = temp.replace(/:/g, '');
      cur.push([secName, temp]);
      setProfessors(cur);

      const cur2 = [...profName];
      cur2.push(profNameField);
      setProfName(cur2);

      const cur3 = [...classRooms];
      cur3.push(classRoomField);
      setClassRooms(cur3);

      setSecName("");
      setSecDay("Monday");
      setSecStartTime("10:30");
      setSecEndTime("11:45");
      setProfNameField("");
      setClassRoomField("");
    }
  }


  const removeTA = (index) => {
    const updatedTA = TA.filter((_, i) => i !== index);
    
    setTA(updatedTA);
  }

  const removeProfessor = (index) => {
    const updatedProfessors = professors.filter((_, i) => i !== index);
    const updatedProfName = profName.filter((_, i) => i !== index);
    const updatedClassRooms = classRooms.filter((_, i) => i !== index);
    
    setProfessors(updatedProfessors);
    setProfName(updatedProfName);
    setClassRooms(updatedClassRooms);
    
  }


  const addTATimeField = () => {
    setFields(fields + 1);
    const temp = [...timeRestrictions];
    temp.push(["10:30", "11:45"]);
    setTimeRestrictions(temp);
    const temp2 = [...dayRestricitons];
    temp2.push["Monday"];
    setDayRestrictions(temp2);
    }

  const handleTimeChange = (index, value, place) => {
    const newInputValues = [...timeRestrictions];
    newInputValues[index][place] = value;
    setTimeRestrictions(newInputValues);
  }

  const setDay = (index, value) => {
    const temp = [...dayRestricitons];
    temp[index] = value;
    setDayRestrictions(temp);

  }


  const submitTA = () => {
    if(taName == "")
    {
      return;
    }
    const cur = [...TA]
    //Convert times to old military
    const temp = [];
    for(let i = 0; i < timeRestrictions.length; i++)
    {
      let dayIndex = days.indexOf(dayRestricitons[i]) + 1;
      if(dayIndex <= 0)
      {
        dayIndex = 1;
      }
      let str = dayIndex.toString() + timeRestrictions[i][0] + "-" +  dayIndex.toString() + timeRestrictions[i][1];
      console.log(str);
      str = str.replace(/:/g, '');
      console.log(str);
      temp.push(str);
    }
    console.log("Temp: " + temp);
    cur.push([taName, temp])
    console.log("CUR:" + cur);
    setTA(cur);
    setTimeRestrictions([]);
    setFields(0);
    setTAName('');
    setDayRestrictions([]);
    console.log(TA);
  }

  const checkTime = () => {
    console.log(timeRestrictions);
  }

  const changePage = (val) => {
    setPage(pageState + val);
  }

  const calculateSchedule = () => {
    let numCoursesPerTA = [];
    for(let i = 0; i < TA.length; i++)
    {
      numCoursesPerTA.push(0);
    }
    for(let i = 0; i < professors.length; i++)
    {
      let isMW = false;
      let isTT = false;
      //Get the time of the class
      const time = professors[i][1];

      if(time[0] == '6')
      {
        isMW = true;
        console.log("MW");
      }
      else if(time[0] == '7')
      {
        isTT = true;
        console.log("MW");
      }
      const start = parseInt(time.substring(0, time.indexOf("-")));
      const end = parseInt(time.substring(time.indexOf("-") + 1));
      
      //Create a boolean array corresponding to each TA's availability for this class
      let canDo = [];

      //Loop through each TA
      for(let j = 0; j < TA.length; j++)
      {
        canDo.push(true);
        //Loop through each blocked off time the TA has, checking if any of them overlap the class
        for(let k = 0; k < TA[j][1].length; k++)
        {
          //Convert Times
          const time2 = TA[j][1][k];
          const start2 = parseInt(time2.substring(0, time2.indexOf("-")));
          const end2 = parseInt(time2.substring(time2.indexOf("-") + 1));
          
          if(isMW)
          {
            //Check Monday
            let modStart = (start % 10000) + 10000;
            let modEnd = (start % 10000) + 10000;
            if(modStart <= end2 && modEnd >= start2)
              {
                canDo[j] = false;
                break;
              }
            //Check Wednesday
            modStart = (modStart % 10000) + 30000;
            modEnd = (modEnd % 10000) + 30000;
            if(modStart <= end2 && modEnd >= start2)
              {
                canDo[j] = false;
                break;
              }
          }
          else if(isTT)
          {
            //Check Tuesday
            let modStart = (start % 10000) + 20000;
            let modEnd = (start % 10000) + 20000;
            if(modStart <= end2 && modEnd >= start2)
              {
                canDo[j] = false;
                break;
              }
            //Check Thurdsay
            modStart = (modStart % 10000) + 40000;
            modEnd = (modEnd % 10000) + 40000;
            if(modStart <= end2 && modEnd >= start2)
              {
                canDo[j] = false;
                break;
              }
          }
          else
          {
            if(start <= end2 && end >= start2)
              {
                canDo[j] = false;
                break;
              }
          }
        }
      }
      let index = -1;
      let min = 1000;
      let someoneCan = false;
      for(let z = 0; z < canDo.length; z++)
      {
        if(canDo[z] == true)
        {
          someoneCan = true;
          if(numCoursesPerTA[z] < min)
          {
            index = z;
            min = numCoursesPerTA[z];
          }
        }
      }
      if(!someoneCan)
      {
        setErr("One or more sections is unable to be filled by a TA. Please refresh the page and try again")

        return;
      }
      numCoursesPerTA[index]++;
      
      assignedClasses.push([professors[i][0], TA[index][0]]);
      
      if(isMW)
      {
        
        let modStart = (start % 10000) + 10000;
        let modEnd = (start % 10000) + 10000;
        let modStart2 = (start % 10000) + 30000;
        let modEnd2 = (start % 10000) + 30000;

        const cur = [...TA];
        cur[index][1].push(modStart.toString() + "-" + modEnd.toString());
        cur[index][1].push(modStart2.toString() + "-" + modEnd2.toString());
        setTA(cur);
      }
      else if (isTT)
      {
        let modStart = (start % 10000) + 20000;
        let modEnd = (start % 10000) + 20000;
        let modStart2 = (start % 10000) + 40000;
        let modEnd2 = (start % 10000) + 40000;

        const cur = [...TA];
        cur[index][1].push(modStart.toString() + "-" + modEnd.toString());
        cur[index][1].push(modStart2.toString() + "-" + modEnd2.toString());
        setTA(cur);
      }
      else
      {
        const cur = [...TA];
        cur[index][1].push(time);
        setTA(cur);

      }
    }
    const table = [["Section", "Professor", "Date", "Classroom", "Time", "TA"]];
    for(let i = 0; i < assignedClasses.length; i++)
    {
      const temp = [];
      //Section
      temp.push(assignedClasses[i][0]);
      //Professor
      temp.push(profName[i]);
      //Date
      const date = parseInt(professors[i][1][0]);
      temp.push(classDays[date]);
      //Classroom
      temp.push(classRooms[i]);
      //Time
      const time = professors[i][1];
      const [startTimeHere, endTimeHere] = time.split('-');
      const formattedStartTime = startTimeHere.slice(1, 3) + ':' + startTimeHere.slice(3);
      const formattedEndTime = endTimeHere.slice(1, 3) + ':' + endTimeHere.slice(3);
      temp.push(formattedStartTime + '-' + formattedEndTime);
      //TA Name
      temp.push(assignedClasses[i][1]);

      table.push(temp);
    }
    console.log(table);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(table);
  
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Generate a binary string and download the file
    XLSX.writeFile(wb, `Schedule.xlsx`);

  }

  return (
    <>
      <div>
        {pageState == 0 && 
        <div>
        <h1>Step 1</h1>
        <h4>Add all of the sections, make sure to fill out each field then press "Add Section."
        </h4>
        <br />
        <input
          type="text"
          placeholder="Enter Section Number"
          value={secName}
          onChange={(e) => setSecName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Professor Name"
          value={profNameField}
          onChange={(e) => setProfNameField(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Classroom Number"
          value={classRoomField}
          onChange={(e) => setClassRoomField(e.target.value)}
        />
        <br />
        <br />
        <select value={secDay} onChange={(e) => setSecDay(e.target.value)}>
          {classDays.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <TimePicker onChange={(e) => setSecStartTime(e)} value={secStartTime}></TimePicker>
        <TimePicker onChange={(e) => setSecEndTime(e)} value={secEndTime}>End Time</TimePicker>

        <ul>
          {professors.map((a, index) => (
            <li key={index}>{"Section Name: " + a[0]} <button className="xButton" onClick={() => removeProfessor(index)}> X </button></li>
          ))}
        </ul>
        <button onClick={() => submitProfessor()}>Add Section</button>
        <br/>
        <br/>
        </div>}
        {pageState == 1 &&
        <div>
        <h1>Step 2</h1>
        <h4>Enter all TA's and their restrictions. Click "Add Time Restriction" for each individual blocked off time.  
          <br /> Once name and all restricitons are entered, press "Add TA."
        </h4>
        <input
          type="text"
          placeholder="Enter TA Name"
          value={taName}
          onChange={(e) => setTAName(e.target.value)}
        />
        <br/>
        <br/>
        <button onClick={() => addTATimeField()}>Add Time Restriction</button>
        {Array.from({ length: fields}, (_, index) => (
        <div key={index}>
          <select value={dayRestricitons[index]} onChange={(e) => setDay(index, e.target.value)}>
              {days.map((option, index2) => (
                <option key={index2} value={option}>
                  {option}
                </option>
            ))}
          </select>
          <TimePicker key={1} onChange={(e) => handleTimeChange(index, e, 0)} value={timeRestrictions[index][0]}>Start Time</TimePicker>
          <TimePicker key={2} onChange={(e) => handleTimeChange(index, e, 1)} value={timeRestrictions[index][1]}>End Time</TimePicker>
          
        </div>
        ))}
      <br/>
      <br/>
      <button onClick={() => submitTA()}>Add TA</button>
      <br/>
      <ul>
          {TA.map((a, i) => (
            <li key={i}>{"TA Name:" + a[0] + " with " + a[1].length + " restrictions"} <button className="xButton" onClick={() => removeTA(i)}>X</button></li>
          ))}
        </ul>
      <br />
      </div> }
      {pageState == 2 &&
      <div> 
      <h1>Once all section and TA info is inputted, click this button to generate an Excel File</h1>
      <button onClick={() => calculateSchedule()}>Calculate and Download</button>
      {errState && <div style={{ color: 'red', fontWeight: 'bold' }}>{errState}</div>}
      <br />
      </div> }
      <br />

      {pageState >= 1 && <button onClick={() => changePage(-1)}>Previous Page</button>}
      {pageState < 2 &&<button onClick={() => changePage(1)}>Next Page</button>}

      </div>
    </>
  )
}

export default App
