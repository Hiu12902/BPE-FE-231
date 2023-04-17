import { Container, Stack } from '@mantine/core';
import Workspace from '@/components/Workspace';

const mockData = [
  {
    id: '1',
    name: 'Personal',
    projects: [
      {
        id: '1',
        name: 'Project 1',
        owner: 'Nguyen Van A',
        size: 39,
        lastUpdated: new Date(),
        files: [
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '1',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '2',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '3',
          },
        ],
      },
      {
        id: '2',
        name: 'Project 1',
        owner: 'Nguyen Van A',
        size: 39,
        lastUpdated: new Date(),
        files: [
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '1',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '2',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '3',
          },
        ],
      },
      {
        id: '3',
        name: 'Project 1',
        owner: 'Nguyen Van A',
        size: 39,
        lastUpdated: new Date(),
        files: [
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '1',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '2',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '3',
          },
        ],
      },
      {
        id: '4',
        name: 'Project 1',
        owner: 'Nguyen Van A',
        size: 39,
        lastUpdated: new Date(),
        files: [
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '1',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '2',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '3',
          },
        ],
      },
      {
        id: '5',
        name: 'Project 1',
        owner: 'Nguyen Van A',
        size: 39,
        lastUpdated: new Date(),
        files: [
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '1',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '2',
          },
          {
            name: 'Project-1.bpmn',
            size: 10,
            lastUpdated: new Date(),
            id: '3',
          },
        ],
      },
    ],
  },
];

const MainScreen = () => {
  return (
    <Container size="xl">
      <Stack>
        {mockData.map((workspace) => (
          <Workspace {...workspace} />
        ))}
      </Stack>
    </Container>
  );
};

export default MainScreen;
