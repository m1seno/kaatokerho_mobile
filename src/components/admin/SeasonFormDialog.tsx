import { useEffect, useState } from "react";
import { Season, SeasonCreateUpdate } from "../../services/seasonService";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  TextInput,
} from "react-native-paper";

type Props = {
  visible: boolean;
  editingSeason: Season | null;
  onDismiss: () => void;
  onSubmit: (data: SeasonCreateUpdate, isEdit: boolean) => void;
  submitting: boolean;
};

const emptyForm: SeasonCreateUpdate = {
  nimi: "",
  suunniteltuGpMaara: null,
  osallistujamaara: null,
};

const SeasonFormDialog: React.FC<Props> = ({
  visible,
  editingSeason,
  onDismiss,
  onSubmit,
  submitting,
}) => {
  const [formData, setFormData] = useState<SeasonCreateUpdate>(emptyForm);

  useEffect(() => {
    // Jos muokataan, täytetään kentät nykyisillä arvoilla
    if (editingSeason) {
      setFormData({
        nimi: String(editingSeason.nimi),
        suunniteltuGpMaara: editingSeason.suunniteltuGpMaara,
        osallistujamaara: editingSeason.osallistujamaara,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingSeason, visible]);

  // Tarkistetaan että kaikki kentät on täytetty
  const isFormValid = (): boolean => {
    return (
      formData.nimi.length > 0 &&
      Number(formData.suunniteltuGpMaara) > 0 &&
      Number(formData.osallistujamaara) > 0
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const payload: SeasonCreateUpdate = {
      nimi: formData.nimi.trim(),
      suunniteltuGpMaara: Number(formData.suunniteltuGpMaara),
      osallistujamaara: Number(formData.osallistujamaara),
    };

    onSubmit(payload, editingSeason !== null);
  };

  return (
    <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>
            {editingSeason ? "Muokkaa kauden tietoja" : "Lisää uusi kausi"}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={{ marginBottom: 8 }}
              label="Kauden nimi"
              placeholder="Esim. 2024-2025"
              value={formData.nimi}
              onChangeText={(text) => setFormData({ ...formData, nimi: text })}
            />
            <TextInput
              style={{ marginBottom: 8 }}
              label="Suunniteltu GP-määrä"
              value={formData.suunniteltuGpMaara?.toString() ?? ""}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  suunniteltuGpMaara: Number(text),
                })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={{ marginBottom: 8 }}
              label="Osallistujamäärä"
              value={formData.osallistujamaara?.toString() ?? ""}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  osallistujamaara: Number(text),
                })
              }
              keyboardType="numeric"
            />

            {!isFormValid() && (
              <HelperText type="error">Kaikki kentät on täytettävä</HelperText>
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

export default SeasonFormDialog;
