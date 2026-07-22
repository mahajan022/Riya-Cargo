import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { toBlob } from 'html-to-image';
import {
  PieChart, Pie, Cell, Sector, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';
import indiaMap from '@svg-maps/india';
import {
  UploadCloud, Check, Download, BarChart3, X, ZoomIn, Copy, ArrowLeft,
  ArrowRight, FileSpreadsheet, AlertTriangle, Info, RotateCcw
} from 'lucide-react';

// ============================================================================
// DESIGN TOKENS — Healthysure brand
// Zomp (teal-green) family drives 70-80% of surface/UI color; a small,
// deliberately limited set of non-brand hues is reserved ONLY for functional
// data semantics (rejected/warning states, and distinguishing many-category
// chart legends) where relying on green-only would make claims data
// impossible to read at a glance.
// ============================================================================
const COLORS = {
  bg: '#f4faf9',
  bgElevated: '#ffffff',
  surface: '#f2f9f7',
  surfaceAlt: '#eef1f0',
  border: '#d7e8e3',
  borderStrong: '#a9d4c8',
  accent: '#11a387',
  accentMid: '#0c725f',
  accentDeep: '#095244',
  mint: '#e7f6f3',
  textPrimary: '#0d2b25',
  textSecondary: '#4d6b64',
  textMuted: '#8aa39d',
  danger: '#c62828',
  warning: '#9a6b00'
};

// Brand palette reused across all dashboard charts — teal family leads,
// a few muted, low-saturation accents fill out the remaining categories
// so an 8-slice legend stays legible.
const CHART_COLORS = ['#11a387', '#095244', '#5C6BC0', '#c98a5c', '#0c725f', '#EF5350', '#7ea3c9', '#8D6E63'];

// Healthysure output columns that hold dates. Source files read with
// { cellDates: true } turn these into real JS Date objects instead of raw
// Excel serial numbers (e.g. 46149) - formatDateValue below then renders
// them as readable text (dd-mmm-yyyy) in the converted file.
const DATE_COLUMNS = new Set([
  'Date of Admission', 'Date of Discharge', 'FDR - HS', 'FDR', 'LDR',
  'Date of Rejection', 'Date of Settlement'
]);

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Every insurer except HDFC ERGO reports a raw age number in the "dob / age"
// column; HDFC reports an actual date of birth (CLM_PATIENT_DOB), so we
// convert that one case to an age here to keep the output column consistent.
const ageFromDob = (value) => {
  if (!(value instanceof Date) || isNaN(value.getTime())) return value;
  const today = new Date();
  let age = today.getFullYear() - value.getFullYear();
  const monthDiff = today.getMonth() - value.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < value.getDate())) age--;
  return age;
};

const formatDateValue = (value) => {
  if (!(value instanceof Date) || isNaN(value.getTime())) return value;
  const dd = String(value.getDate()).padStart(2, '0');
  const mmm = MONTH_ABBR[value.getMonth()];
  return `${dd}-${mmm}-${value.getFullYear()}`;
};

// ---- State-name normalization for the India claims map ----
// Insurer MIS files spell states inconsistently (old names, abbreviations, etc.)
// so raw values are matched against @svg-maps/india's location list.
const INDIA_STATE_NAMES = indiaMap.locations.map(l => l.name);
const STATE_NAME_ALIASES = {
  'nct of delhi': 'Delhi',
  'new delhi': 'Delhi',
  'orissa': 'Odisha',
  'pondicherry': 'Puducherry',
  'uttaranchal': 'Uttarakhand',
  'jammu & kashmir': 'Jammu and Kashmir',
  'j&k': 'Jammu and Kashmir',
  'a&n islands': 'Andaman and Nicobar Islands',
  'andaman & nicobar islands': 'Andaman and Nicobar Islands',
  'andaman & nicobar': 'Andaman and Nicobar Islands',
  'dnh': 'Dadra and Nagar Haveli',
  'daman & diu': 'Daman and Diu',
  'nct': 'Delhi'
};

const normalizeStateName = (raw) => {
  if (!raw) return null;
  const clean = String(raw).trim();
  if (!clean) return null;
  const lower = clean.toLowerCase();
  const exact = INDIA_STATE_NAMES.find(n => n.toLowerCase() === lower);
  if (exact) return exact;
  if (STATE_NAME_ALIASES[lower]) return STATE_NAME_ALIASES[lower];
  const partial = INDIA_STATE_NAMES.find(n => lower.includes(n.toLowerCase()) || n.toLowerCase().includes(lower));
  return partial || null;
};

// Interpolates between a muted dark teal (low claim count, still readable on
// the dark card) and a bright mint-accent (high claim count). A power curve
// (exponent < 1) lifts up low counts so a state with just 1-2 claims still
// reads as visibly colored instead of fading into the card background.
const colorForCount = (count, max) => {
  if (!count) return '#e3ece9'; // no data for this state, still visible on the pale chart card
  const linearRatio = Math.min(1, count / (max || 1));
  const ratio = Math.pow(linearRatio, 0.5); // boosts low values without blowing out high ones
  const from = [190, 226, 218]; // pale teal tint, clearly visible on a white card
  const to = [9, 82, 68];       // deep brand green
  const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * ratio));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

// Layout constants for the leader-line callout labels
const CALLOUT_BOX_WIDTH = 200;
const CALLOUT_BOX_HEIGHT = 40;
const CALLOUT_MIN_GAP = 46;
const CALLOUT_SIDE_PADDING = 320;

// Stacks a column of callouts vertically near each state's natural (centroid)
// height, nudging any that are too close together apart so labels never
// overlap. If the stack overflows the map's height, it's shifted back up
// and re-spaced from the bottom.
const layoutCalloutColumn = (items, viewHeight) => {
  if (items.length === 0) return [];
  const placed = [...items]
    .sort((a, b) => a.centroidY - b.centroidY)
    .map(it => ({ ...it, labelY: it.centroidY }));

  for (let i = 1; i < placed.length; i++) {
    if (placed[i].labelY - placed[i - 1].labelY < CALLOUT_MIN_GAP) {
      placed[i].labelY = placed[i - 1].labelY + CALLOUT_MIN_GAP;
    }
  }

  const overflow = placed[placed.length - 1].labelY - (viewHeight - 12);
  if (overflow > 0) {
    placed.forEach(p => { p.labelY -= overflow; });
    for (let i = placed.length - 2; i >= 0; i--) {
      if (placed[i + 1].labelY - placed[i].labelY < CALLOUT_MIN_GAP) {
        placed[i].labelY = placed[i + 1].labelY - CALLOUT_MIN_GAP;
      }
    }
  }
  return placed;
};

// Interactive choropleth of claim volume by state. Every state with at least
// one claim gets a permanent leader-line callout (name + count) placed in a
// column to the left or right of the map, instead of cramped text on the
// shape itself.
const IndiaClaimsMap = ({ stateCounts, unmatchedCount, height = 340 }) => {
  const [hovered, setHovered] = useState(null); // { id, name, count }
  const [centroids, setCentroids] = useState({});
  const pathRefs = useRef({});
  const max = Math.max(1, ...Object.values(stateCounts), 0);
  const [vbX, vbY, vbW, vbH] = indiaMap.viewBox.split(' ').map(Number);

  React.useLayoutEffect(() => {
    const next = {};
    indiaMap.locations.forEach(loc => {
      const el = pathRefs.current[loc.id];
      if (el && el.getBBox) {
        const box = el.getBBox();
        next[loc.id] = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      }
    });
    setCentroids(next);
  }, []);

  // Render the hovered state last so its "pop out" scale sits above its
  // neighbors instead of being clipped underneath them.
  const orderedLocations = React.useMemo(() => {
    if (!hovered) return indiaMap.locations;
    const idx = indiaMap.locations.findIndex(l => l.id === hovered.id);
    if (idx === -1) return indiaMap.locations;
    const arr = [...indiaMap.locations];
    const [item] = arr.splice(idx, 1);
    arr.push(item);
    return arr;
  }, [hovered]);

  // One callout per state with claims, split left/right of the map's center
  // so leader lines stay short and don't criss-cross the whole country.
  const callouts = React.useMemo(() => {
    const mapCenterX = vbX + vbW / 2;
    const items = indiaMap.locations
      .filter(loc => (stateCounts[loc.name] || 0) > 0 && centroids[loc.id])
      .map(loc => ({
        id: loc.id,
        name: loc.name,
        count: stateCounts[loc.name],
        centroidX: centroids[loc.id].x,
        centroidY: centroids[loc.id].y
      }));

    const left = layoutCalloutColumn(items.filter(it => it.centroidX < mapCenterX), vbH)
      .map(it => ({ ...it, side: 'left' }));
    const right = layoutCalloutColumn(items.filter(it => it.centroidX >= mapCenterX), vbH)
      .map(it => ({ ...it, side: 'right' }));

    return [...left, ...right];
  }, [stateCounts, centroids, vbX, vbW, vbH]);

  const extendedViewBox = `${vbX - CALLOUT_SIDE_PADDING} ${vbY} ${vbW + CALLOUT_SIDE_PADDING * 2} ${vbH}`;
  const leftElbowX = vbX - 14;
  const rightElbowX = vbX + vbW + 14;

  return (
    <div>
      <svg viewBox={extendedViewBox} style={{ width: '100%', height, display: 'block', overflow: 'visible' }}>
        {orderedLocations.map(loc => {
          const count = stateCounts[loc.name] || 0;
          const fill = colorForCount(count, max);
          const isHovered = hovered?.id === loc.id;
          return (
            <path
              key={loc.id}
              ref={el => { pathRefs.current[loc.id] = el; }}
              d={loc.path}
              fill={fill}
              stroke={isHovered ? COLORS.accentDeep : '#8fbfb3'}
              strokeWidth={isHovered ? 2.2 : 1.25}
              onMouseEnter={() => setHovered({ id: loc.id, name: loc.name, count })}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: 'pointer',
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                filter: isHovered ? 'drop-shadow(0 3px 6px rgba(9,82,68,0.35))' : 'drop-shadow(0 1px 0 rgba(255,255,255,0.85))',
                transition: 'transform 0.15s ease, filter 0.15s ease, stroke-width 0.15s ease, stroke 0.15s ease'
              }}
            />
          );
        })}

        {/* Leader lines + permanent callout labels for every state with at least one claim */}
        {callouts.map(c => {
          const elbowX = c.side === 'right' ? rightElbowX : leftElbowX;
          const labelAnchorX = c.side === 'right' ? elbowX + 14 : elbowX - 14;
          const boxX = c.side === 'right' ? labelAnchorX : labelAnchorX - CALLOUT_BOX_WIDTH;
          const isHovered = hovered?.id === c.id;
          return (
            <g
              key={`callout-${c.id}`}
              onMouseEnter={() => setHovered({ id: c.id, name: c.name, count: c.count })}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <polyline
                points={`${c.centroidX},${c.centroidY} ${elbowX},${c.centroidY} ${labelAnchorX},${c.labelY}`}
                fill="none"
                stroke={isHovered ? COLORS.accent : COLORS.borderStrong}
                strokeWidth={isHovered ? 1.4 : 1}
              />
              <circle cx={c.centroidX} cy={c.centroidY} r={2.2} fill={COLORS.accent} />
              <rect
                x={boxX}
                y={c.labelY - CALLOUT_BOX_HEIGHT / 2}
                width={CALLOUT_BOX_WIDTH}
                height={CALLOUT_BOX_HEIGHT}
                rx={6}
                fill={isHovered ? COLORS.mint : '#ffffff'}
                stroke={isHovered ? COLORS.accent : COLORS.borderStrong}
                strokeWidth={isHovered ? 1.6 : 1}
              />
              <text
                x={boxX + CALLOUT_BOX_WIDTH / 2}
                y={c.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={700}
                fill={COLORS.textPrimary}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {truncateLabel(c.name, 16)} · {c.count}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ textAlign: 'center', fontSize: 12.5, color: COLORS.textSecondary, fontWeight: 600, minHeight: 20, marginTop: 10 }}>
        {hovered
          ? `${hovered.name}: ${hovered.count} claim${hovered.count === 1 ? '' : 's'}`
          : `${callouts.length} state${callouts.length === 1 ? '' : 's'} with claims`}
      </div>

      {/* Simple light-to-dark legend so the color scale reads clearly at a glance */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
        <span style={{ fontSize: 10.5, color: COLORS.textMuted, fontWeight: 600 }}>Fewer claims</span>
        <div style={{
          width: 120, height: 6, borderRadius: 4,
          background: `linear-gradient(to right, ${colorForCount(1, 100)}, ${colorForCount(100, 100)})`,
          border: `1px solid ${COLORS.border}`
        }} />
        <span style={{ fontSize: 10.5, color: COLORS.textMuted, fontWeight: 600 }}>More claims</span>
      </div>

      {unmatchedCount > 0 && (
        <p style={{ fontSize: 11, color: COLORS.textMuted, textAlign: 'center', margin: '6px 0 0 0' }}>
          {unmatchedCount} claim{unmatchedCount === 1 ? '' : 's'} had a state value that couldn't be matched to a map region.
        </p>
      )}
    </div>
  );
};

// Custom "active shape" renderer for pie slices: on hover, the slice grows
// outward and gets a thin outer ring, giving a "pop out / separation" effect
// without the jank of trying to physically offset the slice from center.
const renderActivePieSlice = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 11}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.5}
      />
    </g>
  );
};

