import { Route, Routes } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import CountryDetail from "./components/CountryDetail"
import FavoritesPage from "./components/FavoritesPage"
import PageLayout from "./layouts/PageLayout"
import { FavoritesProvider } from "./context/FavoritesContext"

function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route Component={PageLayout}>
          <Route index Component={Dashboard} />
          <Route path="countries/:ccn3" Component={CountryDetail} />
          <Route path="favorites" Component={FavoritesPage} />
        </Route>
      </Routes>
    </FavoritesProvider>
  )
}

export default App
