import React, { useState } from "react";
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

export function LoginForm(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	let navigate = useNavigate();

	function handleSubmit() {
		console.log("Email is -> ", email);
		console.log("Password is -> ", password);
		try {
			navigate(`plot`);
			console.log("successfully redirected");
		} catch (err) {
			console.log(err);
		}
	}

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
