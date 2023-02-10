import { UnstyledButton, Stack, Text, Group, Tooltip, Center } from '@mantine/core';
import { useToolbarIconStyle } from './ToolbarIcon.style';

interface IToolbarIcon {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  size: 'large' | 'small';
  orientation: 'vertical' | 'horizontal';
  label?: string;
  title: string;
}

const ToolbarIcon = ({ icon: Icon, size, orientation, label, title }: IToolbarIcon) => {
  const { classes } = useToolbarIconStyle();
  const GroupComponent = orientation === 'horizontal' ? Group : Stack;
  return (
    <Tooltip label={title} zIndex={101} position="bottom">
      <UnstyledButton className={classes.button}>
        <GroupComponent spacing={orientation === 'horizontal' ? 5 : 0}>
          <Center>
            <Icon
              width={size === 'large' ? 45 : 20}
              height={size === 'large' ? 45 : 20}
              className={classes.icon}
            />
          </Center>
          <Text size="xs" align="center" className={classes.label}>
            {label}
          </Text>
        </GroupComponent>
      </UnstyledButton>
    </Tooltip>
  );
};

export default ToolbarIcon;
