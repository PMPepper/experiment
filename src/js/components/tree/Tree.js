import React from 'react';
import defaultStyles from './styles.scss';

import Transition from '@/components/transitions/VerticalSlideAnimation';

//Helpers
import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';


export default function Tree({id, styles, nodes, selectedNode, isNodeOpen, setIsNodeOpen, setNodeSelected, getRef = null, ...props}) {
  nodes = [
    {id: 'hello', label: 'Hello', icon: null, onClick: null, children: []},
    {id: 'world', label: 'World', icon: null, onClick: null, children: []},
    {id: 'foo', label: 'Foo', icon: null, onClick: null, children: [
      {id: 'bar', label: 'Bar', icon: null, onClick: null}
    ]}
  ];

  return <div {...combineProps({role: 'tree', className: css(styles.tree)}, props)} id={id} ref={getRef}>
    <TreeNodes styles={styles} nodes={nodes} selectedNode={selectedNode} level="1" parentId={id} isNodeOpen={isNodeOpen} setIsNodeOpen={setIsNodeOpen} setNodeSelected={setNodeSelected} isOpen={true} />
  </div>
}

Tree.defaultProps = {
  styles: defaultStyles
};

function TreeNodes({styles, nodes, selectedNode, level, parentId, isNodeOpen, setIsNodeOpen, setNodeSelected, isOpen, getRef = null, ...props}) {
  return <Transition component="ul" {...combineProps({className: styles.treeNodes, role: 'group'}, props)} ref={getRef}>
    {isOpen && nodes.map(node => (<TreeNode styles={styles} node={node} selectedNode={selectedNode} level={level} parentId={parentId} isNodeOpen={isNodeOpen} setIsNodeOpen={setIsNodeOpen} setNodeSelected={setNodeSelected} key={node.id} />))}
  </Transition>
}

function TreeNode({styles, node, selectedNode, level, parentId, isNodeOpen, setIsNodeOpen, setNodeSelected, getRef = null, ...props}) {
  const id = `${parentId}/${node.id}`;
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = hasChildren && isNodeOpen && !!isNodeOpen[id];
  const extraClasses = css(isOpen && styles.open, hasChildren && styles.hasChildren);

  return <li {...combineProps(
    {
      className: css(styles.treeNode, extraClasses),
      role: 'treeitem',
      'aria-selected': false,//TODO
      'aria-level': level,
      'aria-labelledby': `${id}@label`,
      'aria-disabled': false,//TODO
      'aria-expanded': isOpen,
      id: id,
      ref: getRef,
    },
    props)
  }>
    <button className={css(styles.treeNodeIcon, extraClasses)} type="button" role="presentational" onClick={setIsNodeOpen ? ((e) => {e.preventDefault(); setIsNodeOpen(id, !isOpen)}): null}>O</button>
    <button className={css(styles.treeNodeLabel, extraClasses)} type="button" id={`${id}@label`}>
      <span className={css(styles.treeNodeLabelIcon, extraClasses)}>{node.icon}</span>
      <span className={css(styles.treeNodeLabelText, extraClasses)}>{node.label}</span>
    </button>
    {hasChildren && <TreeNodes styles={styles} nodes={node.children} selectedNode={selectedNode} level={level + 1} parentId={id} isOpen={isOpen} />}
  </li>
}
