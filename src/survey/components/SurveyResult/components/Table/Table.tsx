import { SurveyTotalResult } from "@/interfaces/index";
import { Table } from "@mantine/core";
interface CustomTableProps {
  result: SurveyTotalResult;
}

const CustomTable = (props: CustomTableProps) => {
  const { result } = props;
  return (
    <Table
      withBorder
      highlightOnHover
      withColumnBorders
      style={{
        textAlign: "center",
        border: "1px solid #bad6f2",
      }}
    >
      <thead>
        <tr>
          <th></th>
          <th
            style={{
              textAlign: "center",
              width: "25%",
            }}
          >
            CES
          </th>
          <th
            style={{
              textAlign: "center",
              width: "25%",
            }}
          >
            CSAT
          </th>
          <th
            style={{
              textAlign: "center",
              width: "25%",
            }}
          >
            NPS
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            style={{
              fontWeight: "bold",
            }}
          >
            Score
          </td>
          <td>{result?.ces?.score}/1.0</td>
          <td>{result?.csat?.score}/1.0</td>
          <td>{result?.nps?.score}/1.0</td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "bold",
            }}
          >
            Weight
          </td>
          <td>{result?.ces?.weight}%</td>
          <td>{result?.csat?.weight}%</td>
          <td>{result?.nps?.weight}%</td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "bold",
            }}
          >
            Total score
          </td>
          <td colSpan={3}>{result?.totalScore}/1.0</td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "bold",
            }}
          >
            Total response
          </td>
          <td colSpan={3}>{result?.numberOfResponses}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default CustomTable;
