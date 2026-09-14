import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StartInterview from "./pages/StartInterview";
import Interview from "./pages/Interview";
import Result from "./pages/Result";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/start-interview"
                    element={
                        <ProtectedRoute>
                            <StartInterview />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                  path="/interview"
                  element={<Navigate to="/start-interview" replace />}
                />
 

                <Route
                    path="/interview/:id"
                    element={
                        <ProtectedRoute>
                            <Interview />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/result/:id"
                    element={
                        <ProtectedRoute>
                            <Result />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;