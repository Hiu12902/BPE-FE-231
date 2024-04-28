import { PIE_PLOT_COLOR } from "@/constants/theme/themeConstants";
import { AnswerDetailResult } from "@/interfaces/index";
import { Flex } from "@mantine/core";
import {
    ArcElement,
    CategoryScale,
    Chart,
    ChartOptions,
    Legend,
    Title,
    Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

Chart.register(
  ArcElement,
  CategoryScale,
  Legend,
  Tooltip,
  Title,
  ChartDataLabels
);

interface DoughnutChartProps {
  answers: AnswerDetailResult[];
  totalResponses: number;
}

const DoughnutChart = (props: DoughnutChartProps) => {
  const { answers, totalResponses } = props;
  const sortedAnswers = answers.sort(
    (a, b) => a.numberOfAnswers - b.numberOfAnswers
  );

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.data[context.dataIndex];
            return ` ${label} of ${totalResponses} responses`;
          },
          title: (context) => {
            if (context[0].label.length > 30) {
              return context[0].label.slice(0, 30).concat("...");
            }
            return context[0].label;
          },
        },
        filter: (context) => {
          if (context.label) {
            return true;
          }
          return false;
        },
      },
      datalabels: {
        color: "#000",
        display: (context) => {
          if (
            Number(context.dataset.data[context.dataIndex]) / totalResponses <
            0.1
          ) {
            return false;
          }
          return true;
        },
        labels: {
          title: {
            align: "center",
            anchor: "center",
            font: {
              weight: "bold",
              size: 15,
            },
            formatter: (value, context) => {
              if (
                context.dataset.data.length === 1 &&
                context.dataset.data[0] === 1
              ) {
                return "";
              } else if (totalResponses !== 0) {
                return `${((value * 100) / totalResponses).toFixed(2)}%`;
              }
              return value;
            },
          },
        },
      },
      legend: {
        position: "top",
        align: "start",
        maxWidth: 100,
        fullSize: true,
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
  };

  const data = {
    labels: sortedAnswers.every((answer) => answer.numberOfAnswers === 0)
      ? []
      : sortedAnswers.map((answer) => answer.value),
    datasets: sortedAnswers.every((answer) => answer.numberOfAnswers === 0)
      ? [
          {
            data: [1],
            backgroundColor: "rgba(255,255,255,0)",
            borderColor: "rgb(48, 132, 215)",
            borderWidth: 1,
            barThickness: 20,
          },
        ]
      : [
          {
            data: sortedAnswers.map((answer) => {
              return answer.numberOfAnswers;
            }),
            backgroundColor: sortedAnswers.map((answer, index) => {
              const normalizeIndex =
                9 - Math.round((index * 10) / answers.length);
              return PIE_PLOT_COLOR[
                normalizeIndex as keyof typeof PIE_PLOT_COLOR
              ];
            }),
            borderWidth: 5,
            // borderColor: "#eff5fc",
            borderColor: "#ffffff",
            hoverBorderWidth: 0,
            // hoverBorderColor: "#eff5fc",
          },
        ],
  };
  80;
  return (
    <Flex justify="center" w="50%">
      <Doughnut options={options} data={data} />
    </Flex>
  );
};

export default DoughnutChart;
