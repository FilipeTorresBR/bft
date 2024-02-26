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
        console.log(dependency[x], dependencyValue[x])
        dependencyObject[dependency[x]] = parseFloat(dependencyValue);
    }
    console.log('------')
    return dependencyObject;
}
function autoCalculate(field, dependency) {
    if (typeof field == "string") {field = document.getElementById('y1_nib')}
    var inputValue = parseFloat(field.value);
    var inputName = field.name;
    var fieldDependency = getDependency(dependency)

    if (inputName == "y1_nib"){
        y1_q = ((1.2)/Math.pow(inputValue, 0.55))
        y1_h = ((1.2)/Math.pow(inputValue, 1.1))
        qb_m3s = fieldDependency['qti'] / y1_q
        qb_m3h = qb_m3s * 3600
        hb = fieldDependency['hti'] / y1_h
        n_rps = fieldDependency['n_rpm'] / 60
        y1_ns_rps = (n_rps * Math.pow(qb_m3s, 0.5))/Math.pow((9.81*hb), 0.75)
        y1_ns_rad = 2*Math.PI*y1_ns_rps
        applyChanges({"y1_q":y1_q, "y1_h":y1_h, "qb_m3s":qb_m3s, "qb_m3h":qb_m3h, "hb":hb, "n_rps":n_rps, "y1_ns_rps":y1_ns_rps, "y1_ns_rad":y1_ns_rad})


        field = document.getElementById('y2_nb')
        var inputValue = parseFloat(field.value);
        var fieldDependency = getDependency(['qb_m3s', 'hb', 'n_rps', 'd'])

        y2_q = ((1.2)/Math.pow(inputValue, 0.55))
        y2_h = ((1.2)/Math.pow(inputValue, 1.1))
        qt_m3s = fieldDependency['qb_m3s'] * y2_q
        qt_m3h = qt_m3s * 3600
        ht_m = fieldDependency['hb'] * y2_h
        fi_bept = ((qt_m3s) / ((fieldDependency['n_rps']) * (Math.pow(fieldDependency['d'], 3))))
        psi_bept = (9.81*ht_m) / Math.pow((fieldDependency['n_rps'] * fieldDependency['d']), 2)
        y2_ns_rps = (fieldDependency['n_rps'] * Math.pow(qt_m3s, 0.5))/Math.pow(9.81*(fieldDependency['hb']), 0.75)
        y2_ns_rad = 2*Math.PI*y2_ns_rps
        applyChanges({"y2_q":y2_q, "y2_h":y2_h, "qt_m3s":qt_m3s, "qt_m3h":qt_m3h, "ht_m":ht_m, "fi_bept":fi_bept, "psi_bept":psi_bept, "y2_ns_rps":y2_ns_rps, "y2_ns_rad":y2_ns_rad})
    }
    if (inputName == "y2_nb"){
        y2_q = ((1.2)/Math.pow(inputValue, 0.55))
        y2_h = ((1.2)/Math.pow(inputValue, 1.1))
        qt_m3s = fieldDependency['qb_m3s'] * y2_q
        qt_m3h = qt_m3s * 3600
        ht_m = fieldDependency['hb'] * y2_h
        fi_bept = ((qt_m3s) / ((fieldDependency['n_rps']) * (Math.pow(fieldDependency['d'], 3))))
        psi_bept = (9.81*ht_m) / Math.pow((fieldDependency['n_rps'] * fieldDependency['d']), 2)
        y2_ns_rps = (fieldDependency['n_rps'] * Math.pow(qt_m3s, 0.5))/Math.pow(9.81*(fieldDependency['hb']), 0.75)
        y2_ns_rad = 2*Math.PI*y2_ns_rps
        applyChanges({"y2_q":y2_q, "y2_h":y2_h, "qt_m3s":qt_m3s, "qt_m3h":qt_m3h, "ht_m":ht_m, "fi_bept":fi_bept, "psi_bept":psi_bept, "y2_ns_rps":y2_ns_rps, "y2_ns_rad":y2_ns_rad})
    }
}
function generatePlot(dependency){
    console.log(dependency)
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
    
    let fi_t_psi_t = {
        x: fi_t,
        y: psi_t,
        name: 'fluxo/pressão',
        line: {shape: 'spline'},
    }
    let eixos_fi_t_psi_t = {
        title: 'Relação do fluxo pela pressão',
        xaxis: {
          title: 'Φ'
        },
        yaxis: {
          title: 'Ψ'
        }
    }

    let fi_t_eta_t = {
        x: fi_t,
        y: eta_t,
        name: 'fluxo/eficiencia',
        line: {shape: 'spline'},
    }
    let eixos_fi_t_eta_t = {
        title: 'Relação do fluxo pela eficiencia',
        xaxis: {
          title: 'Φ'
        },
        yaxis: {
          title: 'η'
        }
    }

    let qtls_hm = {
        x: qt_ls,
        y: h_m,
        name: 'vazão/altura',
        line: {shape: 'spline'},
    }
    let eixos_qtls_hm = {
        title: 'Relação da vazão pela altura',
        xaxis: {
          title: 'Qt [ls]',
          range: [0, qt_ls.max]
        },
        yaxis: {
          title: 'H [m]',
        }
    }

    let qtls_eta_t = {
        x: qt_ls,
        y: eta_t,
        name: 'vazão/eficiencia',
        line: {shape: 'spline'},
    }
    let eixos_qtls_eta_t = {
        title: 'Relação da vazão pela eficiencia',
        xaxis: {
          title: 'Qt [ls]'
        },
        yaxis: {
          title: 'η'
        }
    }
    tipo = document.querySelector('input[name="tipo"]:checked').value;

    switch(tipo){
        case "fi_t_psi_t":
            data = [fi_t_psi_t]
            layout = eixos_fi_t_psi_t 
            break
        case "fi_t_eta_t":
            data = [fi_t_eta_t]
            layout = eixos_fi_t_eta_t 
            break
        case "qtls_hm":
            data = [qtls_hm]
            layout = eixos_qtls_hm
            break
        case "qtls_eta_t":
            data = [qtls_eta_t]
            layout = eixos_qtls_eta_t
            break
    }

    Plotly.newPlot('grafico', data, layout)
}
function start(){
    autoCalculate(document.getElementById('y1_nib'), ['qti', 'hti', 'n_rpm'])
    setTimeout(function(){
        autoCalculate(document.getElementById('y2_nb'), ['qb_m3s', 'hb', 'n_rps', 'd'])
    }, 50);
}
