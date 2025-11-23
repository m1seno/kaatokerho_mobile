import React, { useState } from "react";
import { Menu, IconButton } from "react-native-paper";
import { useAuthStore } from "../store/AuthStore";

const LogoutMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

    return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
        icon="dots-vertical"
        onPress={openMenu}
        />
      }
    >
      <Menu.Item
        onPress={handleLogout}
        title="Kirjaudu ulos"
        />
    </Menu>
  );
}
export default LogoutMenu;