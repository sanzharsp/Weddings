import Main from "../pages/main/main"
import Detail from "../pages/detail/detail" 
import {useRoutes} from "react-router-dom";


const Routings = (props) => {
    let routes = useRoutes([
      { path: "/", element: <Main/> },
      { path: "post/:id" ,element:<Detail />},

    ]);
    return routes;
}
export default Routings