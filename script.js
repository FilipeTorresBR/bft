function applyChanges(affectedsRows){
    for (const [key, value] of Object.entries(affectedsRows)) {
        document.getElementById(`${key}`).value=`${value.toFixed(3)}`
      }
}
function getDependency(dependency){
    let dependencyObject = {};
    let dependencyName;
    let dependencyValue;
    for(let x = 0; x<dependency.length; x++){
        /*dependencyName = document.getElementById(dependency[x]).name*/
        dependencyValue = document.getElementById(dependency[x]).value
        dependencyObject[dependency[x]] = parseFloat(dependencyValue);
    }
    return dependencyObject;
}
function analiseModelo(dependency){
    dependencies = getDependency(dependency)
    let aviso_span = document.getElementById("aviso");
    let aviso_campo = document.getElementById("aviso-campo");
    if(dependencies['qb_m3s'] < dependencies['qt_m3s']){
        aviso_span.innerHTML = "O valor da turbina é maior que o da bomba"
        aviso_campo.classList.add("success");
        for(let x = 0; x<dependency.length; x++){document.getElementById(dependency[x]).classList.add("success")}
    }else{
        aviso_span.innerHTML = "O valor da turbina é menor que o da bomba"
        aviso_campo.classList.add("fail");
        for(let x = 0; x<dependency.length; x++){document.getElementById(dependency[x]).classList.add("fail")}

    }
}
function autoCalculate(field, dependency) {
    if (typeof field == "string") {field = document.getElementById('y1_nib')}
    var inputValue = parseFloat(field.value);
    var inputName = field.name;
    var dependency = getDependency(dependency)

    if (inputName == "y1_nib"){
        y1_q = ((1.2)/Math.pow(inputValue, 0.55))
        y1_h = ((1.2)/Math.pow(inputValue, 1.1))
        qb_m3s = dependency['qti'] / y1_q
        qb_m3h = qb_m3s * 3600
        hb = dependency['hti'] / y1_h
        n_rps = dependency['n_rpm'] / 60
        y1_ns_rps = (n_rps * Math.pow(qb_m3s, 0.5))/Math.pow((9.81*hb), 0.75)
        y1_ns_rad = 2*Math.PI*y1_ns_rps
        qti_convertido = 3600 * dependency['qti']
        applyChanges({"y1_q":y1_q, "y1_h":y1_h, "qb_m3s":qb_m3s, "qb_m3h":qb_m3h, "hb":hb, "n_rps":n_rps, "y1_ns_rps":y1_ns_rps, "y1_ns_rad":y1_ns_rad, "qti_convertido":qti_convertido})


        field = document.getElementById('y2_nb')
        var inputValue = parseFloat(field.value);
        var dependency = getDependency(['qb_m3s', 'hb', 'n_rps', 'd'])

        y2_q = ((1.2)/Math.pow(inputValue, 0.55))
        y2_h = ((1.2)/Math.pow(inputValue, 1.1))
        qt_m3s = dependency['qb_m3s'] * y2_q
        qt_m3h = qt_m3s * 3600
        ht_m = dependency['hb'] * y2_h
        fi_bept = ((qt_m3s) / ((dependency['n_rps']) * (Math.pow(dependency['d'], 3))))
        psi_bept = (9.81*ht_m) / Math.pow((dependency['n_rps'] * dependency['d']), 2)
        y2_ns_rps = (dependency['n_rps'] * Math.pow(qt_m3s, 0.5))/Math.pow(9.81*(dependency['hb']), 0.75)
        y2_ns_rad = 2*Math.PI*y2_ns_rps
        applyChanges({"y2_q":y2_q, "y2_h":y2_h, "qt_m3s":qt_m3s, "qt_m3h":qt_m3h, "ht_m":ht_m, "fi_bept":fi_bept, "psi_bept":psi_bept, "y2_ns_rps":y2_ns_rps, "y2_ns_rad":y2_ns_rad})
    }
    if (inputName == "y2_nb"){
        y2_q = ((1.2)/Math.pow(inputValue, 0.55))
        y2_h = ((1.2)/Math.pow(inputValue, 1.1))
        qt_m3s = dependency['qb_m3s'] * y2_q
        qt_m3h = qt_m3s * 3600
        ht_m = dependency['hb'] * y2_h
        fi_bept = ((qt_m3s) / ((dependency['n_rps']) * (Math.pow(dependency['d'], 3))))
        psi_bept = (9.81*ht_m) / Math.pow((dependency['n_rps'] * dependency['d']), 2)
        y2_ns_rps = (dependency['n_rps'] * Math.pow(qt_m3s, 0.5))/Math.pow(9.81*(dependency['hb']), 0.75)
        y2_ns_rad = 2*Math.PI*y2_ns_rps
        applyChanges({"y2_q":y2_q, "y2_h":y2_h, "qt_m3s":qt_m3s, "qt_m3h":qt_m3h, "ht_m":ht_m, "fi_bept":fi_bept, "psi_bept":psi_bept, "y2_ns_rps":y2_ns_rps, "y2_ns_rad":y2_ns_rad})
    }
}
function generatePlot(dependency){
    dependency = getDependency(dependency)
    fi_t = []
    psi_t = []
    eta_t = []
    qt_ls = []
    h_m = []
    fi_t.push(dependency['fi_bept'])

    for(x=1;x<40;x++){
        fi_t.unshift(fi_t[x - 1] - (0.003 * x))
    }
    
    for(x=40; x<60; x++){
        fi_t.push(fi_t[x - 1] + 0.003)
    }

    for (x = 0; x<fi_t.length; x++){
        psi_t.push(dependency['psi_bept']*(0.2394*Math.pow(fi_t[x]/dependency['fi_bept'], 2) + 0.769*(fi_t[x]/dependency['fi_bept'])))
        eta_t.push(((-1.9788*(Math.pow(fi_t[x]/dependency['fi_bept'], 6)))+(9.0636*(Math.pow(fi_t[x]/dependency['fi_bept'], 5)))-(13.148*(Math.pow(fi_t[x]/dependency['fi_bept'], 4)))+(3.8527*(Math.pow(fi_t[x]/dependency['fi_bept'], 3)))+(4.5614*(Math.pow(fi_t[x]/dependency['fi_bept'], 2)))-(1.3769*((fi_t[x]/dependency['fi_bept']))))*(dependency['y2_nb']))
        qt_ls.push((((fi_t[x])*((dependency['n_rps'])*(Math.pow(dependency['d'], 3))))*1000)/3.6)
        h_m.push((psi_t[x]* Math.pow(dependency['n_rps'] * dependency['d'], 2)) / 9.81)
    }
    
    let data_fi_t_psi_t = {
        x: fi_t,
        y: psi_t,
        name: 'fluxo/pressão',
        line: {shape: 'spline'},
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
    switch(tipo){
        case "fi_t_psi_t":
            data = [data_fi_t_psi_t];
            layout.title = 'Relação do fluxo pela pressão';
            layout.xaxis.title = 'Φ';
            layout.yaxis.title = 'Ψ';
            layout.xaxis.range = [0.8 * Math.min(...fi_t), 1.1 * Math.max(...fi_t)];
            layout.yaxis.range = [0.8 * Math.min(...psi_t), 1.1 * Math.max(...psi_t)];
            break;
        case "fi_t_eta_t":
            data = [data_fi_t_eta_t]
            layout.title = 'Relação do fluxo pela eficiencia',
            layout.xaxis.title = 'Φ';
            layout.yaxis.title = 'η';
            layout.xaxis.range = [0.8 * Math.min(...fi_t), 1.1 * Math.max(...fi_t)];
            layout.yaxis.range = [0.8 * Math.min(...eta_t), 1.1 * Math.max(...eta_t)];
            break;
        case "qtls_hm":
            data = [data_qtls_hm]
            layout.title = 'Relação da vazão pela altura',
            layout.xaxis.title = 'Qt [ls]';
            layout.yaxis.title = 'H [m]';
            layout.xaxis.range = [0.8 * Math.min(...qt_ls), 1.1 * Math.max(...qt_ls)];
            layout.yaxis.range = [0.8 * Math.min(...h_m), 1.1 * Math.max(...h_m)];
            break;
        case "qtls_eta_t":
            data = [data_qtls_eta_t];
            layout.title = 'Relação da vazão pela eficiencia';
            layout.xaxis.title = 'Qt [ls]';
            layout.yaxis.title = 'η';
            layout.xaxis.range = [0.8 * Math.min(...qt_ls), 1.1 * Math.max(...qt_ls)];
            layout.yaxis.range = [0.8 * Math.min(...eta_t), 1.1 * Math.max(...eta_t)];
            break;
    }
    analiseModelo(['qb_m3s', 'qb_m3h', 'qt_m3s', 'qt_m3h']);
    Plotly.newPlot('grafico', data, layout, {responsive: true});
}
function start(){
    autoCalculate(document.getElementById('y1_nib'), ['qti', 'hti', 'n_rpm'])
    setTimeout(function(){
        autoCalculate(document.getElementById('y2_nb'), ['qb_m3s', 'hb', 'n_rps', 'd'])
    }, 50);
}
