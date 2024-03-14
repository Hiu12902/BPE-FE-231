import { Flex } from "@mantine/core";
import Chart, { ChartItem } from "chart.js/auto";
import { useEffect } from "react";

const SurveyResult = () => {
  const resultGenerator = async () => {
    const chart = new Chart(
      document.getElementById("accquisitions") as ChartItem,
      {
        type: "doughnut",
        data: {
          labels: ["CSAT", "CES", "NPS"],
          datasets: [
            {
              label: "Score",
              data: [11, 16, 150],
              backgroundColor: ["#a5e0e0", "#ffe6ab", "#9bd1f5"],
              hoverBackgroundColor: ["#4bc0c0", "#FFCE56", "#36A2EB"],
            },
          ],
        },
        options: {
          elements: {
            arc: {
              borderWidth: 2,
              borderAlign: "center",
              borderColor: "#fff",
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 16,
                },
              },
              display: true,
              onHover: (evt, item, legend) => {
                (
                  legend.chart.data.datasets[0].backgroundColor as string[]
                ).forEach((color, index, colors) => {
                  colors[index] =
                    index === item.index || color.length === 9
                      ? color
                      : color + "3D";
                });
                legend.chart.update();
              },
              onLeave: function handleLeave(evt, item, legend) {
                (
                  legend.chart.data.datasets[0].backgroundColor as string[]
                ).forEach((color, index, colors) => {
                  colors[index] =
                    color.length === 9 ? color.slice(0, -2) : color;
                });
                legend.chart.update();
              },
            },
            title: {
              display: true,
              text: "Survey result",
              font: {
                size: 20,
              },
            },
          },
        },
      }
    );
    return chart;
  };

  useEffect(() => {
    resultGenerator();
  }, []);

  return (
    <Flex
      style={{ width: "100%", height: "90vh", padding: "30px" }}
      justify="center"
      align="center"
    >
      <Flex
        style={{ width: "100%", height: "90%" }}
        justify="center"
        align="center"
      >
        <canvas id="accquisitions"></canvas>
      </Flex>
    </Flex>
  );
};

export default SurveyResult;
