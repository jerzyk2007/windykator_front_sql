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
import RequireAuth from "./components/RequireAuth";
import ChangePassword from "./components/user/ChangePassword";
import UserSettings from "./components/user_permissions/UserSettings";
import TableColumns from "./components/system_settings/tableColumns/TableColumns";
import RaportDepartments from "./components/raports/RaportDepartments";
import RaportDraft from "./components/FKRaport/RaportDraft";
import ChangeOrgStr from "./components/system_settings/changeStructure/ChangeOrgStr";
import OrganizationStructure from "./components/system_settings/structureData/OrganizationStructure";
import PrepareTable from "./components/table/PrepareTable";
import RaportsNora from "./components/Nora/RaportsNora";
import AddDoc from "./components/table/insuranceDocuments/AddDoc";
import EditDoc from "./components/table/insuranceDocuments/EditDoc";
import Instruction from "./components/instruction/Instruction";
import ConfirmResetPassword from "./components/user/ConfirmResetPassword";
// import { getRolesForPath } from "./components/menu/menuConfig";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
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
                path="/actual-law-table"
                element={<PrepareTable info={"ongoing"} profile={"partner"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[500]} />}>
              <Route
                path="/no-accept-table"
                element={
                  <PrepareTable info={"no-accept"} profile={"partner"} />
                }
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[150, 350]} />}>
              <Route
                path="/actual-insurance-table"
                element={
                  <PrepareTable info={"vindication"} profile={"insurance"} />
                }
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[150, 350]} />}>
              <Route
                path="/completed-insurance-table"
                element={
                  <PrepareTable info={"completed"} profile={"insurance"} />
                }
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[150, 350]} />}>
              <Route
                path="/all-insurance-table"
                element={<PrepareTable info={"all"} profile={"insurance"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[150]} />}>
              <Route
                path="/settled-collection-charges"
                element={
                  <PrepareTable info={"settled"} profile={"insurance"} />
                }
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[150, 350]} />}>
              <Route
                path="/pending-collection-charges"
                element={
                  <PrepareTable info={"pending"} profile={"insurance"} />
                }
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[150, 350]} />}>
              <Route
                path="/add-insurance-document"
                element={<AddDoc profile={"new"} />}
              />
            </Route>
            <Route element={<RequireAuth allowedRoles={[150]} />}>
              <Route path="/edit-insurance-document" element={<EditDoc />} />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[100, 110, 120, 1000, 2000]} />
              }
            >
              <Route
                path="/raport-departments"
                element={
                  <RaportDepartments
                    profile={"insider"}
                    reportType={"departments"}
                  />
                }
              />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[100, 110, 120, 1000, 2000]} />
              }
            >
              <Route
                path="/raport-advisers"
                element={
                  <RaportDepartments
                    profile={"insider"}
                    reportType={"advisers"}
                  />
                }
              />
            </Route>

            {/* dodanie key powoduje, że kompnent się odświeża */}
            <Route element={<RequireAuth allowedRoles={[200, 1000, 2000]} />}>
              <Route
                path="/generate-raport-fk-KRT"
                element={<RaportDraft key="KRT" company="KRT" />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[201, 1000, 2000]} />}>
              <Route
                path="/generate-raport-fk-KEM"
                element={<RaportDraft key="KEM" company="KEM" />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={[202, 1000, 2000]} />}>
              <Route
                path="/generate-raport-fk-RAC"
                element={<RaportDraft key="RAC" company="RAC" />}
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
// function App() {
//   return (
//     <div className="App">
//       <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//         <Header />
//         <Routes>
//           {/* TRASY PUBLICZNE */}
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/password-confirm-reset/:token/"
//             element={<ConfirmResetPassword />}
//           />

//           {/* TRASY CHRONIONE */}
//           <Route element={<PersistLogin />}>
//             {/* Strona Główna */}
//             <Route
//               element={<RequireAuth allowedRoles={getRolesForPath("/")} />}
//             >
//               <Route path="/" element={<Home />} />
//             </Route>

