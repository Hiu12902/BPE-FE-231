import { IEmptyRender } from "@/components/EmptyRender/EmptyRender";
import { DataTable, DataTableColumn } from "mantine-datatable";

interface IDataGrid {
  columns: DataTableColumn<any>[];
  rows: any[];
  emptyRender?: IEmptyRender;
  isLoading?: boolean;
  idAccessor?: string;

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
  onHandleMultipleSelections?: (selectionRecords?: any[]) => void;

  selectedRecords?: any[];
  setSelectedRecords?: (selectedRecords: any[]) => void;
  isRecordSelectable?: (record: any) => boolean;
  onRowClick?: (row: any) => void;
}

const DataGrid = ({
  columns,
  rows,
  pagination,
  onPageChange,
  emptyRender,
  isLoading,
  idAccessor,

  showBorder = false,
  striped,
  highlight,

  borderRadius = "sm",
  shadow = "sm",
  horizontalSpacing = "sm",
  verticalSpacing = "sm",
  verticalAlignment = "center",

  selectedRecords,
  isRecordSelectable,
  setSelectedRecords,
  onRowClick,
}: IDataGrid) => {
  return (
    <DataTable
      minHeight={400}
      columns={columns}
      idAccessor={idAccessor}
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
      isRecordSelectable={isRecordSelectable}
      onRowClick={onRowClick}
    />
  );
};

export default DataGrid;
