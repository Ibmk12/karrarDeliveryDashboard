/**
 * Makes a Chartist bar chart easier to read:
 *  - bars are sized to the space available (wide but never touching)
 *  - the exact number is printed above every bar
 *  - hovering a bar shows a tooltip like "Oct 2026: 290"
 * Call once after `new Chartist.Bar(...)`; it keeps working after chart.update().
 */
export function enhanceBarChart(chart, { minWidth = 14, maxWidth = 46, tooltip } = {}) {
  chart.on("draw", (data) => {
    if (data.type !== "bar") return;

    const labels = (chart.data && chart.data.labels) || [];
    const count = Math.max(labels.length, 1);
    const slot = data.chartRect.width() / count;
    const width = Math.max(minWidth, Math.min(maxWidth, Math.round(slot * 0.5)));
    data.element.attr({ style: `stroke-width: ${width}px` });

    const value = data.value && data.value.y !== undefined ? data.value.y : data.value;
    const label = labels[data.index];

    // number above the bar
    data.group
      .elem(
        "text",
        {
          x: data.x2,
          y: data.y2 - 10,
          "text-anchor": "middle",
          style: `animation-delay: ${0.35 + data.index * 0.05}s`,
        },
        "k-bar-value"
      )
      .text(value);

    // native tooltip
    const text = tooltip ? tooltip(label, value) : `${label}: ${value}`;
    data.element.elem("title").text(text);
  });
}