// Pie chart with hover pop-out behavior. Wrapped in its own component (rather
// than an inline PieChart) so it can hold its own activeIndex state via hooks.
const PopOutPieChart = ({ data, height }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={Math.min(height, 260) * 0.35}
          label={({ name, value }) => `${name}: ${value}`}
          activeIndex={activeIndex}
          activeShape={renderActivePieSlice}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(-1)}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke={COLORS.surface} strokeWidth={1} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: COLORS.surface, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 8, color: COLORS.textPrimary }} itemStyle={{ color: COLORS.textPrimary }} />
        <Legend wrapperStyle={{ fontSize: 12, color: COLORS.textSecondary }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Shortens long category names for axis ticks; full text still shows in the tooltip
const truncateLabel = (str, maxLen = 16) => {
  const text = String(str || '');
  return text.length > maxLen ? `${text.slice(0, maxLen - 1).trim()}…` : text;
};

// Custom tick renderer for horizontal bar charts: truncates long y-axis labels
// instead of letting them wrap into multiple lines and collide with the bars
const TruncatedYAxisTick = ({ x, y, payload }) => (
  <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fill={COLORS.textSecondary}>
    {truncateLabel(payload.value, 22)}
  </text>
);

// Shared tooltip for bar charts with long category names: wraps to a fixed
// width instead of stretching a single line across (and out of) the chart card
const WrappedBarTooltip = ({ active, payload, color = COLORS.accent }) => {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div style={{
      maxWidth: 220,
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      background: COLORS.surface,
      border: `1px solid ${COLORS.borderStrong}`,
      borderRadius: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
      padding: '9px 12px',
      fontSize: 12,
      lineHeight: 1.4,
      color: COLORS.textSecondary
    }}>
      <div style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: 4 }}>{name}</div>
      <div style={{ color, fontWeight: 700 }}>{value} claims</div>
    </div>
  );
};

// Copies a DOM node to the clipboard as a PNG image (falls back to a file
// download if the browser doesn't support ClipboardItem, e.g. some Safari
// versions or non-HTTPS contexts). Returns 'done' or 'error'.
const copyNodeAsImage = async (node, filenameBase, background = COLORS.surface) => {
  if (!node) return 'error';
  try {
    const blob = await toBlob(node, {
      backgroundColor: background,
      pixelRatio: 2, // retina-quality output
      cacheBust: true
    });
    if (!blob) throw new Error('Blob generation failed');

    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new window.ClipboardItem({ [blob.type]: blob })
      ]);
      return 'done';
    }

    // Fallback for browsers without image-clipboard support: trigger a download instead
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenameBase.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return 'done';
  } catch (err) {
    console.error('Copy as image failed:', err);
    return 'error';
  }
};

// Small icon button used for the copy-as-image action; shows a transient
// state (copying / done / error) so the user gets feedback on click
const CopyImageButton = ({ getNode, filenameBase, background }) => {
  const [state, setState] = useState('idle'); // idle | copying | done | error

  const handleClick = async (e) => {
    e.stopPropagation();
    if (state === 'copying') return;
    setState('copying');
    const node = getNode();
    const result = await copyNodeAsImage(node, filenameBase, background);
    setState(result);
    setTimeout(() => setState('idle'), 1800);
  };

  const label = state === 'done' ? 'Copied' : state === 'error' ? 'Copy failed' : 'Copy chart as image';

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mis-btn mis-icon-btn"
      style={styles.chartIconBtn}
      title={label}
      aria-label={`${label}: ${filenameBase}`}
    >
      {state === 'done' ? <Check size={14} /> : state === 'error' ? <AlertTriangle size={14} /> : <Copy size={14} />}
    </button>
  );
};

