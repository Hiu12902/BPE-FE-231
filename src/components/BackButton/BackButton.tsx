import { Button } from '@mantine/core';
import { ReactComponent as IconArrowLeft } from '@tabler/icons/icons/arrow-left.svg';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      fullWidth
      style={{ backgroundColor: 'white', color: 'black' }}
      variant="filled"
      leftIcon={<IconArrowLeft />}
      onClick={() => navigate('/')}
    >
      Back to Projects
    </Button>
  );
};

export default BackButton;
