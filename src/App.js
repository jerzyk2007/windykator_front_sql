import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Contacts from './components/Contacts';
import Home from './components/Home';
import AddDataFromFile from './components/AddDataFromFile';
import Table from './components/Table';
import Login from './components/Login';
import Register from './components/Register';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
import ChangePassword from './components/ChangePassword';
import UserSettings from './components/UserSettings';
import TableSettings from './components/TableSettings';
import RaportDepartments from './components/RaportDepartments';
import './App.css';

const ROLES = {
  'User': 100,
  'Editor': 200,
  'Admin': 300
};

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='/login' element={<Login />} />
          {/* protected routes */}

          <Route element={<PersistLogin />}>

            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path='/' element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path='/register' element={<Register />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
              <Route path='/actual-table' element={<Table info={"actual"} />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
              <Route path='/archive-table' element={<Table info={"archive"} />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
              <Route path='/all-data-table' element={<Table info={"all"} />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
              <Route path='/raport' element={<RaportDepartments />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
              <Route path='/contacts' element={<Contacts />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path='/add-data' element={<AddDataFromFile />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path='/user-settings' element={<UserSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path='/table-settings' element={<TableSettings />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path='/change-password' element={<ChangePassword />} />
            </Route>

          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
