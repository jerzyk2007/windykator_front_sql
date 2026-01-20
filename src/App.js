import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import AddDataFromFile from "./components/system_settings/addData/AddDataFromFile";
import Login from "./components/Login";
import Register from "./components/user/Register";
import PersistLogin from "./components/PersistLogin";
// import RequireAuth from "./components/RequireAuth";
import ChangePassword from "./components/user/ChangePassword";
import UserSettings from "./components/system_settings/user_permissions/UserSettings";
import TableColumns from "./components/system_settings/tableColumns/TableColumns";
import RaportDepartments from "./components/raports/RaportDepartments";
import RaportDraft from "./components/FKRaport/RaportDraft";
import ChangeOrgStr from "./components/system_settings/changeStructure/ChangeOrgStr";
import OrganizationStructure from "./components/system_settings/structureData/OrganizationStructure";
import PrepareTable from "./components/table/PrepareTable";
import RaportsNora from "./components/Nora/RaportsNora";
import AddDoc from "./components/table/insuranceDocuments/AddDoc";
import EditDoc from "./components/table/insuranceDocuments/EditDoc";
import Instruction from "./components/user/instruction/Instruction";
import ConfirmResetPassword from "./components/user/ConfirmResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import StatuaryInterest from "./components/system_settings/statutoryInterest/StatutoryInterest";
import ContarctorSettings from "./components/system_settings/contractorSettings/ContractorSettings";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
        <Routes>
          {/* Publiczne trasy */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/password-confirm-reset/:token/"
            element={<ConfirmResetPassword />}
          />

          {/* Trasy chronione */}
          <Route element={<PersistLogin />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />

              {/* Grupa: Tabelka */}
              <Route
                path="/actual-table"
                element={<PrepareTable info={"actual"} profile={"insider"} />}
              />
              <Route
                path="/critical-table"
                element={<PrepareTable info={"critical"} profile={"insider"} />}
              />
              <Route
                path="/obligations-table"
                element={
                  <PrepareTable info={"obligations"} profile={"insider"} />
                }
              />
              <Route
                path="/archive-table"
                element={<PrepareTable info={"archive"} profile={"insider"} />}
              />
              <Route
                path="/all-data-table"
                element={<PrepareTable info={"all"} profile={"insider"} />}
              />
              <Route
                path="/krd"
                element={<PrepareTable info={"krd"} profile={"insider"} />}
              />
              <Route
                path="/fk-documents-table"
                element={
                  <PrepareTable info={"raport_fk"} profile={"insider"} />
                }
              />
              <Route
                path="/fk-disabled-documents-table"
                element={
                  <PrepareTable info={"disabled_fk"} profile={"insider"} />
                }
              />

              {/* Grupa: Kancelaria */}
              <Route
                path="/actual-law-table"
                element={<PrepareTable info={"ongoing"} profile={"partner"} />}
              />
              <Route
                path="/no-accept-table"
                element={
                  <PrepareTable info={"no-accept"} profile={"partner"} />
                }
              />

              {/* Grupa: Polisy */}
              <Route
                path="/actual-insurance-table"
                element={
                  <PrepareTable info={"vindication"} profile={"insurance"} />
                }
              />
              <Route
                path="/completed-insurance-table"
                element={
                  <PrepareTable info={"completed"} profile={"insurance"} />
                }
              />
              <Route
                path="/all-insurance-table"
                element={<PrepareTable info={"all"} profile={"insurance"} />}
              />
              <Route
                path="/settled-collection-charges"
                element={
                  <PrepareTable info={"settled"} profile={"insurance"} />
                }
              />
              <Route
                path="/pending-collection-charges"
                element={
                  <PrepareTable info={"pending"} profile={"insurance"} />
                }
              />
              <Route
                path="/add-insurance-document"
                element={<AddDoc profile={"new"} />}
              />
              <Route path="/edit-insurance-document" element={<EditDoc />} />

              <Route
                path="/all-kem"
                element={<PrepareTable info={"all-kem"} profile={"vindex"} />}
              />
              <Route
                path="/blocked"
                element={<PrepareTable info={"critical"} profile={"vindex"} />}
              />
              <Route
                path="/pre-collection"
                element={<PrepareTable info={"critical"} profile={"vindex"} />}
              />
              <Route
                path="/branch-collection"
                element={<PrepareTable info={"critical"} profile={"vindex"} />}
              />
              <Route
                path="/conractor-settings"
                element={<ContarctorSettings viewMode={"edit"} />}
              />
              <Route
                path="/conractor-single-raport"
                element={<ContarctorSettings viewMode={"raport"} />}
              />

              {/* Grupa: Raporty */}
              <Route
                path="/raport-departments"
                element={
                  <RaportDepartments
                    profile={"insider"}
                    reportType={"departments"}
                  />
                }
              />
              <Route
                path="/raport-advisers"
                element={
                  <RaportDepartments
                    profile={"insider"}
                    reportType={"advisers"}
                  />
                }
              />
              <Route
                path="/generate-raport-fk-KRT"
                element={<RaportDraft key="KRT" company="KRT" />}
              />
              <Route
                path="/generate-raport-fk-KEM"
                element={<RaportDraft key="KEM" company="KEM" />}
              />
              <Route
                path="/generate-raport-fk-RAC"
                element={<RaportDraft key="RAC" company="RAC" />}
              />
              <Route
                path="/control-bl-documents-table"
                element={
                  <PrepareTable info={"control-bl"} profile={"insider"} />
                }
              />
              <Route path="/raport-nora" element={<RaportsNora />} />

              {/* Grupa: System */}
              <Route path="/add-data" element={<AddDataFromFile />} />
              <Route path="/user-settings" element={<UserSettings />} />
              <Route path="/table-settings" element={<TableColumns />} />
              <Route
                path="/change-org-str"
                element={<OrganizationStructure />}
              />
              <Route
                path="/statutory-interest-calc"
                element={<StatuaryInterest type={"user"} />}
              />
              <Route
                path="/statutory-interest-settings"
                element={<StatuaryInterest type="admin" />}
              />

              <Route path="/create-org-str" element={<ChangeOrgStr />} />

              {/* Grupa: Użytkownik */}
              <Route path="/instruction" element={<Instruction />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
