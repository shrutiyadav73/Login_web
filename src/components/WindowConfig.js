import { useNavigate } from "react-router";

export default function WindowConfig() {
    const navigate = useNavigate();
    window.redirect = navigate
}
