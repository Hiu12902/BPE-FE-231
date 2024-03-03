import { forwardRef } from "react";
import { Group, Avatar, Text, Select } from "@mantine/core";

const data = [
  {
    icon: "CSAT",
    label: "Customer Satisfaction",
    value: "CSAT",
    description: "How satisfied are you with our product?",
  },

  {
    icon: "CES",
    label: "Customer Effort Score",
    value: "CES",
    description: "How easy was it to solve your problem?",
  },
  {
    icon: "NPS",
    label: "Net Promoter Score",
    value: "NPS",
    description: "How likely are you to recommend our product?",
  },
  {
    icon: "MC",
    label: "Multiple Choice",
    value: "MC",
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
        {icon && (
          <div
            style={{
              padding: "3px 5px",
              borderRadius: "5px",
              border: "1px solid #000",
              fontSize: "10px",
              fontWeight: "bold",
              textAlign: "center",
              width: "40px",
            }}
          >
            {icon}
          </div>
        )}

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

const QuestionTypePicker = () => {
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
      label="Choose question type"
      placeholder="Pick one"
      itemComponent={SelectItem}
      data={data}
      searchable
      maxDropdownHeight={400}
      nothingFound="Nobody here"
      filter={(value, item) =>
        item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
};

export default QuestionTypePicker;
