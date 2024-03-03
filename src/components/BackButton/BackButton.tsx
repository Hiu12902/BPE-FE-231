import { Button, ButtonProps } from "@mantine/core";
import { ReactComponent as IconArrowLeft } from "@tabler/icons/icons/arrow-left.svg";
import { useNavigate } from "react-router-dom";

interface IButton extends ButtonProps {
  route?: string;
}

const BackButton = ({ route, fullWidth = true }: IButton) => {
  const navigate = useNavigate();

  const handleNavigateBack = () => () => {
    if (route) {
      navigate(route);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      fullWidth={fullWidth}
      variant="outline"
      styles={{
        root: {
          color: "#fff",
        },
      }}
      leftIcon={<IconArrowLeft />}
      onClick={handleNavigateBack()}
      pr={3}
      pl={3}
    >
      Back
    </Button>
  );
};

export default BackButton;
