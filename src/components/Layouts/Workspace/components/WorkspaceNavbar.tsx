import { Accordion, AccordionProps, Box, Group, Text } from "@mantine/core";
import { ReactComponent as IconRequest } from "@tabler/icons/icons/git-pull-request.svg";
import { ReactComponent as IconCustomization } from "@tabler/icons/icons/triangle-square-circle.svg";
import { ReactComponent as IconMember } from "@tabler/icons/icons/user-circle.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaceNavbarStyle } from "./WorkspaceNavbar.style";
import BackButton from "@/components/BackButton";

interface IProps extends Partial<AccordionProps> {}

const WorkspaceNavbar = (props: IProps) => {
  const { workspaceId, workspaceName } = useParams();
  const { classes } = useWorkspaceNavbarStyle();
  const navigate = useNavigate();

  const NavbarContent = [
    {
      title: "Members management",
      description: "Manage your workspace members",
      bullet: <IconMember width={20} height={20} color="#eee" />,
      action: () =>
        navigate(`/management/members/${workspaceName}/${workspaceId}`),
    },
    {
      title: "Requests",
      description: "Manage requests from other users",
      bullet: <IconRequest width={20} height={20} color="#eee" />,
      action: () =>
        navigate(`/management/requests/${workspaceName}/${workspaceId}`),
    },
    {
      title: "Customization",
      description: "Customize your workspace appearance",
      bullet: <IconCustomization width={20} height={20} color="#eee" />,
      action: () =>
        navigate(`/management/customization/${workspaceName}/${workspaceId}`),
    },
  ];

  return (
    <Box mt={25}>
      <BackButton route={`/workspace/${workspaceName}/${workspaceId}`} />
      <Accordion
        chevron
        {...props}
        variant="separated"
        className={classes.accordion}
      >
        {NavbarContent.map((item, index) => {
          return (
            <Accordion.Item
              value={item.title}
              className={classes.item}
              onClick={item.action}
            >
              <Accordion.Control
                key={index}
                style={{
                  cursor: "pointer",
                }}
                className={classes.control}
              >
                <Group spacing={5}>
                  {item.bullet}
                  <Text
                    color="#eee"
                    size={15}
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </Text>
                </Group>
              </Accordion.Control>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default WorkspaceNavbar;
