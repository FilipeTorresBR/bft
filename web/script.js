function applyChanges(affectedsRows){
    for (const [key, value] of Object.entries(affectedsRows)) {
        document.getElementById(`${key}`).value=`${value}`
        console.log(`${key}: ${value}`);
      }
}
function autoCalculate(field) {
    var inputValue = field.value;
    var inputName = field.name;
    eel.auto_calculate(parseFloat(inputValue), inputName)(function(affectedsRows) {
        applyChanges(affectedsRows);});
}
function start(){
    autoCalculate(document.getElementById('y1_nib'))
}