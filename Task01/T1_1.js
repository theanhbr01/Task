function CompareChar($chA, $chB){
    return $chA.toLowerCase().localeCompare($chB.toLowerCase());
}
function ArrangeString($string){
    var arrangedString = $string.split('').sort(CompareChar).join('');
    return arrangedString;
}