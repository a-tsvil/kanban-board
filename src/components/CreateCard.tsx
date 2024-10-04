import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./CreateCard.css";
import { useState } from "react";

function CreateCard({ onCancel }) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState();

  const mutation = useMutation({
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
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["columns"] });
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
              mutation.mutate({
                title,
              });
            }}
            className="create-case-btn"
          >
            +
          </button>
          <button onClick={() => onCancel()} className="create-case-btn">
            -
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCard;
