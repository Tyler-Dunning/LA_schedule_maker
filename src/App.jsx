import { useState } from 'react'
import './App.css'

function App() {
  const [professors, setProfessors] = useState([["119B-1", "41200-41315"], ["119B-2", "41330-41445"], ["119B-3", "41500-41615"], ["119B-4", "31500-31745"], ["188-1", "11500-11745"], ["188-2", "11800-12045"], ["188-3", "11800-12045"], ["188-4", "21030-21145"], ["188-5", "21500-21745"], ["188-6", "21800-22045"], ["188-7", "31500-31745"], ["188-8", "31800-32045"], ["188-9", "31800-32045"], ["188-80", "11500-11745"], ["188-81", "21800-22045"], ["188-82", "41930-42045"]]);
  const [TA, setTA] = useState([["Armon", ["11800-12045", "21200-21500", "41200-41500", "11700-12359", "21700-22359", "31700-32359", "41700-42359"]], ["Rohin", ["11230-11615", "21030-21145", "21500-21745", "31230-31615", "41030-41745"]], ["Sagar", ["11030-11145", "11800-12045", "21330-21445", "31030-31145", "41330-41445"]], ["Anushka", ["11330-11445", "11800-12045", "21330-21430", "41330-42359", "21700-22359"]], ["Sarthak", ["11800-12045", "21330-21445", "21800-21915", "31030-31745", "40900-42000"]], ["Krishna", ["21030-21315", "21800-22045", "31500-31745", "41030-41315"]]]);

  const [fields, setFields] = useState(0);

  const [secName, setSecName] = useState("");
  const [secTime, setSecTime] = useState("");
  const [taName, setTAName] = useState("");
  const [removeTAField, setRemoveTA] = useState("");
  const [removeProfField, setRemoveProf] = useState("");

  const[taRestrictions, setRestrictions] = useState([]);

  const[assignedClasses, setClasses] = useState([]);


  const submitProfessor = () => {
    if(secName != "" && secTime != ""){
      const cur = [...professors];
      cur.push([secName, secTime]);
      setProfessors(cur);
      setSecName("");
      setSecTime("");
    }
  }

  const checkProfessor = () => {
    console.log(professors);
    console.log(TA);
    console.log(assignedClasses);
  }

  const removeTA = () => {
    for(let i = 0; i < TA.length; i++)
    {
      if(TA[i][0] == removeTAField)
      {
        TA.splice(i, 1);
      }
    }
    setRemoveProf(""); 
    setRemoveTA(""); 
  }
  const removeProfessor = () => {
    for(let i = 0; i < professors.length; i++)
    {
      if(professors[i][0] == removeProfField)
      {
        professors.splice(i, 1);
      }
    }
    setRemoveProf(""); 
  }


  const addTATimeField = () => {
    setFields(fields + 1);
  }

  const handleRestrictionsChange = (index, value) => {
    const newInputValues = [...taRestrictions];
    newInputValues[index] = value;
    setRestrictions(newInputValues);
  };

  const submitTA = () => {
    const cur = [...TA]
    cur.push([taName, taRestrictions])
    setTA(cur);
    setRestrictions(['']);
    setFields(0);
    setTAName('');
  }

  const calculateSchedule = () => {
    let numCoursesPerTA = [];
    for(let i = 0; i < TA.length; i++)
    {
      numCoursesPerTA.push(0);
    }
    for(let i = 0; i < professors.length; i++)
    {
      //Get the time of the class
      const time = professors[i][1];
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
          
          if(start <= end2 && end >= start2)
          {
            canDo[j] = false;
            break;
          }
        }
      }
      let index = -1;
      let min = 1000;
      for(let z = 0; z < canDo.length; z++)
      {
        if(canDo[z] == true)
        {
          if(numCoursesPerTA[z] < min)
          {
            index = z;
            min = numCoursesPerTA[z];
          }
        }
      }
      numCoursesPerTA[index]++;
      
      assignedClasses.push([professors[i][0], TA[index][0]]);
      
      const cur = [...TA];
      cur[index][1].push(time);
      setTA(cur);
    }
  }

  return (
    <>
      <div>
        <h1>Directions:</ h1>
        <h2>Times should be entered in military time with the numerical day of the week beforehand
          <br />
          For example, Thursday from 3:30 PM to 4:45 PM should be entered as 41530-41645
          <br />
          The preceding 4 comes from thursday being day number 4, 1530 and 1645 are 3:30 PM and 4:45 PM respectively in military time
        </h2>
        <h3>Enter the section name and the time of the section, in the format described above
          <br/>
          For each LA, enter their name and for each of their time restictions, create a field with the time they can not work.
          <br />
          To remove Sections or LA's, enter the LA or Section's name in the respective box and click the button.
          <br /><br />
          Click "Calculate" to display the final results, the final result will guarantee that there are no LA's assigned
          <br />
          to a section that overlaps with an unavailable time, however there is a chance that there will be slight discrepancies
          <br/>
          between the number of sections each LA receives. The best way to limit these errors is to input LA's with the most time restrictions first
        </h3>
        <ul>
          {assignedClasses.map(a => (
            <li>{"Section: " + a[0] + " with TA: " + a[1]}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Enter Professor Name/Section"
          value={secName}
          onChange={(e) => setSecName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Time for Professor's Class"
          value={secTime}
          onChange={(e) => setSecTime(e.target.value)}
        />
        <button onClick={() => submitProfessor()}>Add Section</button>
        <br/>
        <input
          type="text"
          placeholder="Enter TA Name"
          value={taName}
          onChange={(e) => setTAName(e.target.value)}
        />
        <br/>
        {Array.from({ length: fields}, (_, index) => (
        <input
          key={index}
          type="text"
          placeholder="Enter a Time Restriction"
          value={taRestrictions[index]}
          onChange={(e) => handleRestrictionsChange(index, e.target.value)}
        />
        ))}
      <br></br>
      <button onClick={() => addTATimeField()}>Add Time Restriction</button>
      <br/>
      <button onClick={() => submitTA()}>Add TA</button>
      <br/>
      <button onClick={() => calculateSchedule()}>Calculate</button>
      <br />
      <ul>
          {TA.map(a => (
            <li>{"TA Name:" + a[0] + " with Restrictions: " + a[1]}</li>
          ))}
        </ul>
      <br />
      <ul>
          {professors.map(a => (
            <li>{"Section Name:" + a[0] + " at Time : " + a[1]}</li>
          ))}
        </ul>
        <br />
        <input
          type="text"
          placeholder="Enter Section Index to Remove"
          value={removeProfField}
          onChange={(e) => setRemoveProf(e.target.value)}
        />
        <button onClick={() => removeProfessor()}>Remove Section</button>
        <br/>
        <input
          type="text"
          placeholder="Enter TA Index to Remove"
          value={removeTAField}
          onChange={(e) => setRemoveTA(e.target.value)}
        />
        <button onClick={() => removeTA()}>Remove TA</button>
        <br />
      </div>

    </>
  )
}

export default App
