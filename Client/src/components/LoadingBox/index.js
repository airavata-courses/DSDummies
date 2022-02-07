import React from "react";
import CircleLoader from "react-spinners/ClipLoader";

function LoadingBox({ props }) {
	return (
		<div
			style={{
				position: "fixed",
				background: "#00000050",
				width: "100%",
				height: "100vh",
				top: 0,
				left: 0,
				paddingTop: "220px",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<CircleLoader color="#00e68a" loading={true} size={350} />
			</div>
		</div>
	);
}

export default LoadingBox;
