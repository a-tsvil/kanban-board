import { useQuery } from "@tanstack/react-query";

import "./Board.css";
import Column from "./Column";

function Board() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["columns"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/column");
      return await response.json();
    },
  });

  console.log(data);

  return (
    <>
      <div className="board">
        <div>
          <h2>Board</h2>
        </div>
        <div className="columns">
          {data && data.map((column) => <Column key={column.id} {...column} />)}
          <div>
            <button className="add-column-btn">+</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Board;
