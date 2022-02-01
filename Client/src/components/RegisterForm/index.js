import React, { useState } from "react";
import {
	BoldLink,
	BoxContainer,
	FormContainer,
	Input,
	MutedLink,
	SubmitButton,
} from "../AuthForm/AuthFormStyles";
import { Marginer } from "../Marginer";

export function SignupForm(props) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit() {
		console.log("Full nameis -> ", name);
		console.log("Email is -> ", email);
		console.log("Password is -> ", password);
	}
	return (
		<BoxContainer>
			<FormContainer>
				<Input type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} />
				<Input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
				<Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
				{/* <Input type="password" placeholder="Confirm Password" /> */}
			</FormContainer>
			<Marginer direction="vertical" margin={10} />
			<SubmitButton type="submit" onClick={handleSubmit}>
				Register
			</SubmitButton>
			<Marginer direction="vertical" margin="1em" />
			<MutedLink href="#">
				Already have an account?
				<BoldLink href="#" onClick={props.handleClick}>
					Log in
				</BoldLink>
			</MutedLink>
		</BoxContainer>
	);
}
