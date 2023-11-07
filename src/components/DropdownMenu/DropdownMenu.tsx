import { ActionIcon, Menu } from "@mantine/core";
import { ReactComponent as IconDots } from "@tabler/icons/icons/dots.svg";

export interface IDropdownMenuContent {
  icon: React.ReactNode | React.ReactNode[];
  children: React.ReactNode | React.ReactNode[];
  color?: string;
  onClick: (e: MouseEvent | React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  display?: boolean;
}

export interface IDropdownMenu {
  disabled?: boolean;
  dropdownMenuContent: IDropdownMenuContent[];
}

const DropdownMenu = ({
  disabled = false,
  dropdownMenuContent,
}: IDropdownMenu) => {
  return (
    <Menu
      shadow="md"
      width={300}
      position="left-start"
      styles={{
        item: {
          gap: 15,
        },
      }}
    >
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
        >
          <IconDots />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        {dropdownMenuContent &&
          dropdownMenuContent.map((item, index) => {
            const {
              icon,
              children,
              color,
              onClick,
              onMouseEnter,
              onMouseLeave,
              disabled,
              display,
            } = item;
            return (
              (display === undefined ? true : display) && (
                <Menu.Item
                  key={index}
                  icon={icon}
                  color={color}
                  onClick={onClick}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  disabled={disabled}
                >
                  {children}
                </Menu.Item>
              )
            );
          })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default DropdownMenu;
