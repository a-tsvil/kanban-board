import { useQuery } from "@tanstack/react-query";
import { Column as ColumnData } from "@prisma/client";
import { useRef, useState } from "react";

import Column from "../column/Column.tsx";
import CreateColumn from "../create-column/CreateColumn.tsx";

import "./Board.css";

function Board() {
  const { data } = useQuery<ColumnData[]>({
    queryKey: ["columns"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/column");
      return await response.json();
    },
  });

  const [createColumnOpen, setCreateColumnOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={ref} className="board">
        <div>
          <h2>Board</h2>
        </div>
        <div className="columns">
          {data && data.map((column) => <Column key={column.id} {...column} />)}
          {!createColumnOpen && (
            <div>
              <button
                onClick={() => {
                  setCreateColumnOpen(true);
                  setTimeout(() => {
                    if (!ref.current) return;
                    console.log(ref.current);
                    ref.current.scrollLeft = 2000;
                  }, 10);
                }}
                className="add-column-btn"
              >
                +
              </button>
            </div>
          )}
          {createColumnOpen && (
            <div>
              <CreateColumn onCancel={() => setCreateColumnOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Board;
