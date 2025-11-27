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
import {
  Keilaaja,
  KeilaajaCreate,
  KeilaajaUpdate,
} from "../../services/keilaajaService";
import DialogActions from "react-native-paper/lib/typescript/components/Dialog/DialogActions";

const emptyForm: KeilaajaCreate = {
  etunimi: "",
  sukunimi: "",
  syntymapaiva: "",
  aktiivijasen: false,
  admin: false,
  kayttajanimi: "",
  salasana: "",
};

// Propsien tyyppimäärittely
type Props = {
  visible: boolean;
  editingKeilaaja: Keilaaja | null;
  onDismiss: () => void;
  onSubmit: (
    keilaajaData: KeilaajaCreate | KeilaajaUpdate,
    isEdit: boolean
  ) => void;
  submitting: boolean;
};

const KeilaajaFormDialog: React.FC<Props> = ({
  visible,
  editingKeilaaja,
  onDismiss,
  onSubmit,
  submitting,
}) => {
  const [formData, setFormData] = useState<KeilaajaCreate | KeilaajaUpdate>(
    emptyForm
  );

  useEffect(() => {
    if (editingKeilaaja) {
      setFormData({
        etunimi: editingKeilaaja.etunimi,
        sukunimi: editingKeilaaja.sukunimi,
        syntymapaiva: editingKeilaaja.syntymapaiva,
        aktiivijasen: editingKeilaaja.aktiivijasen,
        admin: editingKeilaaja.admin,
        kayttajanimi: editingKeilaaja.kayttajanimi,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingKeilaaja, visible]);

  const isFormValid = (): boolean => {
    return (
      formData.etunimi.trim().length > 0 &&
      formData.sukunimi.trim().length > 0 &&
      formData.kayttajanimi.trim().length > 0
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(formData, editingKeilaaja !== null);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>
          {editingKeilaaja ? "Muokkaa keilaajaa" : "Lisää keilaaja"}
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Etunimi"
            value={formData.etunimi}
            onChangeText={(text) => setFormData({ ...formData, etunimi: text })}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Sukunimi"
            value={formData.sukunimi}
            onChangeText={(text) =>
              setFormData({ ...formData, sukunimi: text })
            }
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Syntymäpäivä (DD.MM.YYYY)"
            value={formData.syntymapaiva}
            onChangeText={(text) =>
              setFormData({ ...formData, syntymapaiva: text })
            }
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Käyttäjänimi"
            value={formData.kayttajanimi}
            onChangeText={(text) =>
              setFormData({ ...formData, kayttajanimi: text })
            }
            style={{ marginBottom: 8 }}
          />
          <Text style={{ marginTop: 8 }}>Aktiivijäsen</Text>
          <Switch
            value={formData.aktiivijasen}
            onValueChange={(value) =>
              setFormData({ ...formData, aktiivijasen: value })
            }
            style={{ marginBottom: 8 }}
          />
          <Text style={{ marginTop: 8 }}>Admin</Text>
          <Switch
            value={formData.admin}
            onValueChange={(value) =>
              setFormData({ ...formData, admin: value })
            }
            style={{ marginBottom: 8 }}
          />
          {!editingKeilaaja && (
            <TextInput
              label="Salasana"
              value={(formData as KeilaajaCreate).salasana || ""}
              onChangeText={(text) =>
                setFormData({ ...(formData as KeilaajaCreate), salasana: text })
              }
              secureTextEntry
              style={{ marginBottom: 8 }}
            />
          )}

          {!isFormValid() && (
            <HelperText type="error">Kaikki kentät ovat pakollisia!</HelperText>
          )}
        </Dialog.Content>
        <DialogActions>
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
        </DialogActions>
      </Dialog>
    </Portal>
  );
};

export default KeilaajaFormDialog;