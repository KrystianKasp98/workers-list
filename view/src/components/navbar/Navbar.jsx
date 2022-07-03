import { Link } from "react-router-dom";
import data from "./LinkList.json";
import "./css/navbar.sass"

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="list">
        {data.map((item) => (
          <li key={item.path}>
            <Link className="list-item" to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
