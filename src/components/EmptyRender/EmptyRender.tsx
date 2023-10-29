import { Center, Stack, Image, Text } from "@mantine/core";
import noProjects from "@/assets/no-projects.svg";

export interface IEmptyRender {
  icon?: string | React.ReactNode;
  text?: string | React.ReactNode;
  action?: any;
}

const EmptyRender = ({ icon = noProjects, text, action }: IEmptyRender) => {
  return (
    <Stack w="100%" mt={30} mb={30}>
      <Center>
        <Image src={icon as string} width={120} opacity={0.7} />
      </Center>
      <Text align="center" color="dimmed">
        {text && text}
      </Text>
      <Center>{action && action}</Center>
    </Stack>
  );
};

export default EmptyRender;
