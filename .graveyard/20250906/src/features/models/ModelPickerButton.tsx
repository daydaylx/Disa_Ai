import React from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";

export interface ModelPickerButtonProps {
  label?: string;
  onOpen?: () => void;
}

export const ModelPickerButton: React.FC<ModelPickerButtonProps> = ({
  label = "Modell wählen",
  onOpen,
}) => {
  return (
    <Button variant="secondary" onClick={onOpen} aria-label="Modell wählen" leftIcon="info">
      {label}
    </Button>
  );
};
