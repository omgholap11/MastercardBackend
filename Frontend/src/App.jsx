import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Chatbot from "./components/Chatbot/Chatbot/Chatbot.jsx";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Chatbot />
    </>
  );
}

export default App;
