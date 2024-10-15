import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Register } from "./pages/Register";
import { Information } from "./pages/Information";

export const router = createBrowserRouter([
    {
        path: '',
        element: <AuthContextProvider><Outlet/></AuthContextProvider>,
        children: [
            {
                path: '/information',
                element: <Information/>
            },
            {
                path: '/register',
                element: <Register/>   
            }
        ]
    },
    
    
])