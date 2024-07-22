import "./ErrorPage.css";

import { Link } from "react-router-dom";

function ErrorPage() {
	return (
		<div className="error-page">
			<Link to="/" className="App-link">
				Home
			</Link>

			<p>404 Not Found</p>
			<p>unfortunately</p>
		</div>
	);
}

export default ErrorPage;
