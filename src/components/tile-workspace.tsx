import React from "react";
import { useSelector } from "react-redux";
import { selectTiles } from "../store/selectors";
import { Tile } from "./tile";

import "./tiles.css";

export const TileWorkspace: React.FC = () => {
  const tiles = useSelector(selectTiles);

  return (
    <div className="tile-workspace">
      {tiles.map((t) => {
        const { id } = t;
        return <Tile tile={t} key={id} />;
      })}
    </div>
  );
};
