import DataGrid from "@/components/DataGrid";
import { IPagination } from "@/interfaces/common";
import { IMembers } from "@/interfaces/workspaces";
import { Box, Text } from "@mantine/core";
import {
  DataTableColumn,
  DataTableColumnTextAlignment,
} from "mantine-datatable";

interface ITableProps {
  rows?: IMembers[];
  isLoading?: boolean;
  pagination?: IPagination;
  onPageChange?: (page: number) => void;
  selectedRecords?: IMembers[];
  setSelectedRecords?: (selectedRecords: IMembers[]) => void;
}

const Table = ({
  rows,
  isLoading,
  pagination,
  onPageChange,
  selectedRecords,
  setSelectedRecords,
}: ITableProps) => {
  const formatTimestamp = (date: Date | string) => {
    function convertUTCDateToLocalDate(date: Date) {
      var newDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000
      );
      var offset = date.getTimezoneOffset() / 60;
      var hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;
    }
    return convertUTCDateToLocalDate(new Date(date)).toLocaleString("en-GB");
  };

  const columns: DataTableColumn<IMembers>[] = [
    {
      accessor: "name",
      title: "Name",
      width: 250,
      render: (record: IMembers) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "100%",
                border: "0.5px solid #ccc",
                backgroundImage: record.avatar
                  ? `url(${record.avatar})`
                  : `url(https://ui-avatars.com/api/?name=${record.name?.replace(
                      " ",
                      "_"
                    )}&background=random&color=fff)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "70%",
                paddingLeft: "10px",
              }}
            >
              {record.name}
            </Text>
          </Box>
        );
      },
    },
    {
      accessor: "email",
      title: "Email",
      width: 250,
      render: (record: IMembers) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {record.email}
          </Box>
        );
      },
    },
    {
      accessor: "permission",
      title: "Permission",
      width: 250,
      textAlignment: "center" as DataTableColumnTextAlignment,
      render: (record: IMembers) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "45%",
              margin: "0 auto",
            }}
          >
            {
              <Text>
                {record.permission === "owner"
                  ? "Owner"
                  : record.permission === "editor"
                  ? "Can edit"
                  : record.permission === "sharer"
                  ? "Can share"
                  : "Can view"}
              </Text>
            }
          </Box>
        );
      },
    },
    {
      accessor: "joinedAt",
      title: "Joined at",
      width: 300,
      textAlignment: "center" as DataTableColumnTextAlignment,
      render: (record: IMembers) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {record.joinedAt ? formatTimestamp(record?.joinedAt) : ""}
          </Box>
        );
      },
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={rows ? rows : []}
      idAccessor="memberId"
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      striped={true}
      showBorder={true}
      highlight={true}
      selectedRecords={selectedRecords}
      setSelectedRecords={setSelectedRecords}
      isRecordSelectable={(record) => record.permission !== "owner"}
    />
  );
};

export default Table;
