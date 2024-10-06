import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import "./CreateCard.css";
import { useState } from "react";
import Check from "../icons/Check";
import Cancel from "../icons/Cancel";

type Props = {
  columnId: number;
  onCancel: () => void;
};

type CardData = {
  title: string;
};

function CreateCard({ columnId, onCancel }: Props) {
  const [title, setTitle] = useState<string>();

  const queryClient = useQueryClient();
  const columnQueryKey = `column-${columnId}`;

  const mutation = useMutation<void, DefaultError, CardData>({
    mutationFn: async (data) => {
      const response = await fetch("http://localhost:8000/api/card", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      console.log(columnQueryKey);
      queryClient.invalidateQueries({ queryKey: [columnQueryKey] });
      onCancel();
    },
  });

  return (
    <div className="card">
      <div className="create-card-layout">
        <input
          onChange={(evt) => setTitle(evt.currentTarget.value)}
          type="text"
        ></input>
        <div>
          <button
            onClick={() => {
              if (!title) return;
              mutation.mutate({
                title,
              });
            }}
            className="create-case-btn"
          >
            <Check />
          </button>
          <button onClick={() => onCancel()} className="create-case-btn">
            <Cancel />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCard;
