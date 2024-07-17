import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Contacts from "./components/Contacts";
import Home from "./components/Home";
import AddDataFromFile from "./components/AddDataFromFile";
import Login from "./components/Login";
import Register from "./components/Register";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import ChangePassword from "./components/ChangePassword";
import UserSettings from "./components/UserSettings";
import SystemSettings from "./components/SystemSettings";
import RaportDepartments from "./components/RaportDepartments";
import RaportAdvisers from "./components/RaportAdvisers";
import FKRaportSettings from "./components/FKRaport/FKRaportSettings";
import FKTableSettings from "./components/FKRaport/FKTableSettings";
import FKAddData from "./components/FKRaport/FKAddData";
import FKDataSettings from "./components/FKRaport/FKDataSettings";
import FKItems from "./components/FKRaport/FKItems";
import PrepareTable from "./components/PrepareTable";
import "./App.css";

const ROLES = {
  User: 100,
  Editor: 200,
  FK: 220,
  Admin: 300,
};

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={<RequireAuth allowedRoles={[ROLES.User, ROLES.FK]} />}
            >
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route
                path="/actual-table"
                element={<PrepareTable info={"actual"} />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route
                path="/archive-table"
                element={<PrepareTable info={"archive"} />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route
                path="/all-data-table"
                element={<PrepareTable info={"all"} />}
              />
            </Route>

            <Route
              element={
                <RequireAuth
                  allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]}
                />
              }
            >
              <Route
                path="/raport-departments"
                element={<RaportDepartments />}
              />
            </Route>

            <Route
              element={
                <RequireAuth
                  allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]}
                />
              }
            >
              <Route path="/raport-advisers" element={<RaportAdvisers />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.FK]} />}>
              <Route path="/fk-raport" element={<FKRaportSettings />} />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={[ROLES.FK, ROLES.Admin]} />}
            >
              <Route path="/fk-add-data" element={<FKAddData />} />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={[ROLES.FK, ROLES.Admin]} />}
            >
              <Route path="/fk-table-settings" element={<FKTableSettings />} />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={[ROLES.FK, ROLES.Admin]} />}
            >
              <Route path="/fk-data-settings" element={<FKDataSettings />} />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={[ROLES.FK, ROLES.Admin]} />}
            >
              <Route path="/fk-change-items" element={<FKItems />} />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />
              }
            >
              <Route path="/contacts" element={<Contacts />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="/add-data" element={<AddDataFromFile />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="/user-settings" element={<UserSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="/system-settings" element={<SystemSettings />} />
            </Route>

            <Route
              element={
                <RequireAuth
                  allowedRoles={[
                    ROLES.User,
                    ROLES.Editor,
                    ROLES.FK,
                    ROLES.Admin,
                  ]}
                />
              }
            >
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>
          </Route>
        </Routes>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
