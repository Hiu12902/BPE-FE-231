import BackButton from "@/components/BackButton";
import { Accordion, AccordionProps, Box, Group } from "@mantine/core";
import { useSurveyNavbarStyle } from "./SurveyNavbar.style";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as IconBuilder } from "@tabler/icons/icons/edit-circle.svg";
import { ReactComponent as IconConfig } from "@tabler/icons/icons/settings.svg";
import { ReactComponent as IconResult } from "@tabler/icons/icons/file-analytics.svg";

interface IProps extends Partial<AccordionProps> {}

const SurveyNavbar = (props: IProps) => {
  const { classes } = useSurveyNavbarStyle();
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/")[2];

  const NavbarContent = [
    {
      title: "Builder",
      bullet: <IconBuilder width={20} height={20} />,
      action: () => navigate(`/survey/builder`),
      style: location == "builder" && {
        backgroundColor: PRIMARY_COLOR[0],
        color: "white",
        fontWeight: 600,
      },
    },
    {
      title: "Configuration",
      bullet: <IconConfig width={20} height={20} />,
      action: () => navigate(`/survey/builder`),
      style: location == "builder" && {
        backgroundColor: PRIMARY_COLOR[0],
        color: "white",
        fontWeight: 600,
      },
    },
    {
      title: "Result",
      bullet: <IconResult width={20} height={20} />,
      action: () => navigate(`/survey/builder`),
      style: location == "builder" && {
        backgroundColor: PRIMARY_COLOR[0],
        color: "white",
        fontWeight: 600,
      },
    },
  ];

  return (
    <Box mt={35}>
      <BackButton />
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
                <Group>
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

export default SurveyNavbar;
