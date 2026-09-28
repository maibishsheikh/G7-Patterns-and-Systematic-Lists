import React from 'react';

// Renders the small poster-size diagram used inside Practice Stage questions.
// Two diagram families cover every world in this module:
//   type: "sequence" -> a row of connected terms (number pattern / figure pattern)
//   type: "chain"    -> a computation chain of factors (systematic listing / counting)
//   type: "grid"     -> a small rows x cols dot-grid (systematic listing table)
export const PatternDiagramSVG = ({ diagram, size = 320 }) => {
  if (!diagram) return null;
  const { type = 'sequence' } = diagram;

  const colors = ['#06B6D4', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'];

  if (type === 'chain') {
    const parts = diagram.parts || [2, '×', 3, '=', '?'];
    const boxW = 58;
    const gap = 14;
    const opW = 26;
    // compute total width
    let totalW = 20;
    parts.forEach((p) => { totalW += (typeof p === 'number' || p === '?') ? boxW : opW; totalW += gap; });
    totalW -= gap;
    const height = 120;
    let cursor = 10;
    let colorIdx = 0;

    const items = parts.map((p, i) => {
      const isBox = typeof p === 'number' || p === '?';
      const w = isBox ? boxW : opW;
      const x = cursor;
      cursor += w + gap;
      if (!isBox) {
        return (
          <text key={i} x={x + w / 2} y={height / 2 + 8} textAnchor="middle" fill="#A78BFA" fontSize="26" fontWeight="900">
            {p}
          </text>
        );
      }
      const isUnknown = p === '?';
      const stroke = isUnknown ? '#EF4444' : colors[colorIdx % colors.length];
      if (!isUnknown) colorIdx += 1;
      return (
        <g key={i} transform={`translate(${x}, ${height / 2 - 26})`}>
          <rect width={w} height="52" rx="12" fill="#161129" stroke={stroke} strokeWidth="3.5" />
          <text x={w / 2} y="34" textAnchor="middle" fill={isUnknown ? '#EF4444' : '#F3F4F6'} fontSize="22" fontWeight="900">
            {p}
          </text>
        </g>
      );
    });

    return (
      <svg viewBox={`0 0 ${totalW} ${height}`} className="w-full h-full max-w-[360px] select-none">
        {items}
      </svg>
    );
  }

  if (type === 'grid') {
    const rows = diagram.rows || 3;
    const cols = diagram.cols || 2;
    const rowLabel = diagram.rowLabel || 'A';
    const colLabel = diagram.colLabel || 'B';
    const cell = 34;
    const originX = 60;
    const originY = 50;
    const w = originX + cols * cell + 20;
    const h = originY + rows * cell + 40;

    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={originX + c * cell + 3}
            y={originY + r * cell + 3}
            width={cell - 6}
            height={cell - 6}
            rx="6"
            fill="#8B5CF6"
            fillOpacity="0.35"
            stroke="#8B5CF6"
            strokeWidth="2"
          />
        );
      }
    }

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full max-w-[340px] select-none">
        {/* Row label */}
        <text x={originX / 2} y={originY + (rows * cell) / 2 + 6} textAnchor="middle" fill="#06B6D4" fontSize="16" fontWeight="900">
          {rowLabel}={rows}
        </text>
        {/* Col label */}
        <text x={originX + (cols * cell) / 2} y={originY - 14} textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="900">
          {colLabel}={cols}
        </text>
        {cells}
        {/* Total badge */}
        <g transform={`translate(${originX + (cols * cell) / 2}, ${originY + rows * cell + 26})`}>
          <rect x="-32" y="-16" width="64" height="32" rx="8" fill="#161129" stroke="#EF4444" strokeWidth="3" />
          <text x="0" y="6" textAnchor="middle" fill="#EF4444" fontSize="17" fontWeight="900">?</text>
        </g>
      </svg>
    );
  }

  // Default: "sequence" — a row of connected term boxes with arrows
  const terms = diagram.terms || [2, 5, 8, '?'];
  const isFigure = !!diagram.isFigure;
  const boxW = 56;
  const gap = 30;
  const totalW = terms.length * boxW + (terms.length - 1) * gap + 20;
  const height = 130;
  const y = height / 2 - 26;

  return (
    <svg viewBox={`0 0 ${totalW} ${height}`} className="w-full h-full max-w-[360px] select-none">
      {terms.map((t, i) => {
        const x = 10 + i * (boxW + gap);
        const isUnknown = t === '?';
        const isEllipsis = t === '...';
        const stroke = isUnknown ? '#EF4444' : colors[i % colors.length];

        return (
          <g key={i}>
            {i > 0 && (
              <g>
                <line
                  x1={x - gap + 4}
                  y1={height / 2}
                  x2={x - 4}
                  y2={height / 2}
                  stroke="#FFB800"
                  strokeWidth="4"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            )}
            {isEllipsis ? (
              <text x={x + boxW / 2} y={height / 2 + 8} textAnchor="middle" fill="#A78BFA" fontSize="26" fontWeight="900">
                ⋯
              </text>
            ) : (
              <g transform={`translate(${x}, ${y})`}>
                <rect width={boxW} height="52" rx="12" fill="#161129" stroke={stroke} strokeWidth="3.5" />
                <text x={boxW / 2} y="34" textAnchor="middle" fill={isUnknown ? '#EF4444' : '#F3F4F6'} fontSize="19" fontWeight="900">
                  {t}
                </text>
              </g>
            )}
            {isFigure && !isEllipsis && (
              <text x={x + boxW / 2} y={height - 6} textAnchor="middle" fill="#9CA3AF" fontSize="11" fontWeight="700">
                Fig {i + 1}
              </text>
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="#FFB800" />
        </marker>
      </defs>
    </svg>
  );
};

export default PatternDiagramSVG;
