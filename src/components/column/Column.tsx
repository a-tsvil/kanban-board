import { useState } from "react";
import Card from "../card/Card.tsx";

import CreateCard from "../create-card/CreateCard.tsx";
import { useDrop } from "react-dnd";
import { useQuery } from "@tanstack/react-query";
import { Prisma } from "@prisma/client";
import ColumnTitle from "./ColumnTitle.tsx";

import "./Column.css";

type ColumnWithCards = Prisma.ColumnGetPayload<{ include: { cards: true } }>;

type ColumnProps = {
  id: number;
  default: boolean;
};

type DropResult = {
  cardId: number;
  targetCardOrdering: number;
};

function Column({ id, default: defaultColumn }: ColumnProps) {
  const columnQueryKey = `column-${id}`;

  const [createCaseOpen, setCrateCaseOpen] = useState(false);

  const { data } = useQuery<ColumnWithCards>({
    queryKey: [columnQueryKey],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/api/column/${id}`);
      return await response.json();
    },
  });

  const cards = data?.cards;

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      drop: (_, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();
        const targetCardId = dropResult
          ? dropResult.cardId
          : cards && cards.length > 0
          ? cards[cards.length - 1].id
          : null;

        let newOrdering =
          cards && cards.length > 0 ? cards[cards.length - 1].ordering + 1 : 0;

        if (dropResult) {
          if (dropResult.targetCardOrdering >= 0) {
            newOrdering = dropResult.targetCardOrdering + 1;
          }
        }

        return {
          targetCardId,
          columnId: id,
          newOrdering,
        };
      },
    }),
    [cards]
  );

  if (!cards) return null;

  return (
    <div ref={drop} className="column">
      <ColumnTitle
        columnId={id}
        title={data.title}
        canDelete={cards.length === 0}
      />
      <div className="cards">
        {cards && cards.map((card) => <Card key={card.id} {...card} />)}
      </div>
      <div className="new-card">
        {defaultColumn && createCaseOpen && (
          <CreateCard columnId={id} onCancel={() => setCrateCaseOpen(false)} />
        )}
      </div>
      <div className="add-case-block">
        {defaultColumn && !createCaseOpen && (
          <button onClick={() => setCrateCaseOpen(true)} className="add-case">
            + Create Case
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;
