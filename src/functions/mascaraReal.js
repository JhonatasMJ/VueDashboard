

export function maskCurrency(value) {
    if (!value || value === "") return "R$ 0,00";
  
    value = value.toString().replace(/\D/g, "");
  
    if (!value) return "R$ 0,00";
  
    value = (parseFloat(value) / 100).toFixed(2);
    value = value.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
    return `R$ ${value}`;
  }
  
  
  export function unmaskCurrency(value) {
    if (typeof value !== "string") return 0;
    return parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  
  }