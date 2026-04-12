import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnalyzePage from "./pages/AnalyzePage";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b1326]">
      <Navbar />
      <AnalyzePage />
      <Footer />
    </div>
  );
};

export default App;
