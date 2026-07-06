"use client";
import { cslp } from "@/lib/cstack";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

function PropCell({ content, proposition, index }) {
  return (
    <motion.div
      className="flex flex-col"
      style={{
        gap: '0.5rem',
        borderLeft: '1px solid rgba(209,162,97,0.3)',
        borderRight: '1px solid rgba(209,162,97,0.3)',
        padding: 'clamp(1.1rem, 2vw, 1.75rem)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      {...cslp(content, 'propositions__', index)}
    >
      <span
        style={{
          fontFamily: 'var(--font-audiowide), sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(2.2rem, 3.6vw, 3.2rem)',
          lineHeight: 1,
          color: '#fff',
          textTransform: 'uppercase',
        }}
        {...proposition?.$?.value}
      >
        {proposition?.value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-audiowide), sans-serif',
          fontWeight: 400,
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          lineHeight: 1.4,
          color: '#D1A261',
          textTransform: 'uppercase',
        }}
        {...proposition?.$?.title}
      >
        {proposition?.title}
      </span>
    </motion.div>
  );
}

// Splits into full rows of `cols` items (rendered as a CSS grid) plus a final
// centered row for any leftover items, so an incomplete last row (e.g. 1 item
// left over from 5 total on a 4-column grid) stays visually symmetric instead
// of sitting flush left.
function PropRows({ content, propositions, cols }) {
  const total = propositions.length;
  const remainder = total % cols;
  const fullCount = remainder === 0 ? total : total - remainder;
  const fullItems = propositions.slice(0, fullCount);
  const restItems = propositions.slice(fullCount);

  return (
    <>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        {...content?.$?.propositions}
      >
        {fullItems.map((proposition, index) => (
          <PropCell key={proposition?.uid || index} content={content} proposition={proposition} index={index} />
        ))}
      </div>

      {restItems.length > 0 && (
        <div className="flex justify-center">
          {restItems.map((proposition, i) => (
            <div key={proposition?.uid || fullCount + i} style={{ width: `${100 / cols}%` }}>
              <PropCell content={content} proposition={proposition} index={fullCount + i} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function LayoutOne({ content, propositions }) {
  return (
    <div className="max-w-7xl mx-auto px-8">
      <div className="md:hidden">
        <PropRows content={content} propositions={propositions} cols={2} />
      </div>
      <div className="hidden md:block">
        <PropRows content={content} propositions={propositions} cols={4} />
      </div>
    </div>
  );
}

// Bento/mosaic grid: hand-tiled `grid-template-areas` per item count (4-10)
// so cells vary in size (some 2x2, some 2x1, some 1x1) while the whole thing
// still tiles into one clean rectangle with no gaps. Letters map to
// propositions in the order they first appear reading the grid top-to-bottom,
// left-to-right.
const MOSAIC_TEMPLATES = {
  4: ['a a b b', 'a a c d'],
  5: ['a a b c', 'a a d e'],
  6: ['a a b c', 'd d e f'],
  7: ['a b c d', 'e e f g'],
  8: ['a a b b', 'a a c d', 'e f g h'],
  9: ['a a b c', 'a a d e', 'f g h i'],
  10: ['a a b c', 'd d e f', 'g h i j'],
};

function getMosaicMeta(areas) {
  const order = [];
  const cellCount = {};
  const bounds = {};
  areas.forEach((row, rowIndex) => {
    row.split(' ').forEach((letter, colIndex) => {
      cellCount[letter] = (cellCount[letter] || 0) + 1;
      if (!order.includes(letter)) order.push(letter);
      const b = bounds[letter] || { minRow: rowIndex, maxRow: rowIndex, minCol: colIndex, maxCol: colIndex };
      b.minRow = Math.min(b.minRow, rowIndex);
      b.maxRow = Math.max(b.maxRow, rowIndex);
      b.minCol = Math.min(b.minCol, colIndex);
      b.maxCol = Math.max(b.maxCol, colIndex);
      bounds[letter] = b;
    });
  });
  return { order, cellCount, bounds, totalRows: areas.length, totalCols: areas[0].split(' ').length };
}

// Given a cell's row/col span, drop the border on whichever sides sit on the
// grid's outer perimeter so the mosaic reads as a set of internal dividers
// rather than a frame around the whole thing.
function edgeBorders(edges) {
  const line = '1px solid rgba(209,162,97,0.35)';
  return {
    borderTop: edges.top ? 'none' : line,
    borderBottom: edges.bottom ? 'none' : line,
    borderLeft: edges.left ? 'none' : line,
    borderRight: edges.right ? 'none' : line,
  };
}

function MosaicCell({ content, proposition, index, area, size, edges }) {
  const valueSize = size === 'lg' ? 'clamp(2.2rem, 4vw, 3.2rem)' : size === 'md' ? 'clamp(1.6rem, 2.8vw, 2.2rem)' : 'clamp(1.2rem, 2vw, 1.6rem)';
  const titleSize = size === 'lg' ? 'clamp(0.9rem, 1.4vw, 1.05rem)' : 'clamp(0.72rem, 1.2vw, 0.85rem)';

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center"
      style={{
        gridArea: area,
        gap: '0.5rem',
        ...edgeBorders(edges),
        padding: 'clamp(1rem, 2vw, 1.75rem)',
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      {...cslp(content, 'propositions__', index)}
    >
      <span
        style={{
          fontFamily: 'var(--font-audiowide), sans-serif',
          fontWeight: 700,
          fontSize: valueSize,
          lineHeight: 1,
          color: '#fff',
          textTransform: 'uppercase',
        }}
        {...proposition?.$?.value}
      >
        {proposition?.value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-audiowide), sans-serif',
          fontWeight: 400,
          fontSize: titleSize,
          letterSpacing: '0.03em',
          lineHeight: 1.5,
          color: '#D1A261',
          textTransform: 'uppercase',
        }}
        {...proposition?.$?.title}
      >
        {proposition?.title}
      </span>
    </motion.div>
  );
}

function LayoutTwo({ content, propositions }) {
  const total = propositions.length;
  const templateKey = Math.min(Math.max(total, 4), 10);
  const template = MOSAIC_TEMPLATES[templateKey];
  const { order, cellCount, bounds, totalRows, totalCols } = getMosaicMeta(template);

  const mobileCols = 2;
  const mobileRows = Math.ceil(total / mobileCols);

  return (
    <div className="max-w-5xl mx-auto px-8">
      {/* Desktop/tablet: mosaic grid */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateAreas: template.map((row) => `"${row}"`).join(' '),
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'clamp(120px, 13vw, 190px)',
          gap: 'clamp(0.5rem, 1vw, 0.75rem)',
        }}
        {...content?.$?.propositions}
      >
        {order.map((letter, i) => {
          const proposition = propositions[i];
          if (!proposition) return null;
          const cells = cellCount[letter];
          const size = cells >= 4 ? 'lg' : cells >= 2 ? 'md' : 'sm';
          const b = bounds[letter];
          const edges = {
            top: b.minRow === 0,
            bottom: b.maxRow === totalRows - 1,
            left: b.minCol === 0,
            right: b.maxCol === totalCols - 1,
          };
          return (
            <MosaicCell key={proposition?.uid || i} content={content} proposition={proposition} index={i} area={letter} size={size} edges={edges} />
          );
        })}
      </div>

      {/* Mobile: simple uniform 2-column grid, mosaic sizing doesn't hold up at narrow widths */}
      <div className="grid grid-cols-2 gap-3 md:hidden" {...content?.$?.propositions}>
        {propositions.map((proposition, index) => {
          const row = Math.floor(index / mobileCols);
          const col = index % mobileCols;
          const edges = {
            top: row === 0,
            bottom: row === mobileRows - 1,
            left: col === 0,
            right: col === mobileCols - 1,
          };
          return (
            <MosaicCell key={proposition?.uid || index} content={content} proposition={proposition} index={index} area="auto" size="sm" edges={edges} />
          );
        })}
      </div>
    </div>
  );
}

export default function PropositionsSection({ content }) {
  const propositions = content?.propositions ?? [];

  if (!propositions.length) return (
    <div className="h-[400px] visual-builder__empty-block-parent" {...content?.$?.propositions} />
  );

  const Layout = content?.layout === 'Layout 2' ? LayoutTwo : LayoutOne;

  return (
    <section style={{ background: 'linear-gradient(to bottom, #4DD9CB 0%, #0a0a0a 100%)', padding: '3.5rem 0' }}>
      <Layout content={content} propositions={propositions} />
    </section>
  );
}
