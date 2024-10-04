import { useState } from "react";
import Card from "./Card.tsx";

import "./Column.css";
import CreateCard from "./CreateCard.tsx";
import { useDrop } from "react-dnd";
import { useQuery } from "@tanstack/react-query";
import { Card as CardData } from "@prisma/client";

type ColumnProps = {
  id: number;
  title: string;
  default: boolean;
};

function Column({ id, title, default: defaultColumn }: ColumnProps) {
  const columnQueryKey = `column-${id}`;

  const [createCaseOpen, setCrateCaseOpen] = useState(false);

  const { isPending, error, data, isFetching } = useQuery<CardData>({
    queryKey: [columnQueryKey],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/column");
      return await response.json();
    },
  });

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "card",
      drop: (item, monitor) => {
        console.log("column");
        const dropResult = monitor.getDropResult();
        const targetCardId = dropResult
          ? dropResult.cardId
          : cards && cards.length > 0
          ? cards[cards.length - 1].id
          : null;
        console.log(dropResult);
        console.log(cards);
        return {
          targetCardId,
          columnId: id,
          lastOrdering:
            cards && cards.length > 0 ? cards[cards.length - 1].ordering : 0,
        };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [cards]
  );

  return (
    <div ref={drop} className="column">
      <div className="column-header">
        <h3>{title.toUpperCase()}</h3>
      </div>
      <div className="cards">
        {cards && cards.map((card) => <Card key={card.id} {...card} />)}
      </div>
      {defaultColumn && createCaseOpen && (
        <CreateCard onCancel={() => setCrateCaseOpen(false)} />
      )}
      <div className="add-case-block">
        {defaultColumn && (
          <button onClick={() => setCrateCaseOpen(true)} className="add-case">
            + Create Case
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;
