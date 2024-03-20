import { Button, Flex, Title, Text, Input, TextInput } from "@mantine/core";
import { useState } from "react";
import { ReactComponent as IconSuccess } from "@tabler/icons/icons/circle-check.svg";

interface LauncherConclusionProps {
  preview?: boolean;
  onSubmit: (email: string, name: string) => void;
}

const LauncherConclusion = (props: LauncherConclusionProps) => {
  const [userInfo, setUserInfo] = useState<{
    email: string;
    name: string;
  }>({
    email: "",
    name: "",
  });
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  return (
    <Flex
      direction="column"
      gap={30}
      justify="space-between"
      align="center"
      style={{
        margin: "30px",
        width: "100%",
      }}
    >
      {submissionSuccess ? (
        <>
          <Flex
            direction="column"
            gap={10}
            justify="center"
            align="center"
            w="100%"
          >
            <IconSuccess width={100} height={100} color="#87d185" />
            <Title order={3}>Submission successful!</Title>
            <Text>Thank you for your time and effort.</Text>
            <Text>
              Your feedback is incredibly valuable and will help us improve our
              products/services.
            </Text>
            <Text>
              Survey result will be sent to you via your provided email after
              this survey closed.
            </Text>
          </Flex>
        </>
      ) : (
        <>
          <Flex direction="column" gap={10} justify="center" align="center">
            <Title order={3}>Let's submit your response!</Title>
            <Text>
              Your feedback is incredibly valuable and will help us improve our
              products/services. Rest assured that your responses are
              confidential and will only be used for research purposes. Please
              provide us your email and name to finish survey.
            </Text>
          </Flex>
          <Flex justify="space-between" align="center" gap={20} w="100%">
            <TextInput
              withAsterisk
              w="100%"
              label="Email"
              placeholder="Enter your email here..."
              value={userInfo.email}
              onChange={(e) => {
                setUserInfo({ ...userInfo, email: e.target.value });
              }}
            />
            <TextInput
              withAsterisk
              w="100%"
              label="Nickname"
              placeholder="Enter your nickname here..."
              value={userInfo.name}
              onChange={(e) => {
                setUserInfo({ ...userInfo, name: e.target.value });
              }}
            />
          </Flex>
          <Flex justify="center">
            <Button
              onClick={() => {
                props.onSubmit(userInfo.email, userInfo.name);
                setSubmissionSuccess(true);
              }}
              disabled={props?.preview}
            >
              Submit your feedback
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default LauncherConclusion;
