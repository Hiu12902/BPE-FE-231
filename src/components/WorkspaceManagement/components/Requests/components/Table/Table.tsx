import DataGrid from "@/components/DataGrid";
import { IPagination } from "@/interfaces/common";
import { IRequests } from "@/interfaces/workspaces";
import { Box, Button, Text, Tooltip } from "@mantine/core";
import {
  DataTableColumn,
  DataTableColumnTextAlignment,
} from "mantine-datatable";
import { ReactComponent as IconAssignPermission } from "@tabler/icons/icons/lock-open.svg";
import { ReactComponent as IconInvite } from "@tabler/icons/icons/mailbox.svg";

interface ITableProps {
  rows?: IRequests[];
  isLoading?: boolean;
  pagination?: IPagination;
  onPageChange?: (page: number) => void;
  onChangeStatus: ({
    status,
    requestId,
  }: {
    status: string;
    requestId?: number;
  }) => void;
  selectedRecords?: IRequests[];
  setSelectedRecords?: (selectedRecords: IRequests[]) => void;
  onRowClick?: (row: IRequests) => void;
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

  const columns: DataTableColumn<IRequests>[] = [
    {
      accessor: "type",
      title: "Type",
      width: 50,
      render: (record: IRequests) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {record.type === "adjust permission" ? (
              <Tooltip label="Assign permission request">
                <IconAssignPermission
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              </Tooltip>
            ) : record.type === "invitation" ? (
              <Tooltip label="Invite user request">
                <IconInvite
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              </Tooltip>
            ) : (
              <></>
            )}
          </Box>
        );
      },
    },
    {
      accessor: "content",
      title: "Content",
      width: 500,
      render: (record: IRequests) => {
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
      width: 150,
      textAlignment: "center" as DataTableColumnTextAlignment,
      render: (record: IRequests) => {
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
      width: 250,
      textAlignment: "center" as DataTableColumnTextAlignment,
      render: (record: IRequests) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              margin: "0 auto",
            }}
          >
            {record.status ? (
              <>
                <Button
                  w={100}
                  color="teal"
                  variant={record.status === "approved" ? "filled" : "outline"}
                  disabled={record.status === "declined"}
                  children="Approved"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeStatus({
                      status: "approved",
                      requestId: record.id,
                    });
                  }}
                />

                <Button
                  w={100}
                  color="red"
                  variant={record.status === "declined" ? "filled" : "outline"}
                  disabled={record.status === "approved"}
                  children="Declined"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeStatus({
                      status: "declined",
                      requestId: record.id,
                    });
                  }}
                />
              </>
            ) : (
              <Text
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Loading...
              </Text>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={rows ? rows : []}
      idAccessor="id"
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      striped={true}
      showBorder={true}
      highlight={true}
      selectedRecords={selectedRecords}
      setSelectedRecords={setSelectedRecords}
      onRowClick={onRowClick}
      // isRecordSelectable={(record) => record.status === "pending"}
    />
  );
};

export default Table;
