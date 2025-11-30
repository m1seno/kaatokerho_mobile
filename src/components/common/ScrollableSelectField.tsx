import React, { useState } from "react";
import {
  Portal,
  Dialog,
  Button,
  TextInput,
  List,
  HelperText,
} from "react-native-paper";

export type SelectOption = {
  label: string;
  value: number | string;
};

type Props = {
  label: string;
  value: number | string | null;
  options: SelectOption[];
  onChange: (value: number | string) => void;
  error?: boolean;
  helperText?: string;
};

const ScrollableSelectField: React.FC<Props> = ({
  label,
  value,
  options,
  onChange,
  error = false,
  helperText,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? "";

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const handleSelect = (val: number | string) => {
    onChange(val);
    close();
  };

  return (
    <>
      {/* "Tekstikenttä", jota painamalla avataan dialogi */}
      <TextInput
        label={label}
        value={selectedLabel}
        onPressIn={open}
        editable={false}
        right={<TextInput.Icon icon="menu-down" />}
        error={error}
        style={{ marginBottom: 8 }}
      />

      {error && (
        <HelperText type="error">
          {helperText ?? "Tämä kenttä on pakollinen"}
        </HelperText>
      )}

      {/* Scrollattava dialogi */}
      <Portal>
        <Dialog visible={visible} onDismiss={close}>
          <Dialog.Title>{label}</Dialog.Title>
          <Dialog.ScrollArea style={{ maxHeight: 300 }}>
            <>
              {options.map((opt) => (
                <List.Item
                  key={opt.value.toString()}
                  title={opt.label}
                  onPress={() => handleSelect(opt.value)}
                />
              ))}
            </>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={close}>Sulje</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default ScrollableSelectField;