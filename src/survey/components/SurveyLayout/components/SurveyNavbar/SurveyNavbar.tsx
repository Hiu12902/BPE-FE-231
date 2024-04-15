import BackButton from "@/components/BackButton";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import {
  Accordion,
  AccordionProps,
  ActionIcon,
  Box,
  Group,
} from "@mantine/core";
import { ReactComponent as IconBuilder } from "@tabler/icons/icons/edit-circle.svg";
import { ReactComponent as IconResult } from "@tabler/icons/icons/file-analytics.svg";
import { ReactComponent as IconConfig } from "@tabler/icons/icons/settings.svg";
import { ReactComponent as IconQuestion } from "@tabler/icons/icons/question-circle.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useSurveyNavbarStyle } from "./SurveyNavbar.style";
import { SurveyDriver } from "@/utils/driver";

interface IProps extends Partial<AccordionProps> {}

const SurveyNavbar = (props: IProps) => {
  const { classes } = useSurveyNavbarStyle();
  const navigate = useNavigate();
  const pathname = useLocation().pathname.split("/");
  const projectId = pathname[1];
  const processId = pathname[2];
  const location = pathname[4];

  const NavbarContent = [
    {
      title: "Builder",
      bullet: <IconBuilder width={20} height={20} />,
      action: () => {
        navigate(`/${projectId}/${processId}/survey/builder`);
      },
      style: location == "builder" && {
        backgroundColor: PRIMARY_COLOR[0],
        color: "white",
        fontWeight: 600,
      },
    },
    {
      title: "Configuration",
      bullet: <IconConfig width={20} height={20} />,
      action: () => {
        navigate(`/${projectId}/${processId}/survey/configuration/general`);
      },
      style: location == "configuration" && {
        backgroundColor: PRIMARY_COLOR[0],
        color: "white",
        fontWeight: 600,
      },
    },
    {
      title: "Result",
      bullet: <IconResult width={20} height={20} />,
      action: () => {
        navigate(`/${projectId}/${processId}/survey/result`);
      },
      style: location == "result" && {
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
      {location === "builder" && (
        <ActionIcon
          variant="light"
          style={{
            border: "none",
            backgroundColor: "transparent",
            width: 45,
            height: 45,
            position: "fixed",
            bottom: 10,
          }}
          children={<IconQuestion width={50} height={50} color="white" />}
          onClick={() => {
            SurveyDriver.drive();
          }}
        />
      )}
    </Box>
  );
};

export default SurveyNavbar;
