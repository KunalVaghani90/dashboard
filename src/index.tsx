import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "@emotion/react"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles"
import { Provider } from "react-redux"
import { theme } from "./theme"
import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"

import "swagger-ui-react/swagger-ui.css"
import "bootstrap/dist/css/bootstrap.min.css"
// Todo: Remove shards and associated styles when we stop using it
import "./styles/shards-dashboards.scss"
import "./App.css"
import store from "./redux"
import { newVersionLocalStorageReset } from "./helpers/utils"

let App
const version = require("../package.json").version
const localVersion = localStorage.getItem("version")

newVersionLocalStorageReset(version, localVersion)

const { REACT_APP_TARGET, NODE_ENV } = process.env

if (REACT_APP_TARGET === "hub") {
  const { Hub } = require("./apps/Hub")
  App = Hub
} else if (REACT_APP_TARGET === "styleguide") {
  const { Styleguide } = require("./apps/Styleguide")
  App = Styleguide
} else if (REACT_APP_TARGET === "swagger") {
  const { Swagger } = require("./apps/Swagger")
  App = Swagger
} else {
  const { Dashboard } = require("./apps/Dashboard")
  App = Dashboard
}

if (NODE_ENV === "production") {
  Sentry.init({
    dsn:
      "https://085edd94ec3e479cb20f2c65f7b8cb82@o525420.ingest.sentry.io/5639443",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })
}

ReactDOM.render(
  // HOC to make theme available as a prop in all components
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </MuiThemeProvider>,
  document.getElementById("root")
)

if (window.Cypress) {
  window.store = store
}
