import { UnstyledButton, Stack, Text, Group, Tooltip, Center } from '@mantine/core';
import React from 'react';
import { useToolbarIconStyle } from './ToolbarIcon.style';

interface IToolbarIcon {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  size: 'large' | 'small';
  orientation: 'vertical' | 'horizontal';
  label?: string;
  title: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ToolbarIcon = React.forwardRef<HTMLButtonElement, IToolbarIcon>(
  (
    { icon: Icon, size, orientation, label, title, disabled, active, onClick }: IToolbarIcon,
    ref
  ) => {
    const { classes, cx } = useToolbarIconStyle();
    const GroupComponent = orientation === 'horizontal' ? Group : Stack;
    return (
      <Tooltip label={title} zIndex={101} position="bottom">
        <UnstyledButton
          className={cx(classes.button, {
            [classes.buttonDisabled]: disabled,
            [classes.buttonActive]: active,
          })}
          onClick={onClick}
          ref={ref}
        >
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
  }
);

export default ToolbarIcon;
