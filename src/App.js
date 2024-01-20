import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Contacts from './components/Contacts';
import Home from './components/Home';
import AddDataFromFile from './components/AddDataFromFile';
import ActualTable from './components/ActualTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/actual-table' element={<ActualTable />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/add-data' element={<AddDataFromFile />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
