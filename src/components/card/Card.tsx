import moment from "moment";

import "./Card.css";
import useDragAndDrop from "./useDragAndDrop";

type Props = {
  id: number;
  title: string;
  progress: number;
  ordering: number;
  updatedAt: Date;
  columnId: number;
};

function Card({ id, title, progress, ordering, updatedAt, columnId }: Props) {
  const attachRef = useDragAndDrop(id, ordering, columnId);

  return (
    <div ref={attachRef} className="card-wrapper">
      <div className="card">
        <div>
          <h3 className="card-title">{title}</h3>
          <div>
            {progress} id:{id} order:{ordering}
          </div>
          <div className="card-updated-at">
            Updated {moment(updatedAt).startOf("hour").fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
