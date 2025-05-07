import * as esprima from 'esprima';

export function parseCode(code: string) {
  const ast = esprima.parseScript(code, { loc: true });
  const nodes: any[] = [];
  const edges: any[] = [];

  function traverse(node: any, parentId?: string) {
    const nodeId = `${node.type}_${node.loc.start.line}_${node.loc.start.column}`;
    nodes.push({
      data: { id: nodeId, label: node.type }
    });

    if (parentId) {
      edges.push({
        data: { source: parentId, target: nodeId }
      });
    }

    for (const key in node) {
      if (node[key] && typeof node[key] === 'object' && key !== 'loc') {
        if (Array.isArray(node[key])) {
          node[key].forEach((child: any) => traverse(child, nodeId));
        } else {
          traverse(node[key], nodeId);
        }
      }
    }
  }

  traverse(ast);
  return { nodes, edges };
}