export const coeficienteVazao = (eficiencia: number): number => {
    return (1.2/(eficiencia ** 0.55));
};  

export const calculations: Record<string, (values: any) => number> = {
    coeficiente_vazao: (values) => coeficienteVazao(values.eficiencia_estimada),
  };