import React from 'react';
import defaultStyles from './styles.scss';

import Transition from '@/components/transitions/VerticalSlideAnimation';
import Icon from '@/components/icon/Icon';

//Helpers
import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';


export default function Tree({id, styles, nodes, selectedNode, isNodeOpen, setIsNodeOpen, setNodeSelected, getRef = null, ...props}) {
  nodes = [
    {id: 'populatedSystems', label: 'Populated systems', icon: null, onClick: null, children: [
      {id: '1', label: 'Sol', icon: null, onClick: null, children: [
        {id: '4', label: 'Earth', icon: null, onClick: null},
      ]},
    ]},
    {id: 'automatedMiningColonies', label: 'Automated mining colonies', icon: null, onClick: null},
    {id: 'civilianMiningColonies', label: 'Civilian mining colonies', icon: null, onClick: null},
    {id: 'listeningPosts', label: 'Listening posts', icon: null, onClick: null},
    {id: 'archeologicalDigs', label: 'Archeological digs', icon: null, onClick: null},
    {id: 'terraformingSites', label: 'Terraforming sites', icon: null, onClick: null},
    {id: 'otherColonies', label: 'Other colonies sites', icon: null, onClick: null, children: [
      {id: '1', label: 'Sol', icon: null, onClick: null, children: [
        {id: '2', label: 'Mercury', icon: null, onClick: null},
      ]},
    ]},

    {id: 'foo', label: 'Foo', icon: null, onClick: null, children: [
      {id: 'bar', label: 'Bar', icon: null, onClick: null, children: [
        {id: 'x', label: 'x', icon: null, onClick: null},
        {id: 'y', label: 'y', icon: null, onClick: null, children: [
          {id: 'a', label: 'a', icon: null, onClick: null},
          {id: 'b', label: 'b', icon: null, onClick: null},
          {id: 'c', label: 'c', icon: null, onClick: null},
        ]},
        {id: 'z', label: 'z', icon: null, onClick: null, children: [
          {id: 'a', label: 'a', icon: null, onClick: null},
          {id: 'b', label: 'b', icon: null, onClick: null},
          {id: 'c', label: 'c', icon: null, onClick: null},
        ]},
      ]}
    ]}
  ];

  return <div {...combineProps({role: 'tree', className: css(styles.tree)}, props)} id={id} ref={getRef}>
    <TreeNodes styles={styles} nodes={nodes} level={1} parentId={id} isNodeOpen={isNodeOpen} setIsNodeOpen={setIsNodeOpen} selectedNode={selectedNode} setNodeSelected={setNodeSelected} isOpen={true} />
  </div>
}

Tree.defaultProps = {
  styles: defaultStyles
};

function TreeNodes({styles, nodes, selectedNode, level, parentId, isNodeOpen, setIsNodeOpen, setNodeSelected, isOpen, getRef = null, ...props}) {
  return <Transition component="ul" {...combineProps({className: styles.treeNodes, role: 'group'}, props)} ref={getRef}>
    {isOpen && nodes.map(
      (node, index) => (<TreeNode styles={styles} node={node} selectedNode={selectedNode} level={level} parentId={parentId} isNodeOpen={isNodeOpen} setIsNodeOpen={setIsNodeOpen} setNodeSelected={setNodeSelected} key={node.id} first={index === 0} last={index === nodes.length-1} />)
    )}
  </Transition>
}

function TreeNode({styles, node, level, parentId, isNodeOpen, setIsNodeOpen, selectedNode, setNodeSelected, first, last, getRef = null, ...props}) {
  const id = `${parentId}/${node.id}`;
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = hasChildren && isNodeOpen && !!isNodeOpen[id];
  const isSelected = selectedNode === id;
  const extraClasses = css(isOpen && styles.open, hasChildren && styles.hasChildren, isSelected && styles.selected, first && styles.first, last && styles.last);

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
    <button className={css(styles.treeNodeIcon, extraClasses)} type="button" role="presentational" onClick={setIsNodeOpen ? ((e) => {e.preventDefault(); setIsNodeOpen(id, !isOpen)}): null}>
      <Icon icon="caret-right" transform={isOpen ? {rotate: 45} : null} />
    </button>
    <button className={css(styles.treeNodeLabel, extraClasses)} type="button" id={`${id}@label`} onClick={(e) => {e.preventDefault(); setNodeSelected && setNodeSelected(id); node.onClick && node.onClick(e)}}>
      <span className={css(styles.treeNodeLabelIcon, extraClasses)}>{node.icon}</span>
      <span className={css(styles.treeNodeLabelText, extraClasses)}>{node.label}</span>
    </button>
    {hasChildren && <TreeNodes styles={styles} nodes={node.children} selectedNode={selectedNode} setNodeSelected={setNodeSelected} isNodeOpen={isNodeOpen} setIsNodeOpen={setIsNodeOpen} level={level + 1} parentId={id} isOpen={isOpen} />}
  </li>
}
