const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
let dados = []
function applyChanges(affectedsRows){
    for (const [key, value] of Object.entries(affectedsRows)) {
        document.getElementById(`${key}`).value=`${value.toFixed(3)}`
      }
}
function getDependency(dependency){
    let dependencyObject = {};
    let dependencyValue;
    for(let x = 0; x<dependency.length; x++){
        dependencyValue = document.getElementById(dependency[x]).value
        dependencyObject[dependency[x]] = parseFloat(dependencyValue);
    }
    return dependencyObject;
}


function analiseModelo(dependency){
    dependencies = getDependency(dependency)
    let aviso_span = document.getElementById("aviso");
    let aviso_campo = document.getElementById("aviso-campo");
    if(dependencies['fluxo_valvula'] <= dependencies['fluxo_turbina_m3s']){
        aviso_span.innerHTML = "O dados da BFT são maiores que o da VCP"
        aviso_campo.classList.add("success");
        for(let x = 0; x<dependency.length; x++){document.getElementById(dependency[x]).classList.add("success")}
    }else{
        aviso_span.innerHTML = "O dados da BFT são menores que o da VCP"
        aviso_campo.classList.add("fail");
        for(let x = 0; x<dependency.length; x++){document.getElementById(dependency[x]).classList.add("fail")}
    }
}
function autoCalculate(field, dependency) {
    if (typeof field == "string") {field = document.getElementById('eficiencia_estimada')}
    var inputValue = parseFloat(field.value);
    var inputName = field.name;
    var dependency = getDependency(dependency)

    if (inputName == "eficiencia_estimada"){
        coeficiente_vazao_bomba = ((1.2)/Math.pow(inputValue, 0.55))
        coeficiente_altura_bomba = ((1.2)/Math.pow(inputValue, 1.1))
        fluxo_bomba_m3s = dependency['fluxo_valvula'] / coeficiente_vazao_bomba
        fluxo_bomba_m3h = fluxo_bomba_m3s * 3600
        altura_bomba = dependency['altura_valvula'] / coeficiente_altura_bomba
        rotacao_bomba_rps = dependency['rotacao_bomba_rpm'] / 60
        velocidade_especifica_rps = (rotacao_bomba_rps * Math.pow(fluxo_bomba_m3s, 0.5))/Math.pow((9.81*altura_bomba), 0.75)
        velocidade_especifica_rad = 2*Math.PI*velocidade_especifica_rps
        fluxo_valvula_convertido = 3600 * dependency['fluxo_valvula']
        applyChanges({"coeficiente_vazao_bomba":coeficiente_vazao_bomba, "coeficiente_altura_bomba":coeficiente_altura_bomba, "fluxo_bomba_m3s":fluxo_bomba_m3s, "fluxo_bomba_m3h":fluxo_bomba_m3h, "altura_bomba":altura_bomba, "rotacao_bomba_rps":rotacao_bomba_rps, "velocidade_especifica_rps":velocidade_especifica_rps, "velocidade_especifica_rad":velocidade_especifica_rad, "fluxo_valvula_convertido":fluxo_valvula_convertido})


        field = document.getElementById('eficiencia_real')
        var inputValue = parseFloat(field.value);
        var dependency = getDependency(['fluxo_bomba_m3s', 'altura_bomba', 'rotacao_bomba_rps', 'diametro_bomba'])

        coeficiente_vazao_turbina = ((1.2)/Math.pow(inputValue, 0.55))
        coeficiente_altura_turbina = ((1.2)/Math.pow(inputValue, 1.1))
        fluxo_turbina_m3s = dependency['fluxo_bomba_m3s'] * coeficiente_vazao_turbina
        fluxo_turbina_m3h = fluxo_turbina_m3s * 3600
        altura_turbina = dependency['altura_bomba'] * coeficiente_altura_turbina
        coeficiente_vazao_turbina_mpe = ((fluxo_turbina_m3s) / ((dependency['rotacao_bomba_rps']) * (Math.pow(dependency['diametro_bomba'], 3))))
        coeficiente_altura_turbina_mpe = (9.81*altura_turbina) / Math.pow((dependency['rotacao_bomba_rps'] * dependency['diametro_bomba']), 2)
        velocidade_especifica_turbina_rps = (dependency['rotacao_bomba_rps'] * Math.pow(fluxo_turbina_m3s, 0.5))/Math.pow(9.81*(dependency['altura_bomba']), 0.75)
        velocidade_especifica_turbina_rad = 2*Math.PI*velocidade_especifica_turbina_rps
        applyChanges({"coeficiente_vazao_turbina":coeficiente_vazao_turbina, "coeficiente_altura_turbina":coeficiente_altura_turbina, "fluxo_turbina_m3s":fluxo_turbina_m3s, "fluxo_turbina_m3h":fluxo_turbina_m3h, "altura_turbina":altura_turbina, "coeficiente_vazao_turbina_mpe":coeficiente_vazao_turbina_mpe, "coeficiente_altura_turbina_mpe":coeficiente_altura_turbina_mpe, "velocidade_especifica_turbina_rps":velocidade_especifica_turbina_rps, "velocidade_especifica_turbina_rad":velocidade_especifica_turbina_rad})
    }
    if (inputName == "eficiencia_real"){
        coeficiente_vazao_turbina = ((1.2)/Math.pow(inputValue, 0.55))
        coeficiente_altura_turbina = ((1.2)/Math.pow(inputValue, 1.1))
        fluxo_turbina_m3s = dependency['fluxo_bomba_m3s'] * coeficiente_vazao_turbina
        fluxo_turbina_m3h = fluxo_turbina_m3s * 3600
        altura_turbina = dependency['altura_bomba'] * coeficiente_altura_turbina
        coeficiente_vazao_turbina_mpe = ((fluxo_turbina_m3s) / ((dependency['rotacao_bomba_rps']) * (Math.pow(dependency['diametro_bomba'], 3))))
        coeficiente_altura_turbina_mpe = (9.81*altura_turbina) / Math.pow((dependency['rotacao_bomba_rps'] * dependency['diametro_bomba']), 2)
        velocidade_especifica_turbina_rps = (dependency['rotacao_bomba_rps'] * Math.pow(fluxo_turbina_m3s, 0.5))/Math.pow(9.81*(dependency['altura_bomba']), 0.75)
        velocidade_especifica_turbina_rad = 2*Math.PI*velocidade_especifica_turbina_rps
        applyChanges({"coeficiente_vazao_turbina":coeficiente_vazao_turbina, "coeficiente_altura_turbina":coeficiente_altura_turbina, "fluxo_turbina_m3s":fluxo_turbina_m3s, "fluxo_turbina_m3h":fluxo_turbina_m3h, "altura_turbina":altura_turbina, "coeficiente_vazao_turbina_mpe":coeficiente_vazao_turbina_mpe, "coeficiente_altura_turbina_mpe":coeficiente_altura_turbina_mpe, "velocidade_especifica_turbina_rps":velocidade_especifica_turbina_rps, "velocidade_especifica_turbina_rad":velocidade_especifica_turbina_rad})
    }
}
function generatePlot(dependency){
    dependency = getDependency(dependency)
    fi_t = []
    psi_t = []
    eta_t = []
    qt_ls = []
    h_m = []

    fi_t.push(dependency['coeficiente_vazao_turbina_mpe'])

    for(x=1;x<40;x++){
        fi_t.unshift(fi_t[x - 1] - (0.003 * x))
    }
    
    for(x=40; x<60; x++){
        fi_t.push(fi_t[x - 1] + 0.003)
    }

    for (x = 0; x<fi_t.length; x++){
        psi_t.push(dependency['coeficiente_altura_turbina_mpe']*(0.2394*Math.pow(fi_t[x]/dependency['coeficiente_vazao_turbina_mpe'], 2) + 0.769*(fi_t[x]/dependency['coeficiente_vazao_turbina_mpe'])))
        eta_t.push(((-1.9788*(Math.pow(fi_t[x]/dependency['coeficiente_vazao_turbina_mpe'], 6)))+(9.0636*(Math.pow(fi_t[x]/dependency['coeficiente_vazao_turbina_mpe'], 5)))-(13.148*(Math.pow(fi_t[x]/dependency['coeficiente_vazao_turbina_mpe'], 4)))+(3.8527*(Math.pow(fi_t[x]/dependency['coeficiente_vazao_turbina_mpe'], 3)))+(4.5614*(Math.pow(fi_t[x]/dependency['coeficiente_vazao_turbina_mpe'], 2)))-(1.3769*((fi_t[x]/dependency['coeficiente_vazao_turbina_mpe']))))*(dependency['eficiencia_real']))
        qt_ls.push((((fi_t[x])*((dependency['rotacao_bomba_rps'])*(Math.pow(dependency['diametro_bomba'], 3))))*1000)/3.6)
        h_m.push((psi_t[x]* Math.pow(dependency['rotacao_bomba_rps'] * dependency['diametro_bomba'], 2)) / 9.81)
    }
    if (Object.values(dados).length === 0) {
        dados.push({'fi_t':fi_t, 'psi_t':psi_t, 'eta_t':eta_t, 'qt_ls': qt_ls, 'h_m' : h_m})    
        $("#dados_listar").append("<li>",JSON.stringify(dados[dados.length - 1]),"</li>");
    }else if(JSON.stringify(Object.values(dados[dados.length - 1])) !== JSON.stringify(Object.values({'fi_t':fi_t, 'psi_t':psi_t, 'eta_t':eta_t, 'qt_ls': qt_ls, 'h_m' : h_m}))){
        dados.push({'fi_t':fi_t, 'psi_t':psi_t, 'eta_t':eta_t, 'qt_ls': qt_ls, 'h_m' : h_m})
        $("#dados_listar").append("<li>",dados[dados.length - 1],"</li>");
    }
    
    let data_fi_t_eta_t = {
        x: fi_t,
        y: eta_t,
        name: 'fluxo/eficiencia',
        line: {shape: 'spline'},
    }
 
    let data_qtls_hm = {
        x: qt_ls,
        y: h_m,
        name: 'vazão/altura',
        line: {shape: 'spline'},
    }

    let data_qtls_eta_t = {
        x: qt_ls,
        y: eta_t,
        name: 'vazão/eficiencia',
        line: {shape: 'spline'},
    }

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
            x: 1,
            xanchor: 'right',
            y: 1
          },
        paper_bgcolor: "#daeaf5",
    }
    

    tipo = document.querySelector('input[name="tipo"]:checked').value;

    var layout = layout_placeholder;
    data = []
    switch(tipo){
        case "fi_t_psi_t":
            for(let x = 0; x < dados.length; x++){
                data.push({
                    x: dados[x]['fi_t'],
                    y: dados[x]['psi_t'],
                    name: 'fluxo/pressão',
                    line: {shape: 'spline'},
                })
            }
            layout.title = 'Relação do fluxo pela pressão';
            layout.xaxis.title = 'Φ';
            layout.yaxis.title = 'Ψ';
            layout.xaxis.range = [0.8 * Math.min(...fi_t), 1.1 * Math.max(...fi_t)];
            layout.yaxis.range = [0.8 * Math.min(...psi_t), 1.1 * Math.max(...psi_t)];
            break;
        case "fi_t_eta_t":
            for(let x = 0; x < dados.length; x++){
                data.push({
                    x: dados[x]['fi_t'],
                    y: dados[x]['eta_t'],
                    name: 'fluxo/eficiencia',
                    line: {shape: 'spline'},
                })
            }
            layout.title = 'Relação do fluxo pela eficiencia',
            layout.xaxis.title = 'Φ';
            layout.yaxis.title = 'η';
            layout.xaxis.range = [0.8 * Math.min(...fi_t), 1.1 * Math.max(...fi_t)];
            layout.yaxis.range = [0.8 * Math.min(...eta_t), 1.1 * Math.max(...eta_t)];
            break;
        case "qtls_hm":
            for(let x = 0; x < dados.length; x++){
                data.push({
                    x: dados[x]['qt_ls'],
                    y: dados[x]['h_m'],
                    name: 'vazão/altura',
                    line: {shape: 'spline'},
                })
            }
            layout.title = 'Relação da vazão pela altura',
            layout.xaxis.title = 'Qt [ls]';
            layout.yaxis.title = 'H [m]';
            layout.xaxis.range = [0.8 * Math.min(...qt_ls), 1.1 * Math.max(...qt_ls)];
            layout.yaxis.range = [0.8 * Math.min(...h_m), 1.1 * Math.max(...h_m)];
            break;
        case "qtls_eta_t":
            for(let x = 0; x < dados.length; x++){
                data.push({
                    x: dados[x]['qt_ls'],
                    y: dados[x]['eta_t'],
                    name: 'vazão/eficiencia',
                    line: {shape: 'spline'},
                })
            }
            layout.title = 'Relação da vazão pela eficiencia';
            layout.xaxis.title = 'Qt [ls]';
            layout.yaxis.title = 'η';
            layout.xaxis.range = [0.8 * Math.min(...qt_ls), 1.1 * Math.max(...qt_ls)];
            layout.yaxis.range = [0.8 * Math.min(...eta_t), 1.1 * Math.max(...eta_t)];
            break;
    }
    analiseModelo(['fluxo_valvula', 'altura_valvula', 'fluxo_turbina_m3s', 'altura_turbina']);
    Plotly.newPlot('grafico', data, layout, {responsive: true});
}
function start(){
    autoCalculate(document.getElementById('eficiencia_estimada'), ['fluxo_valvula', 'altura_valvula', 'rotacao_bomba_rpm'])
    setTimeout(function(){
        autoCalculate(document.getElementById('eficiencia_real'), ['fluxo_bomba_m3s', 'altura_bomba', 'rotacao_bomba_rps', 'diametro_bomba'])
    }, 50);
}
