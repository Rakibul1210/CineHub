import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.clearToken();
    navigate("/login");
  }, [navigate]);

  return null;
};

export default LogOut;