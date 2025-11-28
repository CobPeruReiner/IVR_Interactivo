export const insertarEnCursor = (
  textarea: HTMLTextAreaElement,
  textoActual: string,
  textoAInsertar: string
) => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  return (
    textoActual.substring(0, start) +
    textoAInsertar +
    textoActual.substring(end)
  );
};
