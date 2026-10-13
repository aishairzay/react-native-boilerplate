import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import "./index.css"
import "@fontsource-variable/fraunces"
import { App } from "./App"

function render() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  )
}

// The blank starter has no auth hook. Boot returns explicitly so completion
// never depends on which page/component the app happens to render.
const query = new URLSearchParams(location.search)
if ((query.get("code") || query.get("error")) && query.get("state")) {
  import("./lib/bounded").then(({ boot }) => boot()).then(render).catch((error: unknown) => {
    document.getElementById("root")!.textContent = error instanceof Error ? error.message : "Sign-in failed. Reload to retry."
  })
} else {
  render()
}
