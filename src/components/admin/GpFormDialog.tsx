// src/components/admin/GpFormDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  Portal,
  Button,
  Text,
  TextInput,
  Switch,
  HelperText,
} from "react-native-paper";
import { Gp } from "../../services/gpService";
import { formatDateFi } from "../../utils/date";

export type GpFormValues = {
  jarjestysnumero: number | null;
  pvm: string;
  keilahalliId: number | null;
  onKultainenGp: boolean;
};

type Props = {
  visible: boolean;
  editingGp: Gp | null;
  onDismiss: () => void;
  onSubmit: (values: GpFormValues, isEdit: boolean) => void;
  submitting: boolean;
};

const emptyForm: GpFormValues = {
  jarjestysnumero: null,
  pvm: "",
  keilahalliId: null,
  onKultainenGp: false,
};

const GpFormDialog: React.FC<Props> = ({
  visible,
  editingGp,
  onDismiss,
  onSubmit,
  submitting,
}) => {
  const [formData, setFormData] = useState<GpFormValues>(emptyForm);

  useEffect(() => {
    if (editingGp) {
      setFormData({
        jarjestysnumero: Number(editingGp.jarjestysnumero),
        pvm: String(formatDateFi(editingGp.pvm)),
        keilahalliId: Number(editingGp.keilahalli.keilahalliId),
        onKultainenGp: Boolean(editingGp.onKultainenGp),
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingGp, visible]);

  const isFormValid = (): boolean => {
    return (
      formData.jarjestysnumero > 0 &&
      formData.keilahalliId > 0 &&
      formData.pvm !== null &&
      formData.onKultainenGp !== null
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const payload: GpFormValues = {
  jarjestysnumero: formData.jarjestysnumero,
  pvm: formatDateFi(formData.pvm),
  keilahalliId: formData.keilahalliId,
  onKultainenGp: formData.onKultainenGp,
};

    onSubmit(payload, editingGp !== null);
  };

  const showJarjestysnumeroAsReadOnly = !!editingGp;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>
          {editingGp ? "Muokkaa GP:n tietoja" : "Lisää uusi GP"}
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            style={{ marginBottom: 8 }}
            label="Järjestysnumero"
            value={formData.jarjestysnumero?.toString() ?? ""}
            onChangeText={(text) =>
              setFormData({ ...formData, jarjestysnumero: Number(text) })
            }
            keyboardType="number-pad"
            disabled={showJarjestysnumeroAsReadOnly}
          />
          <TextInput
            label="Päivämäärä (DD.MM.YYYY)"
            value={formData.pvm}
            onChangeText={(text) => setFormData({ ...formData, pvm: text })}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Keilahalli ID"
            value={formData.keilahalliId?.toString() ?? ""}
            onChangeText={(text) =>
              setFormData({ ...formData, jarjestysnumero: Number(text) })
            }
            style={{ marginBottom: 8 }}
            keyboardType="number-pad"
          />

          <Text style={{ marginTop: 8 }}>Kultainen GP</Text>
          <Switch
            value={formData.onKultainenGp}
            onValueChange={(text) =>
              setFormData({ ...formData, onKultainenGp: text })
            }
            style={{ marginBottom: 8 }}
          />

          {!isFormValid() && (
            <HelperText type="error">
              Täytä pakolliset kentät (järjestysnumero, päivämäärä,
              keilahalliId).
            </HelperText>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={submitting}>
            Peruuta
          </Button>
          <Button
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || !isFormValid()}
          >
            Tallenna
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default GpFormDialog;
