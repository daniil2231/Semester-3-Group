import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import validation from "../Validation";
import { useNavigate } from "react-router-dom";
import AccountService from "../services/AccountService";

export default function CreateMeeting(props) {
  let navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availableEndTimes, setAvailableEndTimes] = useState([]);

  //this needs to be replaced by get method
  const initialMeetings = [
    {
      id: 1,
      // dateTime: "2022-11-17T11:00",
      dateTime: "2023-01-18",
    },
    {
      id: 2,
      // dateTime: "2022-11-15T11:30",
      dateTime: "2023-01-19",
    },
    {
      id: 3,
      // dateTime: "2022-11-17T12:00",
      dateTime: "2023-01-20",
    },
    {
      id: 4,
      // dateTime: "2022-11-21T12:30",
      dateTime: "2023-01-21",
    },
    {
      id: 5,
      // dateTime: "2022-11-21T13:00",
      dateTime: "2023-01-22",
    },
    {
      id: 6,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-23",
    },
    {
      id: 7,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-24",
    },
    {
      id: 8,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-25",
    },
    {
      id: 9,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-26",
    },
    {
      id: 10,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-27",
    },
    {
      id: 11,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-28",
    },
    {
      id: 12,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-29",
    },
    {
      id: 13,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-30",
    },
    {
      id: 14,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-01-31",
    },
    {
      id: 15,
      // dateTime: "2022-12-21T13:00",
      dateTime: "2023-02-16",
    },
  ];
  const [startDate, setStartDate] = useState(new Date());
  const [datesExpectedValues, setDatesExpectedValues] = useState([]);
  let myArray = []; //here i store dates for calendar

  useEffect(() => {
    filterData();
  }, [filters]);

  //Axios get timeslots
  async function filterData() {
    axios
      .get(
        "http://localhost:8080/appointment/",
        {
          params: {
            id: filters.id, //employeeID!!
            year: filters.year,
            month: filters.month,
            day: filters.day,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response) {
        setAvailableTimeSlots(response.data.timeSlots);
        console.log("timeslots:" + response.data.timeSlots);
      });
  }

  async function getEndTimes(data) {
    axios
      .get(
        "http://localhost:8080/appointment/endTimeSlots",
        {
          params: {
            hour: data.substring(0, 2),
            minutes: data.split(":")[1],
            id: filters.id, //employee id
            year: filters.year,
            month: filters.month,
            day: filters.day,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response) {
        setAvailableEndTimes(response.data.timeSlots);
        console.log("timeslots:" + response.data.timeSlots);
      });
  }

  useEffect(() => {
    convertToExpectedValues();
  });

  const [availableMeetings, setAvailableMeetings] = useState(initialMeetings);

  //this one converts retrieved dates to expected value so we can see them in calendar
  const convertToExpectedValues = () => {
    for (let day of initialMeetings) {
      myArray.push(addDays(new Date(day.dateTime), 0));
    }
    return setDatesExpectedValues(myArray);
  };
  const [meeting, setMeeting] = useState({
    byCar: false,
  });

  //filters the meetings by date selected
  useEffect(() => {
    retrieveFilteredMeetings();
  }, [meeting.dateForFiltering]);

  const retrieveFilteredMeetings = () => {
    const filtered = initialMeetings.filter((input) =>
      Object.values(input).some(
        (val) =>
          typeof val === "string" && val.includes(meeting.dateForFiltering)
      )
    );
    setAvailableMeetings(filtered);
  };

  const [employeesName, setEmployeesName] = useState("");
  const [employees, setEmployees] = useState([]); //needs to be changed for axios
  const [checked, setChecked] = useState(false);
  const handleClick = () => setChecked(!checked);

  //thanks to this method we can search through employees on every change in input
  useEffect(() => {
    if (employeesName !== "") {
      document.getElementById("dropdown").style.display = "block";
      getEmployeesByLastName(employeesName);
      console.log(employees);
    } else {
      document.getElementById("dropdown").style.display = "none";
    }
  }, [employeesName]);

  //Sets actual date and time of the meeting
  const pickAvailableMeeting = (availableTimeSlot) => {
    // console.log(availableTimeSlot);
    setMeeting((meeting) => ({
      ...meeting,
      date: meeting.dateForFiltering + "T" + availableTimeSlot,
    }));
    getEndTimes(availableTimeSlot);
  };

  const pickEndTime = (data) => {
    setSelectedEndTime(data);
    setMeeting((meeting) => ({
      ...meeting,
      // endTime: {
      //     "hour": data.substring(0,2),
      //     "minutes": data.split(':')[1],
      //     "second": 0,
      //     "nano": 0
      // }
      endTime: data.substring(0, 3) + data.split(":")[1],
    }));
  };

  const textChangedName = (e) => {
    setEmployeesName(e.target.value);
  };

  async function getEmployeesByLastName(employeesName) {
    axios
      .get("http://localhost:8080/appointment/employees/" + employeesName, {
        headers: { "Content-Type": "application/json" },
      })
      .then(function (response) {
        setEmployees(response.data.employeeDTOList);
        console.log(response.data.employeeDTOList);
      });
  }

  const selectEmployee = (employeeSearched) => {
    setMeeting((meeting) => ({
      ...meeting,
      employeesEmail: employeeSearched.email,
      employeesFirstName: employeeSearched.firstName,
      employeesLastName: employeeSearched.lastName,
    }));
    setFilters((params) => ({ ...params, id: employeeSearched.id })); //this stores the id of employee
  };
  const [errors, setErrors] = useState("");
  const [passing, setPassing] = useState(true);

  useEffect(() => {
    setErrors(validation(meeting));
  }, [meeting.email, meeting.phone]);

  useEffect(() => {
    for (const value in errors) {
      if (errors[value] !== "") {
        // alert(errors[value]);
        setPassing(false);
        break;
      } else {
        setPassing(true);
      }
    }
  }, [errors]);

  //Axios post
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(JSON.stringify(errors));
    if (passing) {
      console.log(AccountService.getToken());
      add();
      // alert(JSON.stringify(meeting));
      console.log(filters);
      alert("Submitted successfully");
      navigate("/overview"); //added
      window.location.reload();
    } else {
      alert("Data are not in the right format!");
    }
  };

  function add() {
    // alert(JSON.stringify(meeting));
    axios.post(
      "http://localhost:8080/appointment",
      JSON.stringify({
        visitor: {
          firstName: meeting.firstName,
          lastName: meeting.lastName,
          email: meeting.email,
          phoneNumber: meeting.phone,
        },
        employee: {
          id: filters.id,
          firstName: meeting.employeesFirstName,
          lastName: meeting.employeesLastName,
          email: meeting.employeesEmail, //probably we use useEffect for searching for employees email by his last name
        },
        dateTime: meeting.date,
        licensePlate: meeting.licensePlate,
        comesByCar: meeting.byCar,
        endTime: meeting.endTime,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const handleChange = (event) => {
    if (event.target.name === "byCar") {
      const name = event.target.name;
      const value = event.target.checked;
      setMeeting((values) => ({ ...values, [name]: value }));
    } else {
      const name = event.target.name;
      const value = event.target.value;
      setMeeting((values) => ({ ...values, [name]: value }));
    }
  };

  return (
    <div>
      <div className="page-layout">
        <Navbar
          showSecretaryBoard={props.showSecretaryBoard}
          showAdminBoard={props.showAdminBoard}
          isAuth={props.isAuth}
        />
        <div className="page-container">
          <h2>Secretary</h2>
          <div className="overview">
            <h3>Create appointment</h3>
            <div className="create-meeting">
              <div className="create-meeting-divider">
                <hr />
                <p> Employee </p>
                <hr />
              </div>
              <span>
                Appointment with
                <input
                  onChange={textChangedName}
                  type="text"
                  placeholder="Employee's last name"
                  required={true}
                ></input>
              </span>
              <div id="dropdown" className="create-meeting-employee-dropdown">
                {employees.map((employeeSearched, i) => {
                  return (
                    <div
                      key={i}
                      className="create-meeting-employee-dropdown-individual"
                    >
                      <p>{employeeSearched.email}</p>
                      <p>
                        {employeeSearched.firstName} {employeeSearched.lastName}
                      </p>
                      <button
                        className="submit-btn"
                        onClick={() => selectEmployee(employeeSearched)}
                      >
                        Select
                      </button>
                    </div>
                  );
                })}
              </div>
              <span>
                Email
                <input
                  type="email"
                  disabled={true}
                  value={meeting.employeesEmail}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  placeholder="No employee selected"
                  required={true}
                />
              </span>
              <span>
                Date
                <DatePicker
                  inline
                  type="date"
                  dateFormat="yyyy/MM/dd"
                  selected={startDate}
                  highlightDates={datesExpectedValues}
                  includeDates={datesExpectedValues}
                  onChange={(date) => {
                    setMeeting((values) => ({
                      ...values,
                      dateForFiltering: moment(date)
                        .format("YYYY-MM-DDTkk:mm")
                        .split("T")[0],
                    }));
                    setStartDate(date);
                    setFilters((params) => ({
                      ...params,
                      year: moment(date).format("YYYY"),
                      month: moment(date).format("MM"),
                      day: moment(date).format("DD"),
                    }));
                  }}
                />
              </span>
              <span>
                Pick the start time:
                <select
                  value={selected}
                  onChange={(e) => {
                    setSelected(e.target.value);
                    pickAvailableMeeting(e.target.value);
                  }}
                >
                  <option value="" disabled selected>
                    Select start time
                  </option>
                  {availableTimeSlots.map((availableTimeSlot, j) => {
                    return (
                      <option key={j} value={availableTimeSlot}>
                        {availableTimeSlot.substring(0, 5)}
                      </option>
                    );
                  })}
                </select>
              </span>
              <span>
                Pick the end time:
                <select
                  value={selectedEndTime}
                  onChange={(e) => pickEndTime(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select end time
                  </option>
                  {availableEndTimes.map((availableEndTime, j) => {
                    return (
                      <option key={j} value={availableEndTime}>
                        {availableEndTime.substring(0, 5)}
                      </option>
                    );
                  })}
                </select>
              </span>

              <span>
                Selected date and time for meeting
                <input
                  type="dateTime-local"
                  value={meeting.date}
                  disabled={true}
                />
              </span>
              <form>
                <div className="create-meeting-divider">
                  <hr />
                  <p> Visitor </p>
                  <hr />
                </div>
                <span>
                  First name
                  <input
                    placeholder="First name"
                    type="text"
                    name="firstName"
                    value={meeting.firstName || ""}
                    onChange={handleChange}
                    required={true}
                  />
                </span>
                <span>
                  Last name
                  <input
                    placeholder="Last name"
                    type="text"
                    name="lastName"
                    value={meeting.lastName || ""}
                    onChange={handleChange}
                    required={true}
                  />
                </span>
                <span>
                  Phone number
                  <input
                    placeholder="Phone number"
                    type="text"
                    name="phone"
                    value={meeting.phone || ""}
                    onChange={handleChange}
                    required={true}
                  />
                </span>
                {errors.phoneNumber && (
                  <span id="err">{errors.phoneNumber}</span>
                )}
                <span>
                  Email
                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={meeting.email || ""}
                    onChange={handleChange}
                    required={true}
                  />
                </span>
                {errors.email && <span id="err">{errors.email}</span>}
                <span>
                  By car
                  <input
                    type="checkbox"
                    name="byCar"
                    value={meeting.byCar || checked}
                    onChange={handleChange}
                    onClick={handleClick}
                    checked={checked}
                  />
                  {checked && (
                    <input
                      placeholder="License plate"
                      type="text"
                      name="licensePlate"
                      value={meeting.licensePlate || ""}
                      onChange={handleChange}
                    />
                  )}
                </span>
                {errors.licensePlate && (
                  <span id="err">{errors.licensePlate}</span>
                )}
                <button onClick={(e) => handleSubmit(e)} type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
