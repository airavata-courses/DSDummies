import React, { useContext, useState } from "react";
import { Context } from "../context";
import { Input, SubmitButton } from "../components/AuthForm/AuthFormStyles";
import axios from "axios";
import { toast } from "react-toastify";
import USAMap from "react-usa-map";

import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Switch from "react-switch";

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
	const [img, setImg] = useState("");
	const [value, onChange] = useState("10:00");
	const [checked, setChecked] = useState(false);

	const cache_api = "http://localhost:8080/api/getplot";

	const handleSubmit = async () => {
		//TODO: validate inputs
		try {
			console.log(cache_api);
			setLoading(true);
			const body = { station: "KIND", year: "2012", month: "10", date: "01", hour: 15 };
			const { data } = await axios.post(`${cache_api}`, body, {
				"Content-Type": "text/JSON",
			});
			console.log("cache response : ", data);
			setFlag(true);
			setImg(data.resp);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			toast.error(error.response.data);
		}
	};

	const mapHandler = event => {
		setStation("Chosen State : " + " " + event.target.dataset.name);
		setFlag(true);
	};

	const handleChange = nextChecked => {
		setChecked(nextChecked);
	};

	const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	const defaultOption = options[0];

	return (
		<>
			<h2>Weather Application</h2>
			<h3 style={{ marginTop: "1%" }}>Welcome {user && user.name}</h3>
			<h4 style={{ marginTop: "1%" }}>Select a state to check the weather</h4>
			<div style={{ marginTop: "4%", width: 740 }}>
				<USAMap onClick={mapHandler}></USAMap>
			</div>
			<div style={{ marginTop: "-25%", marginLeft: "71%" }}>
				{flag ? (
					<div>
						{/* <input disabled type="text" style= {{width: "70%"}} placeholder="State" value= {station} onChange={e => setStation(e.target.value)}/> */}

						<p>{station}</p>
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
								console.log(year);
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
								console.log(month);
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
								console.log(day);
							}}
						/>
						<br></br>
						<br></br>
						<br></br>
						<div style={{ width: "22%" }}>
							<Dropdown
								options={options}
								value="select start hour"
								placeholder="Select start hour"
								style={{ width: "10%" }}
							/>
						</div>
						<div style={{ width: "22%", marginLeft: "22%", marginTop: "-18.5%" }}>
							<Dropdown
								options={options}
								value="select end hour"
								placeholder="Select start hour"
								style={{ width: "10%" }}
							/>
						</div>
						<div style={{ marginTop: "-8%", marginLeft: "48%" }}>
							<Switch onChange={handleChange} checked={checked} />
						</div>
						<SubmitButton
							type="submit"
							onClick={handleSubmit}
							style={{ width: "97%", marginTop: "8%" }}
						>
							Get Plot
						</SubmitButton>
					</div>
				) : (
					""
				)}
				<div>
					<img src={`data:image/png;base64,${img}`} />
				</div>
			</div>
		</>
	);
};

export default PlotPage;
