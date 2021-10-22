export const DELETE_TILE = "DELETE_TILE";

export function createDeleteAction(tileId: string) {
  return {
    type: DELETE_TILE,
    tileId
  };
}
