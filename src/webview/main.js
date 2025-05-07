document.addEventListener('DOMContentLoaded', () => {
    cytoscape({
      container: document.getElementById('cy'),
      elements: {
        nodes: graphData.nodes,
        edges: graphData.edges
      },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#007acc',
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'width': 100,
            'height': 40
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#666',
            'target-arrow-color': '#666',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 30
      }
    });
  });