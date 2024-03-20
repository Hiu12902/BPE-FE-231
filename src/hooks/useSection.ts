import { useQuery } from "@tanstack/react-query";
import { surveyApi } from "../api";

export const useSectionQuery = ({
  processVersion,
}: {
  processVersion: string;
}) => {
  const queryKey = ["section", processVersion];

  const sectionInSurveyQuery = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      surveyApi.getSectionInSurvey({
        processVersion,
      }),
    enabled: !!processVersion,
  });

  return {
    ...sectionInSurveyQuery,
  };
};
