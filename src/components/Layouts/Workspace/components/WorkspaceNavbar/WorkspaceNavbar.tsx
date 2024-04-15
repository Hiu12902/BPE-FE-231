import BackButton from "@/components/BackButton";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { Accordion, AccordionProps, Box, Group } from "@mantine/core";
import { ReactComponent as IconProcessPortfolio } from "@tabler/icons/icons/chart-bubble.svg";
import { ReactComponent as IconRequest } from "@tabler/icons/icons/git-pull-request.svg";
import { ReactComponent as IconMember } from "@tabler/icons/icons/user-circle.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useWorkspaceNavbarStyle } from "./WorkspaceNavbar.style";

interface IProps extends Partial<AccordionProps> {}

const WorkspaceNavbar = (props: IProps) => {
  const { workspaceId, workspaceName } = useParams();
  const { classes } = useWorkspaceNavbarStyle();
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/")[2];

  const NavbarContent = [
    {
      title: "Members management",
      description: "Manage your workspace members",
      bullet: <IconMember width={20} height={20} />,
      action: () =>
        navigate(`/management/members/${workspaceName}/${workspaceId}`),
      style: location === "members" && {
        backgroundColor: PRIMARY_COLOR[0],
        color: "white",
        fontWeight: 600,
      },
    },
    {
      title: "Requests",
      description: "Manage requests from other users",
      bullet: <IconRequest width={20} height={20} />,
      action: () =>
        navigate(`/management/requests/${workspaceName}/${workspaceId}`),
      style: location === "requests" && {
        backgroundColor: PRIMARY_COLOR[0],
        color: "white",
        fontWeight: 600,
      },
    },
    // {
    //   title: "Customization",
    //   description: "Customize your workspace appearance",
    //   bullet: <IconCustomization width={20} height={20} />,
    //   action: () =>
    //     navigate(`/management/customization/${workspaceName}/${workspaceId}`),
    //   style: location === "customization" && {
    //     backgroundColor: PRIMARY_COLOR[0],
    //     color: "white",
    //     fontWeight: 600,
    //   },
    // },
    {
      title: "Process Portfolio",
      description: "Process portfolio",
      bullet: <IconProcessPortfolio width={20} height={20} />,
      action: () =>
        navigate(
          `/management/processportfolio/${workspaceName}/${workspaceId}`
        ),
      style: location === "processportfolio" && {
        backgroundColor: PRIMARY_COLOR[0],
        color: "white",
        fontWeight: 600,
      },
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
                style={item.style || undefined}
                className={classes.control}
              >
                <Group spacing={5}>
                  {item.bullet}
                  {item.title}
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
