import Titlepage from "../../components/titlepage/Titlepage";
import WorkersTable from "./components/table/WorkersTable";

function Workers() {
  return (
    <div>
      <Titlepage title={"Workers list"} />
      <WorkersTable />
    </div>
  );
}

export default Workers;
