import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Card sizing similar to screenshot
const CARD_MARGIN_H = 20;
const CARD_PADDING = 20;

const CHART_WIDTH = SCREEN_WIDTH - (CARD_MARGIN_H * 2) - (CARD_PADDING * 2);
const CHART_HEIGHT = 190;

// Screenshot-like green
const GREEN = "#22C55E";

type Props = {
  title?: string;
  data?: number[];
};

const PriceChart =({
  title = "Price History",
  data,
}: Props)=> {
  // Example data (replace with your real data)
  const chartData = useMemo(() => {
    const fallback = [
      52, 55, 54, 58, 61, 60, 63, 65, 64, 66,
      68, 70, 69, 67, 68, 71, 69, 72, 70, 73,
      75, 78, 76, 82, 85, 83, 88, 86, 90, 92,
    ];
    const raw = Array.isArray(data) && data.length > 1 ? data : fallback;

    // Safe numbers only
    return raw.map((v) => (typeof v === "number" && !isNaN(v) ? v : 0));
  }, [data]);

  const labels = useMemo(() => {
    // We will show only 4 labels like your screenshot.
    // Chart-kit needs a label per data point, so we keep blanks and put text at desired indices.
    const n = chartData.length;
    const idx0 = 0;
    const idx1 = Math.floor(n * 0.33);
    const idx2 = Math.floor(n * 0.66);
    const idx3 = n - 1;

    return chartData.map((_, i) => {
      if (i === idx0) return "Oct 1";
      if (i === idx1) return "Oct 10";
      if (i === idx2) return "Oct 20";
      if (i === idx3) return "Today";
      return "";
    });
  }, [chartData]);

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientTo: "#FFFFFF",
      backgroundGradientFromOpacity: 1,
      backgroundGradientToOpacity: 1,

      // Line color (chart-kit expects rgba string)
      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,

      // Hide internal label color (we still use bottom labels only)
      labelColor: () => "rgba(107, 114, 128, 1)",

      strokeWidth: 3,

      // dashed horizontal lines like screenshot
      propsForBackgroundLines: {
        strokeDasharray: "6 6",
        stroke: "#D1D5DB", // light gray
        strokeWidth: 1,
      },

      // Area fill (shadow) like screenshot
      fillShadowGradientFrom: GREEN,
      fillShadowGradientTo: GREEN,
      fillShadowGradientFromOpacity: 0.20,
      fillShadowGradientToOpacity: 0.0,

      // Remove any dot style if it tries to render
      propsForDots: { r: "0" },

      // Reduce decimals in case
      decimalPlaces: 0,
    }),
    []
  );

  return (
    <View style={styles.card}>

      <View style={styles.chartWrap}>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: chartData,
                color: () => GREEN, // force green line
                strokeWidth: 3,
              },
            ],
            legend: [],
          }}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          chartConfig={chartConfig}
          bezier={false}          // screenshot line is jagged, not smooth
          withDots={false}
          withShadow={true}       // ✅ area fill
          withInnerLines={true}   // ✅ grid lines
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          segments={2}            // 3 horizontal dashed lines total (top/middle/bottom feel)
          transparent={true}
          style={styles.chart}
        />
      </View>

      {/* Bottom labels exactly like screenshot */}
      <View style={styles.xLabels}>
        <Text style={styles.label}>Oct 1</Text>
        <Text style={styles.label}>Oct 10</Text>
        <Text style={styles.label}>Oct 20</Text>
        <Text style={styles.label}>Today</Text>
      </View>
    </View>
  );
}

export default PriceChart;

const styles = StyleSheet.create({
  card: {

  
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  chartWrap: {
    // keeps chart nicely aligned like screenshot
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});
