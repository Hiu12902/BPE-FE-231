import { Button, ButtonProps } from '@mantine/core';
import { ReactComponent as IconArrowLeft } from '@tabler/icons/icons/arrow-left.svg';
import { useNavigate } from 'react-router-dom';

const BackButton = (props: ButtonProps) => {
  const { fullWidth = true } = props;
  const navigate = useNavigate();

  return (
    <Button
      fullWidth={fullWidth}
      style={{ backgroundColor: 'white', color: 'black' }}
      variant="filled"
      leftIcon={<IconArrowLeft />}
      onClick={() => navigate('/')}
      pr={3}
      pl={3}
    >
      Back to Projects
    </Button>
  );
};

export default BackButton;
