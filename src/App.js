import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "./store";
import ChatWindow from "./component/chatInterface/ChatWindow";
import Home from "./component/home/Home";
import { useSelector } from "react-redux";
import Login from "./component/auth/Login";
import Signup from "./component/auth/Signup";
import { loadUser } from "./actions/userAction";
import PrivateRoute from "./component/routes/ProtectedRoutes";
import NotFound from "./component/notFound/NotFound";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/*" element={<NotFound />} />
        <Route
          exact
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} isUser={user}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/chat"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} isUser={user}>
              <ChatWindow />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
