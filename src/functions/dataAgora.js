export const ultimoAcesso = new Date();
ultimoAcesso.setDate(ultimoAcesso.getDate() - 1); 
export const formatarData = (data) => {
  const opcoes = { year: "numeric", month: "long", day: "numeric" };
  return data.toLocaleDateString("pt-BR", opcoes);
};
export const formatarHora = (data) => {
  const opcoes = { hour: "2-digit", minute: "2-digit" };
  return data.toLocaleTimeString("pt-BR", opcoes);
};

export const dataFormatada = formatarData(ultimoAcesso);
export const horaFormatada = formatarHora(ultimoAcesso);
export const dataHoraFormatada = `${dataFormatada} às ${horaFormatada}`;
export const dataUltimoAcesso = new Date(ultimoAcesso);