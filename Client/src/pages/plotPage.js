import React, { useContext, useState } from "react";
import { Context } from "../context";
import { Input, SubmitButton } from "../components/AuthForm/AuthFormStyles";
import axios from "axios";
import { toast } from "react-toastify";
import USAMap from "react-usa-map";
import Popup from './popup';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Switch from "react-switch";
import { TimePicker } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';


const PlotPage = () => {
	const {
		state: { user },
	} = useContext(Context);
	const [station, setStation] = useState("");
	const [year, setYear] = useState("");
	const [month, setMonth] = useState("");
	const [date, setDate] = useState("");
	const [hour, setHour] = useState([]);
	const [loading, setLoading] = useState("");
	const [flag, setFlag] = useState(false);
	const [img, setImg] = useState("")
	const [checked, setChecked] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
  

	const cache_api = "http://localhost:8080/api/getplot";

	const handleSubmit = async () => {

		console.log("values recvd==",station, year, month, date, hour)
		//TODO: validate inputs
		try {
			setLoading(true);
			const body = { "station": station, "year": year, "month": month, "date": date, "hour":hour };
			console.log("body-", body)
			const { data } = await axios.post(`${cache_api}`, body);
			console.log("cache response : ", data);
			togglePopup();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			toast.error(error.response.data);
		}
	};

	const mapHandler = (event) => {
		setStation(event.target.dataset.name);
		setFlag(true);
	};

	const handleChange = nextChecked => {
		setChecked(nextChecked);
	};  

	const togglePopup = () => {
		setIsOpen(!isOpen);
		
	  }	

	const options = [
		"00-01", "01-02", "02-03", "03-04", "04-05", "05-06", "06-07", "07-08", "08-09", "09-10", "10-11", "11-12", "12-13",
		"13-14", "14-15", "15-16", "16-17", "17-18", "18-19" , "19-20", "20-21", "21-22", "22-23", "23-00"
	];
	
	const format = 'HH:mm';

	return (
		<>
			<h2>Weather Application</h2>
			<h3 style = {{marginTop: "1%"}}>Welcome {user && user.name}</h3>
			<h4 style = {{marginTop: "1%"}}>Select a state to check the weather</h4>
			<div style ={{marginTop: "4%", width: 740}}>
        		<USAMap onClick={mapHandler} 
				></USAMap>
      		</div>
			<div style={{marginTop: "-35%", marginLeft: "71%"}}>

			{flag ? 
			<div>				
				<p style={{marginLeft: "0.5%"}}>Chosen State : {station}</p>
				<br></br>
				<YearPicker
					defaultValue={'select year'}
					start={1991}                // default is 1900
					end={2021}                  // default is current year
					reverse                     // default is ASCENDING
					required={true}             // default is false
					disabled={false}             // default is false
					style={{width: "30%"}}
					value={year}     // mandatory
					onChange={(year) => {       // mandatory
						setYear(year);
					}}
				/>

				<MonthPicker
					defaultValue={'select month'}
					numeric                   // to get months as numbers
					short                     // default is full name
					caps                      // default is Titlecase
					endYearGiven              // mandatory if end={} is given in YearPicker
					year={year}    // mandatory
					required={true}           // default is false
					disabled={false}           // default is false
					style={{width: "30%"}}
					value={month}  // mandatory
					onChange={(month) => {    // mandatory
						setMonth( month );
					}}
				/>	

				<DayPicker
					defaultValue={'select day'}
					year={year}    // mandatory
					month={month}  // mandatory
					endYearGiven              // mandatory if end={} is given in YearPicker
					required={true}           // default is false
					disabled={false}           // default is false
					style={{width: "30%"}}
					value={date}    // mandatory
					onChange={(day) => {      // mandatory
						setDate(day);
						console.log(day);
					}}
					
				/>

				<p style={{marginTop: "9%", marginLeft: "1"}}>Video Mode</p>
				<div style={{marginTop: "-9.5%", marginLeft: "25%"}}>
					<Switch
						onChange={handleChange}
						checked={checked}
        			/>
				</div>

				<br></br>
				<br></br>
				<br></br>

				{checked ? 

				<div style={{width:"46%", marginTop: "-11%"}}>
					<Dropdown options={options} value="select hour range" placeholder="Select start hour" style={{width:"10%"}} onChange={(time) => {
						setHour(time.value)
					}}/>
				</div>

				: <div style={{width:"30%", marginTop: "-11%"}}>
					<TimePicker defaultValue={moment(moment.now(), format)} format={format} onChange={(time) => {
						setHour(time._d.getHours() + "-" + time._d.getMinutes());
					}}/>
				</div> 
				}

				<SubmitButton type="submit" onClick={handleSubmit} style={{width: "97%", marginTop : "8%"}}>
					Get Plot
				</SubmitButton>
			</div> : ""}

			<div >
			{isOpen && <Popup
      			content={<>
				  <img  src={`data:image/png;base64,${img}` }/>
      			</>}
      			handleClose={togglePopup}
    		/>}
			</div>
		</div>
			
		</>
	);
};

export default PlotPage;
