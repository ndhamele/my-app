import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { PORT } from "./index";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${PORT}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        authContext?.login(data.token, data.role);
        navigate("/dashboard");
      } else {
        setError("Login failed: " + response.statusText);
      }
    } catch (error: any) {
      console.log(error);
      setError("Network error: " + error.message);
    }
  };

  return (
    <form
      className="container w-auto card"
      style={{ marginTop: 20 }}
      onSubmit={handleSubmit}
    >
      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
        <div id="emailHelp" className="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          id="exampleInputPassword1"
        />
      </div>
      <button
        type="submit"
        style={{ marginBottom: 20 }}
        className="btn btn-primary"
      >
        Login
      </button>
      {error && <div>{error}</div>}
    </form>
  );
}

export default Login;
