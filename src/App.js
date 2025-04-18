import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Contacts from "./components/contacts/Contacts";
import Home from "./components/Home";
import AddDataFromFile from "./components/system_settings/AddDataFromFile";
import Login from "./components/Login";
import Register from "./components/user/Register";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import ChangePassword from "./components/user/ChangePassword";
import UserSettings from "./components/user_permissions/UserSettings";
import TableColumns from "./components/system_settings/TableColumns";
import RaportDepartments from "./components/raports/RaportDepartments";
import RaportAdvisers from "./components/raports/RaportAdvisers";
import FKAddData from "./components/FKRaport/FKAddData";
import DeptMapper from './components/system_settings/DeptMapper';
import Items from './components/system_settings/Items';
import PrepareTable from "./components/table/PrepareTable";
import RaportsNora from "./components/Nora/RaportsNora";
// import TradeCredit from "./components/trade_credit/TradeCredit";
import Instruction from "./components/instruction/Instruction";
import ResetPassword from "./components/user/ResetPassword";
import ConfirmResetPassword from "./components/user/ConfirmResetPassword";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
          <Route path="/password-confirm-reset/:token/" element={<ConfirmResetPassword />} />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[1, 100, 200]} />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1000]} />}>
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[100]} />}>
              <Route
                path="/actual-table"
                element={<PrepareTable info={"actual"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[100]} />}>
              <Route
                path="/obligations-table"
                element={<PrepareTable info={"obligations"} />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[100]} />}>
              <Route
                path="/archive-table"
                element={<PrepareTable info={"archive"} />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[100]} />}>
              <Route
                path="/all-data-table"
                element={<PrepareTable info={"all"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[110, 120, 1000]} />}>
              <Route
                path="/fk-documents-table"
                element={<PrepareTable info={"raport_fk"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route
                path="/fk-disabled-documents-table"
                element={<PrepareTable info={"disabled_fk"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[120, 1000]} />}>
              <Route
                path="/control-bl-documents-table"
                element={<PrepareTable info={"control-bl"} />}
              />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={[100, 110, 120, 1000]} />}
            >
              <Route
                path="/raport-departments"
                element={<RaportDepartments />}
              />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={[100, 110, 120, 1000]} />}
            >
              <Route path="/raport-advisers" element={<RaportAdvisers />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/fk-add-data" element={<FKAddData company={"KRT"} />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/dept-mapper" element={<DeptMapper />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/change-items" element={<Items />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[300, 1000]} />}>
              <Route path="/raport-nora" element={<RaportsNora />} />
            </Route>

            {/* <Route element={<RequireAuth allowedRoles={[300, 1000]} />}>
              <Route path="/trade-credit" element={<TradeCredit />} />
            </Route> */}

            <Route element={<RequireAuth allowedRoles={[110, 1000]} />}>
              <Route path="/contacts" element={<Contacts />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/add-data" element={<AddDataFromFile />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1000]} />}>
              <Route path="/user-settings" element={<UserSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1000]} />}>
              <Route path="/table-settings" element={<TableColumns />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1]} />}>
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1]} />}>
              <Route path="/instruction" element={<Instruction />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
