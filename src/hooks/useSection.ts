import { useQuery } from "@tanstack/react-query";
import { surveyApi } from "../api";

export const useSectionQuery = ({
  processVersion,
  mode,
}: {
  processVersion: string;
  mode: string;
}) => {
  const queryKey = ["section", processVersion];

  const sectionInSurveyQuery = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      surveyApi.getSectionInSurvey({
        processVersion,
        mode,
      }),
    enabled: !!processVersion,
    retry: 3,
  });

  return {
    ...sectionInSurveyQuery,
  };
};
