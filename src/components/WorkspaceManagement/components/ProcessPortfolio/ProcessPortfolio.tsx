import { EmptyRender } from "@/components/EmptyRender";
import { usePortfolioProjectQuery, useQueryParams } from "@/hooks/index";
import { IPagination } from "@/interfaces/index";
import {
  Accordion,
  ActionIcon,
  Alert,
  Button,
  Container,
  Flex,
  Grid,
  LoadingOverlay,
  Pagination,
  Skeleton,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { ReactComponent as IconQuestion } from "@tabler/icons/icons/question-circle.svg";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProcessPortfolioStyle } from "./ProcessPortfolio.style";
import ProjectList from "./components/ProjectList";

import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { ReactComponent as IconPerformanceLevel } from "@tabler/icons/icons/adjustments-horizontal.svg";
import { ReactComponent as IconProcessPortfolio } from "@tabler/icons/icons/chart-grid-dots.svg";
import { ReactComponent as IconInfo } from "@tabler/icons/icons/info-circle-filled.svg";
import { ConfigModal, GenerateModal } from "./components/Modal";

import driverInstance from "@/utils/driver/driver";
import { DriveStep } from "driver.js";

const ProcessPortfolioSteps: DriveStep[] = [
  {
    element: "#tour_performance_level",
    popover: {
      title: "Performance level",
      description:
        "This is where you can configure workspace's performance level. Performance level is used to calculate the Health of each process versions in workspace.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#tour_version_item",
    popover: {
      title: "Process version",
      description:
        "A process can have more than one process version. But only one version is active at a time.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tour_version_menu",
    popover: {
      title: "Process version status",
      description:
        "Process version's badge show the status of process versions: Active or Inactive.",
      side: "left",
      align: "center",
    },
  },
  {
    element: "#tour_version_menu button",
    popover: {
      title: "Edit version measurements",
      description:
        "You can activate another version in process or edit version measurements. Version measurements is important for generating process portfolio.",
      side: "left",
      align: "center",
    },
  },
  {
    element: "#tour_generate_portfolio",
    popover: {
      title: "Generate process portfolio",
      description:
        "After configuring all necessary informations, you can generate process portfolio. Click here to generate the process portfolio.",
      side: "top",
      align: "start",
    },
  },
];

const ProcessPortfolio = () => {
  const { queryParams, setQueryParams } = useQueryParams();
  const { classes } = useProcessPortfolioStyle();
  const { workspaceId } = useParams();
  const [openConfigModal, setOpenConfigModal] = useState<boolean>(false);
  const [openGenerateModal, setOpenGenerateModal] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    total: 0,
    limit: 0,
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    fetchStatus: projectsFetchStatus,
  } = usePortfolioProjectQuery({
    workspaceId: workspaceId,
    ...queryParams,
  });

  const handlePageChange = (page: number) => {
    setQueryParams({
      ...queryParams,
      page: page,
    });
    setPagination({ ...pagination, page: page });
  };

  useEffect(() => {
    if (projectsFetchStatus === "idle") {
      // đã fetch xong API, khi đó mới có total & limit để phân trang
      setPagination({
        ...pagination,
        page: pagination.page,
        total: projects?.total || pagination.total,
        limit: projects?.limit || pagination.limit,
      });
    }
  }, [projectsFetchStatus]);

  useEffect(() => {
    if (queryParams) {
      setPagination({
        ...pagination,
        page: queryParams.page || pagination.page,
      });
    }
  }, [queryParams]);

  const [NAPerformanceLevel, setNAPerformanceLevel] = useState<
    boolean | undefined
  >();

  return !projects ? (
    <Flex>
      <LoadingOverlay visible />
    </Flex>
  ) : (
    <Container size="xl">
      <ConfigModal
        onClose={() => setOpenConfigModal(false)}
        opened={openConfigModal}
        onSave={() => {
          setOpenConfigModal(false);
        }}
        setIsNAPerformanceLevel={(value: boolean) =>
          setNAPerformanceLevel(value)
        }
      />

      {openGenerateModal && (
        <GenerateModal
          opened={openGenerateModal}
          onClose={() => setOpenGenerateModal(false)}
          onGenerate={() => {
            setOpenGenerateModal(false);
          }}
        />
      )}

      <Flex justify="space-between" align="center">
        {/* Title */}
        <Flex align="center" gap={6}>
          <Title order={1}>Process portfolio</Title>
          <ActionIcon
            variant="subtle"
            radius="xl"
            color="blue"
            children={
              <IconInfo
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            }
          />
        </Flex>
        {/* Button group */}
        <Flex className={classes.buttonGroup}>
          <Tooltip
            label="Generate process portfolio"
            style={{
              maxWidth: "200px",
            }}
            multiline
            children={
              <Button
                id="tour_generate_portfolio"
                variant="light"
                onClick={() => {
                  setOpenGenerateModal(true);
                }}
                children="Process portfolio"
                leftIcon={
                  <IconProcessPortfolio
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                }
              />
            }
          />
          <Tooltip
            label={"Change performance level"}
            style={{
              maxWidth: "200px",
            }}
            multiline
            children={
              NAPerformanceLevel ? (
                <Button
                  variant="light"
                  color="red"
                  children="Performance level"
                  onClick={() => setOpenConfigModal(true)}
                  id="tour_performance_level"
                  leftIcon={
                    <IconPerformanceLevel
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  }
                />
              ) : (
                <Button
                  variant="light"
                  children="Performance level"
                  onClick={() => setOpenConfigModal(true)}
                  id="tour_performance_level"
                  leftIcon={
                    <IconPerformanceLevel
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  }
                />
              )
            }
          />
        </Flex>
      </Flex>
      {NAPerformanceLevel && (
        <Alert
          variant="light"
          color="red"
          style={{
            borderLeft: "5px solid red",
            marginTop: "10px",
          }}
        >
          <Text size="sm">
            <strong>Warning:</strong> You have not configured the performance
            level for this workspace. Please configure it to help us calculate
            the Health of your process version. Otherwise, the Health of version
            will be set to N/A.
          </Text>
        </Alert>
      )}
      <Accordion
        variant="contained"
        chevron
        className={classes.accordion}
        transitionDuration={0}
        defaultValue={projects.data[0].id.toString()}
      >
        <Accordion.Item value="heading">
          <Accordion.Control>
            <Grid align="center" justify="center">
              {/* Project name */}
              <Grid.Col span={9}>
                <Flex justify="flex-start" align="center">
                  <Text size="md">Project Name</Text>
                </Flex>
              </Grid.Col>

              {/* Owner */}
              <Grid.Col span={3}>
                <Flex justify="center" align="center">
                  <Text size="md">Project Owner</Text>
                </Flex>
              </Grid.Col>
            </Grid>
          </Accordion.Control>
        </Accordion.Item>

        <ProjectList data={projects.data} />
        {projectsLoading ? (
          <Skeleton height={50} mt={10} />
        ) : projects.data.length === 0 ? (
          EmptyRender({
            text: "No results found",
          })
        ) : (
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
        )}
      </Accordion>
      {projects.data.length > 0 && (
        <ActionIcon
          variant="light"
          style={{
            border: "none",
            backgroundColor: "transparent",
            width: 45,
            height: 45,
            position: "fixed",
            bottom: 10,
            right: 10,
          }}
          children={
            <IconQuestion width={50} height={50} color={PRIMARY_COLOR[0]} />
          }
          onClick={() => {
            driverInstance.setSteps(ProcessPortfolioSteps);
            driverInstance.drive();
          }}
        />
      )}
    </Container>
  );
};

export default ProcessPortfolio;
