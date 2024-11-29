var dados = []
function applyChanges(affectedsRows){
    for (const [key, value] of Object.entries(affectedsRows)) {
        document.getElementById(`${key}`).value=`${value.toPrecision(4)}`
    }
}
function getter(item){
    let value = document.getElementById(item).value == "" ? undefined : document.getElementById(item).value
    return parseFloat(value)
}
function fluxoValvula(){
    return document.getElementById('fluxo_valvula').value 
}
function eficiencia(eficiencia_obj){
    let eficiencia = ((eficiencia_obj.value).indexOf(",")) ? (eficiencia_obj.value).replace(",", ".") : eficiencia_obj.value
    let input_field = eficiencia_obj.id == "eficiencia_estimada" ? "bomba" : "turbina";
    coeficienteVazao(eficiencia, input_field)
    coeficienteAltura(eficiencia, input_field)
    fluxo(input_field)
    altura(input_field)
    velocidadeEspecifica(input_field)
}
function coeficienteVazao(eficiencia, input_field){
    let coeficiente_vazao;
    if(input_field != "turbina_mpe"){
        coeficiente_vazao = ((1.2)/Math.pow(eficiencia, 0.55))
    }else{
        coeficiente_vazao = (getter("fluxo_turbina_m3s") / ((getter('rotacao_bomba_rps')) * (Math.pow(getter('diametro_bomba'), 3))))
    }

    applyChanges({["coeficiente_vazao_"+input_field]:coeficiente_vazao})
}
function coeficienteAltura(eficiencia, input_field){
    let coeficiente_altura = ((1.2)/Math.pow(eficiencia, 1.1))
    applyChanges({["coeficiente_altura_"+input_field]:coeficiente_altura})
}
function fluxo(input_field){
    let fluxo_m3s
    let fluxo_m3h
    if(input_field == "bomba"){
        fluxo_m3s = getter('fluxo_valvula') / getter('coeficiente_vazao_bomba')
    }
    if(input_field == "turbina"){
        fluxo_m3s = getter('fluxo_bomba_m3s') * getter('coeficiente_vazao_turbina')
    }
    fluxo_m3h = fluxo_m3s * 3600
    applyChanges({["fluxo_"+input_field+"_m3s"]:fluxo_m3s, ["fluxo_"+input_field+"_m3h"]:fluxo_m3h})
}
function altura(input_field){
    let altura;
    if(input_field == "bomba"){
        altura = getter('altura_valvula') / getter('coeficiente_altura_bomba')
    }
    if(input_field == "turbina"){
        altura = getter('altura_bomba') * getter('coeficiente_altura_turbina')
    }
    applyChanges({["altura_"+input_field]:altura})
}
function rotacaoBomba(rotacao_bomba_rpm){
    rotacao_bomba_rpm = parseInt(rotacao_bomba_rpm)
    let rotacao_bomba_rps = rotacao_bomba_rpm / 60
    console.log(rotacao_bomba_rpm, rotacao_bomba_rps)
    applyChanges({"rotacao_bomba_rpm":rotacao_bomba_rpm, "rotacao_bomba_rps":rotacao_bomba_rps})
    velocidadeEspecifica("bomba")
}
function velocidadeEspecifica(input_field){
    let rotacao_bomba_rps = getter('rotacao_bomba_rps')
    let fluxo_m3s = getter('fluxo_'+input_field+'_m3s')
    let altura = getter('altura_'+input_field);
    let velocidade_especifica_rps
    let velocidade_especifica_rad
    if(rotacao_bomba_rps != undefined && fluxo_m3s != undefined && altura != undefined){
        if(input_field == "bomba"){
            velocidade_especifica_rps = (rotacao_bomba_rps * Math.pow(fluxo_m3s, 0.5))/Math.pow((9.81*altura), 0.75)
        }
        if(input_field == "turbina"){
            velocidade_especifica_rps = (rotacao_bomba_rps * Math.pow(fluxo_m3s, 0.5))/Math.pow((9.81*altura), 0.75)
            mpe()
        }
        velocidade_especifica_rad = 2*Math.PI*velocidade_especifica_rps
        applyChanges({["velocidade_especifica_"+input_field+"_rps"]:velocidade_especifica_rps, ["velocidade_especifica_"+input_field+"_rad"]:velocidade_especifica_rad})
    }
}
function mpe(){
    let coeficiente_vazao_turbina_mpe = ((getter('fluxo_turbina_m3s')) / ((getter('rotacao_bomba_rps')) * (Math.pow(getter('diametro_bomba'), 3))))
    let coeficiente_altura_turbina_mpe = (9.81*getter('altura_turbina')) / Math.pow((getter('rotacao_bomba_rps') * getter('diametro_bomba')), 2)
    applyChanges({"coeficiente_altura_turbina_mpe":coeficiente_altura_turbina_mpe, "coeficiente_vazao_turbina_mpe":coeficiente_vazao_turbina_mpe})
    console.log("mpe")
    rossi()
}
function rossi(){
    let fluxo_bft = [] //fi
    let pressao_bft = [] //psi
    let eficiencia_bft = [] //eta
    let vazao_ls_bft = [] //qt
    let altura_bft = [] //altura_bft
    let coeficiente_vazao_turbina_mpe = getter('coeficiente_vazao_turbina_mpe')
    let coeficiente_altura_turbina_mpe = getter('coeficiente_altura_turbina_mpe')
    let rotacao_bomba_rps = getter('rotacao_bomba_rps')
    let rotacao_bomba_rpm = getter('rotacao_bomba_rpm')
    let diametro_bomba = getter('diametro_bomba')
    let eficiencia_real = getter('eficiencia_real')

    fluxo_bft.push(0.064)

    for(let x = 1; x<60;x++){
        fluxo_bft.push(fluxo_bft[x - 1] + 0.003)
    }


    for (x = 0; x<fluxo_bft.length; x++){
        pressao_bft.push(coeficiente_altura_turbina_mpe*(0.2394*Math.pow(fluxo_bft[x]/coeficiente_vazao_turbina_mpe, 2) + 0.769*(fluxo_bft[x]/coeficiente_vazao_turbina_mpe)))
        eficiencia_bft.push(((-1.9788*(Math.pow(fluxo_bft[x]/coeficiente_vazao_turbina_mpe, 6)))+(9.0636*(Math.pow(fluxo_bft[x]/coeficiente_vazao_turbina_mpe, 5)))-(13.148*(Math.pow(fluxo_bft[x]/coeficiente_vazao_turbina_mpe, 4)))+(3.8527*(Math.pow(fluxo_bft[x]/coeficiente_vazao_turbina_mpe, 3)))+(4.5614*(Math.pow(fluxo_bft[x]/coeficiente_vazao_turbina_mpe, 2)))-(1.3769*((fluxo_bft[x]/coeficiente_vazao_turbina_mpe))))*(eficiencia_real))
        vazao_ls_bft.push((((fluxo_bft[x])*((rotacao_bomba_rps)*(Math.pow(diametro_bomba, 3))))*1000))
        altura_bft.push((pressao_bft[x]* Math.pow(rotacao_bomba_rps * diametro_bomba, 2)) / 9.81)
    }
    if (Object.values(dados).length === 0) {
        dados.push({'fluxo_bft':fluxo_bft, 'pressao_bft':pressao_bft, 'eficiencia_bft':eficiencia_bft, 'vazao_ls_bft': vazao_ls_bft, 'altura_bft' : altura_bft, 'rotacao_bomba_rpm' : rotacao_bomba_rpm})    
        $("#dados_listar").append("<li id=li_"+dados.length+" class='list'>Linha "+rotacao_bomba_rpm+" <button type='button' style='background-color: transparent; border: none;' onclick='deleteFromList("+ dados.length+")'><img class='icon' src='assets/img/trash.png'></button></li>");
    }else if(JSON.stringify(Object.values(dados[dados.length - 1])) !== JSON.stringify(Object.values({'fluxo_bft':fluxo_bft, 'pressao_bft':pressao_bft, 'eficiencia_bft':eficiencia_bft, 'vazao_ls_bft': vazao_ls_bft, 'altura_bft' : altura_bft}))){
        dados.push({'fluxo_bft':fluxo_bft, 'pressao_bft':pressao_bft, 'eficiencia_bft':eficiencia_bft, 'vazao_ls_bft': vazao_ls_bft, 'altura_bft' : altura_bft, 'rotacao_bomba_rpm' : rotacao_bomba_rpm})
        $("#dados_listar").append("<li id=li_"+dados.length+" class='list'>Linha "+rotacao_bomba_rpm+" <button type='button' style='background-color: transparent; border: none;' onclick='deleteFromList("+ dados.length+")'><img class='icon' src='assets/img/trash.png'></button></li>");
    }
    console.log(fluxo_bft, pressao_bft, eficiencia_bft, vazao_ls_bft, altura_bft)
    grafico(fluxo_bft, pressao_bft, eficiencia_bft, vazao_ls_bft, altura_bft, dados)
}

