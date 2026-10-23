import { useState } from "react";
import "./signup.css";
function Signup({ showLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const goToLogin = () => {
    resetForm();
    setError("");
    showLogin();
  };

  const handleSignup = async (event) => {
  event.preventDefault();
  setError("");

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
    setError("Please complete all fields.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error && data.error.includes("Duplicate")) {
        setError("An account with this email already exists.");
      } else {
        setError(data.error || "Unable to create your account.");
      }
      return;
    }

    alert("Account created successfully!");
    goToLogin();

  } catch (error) {
    console.error(error);
    setError("Could not connect to the server.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo">✈️ Wanderly</div>
        <h1>Create account</h1>
        <p className="subtitle">Start planning your next adventure.</p>

        <form onSubmit={handleSignup} autoComplete="off">
          <label htmlFor="signup-name">Full name</label>
          <input id="signup-name" type="text" name="name" autoComplete="off" placeholder="Enter your full name" value={name} onChange={(event) => setName(event.target.value)} required />

          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" type="email" name="email" autoComplete="off" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" type="password" name="new-password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input id="confirm-password" type="password" name="confirm-password" autoComplete="new-password" placeholder="Confirm your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />

          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
        </form>

        <p className="signup">
          Already have an account?
          <button type="button" className="text-button" onClick={showLogin}> Log In</button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
