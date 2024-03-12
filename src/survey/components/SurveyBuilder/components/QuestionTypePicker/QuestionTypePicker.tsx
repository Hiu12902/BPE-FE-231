import { Group, Select, Text } from "@mantine/core";
import { forwardRef } from "react";

const QuestionTypeMenu = [
  {
    icon: "BR",
    label: "Branching",
    value: "branching",
    description: "Redirect to another question based on the answer",
    disabled: true,
  },
  {
    icon: "CSAT",
    label: "Customer Satisfaction",
    value: "csat",
    description: "How satisfied are you with our product?",
  },
  {
    icon: "CSAT-IN",
    label: "Customer Satisfaction - Insight",
    value: "csat-in",
    description: "Find out more information about the customer satisfaction",
  },
  {
    icon: "CES",
    label: "Customer Effort Score",
    value: "ces",
    description: "How easy was it to solve your problem?",
  },
  {
    icon: "CES-IN",
    label: "Customer Effort Score - Insight",
    value: "ces-in",
    description: "Find out more information about the customer effort score",
  },
  {
    icon: "NPS",
    label: "Net Promoter Score",
    value: "nps",
    description: "How likely are you to recommend our product?",
  },
  {
    icon: "MC",
    label: "Multiple Choice",
    value: "multiple_choice",
    description: "Choose one or more options from a list",
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  icon?: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ icon, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        {/* {icon && (
          <div
            style={{
              padding: "3px 5px",
              borderRadius: "5px",
              border: "1px solid #000",
              fontSize: "10px",
              fontWeight: "bold",
              textAlign: "center",
              width: "50px",
            }}
          >
            {icon}
          </div>
        )} */}
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

interface QuestionTypePickerProps {
  value: string;
  defaultValue?: string;
  setValue: (value: string) => void;
}

const QuestionTypePicker = (props: QuestionTypePickerProps) => {
  const { value, setValue, defaultValue } = props;
  return (
    <Select
      styles={{
        root: {
          width: "100%",
        },
        label: {
          fontWeight: "bold",
          fontSize: "16px",
        },
      }}
      value={value}
      defaultValue={defaultValue}
      placeholder="Choose question type for new question..."
      onChange={(value: string) => setValue(value)}
      label="Choose question type"
      itemComponent={SelectItem}
      data={QuestionTypeMenu}
      searchable
      maxDropdownHeight={200}
      nothingFound="No items found"
      filter={(value, item) =>
        item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
};

export default QuestionTypePicker;
