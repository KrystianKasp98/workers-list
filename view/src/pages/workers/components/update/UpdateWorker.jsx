import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Titlepage from "../../../../components/titlepage/Titlepage";
import MySqlApi from "../../../../api/mysqlApi";
import "./css/updateWorker.sass"

function UpdateWorker() {
  const [worker, setWorker] = useState(null);
  const [inputs, setInputs] = useState(null);
  const params = useParams();

  useEffect(() => {
    const main = async () => {
      await handleFetchWorker(params.workerCode);
    }
    main();
  }, [])
  
  const handleFetchWorker = async (workerCode) => {
    const worker = await MySqlApi.getWorker(workerCode);
    delete worker.createdAt;
    delete worker.updatedAt;
    delete worker.idWorker;
    setWorker(worker);
    setInputs({ ...worker });
  }

  const handleChangeInput = (e, prop) => {
    const newInput = inputs;
    newInput[prop] = e.target.value;
    setInputs({ ...newInput });
  }

  return (
    <>
      <Titlepage title={params.workerCode} />
      <div className="wrapper-form--worker">
        {worker && (
          <form onSubmit={async(e) => {
            e.preventDefault();
            const result = await MySqlApi.updateWorker(params.workerCode, inputs);
            console.log(result);
            setWorker(result);
          }}>
            {Object.keys(worker).map((key) => (
              <div key={key}>
                <label>
                  {key}
                  {inputs && (
                    <input
                      type="text"
                      defaultValue={inputs[key]}
                      disabled={key === "workerCode"}
                      onChange={e => handleChangeInput(e, key)}
                    />
                  )}
                </label>
              </div>
            ))}
            <button>update</button>
          </form>
        )}
      </div>
    </>
  );
}

export default UpdateWorker;