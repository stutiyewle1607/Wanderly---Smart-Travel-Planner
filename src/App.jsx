import { useContext, useState } from "react";
import Login from "./components/login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { UserContext } from "./context/UserContext";

function App() {
  const { user } = useContext(UserContext);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      {user ? (
        <Dashboard />
      ) : showSignup ? (
        <Signup showLogin={() => setShowSignup(false)} />
      ) : (
        <Login showSignup={() => setShowSignup(true)} />
      )}
    </>
  );
}
export default App;