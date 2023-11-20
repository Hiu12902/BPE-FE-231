import DataGrid from "@/components/DataGrid";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { IPagination } from "@/interfaces/common";
import { INotification } from "@/interfaces/workspaces";
import { ActionIcon, Box, Button, Text } from "@mantine/core";
import { ReactComponent as IconStarFilled } from "@tabler/icons/icons/star-filled.svg";
import { ReactComponent as IconStarUnfilled } from "@tabler/icons/icons/star.svg";
import { ReactComponent as IconEyeClose } from "@tabler/icons/icons/mail-opened.svg";
import { ReactComponent as IconEyeOpen } from "@tabler/icons/icons/mail.svg";
import {
  DataTableColumn,
  DataTableColumnTextAlignment,
} from "mantine-datatable";

interface ITableProps {
  isLoading?: boolean;
  rows?: INotification[];
  pagination?: IPagination;
  selectedRecords?: INotification[];
  onPageChange?: (page: number) => void;
  onRowClick?: (row: INotification) => void;
  setSelectedRecords?: (selectedRecords: INotification[]) => void;
  onChangeStatus: ({ status, id }: { status: boolean; id: number }) => void;
}

const Table = ({
  rows,
  isLoading,
  pagination,
  onRowClick,
  onPageChange,
  onChangeStatus,
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

  const columns: DataTableColumn<INotification>[] = [
    {
      accessor: "content",
      title: "Content",
      width: 450,
      render: (record: INotification) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.content}
            </Text>
          </Box>
        );
      },
    },
    {
      accessor: "createdAt",
      title: "Created at",
      width: 100,
      textAlignment: "center" as DataTableColumnTextAlignment,
      render: (record: INotification) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {record.createdAt ? formatTimestamp(record?.createdAt) : ""}
          </Box>
        );
      },
    },
    {
      accessor: "status",
      title: "Status",
      width: 100,
      textAlignment: "center" as DataTableColumnTextAlignment,
      render: (record: INotification) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              w={100}
              variant="light"
              color={
                record.status === "accepted"
                  ? "teal"
                  : record.status === "declined"
                  ? "red"
                  : "gray"
              }
            >
              {record.status}
            </Button>
          </Box>
        );
      },
    },
    {
      accessor: "isStarred",
      title: "Pin",
      width: 40,
      textAlignment: "center" as DataTableColumnTextAlignment,
      render: (record: INotification) => {
        return (
          <Box
            sx={{
              gap: "10px",
              display: "flex",
              margin: "0 auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {record.isStarred ? (
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeStatus({
                    status: false,
                    id: record.id,
                  });
                }}
              >
                <IconStarFilled
                  width={20}
                  height={20}
                  color={PRIMARY_COLOR[1]}
                />
              </ActionIcon>
            ) : (
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeStatus({
                    status: true,
                    id: record.id,
                  });
                }}
              >
                <IconStarUnfilled
                  width={20}
                  height={20}
                  color={PRIMARY_COLOR[1]}
                />
              </ActionIcon>
            )}
          </Box>
        );
      },
    },
    {
      accessor: "isRead",
      title: "",
      width: 40,
      textAlignment: "center" as DataTableColumnTextAlignment,
      render: (record: INotification) => {
        return (
          <Box
            sx={{
              gap: "10px",
              display: "flex",
              margin: "0 auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {record.isRead ? (
              <IconEyeClose width={20} height={20} color={PRIMARY_COLOR[2]} />
            ) : (
              <IconEyeOpen width={20} height={20} color="#ff9b9b" />
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <DataGrid
      striped={false}
      idAccessor="id"
      highlight={true}
      columns={columns}
      showBorder={true}
      isLoading={isLoading}
      onRowClick={onRowClick}
      rows={rows ? rows : []}
      pagination={pagination}
      onPageChange={onPageChange}
      selectedRecords={selectedRecords}
      setSelectedRecords={setSelectedRecords}
      // isRecordSelectable={(record) => {}}
    />
  );
};

export default Table;
