import projectApi from "@/api/project";
import { UserRole } from "@/constants/project";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { TOOLBAR_MODE } from "@/constants/toolbar";
import useDetachModel from "@/core/hooks/useDetachModel";
import useNotification from "@/hooks/useNotification";
import { IFile } from "@/interfaces/projects";
import {
  getActiveTab,
  getCurrentModeler,
  getModelers,
} from "@/redux/selectors";
import {
  evaluatedResultActions,
  modelActions,
  tabsSliceActions,
  toolSliceActions,
} from "@/redux/slices";
import { TabVariant } from "@/redux/slices/tabs";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  Badge,
  Box,
  Flex,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { ReactComponent as IconAbc } from "@tabler/icons/icons/abc.svg";
import { ReactComponent as IconCircleXFilled } from "@tabler/icons/icons/circle-x.svg";
import { ReactComponent as IconFile3d } from "@tabler/icons/icons/file-3d.svg";
import { ReactComponent as IconFileSpreadsheet } from "@tabler/icons/icons/file-spreadsheet.svg";
import { ReactComponent as IconFileSymlink } from "@tabler/icons/icons/file-symlink.svg";
import { ReactComponent as IconFileText } from "@tabler/icons/icons/file-text.svg";
import { ReactComponent as IconHexagons } from "@tabler/icons/icons/hexagons.svg";
import { ReactComponent as IconTrash } from "@tabler/icons/icons/trash.svg";
import { MouseEvent, useRef, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../DropdownMenu";
import { IDropdownMenuContent } from "../DropdownMenu/DropdownMenu";
import { useFileCardStyle } from "./FileItem.style";

const FileItem = (props: IFile) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    variant = "general",
    documentLink,
    xmlFileLink,
    id,
    lastSaved,
    projectName,
    projectId,
    onDeleteFile,
    name,
    createAt,
    result,
    processId,
    num,
    processName,
    role,
  } = props;
  const isProcess = !xmlFileLink && !documentLink && !result;
  const isVersion = !!xmlFileLink;
  const isDocument = !!documentLink;
  const modelers = useSelector(getModelers);
  const currentModeler = useSelector(getCurrentModeler);
  const activeTab = useSelector(getActiveTab);
  const version = xmlFileLink
    ?.split("/")
    [xmlFileLink?.split("/").length - 1].replace(".bpmn", "");
  const { classes } = useFileCardStyle();
  const IconFile = isDocument
    ? IconFileText
    : result
    ? IconFileSpreadsheet
    : isVersion
    ? IconFile3d
    : IconHexagons;
  const isOpeningInEditor =
    !!modelers.find((modeler) => modeler.id === version) ||
    !!modelers.find((modeler) => modeler.processId === id);
  const [fileNameRendered, setFileNameRendered] = useState<string | undefined>(
    name
  );
  const [isProcessInEditor, setIsProcessInEditor] = useState(false);
  const [versions, setVersions] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const detach = useDetachModel();
  const notify = useNotification();

  const getProcessVersions = async () => {
    try {
      if (versions.length > 0) {
        return;
      }
      if (id) {
        const res = await projectApi.getProcessVerions({
          projectId: projectId,
          processId: id,
        });
        if (res) {
          const versions = res.map((version: IFile) => ({
            ...version,
            processId: id,
            processName: name,
          }));
          setVersions(versions);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onOpenBpmnFile = () => {
    if (xmlFileLink && version) {
      batch(() => {
        dispatch(
          modelActions.setModelers({
            modeler: undefined,
            id: version,
            projectId: projectId,
            projectName: projectName,
            name: `${processName}_ver_${num}`,
            processId: processId,
            role: role,
          })
        );
        detach();
        dispatch(modelActions.setCurrentModeler(version));
        if (activeTab?.id !== version) {
          dispatch(tabsSliceActions.setActiveTab(version));
        }
      });
      navigate("/editor");
    }
  };

  const onOpenResultFile = () => {
    const newId = randomId();
    batch(() => {
      dispatch(
        evaluatedResultActions.setEvaluatedResult({ result: result, id: newId })
      );
      dispatch(
        tabsSliceActions.setTabs({
          label: `Evaluated Result - ${currentModeler?.name}`,
          value: "evaluateResult",
          variant: TabVariant.RESULT,
          toolMode: TOOLBAR_MODE.EVALUATING,
          id: newId,
          model: currentModeler?.id,
          projectID: currentModeler?.projectId,
          processId: currentModeler?.processId,
        })
      );
      dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.EVALUATING));
    });
  };

  const onDeleteBpmnFile = async () => {
    try {
      if (projectId && version && processId) {
        const res = await projectApi.deleteVerion({
          projectId: projectId,
          version: version,
          processId: processId,
        });
        if (res) {
          onDeleteFile?.(xmlFileLink ? xmlFileLink : documentLink);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDeleteProcess = async () => {
    try {
      if (!id) {
        return;
      }
      const res = await projectApi.deleteProcess({
        projectId: projectId,
        processId: id,
      });
      if (res) {
        onDeleteFile?.(id);
        notify({
          title: "Success!",
          message: "Delete process successfully!",
          type: "success",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openConfirmModal({
      title: "Delete this file",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this {isProcess ? "process" : "file"}?
          Your action will not be able to undo.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: isProcess ? onDeleteProcess : onDeleteBpmnFile,
    });
  };

  const onRenameFile = async () => {
    try {
      if (nameInputRef.current && projectId && id) {
        const updatedName = nameInputRef.current.value;
        const res = await projectApi.renameProcess(
          { name: updatedName },
          {
            projectId: projectId,
            processId: id,
          }
        );
        if (res) {
          console.log(res);
          setFileNameRendered(updatedName);
          notify({
            title: "Success!",
            message: "Rename process successfully!",
            type: "success",
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openRenameModal = (e: any) => {
    e.stopPropagation();
    openConfirmModal({
      title: "Rename File",
      children: (
        <TextInput
          placeholder="File's name"
          ref={nameInputRef}
          value={fileNameRendered}
        />
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: onRenameFile,
    });
  };

  const onOpenDocument = () => {
    navigate(`/document?project=${projectName}&p=${projectId}`);
  };

  const onCloseFile = () => {
    if (version) {
      batch(() => {
        dispatch(tabsSliceActions.closeTab(version));
        dispatch(modelActions.deleteModeler(version));
      });
    }
  };

  const dropdownMenuContent = [
    {
      icon: <IconFileSymlink />,
      children: "Open",
      onClick: isDocument ? onOpenDocument : onOpenBpmnFile,
      display: !isProcess,
    },
    {
      icon: <IconCircleXFilled />,
      children: "Close",
      onClick: onCloseFile,
      disabled: !isOpeningInEditor,
      display: isVersion,
    },
    {
      icon: <IconAbc />,
      children: "Rename",
      onClick: openRenameModal,
      disabled: !isProcess || role !== UserRole.OWNER,
      display: isProcess,
    },
    {
      icon: <IconTrash />,
      children: "Delete",
      color: "red",
      onClick: openDeleteModal,
      disabled: isOpeningInEditor || role !== UserRole.OWNER,
    },
  ];

  const renderFile = () => {
    return (
      <Box
        component={Stack}
        className={classes.container}
        mt={isDocument ? 15 : 0}
        p="sm"
        onDoubleClick={
          isVersion
            ? onOpenBpmnFile
            : result
            ? onOpenResultFile
            : isDocument
            ? onOpenDocument
            : undefined
        }
        onClick={isProcess ? getProcessVersions : undefined}
      >
        <Grid justify="flex-start" align="center">
          {/* File name */}
          {/* <Grid.Col span={activeTab ? 3 : 5}> */}
          <Grid.Col span={3}>
            <Group spacing={10}>
              <IconFile
                height={30}
                width={30}
                strokeWidth="0.8"
                color={PRIMARY_COLOR[0]}
              />
              <Text
                size="sm"
                truncate="end"
                style={{
                  maxWidth: "80%",
                  width: "80%",
                }}
              >
                {isDocument
                  ? "readme.md"
                  : result
                  ? `${fileNameRendered}.result`
                  : isVersion
                  ? `${processName}_ver_${num}.bpmn`
                  : fileNameRendered}
              </Text>
            </Group>
          </Grid.Col>

          <Grid.Col span={3} />

          {/* Last modified */}
          {/* <Grid.Col span={result ? 7 : activeTab ? 6 : 3}> */}
          <Grid.Col span={3}>
            <Flex align="center" justify="center" h="100%">
              <Text color="dimmed" size="sm">
                {result && "Evaluated At: "}
                {new Date(lastSaved || createAt || "")?.toLocaleString()}
              </Text>
            </Flex>
          </Grid.Col>

          {!result && (
            <>
              {/* Editing badge */}
              <Grid.Col span={2}>
                <Flex justify="center">
                  {isOpeningInEditor || isProcessInEditor ? (
                    <Badge color="green" radius="sm">
                      Editing
                    </Badge>
                  ) : null}
                </Flex>
              </Grid.Col>

              {/* Dropdown menu */}
              <Grid.Col span={1}>
                <Flex justify="flex-end">
                  {variant === "general" && (
                    <DropdownMenu
                      dropdownMenuContent={
                        dropdownMenuContent as IDropdownMenuContent[]
                      }
                      disabled={isOpeningInEditor}
                    />
                  )}
                </Flex>
              </Grid.Col>
            </>
          )}
        </Grid>
      </Box>
    );
  };

  return isProcess ? (
    <Accordion.Item value={id?.toString() || ""}>
      <Accordion.Control>{renderFile()}</Accordion.Control>
      <Accordion.Panel>
        {loading ? (
          <Skeleton height={50} mt={0} radius={0} />
        ) : (
          versions.length > 0 && (
            <Stack spacing={0}>
              {versions.map((version) => (
                <FileItem
                  {...version}
                  role={role}
                  projectId={projectId}
                  processName={fileNameRendered}
                  onDeleteFile={(link) => {
                    const tempVersions = versions.filter(
                      (version) => version.xmlFileLink !== link
                    );
                    setVersions(tempVersions);
                  }}
                  key={version.xmlFileLink}
                  projectName={projectName}
                />
              ))}
            </Stack>
          )
        )}
      </Accordion.Panel>
    </Accordion.Item>
  ) : (
    renderFile()
  );
};

export default FileItem;
