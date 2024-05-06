import { QuestionNameConversion } from "@/constants/survey";
import { AnswerDetailResult } from "@/interfaces/index";
import { Flex } from "@mantine/core";
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

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  answers: AnswerDetailResult[];
  totalResponses: number;
  questionType: string;
}

const BarChart = (props: BarChartProps) => {
  const { answers, totalResponses, questionType } = props;
  const maxNumResponses = Math.max(...answers.map(answer => answer.numberOfAnswers));

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
            return ` ${label} of ${totalResponses} responses`;
          },
          title: (context) => {
            if (context[0].label.length > 80) {
              return context[0].label.slice(0, 80).concat("...");
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
    },
    scales: {
      x: {
        max: maxNumResponses + 1,
        ticks: {
          color: "#1976d2",
          callback(tickValue) {
            if (Number(tickValue) % 1 === 0) {
              return tickValue;
            }
          },
        },
        title: {
          display: true,
          text: "Number of responses",
          color: "#1976d2",
        },
      },
      y: {
        title: {
          display: true,
          text: `${QuestionNameConversion[questionType]}`,
          color: "#1976d2",
        },
      },
    },
  };

  const data = {
    labels: answers.map((answer) => {
      if (answer.value.toString().length > 80) {
        return answer.value.toString().slice(0, 80).concat("...");
      }
      return answer.value.toString();
    }),
    datasets: answers.every((answer) => answer.numberOfAnswers === 0)
      ? [
          {
            data: [],
            backgroundColor: "rgba(25, 118, 210, 0.3)",
            borderColor: "rgb(48, 132, 215)",
            borderWidth: 1,
            barThickness: 30,
          },
        ]
      : [
          {
            data: answers.map((answer) => {
              return answer.numberOfAnswers;
            }),
            backgroundColor: "rgba(25, 118, 210, 0.3)",
            borderColor: "#3084d7",
            borderWidth: 1,
            barThickness: 30,
          },
        ],
  };

  return (
    <Flex justify="center" w="100%">
      <Bar options={options} data={data} />
    </Flex>
  );
};

export default BarChart;