//             {/* Rejestracja */}
//             <Route
//               element={
//                 <RequireAuth allowedRoles={getRolesForPath("/register")} />
//               }
//             >
//               <Route path="/register" element={<Register />} />
//             </Route>

//             {/* Grupa tabel (jeśli mają te same role, możesz je zgrupować) */}
//             <Route
//               element={
//                 <RequireAuth allowedRoles={getRolesForPath("/actual-table")} />
//               }
//             >
//               <Route
//                 path="/actual-table"
//                 element={<PrepareTable info="actual" profile="insider" />}
//               />
//               <Route
//                 path="/critical-table"
//                 element={<PrepareTable info="critical" profile="insider" />}
//               />
//               <Route
//                 path="/obligations-table"
//                 element={<PrepareTable info="obligations" profile="insider" />}
//               />
//               <Route
//                 path="/archive-table"
//                 element={<PrepareTable info="archive" profile="insider" />}
//               />
//               <Route
//                 path="/all-data-table"
//                 element={<PrepareTable info="all" profile="insider" />}
//               />
//             </Route>

//             {/* KRD */}
//             <Route
//               element={<RequireAuth allowedRoles={getRolesForPath("/krd")} />}
//             >
//               <Route
//                 path="/krd"
//                 element={<PrepareTable info="krd" profile="insider" />}
//               />
//             </Route>

//             {/* Raporty FK */}
//             <Route
//               element={
//                 <RequireAuth
//                   allowedRoles={getRolesForPath("/fk-documents-table")}
//                 />
//               }
//             >
//               <Route
//                 path="/fk-documents-table"
//                 element={<PrepareTable info="raport_fk" profile="insider" />}
//               />
//             </Route>

//             {/* Polisy - Windykacja */}
//             <Route
//               element={
//                 <RequireAuth
//                   allowedRoles={getRolesForPath("/actual-insurance-table")}
//                 />
//               }
//             >
//               <Route
//                 path="/actual-insurance-table"
//                 element={
//                   <PrepareTable info="vindication" profile="insurance" />
//                 }
//               />
//               <Route
//                 path="/completed-insurance-table"
//                 element={<PrepareTable info="completed" profile="insurance" />}
//               />
//               <Route
//                 path="/all-insurance-table"
//                 element={<PrepareTable info="all" profile="insurance" />}
//               />
//             </Route>

//             {/* Dodawanie / Edycja Dokumentów */}
//             <Route
//               element={
//                 <RequireAuth
//                   allowedRoles={getRolesForPath("/add-insurance-document")}
//                 />
//               }
//             >
//               <Route
//                 path="/add-insurance-document"
//                 element={<AddDoc profile="new" />}
//               />
//             </Route>

//             <Route
//               element={
//                 <RequireAuth
//                   allowedRoles={getRolesForPath("/edit-insurance-document")}
//                 />
//               }
//             >
//               <Route path="/edit-insurance-document" element={<EditDoc />} />
//             </Route>

//             {/* Ustawienia Systemowe */}
//             <Route
//               element={
//                 <RequireAuth allowedRoles={getRolesForPath("/user-settings")} />
//               }
//             >
//               <Route path="/user-settings" element={<UserSettings />} />
//               <Route path="/table-settings" element={<TableColumns />} />
//             </Route>

//             <Route
//               element={
//                 <RequireAuth
//                   allowedRoles={getRolesForPath("/change-org-str")}
//                 />
//               }
//             >
//               <Route
//                 path="/change-org-str"
//                 element={<OrganizationStructure />}
//               />
//               <Route path="/create-org-str" element={<ChangeOrgStr />} />
//             </Route>

//             {/* Instrukcja i Hasło */}
//             <Route
//               element={
//                 <RequireAuth allowedRoles={getRolesForPath("/instruction")} />
//               }
//             >
//               <Route path="/instruction" element={<Instruction />} />
//               <Route path="/change-password" element={<ChangePassword />} />
//             </Route>
//           </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }
export default App;
