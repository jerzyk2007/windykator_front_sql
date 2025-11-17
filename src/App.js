import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
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
import ChangeOrgStr from "./components/system_settings/ChangeOrgStr";
import OrganizationStructure from "./components/system_settings/OrganizationStructure";
import PrepareTable from "./components/table/PrepareTable";
import RaportsNora from "./components/Nora/RaportsNora";
// import TradeCredit from "./components/trade_credit/TradeCredit";
import Instruction from "./components/instruction/Instruction";
import ConfirmResetPassword from "./components/user/ConfirmResetPassword";
// import RaportAreas from "./components/raports/RaportAreas";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true, // 👈 dodaj to
        }}
      >
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/password-confirm-reset/:token/"
            element={<ConfirmResetPassword />}
          />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={
                <RequireAuth allowedRoles={[1, 100, 200, 201, 202, 2000]} />
              }
            >
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1000, 2000]} />}>
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[100, 2000]} />}>
              <Route
                path="/actual-table"
                element={<PrepareTable info={"actual"} profile={"insider"} />}
                // element={<PrepareTable info={"actual"} profile={"partner"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[100, 2000]} />}>
              <Route
                path="/critical-table"
                element={<PrepareTable info={"critical"} profile={"insider"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[100, 2000]} />}>
              <Route
                path="/obligations-table"
                element={
                  <PrepareTable info={"obligations"} profile={"insider"} />
                }
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[100, 2000]} />}>
              <Route
                path="/archive-table"
                element={<PrepareTable info={"archive"} profile={"insider"} />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[100, 2000]} />}>
              <Route
                path="/all-data-table"
                element={<PrepareTable info={"all"} profile={"insider"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[150, 1000, 2000]} />}>
              <Route
                path="/krd"
                element={<PrepareTable info={"krd"} profile={"insider"} />}
              />
            </Route>
            <Route
              element={<RequireAuth allowedRoles={[110, 120, 1000, 2000]} />}
            >
              <Route
                path="/fk-documents-table"
                element={
                  <PrepareTable info={"raport_fk"} profile={"insider"} />
                }
              />
            </Route>
            <Route
              element={
                <RequireAuth allowedRoles={[200, 201, 202, 1000, 2000]} />
              }
            >
              <Route
                path="/fk-disabled-documents-table"
                element={
                  <PrepareTable info={"disabled_fk"} profile={"insider"} />
                }
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[120, 1000, 2000]} />}>
              <Route
                path="/control-bl-documents-table"
                element={
                  <PrepareTable info={"control-bl"} profile={"insider"} />
                }
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[500]} />}>
              <Route
                path="/ongoing-law-table"
                element={<PrepareTable info={"ongoing"} profile={"partner"} />}
              />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[100, 110, 120, 1000, 2000]} />
              }
            >
              <Route
                path="/raport-departments"
                element={<RaportDepartments profile={"insider"} />}
              />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[100, 110, 120, 1000, 2000]} />
              }
            >
              <Route
                path="/raport-advisers"
                element={<RaportAdvisers profile={"insider"} />}
              />
            </Route>
            {/* <Route element={<RequireAuth allowedRoles={[1000]} />}>
              <Route path="/raport-areas" element={<RaportAreas />} />
            </Route> */}

            {/* <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/generate-raport-fk-KRT" element={<FKAddData company={"KRT"} />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/generate-raport-fk-KEM" element={<FKAddData company={"KEM"} />} />
            </Route> */}

            {/* dodanie key powoduje, że kompnent się odświeża */}
            <Route element={<RequireAuth allowedRoles={[200, 1000, 2000]} />}>
              <Route
                path="/generate-raport-fk-KRT"
                element={<FKAddData key="KRT" company="KRT" />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[201, 1000, 2000]} />}>
              <Route
                path="/generate-raport-fk-KEM"
                element={<FKAddData key="KEM" company="KEM" />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[202, 1000, 2000]} />}>
              <Route
                path="/generate-raport-fk-RAC"
                element={<FKAddData key="RAC" company="RAC" />}
              />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[200, 201, 202, 1000, 2000]} />
              }
            >
              <Route path="/create-org-str" element={<ChangeOrgStr />} />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[200, 201, 202, 1000, 2000]} />
              }
            >
              <Route
                path="/change-org-str"
                element={<OrganizationStructure />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[300, 1000, 2000]} />}>
              <Route path="/raport-nora" element={<RaportsNora />} />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[200, 201, 202, 1000, 2000]} />
              }
            >
              <Route path="/add-data" element={<AddDataFromFile />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1000, 2000]} />}>
              <Route path="/user-settings" element={<UserSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1000, 2000]} />}>
              <Route path="/table-settings" element={<TableColumns />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1, 2000]} />}>
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1, 2000]} />}>
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
