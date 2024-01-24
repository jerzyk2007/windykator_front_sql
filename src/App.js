import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Contacts from './components/Contacts';
import Home from './components/Home';
import AddDataFromFile from './components/AddDataFromFile';
import ActualTable from './components/ActualTable';
import Login from './components/Login';
import Register from './components/Register';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
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
              <Route path='/actual-table' element={<ActualTable info={"actual"} />} />
              <Route path='/archive-table' element={<ActualTable info={"archive"} />} />
              <Route path='/all-data-table' element={<ActualTable info={"all"} />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
              <Route path='/contacts' element={<Contacts />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
              <Route path='/add-data' element={<AddDataFromFile />} />
            </Route>

          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
