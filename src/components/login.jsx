import { useEffect, useState, useContext } from "react";
import "./login.css";
import { UserContext } from "../context/UserContext";
function Login({ showSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useContext(UserContext);

    useEffect(() => {
      setEmail("");
      setPassword("");
    }, []);

    const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid Email or Password");
      return;
    }

    alert("Login Successful");
    localStorage.setItem("token", data.token);
    setUser(data.user);

  } catch (error) {
    console.error(error);
    alert("Could not connect to the server.");
  }
};

  return (
  <div className="login-page">
    <div className="login-container">
      <div className="logo">
        ✈️ Wanderly
        </div>
      <h1>Welcome Back</h1>
      <p className="subtitle">
        Login to continue planning your adventures.
      </p>
      <form onSubmit={handleLogin} autoComplete="off">
    <label>Email</label>
    <input
        type="email"
        name="username"
        autoComplete="username"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setEmail("")}
    />
    <label>Password</label>
    <input
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setPassword("")}
    />
    <div className="options">
        <label className="remember">
            <input type="checkbox" />
            Remember Me
        </label>
        <a href="#">Forgot Password?</a>
    </div>
    <button type="submit">
        Login
    </button>
</form>
<p className="signup">
    Don't have an account?
    <button type="button" className="text-button" onClick={showSignup}> Sign Up</button>
</p>
    </div>
  </div>
  );
}
export default Login;
