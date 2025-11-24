// ChatGPT:n tekemiä apufunktioita päivämäärien muotoiluun

// Pelkkä päivämäärä muodossa "DD.MM"
export const formatDayMonthFi = (isoDate: string): string => {
  if (!isoDate) return "";

  const d = new Date(isoDate);
  if (isNaN(d.getTime())) {
    // Jos backend antaa esim. vain "2025-11-26" ilman aikaa,
    // Date-parsaus toimii silti, mutta fallback varmuuden vuoksi:
    const parts = isoDate.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}.${month}`;
    }
    return isoDate;
  }

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");

  return `${day}.${month}`;
};

// Pelkkä päivämäärä muodossa "DD.MM.YYYY"
export const formatDateFi = (isoDate: string): string => {
  if (!isoDate) return "";

  const d = new Date(isoDate);
  if (isNaN(d.getTime())) {
    // Jos backend antaa esim. vain "2025-11-26" ilman aikaa,
    // Date-parsaus toimii silti, mutta fallback varmuuden vuoksi:
    const parts = isoDate.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}.${month}.${year}`;
    }
    return isoDate;
  }

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
};

// Päivämäärä ja aika muodossa "DD.MM.YYYY klo HH.MM"
export const formatDateTimeFi = (isoDateTime: string): string => {
  if (!isoDateTime) return "";

  const d = new Date(isoDateTime);
  if (isNaN(d.getTime())) {
    return isoDateTime;
  }

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} klo ${hours}.${minutes}`;
};