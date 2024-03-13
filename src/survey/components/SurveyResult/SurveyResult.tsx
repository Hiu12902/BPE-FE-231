import { Flex } from "@mantine/core";
import Chart, { ChartItem } from "chart.js/auto";
import { useEffect } from "react";

const SurveyResult = () => {
  const data = {
    labels: ["CSAT", "CES", "NPS"],
    datasets: [
      {
        label: "Total scores from survey",
        data: [11, 16, 15],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 205, 86, 0.5)",
          "rgba(54, 162, 235, 0.5)",
        ],
      },
    ],
  };

  const chartGenerator = async () => {
    const chart = new Chart(
      document.getElementById("acquisitions") as ChartItem,
      {
        type: "polarArea",
        options: {
          responsive: true,
          scales: {
            r: {
              pointLabels: {
                display: true,
                centerPointLabels: true,
                font: {
                  size: 18,
                },
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
              labels: {
                borderRadius: 20,
                boxPadding: 10,
                boxHeight: 20,
                boxWidth: 20,
                color: "#ccc",
              },
            },
            title: {
              display: true,
              text: "Survey result",
              font: {
                size: 25,
              },
            },
          },
        },
        data: {
          datasets:
            data.datasets &&
            data.datasets.map((dataset) => {
              return {
                ...dataset,
                data: dataset.data,
                backgroundColor: dataset.backgroundColor,
              };
            }),
        },
      }
    );
    return chart;
  };

  useEffect(() => {
    console.log("chartGenerator");
    chartGenerator();
  }, []);

  return (
    <Flex
      style={{ width: "100%", height: "90vh" }}
      justify="center"
      align="center"
    >
      <Flex
        style={{ width: "100%", height: "90%" }}
        justify="center"
        align="center"
      >
        <canvas id="acquisitions"></canvas>
      </Flex>
    </Flex>
  );
};

export default SurveyResult;
