import { useSurveyInformationQuery } from "@/hooks/useSurvey";
import {
  Flex,
  Title,
  Text,
  List,
  ThemeIcon,
  Badge,
  Loader,
} from "@mantine/core";
import { ReactComponent as IconCheck } from "@tabler/icons/icons/pin.svg";

interface LauncherIntroductionProps {
  name: string;
  description: string;
}

const LauncherIntroduction = (props: LauncherIntroductionProps) => {
  const { name, description } = props;

  return name.length <= 0 ? (
    <Flex w="100%" justify="center" my={100} align="center">
      <Loader />
    </Flex>
  ) : (
    <Flex
      direction="column"
      justify="center"
      gap={80}
      style={{
        width: "100%",
        padding: "20px",
        height: "100%",
      }}
    >
      <Flex direction="column" gap={5} align="center">
        <Title
          order={3}
          style={{
            color: "#1976d2",
          }}
        >
          Welcome to {name}
        </Title>
        <Text c="dimmed">{description}</Text>
      </Flex>
      <Flex direction="column" gap={10}>
        <Title
          order={4}
          style={{
            color: "#1976d2",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "10px",
          }}
        >
          Cautions
        </Title>
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon size={24} radius="xl" variant="light">
              <IconCheck />
            </ThemeIcon>
          }
        >
          <List.Item>
            <Title order={5}>Read Instructions Carefully:</Title>
            <Text>
              Pay attention to the instructions provided at the beginning of the
              survey. Understanding the purpose and scope of the survey can help
              provide accurate and relevant responses.
            </Text>
          </List.Item>
          <List.Item>
            <Title order={5}>Answer Honestly:</Title>
            <Text>
              Respondents should provide truthful and accurate responses to
              survey questions. Dishonest or inaccurate answers can skew the
              results and compromise the integrity of the survey data.
            </Text>
          </List.Item>
          <List.Item>
            <Title order={5}>Consider Privacy:</Title>
            <Text>
              Be mindful of the information being requested in the survey and
              consider the potential implications of sharing personal or
              sensitive data. Respondents should only provide information that
              they are comfortable sharing, and they should be assured that
              their responses will be kept confidential and used only for
              research purposes.
            </Text>
          </List.Item>
          <List.Item>
            <Title order={5}>Protect Personal Information:</Title>
            <Text>
              Avoid providing personally identifiable information (such as
              social security numbers or financial account numbers) unless
              absolutely necessary and only if respondents trust the
              organization conducting the survey to handle their data securely.
            </Text>
          </List.Item>
        </List>
      </Flex>
    </Flex>
  );
};

export default LauncherIntroduction;
