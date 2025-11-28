export const resaltarVariables = (texto: string) => {
  return texto.replace(
    /{{(.*?)}}/g,
    `<span style="color:#16a34a;font-weight:600">{{$&}}</span>`
  );
};
