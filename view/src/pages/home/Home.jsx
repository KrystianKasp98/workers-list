import Diagram from "./components/diagram/Diagram";
import Titlepage from "../../components/titlepage/Titlepage";

function Home() {
  return (
    <div>
      <Titlepage title={"Homepage"} />
      <Diagram />
    </div>
  );
}

export default Home;
