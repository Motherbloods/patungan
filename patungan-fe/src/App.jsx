import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import routes from "./config/routes";
import { GroupsProvider } from "./context/GroupContext";

function App() {
  return (
    <GroupsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </GroupsProvider>
  );
}

export default App;
