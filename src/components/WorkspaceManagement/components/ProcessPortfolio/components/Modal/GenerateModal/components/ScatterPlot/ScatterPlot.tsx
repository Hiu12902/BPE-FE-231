import { SCATTER_PLOT_POINT } from "@/constants/theme/themeConstants";
import { useProcessPortfolioQuery } from "@/hooks/useProcessPortfolio";
import { ProcessPortfolioPoint } from "@/interfaces/processportfolio";
import { Flex } from "@mantine/core";
import {
  Chart,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  Point,
  PointElement,
  Tooltip,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { useParams } from "react-router-dom";

Chart.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ExtendScatterPoint extends Point {
  z: number;
  name?: string;
}

export const options: ChartOptions<"scatter"> = {
  elements: {
    point: {
      // hoverRadius(ctx) {
      //   const dataset = ctx.dataset;
      //   const data = dataset.data[ctx.datasetIndex];
      //   const size = ctx.chart.width;
      //   const base = Math.abs((data as ExtendScatterPoint).z) / 100;
      //   return (size / 24) * base;
      // },
      // radius(ctx) {
      //   const dataset = ctx.dataset;
      //   const data = dataset.data[ctx.datasetIndex];
      //   const size = ctx.chart.width;
      //   const base = Math.abs((data as ExtendScatterPoint).z) / 100;
      //   return size * (1 / 30) * base;
      // },
      // hoverBorderWidth(ctx) {
      //   return Math.round(5 * (ctx.raw as ExtendScatterPoint).z) / 100;
      // },
      radius: 20,
      hoverRadius: 20,
      hoverBorderWidth: 3,
      hoverBorderColor(ctx) {
        const datasetColor = ctx.dataset.borderColor;
        return datasetColor as string;
      },
      hoverBackgroundColor: "transparent",
    },
  },
  plugins: {
    tooltip: {
      displayColors: false,
      titleFont: {
        family: "Trebuchet MS,sans-serif",
        size: 16,
      },
      bodyFont: {
        family: "Trebuchet MS,sans-serif",
        size: 14,
      },
      callbacks: {
        title(tooltipItems) {
          const name = (tooltipItems[0].raw as ExtendScatterPoint).name;
          return `Name: ${name}`;
        },
        beforeLabel(tooltipItem) {
          const health = (tooltipItem.raw as ExtendScatterPoint).x;
          return `Health: ${health}%`;
        },
        label(tooltipItem) {
          const strategicImportance = (tooltipItem.raw as ExtendScatterPoint).y;
          return `Strategic importance: ${strategicImportance}%`;
        },
        afterLabel(tooltipItem) {
          const feasibility = (tooltipItem.raw as ExtendScatterPoint).z;
          return `Feasibility: ${feasibility}%`;
        },
      },
      padding: 15,
    },
    legend: {
      display: true,
      title: {
        display: true,
        text: "Feasibility",
        position: "center",
        font: {
          size: 15,
          family: "Trebuchet MS, sans-serif",
        },
      },
      position: "right",
      labels: {
        font: {
          family: "Trebuchet MS,sans-serif",
          size: 15,
        },
      },
      onHover: (event, legendItem, legend) => {
        const datasets = legend.chart.data.datasets;
        datasets.forEach((item, index) => {
          item.backgroundColor =
            index !== legendItem.datasetIndex
              ? item.backgroundColor + "30"
              : item.backgroundColor;
          item.borderColor =
            index !== legendItem.datasetIndex
              ? item.borderColor + "30"
              : item.borderColor;
          legend.chart.update();
        });
      },
      onLeave: (event, legendItem, legend) => {
        const datasets = legend.chart.data.datasets;

        datasets.forEach((item, index) => {
          item.backgroundColor =
            index !== legendItem.datasetIndex
              ? (item.backgroundColor as string).slice(0, -2)
              : item.backgroundColor;
          item.borderColor =
            index !== legendItem.datasetIndex
              ? (item.borderColor as string).slice(0, -2)
              : item.borderColor;
          legend.chart.update();
        });
      },
    },
  },
  scales: {
    x: {
      // min: -100,
      // max: 100,
      beginAtZero: true,
      title: {
        display: true,
        text: "Health",
        font: {
          family: "Trebuchet MS,sans-serif",
          size: 20,
        },
      },
    },
    y: {
      min: 0,
      max: 100,
      beginAtZero: true,
      title: {
        display: true,
        text: "Strategic importance",
        font: {
          family: "Trebuchet MS,sans-serif",
          size: 20,
        },
      },
    },
  },
};

const ScatterPlot = () => {
  const { workspaceId } = useParams();
  const { data: rawData } = useProcessPortfolioQuery(Number(workspaceId));
  const tranformData = (data?: ProcessPortfolioPoint[]) => {
    return data?.map((dataPoint) => ({
      x: Number((dataPoint.health * 100).toFixed(2)),
      y: dataPoint.strategicImportance * 100,
      z: dataPoint.feasibility * 100,
      name: `${dataPoint.processName}_ver_${dataPoint.num}.bpmn`,
    }));
  };
  const seperateData = (data?: ProcessPortfolioPoint[]) => {
    const lowFeasibility = data?.filter(
      (dataPoint) => dataPoint.feasibility < 0.35
    );
    const mediumFeasibility = data?.filter(
      (dataPoint) =>
        dataPoint.feasibility >= 0.35 && dataPoint.feasibility < 0.65
    );
    const highFeasibility = data?.filter(
      (dataPoint) => dataPoint.feasibility >= 0.65
    );

    return {
      lowFeasibility,
      mediumFeasibility,
      highFeasibility,
    };
  };
  const seperatedData = seperateData(rawData?.processPortfolio);
  const data = {
    backgroundColor: "rgb(250, 150, 150)",
    datasets: [
      {
        label: "Low (0-35%)",
        data: tranformData(seperatedData.lowFeasibility),
        backgroundColor: SCATTER_PLOT_POINT.peach[0],
        borderColor: SCATTER_PLOT_POINT.peach[2],
      },
      {
        label: "Medium (35-65%)",
        data: tranformData(seperatedData.mediumFeasibility),
        backgroundColor: SCATTER_PLOT_POINT.yellow[0],
        borderColor: SCATTER_PLOT_POINT.yellow[2],
      },
      {
        label: "High (65-100%)",
        data: tranformData(seperatedData.highFeasibility),
        backgroundColor: SCATTER_PLOT_POINT.marine[0],
        borderColor: SCATTER_PLOT_POINT.marine[2],
      },
    ],
  };
  return (
    <Flex
      style={{
        width: "100%",
      }}
      justify="center"
    >
      <Scatter
        options={options}
        data={data}
        plugins={[
          {
            id: "custom_lines",
            beforeDraw: (chart) => {
              const ctx = chart.canvas.getContext("2d");
              const xAxis = chart.scales.x;
              const yAxis = chart.scales.y;

              if (ctx) {
                ctx.save();
                ctx.strokeStyle = "#268de6"; // Change this to the color you want
                ctx.lineWidth = 1;

                // Draw x-axis line
                ctx.beginPath();
                ctx.moveTo(xAxis.left, yAxis.getPixelForValue(50));
                ctx.lineTo(xAxis.right, yAxis.getPixelForValue(50));
                ctx.stroke();

                // Draw y-axis line
                ctx.beginPath();
                ctx.moveTo(xAxis.getPixelForValue(0), yAxis.top);
                ctx.lineTo(xAxis.getPixelForValue(0), yAxis.bottom);
                ctx.stroke();

                ctx.restore();
              }
            },
          },
        ]}
      />
    </Flex>
  );
};

export default ScatterPlot;
