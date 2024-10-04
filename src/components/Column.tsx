import { useState } from "react";
import Card from "./Card.tsx";

import "./Column.css";
import CreateCard from "./CreateCard.tsx";
import { useDrop } from "react-dnd";

function Column({ id, title, cards, default: defaultColumn }) {
  const [createCaseOpen, setCrateCaseOpen] = useState(false);
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "card",
      drop: (item, monitor) => {
        console.log("column");
        const dropResult = monitor.getDropResult();
        const targetCardId = dropResult
          ? dropResult.cardId
          : cards && cards.length > 0
          cards[cards.length - 1].id
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
