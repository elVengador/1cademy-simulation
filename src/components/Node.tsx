import React from "react"

type NodeProps = {
  id: string;
  top: number;
  left: number;
  title: string;
  selectedNode: string | null;
  onChoseNode: (nodeId: string) => void;
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
  console.log("node re-render", id,);

  return (
    <div
      key={id} id={id}
      style={{ position: "absolute", top, left, border: "solid 2px royalBlue", outline: selectedNode === id ? "solid 10px red" : undefined }}
      onClick={() => onChoseNode(id)}>
      {title}
      <button onClick={() => {
        setChosingNode(true);
      }}>Select Chosing Node </button>

      <button onClick={() => setSelectedNode(id)}>
        Select Node
      </button>
    </div>
  )
}

export const MemoizedNode = React.memo(Node, (prev, next) => {
  const tt = (prev.id === next.id &&
    prev.left === next.left &&
    prev.top === next.top &&
    prev.onChoseNode === next.onChoseNode &&
    prev.title === next.title &&
    prev.setSelectedNode === next.setSelectedNode)

  // console.log(prev.id === next.id,
  //   prev.left === next.left,
  //   prev.top === next.top,
  //   prev.onChoseNode === next.onChoseNode,
  //   prev.title === next.title,
  //   prev.setSelectedNode === next.setSelectedNode)

  const tt2 = (next.selectedNode !== next.id)
  const tt3 = !(prev.selectedNode === prev.id && next.selectedNode !== prev.selectedNode)

  return tt && tt2 && tt3
})