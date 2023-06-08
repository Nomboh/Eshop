import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { Provider } from "react-redux"
import Store from "./redux/store"

const container = document.getElementById("root")
const root = ReactDOM.createRoot(container)

root.render(
	<Provider store={Store}>
		<App />
	</Provider>
)
