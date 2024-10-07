import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

type CardMoveData = {
  targetColumnId: number;
  newOrdering: number;
};

function useDragAndDrop(id: number, ordering: number, columnId: number) {
  const [targetColumnId, setTargetColumnId] = useState<number>();

  const queryClient = useQueryClient();

  const mutation = useMutation<void, DefaultError, CardMoveData>({
    mutationFn: async (data) => {
      const response = await fetch(`http://localhost:8000/api/card/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`column-${columnId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`column-${targetColumnId}`],
      });
    },
  });

  type DropResult = {
    targetCardId: number;
    columnId: number;
    newOrdering: number;
  };

  const [, drag] = useDrag(
    () => ({
      type: "card",
      item: { cardId: id },
      end: (_, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();

        if (!dropResult) {
          return;
        }
        if (
          dropResult.targetCardId === id &&
          dropResult.columnId === columnId &&
          dropResult.newOrdering - 1 === ordering
        ) {
          return;
        }
        setTargetColumnId(dropResult.columnId);
        mutation.mutate({
          newOrdering: dropResult.newOrdering,
          targetColumnId: dropResult.columnId,
        });
      },
    }),
    [id, ordering]
  );

  const [{ isOverCard }, drop] = useDrop(
    () => ({
      accept: "card",
      drop: () => ({ cardId: id, targetCardOrdering: ordering }),
      collect: (monitor) => {
        return {
          isOverCard: monitor.isOver(),
        };
      },
    }),
    [id, ordering]
  );

  function attachRef(el: HTMLDivElement) {
    drag(el);
    drop(el);
  }

  return [attachRef, isOverCard];
}

export default useDragAndDrop;
