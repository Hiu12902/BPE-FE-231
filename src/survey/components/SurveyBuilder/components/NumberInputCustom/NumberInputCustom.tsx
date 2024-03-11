import {
  ActionIcon,
  Group,
  NumberInput,
  NumberInputHandlers,
  NumberInputProps,
} from "@mantine/core";
import { useRef } from "react";

interface NumberInputCustomProps extends NumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

const NumberInputCustom = (props: NumberInputCustomProps) => {
  const {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    decimalSeparator = ",",
    precision = 0,
    label,
  } = props;
  const inputRef = useRef<NumberInputHandlers>();
  return (
    <Group spacing={5}>
      <ActionIcon
        size={30}
        radius={100}
        variant="default"
        onClick={() => inputRef.current?.decrement()}
      >
        -
      </ActionIcon>

      <NumberInput
        hideControls
        label={label}
        value={value}
        onChange={onChange}
        handlersRef={inputRef}
        max={max}
        min={min}
        step={step}
        decimalSeparator={decimalSeparator}
        defaultValue={min ? min : 0}
        precision={precision}
        styles={{
          input: { width: 50, textAlign: "center", padding: 5 },
        }}
      />

      <ActionIcon
        size={30}
        radius={100}
        variant="default"
        onClick={() => inputRef.current?.increment()}
      >
        +
      </ActionIcon>
    </Group>
  );
};

export default NumberInputCustom;
