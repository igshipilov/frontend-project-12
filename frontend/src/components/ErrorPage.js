import "bootstrap/dist/css/bootstrap.css";

import { Link } from "react-router-dom";

function ErrorPage() {
	return (
		<div className="error-page">
			<h1 className="text-warning">404 Not Found</h1>
			<Link to="/" className="App-link">
				<h2>Вернуться на главную</h2>
			</Link>
		</div>
	);
}

export default ErrorPage;
