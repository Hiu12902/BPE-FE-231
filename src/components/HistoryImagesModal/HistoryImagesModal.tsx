import projectApi from '@/api/project';
import { getCurrentModeler } from '@/redux/selectors';
import {
  Badge,
  Button,
  Container,
  Flex,
  Grid,
  Modal,
  ModalProps,
  ScrollArea,
  Skeleton,
  Stack,
  createStyles,
  Text,
  Image,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import emptyEditor from '@/assets/empty-editor.png';

interface IProps extends ModalProps {}

const useStyles = createStyles(() => ({
  container: {
    width: 650,
    height: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #74b6ef',
  },

  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  },

  buttons: {
    border: '1px solid #74b6ef',
  },
}));

const HistoryImagesModal = (props: IProps) => {
  const { opened } = props;
  const { classes } = useStyles();
  const currentModeler = useSelector(getCurrentModeler);
  const [images, setImages] = useState<Array<{ imageLink: string; saveAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string>();

  const getImages = async () => {
    try {
      if (!currentModeler?.projectId || !currentModeler.processId || !currentModeler.id) {
        return;
      }
      const res = await projectApi.getHistoryImages({
        projectID: currentModeler?.projectId,
        processID: currentModeler?.processId,
        version: currentModeler?.id,
      });

      if (res) {
        setImages(res.reverse());
        setCurrentImage(res[0].imageLink);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      setCurrentImage(undefined);
      getImages();
    }
  }, [opened]);

  const renderNoModelers = () => {
    return (
      <Flex align="center" justify="center" direction="column">
        <Image src={emptyEditor} width={250} height={250} />
        <Text color="dimmed" align="center" w="50%" size="md">
          This seems like a fresh model, no history images created yet!
        </Text>
      </Flex>
    );
  };

  return (
    <Modal {...props} size="60vw" title={<Badge size="lg">History Images</Badge>}>
      {!loading && images.length === 0 ? (
        renderNoModelers()
      ) : (
        <Grid gutter="md" columns={18}>
          <Grid.Col span={4}>
            <ScrollArea h={500} mx="-xs" px="xs">
              <Stack spacing={0} className={loading ? undefined : classes.buttons}>
                {loading
                  ? [1, 2, 3, 4, 5].map((x) => <Skeleton key={x} height={30} mb={2} />)
                  : images.map((image) => (
                      <Button
                        onClick={() => setCurrentImage(image.imageLink)}
                        variant={currentImage === image.imageLink ? 'filled' : 'subtle'}
                        radius={0}
                        key={image.saveAt}
                      >
                        {new Date(image.saveAt).toLocaleString('it-IT')}
                      </Button>
                    ))}
              </Stack>
            </ScrollArea>
          </Grid.Col>
          <Grid.Col span={14}>
            <Container className={classes.container}>
              {loading ? (
                <Skeleton width="100%" height="100%" />
              ) : (
                <img
                  src={`${import.meta.env.VITE_API_URL + currentImage}`}
                  className={classes.image}
                />
              )}
            </Container>
          </Grid.Col>
        </Grid>
      )}
    </Modal>
  );
};

export default HistoryImagesModal;
