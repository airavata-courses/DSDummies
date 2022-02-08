import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context";
import { Input, SubmitButton } from "../components/AuthForm/AuthFormStyles";
import axios from "axios";
import { toast } from "react-toastify";
import USAMap from "react-usa-map";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Switch from "react-switch";
import { TimePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import PlotPopUp from "../components/PlotPopUp";
import LoadingBox from "../components/LoadingBox";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parse from "html-react-parser";
import VideoPopUp from "../components/VideoPopUp";
import { useNavigate } from "react-router-dom";

// import Jumbotron from "react-bootstrap/Jumbotron";

const PlotPage = () => {
	// for loading user data
	const { state, dispatch } = useContext(Context);
	const { user } = state;

	let navigate = useNavigate();
	//redirect user to homePage if they are not logged in
	useEffect(() => {
		if (user === null) {
			let user_data = JSON.parse(window.localStorage.getItem("user"));
			if (user_data === null) {
				navigate(`/`);
			}
		}
	}, [user]);

	const [station, setStation] = useState("");
	const [year, setYear] = useState("");
	const [month, setMonth] = useState("");
	const [date, setDate] = useState("");
	const [hour, setHour] = useState(0);
	const [loading, setLoading] = useState("");
	const [flag, setFlag] = useState(false);
	const [img, setImg] = useState("");
	const [isVideo, setIsVideo] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	let cache_api = "http://localhost:8080/api/getplot";
	// const cache_api = "http://localhost:8080/api/getvideo";

	const handleSubmit = async () => {
		//TODO: validate inputs
		console.log("values recvd==", station, year, month, date, hour);
		try {
			if (year === "") {
				toast.error("Please select Year!");
				return;
			}
			if (month === "") {
				toast.error("Please select Month!");
				return;
			}
			if (date === "") {
				toast.error("Please select Date!");
				return;
			}

			// const body = { station: "KIND", year: "2012", month: "10", date: "01", hour: 15 };
			const body = { station: station.trim(), year: year, month: month, date: date, hour: hour };
			// const body = {
			// 	station: "KIND",
			// 	year: "2011",
			// 	month: "10",
			// 	date: "01",
			// 	hour: 15,
			// };
			console.log(body);
			setLoading(true);

			if (isVideo) {
				cache_api = "http://localhost:8080/api/getvideo";
			}
			console.log(cache_api);
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
			toast.error(error);
		}
	};

	const mapHandler = event => {
		// setStation(event.target.dataset.name);
		setFlag(true);
	};
	const changeVideoMode = videoBool => {
		setIsVideo(videoBool);
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

	const logout = async () => {
		dispatch({
			type: "LOGOUT",
		});
		window.localStorage.removeItem("user");
		// const { data } = await axios.get("/api/logout");
		toast.success("Logged Out!");
		navigate(`/`);
	};

	return (
		<>
			<ToastContainer position="top-center" />
			<div
				style={{
					flexDirection: "row",
					backgroundColor: "#00cc88",
					height: "50px",
				}}
			>
				<span
					style={{
						fontSize: "200%",
						fontWeight: "bold",
						paddingLeft: "580px",
					}}
				>
					Weather Application
				</span>
				<span
					style={{
						fontWeight: "bold",
						paddingLeft: "330px",
					}}
				>
					Welcome {user && user.name}
				</span>
				<span
					style={{
						fontWeight: "bold",
						paddingLeft: "10px",
					}}
				>
					<button
						style={{
							width: "100px",
							fontSize: "15px",
							fontWeight: "bold",
							borderRadius: "200px 200px 200px 200px",
							cursor: "pointer",
						}}
						onClick={logout}
					>
						logout
					</button>
				</span>
			</div>

			{/* <h3 style={{ marginTop: "1%" }}>Welcome {user && user.name}</h3> */}
			<h2 style={{ marginTop: "1%", paddingLeft: "560px" }}>Select a state to check the weather</h2>
			<div style={{ marginTop: "4%", width: 740 }}>
				<USAMap onClick={mapHandler}></USAMap>
			</div>
			<div style={{ marginTop: "-35%", marginLeft: "71%" }}>
				{true ? (
					<div>
						{/* <input disabled type="text" style= {{width: "70%"}} placeholder="State" value= {station} onChange={e => setStation(e.target.value)}/> */}

						<div
							style={{
								flexDirection: "row",
							}}
						>
							<p style={{ marginLeft: "0.5%" }}>Type State Code :</p>
							<input value={station} onChange={val => setStation(val.target.value)} />
						</div>

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

						<p style={{ marginTop: "9%", marginLeft: "1" }}>Video Mode</p>
						<div style={{ marginTop: "-9.5%", marginLeft: "25%" }}>
							<Switch onChange={changeVideoMode} checked={isVideo} />
							<span
								style={{
									paddingLeft: "10px",
									fontSize: "80%",
									color: "red",
									fontWeight: "bold",
								}}
							>
								will take longer*
							</span>
						</div>
						<div></div>

						<br></br>
						<br></br>
						<br></br>

						{isVideo ? (
							<div style={{ width: "46%", marginTop: "-11%" }}>
								<Dropdown
									options={options}
									value="select hour range"
									placeholder="Select start hour"
									style={{ width: "10%" }}
									onChange={time => {
										let hour_range = time.value.split("-")[0];

										setHour(hour_range);
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
					{isOpen &&
						(isVideo ? (
							<VideoPopUp content={<>{parse(img)}</>} handleClose={togglePopup} />
						) : (
							<PlotPopUp
								content={
									<>{<img width="800" height="500" src={`data:image/png;base64,${img}`} />}</>
								}
								handleClose={togglePopup}
							/>
						))}
				</div>
				<div>{loading && <LoadingBox props={loading} />}</div>
			</div>
		</>
	);
};

export default PlotPage;
