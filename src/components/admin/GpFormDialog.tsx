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
import { formatDateFi, toIsoFromFi } from "../../utils/date";
import ScrollableSelectField from "../common/ScrollableSelectField";
import { Keilahalli } from "../../services/keilahalliService";

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
  keilahallit: Keilahalli[];
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
  keilahallit,
}) => {
  const [formData, setFormData] = useState<GpFormValues>(emptyForm);

  useEffect(() => {
    if (editingGp) {
      setFormData({
        jarjestysnumero: Number(editingGp.jarjestysnumero),
        pvm: formatDateFi(editingGp.pvm),
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
      formData.pvm.length > 0 &&
      formData.onKultainenGp !== null
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const payload: GpFormValues = {
      jarjestysnumero: formData.jarjestysnumero,
      pvm: toIsoFromFi(formData.pvm),
      keilahalliId: formData.keilahalliId,
      onKultainenGp: formData.onKultainenGp,
    };

    onSubmit(payload, editingGp !== null);
  };

  const showJarjestysnumeroAsReadOnly = editingGp !== null;

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

          <ScrollableSelectField
            label="Keilahalli"
            value={formData.keilahalliId}
            onChange={(val) =>
              setFormData({ ...formData, keilahalliId: Number(val) })
            }
            options={keilahallit.map((h) => ({
              label: h.nimi,
              value: h.keilahalliId,
            }))}
            error={!isFormValid()}
            helperText="Valitse keilahalli"
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
