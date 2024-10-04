import moment from "moment";

import "./Card.css";
import { useDrag, useDrop } from "react-dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function Card({ id, title, progress, ordering, updatedAt, columnId }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `http://localhost:8000/api/column/${data.newColumn}/card/${data.currentId}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "card",
    item: { title, cardId: id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      console.log(dropResult);
      console.log(id, ordering);
      if (dropResult.targetCardId !== null && dropResult.targetCardId === id) {
        return;
      }
      if (dropResult.columnId !== null && dropResult.columnId < columnId) {
        return;
      }
      let newOrdering;
      if (dropResult.ordering === null) {
        newOrdering = dropResult.lastOrdering + 1;
      } else {
        newOrdering = dropResult.ordering;
      }
      mutation.mutate({
        currentId: id,
        currentOrdering: ordering,
        newId: dropResult.targetCardId,
        newOrdering,
        newColumn: dropResult.columnId,
      });
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "card",
    drop: () => ({ cardId: id, ordering }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  function attachRef(el) {
    drag(el);
    drop(el);
  }
  return (
    <div ref={attachRef} className="card-wrapper">
      <div className="card">
        <div>
          <h3 className="card-title">{title}</h3>
          <div>{progress}</div>
          <div className="card-updated-at">
            Updated {moment(updatedAt).startOf("hour").fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
