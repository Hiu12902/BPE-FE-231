import useNotification from "@/hooks/useNotification";
import { usePublishInfoQuery } from "@/hooks/useSurvey";
import { SurveyPublishBody } from "@/interfaces/index";
import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  ModalProps,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker, DatesProvider } from "@mantine/dates";
import { getHotkeyHandler } from "@mantine/hooks";
import { ReactComponent as IconSend } from "@tabler/icons/icons/plus.svg";
import { ReactComponent as IconDelete } from "@tabler/icons/icons/x.svg";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePublishModalStyle } from "./PublishModal.style";

interface PublishModalProps extends ModalProps {
  opened: boolean;
  title?: string;
  message?: string | JSX.Element;
  onConfirm: (data: SurveyPublishBody) => void;
  projectId: number;
}

const PublishModal = (props: PublishModalProps) => {
  const notify = useNotification();
  const { classes } = usePublishModalStyle();
  const [emailInput, setEmailInput] = useState<string>("");
  const processVersion = useParams().processVersion;
  const { opened, title, onConfirm, onClose, projectId } = props;

  const [publishInfoChange, setPublishInfoChange] = useState<SurveyPublishBody>(
    {
      email: [],
      startDate: null,
      endDate: null,
      surveyUrl: "",
      processVersionVersion: "",
      projectId: 0,
    }
  );

  const {
    data: publishInfo,
    refetch: refetchPublishInfo,
    isFetching: publishInfoFetching,
  } = usePublishInfoQuery({
    processVersion: processVersion,
    projectId: projectId,
  });

  const handleChangeStartDate = (value: Date) => {
    setPublishInfoChange({
      ...publishInfoChange,
      startDate: value,
    });
  };
  const handleChangeEndDate = (value: Date) => {
    setPublishInfoChange({
      ...publishInfoChange,
      endDate: value,
    });
  };

  const handleClose = () => {
    setPublishInfoChange({} as SurveyPublishBody);
    onClose?.();
  };

  const handlePublish = () => {
    const toLocaleISOString = (date: Date) => {
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzoffset).toISOString().substring(0, 16);
    };

    const { email, startDate, endDate, surveyUrl } = publishInfoChange;

    onConfirm?.({
      email: email,
      startDate:
        startDate !== null ? toLocaleISOString(new Date(startDate)) : null,
      endDate: endDate !== null ? toLocaleISOString(new Date(endDate)) : null,
      surveyUrl: surveyUrl,
      processVersionVersion: "",
      projectId: 0,
    });
    handleClose?.();
  };

  const handleAddEmail = () => {
    if (!publishInfoChange.email.find((email) => email === emailInput)) {
      setPublishInfoChange({
        ...publishInfoChange,
        email: [...publishInfoChange.email, emailInput],
      });
    }
    setEmailInput("");
  };

  useEffect(() => {
    if (publishInfo) {
      const { email, surveyUrl, startDate, endDate } = publishInfo;
      setPublishInfoChange({
        ...publishInfoChange,
        email: email,
        surveyUrl: `https://bpsky232.vercel.app/${processVersion}/survey/launch`,
        startDate: startDate,
        endDate: endDate,
      });
    }
  }, [publishInfo]);

  return !publishInfo ? (
    <Flex>
      <LoadingOverlay visible={true} />
    </Flex>
  ) : publishInfo.isPublished === "published" ? (
    <Modal
      size="xl"
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      opened={opened}
      onClose={handleClose}
      title={
        <Badge size="lg" color="blue">
          {title}
        </Badge>
      }
      styles={{
        close: {
          display: " none",
        },
      }}
    >
      <LoadingOverlay visible={publishInfoFetching} />
      <Title order={5}>
        Survey is already published. You can visit it using this link:
      </Title>

      <Flex my={15} direction="column">
        <Tooltip label="Click to copy survey's URL">
          <Flex
            w="100%"
            onClick={() => {
              if (!publishInfoChange?.surveyUrl) return;
              navigator.clipboard.writeText(publishInfoChange?.surveyUrl);
              notify({
                title: "Link copied",
                message: "Link has been copied to clipboard",
                type: "success",
              });
            }}
            styles={{
              cursor: "pointer",
            }}
          >
            <Input
              w="100%"
              value={publishInfoChange?.surveyUrl}
              disabled
              onClick={() => {
                if (!publishInfoChange?.surveyUrl) return;
                navigator.clipboard.writeText(publishInfoChange?.surveyUrl);
                notify({
                  title: "Link copied",
                  message: "Link has been copied to clipboard",
                  type: "success",
                });
              }}
              styles={{
                wrapper: {
                  cursor: "pointer",
                },
              }}
              className={classes.link}
            />
          </Flex>
        </Tooltip>
      </Flex>

      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" onClick={handleClose} children="Cancel" />
      </Group>
    </Modal>
  ) : (
    <Modal
      size="xl"
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      opened={opened}
      onClose={handleClose}
      title={
        <Badge size="lg" mb={5} color="blue">
          {title}
        </Badge>
      }
      styles={{
        close: {
          display: " none",
        },
      }}
    >
      <LoadingOverlay visible={publishInfoFetching} />
      <Text>
        Publishing will update the version seen by respondents. It can take up
        to 5 minutes to reflect changes for respondents starting new survey
        sessions.
      </Text>

      <Flex mt={20}>
        <TextInput
          data-autofocus
          label=" Respondent's email"
          description="Add a respondent's email"
          placeholder="Enter email here..."
          value={emailInput}
          onChange={(e) => setEmailInput(e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([["enter", handleAddEmail]])}
          rightSection={
            <IconSend
              onClick={handleAddEmail}
              style={{
                width: 24,
                height: 24,
                cursor: "pointer",
              }}
            />
          }
          styles={{
            root: {
              width: "100%",
            },
            label: {
              fontSize: 16,
              fontWeight: 600,
            },
          }}
        />
      </Flex>
      {publishInfoChange?.email.length > 0 && (
        <Group mt={20}>
          {publishInfoChange?.email.map((email, index) => (
            <Badge
              variant="outline"
              w="auto"
              key={index}
              size="md"
              rightSection={
                <ActionIcon
                  size="xs"
                  color="blue"
                  radius="xl"
                  variant="transparent"
                  onClick={() => {
                    setPublishInfoChange({
                      ...publishInfoChange,
                      email: publishInfoChange.email.filter(
                        (item) => item !== email
                      ),
                    });
                  }}
                >
                  <IconDelete />
                </ActionIcon>
              }
            >
              {email}
            </Badge>
          ))}
        </Group>
      )}

      <Flex mt={20} direction="column">
        <Title order={5}>Distribute</Title>
        <Text c="dimmed" fz={12}>
          Use this link to distribute your survey
        </Text>
        <Tooltip label="Click to copy survey's URL">
          <Flex
            w="100%"
            onClick={() => {
              if (!publishInfoChange?.surveyUrl) return;
              navigator.clipboard.writeText(publishInfoChange?.surveyUrl);
              notify({
                title: "Link copied",
                message: "Link has been copied to clipboard",
                type: "success",
              });
            }}
            styles={{
              cursor: "pointer",
            }}
          >
            <Input
              w="100%"
              value={publishInfoChange?.surveyUrl}
              disabled
              onClick={() => {
                if (!publishInfoChange?.surveyUrl) return;
                navigator.clipboard.writeText(publishInfoChange?.surveyUrl);
                notify({
                  title: "Link copied",
                  message: "Link has been copied to clipboard",
                  type: "success",
                });
              }}
              styles={{
                wrapper: {
                  cursor: "pointer",
                },
              }}
              className={classes.link}
            />
          </Flex>
        </Tooltip>
      </Flex>

      {publishInfo.isPublished === "closed" && (
        <Flex mt={20} direction="column">
          <Title order={5}>Publish date</Title>
          <DatesProvider
            settings={{
              locale: "ru",
              firstDayOfWeek: 1,
              weekendDays: [0, 6],
            }}
          >
            <Flex justify="space-around" gap="10px">
              <Flex justify="center" align="center" gap="10px" w="100%">
                <DateTimePicker
                  clearable
                  w="100%"
                  label="Start date"
                  description="Leave empty if you want to publish now."
                  defaultValue={undefined}
                  value={
                    publishInfoChange?.startDate !== null
                      ? new Date(publishInfoChange?.startDate)
                      : null
                  }
                  placeholder="Choose start date"
                  onChange={handleChangeStartDate}
                />
              </Flex>
              <Divider orientation="vertical" />
              <Flex justify="center" align="center" gap="10px" w="100%">
                <DateTimePicker
                  clearable
                  w="100%"
                  label="End date"
                  description="End date could be empty, survey will launch forever."
                  placeholder="Choose end date"
                  defaultValue={undefined}
                  value={
                    publishInfoChange?.endDate !== null
                      ? new Date(publishInfoChange?.endDate)
                      : null
                  }
                  onChange={handleChangeEndDate}
                />
              </Flex>
            </Flex>
          </DatesProvider>
        </Flex>
      )}

      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" onClick={handleClose} children="Cancel" />
        <Button
          onClick={handlePublish}
          color="red"
          children={
            publishInfo.isPublished === "closed" ? "Publish" : "Save changes"
          }
        />
      </Group>
    </Modal>
  );
};

export default PublishModal;
