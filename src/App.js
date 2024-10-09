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
import RaportsNora from "./components/Nora/RaportsNora";
import TradeCredit from "./components/TradeCredit";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[100, 200, 1]} />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1000, 150]} />}>
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

            <Route
              element={<RequireAuth allowedRoles={[100, 110, 150, 1000]} />}
            >
              <Route
                path="/raport-departments"
                element={<RaportDepartments />}
              />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={[100, 110, 150, 1000]} />}
            >
              <Route path="/raport-advisers" element={<RaportAdvisers />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200]} />}>
              <Route path="/fk-raport" element={<FKRaportSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/fk-add-data" element={<FKAddData />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/fk-table-settings" element={<FKTableSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/fk-data-settings" element={<FKDataSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[200, 1000]} />}>
              <Route path="/fk-change-items" element={<FKItems />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[300, 1000]} />}>
              <Route path="/raport-nora" element={<RaportsNora />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[300, 1000]} />}>
              <Route path="/trade-credit" element={<TradeCredit />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[110, 1000]} />}>
              <Route path="/contacts" element={<Contacts />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[120, 150, 1000]} />}>
              <Route path="/add-data" element={<AddDataFromFile />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[150, 1000]} />}>
              <Route path="/user-settings" element={<UserSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[150, 1000]} />}>
              <Route path="/system-settings" element={<SystemSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1]} />}>
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
