import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

import "./CreateColumn.css";
import Check from "../icons/Check";
import Cancel from "../icons/Cancel";

type ColumnProps = {
  onCancel: () => void;
};

type MutationData = { title: string };

function CreateColumn({ onCancel }: ColumnProps) {
  const [title, setTitle] = useState<string>();

  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, DefaultError, MutationData>({
    mutationFn: async (data) => {
      const response = await fetch("http://localhost:8000/api/column", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      onCancel();
    },
  });

  return (
    <div className="new-column">
      <div className="column-header">
        <div className="create-card-layout">
          <input
            onChange={(evt) => setTitle(evt.currentTarget.value)}
            type="text"
          ></input>
          <div className="create-column-title-buttons">
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
    </div>
  );
}

export default CreateColumn;
