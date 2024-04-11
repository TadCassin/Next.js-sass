import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

const HorizontalBarChart = (props) => {
  const d3Container = useRef<HTMLDivElement | null | any>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const drawChart = (width) => {
    if (!d3Container.current || !props.data || width <= 0) {
      return;
    }

    if (props.data && d3Container && d3Container.current && width > 0) {
      const svg = d3.select(d3Container.current);
      svg.selectAll('*').remove();

      const margin = { top: 10, right: 20, bottom: 40, left: 30 };
      const height = +svg.attr('height') - margin.top - margin.bottom;
      const drawWidth = width - margin.left - margin.right;

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(props.data, (d) => d.value)])
        .range([0, drawWidth]);

      const yScale = d3
        .scaleBand()
        .domain(props.data.map((d) => d.label))
        .rangeRound([0, height])
        .padding(0.2);

      yScale.domain().forEach((d) => {
        g.append('line').attr('x1', 0).attr('x2', drawWidth).attr('y1', yScale(d)).attr('y2', yScale(d)).attr('stroke', 'var(--color-border)');
      });

      const yAxis = g.append('g').call(d3.axisLeft(yScale));
      yAxis.selectAll('.tick text').style('fill', 'var(--color-text)').style('font-size', '16px');
      yAxis.selectAll('.tick line, .domain').style('stroke', 'var(--color-border)');

      const xAxis = g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale).ticks(3));
      xAxis.selectAll('path,line').style('stroke', 'var(--color-text)').style('font-size', '16px');
      xAxis.selectAll('text').style('fill', 'var(--color-text)').style('font-size', '14px');

      g.selectAll('.bar')
        .data(props.data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', (d) => yScale(d.label))
        .attr('width', (d) => xScale(d.value))
        .attr('height', yScale.bandwidth())
        .attr('fill', (d, i) => (i % 2 === 0 ? 'var(--color-success)' : 'var(--color-subdued-success)'));
    }
  };

  useEffect(() => {
    if (!d3Container || !d3Container.current) {
      return;
    }

    setContainerWidth(d3Container.current.clientWidth);
    const handleResize = () => {
      if (!d3Container || !d3Container.current) {
        return;
      }
      setContainerWidth(d3Container.current.clientWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [props.data]);

  useEffect(() => {
    drawChart(containerWidth);
  }, [containerWidth, props.data]);

  return (
    <>
      <svg width={props.width ?? '100%'} height={props.height ?? '400'} ref={d3Container} style={props.style} />
      <section style={{ display: 'flex', flexDirection: 'row', gap: '1.2rem', paddingLeft: '1.5rem', paddingBottom: '1rem' }}>
        {props?.legend?.map((item, index) => {
          return (
            <div key={index}>
              <span style={{ width: '1.2rem', height: '1.2rem', borderRadius: '2rem', display: 'inline-block', background: item.color }} />
              <p>{item.label}</p>
            </div>
          );
        })}
      </section>
    </>
  );
};

// Function to draw error bars

export default HorizontalBarChart;
