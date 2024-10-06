import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

import Pencil from "../icons/Pencil";
import Check from "../icons/Check";
import Cancel from "../icons/Cancel";
import ColumnPopup from "./ColumnPopup";

import "./ColumnTitle.css";

type Props = {
  title: string;
  columnId: number;
  canDelete: boolean;
};

type ColumnData = {
  title: string;
};

function ColumnTitle({ title, columnId, canDelete = false }: Props) {
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState<string>();
  const [showError, setShowError] = useState(false);

  const queryClient = useQueryClient();
  const columnQueryKey = `column-${columnId}`;

  const updateColumn = useMutation<void, DefaultError, ColumnData>({
    mutationFn: async (data) => {
      const response = await fetch(
        `http://localhost:8000/api/column/${columnId}`,
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
      queryClient.invalidateQueries({ queryKey: [columnQueryKey] });
      setEditTitleOpen(false);
    },
  });

  const deleteColumn = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `http://localhost:8000/api/column/${columnId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status >= 400) {
        setShowError(true);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  return (
    <>
      <div className="column-header">
        {editTitleOpen ? (
          <div className="create-card-layout">
            <input
              onChange={(evt) => setNewTitle(evt.currentTarget.value)}
              type="text"
            ></input>
            <div className="title-buttons">
              <button
                onClick={() => {
                  if (!newTitle) return;
                  updateColumn.mutate({
                    title: newTitle,
                  });
                }}
                className="create-case-btn"
              >
                <Check />
              </button>
              <button
                onClick={() => setEditTitleOpen(false)}
                className="create-case-btn"
              >
                <Cancel />
              </button>
            </div>
          </div>
        ) : (
          <div className="column-title">
            <div className="header-and-edit">
              <h3>{title.toUpperCase()}</h3>
              <button
                className="title-edit-button"
                onClick={() => setEditTitleOpen(true)}
              >
                <Pencil />
              </button>
            </div>
            <ColumnPopup
              disableDelete={!canDelete}
              onDeleteClick={() => {
                deleteColumn.mutate();
              }}
            />
          </div>
        )}
      </div>
      {showError && (
        <div className="error-notification">
          <div>Some error happens!</div>
        </div>
      )}
    </>
  );
}

export default ColumnTitle;