function grafico(fluxo_bft, pressao_bft, eficiencia_bft, vazao_ls_bft, altura_bft, dados){
    let layout_placeholder = {
        xaxis: {
            showgrid: false,
            showspikes: true,
            spikedash: "solid",
            spikemode: "across",
            ticks: "inside",
            mirror: true,
            linecolor: 'black',
            linewidth: 1,
        },
        yaxis: {
            showgrid: false,
            showspikes: true,
            spikedash: "solid",
            spikemode: "across",
            ticks: "inside",
            mirror: true,
            linecolor: 'black',
            linewidth: 1,
        },
        showlegend: true,
        legend: {
            x: 1.3,
            xanchor: 'right',
            y: 1
          },
        paper_bgcolor: "#fcfcfc",
    }
    tipo = document.querySelector('input[name="tipo"]:checked').value;
    var layout = layout_placeholder;
    data = []
    switch(tipo){
        case "fi_t_psi_t":
            console.log("switch")
            for(let x = 0; x < dados.length; x++){
                data.push({
                    x: dados[x]['fluxo_bft'],
                    y: dados[x]['pressao_bft'],
                    name: dados[x]['rotacao_bomba_rpm'],
                    line: {shape: 'spline'},
                })
            }
            layout.title = 'Relação do fluxo pela pressão';
            layout.xaxis.title = 'Φ';
            layout.yaxis.title = 'Ψ';
            layout.xaxis.range = [0.8 * Math.min(...fluxo_bft), 1.1 * Math.max(...fluxo_bft)];
            layout.yaxis.range = [0.8 * Math.min(...pressao_bft), 1.1 * Math.max(...pressao_bft)];
            break;
        case "fi_t_eta_t":
            for(let x = 0; x < dados.length; x++){
                data.push({
                    x: dados[x]['fluxo_bft'],
                    y: dados[x]['eficiencia_bft'],
                    name: 'fluxo/eficiencia',
                    line: {shape: 'spline'},
                })
            }
            layout.title = 'Relação do fluxo pela eficiencia',
            layout.xaxis.title = 'Φ';
            layout.yaxis.title = 'η';
            layout.xaxis.range = [0.8 * Math.min(...fluxo_bft), 1.1 * Math.max(...fluxo_bft)];
            layout.yaxis.range = [0.8 * Math.min(...eficiencia_bft), 1.1 * Math.max(...eficiencia_bft)];
            break;
        case "qtls_hm":
            for(let x = 0; x < dados.length; x++){
                data.push({
                    x: dados[x]['vazao_ls_bft'],
                    y: dados[x]['altura_bft'],
                    name: 'vazão/altura',
                    line: {shape: 'spline'},
                })
            }
            layout.title = 'Relação da vazão pela altura',
            layout.xaxis.title = 'Qt [ls]';
            layout.yaxis.title = 'H [m]';
            layout.xaxis.range = [0.8 * Math.min(...vazao_ls_bft), 1.1 * Math.max(...vazao_ls_bft)];
            layout.yaxis.range = [0.8 * Math.min(...altura_bft), 1.1 * Math.max(...altura_bft)];
            break;
        case "qtls_eta_t":
            for(let x = 0; x < dados.length; x++){
                data.push({
                    x: dados[x]['vazao_ls_bft'],
                    y: dados[x]['eficiencia_bft'],
                    name: 'vazão/eficiencia',
                    line: {shape: 'spline'},
                })
            }
            layout.title = 'Relação da vazão pela eficiencia';
            layout.xaxis.title = 'Qt [ls]';
            layout.yaxis.title = 'η';
            layout.xaxis.range = [0.8 * Math.min(...vazao_ls_bft), 1.1 * Math.max(...vazao_ls_bft)];
            layout.yaxis.range = [0.8 * Math.min(...eficiencia_bft), 1.1 * Math.max(...eficiencia_bft)];
            break;
    }
    //analiseModelo(['fluxo_valvula', 'altura_valvula', 'fluxo_turbina_m3s', 'altura_turbina']);
    Plotly.newPlot('grafico', data, layout, {responsive: true});
}
function velocidadeVariavel(){
    //velocidades = [2500, 2800, 2900, 3000, 3300, 3400, 3800, 3900, 4300, 4400, 4700, 5000, 5400, 5500];
    velocidades = [4300, 5000, 5500, 2400, 3300]
    for(let x = 0; x<velocidades.length; x++){
        rotacaoBomba(velocidades[x])
        mpe()
    }

}