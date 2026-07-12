import { Route, Routes } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import CountryDetail from "./components/CountryDetail"
import PageLayout from "./layouts/PageLayout"

function App() {
  return (
    <>
      <Routes>
        <Route Component={PageLayout}>
          <Route index Component={Dashboard} />
          <Route path="countries/:ccn3" Component={CountryDetail} />
        </Route>
      </Routes>

    </>
  )
}

export default App
