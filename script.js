function applyChanges(affectedsRows){
    for (const [key, value] of Object.entries(affectedsRows)) {
        document.getElementById(`${key}`).value=`${value}`
      }
}
function getDependency(dependency){
    let dependencyObject = {}
    let dependencyName;
    let dependencyValue
    for(let x = 0; x<dependency.length; x++){
        dependencyName = document.getElementById(dependency[x]).name
        dependencyValue = document.getElementById(dependency[x]).value
    
        dependencyObject[dependency[x]] = parseFloat(dependencyValue);
    }
    return dependencyObject;
}
function autoCalculate(field, dependency) {
    var inputValue = parseFloat(field.value);
    var inputName = field.name;
    var fieldDependency = getDependency(dependency)
    console.log(fieldDependency)
    eel.auto_calculate(parseFloat(inputValue), inputName, fieldDependency)(function(affectedsRows) {
        applyChanges(affectedsRows);});
}
async function generatePlot(dependency){
    var plotDependency = getDependency(dependency)
    const imagemBase64 = await eel.generate_plot(plotDependency)()
    document.getElementById('grafico').innerHTML = `<img src="data:image/png;base64,${imagemBase64}" />`;
}
function start(){
    autoCalculate(document.getElementById('y1_nib'), ['qti', 'hti', 'n_rpm'])
    setTimeout(function(){
        autoCalculate(document.getElementById('y2_nb'), ['qb_m3s', 'hb', 'n_rps', 'd'])
    }, 50);
}
