import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages";
import PlotPage from "./pages/plotPage";
import PlotPageM2 from "./pages/plotPageM2";
import { Provider } from "./context";

function App() {
	return (
		<Provider>
			<Router>
				<Routes>
					{/* <ToastContainer position="top-center" /> */}
					<Route path="/" element={<Home />} />
					<Route path="/plot" element={<PlotPage />} />
					<Route path="/plotM2" element={<PlotPageM2 />} />
				</Routes>
			</Router>
		</Provider>
	);
}

export default App;
