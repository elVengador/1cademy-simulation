import React, { useCallback } from "react"

type NodeProps = {
  notebookRef: {
    selectedNode: string | null;
    chosingNode: boolean;
  },
  id: string;
  top: number;
  left: number;
  title: string;
  nodeUpdates: {
    nodeIds: string[],
    updatedAt: Date
  };
  onChoseNode: (nodeId: string, selectedNode: string) => void;
  setChosingNode: (chosingNode: boolean) => void;
  setSelectedNode: (selectedNode: string | null) => void;
}

const Node = ({
  id,
  top,
  left,
  title,
  notebookRef,
  onChoseNode,
  setChosingNode,
  setSelectedNode
}: NodeProps) => {
  console.log("node re-render", id);

  const onClick = useCallback(() => {
    if(!notebookRef.chosingNode || notebookRef.selectedNode === id) return;
    onChoseNode(id, notebookRef.selectedNode!);
  }, [])

  return (
    <div key={id} id={id} style={{ position: "absolute", top, left, border: "solid 2px royalBlue" }} onClick={onClick}>
      {title}
      {!notebookRef.chosingNode ? (
        <button onClick={() => {
          setChosingNode(true);
        }}>Start Chosing Node (Tag, Child, Parent, Reference)</button>
      ) : null}

      {id !== notebookRef.selectedNode ? (
        <button onClick={() => setSelectedNode(id)}>
          Select Node
        </button>
      ) : "NODE IS SELECTED"}
    </div>
  )
}

export const MemoizedNode = React.memo(Node, (prev, next) => {
  // if node is not updated don't render it
  if(prev.nodeUpdates.updatedAt === next.nodeUpdates.updatedAt || !next.nodeUpdates.nodeIds.includes(next.id)) return true;

  return false;

  /* return prev.id === next.id &&
    prev.left === next.left &&
    prev.top === next.top &&
    prev.onChoseNode === next.onChoseNode &&
    prev.title === next.title &&
    prev.setSelectedNode === next.setSelectedNode */
})