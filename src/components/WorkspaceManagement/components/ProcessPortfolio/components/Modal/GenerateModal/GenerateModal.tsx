import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { useNAVersionMeasurementsQuery } from "@/hooks/index";
import { IPagination, IQueryParams, NAVersion } from "@/interfaces/index";
import {
  Accordion,
  ActionIcon,
  Alert,
  Badge,
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  ModalProps,
  Pagination,
  Skeleton,
  Text,
} from "@mantine/core";
import { ReactComponent as IconInfo } from "@tabler/icons/icons/info-circle-filled.svg";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NAVersionItem } from "./components";

interface GenerateModalProps extends ModalProps {
  onGenerate: () => void;
}

const GenerateModal = (props: GenerateModalProps) => {
  const { opened, onClose, onGenerate } = props;
  const { workspaceId } = useParams();
  const [queryParams, setQueryParams] = useState<IQueryParams>();
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    total: 0,
    limit: 0,
  });

  const handlePageChange = (page: number) => {
    setQueryParams({
      ...queryParams,
      page: page,
    });
    setPagination({ ...pagination, page: page });
  };

  const handleClose = () => {
    onClose();
  };

  const handleGenerate = () => {
    onGenerate?.();
  };

  const {
    data: NAVersions,
    isLoading: NALoading,
    fetchStatus: NAFetchStatus,
    refetch: NAVersionsRefetch,
    isFetching: NAIsFetching,
  } = useNAVersionMeasurementsQuery({
    workspaceId: Number(workspaceId),
    ...queryParams,
  });

  useEffect(() => {
    if (NAFetchStatus === "idle" && NAVersions) {
      // đã fetch xong API, khi đó mới có total & limit để phân trang
      setPagination({
        ...pagination,
        page: pagination.page,
        total: NAVersions?.total,
        limit: NAVersions?.limit,
      });
    }
  }, [NAFetchStatus]);

  return (
    <>
      {!NALoading ? (
        <Modal
          centered
          overlayProps={{
            blur: 3,
            opacity: 0.65,
          }}
          onClose={handleClose}
          opened={opened}
          title={
            <Flex align="center" gap={6}>
              <Badge fz={15} variant="light" children="Process portfolio" />
              <ActionIcon
                variant="subtle"
                radius="xl"
                color="blue"
                children={
                  <IconInfo
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                }
              />
            </Flex>
          }
          size="90%"
          // styles={{
          //   content: {
          //     height: "90vh",
          //   },
          // }}
        >
          {NAVersions && NAVersions?.data.length > 0 && (
            <>
              <Divider />
              <Alert
                style={{
                  borderLeft: `5px solid ${PRIMARY_COLOR[0]}`,
                  margin: "10px 0px",
                }}
              >
                <Text fz={14} style={{ textAlign: "justify" }}>
                  These versions are lack of necessary informations for
                  calculating. Please configure the following process versions
                  before generating the process portfolio.
                </Text>
              </Alert>
            </>
          )}
          <Accordion
            variant="contained"
            chevron
            transitionDuration={0}
            styles={{
              chevron: {
                display: "none",
              },
            }}
          >
            {!NAVersions || NAIsFetching ? (
              <Skeleton height={50} />
            ) : NAVersions.data.length === 0 ? (
              <>Process portfolio here!</>
            ) : (
              <>
                {NAVersions?.data.map((version: NAVersion) => {
                  return (
                    <Accordion.Item
                      key={version.processVersionVersion}
                      value={version.processVersionVersion}
                      children={
                        <NAVersionItem
                          data={version}
                          refetch={NAVersionsRefetch}
                        />
                      }
                    />
                  );
                })}
              </>
            )}
            <Accordion.Item value="pagination">
              <Accordion.Control
                children={
                  <Pagination
                    value={pagination.page}
                    total={Math.ceil(pagination.total / pagination.limit)}
                    onChange={handlePageChange}
                  />
                }
              />
            </Accordion.Item>
          </Accordion>

          <Flex justify="flex-end" gap={20} mt={20}>
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            {/* <Button variant="light" onClick={handleGenerate}>
          Re-generate
        </Button> */}
          </Flex>
        </Modal>
      ) : (
        <Flex justify="center" align="center">
          <LoadingOverlay visible />
        </Flex>
      )}
    </>
  );
};

export default GenerateModal;
