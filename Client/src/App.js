import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages";
import PlotPage from "./pages/plotPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/plot" element={<PlotPage />} />
			</Routes>
		</Router>
	);
}

export default App;
