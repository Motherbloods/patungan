import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import routes from "./config/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {routes.map((route, index) => {
            return route.redirectTo ? (
              <Route
                key={index}
                path={route.path}
                element={<Navigate to={route.redirectTo} />}
              ></Route>
            ) : (
              <Route
                index={index}
                path={route.path}
                element={route.element}
              ></Route>
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
