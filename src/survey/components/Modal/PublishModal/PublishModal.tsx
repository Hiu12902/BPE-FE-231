import useNotification from "@/hooks/useNotification";
import { SurveyPublishBody } from "@/interfaces/index";
import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  Input,
  Modal,
  ModalProps,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker, DatesProvider } from "@mantine/dates";
import { getHotkeyHandler } from "@mantine/hooks";
import { ReactComponent as IconCopy } from "@tabler/icons/icons/copy.svg";
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
}

const PublishModal = (props: PublishModalProps) => {
  const notify = useNotification();
  const { classes } = usePublishModalStyle();
  const [email, setEmail] = useState<string>("");
  const processVersion = useParams().processVersion;
  const [emailList, setEmailList] = useState<string[]>([]);
  const { opened, title, message, onConfirm, onClose } = props;

  const [end, setEnd] = useState<Date | string | null>(null);
  const [start, setStart] = useState<Date | string | null>(null);

  const handleChangeStartDate = (value: Date) => {
    setStart(value);
  };
  const handleChangeEndDate = (value: Date) => {
    setEnd(value);
  };
  const [url, setUrl] = useState<string>("");

  const handleClose = () => {
    setEmail("");
    setEmailList([]);
    setStart(null);
    setEnd(null);
    onClose?.();
  };

  const handlePublish = () => {
    const toLocaleISOString = (date: Date) => {
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzoffset).toISOString().substring(0, 19);
    };

    onConfirm?.({
      email: emailList,
      startDate:
        start !== null
          ? toLocaleISOString(start as Date)
          : toLocaleISOString(new Date()),
      endDate: end !== null ? toLocaleISOString(end as Date) : null,
      surveyUrl: url,
      processVersionVersion: "",
      projectId: 0,
    });

    handleClose();
  };

  const handleAddEmail = () => {
    setEmail("");
    if (!emailList.find((email) => email)) {
      setEmailList([...emailList, email]);
    }
  };

  useEffect(() => {
    if (processVersion) {
      setUrl(`http://localhost:5173/${processVersion}/survey/launch`);
    }
  }, [processVersion]);

  return (
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
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
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

      <Group mt={20}>
        {emailList.map((email, index) => (
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
                  setEmailList(emailList.filter((item) => item !== email));
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

      <Flex mt={20} direction="column">
        <Title order={5}>Distribute</Title>
        <Text c="dimmed" fz={12}>
          Use this link to distribute your survey
        </Text>
        <Input
          value={url}
          rightSection={
            <IconCopy
              onClick={() => {
                navigator.clipboard.writeText(url);
                notify({
                  title: "Link copied",
                  message: "Link has been copied to clipboard",
                  type: "success",
                });
              }}
              style={{
                width: 24,
                height: 24,
                cursor: "pointer",
              }}
            />
          }
          className={classes.link}
        />
      </Flex>

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
                value={start !== null ? new Date(start) : null}
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
                value={end !== null ? new Date(end) : null}
                onChange={handleChangeEndDate}
              />
            </Flex>
          </Flex>
        </DatesProvider>
      </Flex>

      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" onClick={handleClose} children="Cancel" />
        <Button onClick={handlePublish} color="red" children="Publish" />
      </Group>
    </Modal>
  );
};

export default PublishModal;
