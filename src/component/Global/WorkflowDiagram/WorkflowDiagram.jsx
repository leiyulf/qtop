import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ReactFlow, Background, Controls, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { getSocket } from '../../../page/Management/QTopAgent/QTopAgentServer';

// 开始/结束节点
const StartEndNode = ({ data }) => {
  const isActive = data.isActive;
  return (
    <div
      style={{
        padding: '10px 20px',
        borderRadius: '20px',
        backgroundColor: isActive ? '#c8e6c9' : '#e1f5fe',
        border: `2px solid ${isActive ? '#4caf50' : '#01579b'}`,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: '80px',
        boxShadow: isActive ? '0 0 10px #4caf50' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#01579b', opacity: 0 }}
      />
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#01579b', opacity: 0 }}
      />
    </div>
  );
};

// 处理节点
const ProcessNode = ({ data }) => {
  const isActive = data.isActive;
  return (
    <div
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        backgroundColor: isActive ? '#c8e6c9' : '#ffffff',
        border: `2px solid ${isActive ? '#4caf50' : '#999'}`,
        textAlign: 'center',
        minWidth: '100px',
        boxShadow: isActive ? '0 0 10px #4caf50' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: '#999', opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: '#999', opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={{ background: '#999', opacity: 0 }}
      />
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#999', opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#999', opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="left-source"
        style={{ background: '#999', opacity: 0 }}
      />
    </div>
  );
};

// 决策节点（菱形样式）
const DecisionNode = ({ data }) => {
  const isActive = data.isActive;
  return (
    <div
      style={{
        padding: '10px 20px',
        backgroundColor: isActive ? '#c8e6c9' : '#ffffff',
        border: `2px solid ${isActive ? '#4caf50' : '#999'}`,
        textAlign: 'center',
        borderRadius: '8px',
        minWidth: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isActive ? '0 0 10px #4caf50' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#999', opacity: 0 }}
      />
      <span style={{ whiteSpace: 'nowrap' }}>
        {data.label}
      </span>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: '#999', opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#999', opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{ background: '#999', opacity: 0 }}
      />
    </div>
  );
};

const nodeTypes = {
  startEnd: StartEndNode,
  process: ProcessNode,
  decision: DecisionNode,
};

const WorkflowDiagram = () => {
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Socket监听，获取当前节点状态和连接状态
  useEffect(() => {
    const socketInstance = getSocket();
    if (socketInstance) {
      // 初始化连接状态
      setSocketConnected(socketInstance.connected);

      // 监听连接状态变化
      socketInstance.on('connect', () => {
        console.log('WorkflowDiagram: Socket连接成功');
        setSocketConnected(true);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('WorkflowDiagram: Socket断开连接, 原因:', reason);
        setSocketConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('WorkflowDiagram: Socket连接错误:', error);
      });

      socketInstance.on('nodeState', (data) => {
        console.log('WorkflowDiagram: Node state updated:', data);
        if (data?.nodeName && data?.status == 'start') {
          setCurrentNodeId(data?.nodeName);
        }
      });

      return () => {
        socketInstance.offAny();
        socketInstance.off('connect');
        socketInstance.off('disconnect');
        socketInstance.off('connect_error');
        socketInstance.off('nodeState');
      };
    } else {
      console.error('WorkflowDiagram: 无法获取Socket实例');
    }
  }, []);

  const initialNodes = useMemo(() => [
    {
      id: '__start__',
      type: 'startEnd',
      position: { x: 0, y: 150 },
      data: { label: '开始' },
    },
    {
      id: 'initializeNode',
      type: 'process',
      position: { x: 180, y: 150 },
      data: { label: '初始化节点' },
    },
    {
      id: 'articleGenerateNode',
      type: 'process',
      position: { x: 380, y: 150 },
      data: { label: '文章生成节点' },
    },
    {
      id: 'articleReviewNode',
      type: 'decision',
      position: { x: 580, y: 150 },
      data: { label: '评审' },
    },
    {
      id: 'structureOptimizeNode',
      type: 'process',
      position: { x: 580, y: 260 },
      data: { label: '结构优化节点' },
    },
    {
      id: 'imageGenerateNode',
      type: 'process',
      position: { x: 760, y: 260 },
      data: { label: '图片生成节点' },
    },
    {
      id: 'finalEditNode',
      type: 'process',
      position: { x: 940, y: 260 },
      data: { label: '最终生成节点' },
    },
    {
      id: '__end__',
      type: 'startEnd',
      position: { x: 1140, y: 260 },
      data: { label: '结束' },
    },
  ], []);

  const initialEdges = useMemo(() => [
    {
      id: 'edge1',
      source: '__start__',
      target: 'initializeNode',
      type: 'smoothstep',
      style: { stroke: '#333', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: '#333' },
    },
    {
      id: 'edge2',
      source: 'initializeNode',
      target: 'articleGenerateNode',
      type: 'smoothstep',
      style: { stroke: '#333', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: '#333' },
    },
    {
      id: 'edge3',
      source: 'articleGenerateNode',
      target: 'articleReviewNode',
      type: 'smoothstep',
      style: { stroke: '#333', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: '#333' },
    },
    {
      id: 'edge4',
      source: 'articleReviewNode',
      sourceHandle: 'top',
      target: 'articleGenerateNode',
      targetHandle: 'top',
      type: 'smoothstep',
      label: '重新生成',
      style: { stroke: '#f44336', strokeWidth: 2 },
      labelStyle: { fill: '#f44336', fontSize: '12px' },
      markerEnd: { type: 'arrowclosed', color: '#f44336' },
    },
    {
      id: 'edge5',
      source: 'articleReviewNode',
      sourceHandle: 'bottom',
      target: 'structureOptimizeNode',
      targetHandle: 'top',
      type: 'smoothstep',
      label: '继续',
      style: { stroke: '#4caf50', strokeWidth: 2 },
      labelStyle: { fill: '#4caf50', fontSize: '12px' },
      markerEnd: { type: 'arrowclosed', color: '#4caf50' },
    },
    {
      id: 'edge6',
      source: 'structureOptimizeNode',
      target: 'imageGenerateNode',
      type: 'smoothstep',
      style: { stroke: '#333', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: '#333' },
    },
    {
      id: 'edge7',
      source: 'imageGenerateNode',
      target: 'finalEditNode',
      type: 'smoothstep',
      style: { stroke: '#333', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: '#333' },
    },
    {
      id: 'edge8',
      source: 'finalEditNode',
      sourceHandle: 'bottom',
      target: 'initializeNode',
      targetHandle: 'bottom-target',
      type: 'smoothstep',
      label: '继续',
      style: { stroke: '#4caf50', strokeWidth: 2 },
      labelStyle: { fill: '#4caf50', fontSize: '12px' },
      markerEnd: { type: 'arrowclosed', color: '#4caf50' },
    },
    {
      id: 'edge9',
      source: 'finalEditNode',
      target: '__end__',
      type: 'smoothstep',
      label: '结束',
      style: { stroke: '#333', strokeWidth: 2 },
      labelStyle: { fill: '#333', fontSize: '12px' },
      markerEnd: { type: 'arrowclosed', color: '#333' },
    },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 当currentNodeId变化时，更新节点的isActive状态
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            isActive: node.id === currentNodeId,
          },
        }
      })
    );
  }, [currentNodeId, setNodes]);

  const onConnect = useCallback((connection) => {
    // 处理新的连接创建
    const newEdge = {
      ...connection,
      id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 生成唯一ID
      style: { stroke: '#000', strokeWidth: 2 },
    };

    // 添加新的边到边列表
    setEdges((eds) => [...eds, newEdge]);
  }, [setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.5, includeHiddenNodes: true, minZoom: 0.5, maxZoom: 1.5 }}
        attributionPosition="bottom-left"
        nodeTypes={nodeTypes}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default WorkflowDiagram;