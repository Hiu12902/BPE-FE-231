import { EmptyRender } from "@/components/EmptyRender";
import { usePortfolioProjectQuery, useQueryParams } from "@/hooks/index";
import { IPagination } from "@/interfaces/index";
import {
  Accordion,
  Container,
  Flex,
  LoadingOverlay,
  Pagination,
  Skeleton,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProcessPortfolioStyle } from "./ProcessPortfolio.style";
import ProjectList from "./components/ProjectList";

const ProcessPortfolio = () => {
  const { queryParams, setQueryParams } = useQueryParams();
  const { classes } = useProcessPortfolioStyle();
  const { workspaceId } = useParams();

  const {
    data: projects,
    isLoading: projectsLoading,
    fetchStatus: projectsFetchStatus,
  } = usePortfolioProjectQuery({
    workspaceId: workspaceId,
    ...queryParams,
  });

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

  return !projects ? (
    <Flex>
      <LoadingOverlay visible />
    </Flex>
  ) : (
    <Container size="xl">
      <Title order={1}>Process portfolio</Title>
      <Accordion
        variant="contained"
        chevron
        className={classes.accordion}
        transitionDuration={0}
      >
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
    </Container>
  );
};

export default ProcessPortfolio;
