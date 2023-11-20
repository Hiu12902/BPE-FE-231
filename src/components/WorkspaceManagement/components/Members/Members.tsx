import { membersApi, notificationApi } from "@/api/index";
import {
  MembersFormProvider,
  useMembersForm,
} from "@/components/FormContext/MembersForm";
import { DeleteModal, InviteModal } from "@/components/Modal";
import useNotification from "@/hooks/useNotification";
import { IMembers, IPagination, IQueryParams } from "@/interfaces/index";
import { getCurrentUser, getWorkspaceMembers } from "@/redux/selectors";
import { membersActions, notificationActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { Box, Button, Container, Group, Select, Title } from "@mantine/core";
import { ReactComponent as IconSave } from "@tabler/icons/icons/check.svg";
import { ReactComponent as IconSelect } from "@tabler/icons/icons/chevron-down.svg";
import { ReactComponent as IconPlus } from "@tabler/icons/icons/plus.svg";
import { ReactComponent as IconDelete } from "@tabler/icons/icons/trash.svg";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useMembersStyle } from "./Members.style";
import { Filter, Table } from "./components";
import ContextForm from "./components/ContextForm/ContextForm";

interface IAssignPermissions {
  [id: number]: { permission: string; name: string };
}

const Members = () => {
  const notify = useNotification();
  const dispatch = useAppDispatch();
  const { classes } = useMembersStyle();
  const [result, setResult] = useState(true);
  const currentUser = useSelector(getCurrentUser);
  const members = useSelector(getWorkspaceMembers);
  const { workspaceId, workspaceName } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [openShareModal, setOpenShareModal] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<IMembers[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const membersMap = Object.values(members).sort((a, b) => a.offset - b.offset);
  const [selectionPermission, setSelectionPermission] = useState<string | null>(
    ""
  );
  const permissions = [
    {
      value: "editor",
      label: "Can edit",
    },
    {
      value: "sharer",
      label: "Can share",
    },
    {
      value: "viewer",
      label: "Can view",
    },
  ];
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 10,
    total: 30,
  });
  const [queryParams, setQueryParams] = useState<IQueryParams>({});
  const form = useMembersForm({
    initialValues: {
      searchValue: "",
    },
  });
  const searchValue = form.values.searchValue;

  const onCancelSearchMembers = () => {
    form.reset();
    setIsSearching(false);
    onReturnDefaultState();
  };

  const onReturnDefaultState = () => {
    setLoading(true);
    setSearchLoading(true);

    dispatch(membersActions.clearMembers());
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
    onReturnDefaultState();
  };

  const getAllWorkspaceMembers = async (queryFilter?: IQueryParams) => {
    try {
      const members = await membersApi.getAllWorkspaceMembers(
        Number(workspaceId),
        {
          ...(queryFilter ? queryFilter : queryParams),
          keyword: searchValue,
          page:
            queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
        }
      );
      setPagination({
        ...pagination,
        page: queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
        total: members.total,
        limit: members.limit,
      });
      if (members) {
        batch(() => {
          members.data.map((member: IMembers, index: number) =>
            dispatch(
              membersActions.setMembers({
                ...member,
                offset: index,
              })
            )
          );
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
      setIsSearching(false);
    }
  };

  const onQueryFilter = async (queryFilter: IQueryParams) => {
    try {
      setLoading(true);
      setQueryParams(queryFilter);
      dispatch(membersActions.clearMembers());
      getAllWorkspaceMembers(queryFilter);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSelectedMembersPermission = async () => {
    const permission = selectionPermission;
    try {
      if (permission && workspaceId && selectedRecords.length > 0) {
        const result = await membersApi.changeSelectedMembersPermission({
          workspaceId: workspaceId.toString(),
          permission: selectionPermission,
          memberIdList: selectedRecords.map((record) =>
            record.memberId.toString()
          ),
        });

        if (result) {
          result.map((item: IMembers, index: number) => {
            dispatch(
              membersActions.setMembers({
                ...item,
                offset: -1 - index,
              })
            );
          });
          notify({
            type: "success",
            message: result.message,
            title: "Success",
          });
        }
      } else {
        notify({
          type: "error",
          message: "Please select a permission",
          title: "Error",
        });
      }
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message:
          "Something went wrong while changing permission of selected members",
        title: "Error",
      });
    } finally {
      setSelectedRecords([]);
    }
  };

  const onDeleteSelectedMembers = async (id?: number, idList?: number[]) => {
    try {
      if ((id || idList) && workspaceId) {
        const result = await membersApi.deleteMembers({
          workspaceId: workspaceId.toString(),
          memberIdList: idList
            ? idList.map((id) => id.toString())
            : id
            ? [id.toString()]
            : [],
        });
        if (result) {
          if (id) {
            dispatch(
              membersActions.deleteMembers({
                memberId: id,
              })
            );
          } else if (idList) {
            batch(() => {
              idList.map((id) =>
                dispatch(
                  membersActions.deleteMembers({
                    memberId: id,
                  })
                )
              );
            });
          }
          notify({
            type: "success",
            message: "Members deleted successfully",
            title: "Success",
          });
        }
      }
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: "Something went wrong while deleting selected members",
        title: "Error",
      });
    } finally {
      setSelectedRecords([]);
    }
  };

  const onSendInviteNotification = async (
    assignPermissions: IAssignPermissions
  ) => {
    try {
      if (Object.keys(assignPermissions).length > 0) {
        const payload = Object.keys(assignPermissions).map((id) => ({
          memberId: Number(id),
          permission: assignPermissions[Number(id)].permission,
        }));
        if (payload && workspaceId) {
          payload.map(async (item) => {
            const result = await notificationApi.sendInvitationNotification({
              workspaceId: Number(workspaceId),
              content: `User ${currentUser.name} has invited you to join workspace ${workspaceName} with permission ${item.permission}`,
              id: item.memberId,
              permission: item.permission,
            });
            if (result) {
              dispatch(
                notificationActions.setNotification({
                  ...result,
                  offset: -1,
                })
              );
            } else {
              setResult(false);
            }
          });
          if (result)
            notify({
              title: "Success!",
              message: "Invite user to workspace successfully!",
              type: "success",
            });
        }
      } else {
        notify({
          title: "Error!",
          message: "Permission is required!",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Error!",
        message: "Can not invite user to workspace",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (searchLoading) {
      getAllWorkspaceMembers();
    }
  }, [isSearching, searchLoading, pagination.page]);

  return (
    <Container size="xl">
      <Title order={1}>Members management</Title>
      <Group spacing={10} align="center" position="apart" mt={20}>
        <MembersFormProvider form={form}>
          <form
            onSubmit={form.onSubmit(() => {
              if (searchValue.length === 0) {
                onCancelSearchMembers();
                return;
              }
              onReturnDefaultState();
              setIsSearching(true);
            })}
            className={classes.form}
          >
            <ContextForm
              onCancel={onCancelSearchMembers}
              placeholder="Search members name, etc."
            />
          </form>
        </MembersFormProvider>
      </Group>

      <Group my={20} position="apart">
        <InviteModal
          opened={openShareModal as boolean}
          onClose={() => setOpenShareModal(false)}
          workspaceId={Number(workspaceId)}
          onInvite={onSendInviteNotification}
          permission={"owner"}
        />

        <DeleteModal
          title="Delete members from workspace"
          message="Are you sure you want to delete selected members from workspace?"
          opened={openDeleteModal as boolean}
          onClose={() => setOpenDeleteModal(false)}
          objectIdList={selectedRecords.map((record) => record.memberId)}
          onDelete={onDeleteSelectedMembers}
        />
        <Group spacing={15}>
          <Button
            leftIcon={<IconDelete className={classes.buttonIcon} />}
            onClick={() => setOpenDeleteModal(true)}
            color="red"
            variant="outline"
            display={selectedRecords?.length === 0 ? "none" : "flex"}
            children="Delete"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "30%",
            }}
          >
            <Select
              display={selectedRecords?.length === 0 ? "none" : "flex"}
              rightSection={<IconSelect width={20} height={20} color="#ccc" />}
              className={classes.select}
              data={permissions}
              placeholder={"Permission"}
              value={selectionPermission}
              onChange={setSelectionPermission}
            />
          </Box>
          <Button
            display={selectedRecords?.length === 0 ? "none" : "flex"}
            leftIcon={<IconSave className={classes.buttonIcon} />}
            onClick={() => onChangeSelectedMembersPermission()}
            className={classes.button}
            children="Save"
          />
        </Group>

        <Group>
          <Button
            display="flex"
            leftIcon={<IconPlus className={classes.buttonIcon} />}
            onClick={() => setOpenShareModal(true)}
            children="Invite"
            className={classes.button}
          />
          <Filter onQueryFilter={onQueryFilter} />
        </Group>
      </Group>

      <Table
        selectedRecords={selectedRecords}
        setSelectedRecords={(selectedRecords: IMembers[]) =>
          setSelectedRecords(selectedRecords)
        }
        rows={membersMap}
        isLoading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Members;
