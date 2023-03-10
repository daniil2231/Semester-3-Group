import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker";
import { addDays } from 'date-fns';
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import AccountService from "../services/AccountService";

export default function EditMeeting(props) {

    // these are parameters for get method -> timeslots!
    const [filters, setFilters] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selected, setSelected] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [availableEndTimes, setAvailableEndTimes] = useState([]);


    let navigate = useNavigate();

    const [oldMeeting, setOldMeeting] = useState(
        {
            id: props.id,
            dateTime: "",
        }
    );


    const [editedMeeting, setEditedMeeting] = useState(oldMeeting);
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
        }
    ];
    const [availableMeetings, setAvailableMeetings] = useState(initialMeetings);

    const [datesExpectedValues, setDatesExpectedValues] = useState([]);
    let myArray = []; //here i store dates for calendar

    useEffect(() => {
        convertToExpectedValues();
    })

    //this one converts retrieved dates to expected value so we can see them in calendar
    const convertToExpectedValues = () => {
        for (let day of initialMeetings) {
            myArray.push(addDays(new Date(day.dateTime), 0))
        }
        return setDatesExpectedValues(myArray);
    }

    useEffect(() => {
        filterData();
        //here should be the axios get method
    }, [filters])

    //get timeslots
    async function filterData() {
        axios.get("http://localhost:8080/appointment/", {
            params: {
                id: oldMeeting.employee_id, //employee id
                year: filters.year,
                month: filters.month,
                day: filters.day
            }
        },
            {
                headers: { 'Content-Type': 'application/json' }
            }).then(function (response) {
                setAvailableTimeSlots(response.data.timeSlots);
                console.log(filters);
            })
    }

    //get endTimeSlots
    async function getEndTimes(data) {
        axios.get("http://localhost:8080/appointment/endTimeSlots", {
            params: {
                "hour": data.substring(0, 2),
                "minutes": data.split(':')[1],
                "id": oldMeeting.employee_id, //employee id
                "year": filters.year,
                "month": filters.month,
                "day": filters.day
            }
        },
            {
                headers: { 'Content-Type': 'application/json' }
            }).then(function (response) {
                setAvailableEndTimes(response.data.timeSlots);
                console.log("timeslots:" + response.data.timeSlots);
            })
    }

    const pickEndTime = (data) => {
        setSelectedEndTime(data);
        setEditedMeeting(meeting => ({
            ...meeting,
            endTime: data.substring(0, 3) + data.split(':')[1]
        }
        )
        )
    }


    // const [checked, setChecked] = useState(oldMeeting.comesByCar);

    // filteres availabale meetings
    useEffect(() => {
        retrieveFilteredMeetings();
        console.log(editedMeeting.dateForFiltering);
        // console.log(JSON.stringify(availableMeetings));
    }, [editedMeeting.dateForFiltering]);

    const retrieveFilteredMeetings = () => {
        const filtered = initialMeetings.filter(input =>
            Object.values(input).some(val =>
                typeof val === "string" && val.includes(editedMeeting.dateForFiltering)));
        setAvailableMeetings(filtered);
    }

    // concatenates date into the right format
    const pickAvailableMeeting = (availableTimeSlot) => {
        setEditedMeeting(meeting => ({ ...meeting, dateTime: editedMeeting.dateForFiltering + "T" + availableTimeSlot }))
        getEndTimes(availableTimeSlot)
    }

    // const handleClick = () => setChecked(!checked);

    //----------------AXIOS----------------
    //Get
    useEffect(() => {
        axios.get("http://localhost:8080/appointment/" + props.id, {
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            setOldMeeting(response.data)
            console.log(response.data)
        });
    }, [props.id]);

    //Put
    function put() {
        alert("Request has been sent");
        // alert(JSON.stringify(editedMeeting));
        axios
            .put("http://localhost:8080/appointment", JSON.stringify({
                id: props.id,
                dateTime: editedMeeting.dateTime,
                endTime: editedMeeting.endTime,
                comesByCar: editedMeeting.comesByCar, //is not in backend
                licensePlate: oldMeeting.licensePlate //is not in backend
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        navigate("/overview");
    }
    //--------------end of axios (2methods) ----------------------

    const [startDate, setStartDate] = useState(oldMeeting.dateTime);

    return (
        <div>
            <div className="page-layout">
            <Navbar showSecretaryBoard={props.showSecretaryBoard} showAdminBoard={props.showAdminBoard} isAuth={props.isAuth}/>
                <div className="page-container">
                    <h2>Secretary</h2>
                    <div className="overview">
                        <h3>Edit appointment</h3>
                        <div className="create-meeting"></div>

                    <div className="create-meeting">
                        <span>Date
                            <DatePicker
                                inline
                                type="date"
                                dateFormat="yyyy/MM/dd"
                                selected={startDate}
                                highlightDates={datesExpectedValues}
                                includeDates={datesExpectedValues}
                                onChange={(date) => { setEditedMeeting(values => ({ ...values, dateForFiltering: moment(date).format("YYYY-MM-DDTkk:mm").split('T')[0] })); setStartDate(date); setFilters(params => ({ ...params, year: moment(date).format("YYYY"), month: moment(date).format("MM"), day: moment(date).format("DD") })) }}
                            />
                        </span>
                        <span>
                            Pick the start time:
                            <select value={selected} onChange={(e) => { setSelected(e.target.value); pickAvailableMeeting(e.target.value); }}>
                            <option value="" disabled selected>Select start time</option>
                                {availableTimeSlots.map(
                                    (availableTimeSlot, j) => {
                                        return (
                                            <option key={j} value={availableTimeSlot}>{availableTimeSlot.substring(0, 5)}</option>
                                        )
                                    }
                                )
                                }
                            </select>
                        </span>
                        <span>
                            Pick the end time:
                            <select value={selectedEndTime} onChange={(e) => pickEndTime(e.target.value)}>
                            <option value="" disabled selected>Select end time</option>
                                {availableEndTimes.map(
                                    (availableEndTime, j) => {
                                        return (
                                            <option key={j} value={availableEndTime}>{availableEndTime.substring(0, 5)}</option>
                                        )
                                    }
                                )
                                }
                            </select>
                        </span>
                        <span>Selected date and time for meeting<input type="text" value={editedMeeting.dateTime} disabled={true} placeholder={oldMeeting.dateTime} /></span>
                        <form onSubmit={put}>

                            <button className="submit-btn" type="submit">Submit</button>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// const handleChange = (event) => {
//     // if (event.target.name === "comesByCar") {
//     //     const name = event.target.name;
//     //     const value = event.target.checked;
//     //     setEditedMeeting(values => ({ ...values, [name]: value }));
//     // }
//     // else {
//     //     const name = event.target.name;
//     //     const value = event.target.value;
//     //     setEditedMeeting(values => ({ ...values, [name]: value }));
//     // }
//     const name = event.target.name;
//     const value = event.target.value;
//     setEditedMeeting(values => ({ ...values, [name]: value }));
// }

{/* <div className="available-meetings-container">{availableTimeSlots.map(
                            (availableTimeSlot, j) => {
                                return (
                                    <div className="available-meeting" key={j}>
                                        <h2>{availableTimeSlot}</h2>
                                        <button className="submit-btn" onClick={() => pickAvailableMeeting(availableTimeSlot)}>Select</button>
                                    </div>
                                )
                            }
                        )}
                        </div> */}

{/* <span>By car<input type="checkbox" name="comesByCar"
                                value={editedMeeting.comesByCar || checked}
                                onChange={handleChange} onClick={handleClick} checked={checked} />{checked && (<input placeholder={oldMeeting.licensePlate} type="text" name="licensePlate"
                                    value={editedMeeting.licensePlate || ""}
                                    onChange={handleChange} />)}</span> */}