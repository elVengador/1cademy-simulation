import React, { useCallback } from "react"

type NodeProps = {
  id: string;
  top: number;
  left: number;
  title: string;
  selectedNode: string | null;
  onChoseNode: (nodeId: string, selectedNode: string | null) => void;
  // chosingNode: boolean;
  setChosingNode: (chosingNode: boolean) => void;
  setSelectedNode: (selectedNode: string | null) => void;
}

const Node = ({
  id,
  top,
  left,
  title,
  selectedNode,
  onChoseNode,
  setChosingNode,
  setSelectedNode
}: NodeProps) => {
  console.log("node re-render", id);

  // const onClick = useCallback(() => {
  //   if (!selectedNode) return
  //   if (!chosingNode || selectedNode === id) return;
  //   onChoseNode(id, selectedNode);
  // }, [chosingNode, selectedNode])

  return (
    <div
      key={id} id={id}
      style={{ position: "absolute", top, left, border: "solid 2px royalBlue" }}
      onClick={() => onChoseNode(id, selectedNode)}>
      {title}
      <button onClick={() => {
        setChosingNode(true);
      }}>Select Chosing Node </button>

      {id !== selectedNode ? (
        <button onClick={() => setSelectedNode(id)}>
          Select Node
        </button>
      ) : "NODE IS SELECTED"}
    </div>
  )
}

export const MemoizedNode = React.memo(Node, (prev, next) => {
  return prev.id === next.id &&
    prev.left === next.left &&
    prev.top === next.top &&
    prev.onChoseNode === next.onChoseNode &&
    prev.title === next.title &&
    prev.setSelectedNode === next.setSelectedNode &&
    prev.selectedNode !== next.selectedNode
})