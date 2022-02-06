import React, { useState, useContext } from "react";
import {
	BoldLink,
	BoxContainer,
	FormContainer,
	Input,
	MutedLink,
	SubmitButton,
} from "../AuthForm/AuthFormStyles";

import { useNavigate } from "react-router-dom";
import { Marginer } from "../Marginer";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../../context";

export function LoginForm(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState("");
	let navigate = useNavigate();

	//state management
	// state is our user which we set in the context/index.js file.
	//dispatch function is used to set value in this state
	const { state, dispatch } = useContext(Context);
	console.log(state);
	const { user } = state;

	const auth_api = process.env.REACT_APP_AUTH_API_URI;

	const handleSubmit = async () => {
		try {
			console.log("User before ---------> ", user);
			console.log(auth_api);
			setLoading(true);
			const { data } = await axios.post(`${auth_api}/login`, {
				email,
				password,
			});
			console.log("login response : ", data);

			//for setting in the value in  the state we use dispatch function
			dispatch({
				type: "LOGIN",
				payload: data,
			});

			//when we refresh the page the data stored in the state will get lost.S, for saving that we need
			//store the data in the browser's local storage and when the user refreshes the page then we can load the
			//data from the local storage
			window.localStorage.setItem("user", JSON.stringify(data));

			setLoading(false);
			if (data != null) {
				navigate(`plot`);
			}
		} catch (error) {
			setLoading(false);
			toast.error(error.response.data);
		}
	};

	return (
		<BoxContainer>
			<FormContainer>
				<Input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
				<Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
			</FormContainer>
			<Marginer direction="vertical" margin={10} />
			<MutedLink href="#">Forget your password?</MutedLink>
			<Marginer direction="vertical" margin="1.6em" />
			<SubmitButton type="submit" onClick={handleSubmit}>
				Log In
			</SubmitButton>
			<Marginer direction="vertical" margin="1em" />
			<MutedLink href="#">
				Don't have an accoun?{" "}
				<BoldLink href="#" onClick={props.handleClick}>
					Register
				</BoldLink>
			</MutedLink>
		</BoxContainer>
	);
}
