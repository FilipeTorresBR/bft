export const coeficienteVazao = (eficiencia: number): number => {
    return (1.2/(eficiencia ** 0.55));
};  

export const coeficienteAltura = (eficiencia: number): number => {
    return (1.2/(eficiencia ** 1.1));
};  

export const fluxo = (fluxo_valvula: number, coeficiente_vazao:number): number => {
    return (fluxo_valvula/coeficiente_vazao);
};  

export const altura = (altura_valvula: number, coeficiente_altura:number): number => {
    return (altura_valvula/coeficiente_altura);
};
export const rotacao = (rotacao_rpm: number): number => {
    return (rotacao_rpm / 60);
};  

export const velocidadeEspecifica = (rotacao_rps: number, fluxo_bomba_m3s:number, altura_bomba:number): number => {
    return (rotacao_rps * Math.pow(fluxo_bomba_m3s, 0.5))/Math.pow((9.81*altura_bomba), 0.75)
};  

export const calculations: Record<string, (values: any) => number> = {
    coeficiente_vazao: (values) => coeficienteVazao(values.eficiencia_estimada),
    coeficiente_altura: (values) => coeficienteAltura(values.eficiencia_estimada),
    fluxo_bomba_m3s: (values) => fluxo(values.fluxo_valvula, values.coeficiente_vazao),
    fluxo_bomba_m3h: (values) => (fluxo(values.fluxo_valvula, values.coeficiente_vazao) * 3600),
    altura_bomba: (values) => altura(values.altura_valvula, values.coeficiente_altura),
    rotacao_rps: (values) => rotacao(values.rotacao_rpm),
    velocidade_especifica_rps: (values) => velocidadeEspecifica(values.rotacao_rps, values.fluxo_bomba_m3s, values.altura_bomba),
    velocidade_especifica_rad: (values) => (velocidadeEspecifica(values.rotacao_rps, values.fluxo_bomba_m3s, values.altura_bomba) * 2* Math.PI),
  };