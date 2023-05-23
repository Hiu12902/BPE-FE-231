import { HOTKEY_MAP, TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';
import { Center, Group, Stack, Text, Title, Tooltip, UnstyledButton } from '@mantine/core';
import { useOs } from '@mantine/hooks';
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
  hotkey?: TOOLBAR_HOTKEYS;
  overflow?: boolean;
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
      overflow,
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
      <Tooltip label={<TooltipLabel />} zIndex={99999} position="bottom">
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
            <Text
              size="xs"
              align="center"
              className={cx(classes.label, {
                [classes.labelHorizon]: orientation === 'horizontal',
                [classes.labelOverFlow]: overflow,
              })}
            >
              {label}
            </Text>
          </GroupComponent>
        </UnstyledButton>
      </Tooltip>
    );
  }
);

export default ToolbarIcon;
