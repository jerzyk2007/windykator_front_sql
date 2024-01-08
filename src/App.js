import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './components/context/DataProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Contacts from './components/Contacts';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <DataProvider>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/contacts' element={<Contacts />} />
          </Routes>
          <Footer />
        </DataProvider>
      </Router>
    </div>
  );
}

export default App;