// Wraps a chart with a title bar + copy + zoom buttons; clicking zoom pops the
// same chart out into a larger centered modal (re-rendered at modal height via
// renderChart). Both the inline card and the modal have their own "copy as
// image" button, each capturing exactly what's on screen at that moment.
const ChartCard = ({ title, renderChart, height = 260, note, wide = false }) => {
  const [zoomed, setZoomed] = useState(false);
  const cardRef = useRef(null);
  const modalRef = useRef(null);

  return (
    <>
      <div ref={cardRef} style={{ ...styles.chartCard, ...(wide ? { gridColumn: '1 / -1' } : {}) }}>
        <div style={styles.chartCardHeader}>
          <h3 style={{ ...styles.chartCardTitle, margin: 0 }}>{title}</h3>
          <div style={styles.chartHeaderBtnGroup}>
            <CopyImageButton
              getNode={() => cardRef.current}
              filenameBase={title}
              background={COLORS.surface}
            />
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="mis-btn mis-icon-btn"
              style={styles.chartIconBtn}
              title="Zoom in"
              aria-label={`Zoom in on ${title}`}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
        {renderChart(height)}
        {note}
      </div>

      {zoomed && (
        <div style={styles.chartModalOverlay} onClick={() => setZoomed(false)}>
          <div style={styles.chartModalBox} onClick={e => e.stopPropagation()}>
            <div ref={modalRef} style={styles.chartModalCaptureArea}>
              <div style={styles.chartModalHeader}>
                <h3 style={{ ...styles.chartCardTitle, margin: 0 }}>{title}</h3>
                <div style={styles.chartHeaderBtnGroup}>
                  <CopyImageButton
                    getNode={() => modalRef.current}
                    filenameBase={title}
                    background={COLORS.bgElevated}
                  />
                  <button
                    type="button"
                    onClick={() => setZoomed(false)}
                    className="mis-btn mis-icon-btn"
                    style={styles.chartModalCloseBtn}
                    aria-label="Close zoomed chart"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div style={styles.chartModalBody}>
                {renderChart(Math.max(height + 200, 480))}
              </div>
              {note}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Age brackets for the Age-wise Split chart, checked in order
const AGE_BRACKETS = [
  { label: '0-18', min: 0, max: 18 },
  { label: '19-30', min: 19, max: 30 },
  { label: '31-45', min: 31, max: 45 },
  { label: '46-60', min: 46, max: 60 },
  { label: '60+', min: 61, max: Infinity }
];

const bucketAge = (value) => {
  const n = Number(value);
  if (value === '' || value === undefined || value === null || isNaN(n)) return 'Unknown';
  const bracket = AGE_BRACKETS.find(b => n >= b.min && n <= b.max);
  return bracket ? bracket.label : 'Unknown';
};

// The four stages of the pipeline. This genuinely is a linear process — a
// file has to be uploaded, converted, then re-uploaded with edits before
// insights can be built — so a numbered stepper encodes real information
// (what's done, what's next), not decoration.
const STEP_META = {
  select:            { num: 1, label: 'Upload File' },
  convert:            { num: 2, label: 'Convert' },
  preview:            { num: 2, label: 'Convert' },
  'upload-insights':  { num: 3, label: 'Add Details' },
  dashboard:          { num: 4, label: 'Insights' }
};
const STEP_ORDER = [
  { num: 1, label: 'Upload File' },
  { num: 2, label: 'Convert' },
  { num: 3, label: 'Add Details' },
  { num: 4, label: 'Insights' }
];

// Persistent progress spine shown above every step's card. Replaces the
// old per-step colored badge: a single always-visible stepper communicates
// where the user is in the four-stage pipeline at all times, not just on
// the current screen.
const Stepper = ({ step }) => {
  const current = STEP_META[step]?.num || 1;
  return (
    <div style={styles.stepper}>
      {STEP_ORDER.map((it, i) => {
        const state = it.num < current ? 'done' : it.num === current ? 'active' : 'pending';
        return (
          <React.Fragment key={it.num}>
            <div style={styles.stepNode}>
              <div
                style={{
                  ...styles.stepDot,
                  ...(state === 'done' ? styles.stepDotDone : state === 'active' ? styles.stepDotActive : styles.stepDotPending)
                }}
              >
                {state === 'done' ? <Check size={16} strokeWidth={3} /> : it.num}
              </div>
              <span className="mis-step-label" style={{ ...styles.stepLabel, color: state === 'pending' ? COLORS.textMuted : COLORS.textPrimary }}>
                {it.label}
              </span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div style={{ ...styles.stepConnector, backgroundColor: it.num < current ? COLORS.accent : COLORS.border }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Keyword buckets for the Claim Nature chart (Maternity / Injury / Illness).
// Anything not clearly maternity- or injury-related defaults to Illness,
// since that's the overwhelming majority of health claims.
const NATURE_KEYWORDS = {
  Maternity: ['matern', 'pregnan', 'deliver', 'obstetric', 'lscs', 'caesar', 'cesar'],
  Injury: ['injury', 'injuries', 'accident', 'trauma', 'fracture', 'burn', 'wound', 'poly trauma', 'rta']
};

const bucketClaimNature = (disease, treatment, claimType1) => {
  const text = `${disease || ''} ${treatment || ''} ${claimType1 || ''}`.toLowerCase();
  if (NATURE_KEYWORDS.Maternity.some(k => text.includes(k))) return 'Maternity';
  if (NATURE_KEYWORDS.Injury.some(k => text.includes(k))) return 'Injury';
  return 'Illness';
};

// All standardized Status values (see statusMapping)
const ALL_STATUSES = ['In Process', 'Under Query', 'Approved', 'Rejected', 'Settled', 'Withdrawn'];

// Groups converted rows into everything the dashboard needs
// FIXED: Now counts FDR/LDR for ALL claims, not just reimbursement
const getDashboardAnalytics = (rows) => {
  const claimTypeCounts = { Cashless: 0, Reimbursement: 0, Other: 0 };
  const relationCounts = {};
  const rejectionReasonCounts = {};
  const diseaseCounts = {};
  const ageCounts = {};
  const stateCounts = {};
  const cityCounts = {};
  const claimNatureCounts = { Maternity: 0, Injury: 0, Illness: 0 };
  // Standardized Status values, tracked both by claim count and by total
  // claimed value (₹) so the dashboard can show "Status by count" and
  // "Status by value" side by side.
  const statusCounts = Object.fromEntries(ALL_STATUSES.map(s => [s, 0]));
  const statusValueSums = Object.fromEntries(ALL_STATUSES.map(s => [s, 0]));
  let unmatchedStateCount = 0;
  let totalClaimsWithFDR = 0;
  let totalClaimsWithLDR = 0;

  rows.forEach(row => {
    // 1. Cashless vs Reimbursement
    const claimTypeRaw = String(row['Claim Type'] || '').toLowerCase();
    let bucket = 'Other';
    if (claimTypeRaw.includes('cashless')) bucket = 'Cashless';
    else if (claimTypeRaw.includes('reimburs')) bucket = 'Reimbursement';
    claimTypeCounts[bucket] += 1;

    // FIX: Count FDR/LDR for ALL claims (not just reimbursement)
    if (row['FDR']) totalClaimsWithFDR += 1;
    if (row['LDR']) totalClaimsWithLDR += 1;

    // 4. Relationship-wise split
    const relation = String(row['benef_relation'] || '').trim() || 'Unknown';
    relationCounts[relation] = (relationCounts[relation] || 0) + 1;

    // Age-wise split
    const ageBucket = bucketAge(row['dob / age']);
    ageCounts[ageBucket] = (ageCounts[ageBucket] || 0) + 1;

    // 5a. Claims by state (kept for reference / possible future use)
    const stateName = normalizeStateName(row['State']);
    if (stateName) {
      stateCounts[stateName] = (stateCounts[stateName] || 0) + 1;
    } else if (String(row['State'] || '').trim()) {
      unmatchedStateCount += 1;
    }

    // 5b. Claims by city — no India city-level map is available, so this
    // drives a "Claims by city" bar chart instead of a choropleth.
    const cityName = String(row['City'] || '').trim();
    if (cityName) {
      cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
    }

    // 6. Rejected claims reasons
    if (String(row['Status'] || '').toLowerCase() === 'rejected') {
      const reason = String(row['Remark-Rejection'] || '').trim() || 'Unspecified';
      rejectionReasonCounts[reason] = (rejectionReasonCounts[reason] || 0) + 1;
    }

    // 7. Disease-wise split
    const disease = String(row['Disease Category'] || '').trim() || 'Unspecified';
    diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;

    // 7b. Claim nature — Maternity / Injury / Illness
    const nature = bucketClaimNature(row['Disease Category'], row['Treatment'], row['Claim Type 1']);
    claimNatureCounts[nature] += 1;

    // 8. Status split — by count AND by value (sum of Claim Submitted ₹)
    const statusVal = String(row['Status'] || '').trim();
    if (Object.prototype.hasOwnProperty.call(statusCounts, statusVal)) {
      statusCounts[statusVal] += 1;
      const amt = Number(row['Claim Submitted']) || 0;
      statusValueSums[statusVal] += amt;
    }
  });

  const toChartData = (obj, limit) => {
    const sorted = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    return (limit ? sorted.slice(0, limit) : sorted).map(([name, value]) => ({ name, value }));
  };

  // Cashless vs Reimbursement RATIO as a pie (percentage split, "Other"/blank
  // claim types excluded so the two slices always add up to 100%).
  const ratioBase = claimTypeCounts.Cashless + claimTypeCounts.Reimbursement;
  const cashlessPct = ratioBase ? Math.round((claimTypeCounts.Cashless / ratioBase) * 100) : 0;
  const reimbursementPct = ratioBase ? 100 - cashlessPct : 0;

  return {
    claimTypeData: toChartData(claimTypeCounts).filter(d => d.value > 0),
    cashlessReimbRatioPie: [
      { name: 'Cashless', value: cashlessPct },
      { name: 'Reimbursement', value: reimbursementPct }
    ],
    documentReceiptData: [
      { name: 'FDR Received', value: totalClaimsWithFDR },
      { name: 'LDR Received', value: totalClaimsWithLDR },
      { name: 'Total Claims', value: rows.length }
    ],
    relationData: toChartData(relationCounts),
    ageData: [...AGE_BRACKETS.map(b => b.label), 'Unknown']
      .filter(label => ageCounts[label] > 0)
      .map(label => ({ name: label, value: ageCounts[label] })),
    stateCounts,
    unmatchedStateCount,
    cityData: toChartData(cityCounts, 10),
    rejectionReasonData: toChartData(rejectionReasonCounts, 8),
    diseaseData: toChartData(diseaseCounts, 8),
    claimNatureData: toChartData(claimNatureCounts),
    statusCounts,
    statusValueSums
  };
};

const MISConverterTool = () => {
  const [step, setStep] = useState('select'); // select, convert, preview, upload-insights, dashboard
  const [selectedInsurer, setSelectedInsurer] = useState('');
  const [autoDetected, setAutoDetected] = useState(false);
  const [detectedSheetName, setDetectedSheetName] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [convertedRows, setConvertedRows] = useState(null);
  const [matchStats, setMatchStats] = useState(null);
  const [workbookBuffer, setWorkbookBuffer] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [downloadedOnce, setDownloadedOnce] = useState(false);
  const fileInputRef = useRef(null);

  // Insights re-upload step: the dashboard is built from whatever file is
  // uploaded here, NOT from convertedRows in memory - so if the team edits
  // the downloaded file before generating insights, those edits are reflected.
  const [insightsFile, setInsightsFile] = useState(null);
  const [insightsRows, setInsightsRows] = useState(null);
  const [insightsError, setInsightsError] = useState('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const insightsFileInputRef = useRef(null);

  // Collected right after the final file is uploaded (Step 3), shown as
  // widgets at the top of the dashboard (Step 4) rather than derived from
  // the file itself.
  const [companyName, setCompanyName] = useState('');
  const [policyYear, setPolicyYear] = useState('');
  const [inceptionPremium, setInceptionPremium] = useState('');
  const [endorsementPremium, setEndorsementPremium] = useState('');
  const [earnedPremium, setEarnedPremium] = useState('');
  const [inceptionLives, setInceptionLives] = useState('');
  const [expiringLives, setExpiringLives] = useState('');
  const [insightsFieldsError, setInsightsFieldsError] = useState('');

  const insurersList = [
    "ABHI Inhouse",
    "Healthinida tpa",
    "FHPL TPA",
    "SBI",
    "ICICI LOMBARD",
    "TATA AIG",
    "GO Digit",
    "Mediassist TPA",
    "Niva Bupa",
    "Magma",
    "Care Health",
    "Bajaj General",
    "HDFC ERGO"
  ];

  // Standard Healthysure column order (excludes calculated/TAT columns and Sr No,
  // which are generated automatically rather than mapped from source)
  const healthysureColumns = [
    "Claim No",
    "Status",
    "sub_status",
    "Insurance Type",
    "Claim Type",
    "Claim Type 1",
    "dob / age",
    "Insured Person",
    "TPA",
    "Insurance Company",
    "Name of Employee",
    "Master Policy No",
    "E-Card No",
    "Employee ID",
    "City",
    "State",
    "Treatment",
    "Disease Category",
    "Hospital Name",
    "Claim Submitted",
    "Claim Approved",
    "Deduction Amt",
    "CO-PAY",
    "Hospital Discount",
    "Sum Insured",
    "Remark-Rejection",
    "Remark-Deduction",
    "Date of Admission",
    "Date of Discharge",
    "FDR - HS",
    "FDR",
    "LDR",
    "Date of Rejection",
    "Date of Settlement",
    "benef_gender",
    "benef_relation"
  ];

  // Insurer source-column -> Healthysure column, parsed from MIS_Mapping.xlsx
  const columnMapping = {
    "ABHI Inhouse": {
      "ABHI Claim No": "Claim No",
      "Final ABHI Status-Current Month": "Status",
      "Product Name": "Insurance Type",
      "Claim Type": "Claim Type",
      "Claim Category": "Claim Type 1",
      "Patient Age": "dob / age",
      "Patient Name": "Insured Person",
      "TPA Name": "TPA",
      "Proposer Name": "Name of Employee",
      "Master Policy No": "Master Policy No",
      "Member Code": "E-Card No",
      "CORPORATE_EMPLOYEE_CODE": "Employee ID",
      "Hospital City": "City",
      "Hospital State": "State",
      "Diagnosis": "Treatment",
      "ICD Level1": "Disease Category",
      "Hospital Name": "Hospital Name",
      "Claimed Amount": "Claim Submitted",
      "ABHI Amount Less Coins - Current Month": "Claim Approved",
      "Deductible_Amount": "Deduction Amt",
      "Copay_Amount": "CO-PAY",
      "Mou_Discount_Amount": "Hospital Discount",
      "Sum Insured": "Sum Insured",
      "Rejection Category": "Remark-Rejection",
      "Deduction_Reason": "Remark-Deduction",
      "DOA": "Date of Admission",
      "DOD": "Date of Discharge",
      "Intimation Date": "FDR",
      "Repudiation Date": "Date of Rejection",
      "Settled Date": "Date of Settlement",
      "Gender": "benef_gender",
      "Relation": "benef_relation"
    },
    "Healthinida tpa": {
      "CLAIM_NUMBER": "Claim No",
      "FINAL_CLAIM_STATUS": "Status",
      "SUB_STATUS": "sub_status",
      "POLICY_TYPE": "Insurance Type",
      "CCN_TYPE_NAME": "Claim Type",
      "CLAIM_TYPE_OPD_IPD": "Claim Type 1",
      "AGE": "dob / age",
      "PATIENT_NAME": "Insured Person",
      "INSURANCE_CO_NAME": "Insurance Company",
      "INSURED": "Name of Employee",
      "POLICY_NO": "Master Policy No",
      "MEMBER_CODE": "E-Card No",
      "EMPLOYEE_CODE": "Employee ID",
      "HOSPITAL_CITY": "City",
      "HOSPITAL_STATE": "State",
      "FINAL_DIAGNOSIS": "Treatment",
      "DISEASE_CATEGORY": "Disease Category",
      "HOSPITAL_NAME": "Hospital Name",
      "CLAIMED_AMOUNT": "Claim Submitted",
      "PAID_AMT": "Claim Approved",
      "NOT_PAYBLE_AMOUNT": "Deduction Amt",
      "DISCOUNT_AMOUNT": "Hospital Discount",
      "SUM_INSURED": "Sum Insured",
      "REJECTION_REASON": "Remark-Rejection",
      "DEDUCTION_DETAILS": "Remark-Deduction",
      "DATEOF_ADMISSION": "Date of Admission",
      "DATEOF_DISCHARGE": "Date of Discharge",
      "DATE_OF_FILE_RECEIVED": "FDR",
      "DEFICIENCY_RETRIVAL_DATE": "LDR",
      "CLAIM_REJECT_DATE / REJECTION_CLOSED_DATE": "Date of Rejection",
      "PAYMENT_DATE": "Date of Settlement",
      "GENDER": "benef_gender",
      "RELATION_NAME": "benef_relation"
    },
    "FHPL TPA": {
      "claimid": "Claim No",
      "claim Status": "Status",
      "Current Claim Status": "sub_status",
      "Product type": "Insurance Type",
      "Claim Type": "Claim Type",
      "Class Of Accommodation": "Claim Type 1",
      "Yrs": "dob / age",
      "Membername": "Insured Person",
      "TPA Name": "TPA",
      "insurancename": "Insurance Company",
      "Main Memname": "Name of Employee",
      "Policy No": "Master Policy No",
      "Main Memuhidno": "E-Card No",
      "employeeid": "Employee ID",
      "providerplace": "City",
      "providerstate": "State",
      "Diagnosis": "Treatment",
      "icdcode Third Level": "Disease Category",
      "Providername": "Hospital Name",
      "claimamount": "Claim Submitted",
      "Net Amount Paid": "Claim Approved",
      "Disallowed Amount": "Deduction Amt",
      "Co Payment": "CO-PAY",
      "Discountamount": "Hospital Discount",
      "coverageamount": "Sum Insured",
      "Dis Rej reason": "Remark-Rejection",
      "Dis Allowence Reason1": "Remark-Deduction",
      "Admdate": "Date of Admission",
      "Dis Date": "Date of Discharge",
      "Claimreceiveddate": "FDR",
      "Date of IRretrieval Date": "LDR",
      "Settled Date": "Date of Settlement",
      "Gender": "benef_gender",
      "relationship": "benef_relation"
    },
    "SBI": {
      "Claim No": "Claim No",
      "External Status": "Status",
      "Product type": "Insurance Type",
      "Claim Type": "Claim Type",
      "Class Of Accommodation": "Claim Type 1",
      "Age": "dob / age",
      "Patient Name": "Insured Person",
      "Insurance Name": "Insurance Company",
      "Proposer Name Employee Name": "Name of Employee",
      "Master Policy No": "Master Policy No",
      "Proposer SBIG Member ID": "E-Card No",
      "Employee code": "Employee ID",
      "Providerplace": "City",
      "Providerstate": "State",
      "Fhp Disease": "Treatment",
      "Diagnosis Group": "Disease Category",
      "Providername": "Hospital Name",
      "Claimamount": "Claim Submitted",
      "Incurred Amount": "Claim Approved",
      "Disallowed towards Non Medical Items": "Deduction Amt",
      "Disallowed made towards co pay": "CO-PAY",
      "Disallowed towards Proportionate deductions": "Hospital Discount",
      "Sum Insured": "Sum Insured",
      "Dis Allowence Reason": "Remark-Deduction",
      "Date of Admission": "Date of Admission",
      "Date of Discharge": "Date of Discharge",
      "Claimcreateddatetime": "FDR",
      "Payment Transaction Date": "Date of Settlement",
      "Gender": "benef_gender",
      "Relationship": "benef_relation"
    },
    "ICICI LOMBARD": {
      "CLAIM_NUMBER": "Claim No",
      "Updated_status": ["Status", "sub_status"],
      "STATUS": "sub_status",
      "CLASSIFICATION": "Insurance Type",
      "TYPE_OF_CLAIM": "Claim Type",
      "CLAIM_CLASSIFICATION": "Claim Type 1",
      "AGE": "dob / age",
      "INSURED_NAME": "Insured Person",
      "TPA_NAME": "TPA",
      "Provider Name": "Insurance Company",
      "MAIN_MEMBER_NAME": "Name of Employee",
      "POLICY_NO": "Master Policy No",
      "UHID": "E-Card No",
      "EMPLOYEE_MEMBER_ID": "Employee ID",
      "HOSPITAL_CITY": "City",
      "HOSPITAL_STATE": "State",
      "DIAGNOSIS": "Treatment",
      "Disease_Category": "Disease Category",
      "DISEASE_CATEGORY": "Disease Category",
      "HOSPITAL_NAME": "Hospital Name",
      "Claim_r_Os_Amt": "Claim Submitted",
      "CLAIMED_AMOUNT": "Claim Submitted",
      "PAYMENT_AMOUNT": "Claim Approved",
      "DISALLOWED_AMOUNT": "Deduction Amt",
      "COPAYMENT_AMT": "CO-PAY",
      "MOU_DISCOUNT": "Hospital Discount",
      "SUM_INSURED": "Sum Insured",
      "REJECTED_QUERY_DESC": "Remark-Rejection",
      "REASON_FOR_DISALLOWANCE": "Remark-Deduction",
      "DOA": "Date of Admission",
      "Date of Admission": "Date of Admission",
      "DOD": "Date of Discharge",
      "Date of Discharge": "Date of Discharge",
      "INWARD_DATE": "FDR",
      "FILE_RECVD_DATE": "FDR",
      "DT_OF_DEFICIENCIES_RECIEVED": "LDR",
      "REJECTED_QUERY_CLOSED_DATE": "Date of Rejection",
      "PAYMENT_DATE": "Date of Settlement",
      "GENDER": "benef_gender",
      "Relation_Group": "benef_relation",
      "Relation": "benef_relation"
    },
    "TATA AIG": {
      "Claim Number": "Claim No",
      "Claim Sub Status": "Status",
      "Claim Type": "Claim Type",
      "Age": "dob / age",
      "Member Name": "Insured Person",
      "Employee Name": "Name of Employee",
      "Policy Number": "Master Policy No",
      "Member Id": "E-Card No",
      "Employee Id": "Employee ID",
      "Provider Place": "State",
      "Diagnosis": "Treatment",
      "Provider Name": "Hospital Name",
      "Claimed Amount": "Claim Submitted",
      "Settled Amount": "Claim Approved",
      "Coverage Amount": "Sum Insured",
      "Admission Date": "Date of Admission",
      "Discharge Date": "Date of Discharge",
      "Claim Received Date": "FDR",
      "Query Retrieval Date": "LDR",
      "Approval Date": "Date of Settlement",
      "Gender": "benef_gender",
      "Relationship": "benef_relation"
    },
    "GO Digit": {
      "claim_no": "Claim No",
      "claim_status": "Status",
      "claim_type": "Claim Type",
      "loss_type": "Claim Type 1",
      "entry_age": "dob / age",
      "insured_person": "Insured Person",
      "proposer_name": "Name of Employee",
      "master_policy_number": "Master Policy No",
      "policy_no": "E-Card No",
      "employee_code": "Employee ID",
      "final_diagnosis": "Treatment",
      "icd_group": "Disease Category",
      "hospital_name": "Hospital Name",
      "claimed_amount": "Claim Submitted",
      "net_paid": "Claim Approved",
      "base_sum_insured": "Sum Insured",
      "decline_reason": "Remark-Rejection",
      "date_of_admission": "Date of Admission",
      "date_of_discharge": "Date of Discharge",
      "intimation_date": "FDR",
      "gender": "benef_gender",
      "relationship_with_proposer": "benef_relation"
    },
    "Mediassist TPA": {
      "Claim_Id": "Claim No",
      "Claim_Stage": "Status",
      "Policy_Type": "Insurance Type",
      "Claim_Type": "Claim Type",
      "Opd_Ipd": "Claim Type 1",
      "Benef_Age": "dob / age",
      "Benef_Name": "Insured Person",
      "Tpa_Name": "TPA",
      "Insurance_Company": "Insurance Company",
      "Pribenef_Name": "Name of Employee",
      "Policy_No": "Master Policy No",
      "Benef_Insurer_Id": "E-Card No",
      "Pribenef_Employee_Code": "Employee ID",
      "Hospital_City": "City",
      "Hospital_State": "State",
      "Treatment_Name": "Treatment",
      "Hospital_Name": "Hospital Name",
      "Claim_Amount": "Claim Submitted",
      "Claim_Approved_Amount": "Claim Approved",
      "Deduction_Amount_Excess_Policy": "Deduction Amt",
      "Deduction_Amount_Copay": "CO-PAY",
      "Pribenef_Floater_Sum": "Sum Insured",
      "Denial_Description": "Remark-Rejection",
      "Bill_Deduction_Reason": "Remark-Deduction",
      "Date_Of_Admission": "Date of Admission",
      "Date_Of_Discharge": "Date of Discharge",
      "Claim_Received_Date": "FDR",
      "Last_Necessary_Doc_Rec_Date": "LDR",
      "Payment_Date": "Date of Settlement",
      "Benef_Gender": "benef_gender",
      "Benef_Relation": "benef_relation"
    },
    "Niva Bupa": {},
    "Magma": {},
    "Care Health": {
      "Claim_Number": "Claim No",
      "Preauth_Number": "Claim No",
      "Status_CorporateMIS": ["Status", "Claim Type"],
      "Age": "dob / age",
      "Insured_Member_Name": "Insured Person",
      "Employee_Name": "Name of Employee",
      "Policy_Number": "Master Policy No",
      "Insured_Member_ID": "E-Card No",
      "Employee_No": "Employee ID",
      "hospital_city": "City",
      "hospital_state": "State",
      "Hospital": "Hospital Name",
      "Claim_Amount": "Claim Submitted",
      "Paid_Amount": "Claim Approved",
      "Disallowed_Amount": "Deduction Amt",
      "copay_amount": "CO-PAY",
      "Sum_Insured": "Sum Insured",
      "Reason_if_not_Paid": "Remark-Rejection",
      "disallowed_reason": "Remark-Deduction",
      "Date_of_Hospital_Admission": "Date of Admission",
      "Date_of_Discharge": "Date of Discharge",
      "date_of_registration_of_claim": "FDR",
      "payment_date": "Date of Settlement",
      "Gender": "benef_gender",
      "Relationship_Desc": "benef_relation"
    },
    "Bajaj General": {
      "Claim No": "Claim No",
      "Rev'd Claim Close Status": "Status",
      "Claim Type": "Claim Type",
      "Room Category": "Claim Type 1",
      "Age": "dob / age",
      "Patient": "Insured Person",
      "Employee Name": "Name of Employee",
      "Policy": "Master Policy No",
      "Id Card": "E-Card No",
      "Co Empnumber": "Employee ID",
      "City": "City",
      "State": "State",
      "Final Diagnosis": "Treatment",
      "Revd Disease Category": "Disease Category",
      "Hospital": "Hospital Name",
      "Total Bill": "Claim Submitted",
      "IC_Amt": "Claim Approved",
      "Insured Disallowed Amt": "Deduction Amt",
      "Hospital Disallowed Amt": "Hospital Discount",
      "Sum Insured": "Sum Insured",
      "Denial Reason": "Remark-Rejection",
      "Insured Disallow Amt Reason": "Remark-Deduction",
      "Actual Doa": "Date of Admission",
      "Actual Dod": "Date of Discharge",
      "Registration Date": "FDR",
      "Doc Receive Date Max": "LDR",
      "Denial Date": "Date of Rejection",
      "Approval Date": "Date of Settlement",
      "Gender": "benef_gender",
      "Relation": "benef_relation"
    },
    "HDFC ERGO": {
      "CLM_REFERENCE_NUM": "Claim No",
      "CLAIM_STATUS": "Status",
      "MDM_PRODUCT_NAME": "Insurance Type",
      "CLM_TYPE": "Claim Type",
      "CLM_TRATMENT_TYPE": "Claim Type 1",
      "CLM_PATIENT_DOB": "dob / age",
      "CLAIMANT_NAME": "Insured Person",
      "CLM_EMPLOYEE_NAME": "Name of Employee",
      "POL_NUM_TXT": "Master Policy No",
      "CLM_EMPLOYEE_NO": "Employee ID",
      "CLM_HOSPITAL_ADDRESS": "State",
      "CLM_AILMENT_NAME": "Treatment",
      "CLM_LOSS_DETAILS": "Disease Category",
      "HOSPITAL_NAME": "Hospital Name",
      "CLM_CLAIMED_AMT": "Claim Submitted",
      "LOSS_PAID": "Claim Approved",
      "CLM_REPUDIATION_REASON": "Remark-Rejection",
      "DATE_OF_ADMISSION": "Date of Admission",
      "DATE_OF_DISCHARGE": "Date of Discharge",
      "CLM_INTIMATION_DATE": "FDR",
      "CLM_LAST_DOC_RECEIVE_DATE": "LDR",
      "CLM_CLOSED_DATE": "Date of Settlement",
      "CLM_PATIENT_RELATION": "benef_relation"
    }
  };

  const statusMapping = {
    "Under Process": "In Process",
    "Cashless Approved": "Approved",
    "Repudiated": "Rejected",
    "Under Query": "In Process",
    "PAID": "Settled",
    "CLAIM WIP": "In Process",
    "AL Approved": "Approved",
    "QUERY": "In Process",
    "SENT FOR PAYMENT": "Approved",
    "REJECT": "Rejected",
    "CLAIM_WIP": "In Process",
    "AL_OPEN": "Approved",
    "REJECTED": "Rejected",
    "Deficient Claim": "In Process",
    "Closed": "Rejected",
    "SETTLED": "Settled",
    "Closed: Deficient Claim": "Rejected",
    "OUTSTANDING": "In Process",
    "REPUDIATED": "Rejected",
    "CLOSED": "Withdrawn",
    "Outstanding": "In Process",
    "Settled": "Settled",
    "UTR Awaited": "Approved",
    "Debit Note Raised Awaited for UTR": "Approved",
    "Claim Paid": "Settled",
    "Claim Repudiated": "Rejected",
    "Claim document awaited": "In Process",
    "Payment under process": "Approved",
    "Pending claim adjudication": "In Process",
    "Processed - awaiting  insurer concurrence": "In Process",
    "Information / query pending from customer -1": "In Process",
    "Claim Referred for verification": "In Process",
    "Open": "In Process",
    "Paid": "Settled",
    "CWP": "Rejected",
    "APPROVED": "Approved",
    "CLOSED WITHOUT PAYMENT": "Withdrawn",
    "Cashless Settled": "Settled",
    "Cancelled": "Rejected",
    "Reimbursement Settled": "Settled",
    "Cashless In Query": "Approved",
    "Reimbursement In Query": "Under Query",
    "Cashless Issued": "Approved",
    "Reimbursement in Process": "In process",
    "Cashless in Process": "Approved",
    "Reimbursement Approved": "Approved",
    "Rejected": "Rejected",
    "Pre-Auth Approved": "Approved",
    "No query response": "Under Query",
    "Queried": "Under Query",
    "UTR Pending": "Approved",
    "Commercial Approved": "Approved",
    "Cashless Registered": "Approved",
    "Denied": "Rejected",
    "In Process": "In Process"
  };

  const subStatusMapping = {
    "For Settlement": "In Process",
    "Cashless Approved": "Approved",
    "Refer to Insurer": "In Process",
    "For Bill Entry": "In Process",
    "For Audit": "In Process",
    "For Investigation": "In Process",
    "Repudiated": "Rejected",
    "For Payment": "In Process",
    "For Adjudication": "In Process",
    "First Reminder-Hospital": "Under Query",
    "PENDING FOR DOCUMENTS": "Under Query",
    "REIMBURSEMENT RAISED": "In Process",
    "INTERIM APPROVED": "In Process",
    "REJECTION IN PROGRESS": "Rejected",
    "INITIAL RAISED": "In Process",
    "INITIAL APPROVED": "In Process",
    "SETTLED": "Settled",
    "Deficient Claim": "Under Query",
    "3rd Reminder Sent": "Under Query",
    "Closed: Deficient Claim": "Under Query",
    "Paid": "Settled",
    "Closed:Cashless Denial": "Rejected",
    "UTR Awaited": "Approved",
    "Approval Request Sent": "In Process",
    "Under Process": "In Process",
    "Authorised": "In Process",
    "AL Issued": "In Process",
    "Closed:Intimation Closed": "Withdrawn",
    "Closed: AL Issued File Not Received": "Withdrawn",
    "Closed: Cashless Denial": "Rejected",
    "Closed: Others": "Rejected",
    "For Repudiation": "Rejected",
    "UTR Awited": "Approved",
    "Intimation Claim": "In Process"
  };

  const genderMapping = {
    "Male": "Male",
    "Female": "Female",
    "M": "Male",
    "F": "Female"
  };

  const claimTypeMapping = {
    "PP": "Cashless",
    "PREAUTH": "Cashless",
    "Cashless": "Cashless",
    "Cashless In Query": "Cashless",
    "Cashless Issued": "Cashless",
    "Cashless Settled": "Cashless",
    "Cashless in Process": "Cashless",
    "Reimbursement": "Reimbursement",
    "REIMB": "Reimbursement",
    "PR": "Reimbursement",
    "MR": "Reimbursement",
    "Reimbursement Approved": "Reimbursement",
    "Reimbursement In Query": "Reimbursement",
    "Reimbursement Settled": "Reimbursement",
    "Reimbursement in Process": "Reimbursement"
  };

  const outputColumns = ['Insurer/tpa', 'Sr No', ...healthysureColumns];

  const handleInsurerSelect = (e) => {
    setSelectedInsurer(e.target.value);
    setAutoDetected(false);
    setDetectedSheetName('');
    setError('');
  };

  const getSheetHeaders = (worksheet) => {
    if (!worksheet['!ref']) return [];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const headers = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_col(C) + (range.s.r + 1)];
      if (cell && cell.v !== undefined) headers.push(cell.v);
    }
    return headers;
  };

  const findBestSheetAndInsurer = (workbook) => {
    let best = { sheetName: workbook.SheetNames[0], insurer: '', score: 0 };
    workbook.SheetNames.forEach(sheetName => {
      const headers = getSheetHeaders(workbook.Sheets[sheetName]).map(h => String(h).trim());
      insurersList.forEach(insurer => {
        const knownCols = Object.keys(columnMapping[insurer] || {});
        if (knownCols.length === 0) return;
        const score = headers.filter(h => knownCols.includes(h)).length;
        if (score > best.score) {
          best = { sheetName, insurer, score };
        }
      });
    });
    return best;
  };

  const pickSheetForInsurer = (workbook, insurer) => {
    if (workbook.SheetNames.length === 1) return workbook.SheetNames[0];

    const knownCols = Object.keys(columnMapping[insurer] || {});
    let best = { sheetName: workbook.SheetNames[0], score: -1, headerCount: -1 };
    workbook.SheetNames.forEach(sheetName => {
      const headers = getSheetHeaders(workbook.Sheets[sheetName]).map(h => String(h).trim());
      const score = knownCols.length ? headers.filter(h => knownCols.includes(h)).length : 0;
      const headerCount = headers.length;
      if (score > best.score || (score === best.score && headerCount > best.headerCount)) {
        best = { sheetName, score, headerCount };
      }
    });
    return best.sheetName;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setUploadedFile(file);
    setError('');
    setSelectedInsurer('');
    setAutoDetected(false);
    setDetecting(true);

    try {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      const workbook = XLSX.read(fileData, { type: 'array' });
      const best = findBestSheetAndInsurer(workbook);

      if (best.score >= 3) {
        setSelectedInsurer(best.insurer);
        setAutoDetected(true);
        setDetectedSheetName(workbook.SheetNames.length > 1 ? best.sheetName : '');
      } else {
        setDetectedSheetName('');
      }
    } catch (err) {
      console.error('Auto-detect failed:', err);
    } finally {
      setDetecting(false);
    }
  };

  const applyTerminology = (col, value) => {
    if (value === '' || value === undefined || value === null) return '';
    if (DATE_COLUMNS.has(col)) return formatDateValue(value);
    if (col === 'dob / age') return ageFromDob(value);
    const v = String(value).trim();
    if (col === 'Status' && statusMapping[v]) return statusMapping[v];
    if (col === 'sub_status' && subStatusMapping[v]) return subStatusMapping[v];
    if (col === 'benef_gender' && genderMapping[v]) return genderMapping[v];
    if (col === 'Claim Type' && claimTypeMapping[v]) return claimTypeMapping[v];
    return value;
  };

  const handleConvert = async () => {
    if (!selectedInsurer || !uploadedFile) {
      setError('Please select an insurer and upload a file');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(20);

    try {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(uploadedFile);
      });

      setProgress(40);

      const workbook = XLSX.read(fileData, { type: 'array', cellDates: true });
      const worksheetName = pickSheetForInsurer(workbook, selectedInsurer);
      const worksheet = workbook.Sheets[worksheetName];
      const sourceData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (sourceData.length === 0) {
        throw new Error(`No data found in the "${worksheetName}" sheet of the uploaded file`);
      }

      setProgress(55);

      const mapping = columnMapping[selectedInsurer] || {};

      const rows = sourceData.map((srcRow, index) => {
        const newRow = { 'Insurer/tpa': selectedInsurer, 'Sr No': index + 1 };

        healthysureColumns.forEach(col => { newRow[col] = ''; });

        Object.keys(srcRow).forEach(sourceCol => {
          const targetCol = mapping[sourceCol.trim()];
          if (!targetCol) return;
          const targets = Array.isArray(targetCol) ? targetCol : [targetCol];
          targets.forEach(t => {
            newRow[t] = applyTerminology(t, srcRow[sourceCol]);
          });
        });

        return newRow;
      });

      setProgress(70);

      const filledCols = healthysureColumns.filter(col =>
        rows.some(r => r[col] !== '' && r[col] !== undefined && r[col] !== null)
      );
      const matchInfo = { filled: filledCols.length, total: healthysureColumns.length };

      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Healthysure MIS');

      ws.columns = outputColumns.map(col => ({
        header: col,
        key: col,
        width: Math.max(col.length + 4, 14)
      }));

      rows.forEach(r => ws.addRow(r));

      const headerRow = ws.getRow(1);
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF095244' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });
      headerRow.height = 24;

      for (let i = 2; i <= rows.length + 1; i++) {
        const row = ws.getRow(i);
        row.eachCell({ includeEmpty: true }, cell => {
          cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
          };
          if (i % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7F6F3' } };
          }
        });
      }

      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: outputColumns.length } };
      ws.views = [{ state: 'frozen', ySplit: 1 }];

      setProgress(85);

      const buffer = await wb.xlsx.writeBuffer();

      setConvertedRows(rows);
      setMatchStats(matchInfo);
      setWorkbookBuffer(buffer);
      setFileName(`Healthysure_MIS_${selectedInsurer.replace(/\s+/g, '_')}_${Date.now()}.xlsx`);

      setProgress(100);
      setStep('preview');
    } catch (err) {
      setError(`Error during conversion: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!workbookBuffer) return;
    const blob = new Blob([workbookBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setDownloadedOnce(true);
    setStep('upload-insights');
  };

  const handleInsightsFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setInsightsError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setInsightsFile(file);
    setInsightsError('');
    setInsightsLoading(true);

    try {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      const workbook = XLSX.read(fileData, { type: 'array', cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (data.length === 0) {
        throw new Error('No data found in the uploaded file');
      }

      setInsightsRows(data);
      // Do NOT auto-advance to the dashboard - stay on Step 3 so policy
      // details can be entered first.
    } catch (err) {
      setInsightsError(`Error reading file: ${err.message}`);
      console.error(err);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleViewInsights = () => {
    if (!insightsRows) {
      setInsightsFieldsError('Please upload the final Excel file first.');
      return;
    }
    if (
      companyName.trim() === '' ||
      policyYear === '' ||
      inceptionPremium === '' ||
      endorsementPremium === '' ||
      earnedPremium === '' ||
      inceptionLives === '' ||
      expiringLives === ''
    ) {
      setInsightsFieldsError('Please fill in all policy details before viewing insights.');
      return;
    }
    setInsightsFieldsError('');
    setStep('dashboard');
  };

  const handleReset = () => {
    setStep('select');
    setSelectedInsurer('');
    setAutoDetected(false);
    setDetectedSheetName('');
    setUploadedFile(null);
    setConvertedRows(null);
    setMatchStats(null);
    setWorkbookBuffer(null);
    setInsightsFile(null);
    setInsightsRows(null);
    setInsightsError('');
    setCompanyName('');
    setPolicyYear('');
    setInceptionPremium('');
    setEndorsementPremium('');
    setEarnedPremium('');
    setInceptionLives('');
    setExpiringLives('');
    setInsightsFieldsError('');
    setError('');
    setProgress(0);
    setDownloadedOnce(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (insightsFileInputRef.current) insightsFileInputRef.current.value = '';
  };

  return (
    <div className="mis-tool-shell" style={styles.container}>
      <style>{styles.interactionStyles}</style>
      <header style={styles.topbar}>
        <div className="mis-shell-inner" style={styles.topbarInner}>
          <div style={styles.brandRow}>
          <img src="/logo.jpeg" alt="Healthysure" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Performace Analytics Tool</h1>
            <p style={styles.subtitle}>Insurer file standardization &amp; claims insights</p>
          </div>
        </div>
          <div style={styles.toolBadge}>Internal tool</div>
        </div>
      </header>

      <div style={styles.workflowBar}>
        <div className="mis-shell-inner" style={styles.workflowInner}>
          <Stepper step={step} />
        </div>
      </div>

      <main className="mis-shell-main" style={styles.mainContent}>

      {error && (
        <div style={styles.errorBox}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {step === 'select' && (
        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.sectionEyebrow}>Step 1 of 4</div>
            <h2 style={styles.sectionTitle}>Upload the insurer's MIS file</h2>
            <p style={styles.description}>Upload the raw Excel file exactly as received from the insurer. We'll try to detect which insurer it's from automatically from the column headers.</p>
            <div
              className="mis-upload"
              style={{
                ...styles.uploadArea,
                ...(uploadedFile ? styles.uploadAreaFilled : {})
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              {uploadedFile ? (
                <div style={styles.uploadedInfo}>
                  <div style={styles.uploadedIconWrap}><FileSpreadsheet size={22} color={COLORS.accent} /></div>
                  <div style={styles.uploadedText}>
                    <strong style={{ color: COLORS.textPrimary }}>{uploadedFile.name}</strong>
                    <div style={styles.uploadedSize}>{(uploadedFile.size / 1024).toFixed(2)} KB</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mis-btn mis-btn-outline"
                    style={styles.changeFileBtn}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <UploadCloud size={30} color={COLORS.textMuted} />
                  <div style={styles.uploadText}>Click to upload, or drag and drop</div>
                  <div style={styles.uploadHint}>Excel files · .xlsx or .xls</div>
                </div>
              )}
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.section}>
            <div style={styles.sectionEyebrow}>Step 2 of 4</div>
            <h2 style={styles.sectionTitle}>Confirm the insurer</h2>
            {detecting ? (
              <p style={styles.description}>Detecting insurer from file headers…</p>
            ) : autoDetected ? (
              <p style={styles.noteSuccess}>
                <Check size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  Auto-detected as <strong>{selectedInsurer}</strong> — change it below if that's wrong.
                  {detectedSheetName && <> This file has multiple sheets; the <strong>"{detectedSheetName}"</strong> sheet was used since its columns matched.</>}
                </span>
              </p>
            ) : (
              <p style={styles.description}>
                {uploadedFile ? "Couldn't auto-detect the insurer from this file — please select it manually." : "Choose which insurer's MIS format this file is in."}
              </p>
            )}
            <select value={selectedInsurer} onChange={handleInsurerSelect} className="mis-field" style={styles.select}>
              <option value="">— Choose insurer —</option>
              {insurersList.map(insurer => (
                <option key={insurer} value={insurer}>{insurer}</option>
              ))}
            </select>
            {selectedInsurer && (!columnMapping[selectedInsurer] || Object.keys(columnMapping[selectedInsurer]).length === 0) && (
              <p style={styles.noteWarning}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>No column mapping found yet for {selectedInsurer}. Conversion will run, but most columns will come out blank until this insurer's mapping is added.</span>
              </p>
            )}
          </div>

          <button
            onClick={() => setStep('convert')}
            disabled={!selectedInsurer || !uploadedFile}
            className="mis-btn mis-btn-primary"
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              opacity: (!selectedInsurer || !uploadedFile) ? 0.4 : 1,
              cursor: (!selectedInsurer || !uploadedFile) ? 'not-allowed' : 'pointer'
            }}
          >
            Continue <ArrowRight size={15} />
          </button>
        </div>
      )}

      {step === 'convert' && (
        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.sectionEyebrow}>Step 2 of 4</div>
            <h2 style={styles.sectionTitle}>Ready to convert</h2>
            <p style={styles.description}>Review the details below, then convert this file into Healthysure's standard format.</p>
            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Insurer</span>
                <span style={styles.summaryValue}>{selectedInsurer}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>File</span>
                <span style={styles.summaryValue}>{uploadedFile?.name}</span>
              </div>
              <div style={{ ...styles.summaryRow, borderBottom: 'none' }}>
                <span style={styles.summaryLabel}>Size</span>
                <span style={styles.summaryValue}>{uploadedFile ? (uploadedFile.size / 1024).toFixed(2) : 0} KB</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={loading}
            className="mis-btn mis-btn-primary"
            style={{ ...styles.button, ...styles.buttonPrimary, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Converting…' : <>Convert to Healthysure format</>}
          </button>

          {loading && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
              </div>
              <div style={styles.progressText}>{progress}% complete</div>
            </div>
          )}

          <button onClick={() => setStep('select')} className="mis-btn mis-btn-secondary" style={{ ...styles.button, ...styles.buttonSecondary }}>
            <ArrowLeft size={15} /> Back
          </button>
        </div>
      )}

      {step === 'preview' && convertedRows && (
        <div style={styles.card}>
          <div style={styles.successBox}>
            <div style={styles.successIconWrap}><Check size={22} color="#ffffff" strokeWidth={3} /></div>
            <div>
              <h2 style={styles.successTitle}>Conversion successful</h2>
              <p style={styles.successText}>
                Converted <strong style={{ color: COLORS.textPrimary }}>{convertedRows.length} rows</strong> from {selectedInsurer} into Healthysure format
                {matchStats && <> · {matchStats.filled} of {matchStats.total} columns matched</>}
              </p>
            </div>
          </div>

          {matchStats && matchStats.filled < matchStats.total * 0.3 && (
            <p style={styles.noteWarning}>
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                Only {matchStats.filled} of {matchStats.total} columns matched — this usually means the
                wrong insurer was selected for this file (each insurer has different column names in the
                mapping sheet). Double-check that <strong>{selectedInsurer}</strong> is really the insurer
                this file came from, then try again.
              </span>
            </p>
          )}

          <div style={styles.section}>
            <div style={styles.sectionEyebrow}>Preview</div>
            <h2 style={styles.sectionTitle}>First 15 rows</h2>
            <div style={styles.previewScroll}>
              <table style={styles.previewTable}>
                <thead>
                  <tr>
                    {outputColumns.map(col => (
                      <th key={col} style={styles.previewHeaderCell}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {convertedRows.slice(0, 15).map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.previewRowEven : styles.previewRowOdd}>
                      {outputColumns.map(col => (
                        <td key={col} style={styles.previewCell}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {convertedRows.length > 15 && (
              <p style={styles.previewNote}>+ {convertedRows.length - 15} more rows in the downloaded file</p>
            )}
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={() => setStep('convert')} className="mis-btn mis-btn-secondary" style={{ ...styles.button, ...styles.buttonSecondary }}>
              <ArrowLeft size={15} /> Previous
            </button>
            <button onClick={handleDownload} className="mis-btn mis-btn-primary" style={{ ...styles.button, ...styles.buttonPrimary }}>
              <Download size={15} /> Download Excel file
            </button>
          </div>
        </div>
      )}

      {step === 'upload-insights' && (
        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.sectionEyebrow}>Step 3 of 4</div>
            <h2 style={styles.sectionTitle}>Upload the final file for insights</h2>
            <p style={styles.noteSuccess}>
              <Check size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Your file has been downloaded.</span>
            </p>
            <p style={styles.description}>
              If your team made any edits to the downloaded file, make those changes and upload the
              final version here. The dashboard is built from whatever file you upload —
              not from the original conversion.
            </p>
            {insightsError && (
              <div style={styles.errorBox}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{insightsError}</span>
              </div>
            )}
            <div
              className="mis-upload"
              style={{
                ...styles.uploadArea,
                ...(insightsFile ? styles.uploadAreaFilled : {})
              }}
              onClick={() => insightsFileInputRef.current?.click()}
            >
              <input
                ref={insightsFileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleInsightsFileUpload}
                style={{ display: 'none' }}
              />
              {insightsFile ? (
                <div style={styles.uploadedInfo}>
                  <div style={styles.uploadedIconWrap}><FileSpreadsheet size={22} color={COLORS.accent} /></div>
                  <div style={styles.uploadedText}>
                    <strong style={{ color: COLORS.textPrimary }}>{insightsFile.name}</strong>
                    <div style={styles.uploadedSize}>{(insightsFile.size / 1024).toFixed(2)} KB</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      insightsFileInputRef.current?.click();
                    }}
                    className="mis-btn mis-btn-outline"
                    style={styles.changeFileBtn}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <UploadCloud size={30} color={COLORS.textMuted} />
                  <div style={styles.uploadText}>
                    {insightsLoading ? 'Reading file…' : 'Click to upload the final Excel file'}
                  </div>
                  <div style={styles.uploadHint}>Excel files · .xlsx or .xls</div>
                </div>
              )}
            </div>
          </div>

          {insightsRows && (
            <>
              <div style={styles.divider} />
              <div style={styles.section}>
                <div style={styles.sectionEyebrow}>Step 3 of 4</div>
                <h2 style={styles.sectionTitle}>Policy details</h2>
                <p style={styles.description}>
                  Enter the policy details below — these are shown as widgets at the top of the
                  insights dashboard, alongside the charts.
                </p>
                {insightsFieldsError && (
                  <div style={styles.errorBox}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span>{insightsFieldsError}</span>
                  </div>
                )}
                <div style={styles.fieldsRowWide}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Company name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Pvt Ltd"
                      className="mis-field"
                      style={styles.fieldInput}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Policy year</label>
                    <input
                      type="text"
                      value={policyYear}
                      onChange={(e) => setPolicyYear(e.target.value)}
                      placeholder="e.g. 2025-26"
                      className="mis-field"
                      style={styles.fieldInput}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Inception premium (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={inceptionPremium}
                      onChange={(e) => setInceptionPremium(e.target.value)}
                      placeholder="e.g. 2000000"
                      className="mis-field"
                      style={styles.fieldInput}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Endorsement premium (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={endorsementPremium}
                      onChange={(e) => setEndorsementPremium(e.target.value)}
                      placeholder="e.g. 150000"
                      className="mis-field"
                      style={styles.fieldInput}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Earned premium (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={earnedPremium}
                      onChange={(e) => setEarnedPremium(e.target.value)}
                      placeholder="e.g. 2150000"
                      className="mis-field"
                      style={styles.fieldInput}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Inception lives</label>
                    <input
                      type="number"
                      min="0"
                      value={inceptionLives}
                      onChange={(e) => setInceptionLives(e.target.value)}
                      placeholder="e.g. 850"
                      className="mis-field"
                      style={styles.fieldInput}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>Expiring lives</label>
                    <input
                      type="number"
                      min="0"
                      value={expiringLives}
                      onChange={(e) => setExpiringLives(e.target.value)}
                      placeholder="e.g. 900"
                      className="mis-field"
                      style={styles.fieldInput}
                    />
                  </div>
                </div>
                <button
                  onClick={handleViewInsights}
                  className="mis-btn mis-btn-primary"
                  style={{ ...styles.button, ...styles.buttonPrimary, marginTop: '20px' }}
                >
                  <BarChart3 size={15} /> View insights
                </button>
              </div>
            </>
          )}

          <button onClick={() => setStep('preview')} className="mis-btn mis-btn-secondary" style={{ ...styles.button, ...styles.buttonSecondary, marginTop: insightsRows ? '12px' : '20px' }}>
            <ArrowLeft size={15} /> Back to preview
          </button>
        </div>
      )}

      {step === 'dashboard' && insightsRows && (() => {
        const a = getDashboardAnalytics(insightsRows);
        const fmtCurrency = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;
        return (
          <div style={styles.card}>
            <div style={styles.section}>
              <div style={styles.sectionEyebrow}>Step 4 of 4</div>
              <h2 style={styles.sectionTitle}>Data insights dashboard</h2>
              <p style={styles.description}>Visual breakdown of the {insightsRows.length} rows from the uploaded file.</p>
              {downloadedOnce && (
                <p style={styles.noteSuccess}>
                  <Check size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>Built from {insightsFile ? insightsFile.name : 'your uploaded file'}.</span>
                </p>
              )}
            </div>

            {/* Company / policy year header strip */}
            <div style={styles.policyMetaStrip}>
              <div>
                <div style={styles.policyMetaLabel}>Company name</div>
                <div style={styles.policyMetaValue}>{companyName || '—'}</div>
              </div>
              <div>
                <div style={styles.policyMetaLabel}>Policy year</div>
                <div style={styles.policyMetaValue}>{policyYear || '—'}</div>
              </div>
            </div>

            {/* Policy-level totals entered on Step 3 - shown as widgets, not derived from the file */}
            <div style={styles.policyTotalsStrip}>
              <div style={styles.policyTotalBox}>
                <div style={styles.policyTotalLabel}>Inception premium</div>
                <div style={styles.policyTotalValue}>{inceptionPremium !== '' ? fmtCurrency(inceptionPremium) : '—'}</div>
              </div>
              <div style={styles.policyTotalBox}>
                <div style={styles.policyTotalLabel}>Endorsement premium</div>
                <div style={styles.policyTotalValue}>{endorsementPremium !== '' ? fmtCurrency(endorsementPremium) : '—'}</div>
              </div>
              <div style={styles.policyTotalBox}>
                <div style={styles.policyTotalLabel}>Earned premium</div>
                <div style={styles.policyTotalValue}>{earnedPremium !== '' ? fmtCurrency(earnedPremium) : '—'}</div>
              </div>
              <div style={styles.policyTotalBox}>
                <div style={styles.policyTotalLabel}>Inception lives</div>
                <div style={styles.policyTotalValue}>{inceptionLives !== '' ? Number(inceptionLives).toLocaleString('en-IN') : '—'}</div>
              </div>
              <div style={styles.policyTotalBox}>
                <div style={styles.policyTotalLabel}>Expiring lives</div>
                <div style={styles.policyTotalValue}>{expiringLives !== '' ? Number(expiringLives).toLocaleString('en-IN') : '—'}</div>
              </div>
            </div>

            {/* Status by count */}
            <div style={styles.statGroupBox}>
              <div style={styles.statGroupTitle}>Status by count</div>
              <div style={styles.statsStrip}>
                {ALL_STATUSES.map(s => (
                  <div key={s} style={styles.statBox}>
                    <div style={{ ...styles.statValue, ...(s === 'Rejected' ? { color: COLORS.danger } : {}) }}>{a.statusCounts[s]}</div>
                    <div style={{ ...styles.statLabel, ...(s === 'Rejected' ? { color: COLORS.danger } : {}) }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status by value */}
            <div style={styles.statGroupBox}>
              <div style={styles.statGroupTitle}>Status by value</div>
              <div style={styles.statsStrip}>
                {ALL_STATUSES.map(s => (
                  <div key={s} style={styles.statBox}>
                    <div style={{ ...styles.statValue, fontSize: '15px', ...(s === 'Rejected' ? { color: COLORS.danger } : {}) }}>{fmtCurrency(a.statusValueSums[s])}</div>
                    <div style={{ ...styles.statLabel, ...(s === 'Rejected' ? { color: COLORS.danger } : {}) }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.dashboardGrid}>

              {/* 1. Cashless vs Reimbursement */}
              <ChartCard
                title="Cashless vs reimbursement"
                renderChart={(h) => (
                  <PopOutPieChart data={a.claimTypeData} height={h} />
                )}
              />

              {/* 1b. Cashless vs Reimbursement — ratio, as a pie chart */}
              <ChartCard
                title="Cashless vs reimbursement ratio"
                renderChart={(h) => (
                  <PopOutPieChart data={a.cashlessReimbRatioPie} height={h} />
                )}
              />

              {/* 2. Document Receipt (FDR vs LDR) — now a pie chart */}
              <ChartCard
                title="Document receipt (FDR vs LDR)"
                renderChart={(h) => (
                  <PopOutPieChart data={a.documentReceiptData} height={h} />
                )}
              />

              {/* 3. Age-wise split */}
              <ChartCard
                title="Age-wise split"
                renderChart={(h) => (
                  a.ageData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={h}>
                      <BarChart data={a.ageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.textSecondary }} />
                        <YAxis allowDecimals={false} tick={{ fill: COLORS.textSecondary }} />
                        <Tooltip content={<WrappedBarTooltip />} cursor={{ fill: 'rgba(17,163,135,0.08)' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="value" position="top" style={{ fontSize: 12, fontWeight: 700, fill: COLORS.textPrimary }} />
                          {a.ageData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={styles.noDataBox}><p style={{ margin: 0 }}>No age data found in this file.</p></div>
                  )
                )}
              />

              {/* 4. Relationship-wise split */}
              <ChartCard
                title="Relationship-wise split"
                renderChart={(h) => (
                  <PopOutPieChart data={a.relationData} height={h} />
                )}
              />

              {/* 5. Claims by city — no India city-level map is available, so
                  this is a horizontal bar chart of the top cities instead of
                  a choropleth. */}
              <ChartCard
                title="Claims by city"
                wide
                height={Math.max(260, a.cityData.length * 38)}
                renderChart={(h) => (
                  a.cityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={h}>
                      <BarChart
                        data={a.cityData}
                        layout="vertical"
                        margin={{ top: 5, right: 28, bottom: 5, left: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis type="number" allowDecimals={false} tick={{ fill: COLORS.textSecondary }} />
                        <YAxis type="category" dataKey="name" width={140} tick={<TruncatedYAxisTick />} interval={0} />
                        <Tooltip content={<WrappedBarTooltip color={COLORS.accent} />} cursor={{ fill: 'rgba(17,163,135,0.08)' }} />
                        <Bar dataKey="value" fill={COLORS.accent} radius={[0, 4, 4, 0]} maxBarSize={26}>
                          <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 700, fill: COLORS.textPrimary }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={styles.noDataBox}><p style={{ margin: 0 }}>No city data found in this file.</p></div>
                  )
                )}
              />

              {/* 6. Rejected claims reasons */}
              <ChartCard
                title="Rejected claims — reasons"
                height={Math.max(260, a.rejectionReasonData.length * 42)}
                renderChart={(h) => (
                  a.rejectionReasonData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={h}>
                      <BarChart
                        data={a.rejectionReasonData}
                        layout="vertical"
                        margin={{ top: 5, right: 28, bottom: 5, left: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                        <XAxis type="number" allowDecimals={false} tick={{ fill: COLORS.textSecondary }} />
                        <YAxis type="category" dataKey="name" width={140} tick={<TruncatedYAxisTick />} interval={0} />
                        <Tooltip content={<WrappedBarTooltip color={COLORS.danger} />} cursor={{ fill: 'rgba(224,102,92,0.08)' }} />
                        <Bar dataKey="value" fill={COLORS.danger} radius={[0, 4, 4, 0]} maxBarSize={26}>
                          <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 700, fill: COLORS.textPrimary }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={styles.noDataBox}><p style={{ margin: 0 }}>No rejected claims in this file.</p></div>
                  )
                )}
              />

              {/* 7. Disease-wise split */}
              <ChartCard
                title="Disease-wise split"
                height={Math.max(260, a.diseaseData.length * 42)}
                renderChart={(h) => (
                  <ResponsiveContainer width="100%" height={h}>
                    <BarChart
                      data={a.diseaseData}
                      layout="vertical"
                      margin={{ top: 5, right: 28, bottom: 5, left: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                      <XAxis type="number" allowDecimals={false} tick={{ fill: COLORS.textSecondary }} />
                      <YAxis type="category" dataKey="name" width={140} tick={<TruncatedYAxisTick />} interval={0} />
                      <Tooltip content={<WrappedBarTooltip color={COLORS.accent} />} cursor={{ fill: 'rgba(17,163,135,0.08)' }} />
                      <Bar dataKey="value" fill={COLORS.accent} radius={[0, 4, 4, 0]} maxBarSize={26}>
                        <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 700, fill: COLORS.textPrimary }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              />

              {/* 7b. Claim nature — Maternity / Injury / Illness (below Disease-wise split) */}
              <ChartCard
                title="Claim nature: Maternity / Injury / Illness"
                renderChart={(h) => (
                  <ResponsiveContainer width="100%" height={h}>
                    <BarChart data={a.claimNatureData} margin={{ top: 24, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.textSecondary }} />
                      <YAxis allowDecimals={false} tick={{ fill: COLORS.textSecondary }} />
                      <Tooltip content={<WrappedBarTooltip />} cursor={{ fill: 'rgba(17,163,135,0.08)' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="value" position="top" style={{ fontSize: 12, fontWeight: 700, fill: COLORS.textPrimary }} />
                        {a.claimNatureData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              />

            </div>

            <div style={styles.buttonGroup}>
              <button onClick={() => setStep('upload-insights')} className="mis-btn mis-btn-secondary" style={{ ...styles.button, ...styles.buttonSecondary }}>
                <ArrowLeft size={15} /> Back
              </button>
              <button onClick={handleReset} className="mis-btn mis-btn-primary" style={{ ...styles.button, ...styles.buttonPrimary }}>
                <RotateCcw size={15} /> Convert another file
              </button>
            </div>
          </div>
        );
      })()}

      <div style={styles.infoBox}>
        <div style={styles.infoTitleRow}>
          <Info size={15} color={COLORS.accent} />
          <h3 style={styles.infoTitle}>How it works</h3>
        </div>
        <ul style={styles.infoList}>
          <li>Step 1 — select the insurer and upload their raw MIS Excel file.</li>
          <li>Step 2 — review the file details and convert to Healthysure format.</li>
          <li>Columns, status, and gender terms are mapped automatically from Healthysure's mapping sheet.</li>
          <li>Preview the converted rows, then download — fully colored, filtered, and frozen-header formatted.</li>
          <li>Step 3 — upload the final file (with any team edits) and enter policy details (company, policy year, premiums, lives) to generate the insights dashboard.</li>
          <li>Dashboard covers: status by count/value, claim type, document receipt (FDR/LDR), age, relationship, disease, claim nature (Maternity/Injury/Illness), rejections, and a city-wise claims chart.</li>
          <li>Every chart card has a copy icon — click it to copy that chart as a PNG straight to your clipboard, ready to paste into WhatsApp, Slack, or Word.</li>
        </ul>
      </div>
      </main>
    </div>
  );
};

const styles = {
  interactionStyles: `
    .mis-btn {
      transform: translateY(0);
      transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }

    .mis-btn:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 22px rgba(9,82,68,0.14);
    }

    .mis-btn-primary:not(:disabled):hover {
      background-color: #0c8f77 !important;
      color: #ffffff !important;
    }

    .mis-btn-secondary:not(:disabled):hover,
    .mis-btn-outline:not(:disabled):hover,
    .mis-icon-btn:not(:disabled):hover {
      background-color: #e7f6f3 !important;
      border-color: #11a387 !important;
      color: #095244 !important;
    }

    .mis-field:hover {
      border-color: #11a387 !important;
      background-color: #ffffff !important;
    }

    .mis-field:focus {
      outline: none;
      border-color: #11a387 !important;
      box-shadow: 0 0 0 3px rgba(17,163,135,0.14);
      background-color: #ffffff !important;
    }

    .mis-upload:hover {
      border-color: #11a387 !important;
      background-color: #ffffff !important;
      box-shadow: inset 0 0 0 1px rgba(17,163,135,0.16);
    }

    @media (max-width: 720px) {
      .mis-tool-shell .mis-shell-inner,
      .mis-tool-shell .mis-shell-main {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }

      .mis-tool-shell .mis-step-label {
        display: none;
      }
    }
  `,
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: COLORS.bg,
    color: COLORS.textPrimary,
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box'
  },
  topbar: {
    width: '100%',
    backgroundColor: COLORS.bgElevated,
    borderBottom: `1px solid ${COLORS.border}`,
    boxShadow: '0 8px 24px rgba(9,82,68,0.06)'
  },
  topbarInner: {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '18px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    boxSizing: 'border-box'
  },
  workflowBar: {
    width: '100%',
    backgroundColor: COLORS.bg,
    borderBottom: `1px solid ${COLORS.border}`
  },
  workflowInner: {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '18px 32px',
    boxSizing: 'border-box'
  },
  mainContent: {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '28px 32px 60px',
    boxSizing: 'border-box'
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  logo: { height: '42px', width: '42px', borderRadius: '10px', flexShrink: 0, objectFit: 'contain' },
  title: { fontSize: '22px', fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 2px 0' },
  subtitle: { fontSize: '13px', color: COLORS.textSecondary, margin: 0, fontWeight: 400 },
  toolBadge: {
    fontSize: '12px',
    fontWeight: 800,
    color: COLORS.accentDeep,
    backgroundColor: COLORS.mint,
    border: `1px solid ${COLORS.borderStrong}`,
    borderRadius: '999px',
    padding: '7px 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap'
  },

  stepper: { display: 'flex', alignItems: 'center', width: '100%' },
  stepNode: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  stepDot: {
    width: '34px', height: '34px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 800, flexShrink: 0, transition: 'all 0.2s'
  },
  stepDotDone: { backgroundColor: COLORS.accent, color: '#ffffff', boxShadow: '0 7px 18px rgba(17,163,135,0.22)' },
  stepDotActive: { backgroundColor: COLORS.bgElevated, color: COLORS.accentDeep, border: `3px solid ${COLORS.accent}`, boxShadow: '0 0 0 5px rgba(17,163,135,0.12)' },
  stepDotPending: { backgroundColor: COLORS.bgElevated, color: COLORS.textMuted, border: `2px solid ${COLORS.borderStrong}` },
  stepLabel: { fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap' },
  stepConnector: { flex: 1, height: '3px', margin: '0 16px', borderRadius: '999px' },

  card: {
    backgroundColor: COLORS.bgElevated,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '20px'
  },
  section: { marginBottom: '8px' },
  sectionEyebrow: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 900, color: COLORS.accentDeep,
    backgroundColor: COLORS.mint, border: `1px solid ${COLORS.borderStrong}`,
    borderRadius: '999px', padding: '8px 14px',
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
    boxShadow: '0 8px 18px rgba(17,163,135,0.10)'
  },
  sectionTitle: { fontSize: '18px', fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 10px 0', letterSpacing: '-0.2px' },
  description: { fontSize: '13.5px', color: COLORS.textSecondary, margin: '0 0 16px 0', lineHeight: 1.6 },
  divider: { height: '1px', backgroundColor: COLORS.border, margin: '28px 0' },

  noteWarning: {
    display: 'flex', gap: '8px', fontSize: '12.5px', lineHeight: 1.5, color: COLORS.warning,
    backgroundColor: 'rgba(154,107,0,0.08)', border: `1px solid rgba(154,107,0,0.3)`,
    borderRadius: '8px', padding: '11px 13px', marginTop: '12px'
  },
  noteSuccess: {
    display: 'flex', gap: '8px', fontSize: '12.5px', lineHeight: 1.5, color: COLORS.textPrimary,
    backgroundColor: 'rgba(17,163,135,0.1)', border: `1px solid rgba(17,163,135,0.35)`,
    borderRadius: '8px', padding: '11px 13px', margin: '0 0 14px 0'
  },

  select: {
    width: '100%', padding: '12px 14px', fontSize: '14px',
    border: `1px solid ${COLORS.borderStrong}`, borderRadius: '8px',
    backgroundColor: COLORS.surface, color: COLORS.textPrimary, cursor: 'pointer',
    fontFamily: 'inherit', boxSizing: 'border-box', appearance: 'none'
  },

  uploadArea: {
    border: `1.5px dashed ${COLORS.borderStrong}`, borderRadius: '10px',
    padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
    transition: 'all 0.2s', backgroundColor: COLORS.surface
  },
  uploadAreaFilled: { borderColor: COLORS.accent, borderStyle: 'solid', backgroundColor: 'rgba(17,163,135,0.08)' },
  uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  uploadText: { fontSize: '14.5px', fontWeight: 600, color: COLORS.textPrimary },
  uploadHint: { fontSize: '12px', color: COLORS.textMuted },
  uploadedInfo: { display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' },
  uploadedIconWrap: {
    width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(17,163,135,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  uploadedText: { textAlign: 'left' },
  uploadedSize: { fontSize: '12px', color: COLORS.textMuted, marginTop: '3px' },

  summaryBox: { backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '4px 18px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13.5px', borderBottom: `1px solid ${COLORS.border}` },
  summaryLabel: { color: COLORS.textSecondary, fontWeight: 600 },
  summaryValue: { color: COLORS.textPrimary, fontWeight: 600 },

  button: {
    padding: '13px 22px', fontSize: '14px', fontWeight: 700, border: 'none', borderRadius: '8px',
    cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', width: '100%', marginTop: '20px', fontFamily: 'inherit'
  },
  buttonPrimary: { backgroundColor: COLORS.accent, color: '#ffffff', boxShadow: '0 10px 22px rgba(17,163,135,0.16)' },
  buttonSecondary: { backgroundColor: 'transparent', color: COLORS.textSecondary, border: `1px solid ${COLORS.borderStrong}` },
  changeFileBtn: {
    marginLeft: '6px', padding: '9px 14px', fontSize: '12px', fontWeight: 700,
    color: COLORS.accent, backgroundColor: 'transparent', border: `1.5px solid ${COLORS.accent}`,
    borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit'
  },

  progressContainer: { marginTop: '18px' },
  progressBar: { width: '100%', height: '6px', backgroundColor: COLORS.surface, borderRadius: '4px', overflow: 'hidden', border: `1px solid ${COLORS.border}` },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, transition: 'width 0.3s' },
  progressText: { fontSize: '12px', color: COLORS.textMuted, marginTop: '8px', textAlign: 'center' },

  errorBox: {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    backgroundColor: 'rgba(198,40,40,0.07)', border: `1px solid rgba(198,40,40,0.3)`,
    borderRadius: '8px', padding: '13px 16px', marginBottom: '20px', fontSize: '13.5px', color: COLORS.danger, fontWeight: 600
  },

  successBox: {
    display: 'flex', alignItems: 'center', gap: '16px',
    backgroundColor: 'rgba(17,163,135,0.08)', border: `1px solid rgba(17,163,135,0.3)`,
    borderRadius: '10px', padding: '20px 22px', marginBottom: '20px'
  },
  successIconWrap: {
    width: '42px', height: '42px', borderRadius: '50%', backgroundColor: COLORS.accent,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  successTitle: { fontSize: '16px', fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 4px 0' },
  successText: { fontSize: '13px', color: COLORS.textSecondary, margin: 0 },

  previewScroll: { overflowX: 'auto', overflowY: 'auto', maxHeight: '420px', border: `1px solid ${COLORS.border}`, borderRadius: '8px' },
  previewTable: { borderCollapse: 'collapse', width: '100%', fontSize: '12px', whiteSpace: 'nowrap' },
  previewHeaderCell: {
    position: 'sticky', top: 0, backgroundColor: COLORS.accentDeep, color: '#ffffff',
    padding: '10px 12px', textAlign: 'left', fontWeight: 700, borderRight: `1px solid ${COLORS.accentMid}`,
    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px'
  },
  previewRowEven: { backgroundColor: '#ffffff' },
  previewRowOdd: { backgroundColor: COLORS.mint },
  previewCell: { padding: '8px 12px', borderBottom: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}`, color: COLORS.textSecondary },
  previewNote: { fontSize: '12px', color: COLORS.textMuted, marginTop: '10px' },

  buttonGroup: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },

  fieldsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldsRowWide: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  fieldLabel: { fontSize: '11.5px', fontWeight: 700, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.4px' },
  fieldInput: {
    padding: '12px 14px', fontSize: '14px', border: `1px solid ${COLORS.borderStrong}`,
    borderRadius: '8px', backgroundColor: COLORS.surface, color: COLORS.textPrimary,
    fontFamily: 'inherit', boxSizing: 'border-box'
  },

  policyMetaStrip: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' },
  policyMetaLabel: { fontSize: '11px', color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' },
  policyMetaValue: { fontSize: '16px', fontWeight: 700, color: COLORS.textPrimary },

  policyTotalsStrip: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '16px' },
  policyTotalBox: {
    backgroundColor: COLORS.mint,
    border: `1px solid ${COLORS.borderStrong}`, borderRadius: '10px',
    padding: '18px 20px', textAlign: 'left'
  },
  policyTotalLabel: { fontSize: '11px', color: COLORS.accentDeep, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' },
  policyTotalValue: { fontSize: '22px', fontWeight: 800, color: COLORS.accentDeep, fontVariantNumeric: 'tabular-nums' },

  // Wraps a whole stat row (heading + strip) in the same mint/dark theme as
  // the policy-totals boxes above, so "Status by count" / "Status by value"
  // visually match them, with the heading placed inside the box.
  statGroupBox: {
    backgroundColor: COLORS.mint,
    border: `1px solid ${COLORS.borderStrong}`,
    borderRadius: '10px',
    padding: '16px 18px 18px',
    marginBottom: '16px'
  },
  statGroupTitle: {
    fontSize: '11px',
    color: COLORS.accentDeep,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px'
  },

  statsStrip: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' },
  statBox: {
    backgroundColor: COLORS.mint,
    border: `1px solid ${COLORS.borderStrong}`,
    borderRadius: '8px',
    padding: '14px 10px',
    textAlign: 'center'
  },
  statValue: { fontSize: '21px', fontWeight: 800, color: COLORS.accentDeep, fontVariantNumeric: 'tabular-nums' },
  statLabel: { fontSize: '10px', color: COLORS.accentDeep, fontWeight: 700, textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.3px', opacity: 0.75 },

  chartCard: { backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '18px' },
  chartCardTitle: { fontSize: '12.5px', fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.4px' },
  chartCardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
  chartHeaderBtnGroup: { display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 },
  chartIconBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '28px', height: '28px', flexShrink: 0,
    background: COLORS.mint, border: `1px solid ${COLORS.borderStrong}`, borderRadius: '6px',
    color: COLORS.accentDeep, cursor: 'pointer'
  },
  chartModalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(3,10,8,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '24px'
  },
  chartModalBox: {
    background: COLORS.bgElevated, borderRadius: '12px', padding: '22px 24px',
    width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto',
    border: `1px solid ${COLORS.borderStrong}`,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
  },
  chartModalCaptureArea: { background: COLORS.bgElevated },
  chartModalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  chartModalCloseBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '30px', height: '30px', flexShrink: 0,
    background: COLORS.surface, border: `1px solid ${COLORS.borderStrong}`, borderRadius: '7px',
    color: COLORS.textSecondary, cursor: 'pointer'
  },
  noDataBox: {
    backgroundColor: 'rgba(154,107,0,0.06)', border: `1px solid rgba(154,107,0,0.25)`,
    borderRadius: '8px', padding: '16px 18px', fontSize: '12.5px', color: COLORS.warning,
    minHeight: '180px', display: 'flex', alignItems: 'center'
  },
  dashboardGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' },

  infoBox: { backgroundColor: COLORS.bgElevated, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '22px 24px', marginTop: '24px' },
  infoTitleRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  infoTitle: { fontSize: '13px', fontWeight: 700, margin: 0, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: '0.4px' },
  infoList: { fontSize: '13px', color: COLORS.textSecondary, margin: 0, paddingLeft: '20px', lineHeight: '1.9' }
};

export default MISConverterTool;