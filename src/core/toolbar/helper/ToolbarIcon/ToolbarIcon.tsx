import { UnstyledButton, Stack, Text, Group, Tooltip, Center, Title } from '@mantine/core';
import React from 'react';
import { HOTKEY_MAP, TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';
import { useToolbarIconStyle } from './ToolbarIcon.style';
import { useOs } from '@mantine/hooks';

interface IToolbarIcon {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  size: 'large' | 'small';
  orientation: 'vertical' | 'horizontal';
  label?: string;
  title: string;
  disabled?: boolean;
  active?: boolean;
  hotkey?: TOOLBAR_HOTKEYS;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ToolbarIcon = React.forwardRef<HTMLButtonElement, IToolbarIcon>(
  (
    {
      icon: Icon,
      size,
      orientation,
      label,
      title,
      disabled,
      active,
      hotkey,
      onClick,
    }: IToolbarIcon,
    ref
  ) => {
    const { classes, cx } = useToolbarIconStyle();
    const os = useOs();
    const GroupComponent = orientation === 'horizontal' ? Group : Stack;

    const TooltipLabel = () => (
      <Stack>
        {hotkey && (
          <Title order={6} size={12}>
            {os === 'macos' ? HOTKEY_MAP[hotkey!].macOs : HOTKEY_MAP[hotkey!].windows}
          </Title>
        )}
        <Text size={12}>{title}</Text>
      </Stack>
    );

    return (
      <Tooltip label={<TooltipLabel />} zIndex={101} position="bottom">
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
