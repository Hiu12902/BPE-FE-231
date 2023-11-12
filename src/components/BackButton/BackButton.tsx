import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { Button, ButtonProps } from "@mantine/core";
import { ReactComponent as IconArrowLeft } from "@tabler/icons/icons/arrow-left.svg";
import { useNavigate } from "react-router-dom";

interface IButton extends ButtonProps {
  route?: string;
}

const BackButton = ({ route, fullWidth = true }: IButton) => {
  const navigate = useNavigate();

  return (
    <Button
      fullWidth={fullWidth}
      variant="outline"
      styles={{
        root: {
          backgroundColor: PRIMARY_COLOR[1],
          border: "1px solid white",
          "&:hover": {
            backgroundColor: "#1980D9",
          },
        },
        inner: {
          color: "#fff",
        },
      }}
      leftIcon={<IconArrowLeft />}
      onClick={() => navigate(route ? route : "/")}
      pr={3}
      pl={3}
    >
      Back
    </Button>
  );
};

export default BackButton;
