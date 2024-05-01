import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const TreeChart = ({ data }) => {
  const d3Container = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  function addPercentages(data) {
    data.children.forEach((parentNode) => {
      const totalValue = parentNode.children.reduce((sum, child) => sum + child.value, 0);
      parentNode.children.forEach((child) => {
        child.percentage = ((child.value / totalValue) * 100).toFixed(0) + '%';
      });
    });
  }

  addPercentages(data);

  const drawChart = () => {
    const margin = { top: 20, right: 500, bottom: 30, left: 100 },
      width = containerWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(d3Container.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const treemap = d3
      .tree()
      .size([height, width])
      .separation((a, b) => {
        return a.parent == b.parent ? 0.5 : 0.5;
      });

    let nodes = d3.hierarchy(data, (d) => d.children);
    nodes = treemap(nodes);

    // Style the links
    svg
      .selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .style('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('d', (d) => {
        return `M${d.y},${d.x}
                C${d.parent.y + 50},${d.x} ${d.parent.y + 150},${d.parent.x}
                ${d.parent.y},${d.parent.x}`;
      });

    // Style the nodes
    const node = svg
      .selectAll('.node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', (d) => `node${d.children ? ' node--internal' : ' node--leaf'}`)
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node
      .append('circle')
      .attr('r', (d) => (d.children ? 10 : 14)) // Bigger circles for leaf nodes
      .style('fill', (d) => (d.children ? 'var(--theme-success)' : 'var(--theme-background)'))
      .attr('stroke', 'var(--theme-success)')
      .style('stroke-width', 1);

    // Style the text
    node
      .append('text')
      .attr('dy', '.35em')
      .text((d) => d.data.name)
      .attr('y', (d) => (d.children ? 30 : 0))
      .attr('x', (d) => (d.children ? -32 : 30))

      .style('fill', 'var(--theme-text)')
      .style('font-size', '12px');

    node
      .append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--theme-text)')
      .style('font-size', '0.6em')
      .text((d) => d.data.percentage || '');
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].target) {
        setContainerWidth(entries[0].target.clientWidth);
      }
    });
    if (d3Container.current) {
      resizeObserver.observe(d3Container.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [d3Container.current]);

  useEffect(() => {
    drawChart();
  }, [containerWidth, data]);

  return <div ref={d3Container} style={{ width: '100%', height: '100%' }}></div>;
};

export default TreeChart;
