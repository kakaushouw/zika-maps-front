import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/", { replace: true }); }, []);
  return null;
};

export default Index;
