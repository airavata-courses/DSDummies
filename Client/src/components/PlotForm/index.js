import React, { useContext, useState } from "react";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date";
import Dropdown from "react-dropdown";
import Switch from "react-switch";
import { TimePicker } from "antd";
import moment from "moment";
// import Popup from "./popup";
import axios from "axios";
import { toast } from "react-toastify";
import { Input, SubmitButton } from "../AuthForm/AuthFormStyles";

function PlotForm({ props }) {
	const { station, setStation } = props;
	console.log("Station recvd is : ", station);
	// const [station, setStation] = useState("");
	const [year, setYear] = useState("");
	const [month, setMonth] = useState("");
	const [date, setDate] = useState("");
	const [hour, setHour] = useState([]);
	const [loading, setLoading] = useState("");
	const [flag, setFlag] = useState(false);
	const [img, setImg] = useState("");
	const [checked, setChecked] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const cache_api = "http://localhost:8080/api/getplot";
	// const cache_api = "http://localhost:8080/api/getvideo";

	const handleSubmit = async () => {
		//TODO: validate inputs
		// console.log("values recvd==", station, year, month, date, hour);
		try {
			console.log(cache_api);
			setLoading(true);
			//const body = { "station": station, "year": year, "month": month, "date": date, "hour":hour };

			// if (month.length == 1) {
			// 	setMonth(`0${month}`);
			// }
			// if (date.length == 1) {
			// 	setDate(`0${date}`);
			// }
			let correct_month = month + 1;

			setMonth(correct_month);
			console.log("*********************************");
			console.log("Data selected -> ", station, year, month, date, hour);
			console.log("*********************************");

			return;
			const body = { station: "KIND", year: "2012", month: "10", date: "01", hour: 15 };
			const { data } = await axios.post(`${cache_api}`, body, {
				"Content-Type": "text/JSON",
			});
			console.log("cache response : ", data);
			setFlag(true);
			togglePopup();
			setImg(data.resp);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			toast.error(error.response.data);
		}
	};
	const handleChange = nextChecked => {
		setChecked(nextChecked);
	};
	const togglePopup = () => {
		setIsOpen(!isOpen);
	};
	const options = [
		"00-01 hrs",
		"01-02 hrs",
		"02-03 hrs",
		"03-04 hrs",
		"04-05 hrs",
		"05-06 hrs",
		"06-07 hrs",
		"07-08 hrs",
		"08-09 hrs",
		"09-10 hrs",
		"10-11 hrs",
		"11-12 hrs",
		"12-13 hrs",
		"13-14 hrs",
		"14-15 hrs",
		"15-16 hrs",
		"16-17 hrs",
		"17-18 hrs",
		"18-19 hrs",
		"19-20 hrs",
		"20-21 hrs",
		"21-22 hrs",
		"22-23 hrs",
		"23-00 hrs",
	];
	const format = "HH:mm";

	return (
		<div>
			{/* <input disabled type="text" style= {{width: "70%"}} placeholder="State" value= {station} onChange={e => setStation(e.target.value)}/> */}

			<p style={{ marginLeft: "0.5%" }}>Chosen State : {station}</p>
			<br></br>
			<YearPicker
				defaultValue={"select year"}
				start={1991} // default is 1900
				end={2021} // default is current year
				reverse // default is ASCENDING
				required={true} // default is false
				disabled={false} // default is false
				style={{ width: "30%" }}
				value={year} // mandatory
				onChange={year => {
					// mandatory
					setYear(year);
				}}
			/>

			<MonthPicker
				defaultValue={"select month"}
				numeric // to get months as numbers
				short // default is full name
				caps // default is Titlecase
				endYearGiven // mandatory if end={} is given in YearPicker
				year={year} // mandatory
				required={true} // default is false
				disabled={false} // default is false
				style={{ width: "30%" }}
				value={month} // mandatory
				onChange={month => {
					// mandatory
					setMonth(month);
				}}
			/>

			<DayPicker
				defaultValue={"select day"}
				year={year} // mandatory
				month={month} // mandatory
				endYearGiven // mandatory if end={} is given in YearPicker
				required={true} // default is false
				disabled={false} // default is false
				style={{ width: "30%" }}
				value={date} // mandatory
				onChange={day => {
					// mandatory
					setDate(day);
				}}
			/>

			<p style={{ marginTop: "9%", marginLeft: "1" }}>Video Mode</p>
			<div style={{ marginTop: "-9.5%", marginLeft: "25%" }}>
				<Switch onChange={handleChange} checked={checked} />
			</div>

			<br></br>
			<br></br>
			<br></br>

			{checked ? (
				<div style={{ width: "46%", marginTop: "-11%" }}>
					<Dropdown
						options={options}
						value="select hour range"
						placeholder="Select start hour"
						style={{ width: "10%" }}
						onChange={time => {
							setHour(time.value);
						}}
					/>
				</div>
			) : (
				<div style={{ width: "30%", marginTop: "-11%" }}>
					<TimePicker
						defaultValue={moment(moment.now(), format)}
						format={format}
						onChange={time => {
							setHour(time._d.getHours() + "-" + time._d.getMinutes());
						}}
					/>
				</div>
			)}

			<SubmitButton type="submit" onClick={handleSubmit} style={{ width: "97%", marginTop: "8%" }}>
				Get Plot
			</SubmitButton>
		</div>
	);
}

export default PlotForm;
