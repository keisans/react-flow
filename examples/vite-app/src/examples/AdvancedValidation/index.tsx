import { FC, useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Handle,
  Connection,
  Position,
  Node,
  NodeProps,
  NodeTypes,
  useNodesState,
  useEdgesState,
  OnConnectStart,
  OnConnectEnd,
  OnConnect,
} from 'reactflow';

import styles from './advancedValidation.module.css';

const initialNodes: Node[] = [
  { id: '0', type: 'colorInput', position: { x: 0, y: 150 }, data: null },
  { id: '1', type: 'stringInput', position: { x: 0, y: 250 }, data: null },
  { id: 'A', type: 'colorTarget', position: { x: 250, y: 0 }, data: null },
  { id: 'B', type: 'stringTarget', position: { x: 250, y: 150 }, data: null },
  { id: 'C', type: 'colorTarget', position: { x: 250, y: 300 }, data: null },
];

const isValidConnection = (connection: Connection) => {
    const sourceTypes = connection.sourceDataType?.split('|');
    const targetTypes = connection.targetDataType?.split('|');
    if (sourceTypes && targetTypes) {
        const intersection = sourceTypes.filter((dataType) => targetTypes.includes(dataType));
        return intersection.length > 0;
    }
    return false;
}

 const HandleList: FC<null> = ({ children }) => {
    return <ul style={{ margin: 0, padding: 0 }}>{children}</ul>;
  }
  
  const HandleListItem: FC<{id: string, type: string, isValidConnection: (connection: Connection) => boolean}> = ({
    id,
    type,
    children,
    isValidConnection = () => true
  }) => {
    return (
      <li style={{ padding: 0, margin: 0, listStyleType: "none" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Handle
            type="target"
            position={Position.Left}
            isValidConnection={isValidConnection}
            id={id}
            dataType={type}
            style={{
              position: "relative",
              transform: "none",
              left: "auto",
              //background: "#fff",
              marginRight: 8
            }}
          />
          <label>{children}</label>
        </div>
      </li>
    );
  }

const ColorInput: FC<NodeProps> = ({data}) => (
  <>
    <div>Only Connects to color targets</div>
    <Handle type="source" position={Position.Right} isValidConnection={isValidConnection} dataType={'color'} />
  </>
);

const StringInput: FC<NodeProps> = ({data}) => (
    <>
      <div>Only Connects to string targets</div>
      <Handle type="source" position={Position.Right} isValidConnection={isValidConnection} dataType={'string'} />
    </>
  );

const ColorTarget: FC<NodeProps> = ({ id }) => (
  <>
    <HandleList>
        <HandleListItem id={`handler-${id}`} isValidConnection={isValidConnection} type={"color"}>Color</HandleListItem>
        <HandleListItem id={`handlerB-${id}`} isValidConnection={isValidConnection} type={"string"}>Title (string)</HandleListItem>
        <HandleListItem id={`handlerC-${id}`} isValidConnection={isValidConnection} type={"string"}>Body (string)</HandleListItem>
    </HandleList>
    <Handle type="source" position={Position.Right} isValidConnection={isValidConnection} dataType={"string"}/>
  </>
);


const StringTarget: FC<NodeProps> = ({ id }) => (
  <>
    <Handle type="target" id={`handler-${id}`} position={Position.Left} isValidConnection={isValidConnection} dataType={"string"}/>
    <div>{id} - Accepts Strings</div>
    <Handle type="source" position={Position.Right} isValidConnection={isValidConnection} />
  </>
);


const nodeTypes: NodeTypes = {
  colorInput: ColorInput,
  stringInput: StringInput,
  colorTarget: ColorTarget,
  stringTarget: StringTarget
};

const AdvancedValidationFlow = () => {
  const [value, setValue] = useState(0);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnectStart: OnConnectStart = useCallback(
    (event, params) => {
      console.log('on connect start', params, event, value);
      setValue(1);
    },
    [value]
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      console.log('on connect', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      console.log('on connect end', event, value);
      setValue(0);
    },
    [value]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      selectNodesOnDrag={false}
      className={styles.validationflow}
      nodeTypes={nodeTypes}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      fitView
    />
  );
};

export default AdvancedValidationFlow;
