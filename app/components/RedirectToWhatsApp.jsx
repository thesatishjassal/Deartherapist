import * as React from "react";
import { Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const RedirectToWhatsApp = ({ client }) => {
  const handleWhatsAppRedirect = () => {
    const phone = client?.mobile;
    if (phone) {
      const url = `https://api.whatsapp.com/send?phone=${phone}`;
      window.open(url, "_blank");
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<WhatsAppIcon />}
      onClick={handleWhatsAppRedirect}
    >
      WhatsApp
    </Button>
  );
};

export default RedirectToWhatsApp;
