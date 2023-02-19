import { useState, useEffect } from 'react';
import Header from "./Header";

function App() {
 
  // States for registration
  const [enteredfirstname, setfirstname] = useState('');
  const [enteredlastname, setlastname] = useState('');
  const [enteredemail, setEmail] = useState('');
  const [enteredphonenumber, setphonenumber] = useState('');
  const [enteredsupervisor, setsupervisor] = useState(''); 
  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [supervisorslist, setsupervisorslist] = useState([]);
 
  //Get list of supervisors
  const getsupervisors = async () => {
    fetch("/api/supervisors", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.json())
    .then((res) => {
      setsupervisorslist(res);
    });
  };

  const sendinfo = async () => {
    const payload = {
      firstName: enteredfirstname,
      lastName: enteredlastname,
      email: enteredemail,
      phoneNumber: enteredphonenumber,
      Supervisor: enteredsupervisor,
    }
    fetch('/api/submit', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    .then((res) => {
      if(res === "Please enter a valid First name") {
        console.log("Please enter a valid First name");
      }
      else if(res === "Please enter a valid Last name") {
        console.log("Please enter a valid Last name");
      }
      else if(res === "Please enter a valid email") {
        console.log("Please enter a valid email");
      }
      else if(res === "Please enter a valid phone number") {
        console.log("Please enter a valid phone number");
      }
    })
  };


  useEffect(() => {
    getsupervisors();
  }, []);

  // Handling the firstname change
  const handlefirstname = (e) => {
    setfirstname(e.target.value);
    setSubmitted(false);
  };
 
  // Handling the lastname change
  const handlelastname = (e) => {
    setlastname(e.target.value);
    setSubmitted(false);
  };
 
  // Handling the email change
  const handleemail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };

  // Handling the phonenumber change
  const handlephonenumber = (e) => {
    setphonenumber(e.target.value);
    setSubmitted(false);
  };

  // Handling the supervisor change
  const handlesupervisor = (e) => {
    setsupervisor(e.target.value);
    setSubmitted(false);
  };

  const setEmpty = () => {
    setfirstname('');
    setlastname('');
    setEmail('');
    setphonenumber('');
    setsupervisor(''); 
  };

  // Handling the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    //TODO add blank supervisor check
    if (enteredfirstname === '' || enteredlastname === '' || enteredsupervisor === '') {
      setError(true);
    } 
    else if(/[^a-zA-Z]/.test(enteredfirstname)) {
      setError(true);
    }
    else if(/[^a-zA-Z]/.test(enteredlastname)) {
      setError(true);
    }
    else if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi.test(enteredemail) && enteredemail != '') {
      setError(true);
    }
    else if(!/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(enteredphonenumber) && enteredphonenumber != '') {
      setError(true);
    }
    else {
      sendinfo();
      setSubmitted(true);
      setError(false);
      setEmpty();
    }
  };
 
  // Showing success message
  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
        <h1>User {enteredfirstname} {enteredlastname} successfully notified</h1>
      </div>
    );
  };
 
  // Showing error message if error is true
  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h1>Please check input again</h1>
      </div>
    );
  };
 
  return (
    <div className="form">
      <Header></Header>
      {/* Calling to the methods */}
      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>
 
      <form>
        {/* Labels and inputs for form data */}
        <label className="label">FirstName</label>
        <input onChange={handlefirstname} className="input"
          value={enteredfirstname} type="text" />
        <label className="label">LastName</label>
        <input onChange={handlelastname} className="input"
          value={enteredlastname} type="text" />
        <label>Select your supervisor:
        <select onChange={handlesupervisor}> {
          supervisorslist.map(item=> {
            return (<option key={item} value = {item}>{item}</option>)
          })
        }</select>
        </label>
      <div>
        <h1>How would you like to be notified?</h1>
      </div>
        <label className="label">Email</label>
        <input onChange={handleemail} className="input"
          value={enteredemail} type="email" />
        <label className="label">Phone Number</label>
        <input onChange={handlephonenumber} className="input"
          value={enteredphonenumber} type="phonenumberl" />
        <button onClick={handleSubmit} className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );

}

export default App