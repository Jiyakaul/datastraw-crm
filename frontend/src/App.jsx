import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<TicketList />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/tickets/:ticket_id" element={<TicketDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
