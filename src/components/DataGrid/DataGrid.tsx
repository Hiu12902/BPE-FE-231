import { IEmptyRender } from "@/components/EmptyRender/EmptyRender";
import { IMembers } from "@/interfaces/workspaces";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useState } from "react";

interface IDataGrid {
  columns: DataTableColumn<IMembers>[];
  rows: IMembers[];
  emptyRender?: IEmptyRender;
  isLoading?: boolean;

  showBorder?: boolean;
  striped?: boolean;
  highlight?: boolean;

  borderRadius?: string;
  shadow?: string;
  horizontalSpacing?: string;
  verticalSpacing?: string;
  fontSize?: string;
  verticalAlignment?: "top" | "center" | "bottom";

  pagination?: any;
  onPageChange?: (p: any) => void;
  onHandleMultipleSelections?: (selectionRecords?: IMembers[]) => void;

  selectedRecords?: IMembers[];
  setSelectedRecords?: (selectedRecords: IMembers[]) => void;
}

const DataGrid = ({
  columns,
  rows,
  pagination,
  onPageChange,
  emptyRender,
  isLoading,

  showBorder = false,
  striped,
  highlight,

  borderRadius = "sm",
  shadow = "sm",
  horizontalSpacing = "sm",
  verticalSpacing = "sm",
  verticalAlignment = "center",

  selectedRecords,
  setSelectedRecords,
}: IDataGrid) => {
  return (
    <DataTable
      minHeight={400}
      columns={columns}
      idAccessor="memberId"
      records={rows}
      withBorder={showBorder}
      striped={striped}
      highlightOnHover={highlight}
      borderRadius={borderRadius}
      shadow={shadow}
      horizontalSpacing={horizontalSpacing}
      verticalSpacing={verticalSpacing}
      verticalAlignment={verticalAlignment}
      totalRecords={pagination.total}
      noRecordsIcon={emptyRender?.icon}
      noRecordsText={emptyRender?.text}
      page={pagination.page}
      recordsPerPage={pagination.limit}
      onPageChange={(p) => onPageChange?.(p)}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      fetching={isLoading}
      loaderVariant="dots"
      loaderSize="lg"
      loaderBackgroundBlur={5}
      isRecordSelectable={(record) => record.permission !== "owner"}
    />
  );
};

export default DataGrid;
