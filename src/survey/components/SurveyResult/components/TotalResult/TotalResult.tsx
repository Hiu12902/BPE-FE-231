import { SurveyTotalResult } from "@/interfaces/index";
import { Flex, Title as MantineTitle, Text } from "@mantine/core";
import {
    BarElement,
    CategoryScale,
    Chart,
    ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTotalResultStyle } from "./TotalResult.style";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TotalResult = (props: SurveyTotalResult) => {
  const { numberOfResponses, ces, csat, nps, totalScore } = props;
  const totalResultDataset = [
    {
      data: [ces?.score, csat?.score, nps?.score, totalScore],
      backgroundColor: "rgba(25, 118, 210, 0.3)",
      borderColor: "#1976d2",
      borderWidth: 1,
      barThickness: 30,
    },
  ];

  const totalWeight = ces?.weight + csat?.weight + nps?.weight;

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "center",
        align: "center",
        color: "#1976d2",
        display: (context) => {
          if (context.dataset.data[context.dataIndex] === 0) {
            return false;
          }
          return true;
        },
        formatter: (value) => {
          return value?.toFixed(2);
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        padding: 10,
        position: "nearest",
        xAlign: "center",
        yAlign: "bottom",
        callbacks: {
          label: (context) => {
            const label = context.dataset.data[context.dataIndex];
            if (context.dataIndex === 0)
              return ` ${Number(label).toFixed(2)} of ${(
                (ces?.weight * 100) /
                totalWeight
              ).toFixed(0)}% total score`;
            if (context.dataIndex === 1)
              return ` ${Number(label).toFixed(2)} of ${(
                (csat?.weight * 100) /
                totalWeight
              ).toFixed(0)}% total score`;
            if (context.dataIndex === 2)
              return ` ${Number(label).toFixed(2)} of ${(
                (nps?.weight * 100) /
                totalWeight
              ).toFixed(0)}% total score`;
            return ` ${Number(label).toFixed(2)} / 1.0`;
          },
        },
        filter: (context) => {
          if (context.label) {
            return true;
          }
          return false;
        },
      },
    },
    scales: {
      x: {
        max: 1,
        min: -1,
        stacked: true,
        ticks: {
          color: "#1976d2",
          callback(tickValue) {
            return `${Number(tickValue)}`;
          },
        },
        title: {
          display: true,
          text: "Score",
          color: "#1976d2",
        },
      },
      y: {
        title: {
          display: true,
          text: `Category`,
          color: "#1976d2",
        },
      },
    },
  };

  const data = {
    labels: ["CES", "CSAT", "NPS", "Total score"],
    datasets: totalResultDataset,
  };

  const { classes } = useTotalResultStyle();

  return (
    <Flex className={classes.wrapper}>
      <Flex w="100%" justify="space-between">
        <MantineTitle order={5}>Total result of survey</MantineTitle>
        <Flex w="40%" direction="column" align="flex-end">
          <Text c="dimmed">
            Total{" "}
            <strong style={{ color: "#3084d7" }}>
              {numberOfResponses}{" "}
              {`response${numberOfResponses > 0 ? "s" : ""}`}
            </strong>{" "}
            for whole survey
          </Text>
        </Flex>
      </Flex>
      <Bar
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

export default TotalResult;
