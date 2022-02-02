import React, { useContext, useState } from "react";
import { Context } from "../context";
import { Input, SubmitButton } from "../components/AuthForm/AuthFormStyles";
import axios from "axios";
import { toast } from "react-toastify";

const PlotPage = () => {
	const {
		state: { user },
	} = useContext(Context);
	const [station, setStation] = useState("");
	const [year, setYear] = useState("");
	const [month, setMonth] = useState("");
	const [date, setDate] = useState("");
	const [hour, setHour] = useState("");
	const [loading, setLoading] = useState("");

	const cache_api = process.env.REACT_APP_CACHE_API_URI;

	const handleSubmit = async () => {
		//TODO: validate inputs
		try {
			console.log(cache_api);
			setLoading(true);
			const { data } = await axios.get(`${cache_api}/isworking`, {});
			console.log("cache response : ", data);

			setLoading(false);
		} catch (error) {
			setLoading(false);
			toast.error(error.response.data);
		}
	};

	return (
		<>
			<div>Welcome {user && user.name}</div>
			<Input
				type="text"
				placeholder="Station"
				value={station}
				onChange={e => setStation(e.target.value)}
			/>
			<Input type="text" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
			<Input
				type="text"
				placeholder="Month"
				value={month}
				onChange={e => setMonth(e.target.value)}
			/>
			<Input type="text" placeholder="Date" value={date} onChange={e => setDate(e.target.value)} />
			<Input type="text" placeholder="Hour" value={hour} onChange={e => setHour(e.target.value)} />

			<SubmitButton type="submit" onClick={handleSubmit}>
				Get Plot
			</SubmitButton>
		</>
	);
};

export default PlotPage;
