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

const PlotPageM2 = () => {
	// for loading user data
	const { state, dispatch } = useContext(Context);
	const { user } = state;

	const CACHE_API = process.env.REACT_APP_CACHE_API_URI;

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

	let cache_api = CACHE_API + "/getplot";

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
			const body = {
				station: "NONE",
				year: year,
				month: month,
				date: date,
				hour: "1",
				dataset: "2",
			};
			console.log(body);
			setLoading(true);

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

	const togglePopup = () => {
		setIsOpen(!isOpen);
	};

	const logout = async () => {
		dispatch({
			type: "LOGOUT",
		});
		window.localStorage.removeItem("user");
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
					height: "15%",
				}}
			>
				<span
					style={{
						fontSize: "200%",
						fontWeight: "bold",
						paddingLeft: "35%",
					}}
				>
					Weather Application
				</span>
				<span
					style={{
						fontWeight: "bold",
						paddingLeft: "5%",
						paddingRight: "1%",
					}}
				>
					Welcome {user && user.name}
				</span>

				<span
					style={{
						fontWeight: "bold",
					}}
				>
					<button
						style={{
							width: "180px",
							fontSize: "15px",
							fontWeight: "bold",
							borderRadius: "200px 200px 200px 200px",
							cursor: "pointer",
						}}
						onClick={() => navigate(`/plot`)}
					>
						View NEXRAD Data
					</button>
				</span>
				<span
					style={{
						fontWeight: "bold",
						paddingLeft: "1%",
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

			<div style={{ marginTop: "7%", marginLeft: "15%", marginRight: "15%" }}>
				{true ? (
					<div>
						<div style={{ marginTop: "1%", marginLeft: "30%" }}>
							<YearPicker
								defaultValue={"select year"}
								start={1991} // default is 1900
								end={2021} // default is current year
								reverse // default is ASCENDING
								required={true} // default is false
								disabled={false} // default is false
								style={{ width: "30%", marginTop: "100px", marginBottom: "100px" }}
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
						</div>

						<br></br>

						<SubmitButton
							type="submit"
							onClick={handleSubmit}
							style={{ width: "97%", marginTop: "5%" }}
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
									<>{<img width="100%" height="100%" src={`data:image/png;base64,${img}`} />}</>
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

export default PlotPageM2;
